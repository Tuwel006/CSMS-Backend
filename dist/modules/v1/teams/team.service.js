"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamService = void 0;
const db_1 = require("../../../config/db");
const Team_1 = require("../shared/entities/Team");
const status_codes_1 = require("../../../constants/status-codes");
class TeamService {
    static async createTeam({ name, short_name, logo_url, location, tenant_id }) {
        const teamRepository = db_1.AppDataSource.getRepository(Team_1.Team);
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
    static async getTeams(params) {
        const { page, limit, search, searchBy, sort, sortBy } = params;
        const teamRepository = db_1.AppDataSource.getRepository(Team_1.Team);
        let query = teamRepository.createQueryBuilder('team');
        // Apply search filter
        if (search && search.trim()) {
            const searchValue = `%${search.trim()}%`;
            query = query.where(`team.${searchBy} LIKE :search`, { search: searchValue });
        }
        // Apply sorting
        query = query.orderBy(`team.${sortBy}`, sort);
        // Apply pagination
        query = query.skip((page - 1) * limit).take(limit);
        const [teams, total] = await query.getManyAndCount();
        const totalPages = Math.ceil(total / limit);
        return {
            data: teams,
            meta: {
                total,
                page: page,
                limit: limit,
                totalPages
            }
        };
    }
    static async searchTeams(name, location, id) {
        const teamRepository = db_1.AppDataSource.getRepository(Team_1.Team);
        let query = teamRepository.createQueryBuilder('team');
        const conditions = [];
        const parameters = {};
        if (id) {
            conditions.push('team.id = :id');
            parameters.id = id;
        }
        if (name && name.trim()) {
            conditions.push('(team.name LIKE :name OR team.short_name LIKE :name)');
            parameters.name = `%${name.trim()}%`;
        }
        if (location && location.trim()) {
            conditions.push('team.location LIKE :location');
            parameters.location = `%${location.trim()}%`;
        }
        if (conditions.length > 0) {
            query = query.where(conditions.join(' AND '), parameters);
        }
        const teams = await query.orderBy('team.name', 'ASC').getMany();
        return { data: teams };
    }
    static async getTeamById(teamId) {
        const teamRepository = db_1.AppDataSource.getRepository(Team_1.Team);
        const team = await teamRepository.findOne({
            where: { id: teamId }
        });
        if (!team) {
            throw { status: status_codes_1.HTTP_STATUS.NOT_FOUND, message: 'Team not found' };
        }
        return team;
    }
    static async updateTeam(teamId, updateData) {
        const teamRepository = db_1.AppDataSource.getRepository(Team_1.Team);
        const team = await teamRepository.findOne({
            where: { id: teamId }
        });
        if (!team) {
            throw { status: status_codes_1.HTTP_STATUS.NOT_FOUND, message: 'Team not found' };
        }
        // Check if name is being updated and already exists
        if (updateData.name && updateData.name !== team.name) {
            const existingTeam = await teamRepository.findOne({
                where: { name: updateData.name }
            });
            if (existingTeam) {
                throw { status: status_codes_1.HTTP_STATUS.BAD_REQUEST, message: 'Team name already exists' };
            }
        }
        // Check if short_name is being updated and already exists
        if (updateData.short_name && updateData.short_name !== team.short_name) {
            const existingShortName = await teamRepository.findOne({
                where: { short_name: updateData.short_name }
            });
            if (existingShortName) {
                throw { status: status_codes_1.HTTP_STATUS.BAD_REQUEST, message: 'Team short name already exists' };
            }
        }
        // Update fields
        if (updateData.name)
            team.name = updateData.name;
        if (updateData.short_name)
            team.short_name = updateData.short_name;
        if (updateData.logo_url !== undefined)
            team.logo_url = updateData.logo_url;
        if (updateData.location !== undefined)
            team.location = updateData.location;
        return await teamRepository.save(team);
    }
    static async deleteTeam(teamId) {
        const teamRepository = db_1.AppDataSource.getRepository(Team_1.Team);
        const team = await teamRepository.findOne({
            where: { id: teamId }
        });
        if (!team) {
            throw { status: status_codes_1.HTTP_STATUS.NOT_FOUND, message: 'Team not found' };
        }
        await teamRepository.remove(team);
        return { message: 'Team deleted successfully' };
    }
}
exports.TeamService = TeamService;
