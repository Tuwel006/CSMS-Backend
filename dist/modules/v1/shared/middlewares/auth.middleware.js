"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
exports.tenantAdminOnly = tenantAdminOnly;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ApiResponse_1 = require("../../../../utils/ApiResponse");
function authMiddleware(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        const error = ApiResponse_1.ApiResponse.unauthorized("Authorization token required");
        return res.status(error.status).json(error);
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        const error = ApiResponse_1.ApiResponse.forbidden("Invalid or expired token");
        return res.status(error.status).json(error);
    }
}
function tenantAdminOnly(req, res, next) {
    if (!req.user?.tenantId) {
        const error = ApiResponse_1.ApiResponse.forbidden("Tenant access required");
        return res.status(error.status).json(error);
    }
    next();
}
