import { AppDataSource } from '../../../config/db';
import { Team } from '../shared/entities/Team';
import { Player } from '../shared/entities/Player';
import { Matches } from '../shared/entities/Matches';
import { MatchPlayer } from '../shared/entities/MatchPlayer';
import { HTTP_STATUS } from '../../../constants/status-codes';
import { TeamSetupDto } from './team-setup.dto';

export class TeamSetupService {
  static async setupTeam(data: TeamSetupDto) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const teamRepository = queryRunner.manager.getRepository(Team);
      const playerRepository = queryRunner.manager.getRepository(Player);
      const matchRepository = queryRunner.manager.getRepository(Matches);
      const matchPlayerRepository = queryRunner.manager.getRepository(MatchPlayer);

      // Check if match exists
      const match = await matchRepository.findOne({
        where: { id: data.matchId }
      });

      if (!match) {
        throw { status: HTTP_STATUS.NOT_FOUND, message: 'Match not found' };
      }

      // Handle team
      let teamId: number = 0;
      
      if (data.team.id) {
        const existingTeam = await teamRepository.findOne({
          where: { id: data.team.id }
        });
        
        if (existingTeam) {
          teamId = data.team.id;
        }
      }
      
      if (!teamId) {
        const teamByName = await teamRepository.findOne({
          where: { name: data.team.name }
        });
        
        if (teamByName) {
          teamId = teamByName.id;
        } else {
          const newTeam = teamRepository.create({
            name: data.team.name,
            location: data.team.location,
            is_active: true
          });
          const savedTeam = await teamRepository.save(newTeam);
          teamId = savedTeam.id;
        }
      }

      // Check if team already assigned
      if (match.team_a_id === teamId || match.team_b_id === teamId) {
        throw { status: HTTP_STATUS.BAD_REQUEST, message: 'Team already assigned to this match' };
      }

      // Update match with team
      let teamAssignedTo: string;
      if (!match.team_a_id) {
        match.team_a_id = teamId;
        teamAssignedTo = 'team_a';
      } else if (!match.team_b_id) {
        match.team_b_id = teamId;
        teamAssignedTo = 'team_b';
      } else {
        throw { status: HTTP_STATUS.BAD_REQUEST, message: 'Both teams already assigned to this match' };
      }

      await matchRepository.save(match);

      // Handle players
      const playerResults = [];
      
      for (const playerData of data.players) {
        let playerId: number = 0;
        
        if (playerData.id) {
          const existingPlayer = await playerRepository.findOne({
            where: { id: playerData.id }
          });
          
          if (existingPlayer) {
            playerId = playerData.id;
          }
        }
        
        if (!playerId) {
          const newPlayer = playerRepository.create({
            full_name: playerData.name
          });
          const savedPlayer = await playerRepository.save(newPlayer);
          playerId = savedPlayer.id;
        }

        // Add player to match_players
        const matchPlayer = matchPlayerRepository.create({
          match_id: data.matchId,
          player_id: playerId,
          team_id: teamId,
          role: playerData.role
        });
        
        await matchPlayerRepository.save(matchPlayer);
        
        playerResults.push({
          playerId,
          name: playerData.name,
          role: playerData.role
        });
      }

      await queryRunner.commitTransaction();

      return {
        matchId: data.matchId,
        teamId,
        teamAssignedTo,
        players: playerResults
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  static async deleteTeamSetup(matchId: string, teamId: number) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const matchRepository = queryRunner.manager.getRepository(Matches);
      const matchPlayerRepository = queryRunner.manager.getRepository(MatchPlayer);

      const match = await matchRepository.findOne({ where: { id: matchId } });

      if (!match) {
        throw { status: HTTP_STATUS.NOT_FOUND, message: 'Match not found' };
      }

      if (match.team_a_id !== teamId && match.team_b_id !== teamId) {
        throw { status: HTTP_STATUS.BAD_REQUEST, message: 'Team not assigned to this match' };
      }

      // Remove team assignment
      if (match.team_a_id === teamId) {
        match.team_a_id = null as any;
      } else {
        match.team_b_id = null as any;
      }

      await matchRepository.save(match);

      // Delete all match players for this team
      await matchPlayerRepository.delete({ match_id: matchId, team_id: teamId });

      await queryRunner.commitTransaction();

      return { message: 'Team setup deleted successfully' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
