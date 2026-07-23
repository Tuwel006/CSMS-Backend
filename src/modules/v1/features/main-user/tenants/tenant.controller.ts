import { Request, Response } from 'express';
import { TenantService } from './tenant.service';
import { CreateTenantDto } from './tenant.dto';
import { ApiResponse } from '../../../../../utils/ApiResponse';

interface AuthRequest extends Request {
  user?: {
    id: number;
    tenantId: number | null;
    isGlobalAdmin: boolean;
  };
}

export class TenantController {
  static async createTenant(req: Request<{}, {}, CreateTenantDto>, res: Response) {
    try {
      const userId = (req as AuthRequest).user!.id;
      const { organizationName, planId } = req.body;

      const tenant = await TenantService.createTenant(userId, organizationName, planId);

      const response = ApiResponse.created(tenant, 'Tenant created successfully');
      res.status(response.status).json(response);
    } catch (error: any) {
      const errorResponse = ApiResponse.badRequest(error.message);
      res.status(errorResponse.status).json(errorResponse);
    }
  }
}
