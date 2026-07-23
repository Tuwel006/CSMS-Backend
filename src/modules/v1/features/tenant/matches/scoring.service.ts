/**
 * Scoring service — write-side operations that mutate innings state
 * during a live match. Each method runs in a DB transaction and
 * publishes a live-score update via SSE after the commit lands.
 *
 * Concerns:
 *   - recordBall:         persist a single ball + update batsman/bowler/innings
 *   - setBatsman:         add a new batsman to the crease (or mark retired)
 *   - setBowler:          assign the current bowler
 *   - switchToNextInnings: open the next innings and notify subscribers
 */

import { AppDataSource } from '../../../../../config/db';
import { Match } from '../../../shared/entities/Match';
import { MatchInnings } from '../../../shared/entities/MatchInnings';
import { InningsBatting } from '../../../shared/entities/InningsBatting';
import { InningsBowling } from '../../../shared/entities/InningsBowling';
import { BallByBall } from '../../../shared/entities/BallByBall';
import { MatchPlayer } from '../../../shared/entities/MatchPlayer';
import { RecordBallDto, SwitchInningsDto } from './dtos/match.dto';
import { HTTP_STATUS } from '../../../../../constants/status-codes';
import { getLiveScorePublisher } from '../../../../../realtime';
import { postCommit } from '../../../../../realtime/application/shared/post-commit.hook';
import { runInTransaction } from '../../../../../utils/transaction';

