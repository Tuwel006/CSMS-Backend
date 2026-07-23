import { Request, Response } from 'express';
import { TeamAssignmentService } from './team-assignment.service';
import { TeamAssignmentDto } from './dtos/team-assignment.dto';
import { sendCreated, sendSuccess, sendMappedError } from '../../../../../utils/controller-helpers';

export class TeamAssignmentController {
  static async assignTeam(req: Request<{}, {}, TeamAssignmentDto>, res: Response) {
    try {
      const result = await TeamAssignmentService.assignTeam(req.body);
      sendCreated(res, result, 'Team assigned successfully');
    } catch (error: any) {
      sendMappedError(res, error);
    }
  }

  static async updateTeamAssignment(req: Request, res: Response) {
    try {
      const { matchId, teamId } = req.params;
      const result = await TeamAssignmentService.updateTeamAssignment(
        matchId,
        Number(teamId),
        req.body
      );
      sendSuccess(res, result, 'Team assignment updated successfully');
    } catch (error: any) {
      sendMappedError(res, error);
    }
  }

  static async removeTeamAssignment(req: Request, res: Response) {
    try {
      const { matchId, teamId } = req.params;
      const result = await TeamAssignmentService.removeTeamAssignment(matchId, Number(teamId));
      sendSuccess(res, result, result.message);
    } catch (error: any) {
      sendMappedError(res, error);
    }
  }
}
