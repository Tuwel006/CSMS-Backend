import { Router } from 'express';
import { tenantRoutes } from './tenants';
import { roleRoutes } from './roles';
import { matchRoutes } from './matchs';

const router = Router();

router.use('/tenants', tenantRoutes);
router.use('/roles', roleRoutes);
router.use('/matches', matchRoutes);

export default router;