"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireLimit = exports.requirePermission = void 0;
const PermissionService_1 = require("../services/PermissionService");
const ApiResponse_1 = require("../../../../utils/ApiResponse");
const requirePermission = (permissionName) => {
    return async (req, res, next) => {
        try {
            const userId = req.user.id;
            if (req.user.isGlobalAdmin) {
                return next();
            }
            const hasPermission = await PermissionService_1.PermissionService.checkPermission(userId, permissionName);
            if (!hasPermission) {
                const error = ApiResponse_1.ApiResponse.forbidden(`Permission '${permissionName}' required`);
                return res.status(error.status).json(error);
            }
            next();
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.forbidden('Permission check failed');
            return res.status(errorResponse.status).json(errorResponse);
        }
    };
};
exports.requirePermission = requirePermission;
const requireLimit = (permissionName, amount = 1) => {
    return async (req, res, next) => {
        try {
            const userId = req.user.id;
            if (req.user.isGlobalAdmin) {
                return next();
            }
            const { allowed, remaining } = await PermissionService_1.PermissionService.checkLimit(userId, permissionName, amount);
            if (!allowed) {
                const error = ApiResponse_1.ApiResponse.forbidden(`Limit exceeded for '${permissionName}'. Remaining: ${remaining}`);
                return res.status(error.status).json(error);
            }
            next();
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.forbidden('Limit check failed');
            return res.status(errorResponse.status).json(errorResponse);
        }
    };
};
exports.requireLimit = requireLimit;
