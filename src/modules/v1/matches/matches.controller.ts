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
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const status = req.query.status as string;

            if (!tenantId) {
                const response = ApiResponse.forbidden('Tenant ID is required');
                return res.status(response.status).json(response);
            }

            const matches = await MatchesService.getTenantMatches(tenantId, page, limit, status);

            const response = ApiResponse.success(matches, 'Matches retrieved successfully');
            res.status(response.status).json(response);
        } catch (error: any) {
            const errorResponse = ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }

    static async getAllMatches(req: AuthRequest, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const sortBy = (req.query.sortBy as string) || 'createdAt';

            const matches = await MatchesService.getAllMatches(page, limit, sortBy);

            const response = ApiResponse.success(matches, 'All matches retrieved successfully');
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

    static async getMatchScore(req: AuthRequest, res: Response) {
        try {
            const matchId = req.params.id;
            const tenantId = req.user?.tenantId;

            if (!tenantId) {
                const response = ApiResponse.forbidden('Tenant ID is required');
                return res.status(response.status).json(response);
            }

            const scoreData = await MatchesService.getMatchScore(matchId, tenantId);
            res.status(200).json(scoreData);
        } catch (error: any) {
            const errorResponse = ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }

    static async getPublicMatchScore(req: AuthRequest, res: Response) {
        try {
            const matchId = req.params.id;
            const tenantId = req.user?.tenantId;
            const scoreData = await MatchesService.getPublicMatchScore(matchId, tenantId!); // Assuming tenantId = 1 for public access
            res.status(200).json(scoreData);
        } catch (error: any) {
            const errorResponse = ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }

    static async getAvailableBatsmen(req: AuthRequest, res: Response) {
        try {
            const matchId = req.params.id;
            const inningsNumber = parseInt(req.params.inningsNumber);
            const tenantId = req.user?.tenantId;

            if (!tenantId) {
                const response = ApiResponse.forbidden('Tenant ID is required');
                return res.status(response.status).json(response);
            }

            const result = await MatchesService.getAvailableBatsmen(matchId, inningsNumber);
            res.status(200).json(result);
        } catch (error: any) {
            const errorResponse = ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }

    static async getBowlingTeamPlayers(req: AuthRequest, res: Response) {
        try {
            const matchId = req.params.id;
            const inningsNumber = parseInt(req.params.inningsNumber);
            const tenantId = req.user?.tenantId;

            if (!tenantId) {
                const response = ApiResponse.forbidden('Tenant ID is required');
                return res.status(response.status).json(response);
            }

            const result = await MatchesService.getBowlingTeamPlayers(matchId, tenantId);
            res.status(200).json(result);
        } catch (error: any) {
            const errorResponse = ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }

    static async recordBall(req: AuthRequest, res: Response) {
        try {
            const matchId = req.params.id;
            const ballData = req.body;
            const tenantId = req.user?.tenantId;

            if (!tenantId) {
                const response = ApiResponse.forbidden('Tenant ID is required');
                return res.status(response.status).json(response);
            }

            const result = await MatchesService.recordBall(matchId, ballData, tenantId);
            const response = ApiResponse.success(result, 'Ball recorded successfully');
            res.status(response.status).json(response);
        } catch (error: any) {
            const errorResponse = ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }

    static async completeMatch(req: AuthRequest, res: Response) {
        try {
            const matchId = req.params.id;
            const tenantId = req.user?.tenantId;

            if (!tenantId) {
                const response = ApiResponse.forbidden('Tenant ID is required');
                return res.status(response.status).json(response);
            }

            const result = await MatchesService.completeMatch(matchId, tenantId);
            const response = ApiResponse.success(result, 'Match completed successfully');
            res.status(response.status).json(response);
        } catch (error: any) {
            const errorResponse = ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }

    static async setBatsman(req: AuthRequest, res: Response) {
        try {
            const matchId = req.params.id;
            const batsmanData = req.body;
            const tenantId = req.user?.tenantId;

            if (!tenantId) {
                const response = ApiResponse.forbidden('Tenant ID is required');
                return res.status(response.status).json(response);
            }

            const result = await MatchesService.setBatsman(matchId, batsmanData, tenantId);
            const response = ApiResponse.success(result, 'Batsman set successfully');
            res.status(response.status).json(response);
        } catch (error: any) {
            const errorResponse = ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }

    static async setBowler(req: AuthRequest, res: Response) {
        try {
            const matchId = req.params.id;
            const bowlerData = req.body;
            const tenantId = req.user?.tenantId;

            if (!tenantId) {
                const response = ApiResponse.forbidden('Tenant ID is required');
                return res.status(response.status).json(response);
            }

            const result = await MatchesService.setBowler(matchId, bowlerData, tenantId);
            const response = ApiResponse.success(result, 'Bowler set successfully');
            res.status(response.status).json(response);
        } catch (error: any) {
            const errorResponse = ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }

}