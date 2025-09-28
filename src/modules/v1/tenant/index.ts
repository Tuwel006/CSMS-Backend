import { Router } from 'express';
import { tenantRoutes } from './tenants';
import { roleRoutes } from './roles';

const router = Router();

router.use('/tenants', tenantRoutes);
router.use('/roles', roleRoutes);

export default router;