export class ScoringService {
  static async recordBall(matchId: string, ballData: RecordBallDto, tenant_id: number) {
    const apiStart = Date.now();

    const result = await runInTransaction(async (manager) => {
      const inningsRepository = manager.getRepository(MatchInnings);
      const battingRepository = manager.getRepository(InningsBatting);
      const bowlingRepository = manager.getRepository(InningsBowling);
      const matchRepo = manager.getRepository(Match);

      const {
        ball_type, runs = 0, is_wicket = false,
        is_boundary = false, by_runs = 0, wicket
      } = ballData;

      const match = await matchRepo.findOne({
        where: { id: matchId, tenant_id },
        select: ["id", "current_innings_id", "playing_count", "format", "no_of_innings", "target_score"]
      });

      if (match?.current_innings_id === null || match?.current_innings_id === undefined) {
        throw new Error("No active innings");
      }

      const innings_id = match.current_innings_id;

      if (!innings_id) {
        throw new Error('innings_id is required');
      }

      // Cricket logic calculations
      const isLegalBall = !['WIDE', 'NO_BALL'].includes(ball_type);
      const isExtra = ['WIDE', 'NO_BALL'].includes(ball_type);
      const extraRuns = isExtra ? 1 : 0;
      const runsBetweenWickets = runs > 0 ? runs : by_runs;
      const runsToAdd = runsBetweenWickets + extraRuns;
      const ballsToAdd = isLegalBall ? 1 : 0;

      // Fetch innings with pessimistic lock
      const innings = await inningsRepository.findOne({
        where: { id: innings_id, tenant_id },
        lock: { mode: 'pessimistic_write' }
      });

      if (!innings) throw new Error('Innings not found');

      const strikerId = innings.striker_id;
      const nonStrikerId = innings.non_striker_id;
      const bowlerId = innings.current_bowler_id;
      if (!strikerId || !nonStrikerId || !bowlerId) {
        throw new Error('Striker, Non-Striker or Bowler not set for the innings');
      }

      if (innings.previous_bowler_id === bowlerId) {
        throw new Error('Same bowler cannot bowl consecutive overs');
      }

      // Calculate final values (innings becomes stale after updates)
      const totalRuns = innings.runs + runsToAdd;
      const totalWickets = innings.wickets + (is_wicket ? 1 : 0);
      const totalBalls = innings.balls + ballsToAdd;
      const totalExtras = innings.extras + by_runs + extraRuns;
      const nextBallCount = innings.balls + ballsToAdd;
      const isOverComplete = nextBallCount % 6 === 0 && isLegalBall;
      const overNumber = innings.current_over + (isOverComplete ? 1 : 0);

      // Ball number logic: legal balls increment, extras don't
      const ballNumber = isLegalBall
        ? (innings.balls % 6) + 1
        : (innings.balls % 6) || 6;

      // Strike rotation: odd runs XOR end of over
      const shouldFlipStrike = (runsBetweenWickets % 2 === 1) !== isOverComplete;

      // 2. Update batsman (atomic SQL)
      await battingRepository.update(
        { innings_id, player_id: strikerId, tenant_id },
        {
          runs: () => `runs + ${runs}`,
          balls: () => `balls + ${ballsToAdd}`,
          ...(is_boundary && runs === 4 && { fours: () => 'fours + 1' }),
          ...(is_boundary && runs === 6 && { sixes: () => 'sixes + 1' }),
          ...(is_wicket && wicket?.out_batsman_id === strikerId && {
            is_out: true,
            bowler_id: bowlerId,
            ...(wicket?.wicket_type && { wicket_type: wicket.wicket_type }),
            ...(wicket?.fielder_id && { fielder_id: wicket.fielder_id })
          })
        }
      );

      if (is_wicket && wicket && wicket?.out_batsman_id !== strikerId) {
        await battingRepository.update(
          { innings_id, player_id: nonStrikerId, tenant_id },
          {
            is_out: true,
            ...(wicket?.wicket_type && { wicket_type: wicket.wicket_type }),
            ...(wicket?.bowler_id && { bowler_id: wicket.bowler_id }),
            ...(wicket?.fielder_id && { fielder_id: wicket.fielder_id })
          }
        );
      }

      // 3. Update bowler (atomic SQL)
      await bowlingRepository.update(
        { innings_id, player_id: bowlerId, tenant_id },
        {
          runs: () => `runs + ${runsToAdd}`,
          ...(is_wicket && { wickets: () => `wickets + 1` }),
          ...(isLegalBall && { balls: () => `balls + 1` })
        }
      );

      // 5. Handle over completion
      if (isOverComplete) {
        await bowlingRepository.update(
          { innings_id, tenant_id },
          { is_current_bowler: false }
        );
      }

      // 6. Create ball record
      const insertResult = await manager
        .createQueryBuilder()
        .insert()
        .into(BallByBall)
        .values({
          match_id: matchId,
          innings_id: innings.id,
          over_number: innings.current_over,
          ball_number: ballNumber,
          ball_type,
          runs,
          batsman_id: strikerId,
          bowler_id: bowlerId,
          is_boundary,
          is_wicket,
          wicket_type: wicket?.wicket_type,
          tenant_id
        })
        .returning("*")   // returns the inserted row
        .execute();

      const insertedBall = insertResult.raw[0];

      let innings_over = false;
      if (totalWickets === (match.playing_count || 11) - 1) {
        innings_over = true;
      }
      if (totalBalls === Number(match.format) * 6) {
        innings_over = true;
      }
      if (totalRuns >= match.target_score && innings.innings_number === match.no_of_innings) {
        innings_over = true;
      }

      // 1. Update innings (atomic SQL)
      await inningsRepository.update(
        { id: innings_id, tenant_id },
        {
          ...(runsToAdd > 0 && { runs: () => `runs + ${runsToAdd}` }),
          ...(is_wicket && { wickets: () => `wickets + ${is_wicket ? 1 : 0}` }),
          ...(ballsToAdd > 0 && { balls: () => `balls + ${ballsToAdd}` }),
          ...(by_runs + extraRuns > 0 && { extras: () => `extras + ${by_runs + extraRuns}` }),
          ...(isOverComplete && {
            current_over: () => 'current_over + 1',
            previous_bowler_id: bowlerId,
            current_bowler_id: null
          }),
          ...(shouldFlipStrike && { striker_id: nonStrikerId, non_striker_id: strikerId }),
          ...(is_wicket && wicket?.out_batsman_id === strikerId && !shouldFlipStrike && { striker_id: null }),
          ...(is_wicket && wicket?.out_batsman_id === nonStrikerId && !shouldFlipStrike && { non_striker_id: null }),
          ...(is_wicket && wicket?.out_batsman_id === strikerId && shouldFlipStrike && { non_striker_id: null }),
          ...(is_wicket && wicket?.out_batsman_id === nonStrikerId && shouldFlipStrike && { striker_id: null }),
          ...(innings_over && {
            is_completed: true,
          })
        }
      );
      let isMatchCompleted = false;

      if (innings_over && match.no_of_innings === innings.innings_number) {
        if (totalRuns >= match?.target_score) {
          await matchRepo.update(
            { id: match.id, tenant_id },
            {
              winner_team_id: innings.batting_team_id,
              is_completed: true,
              status: 'COMPLETED'
            }
          );
          isMatchCompleted = true;
        }
        else {
          await matchRepo.update(
            { id: match.id, tenant_id },
            {
              winner_team_id: innings.bowling_team_id,
              is_completed: true,
              status: 'COMPLETED'
            }
          );
          isMatchCompleted = true;
        }
      }

      return {
        innings_id,
        innings_over,
        isMatchCompleted,
        totalRuns,
        totalWickets,
        totalBalls,
        totalExtras,
        runsToAdd,
        runs,
        by_runs,
        extraRuns,
        isLegalBall,
        is_wicket,
        isOverComplete,
        shouldFlipStrike,
        overNumber,
        ballNumber,
        bowlerId,
        insertedBall,
        currentOverBeforeUpdate: innings.current_over
      };
    });

    // Fire SSE after the transaction commits
    postCommit(() => getLiveScorePublisher().publishScore(matchId, result.innings_id));

    console.log("Total API time:", Date.now() - apiStart);

    // Return UI-friendly response with computed final values
    return {
      innings: result.innings_id,
      is_innings_over: result.innings_over || result.isMatchCompleted,
      totalRuns: result.totalRuns,
      totalWickets: result.totalWickets,
      totalBalls: result.totalBalls,
      totalExtras: result.totalExtras,
      runsAdded: result.runsToAdd,
      batsmanRuns: result.runs,
      bowlerRuns: result.runsToAdd,
      byRuns: result.by_runs,
      extraRuns: result.extraRuns,
      isLegalBall: result.isLegalBall,
      isWicket: result.is_wicket,
      isOverComplete: result.isOverComplete,
      shouldFlipStrike: result.shouldFlipStrike,
      overNumber: result.overNumber,
      ballNumber: result.ballNumber,
      currentOver: {
        o: result.isOverComplete ? result.currentOverBeforeUpdate + 1 : result.currentOverBeforeUpdate,
        isOverComplete: result.isOverComplete,
        bowlerId: result.bowlerId,
        isInLegalBall: result.isLegalBall ? false : true,
        ball: {
          b: result.insertedBall.ball_number,
          t: result.insertedBall.ball_type,
          r: result.insertedBall.is_wicket ? 'W' : result.insertedBall.runs
        }
      },
      timestamp: new Date().toISOString()
    };
  }

