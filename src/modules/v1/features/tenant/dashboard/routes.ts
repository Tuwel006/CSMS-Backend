import { Router } from 'express';
import { DashboardController } from './controller';
import { authMiddleware, tenantAdminOnly } from '../../../shared/middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, tenantAdminOnly, DashboardController.getDashboard);

export default router;
