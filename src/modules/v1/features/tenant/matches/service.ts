/**
 * Match service — CRUD + lifecycle.
 *
 * Responsibilities:
 *   - token issuance, match creation, update, delete
 *   - list/lookup queries (tenant-scoped, all-tenant)
 *   - schedule, start, complete (state transitions on the match)
 *
 * Scoring concerns (recordBall, setBatsman, setBowler, switchInnings) live
 * in ./scoring.service. Scoreboard reads (getMatchScore, getPublicMatchScore,
 * getAvailableBatsmen, getBowlingTeamPlayers) live in ./scoreboard.service.
 */

import { AppDataSource } from '../../../../../config/db';
import { Match } from '../../../shared/entities/Match';
import { Team } from '../../../shared/entities/Team';
import { MatchPlayer } from '../../../shared/entities/MatchPlayer';
import { MatchInnings } from '../../../shared/entities/MatchInnings';
import { TeamService } from '../teams/service';
import {
  CreateMatchDto,
  GetMatchesQueryDto,
  MatchStartDto,
  UpdateMatchDto,
  CompleteMatchDto
} from './dtos/match.dto';
import { HTTP_STATUS } from '../../../../../constants/status-codes';
import { Not, IsNull } from 'typeorm';
import { runInTransaction } from '../../../../../utils/transaction';

export class MatchesService {
  private static async resolveTeam(teamData: any, tenant_id: number): Promise<number> {
    const teamRepository = AppDataSource.getRepository(Team);

    // Check if team exists by name
    const existingTeam = await teamRepository.findOne({
      where: { name: teamData.name, tenant_id }
    });

    if (existingTeam) {
      return existingTeam.id;
    }

    // Create new team if not exists
    const newTeam = await TeamService.createTeam({
      ...teamData,
      tenant_id
    });

    return newTeam.id;
  }

  static async generateMatchToken(tenant_id: number, user_id: number) {
    const matchRepository = AppDataSource.getRepository(Match);
    const uniqueId = Math.floor(100000 + Math.random() * 900000);
    const matchToken = `CSMSMATCH${uniqueId}`;

    const match = matchRepository.create({
      id: matchToken,
      tenant_id,
      user_id,
      is_active: true
    });

    // Insert ID only (other fields are nullable)
    return await matchRepository.save(match);
  }

  static async createMatch(data: CreateMatchDto, tenant_id: number) {
    const matchRepository = AppDataSource.getRepository(Match);

    const teamAId = await this.resolveTeam(data.teamA, tenant_id);
    const teamBId = await this.resolveTeam(data.teamB, tenant_id);

    const match = matchRepository.create({
      team_a_id: teamAId,
      team_b_id: teamBId,
      match_date: data.match_date,
      format: data.format,
      venue: data.venue,
      status: data.status,
      tenant_id,
      is_active: true,
      id: `CSMSMATCH${Math.floor(100000 + Math.random() * 900000)}` // Generate ID if creating fully
    });

    return await matchRepository.save(match);
  }

  static async getMatches(tenant_id: number) {
    const matchRepository = AppDataSource.getRepository(Match);
    return await matchRepository.find({
      where: { tenant_id },
      relations: ['teamA', 'teamB']
    });
  }

