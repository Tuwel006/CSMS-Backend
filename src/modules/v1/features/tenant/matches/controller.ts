import { Response } from 'express';
import { MatchesService } from './service';
import { ScoringService } from './scoring.service';
import { ScoreboardService } from './scoreboard.service';
import {
  CreateMatchDto,
  GetMatchesQueryDto,
  MatchStartDto,
  SwitchInningsDto,
  UpdateMatchDto,
  CompleteMatchDto
} from './dtos/match.dto';
import {
  sendCreated,
  sendRaw,
  sendSuccess,
  sendMappedError,
  requireTenantId,
  requireUserId,
  parseIntQuery
} from '../../../../../utils/controller-helpers';
import { AuthRequest } from '../../../../../types/auth.types';

// Re-export the team-assignment controller so existing imports and the
// v1 router mount still work.
export { TeamAssignmentController } from './team-assignment.controller';

export class MatchesController {
  // ---- Match CRUD ----

  static async createMatch(req: AuthRequest, res: Response) {
    try {
      const tenantId = requireTenantId(req, res);
      if (!tenantId) return;

      const match = await MatchesService.createMatch(req.body as CreateMatchDto, tenantId);
      sendCreated(res, match, 'Match created successfully');
    } catch (error) {
      sendMappedError(res, error);
    }
  }

  static async listMatches(req: AuthRequest, res: Response) {
    try {
      const tenantId = requireTenantId(req, res);
      if (!tenantId) return;

      const page = parseIntQuery(req.query.page, 1);
      const limit = parseIntQuery(req.query.limit, 10);
      const status = req.query.status as string;

      const matches = await MatchesService.getTenantMatches(tenantId, page, limit, status);
      sendSuccess(res, matches, 'Matches retrieved successfully');
    } catch (error) {
      sendMappedError(res, error);
    }
  }

  static async getMatchById(req: AuthRequest, res: Response) {
    try {
      const tenantId = requireTenantId(req, res);
      if (!tenantId) return;

      const match = await MatchesService.getMatchById(req.params.id, tenantId);
      sendSuccess(res, match, 'Match retrieved successfully');
    } catch (error) {
      sendMappedError(res, error);
    }
  }

  static async updateMatch(req: AuthRequest, res: Response) {
    try {
      const tenantId = requireTenantId(req, res);
      if (!tenantId) return;

      const match = await MatchesService.updateMatch(
        req.params.id,
        req.body as UpdateMatchDto,
        tenantId
      );
      sendSuccess(res, match, 'Match updated successfully');
    } catch (error) {
      sendMappedError(res, error);
    }
  }

  static async deleteMatch(req: AuthRequest, res: Response) {
    try {
      const tenantId = requireTenantId(req, res);
      if (!tenantId) return;

      const result = await MatchesService.deleteMatch(req.params.id, tenantId);
      sendSuccess(res, result, 'Match deleted successfully');
    } catch (error) {
      sendMappedError(res, error);
    }
  }

  // ---- Match tokens (sub-resource) ----

  static async generateMatchToken(req: AuthRequest, res: Response) {
    try {
      const tenantId = requireTenantId(req, res);
      if (!tenantId) return;
      const userId = requireUserId(req, res);
      if (!userId) return;

      const match = await MatchesService.generateMatchToken(tenantId, userId);
      sendCreated(res, match, 'Match token generated successfully');
    } catch (error) {
      sendMappedError(res, error);
    }
  }

  static async getMatchByToken(req: AuthRequest, res: Response) {
    try {
      const tenantId = requireTenantId(req, res);
      if (!tenantId) return;

      const match = await MatchesService.getCurrentCreatedMatch(req.params.tokenId, tenantId);
      sendSuccess(res, match, 'Match details retrieved successfully');
    } catch (error) {
      sendMappedError(res, error);
    }
  }

  static async deleteMatchToken(req: AuthRequest, res: Response) {
    try {
      const tenantId = requireTenantId(req, res);
      if (!tenantId) return;

      const result = await MatchesService.deleteMatchToken(req.params.tokenId, tenantId);
      sendSuccess(res, result, 'Match token deleted successfully');
    } catch (error) {
      sendMappedError(res, error);
    }
  }

  // ---- Match lifecycle (state transitions) ----

