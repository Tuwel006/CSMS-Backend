import { Router } from 'express';
import { userAuthRoutes } from './user';
import { plansRoutes, planPermissionRoutes } from './admin';
import tenantRoutes from './tenant';

const router = Router();

// User routes
router.use('/user/auth', userAuthRoutes);

// Admin routes
router.use('/admin/plans', plansRoutes);
router.use('/admin/plan-permissions', planPermissionRoutes);

// Tenant routes
router.use('/tenant', tenantRoutes);

export default router;