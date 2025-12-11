import { Request, Response } from 'express';
import { TeamSetupService } from './team-setup.service';
import { TeamSetupDto } from './team-setup.dto';
import { ApiResponse } from '../../../utils/ApiResponse';
import { HTTP_STATUS } from '../../../constants/status-codes';

export class TeamSetupController {
  static async setupTeam(req: Request<{}, {}, TeamSetupDto>, res: Response) {
    try {
      const setupData = req.body;
      
      const result = await TeamSetupService.setupTeam(setupData);
      
      const response = ApiResponse.created(result, 'Team setup completed successfully');
      res.status(response.status).json(response);
    } catch (error: any) {
      const status = error.status || HTTP_STATUS.BAD_REQUEST;
      let errorResponse;
      
      switch (status) {
        case HTTP_STATUS.NOT_FOUND:
          errorResponse = ApiResponse.notFound(error.message);
          break;
        case HTTP_STATUS.BAD_REQUEST:
          errorResponse = ApiResponse.badRequest(error.message);
          break;
        default:
          errorResponse = ApiResponse.serverError(error.message);
      }
      
      res.status(errorResponse.status).json(errorResponse);
    }
  }

  static async deleteTeamSetup(req: Request, res: Response) {
    try {
      const { matchId, teamId } = req.params;
      
      const result = await TeamSetupService.deleteTeamSetup(matchId, Number(teamId));
      
      const response = ApiResponse.success(result, result.message);
      res.status(response.status).json(response);
    } catch (error: any) {
      const status = error.status || HTTP_STATUS.BAD_REQUEST;
      let errorResponse;
      
      switch (status) {
        case HTTP_STATUS.NOT_FOUND:
          errorResponse = ApiResponse.notFound(error.message);
          break;
        case HTTP_STATUS.BAD_REQUEST:
          errorResponse = ApiResponse.badRequest(error.message);
          break;
        default:
          errorResponse = ApiResponse.serverError(error.message);
      }
      
      res.status(errorResponse.status).json(errorResponse);
    }
  }
}
