import { Router } from 'express';
import { MatchesController } from './matches.controller';
import { TeamSetupController } from './team-setup.controller';
import { authMiddleware, tenantAdminOnly } from '../shared/middlewares/auth.middleware';

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);
router.use(tenantAdminOnly);

router.post('/team-setup', TeamSetupController.setupTeam);
router.delete('/team-setup/:matchId/:teamId', TeamSetupController.deleteTeamSetup);
router.post('/generate-token', MatchesController.generateMatchToken);
router.delete('/delete-token/:id', MatchesController.deleteMatchToken);
router.post('/', MatchesController.createMatch);
router.get('/', MatchesController.getMatches);
router.get('/:id', MatchesController.getMatchById);
router.patch('/:id', MatchesController.updateMatch);
router.delete('/:id', MatchesController.deleteMatch);

export const matchesRoutes = router;
