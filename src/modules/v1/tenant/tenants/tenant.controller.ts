import { Request, Response } from 'express';
import { TenantService } from './tenant.service';
import { CreateTenantDto, UpdateTenantDto } from './tenant.dto';
import { ApiResponse } from '../../../../utils/ApiResponse';

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
      const { organizationName } = req.body;
      
      const tenant = await TenantService.createTenant(userId, organizationName);
      
      const response = ApiResponse.created(tenant, 'Tenant created successfully');
      res.status(response.status).json(response);
    } catch (error: any) {
      const errorResponse = ApiResponse.badRequest(error.message);
      res.status(errorResponse.status).json(errorResponse);
    }
  }
  static async getDashboard(req: AuthRequest, res: Response) {
    try {
      const tenantId = req.user!.tenantId;
      const dashboard = await TenantService.getTenantDashboard(tenantId);
      
      const response = ApiResponse.success(dashboard, 'Tenant dashboard retrieved successfully');
      res.status(response.status).json(response);
    } catch (error: any) {
      const errorResponse = ApiResponse.badRequest(error.message);
      res.status(errorResponse.status).json(errorResponse);
    }
  }

  static async updateTenant(req: Request<{}, {}, UpdateTenantDto>, res: Response) {
    try {
      const tenantId = (req as AuthRequest).user!.tenantId;
      const updateData = req.body;
      
      const updatedTenant = await TenantService.updateTenant(tenantId, updateData);
      
      const response = ApiResponse.success(updatedTenant, 'Tenant updated successfully');
      res.status(response.status).json(response);
    } catch (error: any) {
      const errorResponse = ApiResponse.badRequest(error.message);
      res.status(errorResponse.status).json(errorResponse);
    }
  }
}