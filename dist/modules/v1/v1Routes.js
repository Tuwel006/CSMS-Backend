"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("./user");
const admin_1 = require("./admin");
const tenant_1 = __importDefault(require("./tenant"));
const teams_1 = require("./teams");
const players_1 = require("./players");
const matches_1 = require("./matches");
const auth_middleware_1 = require("./shared/middlewares/auth.middleware");
const router = (0, express_1.Router)();
// User routes
router.use('/user/auth', user_1.userAuthRoutes);
// Admin routes
router.use('/admin/plans', admin_1.plansRoutes);
router.use('/admin/plan-permissions', admin_1.planPermissionRoutes);
// Tenant routes
router.use('/tenant', tenant_1.default);
// Teams routes
router.use('/teams', auth_middleware_1.authMiddleware, teams_1.teamRoutes);
// Players routes
router.use('/players', auth_middleware_1.authMiddleware, players_1.playerRoutes);
// Matches routes
router.use('/matches', auth_middleware_1.authMiddleware, matches_1.matchesRoutes);
exports.default = router;
