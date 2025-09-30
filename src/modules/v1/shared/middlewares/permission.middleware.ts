import { Request, Response, NextFunction } from 'express';
import { PermissionService } from '../services/PermissionService';
import { ApiResponse } from '../../../../utils/ApiResponse';

interface AuthRequest extends Request {
  user?: {
    id: number;
    tenantId: number;
    isGlobalAdmin: boolean;
  };
}

export const requirePermission = (permissionName: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      
      if (req.user!.isGlobalAdmin) {
        return next();
      }

      const hasPermission = await PermissionService.checkPermission(userId, permissionName);
      
      if (!hasPermission) {
        const error = ApiResponse.forbidden(`Permission '${permissionName}' required`);
        return res.status(error.status).json(error);
      }

      next();
    } catch (error) {
      const errorResponse = ApiResponse.forbidden('Permission check failed');
      return res.status(errorResponse.status).json(errorResponse);
    }
  };
};

export const requireLimit = (permissionName: string, amount = 1) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      
      if (req.user!.isGlobalAdmin) {
        return next();
      }

      const { allowed, remaining } = await PermissionService.checkLimit(userId, permissionName, amount);
      
      if (!allowed) {
        const error = ApiResponse.forbidden(`Limit exceeded for '${permissionName}'. Remaining: ${remaining}`);
        return res.status(error.status).json(error);
      }

      next();
    } catch (error) {
      const errorResponse = ApiResponse.forbidden('Limit check failed');
      return res.status(errorResponse.status).json(errorResponse);
    }
  };
};