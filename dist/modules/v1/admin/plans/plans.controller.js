"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlansController = void 0;
const plans_service_1 = require("./plans.service");
const ApiResponse_1 = require("../../../../utils/ApiResponse");
class PlansController {
    static async createPlan(req, res) {
        try {
            const planData = req.body;
            const plan = await plans_service_1.PlansService.createPlan(planData);
            const response = ApiResponse_1.ApiResponse.created({ plan }, 'Plan created successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async getAllPlans(req, res) {
        try {
            const plans = await plans_service_1.PlansService.getAllPlans();
            const response = ApiResponse_1.ApiResponse.success({ plans }, 'Plans retrieved successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.serverError(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async getPlanById(req, res) {
        try {
            const { id } = req.params;
            const plan = await plans_service_1.PlansService.getPlanById(Number(id));
            if (!plan) {
                const errorResponse = ApiResponse_1.ApiResponse.notFound('Plan not found');
                return res.status(errorResponse.status).json(errorResponse);
            }
            const response = ApiResponse_1.ApiResponse.success({ plan }, 'Plan retrieved successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.serverError(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async updatePlan(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const plan = await plans_service_1.PlansService.updatePlan(Number(id), updateData);
            if (!plan) {
                const errorResponse = ApiResponse_1.ApiResponse.notFound('Plan not found');
                return res.status(errorResponse.status).json(errorResponse);
            }
            const response = ApiResponse_1.ApiResponse.success({ plan }, 'Plan updated successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async deletePlan(req, res) {
        try {
            const { id } = req.params;
            const success = await plans_service_1.PlansService.deletePlan(Number(id));
            if (!success) {
                const errorResponse = ApiResponse_1.ApiResponse.notFound('Plan not found');
                return res.status(errorResponse.status).json(errorResponse);
            }
            const response = ApiResponse_1.ApiResponse.success(null, 'Plan deleted successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.serverError(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async getActivePlans(req, res) {
        try {
            const plans = await plans_service_1.PlansService.getActivePlans();
            const response = ApiResponse_1.ApiResponse.success({ plans }, 'Active plans retrieved successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.serverError(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
}
exports.PlansController = PlansController;
