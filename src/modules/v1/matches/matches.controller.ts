import { Response } from 'express';
import { MatchesService } from './matches.service';
import { CreateMatchDto, MatchStartDto, UpdateMatchDto } from './matches.dto';
import { ApiResponse } from '../../../utils/ApiResponse';
import { AuthRequest } from '../../../types/auth.types';

export class MatchesController {
    static async createMatch(req: AuthRequest, res: Response) {
        try {
            const matchData: CreateMatchDto = req.body;
            const tenantId = req.user?.tenantId;

            if (!tenantId) {
                const response = ApiResponse.forbidden('Tenant ID is required');
                return res.status(response.status).json(response);
            }

            const match = await MatchesService.createMatch(matchData, tenantId);

            const response = ApiResponse.created(match, 'Match created successfully');
            res.status(response.status).json(response);
        } catch (error: any) {
            const errorResponse = ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }

    static async generateMatchToken(req: AuthRequest, res: Response) {
        try {
            const tenantId = req.user?.tenantId;

            if (!tenantId) {
                const response = ApiResponse.forbidden('Tenant ID is required');
                return res.status(response.status).json(response);
            }

            const match = await MatchesService.generateMatchToken(tenantId);
            const response = ApiResponse.created(match, 'Match token generated successfully');
            res.status(response.status).json(response);
        } catch (error: any) {
            const errorResponse = ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }

    static async getMatches(req: AuthRequest, res: Response) {
        try {
            const tenantId = req.user?.tenantId;

            if (!tenantId) {
                const response = ApiResponse.forbidden('Tenant ID is required');
                return res.status(response.status).json(response);
            }

            const matches = await MatchesService.getMatches(tenantId);

            const response = ApiResponse.success(matches, 'Matches retrieved successfully');
            res.status(response.status).json(response);
        } catch (error: any) {
            const errorResponse = ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }

    static async getMatchById(req: AuthRequest, res: Response) {
        try {
            const matchId = req.params.id;
            const tenantId = req.user?.tenantId;

            if (!tenantId) {
                const response = ApiResponse.forbidden('Tenant ID is required');
                return res.status(response.status).json(response);
            }

            const match = await MatchesService.getMatchById(matchId, tenantId);

            const response = ApiResponse.success(match, 'Match retrieved successfully');
            res.status(response.status).json(response);
        } catch (error: any) {
            const errorResponse = ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }

    static async updateMatch(req: AuthRequest, res: Response) {
        try {
            const matchId = req.params.id;
            const updateData: UpdateMatchDto = req.body;
            const tenantId = req.user?.tenantId;

            if (!tenantId) {
                const response = ApiResponse.forbidden('Tenant ID is required');
                return res.status(response.status).json(response);
            }

            const match = await MatchesService.updateMatch(matchId, updateData, tenantId);

            const response = ApiResponse.success(match, 'Match updated successfully');
            res.status(response.status).json(response);
        } catch (error: any) {
            const errorResponse = ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }

    static async deleteMatch(req: AuthRequest, res: Response) {
        try {
            const matchId = req.params.id;
            const tenantId = req.user?.tenantId;

            if (!tenantId) {
                const response = ApiResponse.forbidden('Tenant ID is required');
                return res.status(response.status).json(response);
            }

            const result = await MatchesService.deleteMatch(matchId, tenantId);

            const response = ApiResponse.success(result, 'Match deleted successfully');
            res.status(response.status).json(response);
        } catch (error: any) {
            const errorResponse = ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }

    static async deleteMatchToken(req: AuthRequest, res: Response) {
        try {
            const matchId = req.params.id;
            const tenantId = req.user?.tenantId;

            if (!tenantId) {
                const response = ApiResponse.forbidden('Tenant ID is required');
                return res.status(response.status).json(response);
            }

            const result = await MatchesService.deleteMatchToken(matchId, tenantId);

            const response = ApiResponse.success(result, 'Match token deleted successfully');
            res.status(response.status).json(response);
        } catch (error: any) {
            const errorResponse = ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }

    static async getCurrentCreatedMatch(req: AuthRequest, res: Response) {
        try {
            const matchId = req.params.id;
            const tenantId = req.user?.tenantId;

            if (!tenantId) {
                const response = ApiResponse.forbidden('Tenant ID is required');
                return res.status(response.status).json(response);
            }

            const match = await MatchesService.getCurrentCreatedMatch(matchId, tenantId);

            const response = ApiResponse.success(match, 'Match details retrieved successfully');
            res.status(response.status).json(response);
        } catch (error: any) {
            const errorResponse = ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }

    static async scheduleMatch(req: AuthRequest, res: Response) {
        try {
            console.log('Scheduling match with data:', req.body);
            const matchId = req.params.id;
            const scheduleData = req.body;
            const tenantId = req.user?.tenantId;

            if (!tenantId) {
                const response = ApiResponse.forbidden('Tenant ID is required');
                return res.status(response.status).json(response);
            }

            const match = await MatchesService.scheduleMatch(matchId, scheduleData, tenantId);

            const response = ApiResponse.success(match, 'Match scheduled successfully');
            res.status(response.status).json(response);
        } catch (error: any) {
            const errorResponse = ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }

    static async startMatch(req: AuthRequest, res: Response) {
        try {
            const matchId = req.params.id;
            const startData: MatchStartDto = req.body;
            const tenantId = req.user?.tenantId;

            if (!tenantId) {
                const response = ApiResponse.forbidden('Tenant ID is required');
                return res.status(response.status).json(response);
            }

            const result = await MatchesService.startMatch(matchId, startData, tenantId);

            const response = ApiResponse.success(result, 'Match started successfully');
            res.status(response.status).json(response);
        } catch (error: any) {
            const errorResponse = ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
}
