/**
 * Scoreboard service — read-only operations that build the live-score
 * payload (meta, team scores, batting, bowling, current over).
 *
 * These endpoints are hit by the public scoreboard and the SSE replay
 * path, so the methods favour batched reads and in-memory grouping.
 */

import { In } from 'typeorm';
import { AppDataSource } from '../../../../../config/db';
import { Match } from '../../../shared/entities/Match';
import { MatchInnings } from '../../../shared/entities/MatchInnings';
import { InningsBatting } from '../../../shared/entities/InningsBatting';
import { InningsBowling } from '../../../shared/entities/InningsBowling';
import { BallByBall } from '../../../shared/entities/BallByBall';
import { MatchPlayer } from '../../../shared/entities/MatchPlayer';
import { HTTP_STATUS } from '../../../../../constants/status-codes';

export class ScoreboardService {
  static async getMatchScore(matchId: string, tenant_id: number) {
    const matchRepo = AppDataSource.getRepository(Match);
    const inningsRepo = AppDataSource.getRepository(MatchInnings);
    const battingRepo = AppDataSource.getRepository(InningsBatting);
    const bowlingRepo = AppDataSource.getRepository(InningsBowling);
    const ballRepo = AppDataSource.getRepository(BallByBall);

    // Fetch match + innings in parallel
    const [match, inningsList] = await Promise.all([
      matchRepo.findOne({
        where: { id: matchId, tenant_id },
        relations: ['teamA', 'teamB']
      }),
      inningsRepo.find({
        where: { match_id: matchId, tenant_id },
        relations: ['battingTeam', 'bowlingTeam'],
        order: { innings_number: 'ASC' }
      })
    ]);

    if (!match) {
      throw { status: 404, message: 'Match not found' };
    }

    const inningsData = await Promise.all(
      inningsList.map(async (inning) => {
        const [batsmen, bowlers, currentOverBalls] = await Promise.all([
          battingRepo.find({
            where: { innings_id: inning.id, tenant_id },
            relations: ['player', 'bowler', 'fielder']
          }),
          bowlingRepo.find({
            where: { innings_id: inning.id, tenant_id },
            relations: ['player']
          }),
          ballRepo.find({
            where: {
              innings_id: inning.id,
              over_number: inning.current_over,
              tenant_id
            },
            order: { ball_number: 'ASC' }
          })
        ]);

        const striker = batsmen.find((b) => b.is_striker && !b.is_out);
        const nonStriker = batsmen.find((b) => !b.is_striker && !b.is_out);
        const dismissed = ScoreboardService.buildDismissedBatsmen(batsmen);
        const { items: ballsItems, illegalBallsCount } =
          ScoreboardService.buildCurrentOverBalls(currentOverBalls);
        const isOverComplete = inning.balls % 6 === 0 && inning.balls > 0;

        return {
          i: inning.innings_number,
          battingTeam: inning.battingTeam.short_name,
          bowlingTeam: inning.bowlingTeam.short_name,

          score: {
            r: inning.runs,
            w: inning.wickets,
            b: inning.balls
          },

          batting: {
            striker: striker ? ScoreboardService.buildBatsmanSummary(striker) : null,
            nonStriker: nonStriker ? ScoreboardService.buildBatsmanSummary(nonStriker) : null
          },

          dismissed,

          bowling: ScoreboardService.buildBowlersList(bowlers),

          currentOver: {
            o: inning.current_over,
            isOverComplete,
            bowlerId: inning.current_bowler_id,
            ballsCount: currentOverBalls.length,
            illegalBallsCount,
            balls: ballsItems
          }
        };
      })
    );

    return {
      success: true,
      data: {
        meta: {
          matchId: match.id,
          format: match.format,
          status: match.status,
          currentInningsId: match.current_innings_id,
          lastUpdated: match.updatedAt
        },
        teams: {
          A: {
            id: match.teamA.id,
            name: match.teamA.name,
            short: match.teamA.short_name
          },
          B: {
            id: match.teamB.id,
            name: match.teamB.name,
            short: match.teamB.short_name
          }
        },
        innings: inningsData
      }
    };
  }

