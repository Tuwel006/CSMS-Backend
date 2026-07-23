import { Request, Response } from 'express';
import { PlansService } from './plan.service';
import { ApiResponse } from '../../../../../utils/ApiResponse';

export class PlansController {
  static async getAllPlans(req: Request, res: Response) {
    try {
      const plans = await PlansService.getAllPlans();
      const response = ApiResponse.success(plans, 'Plans retrieved successfully');
      res.status(response.status).json(response);
    } catch (error: any) {
      const errorResponse = ApiResponse.serverError(error.message);
      res.status(errorResponse.status).json(errorResponse);
    }
  }
}
