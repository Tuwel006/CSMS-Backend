import { Request, Response } from 'express';
import { PlansService } from './plans.service';
import { CreatePlanDto, UpdatePlanDto } from './plans.dto';
import { ApiResponse } from '../../../../utils/ApiResponse';

export class PlansController {
  static async createPlan(req: Request<{}, {}, CreatePlanDto>, res: Response) {
    try {
      const planData: CreatePlanDto = req.body;
      const plan = await PlansService.createPlan(planData);
      const response = ApiResponse.created({ plan }, 'Plan created successfully');
      res.status(response.status).json(response);
    } catch (error: any) {
      const errorResponse = ApiResponse.badRequest(error.message);
      res.status(errorResponse.status).json(errorResponse);
    }
  }

  static async getAllPlans(req: Request, res: Response) {
    try {
      const plans = await PlansService.getAllPlans();
      const response = ApiResponse.success({ plans }, 'Plans retrieved successfully');
      res.status(response.status).json(response);
    } catch (error: any) {
      const errorResponse = ApiResponse.serverError(error.message);
      res.status(errorResponse.status).json(errorResponse);
    }
  }

  static async getPlanById(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params;
      const plan = await PlansService.getPlanById(Number(id));
      if (!plan) {
        const errorResponse = ApiResponse.notFound('Plan not found');
        return res.status(errorResponse.status).json(errorResponse);
      }
      const response = ApiResponse.success({ plan }, 'Plan retrieved successfully');
      res.status(response.status).json(response);
    } catch (error: any) {
      const errorResponse = ApiResponse.serverError(error.message);
      res.status(errorResponse.status).json(errorResponse);
    }
  }

  static async updatePlan(req: Request<{ id: string }, {}, UpdatePlanDto>, res: Response) {
    try {
      const { id } = req.params;
      const updateData: UpdatePlanDto = req.body;
      const plan = await PlansService.updatePlan(Number(id), updateData);
      if (!plan) {
        const errorResponse = ApiResponse.notFound('Plan not found');
        return res.status(errorResponse.status).json(errorResponse);
      }
      const response = ApiResponse.success({ plan }, 'Plan updated successfully');
      res.status(response.status).json(response);
    } catch (error: any) {
      const errorResponse = ApiResponse.badRequest(error.message);
      res.status(errorResponse.status).json(errorResponse);
    }
  }

  static async deletePlan(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params;
      const success = await PlansService.deletePlan(Number(id));
      if (!success) {
        const errorResponse = ApiResponse.notFound('Plan not found');
        return res.status(errorResponse.status).json(errorResponse);
      }
      const response = ApiResponse.success(null, 'Plan deleted successfully');
      res.status(response.status).json(response);
    } catch (error: any) {
      const errorResponse = ApiResponse.serverError(error.message);
      res.status(errorResponse.status).json(errorResponse);
    }
  }

  static async getActivePlans(req: Request, res: Response) {
    try {
      const plans = await PlansService.getActivePlans();
      const response = ApiResponse.success({ plans }, 'Active plans retrieved successfully');
      res.status(response.status).json(response);
    } catch (error: any) {
      const errorResponse = ApiResponse.serverError(error.message);
      res.status(errorResponse.status).json(errorResponse);
    }
  }
}