import { Request, Response } from 'express';
import { RoleService } from './role.service';
import { CreateRoleDto, UpdateRoleDto } from './role.dto';
import { ApiResponse } from '../../../../utils/ApiResponse';

interface AuthRequest extends Request {
  user?: {
    id: number;
    tenantId: number;
    isGlobalAdmin: boolean;
  };
}

export class RoleController {
  static async createRole(req: Request<{}, {}, CreateRoleDto>, res: Response) {
    try {
      const tenantId = (req as AuthRequest).user!.tenantId;
      const roleData = req.body;
      
      const role = await RoleService.createRole(tenantId, roleData);
      
      const response = ApiResponse.created(role, 'Role created successfully');
      res.status(response.status).json(response);
    } catch (error: any) {
      const errorResponse = ApiResponse.badRequest(error.message);
      res.status(errorResponse.status).json(errorResponse);
    }
  }

  static async getRoles(req: AuthRequest, res: Response) {
    try {
      const tenantId = req.user!.tenantId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await RoleService.getRolesByTenant(tenantId, page, limit);
      
      const response = ApiResponse.success(result, 'Roles retrieved successfully');
      res.status(response.status).json(response);
    } catch (error: any) {
      const errorResponse = ApiResponse.badRequest(error.message);
      res.status(errorResponse.status).json(errorResponse);
    }
  }

  static async getRoleById(req: AuthRequest, res: Response) {
    try {
      const roleId = parseInt(req.params.id);
      
      const role = await RoleService.getRoleById(roleId);
      
      const response = ApiResponse.success(role, 'Role retrieved successfully');
      res.status(response.status).json(response);
    } catch (error: any) {
      const errorResponse = ApiResponse.badRequest(error.message);
      res.status(errorResponse.status).json(errorResponse);
    }
  }

  static async updateRole(req: Request<{ id: string }, {}, UpdateRoleDto>, res: Response) {
    try {
      const roleId = parseInt(req.params.id);
      const tenantId = (req as AuthRequest).user!.tenantId;
      const updateData = req.body;
      
      const role = await RoleService.updateRole(roleId, tenantId, updateData);
      
      const response = ApiResponse.success(role, 'Role updated successfully');
      res.status(response.status).json(response);
    } catch (error: any) {
      const errorResponse = ApiResponse.badRequest(error.message);
      res.status(errorResponse.status).json(errorResponse);
    }
  }

  static async deleteRole(req: AuthRequest, res: Response) {
    try {
      const roleId = parseInt(req.params.id);
      const tenantId = req.user!.tenantId;
      
      const result = await RoleService.deleteRole(roleId, tenantId);
      
      const response = ApiResponse.success(result, 'Role deleted successfully');
      res.status(response.status).json(response);
    } catch (error: any) {
      const errorResponse = ApiResponse.badRequest(error.message);
      res.status(errorResponse.status).json(errorResponse);
    }
  }

  static async getPermissions(req: Request, res: Response) {
    try {
      const permissions = await RoleService.getAllPermissions();
      
      const response = ApiResponse.success({ permissions }, 'Permissions retrieved successfully');
      res.status(response.status).json(response);
    } catch (error: any) {
      const errorResponse = ApiResponse.badRequest(error.message);
      res.status(errorResponse.status).json(errorResponse);
    }
  }
}