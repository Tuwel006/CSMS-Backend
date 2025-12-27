"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanPermissionController = void 0;
const plan_permission_service_1 = require("./plan-permission.service");
const ApiResponse_1 = require("../../../../utils/ApiResponse");
class PlanPermissionController {
    static async assignPermission(req, res) {
        try {
            const planPermission = await plan_permission_service_1.PlanPermissionService.assignPermissionToPlan(req.body);
            const response = ApiResponse_1.ApiResponse.success(planPermission, 'Permission assigned to plan successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async getPlanPermissions(req, res) {
        try {
            const planId = parseInt(req.params.planId);
            const permissions = await plan_permission_service_1.PlanPermissionService.getPlanPermissions(planId);
            const response = ApiResponse_1.ApiResponse.success({ permissions }, 'Plan permissions retrieved successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async updatePermission(req, res) {
        try {
            const planId = parseInt(req.params.planId);
            const permissionId = parseInt(req.params.permissionId);
            const updated = await plan_permission_service_1.PlanPermissionService.updatePlanPermission(planId, permissionId, req.body);
            const response = ApiResponse_1.ApiResponse.success(updated, 'Plan permission updated successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async removePermission(req, res) {
        try {
            const planId = parseInt(req.params.planId);
            const permissionId = parseInt(req.params.permissionId);
            const result = await plan_permission_service_1.PlanPermissionService.removePlanPermission(planId, permissionId);
            const response = ApiResponse_1.ApiResponse.success(result, 'Plan permission removed successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
}
exports.PlanPermissionController = PlanPermissionController;
