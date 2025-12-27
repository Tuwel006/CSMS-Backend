"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamController = void 0;
const team_service_1 = require("./team.service");
const ApiResponse_1 = require("../../../utils/ApiResponse");
class TeamController {
    static async createTeam(req, res) {
        try {
            const teamData = req.body;
            const team = await team_service_1.TeamService.createTeam(teamData);
            const response = ApiResponse_1.ApiResponse.created(team, 'Team created successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async getTeams(req, res) {
        try {
            const { page = 1, limit = 10, search, searchBy = 'name', sort = 'DESC', sortBy = 'createdAt' } = req.query;
            const queryParams = {
                page: parseInt(page.toString()),
                limit: parseInt(limit.toString()),
                search,
                searchBy,
                sort,
                sortBy
            };
            const result = await team_service_1.TeamService.getTeams(queryParams);
            const response = ApiResponse_1.ApiResponse.success(result, 'Teams retrieved successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async searchTeams(req, res) {
        try {
            const name = req.query.name;
            const location = req.query.location;
            const id = req.query.id ? parseInt(req.query.id) : undefined;
            if (!name && !location && !id) {
                const response = ApiResponse_1.ApiResponse.badRequest('At least one search parameter (id, name, or location) is required');
                return res.status(response.status).json(response);
            }
            const teams = await team_service_1.TeamService.searchTeams(name, location, id);
            const response = ApiResponse_1.ApiResponse.success(teams, 'Teams found successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async getTeamById(req, res) {
        try {
            const teamId = parseInt(req.params.id);
            const team = await team_service_1.TeamService.getTeamById(teamId);
            const response = ApiResponse_1.ApiResponse.success(team, 'Team retrieved successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async updateTeam(req, res) {
        try {
            const teamId = parseInt(req.params.id);
            const updateData = req.body;
            const team = await team_service_1.TeamService.updateTeam(teamId, updateData);
            const response = ApiResponse_1.ApiResponse.success(team, 'Team updated successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async deleteTeam(req, res) {
        try {
            const teamId = parseInt(req.params.id);
            const result = await team_service_1.TeamService.deleteTeam(teamId);
            const response = ApiResponse_1.ApiResponse.success(result, 'Team deleted successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
}
exports.TeamController = TeamController;
