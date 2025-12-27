"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleController = void 0;
const role_service_1 = require("./role.service");
const ApiResponse_1 = require("../../../../utils/ApiResponse");
class RoleController {
    static async createRole(req, res) {
        try {
            const tenantId = req.user.tenantId;
            const roleData = req.body;
            const role = await role_service_1.RoleService.createRole(tenantId, roleData);
            const response = ApiResponse_1.ApiResponse.created(role, 'Role created successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async getRoles(req, res) {
        try {
            const tenantId = req.user.tenantId;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await role_service_1.RoleService.getRolesByTenant(tenantId, page, limit);
            const response = ApiResponse_1.ApiResponse.success(result, 'Roles retrieved successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async getRoleById(req, res) {
        try {
            const roleId = parseInt(req.params.id);
            const role = await role_service_1.RoleService.getRoleById(roleId);
            const response = ApiResponse_1.ApiResponse.success(role, 'Role retrieved successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async updateRole(req, res) {
        try {
            const roleId = parseInt(req.params.id);
            const tenantId = req.user.tenantId;
            const updateData = req.body;
            const role = await role_service_1.RoleService.updateRole(roleId, tenantId, updateData);
            const response = ApiResponse_1.ApiResponse.success(role, 'Role updated successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async deleteRole(req, res) {
        try {
            const roleId = parseInt(req.params.id);
            const tenantId = req.user.tenantId;
            const result = await role_service_1.RoleService.deleteRole(roleId, tenantId);
            const response = ApiResponse_1.ApiResponse.success(result, 'Role deleted successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async getPermissions(req, res) {
        try {
            const permissions = await role_service_1.RoleService.getAllPermissions();
            const response = ApiResponse_1.ApiResponse.success({ permissions }, 'Permissions retrieved successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
}
exports.RoleController = RoleController;
