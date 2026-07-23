import { Router } from 'express';
import { userAuthRoutes } from './features/main-user/auth';
import { plansRoutes } from './features/main-user/plans';
import { tenantRoutes } from './features/main-user/tenants';
import { dashboardRoutes } from './features/tenant/dashboard';
import { teamRoutes } from './features/tenant/teams';
import { playerRoutes } from './features/tenant/players';
import { matchesRoutes } from './features/tenant/matches';
import { authMiddleware } from './shared/middlewares/auth.middleware';
import { scoreSSEHandler } from '../../sse/score.sse';

const router = Router();

// Main-user (system-admin) features
router.use('/user/auth', userAuthRoutes);
router.use('/admin/plans', plansRoutes);
router.use('/tenants', tenantRoutes);

// Tenant-scoped features
router.use('/tenant/dashboard', dashboardRoutes);
router.use('/teams', authMiddleware, teamRoutes);
router.use('/players', authMiddleware, playerRoutes);
router.use('/matches', matchesRoutes);

// SSE route
router.get('/sse/score/:matchId', scoreSSEHandler);

export default router;