  static async scheduleMatch(req: AuthRequest, res: Response) {
    try {
      const tenantId = requireTenantId(req, res);
      if (!tenantId) return;

      const match = await MatchesService.scheduleMatch(req.params.id, req.body, tenantId);
      sendSuccess(res, match, 'Match scheduled successfully');
    } catch (error) {
      sendMappedError(res, error);
    }
  }

  static async startMatch(req: AuthRequest, res: Response) {
    try {
      const tenantId = requireTenantId(req, res);
      if (!tenantId) return;

      const result = await MatchesService.startMatch(
        req.params.id,
        req.body as MatchStartDto,
        tenantId
      );
      sendSuccess(res, result, 'Match started successfully');
    } catch (error) {
      sendMappedError(res, error);
    }
  }

  static async completeMatch(req: AuthRequest, res: Response) {
    try {
      const tenantId = requireTenantId(req, res);
      if (!tenantId) return;

      const result = await MatchesService.completeMatch(
        req.params.id,
        req.body as CompleteMatchDto,
        tenantId
      );
      sendSuccess(res, result, 'Match completed successfully');
    } catch (error) {
      sendMappedError(res, error);
    }
  }

  // ---- Scoreboard (read-only) ----

  static async getMatchScore(req: AuthRequest, res: Response) {
    try {
      const tenantId = requireTenantId(req, res);
      if (!tenantId) return;

      const scoreData = await ScoreboardService.getMatchScore(req.params.id, tenantId);
      sendRaw(res, scoreData);
    } catch (error) {
      sendMappedError(res, error);
    }
  }

  static async getPublicMatchScore(req: AuthRequest, res: Response) {
    try {
      const tenantId = req.user?.tenantId ?? 1; // public access fallback
      const scoreData = await ScoreboardService.getPublicMatchScore(req.params.id, tenantId);
      sendRaw(res, scoreData);
    } catch (error) {
      sendMappedError(res, error);
    }
  }

  static async getAvailableBatsmen(req: AuthRequest, res: Response) {
    try {
      const tenantId = requireTenantId(req, res);
      if (!tenantId) return;

      const result = await ScoreboardService.getAvailableBatsmen(req.params.id, tenantId);
      sendRaw(res, result);
    } catch (error) {
      sendMappedError(res, error);
    }
  }

  static async getBowlingTeamPlayers(req: AuthRequest, res: Response) {
    try {
      const tenantId = requireTenantId(req, res);
      if (!tenantId) return;

      const result = await ScoreboardService.getBowlingTeamPlayers(req.params.id, tenantId);
      sendRaw(res, result);
    } catch (error) {
      sendMappedError(res, error);
    }
  }

  // ---- Live scoring (write-side) ----

  static async addBatsman(req: AuthRequest, res: Response) {
    try {
      const tenantId = requireTenantId(req, res);
      if (!tenantId) return;

      const result = await ScoringService.setBatsman(req.params.id, req.body, tenantId);
      sendSuccess(res, result, 'Batsman set successfully');
    } catch (error) {
      sendMappedError(res, error);
    }
  }

  static async addBowler(req: AuthRequest, res: Response) {
    try {
      const tenantId = requireTenantId(req, res);
      if (!tenantId) return;

      const result = await ScoringService.setBowler(req.params.id, req.body, tenantId);
      sendSuccess(res, result, 'Bowler set successfully');
    } catch (error) {
      sendMappedError(res, error);
    }
  }

  static async recordBall(req: AuthRequest, res: Response) {
    try {
      const tenantId = requireTenantId(req, res);
      if (!tenantId) return;

      const result = await ScoringService.recordBall(req.params.id, req.body, tenantId);
      sendSuccess(res, result, 'Ball recorded successfully');
    } catch (error) {
      sendMappedError(res, error);
    }
  }

  static async switchToNextInnings(req: AuthRequest, res: Response) {
    try {
      const tenantId = requireTenantId(req, res);
      if (!tenantId) return;

      const result = await ScoringService.switchToNextInnings(
        req.params.id,
        req.body as SwitchInningsDto,
        tenantId
      );
      sendSuccess(res, result, 'Switched to next innings successfully');
    } catch (error) {
      sendMappedError(res, error);
    }
  }
}
