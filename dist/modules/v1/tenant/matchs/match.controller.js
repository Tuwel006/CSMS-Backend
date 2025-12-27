"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchController = void 0;
const match_service_1 = require("./match.service");
const HttpResponse_1 = require("../../../../utils/HttpResponse");
class MatchController {
    static async createMatch(req, res) {
        try {
            const tenantId = req.user.tenantId;
            const matchData = req.body;
            const match = await match_service_1.MatchService.createMatch(tenantId, matchData);
            const response = HttpResponse_1.HTTP_RESPONSE.CREATED('Match created successfully', match);
            res.status(response.status).json(response);
        }
        catch (error) {
            if (error.status === 404) {
                const errorResponse = HttpResponse_1.HTTP_RESPONSE.NOT_FOUND(error.message, error);
                return res.status(errorResponse.status).json(errorResponse);
            }
            const errorResponse = HttpResponse_1.HTTP_RESPONSE.BAD_REQUEST(error.message, error);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async getMatches(req, res) {
        try {
            const tenantId = req.user.tenantId;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await match_service_1.MatchService.getMatchesByTenant(tenantId, page, limit);
            const response = HttpResponse_1.HTTP_RESPONSE.OK('Matches retrieved successfully', result);
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = HttpResponse_1.HTTP_RESPONSE.SERVER_ERROR('Internal server error', error);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async getMatchById(req, res) {
        try {
            const matchId = parseInt(req.params.id);
            const match = await match_service_1.MatchService.getMatchById(matchId.toString());
            const response = HttpResponse_1.HTTP_RESPONSE.OK('Match retrieved successfully', match);
            res.status(response.status).json(response);
        }
        catch (error) {
            if (error.status === 404) {
                const errorResponse = HttpResponse_1.HTTP_RESPONSE.NOT_FOUND(error.message, error);
                return res.status(errorResponse.status).json(errorResponse);
            }
            const errorResponse = HttpResponse_1.HTTP_RESPONSE.BAD_REQUEST(error.message, error);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async updateMatch(req, res) {
        try {
            const matchId = parseInt(req.params.id);
            const tenantId = req.user.tenantId;
            const updateData = req.body;
            const match = await match_service_1.MatchService.updateMatch(matchId.toString(), tenantId, updateData);
            const response = HttpResponse_1.HTTP_RESPONSE.UPDATED('Match updated successfully', match);
            res.status(response.status).json(response);
        }
        catch (error) {
            if (error.status === 404) {
                const errorResponse = HttpResponse_1.HTTP_RESPONSE.NOT_FOUND(error.message, error);
                return res.status(errorResponse.status).json(errorResponse);
            }
            const errorResponse = HttpResponse_1.HTTP_RESPONSE.BAD_REQUEST(error.message, error);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async deleteMatch(req, res) {
        try {
            const matchId = parseInt(req.params.id);
            const tenantId = req.user.tenantId;
            const result = await match_service_1.MatchService.deleteMatch(matchId.toString(), tenantId);
            const response = HttpResponse_1.HTTP_RESPONSE.DELETED('Match deleted successfully', result);
            res.status(response.status).json(response);
        }
        catch (error) {
            if (error.status === 404) {
                const errorResponse = HttpResponse_1.HTTP_RESPONSE.NOT_FOUND(error.message, error);
                return res.status(errorResponse.status).json(errorResponse);
            }
            const errorResponse = HttpResponse_1.HTTP_RESPONSE.BAD_REQUEST(error.message, error);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
}
exports.MatchController = MatchController;