  static async getPublicMatchScore(matchId: string, tenant_id: number) {
    const matchRepo = AppDataSource.getRepository(Match);
    const inningsRepo = AppDataSource.getRepository(MatchInnings);
    const battingRepo = AppDataSource.getRepository(InningsBatting);
    const bowlingRepo = AppDataSource.getRepository(InningsBowling);
    const ballRepo = AppDataSource.getRepository(BallByBall);

    /* 1. Fetch match + innings (PARALLEL) */
    const [match, inningsList] = await Promise.all([
      matchRepo.findOne({
        where: { id: matchId, tenant_id },
        relations: ['teamA', 'teamB']
      }),
      inningsRepo.find({
        where: { match_id: matchId, tenant_id },
        relations: ['battingTeam', 'bowlingTeam'],
        order: { innings_number: 'ASC' }
      })
    ]);

    if (!match) {
      throw { status: 404, message: 'Match not found' };
    }

    if (!inningsList.length) {
      return {
        success: true,
        data: {
          meta: {
            matchId: match.id,
            format: match.format,
            status: match.status,
            currentInningsId: match.current_innings_id,
            lastUpdated: match.updatedAt
          },
          teams: {
            A: {
              id: match.teamA.id,
              name: match.teamA.name,
              short: match.teamA.short_name
            },
            B: {
              id: match.teamB.id,
              name: match.teamB.name,
              short: match.teamB.short_name
            }
          },
          innings: []
        }
      };
    }

    const inningsIds = inningsList.map(i => i.id);

    /* 2. Fetch ALL related data ONCE (PARALLEL) */
    const [allBatsmen, allBowlers, allBalls] = await Promise.all([
      battingRepo.find({
        where: { innings_id: In(inningsIds), tenant_id },
        relations: ['player', 'bowler', 'fielder']
      }),
      bowlingRepo.find({
        where: { innings_id: In(inningsIds), tenant_id },
        relations: ['player']
      }),
      ballRepo.find({
        where: { innings_id: In(inningsIds), tenant_id },
        order: { id: 'ASC' }
      })
    ]);

    /* 3. Group in memory (FAST) */
    const batsmenByInnings = new Map<number, any[]>();
    const bowlersByInnings = new Map<number, any[]>();
    const ballsByInnings = new Map<number, any[]>();

    for (const b of allBatsmen) {
      if (!batsmenByInnings.has(b.innings_id)) {
        batsmenByInnings.set(b.innings_id, []);
      }
      batsmenByInnings.get(b.innings_id)!.push(b);
    }

    for (const b of allBowlers) {
      if (!bowlersByInnings.has(b.innings_id)) {
        bowlersByInnings.set(b.innings_id, []);
      }
      bowlersByInnings.get(b.innings_id)!.push(b);
    }

    for (const b of allBalls) {
      if (!ballsByInnings.has(b.innings_id)) {
        ballsByInnings.set(b.innings_id, []);
      }
      ballsByInnings.get(b.innings_id)!.push(b);
    }

    // Build innings response from already-grouped in-memory data (no DB calls in the loop).
    const inningsData = inningsList.map((inning) => {
      const batsmen = batsmenByInnings.get(inning.id) || [];
      const bowlers = bowlersByInnings.get(inning.id) || [];
      const balls = ballsByInnings.get(inning.id) || [];

      const striker = batsmen.find((b) => b.player_id === inning.striker_id && !b.is_out);
      const nonStriker = batsmen.find((b) => b.player_id === inning.non_striker_id && !b.is_out);
      const dismissed = ScoreboardService.buildDismissedBatsmen(batsmen);

      const currentOverBalls = balls.filter((b) => b.over_number === inning.current_over);
      const { items: ballsItems, illegalBallsCount } =
        ScoreboardService.buildCurrentOverBalls(currentOverBalls);
      const isOverComplete = inning.balls % 6 === 0 && inning.balls > 0;

      return {
        i: inning.id,
        is_completed: inning.is_completed,
        innings_number: inning.innings_number,
        battingTeam: inning.battingTeam.short_name,
        bowlingTeam: inning.bowlingTeam.short_name,

        score: {
          r: inning.runs,
          w: inning.wickets,
          b: inning.balls
        },

        batting: {
          striker: striker ? ScoreboardService.buildBatsmanSummary(striker) : null,
          nonStriker: nonStriker ? ScoreboardService.buildBatsmanSummary(nonStriker) : null
        },

        dismissed,

        bowling: ScoreboardService.buildBowlersList(bowlers),

        currentOver: {
          o: inning.current_over,
          isOverComplete,
          bowlerId: inning.current_bowler_id,
          ballsCount: currentOverBalls.length,
          illegalBallsCount,
          balls: ballsItems
        }
      };
    });

    return {
      success: true,
      data: {
        is_active: match.is_active,
        meta: {
          matchId: match.id,
          format: match.format,
          status: match.status,
          currentInningsId: match.current_innings_id,
          lastUpdated: match.updatedAt,
          isMatchCompleted: match.is_completed,
          winnerTeamId: match.winner_team_id,
        },
        teams: {
          A: {
            id: match.teamA.id,
            name: match.teamA.name,
            short: match.teamA.short_name
          },
          B: {
            id: match.teamB.id,
            name: match.teamB.name,
            short: match.teamB.short_name
          }
        },
        innings: inningsData
      }
    };
  }

