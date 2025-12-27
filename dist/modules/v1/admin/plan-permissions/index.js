"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.planPermissionRoutes = exports.PlanPermissionService = exports.PlanPermissionController = void 0;
var plan_permission_controller_1 = require("./plan-permission.controller");
Object.defineProperty(exports, "PlanPermissionController", { enumerable: true, get: function () { return plan_permission_controller_1.PlanPermissionController; } });
var plan_permission_service_1 = require("./plan-permission.service");
Object.defineProperty(exports, "PlanPermissionService", { enumerable: true, get: function () { return plan_permission_service_1.PlanPermissionService; } });
__exportStar(require("./plan-permission.dto"), exports);
require("./plan-permission.swagger");
const plan_permission_routes_1 = __importDefault(require("./plan-permission.routes"));
exports.planPermissionRoutes = plan_permission_routes_1.default;
