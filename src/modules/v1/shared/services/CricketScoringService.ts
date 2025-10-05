import { AppDataSource } from '../../../../config/db';
import { Score, ExtraType, WicketType } from '../entities/Score';
import { PlayerStats } from '../entities/PlayerStats';
import { MatchStatus } from '../entities/MatchStatus';

interface InsertBallParams {
  matchId: number;
  inningsNo: number;
  batsmanId: number;
  bowlerId: number;
  nonStrikerId: number;
  runs: number;
  extras: number;
  extraType?: ExtraType;
  isWicket: boolean;
  wicketType?: WicketType;
  fielderId?: number;
  description?: string;
}

export class CricketScoringService {
  static async insertBall(params: InsertBallParams) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const scoreRepo = queryRunner.manager.getRepository(Score);
      const playerStatsRepo = queryRunner.manager.getRepository(PlayerStats);
      const matchStatusRepo = queryRunner.manager.getRepository(MatchStatus);

      // 1. Insert new ball into Score table
      const score = scoreRepo.create({
        match_id: params.matchId,
        innings_no: params.inningsNo,
        batsman_id: params.batsmanId,
        bowler_id: params.bowlerId,
        non_striker_id: params.nonStrikerId,
        runs: params.runs,
        extras: params.extras,
        extra_type: params.extraType,
        is_wicket: params.isWicket,
        wicket_type: params.wicketType,
        fielder_id: params.fielderId,
        description: params.description
      });

      const savedScore = await scoreRepo.save(score);

      // 2. Update batsman stats
      let batsmanStats = await playerStatsRepo.findOne({
        where: { match_id: params.matchId, player_id: params.batsmanId }
      });

      if (!batsmanStats) {
        batsmanStats = playerStatsRepo.create({
          match_id: params.matchId,
          player_id: params.batsmanId
        });
      }

      // Update batting stats (only if not extras like wide/no-ball)
      if (!params.extraType || params.extraType === ExtraType.BYE || params.extraType === ExtraType.LEG_BYE) {
        batsmanStats.balls_faced += 1;
      }
      
      batsmanStats.runs += params.runs;
      
      if (params.runs === 4) batsmanStats.fours += 1;
      if (params.runs === 6) batsmanStats.sixes += 1;
      if (params.isWicket) batsmanStats.is_out = true;

      await playerStatsRepo.save(batsmanStats);

      // 3. Update bowler stats
      let bowlerStats = await playerStatsRepo.findOne({
        where: { match_id: params.matchId, player_id: params.bowlerId }
      });

      if (!bowlerStats) {
        bowlerStats = playerStatsRepo.create({
          match_id: params.matchId,
          player_id: params.bowlerId
        });
      }

      // Update bowling stats
      const ballInt = Math.round(savedScore.ball * 10);
      const ballInOver = ballInt % 10;
      
      if (ballInOver === 6 || (params.extraType !== ExtraType.WIDE && params.extraType !== ExtraType.NO_BALL)) {
        bowlerStats.overs_bowled = Math.floor(savedScore.ball) + (ballInOver / 10);
      }

      bowlerStats.runs_conceded += params.runs + params.extras;
      if (params.isWicket) bowlerStats.wickets += 1;
      if (params.extraType === ExtraType.WIDE) bowlerStats.wides += 1;
      if (params.extraType === ExtraType.NO_BALL) bowlerStats.no_balls += 1;

      await playerStatsRepo.save(bowlerStats);

      // 4. Update match status
      let matchStatus = await matchStatusRepo.findOne({
        where: { match_id: params.matchId, innings_no: params.inningsNo }
      });

      if (!matchStatus) {
        matchStatus = matchStatusRepo.create({
          match_id: params.matchId,
          innings_no: params.inningsNo
        });
      }

      matchStatus.total_runs += params.runs + params.extras;
      if (params.isWicket) matchStatus.total_wickets += 1;
      matchStatus.balls_bowled = savedScore.ball;
      matchStatus.extras += params.extras;

      // Calculate current run rate
      const totalBalls = Math.floor(savedScore.ball) * 6 + (Math.round(savedScore.ball * 10) % 10);
      if (totalBalls > 0) {
        matchStatus.current_run_rate = (matchStatus.total_runs / totalBalls) * 6;
      }

      // Update extra-specific counters
      if (params.extraType === ExtraType.WIDE) matchStatus.wides += params.extras;
      if (params.extraType === ExtraType.NO_BALL) matchStatus.no_balls += params.extras;
      if (params.extraType === ExtraType.BYE) matchStatus.byes += params.extras;
      if (params.extraType === ExtraType.LEG_BYE) matchStatus.leg_byes += params.extras;
      if (params.extraType === ExtraType.PENALTY) matchStatus.penalties += params.extras;

      await matchStatusRepo.save(matchStatus);

      await queryRunner.commitTransaction();
      return savedScore;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // Get live score for a match
  static async getLiveScore(matchId: number, inningsNo: number) {
    const matchStatusRepo = AppDataSource.getRepository(MatchStatus);
    
    return await matchStatusRepo.findOne({
      where: { match_id: matchId, innings_no: inningsNo },
      relations: ['match']
    });
  }

  // Get batsman stats for current match
  static async getBatsmanStats(matchId: number, playerId: number) {
    const playerStatsRepo = AppDataSource.getRepository(PlayerStats);
    
    return await playerStatsRepo.findOne({
      where: { match_id: matchId, player_id: playerId },
      relations: ['player']
    });
  }

  // Get bowler stats for current match
  static async getBowlerStats(matchId: number, playerId: number) {
    const playerStatsRepo = AppDataSource.getRepository(PlayerStats);
    
    return await playerStatsRepo.findOne({
      where: { match_id: matchId, player_id: playerId },
      relations: ['player']
    });
  }

  // Get full scoreboard
  static async getScoreboard(matchId: number) {
    const matchStatusRepo = AppDataSource.getRepository(MatchStatus);
    const playerStatsRepo = AppDataSource.getRepository(PlayerStats);

    const matchStatus = await matchStatusRepo.find({
      where: { match_id: matchId },
      relations: ['match'],
      order: { innings_no: 'ASC' }
    });

    const playerStats = await playerStatsRepo.find({
      where: { match_id: matchId },
      relations: ['player'],
      order: { runs: 'DESC' }
    });

    return {
      matchStatus,
      playerStats: {
        batting: playerStats.filter(p => p.balls_faced > 0),
        bowling: playerStats.filter(p => p.overs_bowled > 0)
      }
    };
  }

  // Get ball-by-ball commentary
  static async getBallByBall(matchId: number, inningsNo: number, limit = 20) {
    const scoreRepo = AppDataSource.getRepository(Score);
    
    return await scoreRepo.find({
      where: { match_id: matchId, innings_no: inningsNo },
      relations: ['batsman', 'bowler', 'nonStriker', 'fielder'],
      order: { ball: 'DESC', id: 'DESC' },
      take: limit
    });
  }
}