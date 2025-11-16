import { Request, Response } from 'express';
import { MatchService } from './match.service';
import { HTTP_RESPONSE } from '../../../../utils/HttpResponse';

interface AuthRequest extends Request {
  user?: {
    id: number;
    tenantId: number;
    isGlobalAdmin: boolean;
  };
}

export class MatchController {
  static async createMatch(req: AuthRequest, res: Response) {
    try {
      const tenantId = req.user!.tenantId;
      const matchData = req.body;
      
      const match = await MatchService.createMatch(tenantId, matchData);
      
      const response = HTTP_RESPONSE.CREATED('Match created successfully', match);
      res.status(response.status).json(response);
    } catch (error: any) {
      if (error.status === 404) {
        const errorResponse = HTTP_RESPONSE.NOT_FOUND(error.message, error);
        return res.status(errorResponse.status).json(errorResponse);
      }
      const errorResponse = HTTP_RESPONSE.BAD_REQUEST(error.message, error);
      res.status(errorResponse.status).json(errorResponse);
    }
  }

  static async getMatches(req: AuthRequest, res: Response) {
    try {
      const tenantId = req.user!.tenantId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await MatchService.getMatchesByTenant(tenantId, page, limit);
      
      const response = HTTP_RESPONSE.OK('Matches retrieved successfully', result);
      res.status(response.status).json(response);
    } catch (error: any) {
      const errorResponse = HTTP_RESPONSE.SERVER_ERROR('Internal server error', error);
      res.status(errorResponse.status).json(errorResponse);
    }
  }

  static async getMatchById(req: AuthRequest, res: Response) {
    try {
      const matchId = parseInt(req.params.id);
      
      const match = await MatchService.getMatchById(matchId);
      
      const response = HTTP_RESPONSE.OK('Match retrieved successfully', match);
      res.status(response.status).json(response);
    } catch (error: any) {
      if (error.status === 404) {
        const errorResponse = HTTP_RESPONSE.NOT_FOUND(error.message, error);
        return res.status(errorResponse.status).json(errorResponse);
      }
      const errorResponse = HTTP_RESPONSE.BAD_REQUEST(error.message, error);
      res.status(errorResponse.status).json(errorResponse);
    }
  }

  static async updateMatch(req: AuthRequest, res: Response) {
    try {
      const matchId = parseInt(req.params.id);
      const tenantId = req.user!.tenantId;
      const updateData = req.body;
      
      const match = await MatchService.updateMatch(matchId, tenantId, updateData);
      
      const response = HTTP_RESPONSE.UPDATED('Match updated successfully', match);
      res.status(response.status).json(response);
    } catch (error: any) {
      if (error.status === 404) {
        const errorResponse = HTTP_RESPONSE.NOT_FOUND(error.message, error);
        return res.status(errorResponse.status).json(errorResponse);
      }
      const errorResponse = HTTP_RESPONSE.BAD_REQUEST(error.message, error);
      res.status(errorResponse.status).json(errorResponse);
    }
  }

  static async deleteMatch(req: AuthRequest, res: Response) {
    try {
      const matchId = parseInt(req.params.id);
      const tenantId = req.user!.tenantId;
      
      const result = await MatchService.deleteMatch(matchId, tenantId);
      
      const response = HTTP_RESPONSE.DELETED('Match deleted successfully', result);
      res.status(response.status).json(response);
    } catch (error: any) {
      if (error.status === 404) {
        const errorResponse = HTTP_RESPONSE.NOT_FOUND(error.message, error);
        return res.status(errorResponse.status).json(errorResponse);
      }
      const errorResponse = HTTP_RESPONSE.BAD_REQUEST(error.message, error);
      res.status(errorResponse.status).json(errorResponse);
    }
  }
}