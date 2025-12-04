import { AppDataSource } from '../../../config/db';
import { Player } from '../shared/entities/Player';
import { HTTP_STATUS } from '../../../constants/status-codes';
import { GetPlayersQueryDto } from './player.dto';

export class PlayerService {
  static async createPlayer({ full_name, role, user_id }: any) {
    const playerRepository = AppDataSource.getRepository(Player);

    const player = playerRepository.create({
      full_name,
      role,
      user_id
    });

    return await playerRepository.save(player);
  }

  static async getPlayers(params: GetPlayersQueryDto) {
    const { page = 1, limit = 10, search, role, sort = 'DESC', sortBy = 'createdAt' } = params;
    const playerRepository = AppDataSource.getRepository(Player);
    
    let query = playerRepository.createQueryBuilder('player');
    
    if (search && search.trim()) {
      query = query.where('player.full_name LIKE :search', { search: `%${search.trim()}%` });
    }
    
    if (role) {
      query = query.andWhere('player.role = :role', { role });
    }
    
    query = query.orderBy(`player.${sortBy}`, sort);
    query = query.skip((page - 1) * limit).take(limit);
    
    const [players, total] = await query.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return {
      data: players,
      meta: {
        total,
        page,
        limit,
        totalPages
      }
    };
  }

  static async getPlayerById(playerId: number) {
    const playerRepository = AppDataSource.getRepository(Player);
    
    const player = await playerRepository.findOne({
      where: { id: playerId }
    });

    if (!player) {
      throw { status: HTTP_STATUS.NOT_FOUND, message: 'Player not found' };
    }

    return player;
  }

  static async updatePlayer(playerId: number, updateData: any) {
    const playerRepository = AppDataSource.getRepository(Player);

    const player = await playerRepository.findOne({
      where: { id: playerId }
    });

    if (!player) {
      throw { status: HTTP_STATUS.NOT_FOUND, message: 'Player not found' };
    }

    if (updateData.full_name) player.full_name = updateData.full_name;
    if (updateData.role) player.role = updateData.role;
    if (updateData.user_id !== undefined) player.user_id = updateData.user_id;

    return await playerRepository.save(player);
  }

  static async searchPlayers(name?: string, id?: number) {
    const playerRepository = AppDataSource.getRepository(Player);
    
    let query = playerRepository.createQueryBuilder('player');
    const conditions: string[] = [];
    const parameters: any = {};
    
    if (id) {
      conditions.push('player.id = :id');
      parameters.id = id;
    }
    
    if (name && name.trim()) {
      conditions.push('player.full_name LIKE :name');
      parameters.name = `%${name.trim()}%`;
    }
    
    if (conditions.length > 0) {
      query = query.where(conditions.join(' AND '), parameters);
    }
    
    const players = await query.orderBy('player.full_name', 'ASC').getMany();

    return { data: players };
  }

  static async deletePlayer(playerId: number) {
    const playerRepository = AppDataSource.getRepository(Player);
    
    const player = await playerRepository.findOne({
      where: { id: playerId }
    });

    if (!player) {
      throw { status: HTTP_STATUS.NOT_FOUND, message: 'Player not found' };
    }

    await playerRepository.remove(player);
    return { message: 'Player deleted successfully' };
  }
}
