import { Request, Response } from 'express';
import { PlanPermissionService } from './plan-permission.service';
import { AssignPlanPermissionDto, UpdatePlanPermissionDto } from './plan-permission.dto';
import { ApiResponse } from '../../../../utils/ApiResponse';

export class PlanPermissionController {
  static async assignPermission(req: Request<{}, {}, AssignPlanPermissionDto>, res: Response) {
    try {
      const planPermission = await PlanPermissionService.assignPermissionToPlan(req.body);
      
      const response = ApiResponse.success(planPermission, 'Permission assigned to plan successfully');
      res.status(response.status).json(response);
    } catch (error: any) {
      const errorResponse = ApiResponse.badRequest(error.message);
      res.status(errorResponse.status).json(errorResponse);
    }
  }

  static async getPlanPermissions(req: Request, res: Response) {
    try {
      const planId = parseInt(req.params.planId);
      const permissions = await PlanPermissionService.getPlanPermissions(planId);
      
      const response = ApiResponse.success({ permissions }, 'Plan permissions retrieved successfully');
      res.status(response.status).json(response);
    } catch (error: any) {
      const errorResponse = ApiResponse.badRequest(error.message);
      res.status(errorResponse.status).json(errorResponse);
    }
  }

  static async updatePermission(req: Request<{ planId: string; permissionId: string }, {}, UpdatePlanPermissionDto>, res: Response) {
    try {
      const planId = parseInt(req.params.planId);
      const permissionId = parseInt(req.params.permissionId);
      
      const updated = await PlanPermissionService.updatePlanPermission(planId, permissionId, req.body);
      
      const response = ApiResponse.success(updated, 'Plan permission updated successfully');
      res.status(response.status).json(response);
    } catch (error: any) {
      const errorResponse = ApiResponse.badRequest(error.message);
      res.status(errorResponse.status).json(errorResponse);
    }
  }

  static async removePermission(req: Request, res: Response) {
    try {
      const planId = parseInt(req.params.planId);
      const permissionId = parseInt(req.params.permissionId);
      
      const result = await PlanPermissionService.removePlanPermission(planId, permissionId);
      
      const response = ApiResponse.success(result, 'Plan permission removed successfully');
      res.status(response.status).json(response);
    } catch (error: any) {
      const errorResponse = ApiResponse.badRequest(error.message);
      res.status(errorResponse.status).json(errorResponse);
    }
  }
}