  static async getAvailableBatsmen(matchId: string, tenant_id: number) {
    const matchRepository = AppDataSource.getRepository(Match);
    const match = await matchRepository.findOne({
      where: { id: matchId, tenant_id }
    });
    if (!match) {
      throw { status: HTTP_STATUS.NOT_FOUND, message: 'Match not found' };
    }
    const matchPlayerRepository = AppDataSource.getRepository(MatchPlayer);
    const battingRepository = AppDataSource.getRepository(InningsBatting);
    const inningsRepository = AppDataSource.getRepository(MatchInnings);

    if (!match.current_innings_id) {
      throw { status: HTTP_STATUS.BAD_REQUEST, message: 'No active innings for this match' };
    }

    const innings = await inningsRepository.findOne({
      where: { id: match.current_innings_id }
    });

    if (!innings) {
      throw { status: HTTP_STATUS.NOT_FOUND, message: 'Innings not found' };
    }

    const [battingTeamPlayers, currentBatsmen] = await Promise.all([
      matchPlayerRepository.find({
        where: { match_id: matchId, team_id: innings.batting_team_id, is_playing11: true },
        relations: ['player']
      }),
      battingRepository.find({
        where: { innings_id: innings.id },
        relations: ['player']
      })
    ]);

    const batsmenInInnings = new Set(currentBatsmen.map((b: any) => b.player_id));
    const availableBatsmen = battingTeamPlayers.filter((mp: any) => !batsmenInInnings.has(mp.player_id));

    return {
      success: true,
      data: availableBatsmen.map((mp: any) => ({
        id: mp.player_id,
        name: mp.player.full_name,
        role: mp.role
      }))
    };
  }

  static async getBowlingTeamPlayers(matchId: string, tenant_id: number) {
    const matchPlayerRepository = AppDataSource.getRepository(MatchPlayer);
    const inningsRepository = AppDataSource.getRepository(MatchInnings);
    const matchRepository = AppDataSource.getRepository(Match);

    const match = await matchRepository.findOne({
      where: { id: matchId, tenant_id }
    });

    if (!match) {
      throw { status: HTTP_STATUS.NOT_FOUND, message: 'Match not found' };
    }

    if (!match.current_innings_id) {
      throw { status: HTTP_STATUS.BAD_REQUEST, message: 'No active innings for this match' };
    }

    const innings = await inningsRepository.findOne({
      where: { match_id: matchId, id: match.current_innings_id, tenant_id }
    });

    if (!innings) {
      throw { status: HTTP_STATUS.NOT_FOUND, message: 'Innings not found' };
    }

    const bowlingTeamPlayers = await matchPlayerRepository.find({
      where: { match_id: matchId, team_id: innings.bowling_team_id, is_playing11: true },
      relations: ['player']
    });

    return {
      success: true,
      data: bowlingTeamPlayers.map((mp: any) => ({
        id: mp.player_id,
        name: mp.player.full_name,
        role: mp.role
      }))
    };
  }

  // ---- Private helpers ----

  /**
   * Map dismissed batsman rows (with joined player) into the API shape.
   * Shape is identical between getMatchScore and getPublicMatchScore.
   */
  private static buildDismissedBatsmen(batsmen: any[]) {
    return batsmen
      .filter((b) => b.is_out)
      .map((b) => ({
        id: b.player.id,
        n: b.player.full_name,
        r: b.runs,
        b: b.balls,
        w: {
          type: b.wicket_type,
          bowler: b.bowler?.full_name || null,
          fielder: b.fielder?.full_name || null
        },
        o: b.dismissal_over
      }));
  }

  /**
   * Map bowling rows (with joined player) into the API shape.
   */
  private static buildBowlersList(bowlers: any[]) {
    return bowlers.map((b) => ({
      id: b.player.id,
      n: b.player.full_name,
      b: b.balls,
      r: b.runs,
      w: b.wickets,
      e: b.economy
    }));
  }

  /**
   * Map a current-over's balls into the API shape, plus count
   * of illegal balls (wides/no-balls) that don't count toward the over.
   */
  private static buildCurrentOverBalls(balls: any[]) {
    const illegalBallsCount = balls.filter((ball: any) =>
      ['WIDE', 'NO_BALL'].includes(ball.ball_type)
    ).length;

    const items = balls.map((ball: any) => ({
      b: ball.ball_number,
      t: ball.ball_type,
      r: ball.is_wicket ? 'W' : ball.runs
    }));

    return { items, illegalBallsCount };
  }

  /**
   * Map a single batsman row (with joined player) into the API shape.
   */
  private static buildBatsmanSummary(b: any) {
    return {
      id: b.player.id,
      n: b.player.full_name,
      r: b.runs,
      b: b.balls,
      '4s': b.fours,
      '6s': b.sixes,
      sr: b.strike_rate
    };
  }
}
