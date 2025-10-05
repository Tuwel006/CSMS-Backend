import { Router } from 'express';
import { userAuthRoutes } from './user';
import { plansRoutes, planPermissionRoutes } from './admin';
import tenantRoutes from './tenant';
import { teamRoutes } from './teams';

const router = Router();

// User routes
router.use('/user/auth', userAuthRoutes);

// Admin routes
router.use('/admin/plans', plansRoutes);
router.use('/admin/plan-permissions', planPermissionRoutes);

// Tenant routes
router.use('/tenant', tenantRoutes);

// Teams routes
router.use('/teams', teamRoutes);

export default router;