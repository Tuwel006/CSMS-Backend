"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantController = void 0;
const tenant_service_1 = require("./tenant.service");
const ApiResponse_1 = require("../../../../utils/ApiResponse");
class TenantController {
    static async createTenant(req, res) {
        try {
            const userId = req.user.id;
            const { organizationName, planId } = req.body;
            const tenant = await tenant_service_1.TenantService.createTenant(userId, organizationName, planId);
            const response = ApiResponse_1.ApiResponse.created(tenant, 'Tenant created successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async getDashboard(req, res) {
        try {
            const tenantId = req.user.tenantId;
            const dashboard = await tenant_service_1.TenantService.getTenantDashboard(tenantId);
            const response = ApiResponse_1.ApiResponse.success(dashboard, 'Tenant dashboard retrieved successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async updateTenant(req, res) {
        try {
            const tenantId = req.user.tenantId;
            const updateData = req.body;
            const updatedTenant = await tenant_service_1.TenantService.updateTenant(tenantId, updateData);
            const response = ApiResponse_1.ApiResponse.success(updatedTenant, 'Tenant updated successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
}
exports.TenantController = TenantController;