  static async getMatchesByTenant(tenant_id: number, query: GetMatchesQueryDto) {
    const matchRepository = AppDataSource.getRepository(Match);
    const {
      page = 1,
      limit = 10,
      status,
      sorted = 'createdAt',
      sorted_order = 'DESC'
    } = query;

    const skip = (Number(page) - 1) * Number(limit);
    const where: any = { tenant_id };

    if (status) {
      where.status = status;
    }

    const [matches, total] = await matchRepository.findAndCount({
      where,
      relations: ['teamA', 'teamB', 'winner', 'tossWinner', 'battingFirst', 'currentInnings', 'user'],
      order: { [sorted]: (sorted_order as string).toUpperCase() as any },
      skip,
      take: Number(limit)
    });

    const totalPages = Math.ceil(total / Number(limit));

    return {
      data: matches,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages,
        hasNextPage: Number(page) < totalPages,
        hasPreviousPage: Number(page) > 1
      }
    };
  }

  static async getTenantMatches(tenant_id: number, page: number = 1, limit: number = 10, status?: string) {
    const matchRepository = AppDataSource.getRepository(Match);
    const inningsRepository = AppDataSource.getRepository(MatchInnings);

    const skip = (page - 1) * limit;
    const where: any = { tenant_id, team_a_id: Not(IsNull()), team_b_id: Not(IsNull()) };
    if (status) where.status = status;

    const [matches, total] = await matchRepository.findAndCount({
      where,
      relations: ['teamA', 'teamB', 'user'],
      order: { match_date: 'DESC', createdAt: 'DESC' },
      skip,
      take: limit
    });

    const matchesWithInnings = await Promise.all(
      matches.map(async (match) => {
        const innings = await inningsRepository.find({
          where: { match_id: match.id, tenant_id },
          relations: ['battingTeam', 'bowlingTeam'],
          order: { innings_number: 'ASC' }
        });

        return {
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
          innings: innings.map(inning => ({
            i: inning.innings_number,
            battingTeam: inning.battingTeam.short_name,
            bowlingTeam: inning.bowlingTeam.short_name,
            score: {
              r: inning.runs,
              w: inning.wickets,
              b: inning.balls
            }
          }))
        };
      })
    );

    const totalPages = Math.ceil(total / limit);

    return {
      data: matchesWithInnings,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    };
  }

  static async getAllMatches(page: number = 1, limit: number = 10, sortBy: string = 'createdAt') {
    const matchRepository = AppDataSource.getRepository(Match);
    const inningsRepository = AppDataSource.getRepository(MatchInnings);

    const skip = (page - 1) * limit;
    const orderField = sortBy === 'match_date' ? 'match_date' : 'createdAt';

    const [matches, total] = await matchRepository.findAndCount({
      where: { team_a_id: Not(IsNull()), team_b_id: Not(IsNull()) },
      relations: ['teamA', 'teamB'],
      order: { [orderField]: 'DESC' },
      skip,
      take: limit
    });

    const matchesWithInnings = await Promise.all(
      matches.map(async (match) => {
        const innings = await inningsRepository.find({
          where: { match_id: match.id, tenant_id: match.tenant_id },
          relations: ['battingTeam', 'bowlingTeam'],
          order: { innings_number: 'ASC' }
        });

        return {
          meta: {
            matchId: match.id,
            format: match.format,
            status: match.status,
            currentInningsId: match.current_innings_id,
            lastUpdated: match.updatedAt,
            tenantId: match.tenant_id
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
          innings: innings.map(inning => ({
            i: inning.innings_number,
            battingTeam: inning.battingTeam.short_name,
            bowlingTeam: inning.bowlingTeam.short_name,
            score: {
              r: inning.runs,
              w: inning.wickets,
              b: inning.balls
            }
          }))
        };
      })
    );

    const totalPages = Math.ceil(total / limit);

    return {
      data: matchesWithInnings,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    };
  }

  static async getMatchById(id: string, tenant_id: number) {
    const matchRepository = AppDataSource.getRepository(Match);
    const match = await matchRepository.findOne({
      where: { id, tenant_id },
      relations: ['teamA', 'teamB']
    });

    if (!match) {
      throw { status: HTTP_STATUS.NOT_FOUND, message: 'Match not found' };
    }

    return match;
  }

  static async updateMatch(id: string, data: UpdateMatchDto, tenant_id: number) {
    const matchRepository = AppDataSource.getRepository(Match);
    const match = await this.getMatchById(id, tenant_id);

    Object.assign(match, data);
    return await matchRepository.save(match);
  }

  static async deleteMatch(id: string, tenant_id: number) {
    const matchRepository = AppDataSource.getRepository(Match);
    const match = await this.getMatchById(id, tenant_id);

    await matchRepository.remove(match);
    return { message: 'Match deleted successfully' };
  }

  static async deleteMatchToken(id: string, tenant_id: number) {
    return await this.deleteMatch(id, tenant_id);
  }

  static async getCurrentCreatedMatch(id: string, tenant_id: number) {
    const matchRepository = AppDataSource.getRepository(Match);
    const matchPlayerRepository = AppDataSource.getRepository(MatchPlayer);

    const match = await matchRepository.findOne({
      where: { id, tenant_id },
      relations: ['teamA', 'teamB']
    });

    if (!match) {
      throw { status: HTTP_STATUS.NOT_FOUND, message: 'Match not found' };
    }

    const teamAPlayers = await matchPlayerRepository.find({
      where: { match_id: id, team_id: match.team_a_id },
      relations: ['player']
    });

    const teamBPlayers = await matchPlayerRepository.find({
      where: { match_id: id, team_id: match.team_b_id },
      relations: ['player']
    });

    const allPlayers = [...teamAPlayers, ...teamBPlayers];
    const manOfTheMatchPlayer = match.man_of_the_match_player_id
      ? allPlayers.find(mp => mp.player.id === match.man_of_the_match_player_id)
      : null;

    return {
      id: match.id,
      match_date: match.match_date,
      format: match.format,
      venue: match.venue,
      is_completed: match.is_completed,
      is_active: match.is_active,
      status: match.status,
      current_innings_id: match.current_innings_id,
      umpire_1: match.umpire_1,
      umpire_2: match.umpire_2,
      ...(match.toss_winner_team_id && { toss_winner_team_id: match.toss_winner_team_id }),
      ...(match.batting_first_team_id && { batting_first_team_id: match.batting_first_team_id }),
      teamA: match.teamA ? {
        id: match.teamA.id,
        name: match.teamA.name,
        short_name: match.teamA.short_name,
        is_toss_winner: match.toss_winner_team_id === match.team_a_id,
        players: teamAPlayers.map((mp: any) => ({
          id: mp.player.id,
          name: mp.player.full_name,
          role: mp.role
        }))
      } : null,
      teamB: match.teamB ? {
        id: match.teamB.id,
        name: match.teamB.name,
        short_name: match.teamB.short_name,
        is_toss_winner: match.toss_winner_team_id === match.team_b_id,
        players: teamBPlayers.map((mp: any) => ({
          id: mp.player.id,
          name: mp.player.full_name,
          role: mp.role
        }))
      } : null
    };
  }

  static async scheduleMatch(matchId: string, scheduleData: any, tenant_id: number) {
    const matchRepository = AppDataSource.getRepository(Match);

    const match = await matchRepository.findOne({ where: { id: matchId, tenant_id } });
    if (!match) {
      throw { status: HTTP_STATUS.NOT_FOUND, message: 'Match not found' };
    }

    match.venue = scheduleData.venue;
    match.match_date = scheduleData.match_date;
    match.format = scheduleData.format;
    match.umpire_1 = scheduleData.umpire_1;
    match.umpire_2 = scheduleData.umpire_2;
    match.status = 'SCHEDULED';

    return await matchRepository.save(match);
  }

  static async startMatch(matchId: string, startData: MatchStartDto, tenant_id: number) {
    return runInTransaction(async (manager) => {
      const matchRepository = manager.getRepository(Match);
      const matchPlayerRepository = manager.getRepository(MatchPlayer);
      const inningsRepository = manager.getRepository(MatchInnings);

      const match = await matchRepository.findOne({ where: { id: matchId, tenant_id } });
      if (!match) {
        throw { status: HTTP_STATUS.NOT_FOUND, message: 'Match not found' };
      }

      // Initialize and save first innings (to get ID)
      const firstInnings = inningsRepository.create({
        match_id: matchId,
        innings_number: 1,
        batting_team_id: startData.batting_first_team_id,
        bowling_team_id: startData.batting_first_team_id === match.team_a_id ? match.team_b_id : match.team_a_id,
        tenant_id
      });
      await inningsRepository.save(firstInnings);

      // Update match with toss, batting info AND current innings ID (single update)
      match.toss_winner_team_id = startData.toss_winner_team_id;
      match.batting_first_team_id = startData.batting_first_team_id;
      match.format = startData.over.toString();
      match.status = 'LIVE';
      match.current_innings_id = firstInnings.id;
      match.playing_count = startData.teamA.playing_11_id.length || startData.teamB.playing_11_id.length || 11;
      await matchRepository.save(match);

      // Update playing 11 for both teams
      const allPlayingIds = [...startData.teamA.playing_11_id, ...startData.teamB.playing_11_id];

      await matchPlayerRepository
        .createQueryBuilder()
        .update(MatchPlayer)
        .set({ is_playing11: true })
        .where('match_id = :matchId AND player_id IN (:...playerIds)', {
          matchId,
          playerIds: allPlayingIds
        })
        .execute();

      // Update captain roles
      const captainIds = [startData.teamA.captain_id, startData.teamB.captain_id];

      for (const captainId of captainIds) {
        const captainPlayer = await matchPlayerRepository.findOne({
          where: { match_id: matchId, player_id: captainId }
        });

        if (captainPlayer) {
          const currentRole = captainPlayer.role || '';
          captainPlayer.role = currentRole ? `${currentRole}|Captain` : 'Captain';
          await matchPlayerRepository.save(captainPlayer);
        }
      }

      return match;
    });
  }

  static async completeMatch(matchId: string, data: CompleteMatchDto, tenant_id: number) {
    return runInTransaction(async (manager) => {
      const matchRepository = manager.getRepository(Match);

      const match = await matchRepository.findOne({ where: { id: matchId, tenant_id } });
      if (!match) {
        throw { status: HTTP_STATUS.NOT_FOUND, message: 'Match not found' };
      }

      // Update match status and details
      match.status = 'COMPLETED';
      match.is_active = false;
      match.is_completed = true;
      match.man_of_the_match_player_id = data.man_of_the_match_player_id;

      if (!data.is_match_tied) {
        if (data.result_description) {
          match.result_description = data.result_description;
        }
        if (data.winner_team_id) {
          match.winner_team_id = data.winner_team_id;
        }
      } else {
        match.result_description = 'Match Tied';
        match.winner_team_id = null as any;
      }

      await matchRepository.save(match);

      return { success: true, message: 'Match completed and data archived successfully' };
    });
  }
}
