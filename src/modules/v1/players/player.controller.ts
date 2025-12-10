import { Request, Response } from 'express';
import { PlayerService } from './player.service';
import { PlayerMatchService } from './player-match.service';
import { CreatePlayerDto, UpdatePlayerDto, GetPlayersQueryDto } from './player.dto';
import { ApiResponse } from '../../../utils/ApiResponse';

export class PlayerController {
  static async createPlayer(req: Request<{}, {}, CreatePlayerDto>, res: Response) {
    try {
      const playerData = req.body;

      const player = await PlayerService.createPlayer(playerData);

      const response = ApiResponse.created(player, 'Player created successfully');
      res.status(response.status).json(response);
    } catch (error: any) {
      const errorResponse = ApiResponse.badRequest(error.message);
      res.status(errorResponse.status).json(errorResponse);
    }
  }

  static async getPlayers(req: Request<{}, {}, {}, GetPlayersQueryDto>, res: Response) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        role,
        sort = 'DESC',
        sortBy = 'createdAt'
      } = req.query;

      const queryParams = {
        page: parseInt(page.toString()),
        limit: parseInt(limit.toString()),
        search,
        role,
        sort,
        sortBy
      };

      const result = await PlayerService.getPlayers(queryParams);

      const response = ApiResponse.success(result, 'Players retrieved successfully');
      res.status(response.status).json(response);
    } catch (error: any) {
      const errorResponse = ApiResponse.badRequest(error.message);
      res.status(errorResponse.status).json(errorResponse);
    }
  }

  static async getPlayerById(req: Request, res: Response) {
    try {
      const playerId = parseInt(req.params.id);

      const player = await PlayerService.getPlayerById(playerId);

      const response = ApiResponse.success(player, 'Player retrieved successfully');
      res.status(response.status).json(response);
    } catch (error: any) {
      const errorResponse = ApiResponse.badRequest(error.message);
      res.status(errorResponse.status).json(errorResponse);
    }
  }

  static async updatePlayer(req: Request<{ id: string }, {}, UpdatePlayerDto>, res: Response) {
    try {
      const playerId = parseInt(req.params.id);
      const updateData = req.body;

      const player = await PlayerService.updatePlayer(playerId, updateData);

      const response = ApiResponse.success(player, 'Player updated successfully');
      res.status(response.status).json(response);
    } catch (error: any) {
      const errorResponse = ApiResponse.badRequest(error.message);
      res.status(errorResponse.status).json(errorResponse);
    }
  }

  static async searchPlayers(req: Request, res: Response) {
    try {
      const name = req.query.name as string;
      const id = req.query.id ? parseInt(req.query.id as string) : undefined;

      if (!name && !id) {
        const response = ApiResponse.badRequest('At least one search parameter (id or name) is required');
        return res.status(response.status).json(response);
      }

      const players = await PlayerService.searchPlayers(name, id);

      const response = ApiResponse.success(players, 'Players found successfully');
      res.status(response.status).json(response);
    } catch (error: any) {
      const errorResponse = ApiResponse.badRequest(error.message);
      res.status(errorResponse.status).json(errorResponse);
    }
  }

  static async deletePlayer(req: Request, res: Response) {
    try {
      const playerId = parseInt(req.params.id);

      const result = await PlayerService.deletePlayer(playerId);

      const response = ApiResponse.success(result, 'Player deleted successfully');
      res.status(response.status).json(response);
    } catch (error: any) {
      const errorResponse = ApiResponse.badRequest(error.message);
      res.status(errorResponse.status).json(errorResponse);
    }
  }

  // Player Match Endpoints
  private static playerMatchService = new PlayerMatchService();

  static async getPlayerMatches(req: Request, res: Response) {
    try {
      const playerId = parseInt(req.params.id);
      const { format, isPlaying11, teamId, limit } = req.query;

      const options = {
        format: format as any,
        isPlaying11: isPlaying11 === 'true' ? true : isPlaying11 === 'false' ? false : undefined,
        teamId: teamId ? parseInt(teamId as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined
      };

      const matches = await PlayerController.playerMatchService.getPlayerMatches(playerId, options);

      const response = ApiResponse.success(matches, 'Player matches retrieved successfully');
      res.status(response.status).json(response);
    } catch (error: any) {
      const errorResponse = ApiResponse.badRequest(error.message);
      res.status(errorResponse.status).json(errorResponse);
    }
  }

  static async getPlayerMatchSummary(req: Request, res: Response) {
    try {
      const playerId = parseInt(req.params.id);

      const summary = await PlayerController.playerMatchService.getPlayerMatchSummary(playerId);

      const response = ApiResponse.success(summary, 'Player match summary retrieved successfully');
      res.status(response.status).json(response);
    } catch (error: any) {
      const errorResponse = ApiResponse.badRequest(error.message);
      res.status(errorResponse.status).json(errorResponse);
    }
  }

  static async getPlayerRecentMatches(req: Request, res: Response) {
    try {
      const playerId = parseInt(req.params.id);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      const matches = await PlayerController.playerMatchService.getPlayerRecentMatchesWithStats(playerId, limit);

      const response = ApiResponse.success(matches, 'Player recent matches retrieved successfully');
      res.status(response.status).json(response);
    } catch (error: any) {
      const errorResponse = ApiResponse.badRequest(error.message);
      res.status(errorResponse.status).json(errorResponse);
    }
  }

  static async getPlayerMatchesByDate(req: Request, res: Response) {
    try {
      const playerId = parseInt(req.params.id);
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        throw new Error('Start date and end date are required');
      }

      const matches = await PlayerController.playerMatchService.getPlayerMatchesByDateRange(
        playerId,
        new Date(startDate as string),
        new Date(endDate as string)
      );

      const response = ApiResponse.success(matches, 'Player matches by date range retrieved successfully');
      res.status(response.status).json(response);
    } catch (error: any) {
      const errorResponse = ApiResponse.badRequest(error.message);
      res.status(errorResponse.status).json(errorResponse);
    }
  }

  static async getPlayerMatchesByTeam(req: Request, res: Response) {
    try {
      const playerId = parseInt(req.params.id);

      const matches = await PlayerController.playerMatchService.getPlayerMatchesByTeam(playerId);

      const response = ApiResponse.success(matches, 'Player matches grouped by team retrieved successfully');
      res.status(response.status).json(response);
    } catch (error: any) {
      const errorResponse = ApiResponse.badRequest(error.message);
      res.status(errorResponse.status).json(errorResponse);
    }
  }
}
