"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerController = void 0;
const player_service_1 = require("./player.service");
const player_match_service_1 = require("./player-match.service");
const ApiResponse_1 = require("../../../utils/ApiResponse");
class PlayerController {
    static async createPlayer(req, res) {
        try {
            const playerData = req.body;
            const player = await player_service_1.PlayerService.createPlayer(playerData);
            const response = ApiResponse_1.ApiResponse.created(player, 'Player created successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async getPlayers(req, res) {
        try {
            const { page = 1, limit = 10, search, role, sort = 'DESC', sortBy = 'createdAt' } = req.query;
            const queryParams = {
                page: parseInt(page.toString()),
                limit: parseInt(limit.toString()),
                search,
                role,
                sort,
                sortBy
            };
            const result = await player_service_1.PlayerService.getPlayers(queryParams);
            const response = ApiResponse_1.ApiResponse.success(result, 'Players retrieved successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async getPlayerById(req, res) {
        try {
            const playerId = parseInt(req.params.id);
            const player = await player_service_1.PlayerService.getPlayerById(playerId);
            const response = ApiResponse_1.ApiResponse.success(player, 'Player retrieved successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async updatePlayer(req, res) {
        try {
            const playerId = parseInt(req.params.id);
            const updateData = req.body;
            const player = await player_service_1.PlayerService.updatePlayer(playerId, updateData);
            const response = ApiResponse_1.ApiResponse.success(player, 'Player updated successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async searchPlayers(req, res) {
        try {
            const name = req.query.name;
            const id = req.query.id ? parseInt(req.query.id) : undefined;
            if (!name && !id) {
                const response = ApiResponse_1.ApiResponse.badRequest('At least one search parameter (id or name) is required');
                return res.status(response.status).json(response);
            }
            const players = await player_service_1.PlayerService.searchPlayers(name, id);
            const response = ApiResponse_1.ApiResponse.success(players, 'Players found successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async deletePlayer(req, res) {
        try {
            const playerId = parseInt(req.params.id);
            const result = await player_service_1.PlayerService.deletePlayer(playerId);
            const response = ApiResponse_1.ApiResponse.success(result, 'Player deleted successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async getPlayerMatches(req, res) {
        try {
            const playerId = parseInt(req.params.id);
            const { format, isPlaying11, teamId, limit } = req.query;
            const options = {
                format: format,
                isPlaying11: isPlaying11 === 'true' ? true : isPlaying11 === 'false' ? false : undefined,
                teamId: teamId ? parseInt(teamId) : undefined,
                limit: limit ? parseInt(limit) : undefined
            };
            const matches = await PlayerController.playerMatchService.getPlayerMatches(playerId, options);
            const response = ApiResponse_1.ApiResponse.success(matches, 'Player matches retrieved successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async getPlayerMatchSummary(req, res) {
        try {
            const playerId = parseInt(req.params.id);
            const summary = await PlayerController.playerMatchService.getPlayerMatchSummary(playerId);
            const response = ApiResponse_1.ApiResponse.success(summary, 'Player match summary retrieved successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async getPlayerRecentMatches(req, res) {
        try {
            const playerId = parseInt(req.params.id);
            const limit = req.query.limit ? parseInt(req.query.limit) : 10;
            const matches = await PlayerController.playerMatchService.getPlayerRecentMatchesWithStats(playerId, limit);
            const response = ApiResponse_1.ApiResponse.success(matches, 'Player recent matches retrieved successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async getPlayerMatchesByDate(req, res) {
        try {
            const playerId = parseInt(req.params.id);
            const { startDate, endDate } = req.query;
            if (!startDate || !endDate) {
                throw new Error('Start date and end date are required');
            }
            const matches = await PlayerController.playerMatchService.getPlayerMatchesByDateRange(playerId, new Date(startDate), new Date(endDate));
            const response = ApiResponse_1.ApiResponse.success(matches, 'Player matches by date range retrieved successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async getPlayerMatchesByTeam(req, res) {
        try {
            const playerId = parseInt(req.params.id);
            const matches = await PlayerController.playerMatchService.getPlayerMatchesByTeam(playerId);
            const response = ApiResponse_1.ApiResponse.success(matches, 'Player matches grouped by team retrieved successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
}
exports.PlayerController = PlayerController;
// Player Match Endpoints
PlayerController.playerMatchService = new player_match_service_1.PlayerMatchService();
