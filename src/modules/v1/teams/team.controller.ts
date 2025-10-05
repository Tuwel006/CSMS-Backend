import { Request, Response } from 'express';
import { TeamService } from './team.service';
import { CreateTeamDto, UpdateTeamDto } from './team.dto';
import { ApiResponse } from '../../../utils/ApiResponse';

export class TeamController {
  static async createTeam(req: Request<{}, {}, CreateTeamDto>, res: Response) {
    try {
      const teamData = req.body;
      
      const team = await TeamService.createTeam(teamData);
      
      const response = ApiResponse.created(team, 'Team created successfully');
      res.status(response.status).json(response);
    } catch (error: any) {
      const errorResponse = ApiResponse.badRequest(error.message);
      res.status(errorResponse.status).json(errorResponse);
    }
  }

  static async getTeams(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await TeamService.getTeams(page, limit);
      
      const response = ApiResponse.success(result, 'Teams retrieved successfully');
      res.status(response.status).json(response);
    } catch (error: any) {
      const errorResponse = ApiResponse.badRequest(error.message);
      res.status(errorResponse.status).json(errorResponse);
    }
  }

  static async searchTeams(req: Request, res: Response) {
    try {
      const name = req.query.name as string;
      const location = req.query.location as string;
      
      if (!name || name.trim().length === 0) {
        const response = ApiResponse.badRequest('Name parameter is required');
        return res.status(response.status).json(response);
      }
      
      const teams = await TeamService.searchTeams(name.trim(), location);
      
      const response = ApiResponse.success({ teams }, 'Teams found successfully');
      res.status(response.status).json(response);
    } catch (error: any) {
      const errorResponse = ApiResponse.badRequest(error.message);
      res.status(errorResponse.status).json(errorResponse);
    }
  }

  static async getTeamById(req: Request, res: Response) {
    try {
      const teamId = parseInt(req.params.id);
      
      const team = await TeamService.getTeamById(teamId);
      
      const response = ApiResponse.success(team, 'Team retrieved successfully');
      res.status(response.status).json(response);
    } catch (error: any) {
      const errorResponse = ApiResponse.badRequest(error.message);
      res.status(errorResponse.status).json(errorResponse);
    }
  }

  static async updateTeam(req: Request<{ id: string }, {}, UpdateTeamDto>, res: Response) {
    try {
      const teamId = parseInt(req.params.id);
      const updateData = req.body;
      
      const team = await TeamService.updateTeam(teamId, updateData);
      
      const response = ApiResponse.success(team, 'Team updated successfully');
      res.status(response.status).json(response);
    } catch (error: any) {
      const errorResponse = ApiResponse.badRequest(error.message);
      res.status(errorResponse.status).json(errorResponse);
    }
  }

  static async deleteTeam(req: Request, res: Response) {
    try {
      const teamId = parseInt(req.params.id);
      
      const result = await TeamService.deleteTeam(teamId);
      
      const response = ApiResponse.success(result, 'Team deleted successfully');
      res.status(response.status).json(response);
    } catch (error: any) {
      const errorResponse = ApiResponse.badRequest(error.message);
      res.status(errorResponse.status).json(errorResponse);
    }
  }
}