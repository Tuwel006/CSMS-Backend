import { EntityManager, Repository } from 'typeorm';
import { Team } from '../../../shared/entities/Team';
import { Player, PlayerRole } from '../../../shared/entities/Player';
import { Match } from '../../../shared/entities/Match';
import { MatchPlayer } from '../../../shared/entities/MatchPlayer';
import { HTTP_STATUS } from '../../../../../constants/status-codes';
import { TeamSetupDto } from './dtos/team-setup.dto';
import { runInTransaction } from '../../../../../utils/transaction';

export class TeamSetupService {
  /**
   * Create or assign a team to a match along with its players.
   * If team_a_id is empty, assigns to team_a; otherwise to team_b.
   */
  static async setupTeam(data: TeamSetupDto) {
    return runInTransaction(async (manager) => {
      const teamRepo = manager.getRepository(Team);
      const playerRepo = manager.getRepository(Player);
      const matchRepo = manager.getRepository(Match);
      const matchPlayerRepo = manager.getRepository(MatchPlayer);

      const match = await matchRepo.findOne({ where: { id: data.matchId } });
      if (!match) {
        throw { status: HTTP_STATUS.NOT_FOUND, message: 'Match not found' };
      }

      const teamId = await TeamSetupService.resolveTeamId(teamRepo, data.team);
      TeamSetupService.assertTeamNotAssigned(match, teamId);

      const teamAssignedTo = TeamSetupService.assignTeamSlot(match, teamId);
      await matchRepo.save(match);

      const playerResults = await TeamSetupService.attachPlayersToTeam(
        manager,
        data.matchId,
        teamId,
        data.players
      );

      return {
        matchId: data.matchId,
        teamId,
        teamAssignedTo,
        players: playerResults
      };
    });
  }

  /**
   * Replace the player list for an already-assigned team in a match.
   * Existing assignments for that team are deleted first.
   */
  static async updateTeamSetup(matchId: string, teamId: number, data: TeamSetupDto) {
    return runInTransaction(async (manager) => {
      const matchRepo = manager.getRepository(Match);
      const matchPlayerRepo = manager.getRepository(MatchPlayer);

      const match = await matchRepo.findOne({ where: { id: matchId } });
      if (!match) {
        throw { status: HTTP_STATUS.NOT_FOUND, message: 'Match not found' };
      }

      if (match.team_a_id !== teamId && match.team_b_id !== teamId) {
        throw { status: HTTP_STATUS.BAD_REQUEST, message: 'Team not assigned to this match' };
      }

      await matchPlayerRepo.delete({ match_id: matchId, team_id: teamId });

      const playerResults = [];
      for (const playerData of data.players) {
        if (!playerData.id) {
          throw { status: HTTP_STATUS.BAD_REQUEST, message: 'Player ID is required for update' };
        }

        await matchPlayerRepo.save(
          matchPlayerRepo.create({
            match_id: matchId,
            player_id: playerData.id,
            team_id: teamId,
            role: playerData.role
          })
        );

        playerResults.push({
          playerId: playerData.id,
          name: playerData.name,
          role: playerData.role
        });
      }

      return { matchId, teamId, players: playerResults };
    });
  }

  /**
   * Deletion is intentionally a no-op while we decide on cascade behavior.
   * Returning a stable shape lets the controller still emit a success response.
   */
  static async deleteTeamSetup(_matchId: string, _teamId: number) {
    return { message: 'Team setup deletion is disabled' };
  }

  // ---- Private helpers ----

  /**
   * Resolve a team ID by id → by name → by creating a new one.
   */
  private static async resolveTeamId(
    teamRepo: Repository<Team>,
    teamData: TeamSetupDto['team']
  ): Promise<number> {
    if (teamData.id) {
      const existing = await teamRepo.findOne({ where: { id: teamData.id } });
      if (existing) return teamData.id;
    }

    const byName = await teamRepo.findOne({ where: { name: teamData.name } });
    if (byName) return byName.id;

    const created = await teamRepo.save(
      teamRepo.create({
        name: teamData.name,
        location: teamData.location,
        is_active: true
      })
    );
    return created.id;
  }

  private static assertTeamNotAssigned(match: Match, teamId: number) {
    if (match.team_a_id === teamId || match.team_b_id === teamId) {
      throw { status: HTTP_STATUS.BAD_REQUEST, message: 'Team already assigned to this match' };
    }
  }

  /**
   * Assign teamId to the first empty slot on the match. Returns 'team_a' or 'team_b'.
   */
  private static assignTeamSlot(match: Match, teamId: number): 'team_a' | 'team_b' {
    if (!match.team_a_id) {
      match.team_a_id = teamId;
      return 'team_a';
    }
    if (!match.team_b_id) {
      match.team_b_id = teamId;
      return 'team_b';
    }
    throw { status: HTTP_STATUS.BAD_REQUEST, message: 'Both teams already assigned to this match' };
  }

  /**
   * Ensure each player exists (creating if needed) and add them to match_players
   * for the given team. Throws if a player is already assigned to another team
   * in the same match.
   */
  private static async attachPlayersToTeam(
    manager: EntityManager,
    matchId: string,
    teamId: number,
    players: TeamSetupDto['players']
  ) {
    const playerRepo = manager.getRepository(Player);
    const matchPlayerRepo = manager.getRepository(MatchPlayer);
    const results: Array<{ playerId: number; name: string; role: string }> = [];

    for (const playerData of players) {
      const playerId = await TeamSetupService.resolvePlayerId(playerRepo, playerData);

      const existingAssignment = await matchPlayerRepo.findOne({
        where: { match_id: matchId, player_id: playerId }
      });
      if (existingAssignment) {
        throw {
          status: HTTP_STATUS.BAD_REQUEST,
          message: `Player ${playerData.name} is already assigned to another team in this match`
        };
      }

      await matchPlayerRepo.save(
        matchPlayerRepo.create({
          match_id: matchId,
          player_id: playerId,
          team_id: teamId,
          role: playerData.role
        })
      );

      results.push({
        playerId,
        name: playerData.name,
        role: playerData.role
      });
    }

    return results;
  }

  private static async resolvePlayerId(
    playerRepo: Repository<Player>,
    playerData: TeamSetupDto['players'][number]
  ): Promise<number> {
    if (playerData.id) {
      const existing = await playerRepo.findOne({ where: { id: playerData.id } });
      if (existing) return playerData.id;
    }

    const created = await playerRepo.save(
      playerRepo.create({
        full_name: playerData.name,
        role: playerData.role as PlayerRole
      })
    );
    return created.id;
  }
}