import { Request, Response } from 'express';
import { DashboardService } from './service';
import { ApiResponse } from '../../../../../utils/ApiResponse';

interface AuthRequest extends Request {
  user?: {
    id: number;
    tenantId: number | null;
    isGlobalAdmin: boolean;
  };
}

export class DashboardController {
  static async getDashboard(req: AuthRequest, res: Response) {
    try {
      const tenantId = req.user!.tenantId;
      const dashboard = await DashboardService.getTenantDashboard(tenantId!);

      const response = ApiResponse.success(dashboard, 'Tenant dashboard retrieved successfully');
      res.status(response.status).json(response);
    } catch (error: any) {
      const errorResponse = ApiResponse.badRequest(error.message);
      res.status(errorResponse.status).json(errorResponse);
    }
  }
}
