"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamSetupController = void 0;
const team_setup_service_1 = require("./team-setup.service");
const ApiResponse_1 = require("../../../utils/ApiResponse");
const status_codes_1 = require("../../../constants/status-codes");
class TeamSetupController {
    static async setupTeam(req, res) {
        try {
            const setupData = req.body;
            const result = await team_setup_service_1.TeamSetupService.setupTeam(setupData);
            const response = ApiResponse_1.ApiResponse.created(result, 'Team setup completed successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const status = error.status || status_codes_1.HTTP_STATUS.BAD_REQUEST;
            let errorResponse;
            switch (status) {
                case status_codes_1.HTTP_STATUS.NOT_FOUND:
                    errorResponse = ApiResponse_1.ApiResponse.notFound(error.message);
                    break;
                case status_codes_1.HTTP_STATUS.BAD_REQUEST:
                    errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
                    break;
                default:
                    errorResponse = ApiResponse_1.ApiResponse.serverError(error.message);
            }
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async updateTeamSetup(req, res) {
        try {
            const { matchId, teamId } = req.params;
            const updateData = req.body;
            const result = await team_setup_service_1.TeamSetupService.updateTeamSetup(matchId, Number(teamId), updateData);
            const response = ApiResponse_1.ApiResponse.success(result, 'Team setup updated successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const status = error.status || status_codes_1.HTTP_STATUS.BAD_REQUEST;
            let errorResponse;
            switch (status) {
                case status_codes_1.HTTP_STATUS.NOT_FOUND:
                    errorResponse = ApiResponse_1.ApiResponse.notFound(error.message);
                    break;
                case status_codes_1.HTTP_STATUS.BAD_REQUEST:
                    errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
                    break;
                default:
                    errorResponse = ApiResponse_1.ApiResponse.serverError(error.message);
            }
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async deleteTeamSetup(req, res) {
        try {
            const { matchId, teamId } = req.params;
            const result = await team_setup_service_1.TeamSetupService.deleteTeamSetup(matchId, Number(teamId));
            const response = ApiResponse_1.ApiResponse.success(result, result.message);
            res.status(response.status).json(response);
        }
        catch (error) {
            const status = error.status || status_codes_1.HTTP_STATUS.BAD_REQUEST;
            let errorResponse;
            switch (status) {
                case status_codes_1.HTTP_STATUS.NOT_FOUND:
                    errorResponse = ApiResponse_1.ApiResponse.notFound(error.message);
                    break;
                case status_codes_1.HTTP_STATUS.BAD_REQUEST:
                    errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
                    break;
                default:
                    errorResponse = ApiResponse_1.ApiResponse.serverError(error.message);
            }
            res.status(errorResponse.status).json(errorResponse);
        }
    }
}
exports.TeamSetupController = TeamSetupController;