  static async setBatsman(matchId: string, batsmanData: any, tenant_id: number) {
    const matchRepository = AppDataSource.getRepository(Match);
    const inningsRepository = AppDataSource.getRepository(MatchInnings);
    const battingRepository = AppDataSource.getRepository(InningsBatting);

    const match = await matchRepository.findOne({
      where: { id: matchId, tenant_id }
    });
    if (!match) {
      throw { status: HTTP_STATUS.NOT_FOUND, message: 'Match not found' };
    }

    const { player_id, is_striker = true, ret_hurt } = batsmanData;

    if (!match.current_innings_id || match.current_innings_id === null) {
      throw { status: HTTP_STATUS.BAD_REQUEST, message: 'No active innings for this match' };
    }

    // If setting ret_hurt, update existing batsman
    if (ret_hurt) {
      const existingBatsman = await battingRepository.findOne({
        where: { innings_id: match.current_innings_id, player_id, tenant_id }
      });

      if (existingBatsman) {
        existingBatsman.ret_hurt = true;
        existingBatsman.is_striker = false;
        await battingRepository.save(existingBatsman);
        return { success: true, message: 'Batsman marked as retired hurt' };
      }
    }

    const innings = await inningsRepository.findOne({
      where: { id: match.current_innings_id, tenant_id }
    });

    if (!innings) {
      throw { status: HTTP_STATUS.NOT_FOUND, message: 'Innings not found' };
    }

    if (innings.striker_id && innings.non_striker_id) {
      throw { status: HTTP_STATUS.BAD_REQUEST, message: 'Two batsmen are already at the crease.' };
    }

    const order = innings.wickets === 0 ? (!innings.striker_id ? 1 : 2) : innings.wickets + 2;
    // Add new batsman
    const batsman = battingRepository.create({
      innings_id: match.current_innings_id,
      player_id,
      is_striker: innings.striker_id ? false : true,
      ret_hurt: false,
      tenant_id,
      order: order,
    });

    await battingRepository.save(batsman);
    await inningsRepository.update(
      { id: match.current_innings_id, tenant_id },
      innings.striker_id ? { non_striker_id: batsman.player_id } : { striker_id: batsman.player_id }
    );

    postCommit(() => getLiveScorePublisher().publishScore(matchId, match.current_innings_id!));

    return { success: true, message: 'Batsman set successfully' };
  }

