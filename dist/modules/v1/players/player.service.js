"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerService = void 0;
const db_1 = require("../../../config/db");
const Player_1 = require("../shared/entities/Player");
const status_codes_1 = require("../../../constants/status-codes");
class PlayerService {
    static async createPlayer({ full_name, role, user_id }) {
        const playerRepository = db_1.AppDataSource.getRepository(Player_1.Player);
        const player = playerRepository.create({
            full_name,
            role,
            user_id
        });
        return await playerRepository.save(player);
    }
    static async getPlayers(params) {
        const { page = 1, limit = 10, search, role, sort = 'DESC', sortBy = 'createdAt' } = params;
        const playerRepository = db_1.AppDataSource.getRepository(Player_1.Player);
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
    static async getPlayerById(playerId) {
        const playerRepository = db_1.AppDataSource.getRepository(Player_1.Player);
        const player = await playerRepository.findOne({
            where: { id: playerId }
        });
        if (!player) {
            throw { status: status_codes_1.HTTP_STATUS.NOT_FOUND, message: 'Player not found' };
        }
        return player;
    }
    static async updatePlayer(playerId, updateData) {
        const playerRepository = db_1.AppDataSource.getRepository(Player_1.Player);
        const player = await playerRepository.findOne({
            where: { id: playerId }
        });
        if (!player) {
            throw { status: status_codes_1.HTTP_STATUS.NOT_FOUND, message: 'Player not found' };
        }
        if (updateData.full_name)
            player.full_name = updateData.full_name;
        if (updateData.role)
            player.role = updateData.role;
        if (updateData.user_id !== undefined)
            player.user_id = updateData.user_id;
        return await playerRepository.save(player);
    }
    static async searchPlayers(name, id) {
        const playerRepository = db_1.AppDataSource.getRepository(Player_1.Player);
        let query = playerRepository.createQueryBuilder('player');
        const conditions = [];
        const parameters = {};
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
    static async deletePlayer(playerId) {
        const playerRepository = db_1.AppDataSource.getRepository(Player_1.Player);
        const player = await playerRepository.findOne({
            where: { id: playerId }
        });
        if (!player) {
            throw { status: status_codes_1.HTTP_STATUS.NOT_FOUND, message: 'Player not found' };
        }
        await playerRepository.remove(player);
        return { message: 'Player deleted successfully' };
    }
}
exports.PlayerService = PlayerService;
