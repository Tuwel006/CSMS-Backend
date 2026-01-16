import { Router } from 'express';
import { userAuthRoutes } from './user';
import { plansRoutes, planPermissionRoutes } from './admin';
import tenantRoutes from './tenant';
import { teamRoutes } from './teams';
import { playerRoutes } from './players';
import { matchesRoutes } from './matches';
import { authMiddleware } from './shared/middlewares/auth.middleware';

const router = Router();

// User routes
router.use('/user/auth', userAuthRoutes);

// Admin routes
router.use('/admin/plans', plansRoutes);
router.use('/admin/plan-permissions', planPermissionRoutes);

// Tenant routes
router.use('/tenant', tenantRoutes);

// Teams routes
router.use('/teams', authMiddleware, teamRoutes);

// Players routes
router.use('/players', authMiddleware, playerRoutes);

// Matches routes (auth handled in matches.routes.ts)
router.use('/matches', matchesRoutes);

export default router;