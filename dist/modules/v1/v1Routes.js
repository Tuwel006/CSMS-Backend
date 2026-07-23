"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("./features/main-user/auth");
const plans_1 = require("./features/main-user/plans");
const tenants_1 = require("./features/main-user/tenants");
const dashboard_1 = require("./features/tenant/dashboard");
const teams_1 = require("./features/tenant/teams");
const players_1 = require("./features/tenant/players");
const matches_1 = require("./features/tenant/matches");
const auth_middleware_1 = require("./shared/middlewares/auth.middleware");
const realtime_1 = require("../../realtime");
const router = (0, express_1.Router)();
// Main-user (system-admin) features
router.use('/user/auth', auth_1.userAuthRoutes);
router.use('/admin/plans', plans_1.plansRoutes);
router.use('/tenants', tenants_1.tenantRoutes);
// Tenant-scoped features
router.use('/tenant/dashboard', dashboard_1.dashboardRoutes);
router.use('/teams', auth_middleware_1.authMiddleware, teams_1.teamRoutes);
router.use('/players', auth_middleware_1.authMiddleware, players_1.playerRoutes);
router.use('/matches', matches_1.matchesRoutes);
// SSE route
router.get('/sse/score/:matchId', realtime_1.scoreSSEHandler);
exports.default = router;
