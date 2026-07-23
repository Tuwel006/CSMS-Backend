import { Router } from 'express';
import { userAuthRoutes } from './features/main-user/auth';
import { plansRoutes } from './features/main-user/plans';
import { tenantRoutes } from './features/main-user/tenants';
import { dashboardRoutes } from './features/tenant/dashboard';
import { teamRoutes } from './features/tenant/teams';
import { playerRoutes } from './features/tenant/players';
import { matchesRoutes } from './features/tenant/matches';
import { teamSetupRoutes } from './features/tenant/team-setup';
import { authMiddleware } from './shared/middlewares/auth.middleware';
import { scoreSSEHandler } from '../../realtime/sse/score-sse.handler';

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
// Team-setup is a sub-resource of matches but lives in its own feature folder.
// Mounted under /matches/team-setup to preserve the existing public URL surface.
router.use('/matches/team-setup', teamSetupRoutes);

// SSE route
router.get('/sse/score/:matchId', scoreSSEHandler);

export default router;