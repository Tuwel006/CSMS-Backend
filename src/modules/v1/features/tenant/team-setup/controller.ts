import { Request, Response } from 'express';
import { TeamSetupService } from './service';
import { TeamSetupDto } from './dtos/team-setup.dto';
import { sendCreated, sendSuccess, sendMappedError } from '../../../../../utils/controller-helpers';

export class TeamSetupController {
  static async setupTeam(req: Request<{}, {}, TeamSetupDto>, res: Response) {
    try {
      const result = await TeamSetupService.setupTeam(req.body);
      sendCreated(res, result, 'Team setup completed successfully');
    } catch (error: any) {
      sendMappedError(res, error);
    }
  }

  static async updateTeamSetup(req: Request, res: Response) {
    try {
      const { matchId, teamId } = req.params;
      const result = await TeamSetupService.updateTeamSetup(
        matchId,
        Number(teamId),
        req.body
      );
      sendSuccess(res, result, 'Team setup updated successfully');
    } catch (error: any) {
      sendMappedError(res, error);
    }
  }

  static async deleteTeamSetup(req: Request, res: Response) {
    try {
      const { matchId, teamId } = req.params;
      const result = await TeamSetupService.deleteTeamSetup(matchId, Number(teamId));
      sendSuccess(res, result, result.message);
    } catch (error: any) {
      sendMappedError(res, error);
    }
  }
}