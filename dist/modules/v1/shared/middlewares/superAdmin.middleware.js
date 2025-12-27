"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.superAdminOnly = void 0;
const ApiResponse_1 = require("../../../../utils/ApiResponse");
const superAdminOnly = (req, res, next) => {
    if (!req.user?.isGlobalAdmin) {
        const error = ApiResponse_1.ApiResponse.forbidden("Super admin access required");
        return res.status(error.status).json(error);
    }
    next();
};
exports.superAdminOnly = superAdminOnly;
