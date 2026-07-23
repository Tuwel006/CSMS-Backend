import { Router } from 'express';
import { TeamSetupController } from './controller';
import { authMiddleware, tenantAdminOnly } from '../../../shared/middlewares/auth.middleware';

const router = Router();

// All team-setup endpoints are tenant-admin only.
router.use(authMiddleware);
router.use(tenantAdminOnly);

router.post('/', TeamSetupController.setupTeam);
router.patch('/:matchId/:teamId', TeamSetupController.updateTeamSetup);

export default router;