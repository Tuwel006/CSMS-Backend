"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchService = void 0;
const db_1 = require("../../../../config/db");
const Match_1 = require("../../shared/entities/Match");
const Team_1 = require("../../shared/entities/Team");
const MatchPlayer_1 = require("../../shared/entities/MatchPlayer");
const team_service_1 = require("../../teams/team.service");
const status_codes_1 = require("../../../../constants/status-codes");
class MatchService {
    static async createMatch(tenantId, matchData) {
        const queryRunner = db_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const matchRepository = queryRunner.manager.getRepository(Match_1.Match);
            const teamRepository = queryRunner.manager.getRepository(Team_1.Team);
            let teamAId = matchData.teamAId;
            let teamBId = matchData.teamBId;
            // Create Team A if name is provided
            if (matchData.teamAName) {
                const savedTeamA = await team_service_1.TeamService.createTeam({
                    name: matchData.teamAName,
                    location: matchData.teamALocation,
                    tenant_id: tenantId
                });
                teamAId = savedTeamA.id;
            }
            // Create Team B if name is provided
            if (matchData.teamBName) {
                const savedTeamB = await team_service_1.TeamService.createTeam({
                    name: matchData.teamBName,
                    location: matchData.teamBLocation,
                    tenant_id: tenantId
                });
                teamBId = savedTeamB.id;
            }
            // Verify teams exist if IDs were provided
            if (matchData.teamAId) {
                const teamA = await teamRepository.findOne({ where: { id: teamAId, tenant_id: tenantId } });
                if (!teamA) {
                    throw { status: status_codes_1.HTTP_STATUS.NOT_FOUND, message: 'Team A not found' };
                }
            }
            if (matchData.teamBId) {
                const teamB = await teamRepository.findOne({ where: { id: teamBId, tenant_id: tenantId } });
                if (!teamB) {
                    throw { status: status_codes_1.HTTP_STATUS.NOT_FOUND, message: 'Team B not found' };
                }
            }
            // Create match
            const match = matchRepository.create({
                team_a_id: teamAId,
                team_b_id: teamBId,
                match_date: new Date(matchData.matchDate),
                format: matchData.format,
                venue: matchData.venue,
                status: matchData.status,
                tenant_id: tenantId
            });
            const savedMatch = await matchRepository.save(match);
            await queryRunner.commitTransaction();
            return await this.getMatchById(savedMatch.id);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    static async getMatchesByTenant(tenantId, page = 1, limit = 10) {
        const matchRepository = db_1.AppDataSource.getRepository(Match_1.Match);
        const [matches, total] = await matchRepository.findAndCount({
            where: { tenant_id: tenantId },
            relations: ['teamA', 'teamB'],
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' }
        });
        const formattedMatches = matches.map(match => ({
            id: match.id,
            teamA: {
                id: match.teamA.id,
                name: match.teamA.name,
                location: match.teamA.location
            },
            teamB: {
                id: match.teamB.id,
                name: match.teamB.name,
                location: match.teamB.location
            },
            matchDate: match.match_date,
            format: match.format,
            venue: match.venue,
            status: match.status,
            isActive: match.is_active,
            createdAt: match.createdAt,
            updatedAt: match.updatedAt
        }));
        const totalPages = Math.ceil(total / limit);
        return {
            data: formattedMatches,
            meta: {
                total,
                page,
                limit,
                totalPages
            }
        };
    }
    static async getMatchById(matchId) {
        const matchRepository = db_1.AppDataSource.getRepository(Match_1.Match);
        const match = await matchRepository.findOne({
            where: { id: matchId },
            relations: ['teamA', 'teamB']
        });
        if (!match) {
            throw { status: status_codes_1.HTTP_STATUS.NOT_FOUND, message: 'Match not found' };
        }
        return {
            id: match.id,
            teamA: {
                id: match.teamA.id,
                name: match.teamA.name,
                location: match.teamA.location
            },
            teamB: {
                id: match.teamB.id,
                name: match.teamB.name,
                location: match.teamB.location
            },
            matchDate: match.match_date,
            format: match.format,
            venue: match.venue,
            status: match.status,
            isActive: match.is_active,
            createdAt: match.createdAt,
            updatedAt: match.updatedAt
        };
    }
    static async updateMatch(matchId, tenantId, updateData) {
        const matchRepository = db_1.AppDataSource.getRepository(Match_1.Match);
        const match = await matchRepository.findOne({
            where: { id: matchId, tenant_id: tenantId }
        });
        if (!match) {
            throw { status: status_codes_1.HTTP_STATUS.NOT_FOUND, message: 'Match not found' };
        }
        if (updateData.teamAId)
            match.team_a_id = updateData.teamAId;
        if (updateData.teamBId)
            match.team_b_id = updateData.teamBId;
        if (updateData.matchDate)
            match.match_date = new Date(updateData.matchDate);
        if (updateData.format)
            match.format = updateData.format;
        if (updateData.venue)
            match.venue = updateData.venue;
        if (updateData.status)
            match.status = updateData.status;
        if (updateData.isActive !== undefined)
            match.is_active = updateData.isActive;
        await matchRepository.save(match);
        return await this.getMatchById(matchId);
    }
    static async deleteMatch(matchId, tenantId) {
        const queryRunner = db_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const matchRepository = queryRunner.manager.getRepository(Match_1.Match);
            const matchPlayerRepository = queryRunner.manager.getRepository(MatchPlayer_1.MatchPlayer);
            const match = await matchRepository.findOne({
                where: { id: matchId, tenant_id: tenantId }
            });
            if (!match) {
                throw { status: status_codes_1.HTTP_STATUS.NOT_FOUND, message: 'Match not found' };
            }
            await matchPlayerRepository.delete({ match_id: matchId });
            await matchRepository.remove(match);
            await queryRunner.commitTransaction();
            return { message: 'Match deleted successfully' };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
}
exports.MatchService = MatchService;
