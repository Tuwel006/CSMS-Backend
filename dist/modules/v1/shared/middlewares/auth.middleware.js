"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.superAdminOnly = void 0;
exports.authMiddleware = authMiddleware;
exports.globalAdminOnly = globalAdminOnly;
exports.tenantAdminOnly = tenantAdminOnly;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const HttpResponse_1 = require("../../../../utils/HttpResponse");
function authMiddleware(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        const error = HttpResponse_1.HTTP_RESPONSE.UNAUTHORIZED("Authorization token required");
        return res.status(error.status).json(error);
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        const error = HttpResponse_1.HTTP_RESPONSE.FORBIDDEN("Invalid or expired token");
        return res.status(error.status).json(error);
    }
}
function globalAdminOnly(req, res, next) {
    if (!req.user?.isGlobalAdmin) {
        const error = HttpResponse_1.HTTP_RESPONSE.FORBIDDEN("Global admin access required");
        return res.status(error.status).json(error);
    }
    next();
}
function tenantAdminOnly(req, res, next) {
    if (!req.user?.tenantId) {
        const error = HttpResponse_1.HTTP_RESPONSE.FORBIDDEN("Tenant access required");
        return res.status(error.status).json(error);
    }
    next();
}
var superAdmin_middleware_1 = require("./superAdmin.middleware");
Object.defineProperty(exports, "superAdminOnly", { enumerable: true, get: function () { return superAdmin_middleware_1.superAdminOnly; } });