  static async setBowler(matchId: string, bowlerData: any, tenant_id: number) {
    const matchRepository = AppDataSource.getRepository(Match);
    const match = await matchRepository.findOne({
      where: { id: matchId, tenant_id }
    });
    const bowlingRepository = AppDataSource.getRepository(InningsBowling);

    if (!match) {
      throw { status: HTTP_STATUS.NOT_FOUND, message: 'Match not found' };
    }

    const { player_id } = bowlerData;

    if (!match.current_innings_id) {
      throw { status: HTTP_STATUS.BAD_REQUEST, message: 'No active innings for this match' };
    }

    // update match innings current bowler
    const inningsRepository = AppDataSource.getRepository(MatchInnings);
    const innings = await inningsRepository.findOne({
      where: { id: match.current_innings_id, tenant_id }
    });

    if (!innings) {
      throw { status: HTTP_STATUS.NOT_FOUND, message: 'Innings not found' };
    }

    if (innings.previous_bowler_id === player_id) {
      throw { status: HTTP_STATUS.BAD_REQUEST, message: 'Same bowler cannot bowl consecutive overs' };
    }

    // Set all bowlers as inactive first
    await bowlingRepository.update(
      { innings_id: match.current_innings_id, tenant_id },
      { is_current_bowler: false }
    );

    await inningsRepository.update(
      { id: match.current_innings_id, tenant_id },
      {
        current_bowler_id: player_id,
        ...(innings.current_bowler_id && { previous_bowler_id: innings.current_bowler_id })
      }
    );

    // Check if bowler already exists
    let bowler = await bowlingRepository.findOne({
      where: { innings_id: match.current_innings_id, player_id, tenant_id }
    });

    if (!bowler) {
      if (!match.current_innings_id) {
        throw { status: HTTP_STATUS.BAD_REQUEST, message: 'No active innings for this match' };
      }

      // Create new bowler entry
      bowler = bowlingRepository.create({
        innings_id: match.current_innings_id,
        player_id,
        tenant_id
      });
    }

    bowler.is_current_bowler = true;
    await bowlingRepository.save(bowler);

    postCommit(() => getLiveScorePublisher().publishScore(matchId, match.current_innings_id!));

    return { success: true, message: 'Bowler set successfully' };
  }

  static async switchToNextInnings(matchId: string, data: SwitchInningsDto, tenant_id: number) {
    return runInTransaction(async (manager) => {
      const matchRepo = manager.getRepository(Match);
      const inningsRepo = manager.getRepository(MatchInnings);

      const match = await matchRepo.findOne({
        where: { id: matchId, tenant_id },
      });

      if (!match) throw new Error('Match not found');

      // Find the last innings
      const lastInnings = await inningsRepo.findOne({
        where: { match_id: matchId, tenant_id },
        order: { innings_number: 'DESC' }
      });

      if (!lastInnings) throw new Error('No previous innings found to transition from');

      const isFollowOn = data.isFollowOn || false;
      let nextBattingTeamId: number;
      let nextBowlingTeamId: number;

      if (isFollowOn && match.no_of_innings >= 4) {
        nextBattingTeamId = lastInnings.batting_team_id;
        nextBowlingTeamId = lastInnings.bowling_team_id;
      } else {
        nextBattingTeamId = lastInnings.bowling_team_id;
        nextBowlingTeamId = lastInnings.batting_team_id;
      }

      // Create new innings row
      const nextInnings = inningsRepo.create({
        match_id: matchId,
        innings_number: lastInnings.innings_number + 1,
        batting_team_id: nextBattingTeamId,
        bowling_team_id: nextBowlingTeamId,
        runs: 0,
        wickets: 0,
        balls: 0,
        overs: 0,
        current_over: 1,
        extras: 0,
        is_completed: false,
        tenant_id: tenant_id
      });

      await inningsRepo.save(nextInnings);

      // Update match with new current innings
      await matchRepo.update(
        { id: matchId, tenant_id },
        { current_innings_id: nextInnings.id }
      );

      return {
        success: true,
        message: `Innings ${nextInnings.innings_number} started successfully`,
        data: {
          inningsId: nextInnings.id,
          inningsNumber: nextInnings.innings_number,
          battingTeamId: nextBattingTeamId,
          bowlingTeamId: nextBowlingTeamId
        }
      };
    }).then((result) => {
      // Notify SSE clients about the new innings (was previously missing).
      postCommit(() =>
        getLiveScorePublisher().publishScore(matchId, (result as any).data.inningsId)
      );
      return result;
    });
  }
}
