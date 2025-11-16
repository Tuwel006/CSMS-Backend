import { AppDataSource } from '../../../config/db';
import { Team } from '../shared/entities/Team';
import { HTTP_STATUS } from '../../../constants/status-codes';
import { GetTeamsQueryDto } from './team.dto';

export class TeamService {
  static async createTeam({ name, short_name, logo_url, location, tenant_id }: any) {
    const teamRepository = AppDataSource.getRepository(Team);

    const team = teamRepository.create({
      name,
      short_name,
      logo_url,
      location,
      tenant_id,
      is_active: true
    });

    return await teamRepository.save(team);
  }

  static async getTeams(params: GetTeamsQueryDto) {
    const { page, limit, search, searchBy, sort, sortBy } = params;
    const teamRepository = AppDataSource.getRepository(Team);
    
    let query = teamRepository.createQueryBuilder('team');
    
    // Apply search filter
    if (search && search.trim()) {
      const searchValue = `%${search.trim()}%`;
      query = query.where(`team.${searchBy} LIKE :search`, { search: searchValue });
    }
    
    // Apply sorting
    query = query.orderBy(`team.${sortBy}`, sort);
    
    // Apply pagination
    query = query.skip((page! - 1) * limit!).take(limit);
    
    const [teams, total] = await query.getManyAndCount();
    const totalPages = Math.ceil(total / limit!);

    return {
      data: teams,
      meta: {
        total,
        page: page!,
        limit: limit!,
        totalPages
      }
    };
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

    return { data: teams };
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