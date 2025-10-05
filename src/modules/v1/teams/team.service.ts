import { AppDataSource } from '../../../config/db';
import { Team } from '../shared/entities/Team';
import { HTTP_STATUS } from '../../../constants/status-codes';

export class TeamService {
  static async createTeam({ name, short_name, logo_url, location }: any) {
    const teamRepository = AppDataSource.getRepository(Team);

    // Check if team name exists
    const existingTeam = await teamRepository.findOne({
      where: { name }
    });

    if (existingTeam) {
      throw { status: HTTP_STATUS.BAD_REQUEST, message: 'Team name already exists' };
    }

    // Check if short name exists
    const existingShortName = await teamRepository.findOne({
      where: { short_name }
    });

    if (existingShortName) {
      throw { status: HTTP_STATUS.BAD_REQUEST, message: 'Team short name already exists' };
    }

    const team = teamRepository.create({
      name,
      short_name,
      logo_url,
      location
    });

    return await teamRepository.save(team);
  }

  static async getTeams(page = 1, limit = 10) {
    const teamRepository = AppDataSource.getRepository(Team);
    
    const [teams, total] = await teamRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' }
    });

    return { teams, total, page, limit };
  }

  static async searchTeams(name: string, location?: string) {
    const teamRepository = AppDataSource.getRepository(Team);
    
    let query = teamRepository
      .createQueryBuilder('team')
      .where('team.name LIKE :name OR team.short_name LIKE :name', { name: `%${name}%` });
    
    if (location && location.trim().length > 0) {
      query = query.andWhere('team.location LIKE :location', { location: `%${location}%` });
    }
    
    const teams = await query
      .orderBy('team.name', 'ASC')
      .getMany();

    return teams;
  }

  static async getTeamById(teamId: number) {
    const teamRepository = AppDataSource.getRepository(Team);
    
    const team = await teamRepository.findOne({
      where: { id: teamId }
    });

    if (!team) {
      throw { status: HTTP_STATUS.NOT_FOUND, message: 'Team not found' };
    }

    return team;
  }

  static async updateTeam(teamId: number, updateData: any) {
    const teamRepository = AppDataSource.getRepository(Team);

    const team = await teamRepository.findOne({
      where: { id: teamId }
    });

    if (!team) {
      throw { status: HTTP_STATUS.NOT_FOUND, message: 'Team not found' };
    }

    // Check if name is being updated and already exists
    if (updateData.name && updateData.name !== team.name) {
      const existingTeam = await teamRepository.findOne({
        where: { name: updateData.name }
      });

      if (existingTeam) {
        throw { status: HTTP_STATUS.BAD_REQUEST, message: 'Team name already exists' };
      }
    }

    // Check if short_name is being updated and already exists
    if (updateData.short_name && updateData.short_name !== team.short_name) {
      const existingShortName = await teamRepository.findOne({
        where: { short_name: updateData.short_name }
      });

      if (existingShortName) {
        throw { status: HTTP_STATUS.BAD_REQUEST, message: 'Team short name already exists' };
      }
    }

    // Update fields
    if (updateData.name) team.name = updateData.name;
    if (updateData.short_name) team.short_name = updateData.short_name;
    if (updateData.logo_url !== undefined) team.logo_url = updateData.logo_url;
    if (updateData.location !== undefined) team.location = updateData.location;

    return await teamRepository.save(team);
  }

  static async deleteTeam(teamId: number) {
    const teamRepository = AppDataSource.getRepository(Team);
    
    const team = await teamRepository.findOne({
      where: { id: teamId }
    });

    if (!team) {
      throw { status: HTTP_STATUS.NOT_FOUND, message: 'Team not found' };
    }

    await teamRepository.remove(team);
    return { message: 'Team deleted successfully' };
  }
}