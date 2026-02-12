"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchesController = void 0;
const matches_service_1 = require("./matches.service");
const ApiResponse_1 = require("../../../utils/ApiResponse");
class MatchesController {
    static async createMatch(req, res) {
        try {
            const matchData = req.body;
            const tenantId = req.user?.tenantId;
            if (!tenantId) {
                const response = ApiResponse_1.ApiResponse.forbidden('Tenant ID is required');
                return res.status(response.status).json(response);
            }
            const match = await matches_service_1.MatchesService.createMatch(matchData, tenantId);
            const response = ApiResponse_1.ApiResponse.created(match, 'Match created successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async generateMatchToken(req, res) {
        try {
            const tenantId = req.user?.tenantId;
            const user_id = req.user?.id;
            if (!tenantId) {
                const response = ApiResponse_1.ApiResponse.forbidden('Tenant ID is required');
                return res.status(response.status).json(response);
            }
            if (!user_id) {
                const response = ApiResponse_1.ApiResponse.forbidden('User ID is required');
                return res.status(response.status).json(response);
            }
            const match = await matches_service_1.MatchesService.generateMatchToken(tenantId, user_id);
            const response = ApiResponse_1.ApiResponse.created(match, 'Match token generated successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async getMatchesByTenant(req, res) {
        try {
            const tenantId = req.user?.tenantId;
            if (!tenantId) {
                const response = ApiResponse_1.ApiResponse.forbidden('Tenant ID is required');
                return res.status(response.status).json(response);
            }
            const query = {
                page: req.query.page ? parseInt(req.query.page) : undefined,
                limit: req.query.limit ? parseInt(req.query.limit) : undefined,
                status: req.query.status,
                sorted: req.query.sorted,
                sorted_order: req.query.sorted_order
            };
            const result = await matches_service_1.MatchesService.getMatchesByTenant(tenantId, query);
            const response = ApiResponse_1.ApiResponse.success(result, 'Matches retrieved successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async getMatches(req, res) {
        try {
            const tenantId = req.user?.tenantId;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const status = req.query.status;
            if (!tenantId) {
                const response = ApiResponse_1.ApiResponse.forbidden('Tenant ID is required');
                return res.status(response.status).json(response);
            }
            const matches = await matches_service_1.MatchesService.getTenantMatches(tenantId, page, limit, status);
            const response = ApiResponse_1.ApiResponse.success(matches, 'Matches retrieved successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async getAllMatches(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const sortBy = req.query.sortBy || 'createdAt';
            const matches = await matches_service_1.MatchesService.getAllMatches(page, limit, sortBy);
            const response = ApiResponse_1.ApiResponse.success(matches, 'All matches retrieved successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async getMatchById(req, res) {
        try {
            const matchId = req.params.id;
            const tenantId = req.user?.tenantId;
            if (!tenantId) {
                const response = ApiResponse_1.ApiResponse.forbidden('Tenant ID is required');
                return res.status(response.status).json(response);
            }
            const match = await matches_service_1.MatchesService.getMatchById(matchId, tenantId);
            const response = ApiResponse_1.ApiResponse.success(match, 'Match retrieved successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async updateMatch(req, res) {
        try {
            const matchId = req.params.id;
            const updateData = req.body;
            const tenantId = req.user?.tenantId;
            if (!tenantId) {
                const response = ApiResponse_1.ApiResponse.forbidden('Tenant ID is required');
                return res.status(response.status).json(response);
            }
            const match = await matches_service_1.MatchesService.updateMatch(matchId, updateData, tenantId);
            const response = ApiResponse_1.ApiResponse.success(match, 'Match updated successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async deleteMatch(req, res) {
        try {
            const matchId = req.params.id;
            const tenantId = req.user?.tenantId;
            if (!tenantId) {
                const response = ApiResponse_1.ApiResponse.forbidden('Tenant ID is required');
                return res.status(response.status).json(response);
            }
            const result = await matches_service_1.MatchesService.deleteMatch(matchId, tenantId);
            const response = ApiResponse_1.ApiResponse.success(result, 'Match deleted successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async deleteMatchToken(req, res) {
        try {
            const matchId = req.params.id;
            const tenantId = req.user?.tenantId;
            if (!tenantId) {
                const response = ApiResponse_1.ApiResponse.forbidden('Tenant ID is required');
                return res.status(response.status).json(response);
            }
            const result = await matches_service_1.MatchesService.deleteMatchToken(matchId, tenantId);
            const response = ApiResponse_1.ApiResponse.success(result, 'Match token deleted successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async getCurrentCreatedMatch(req, res) {
        try {
            const matchId = req.params.id;
            const tenantId = req.user?.tenantId;
            if (!tenantId) {
                const response = ApiResponse_1.ApiResponse.forbidden('Tenant ID is required');
                return res.status(response.status).json(response);
            }
            const match = await matches_service_1.MatchesService.getCurrentCreatedMatch(matchId, tenantId);
            const response = ApiResponse_1.ApiResponse.success(match, 'Match details retrieved successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async scheduleMatch(req, res) {
        try {
            console.log('Scheduling match with data:', req.body);
            const matchId = req.params.id;
            const scheduleData = req.body;
            const tenantId = req.user?.tenantId;
            if (!tenantId) {
                const response = ApiResponse_1.ApiResponse.forbidden('Tenant ID is required');
                return res.status(response.status).json(response);
            }
            const match = await matches_service_1.MatchesService.scheduleMatch(matchId, scheduleData, tenantId);
            const response = ApiResponse_1.ApiResponse.success(match, 'Match scheduled successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async startMatch(req, res) {
        try {
            const matchId = req.params.id;
            const startData = req.body;
            const tenantId = req.user?.tenantId;
            if (!tenantId) {
                const response = ApiResponse_1.ApiResponse.forbidden('Tenant ID is required');
                return res.status(response.status).json(response);
            }
            const result = await matches_service_1.MatchesService.startMatch(matchId, startData, tenantId);
            const response = ApiResponse_1.ApiResponse.success(result, 'Match started successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async getMatchScore(req, res) {
        try {
            const matchId = req.params.id;
            const tenantId = req.user?.tenantId;
            if (!tenantId) {
                const response = ApiResponse_1.ApiResponse.forbidden('Tenant ID is required');
                return res.status(response.status).json(response);
            }
            const scoreData = await matches_service_1.MatchesService.getMatchScore(matchId, tenantId);
            res.status(200).json(scoreData);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async getPublicMatchScore(req, res) {
        try {
            const matchId = req.params.id;
            const tenantId = req.user?.tenantId;
            const scoreData = await matches_service_1.MatchesService.getPublicMatchScore(matchId, tenantId); // Assuming tenantId = 1 for public access
            res.status(200).json(scoreData);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async getAvailableBatsmen(req, res) {
        try {
            const matchId = req.params.id;
            const tenantId = req.user?.tenantId;
            if (!tenantId) {
                const response = ApiResponse_1.ApiResponse.forbidden('Tenant ID is required');
                return res.status(response.status).json(response);
            }
            const result = await matches_service_1.MatchesService.getAvailableBatsmen(matchId, tenantId);
            res.status(200).json(result);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async getBowlingTeamPlayers(req, res) {
        try {
            const matchId = req.params.id;
            const inningsNumber = parseInt(req.params.inningsNumber);
            const tenantId = req.user?.tenantId;
            if (!tenantId) {
                const response = ApiResponse_1.ApiResponse.forbidden('Tenant ID is required');
                return res.status(response.status).json(response);
            }
            const result = await matches_service_1.MatchesService.getBowlingTeamPlayers(matchId, tenantId);
            res.status(200).json(result);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async recordBall(req, res) {
        try {
            const matchId = req.params.id;
            const ballData = req.body;
            const tenantId = req.user?.tenantId;
            if (!tenantId) {
                const response = ApiResponse_1.ApiResponse.forbidden('Tenant ID is required');
                return res.status(response.status).json(response);
            }
            const result = await matches_service_1.MatchesService.recordBall(matchId, ballData, tenantId);
            const response = ApiResponse_1.ApiResponse.success(result, 'Ball recorded successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async completeMatch(req, res) {
        try {
            const matchId = req.params.id;
            const tenantId = req.user?.tenantId;
            if (!tenantId) {
                const response = ApiResponse_1.ApiResponse.forbidden('Tenant ID is required');
                return res.status(response.status).json(response);
            }
            const result = await matches_service_1.MatchesService.completeMatch(matchId, tenantId);
            const response = ApiResponse_1.ApiResponse.success(result, 'Match completed successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async setBatsman(req, res) {
        try {
            const matchId = req.params.id;
            const batsmanData = req.body;
            const tenantId = req.user?.tenantId;
            if (!tenantId) {
                const response = ApiResponse_1.ApiResponse.forbidden('Tenant ID is required');
                return res.status(response.status).json(response);
            }
            const result = await matches_service_1.MatchesService.setBatsman(matchId, batsmanData, tenantId);
            const response = ApiResponse_1.ApiResponse.success(result, 'Batsman set successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async setBowler(req, res) {
        try {
            const matchId = req.params.id;
            const bowlerData = req.body;
            const tenantId = req.user?.tenantId;
            if (!tenantId) {
                const response = ApiResponse_1.ApiResponse.forbidden('Tenant ID is required');
                return res.status(response.status).json(response);
            }
            const result = await matches_service_1.MatchesService.setBowler(matchId, bowlerData, tenantId);
            const response = ApiResponse_1.ApiResponse.success(result, 'Bowler set successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async switchToNextInnings(req, res) {
        try {
            const matchId = req.params.id;
            const switchData = req.body;
            const tenantId = req.user?.tenantId;
            if (!tenantId) {
                const response = ApiResponse_1.ApiResponse.forbidden('Tenant ID is required');
                return res.status(response.status).json(response);
            }
            const result = await matches_service_1.MatchesService.switchToNextInnings(matchId, switchData, tenantId);
            const response = ApiResponse_1.ApiResponse.success(result, 'Switched to next innings successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
}
exports.MatchesController = MatchesController;
