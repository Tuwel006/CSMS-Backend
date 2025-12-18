import { Router } from 'express';
import { MatchesController } from './matches.controller';
import { TeamSetupController } from './team-setup.controller';
import { authMiddleware, tenantAdminOnly } from '../shared/middlewares/auth.middleware';

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);
router.use(tenantAdminOnly);

router.post('/team-setup', TeamSetupController.setupTeam);
router.patch('/team-setup/:matchId/:teamId', TeamSetupController.updateTeamSetup);
router.delete('/team-setup/:matchId/:teamId', TeamSetupController.deleteTeamSetup);
router.post('/generate-token', MatchesController.generateMatchToken);
router.delete('/delete-token/:id', MatchesController.deleteMatchToken);
router.get('/current/:id', MatchesController.getCurrentCreatedMatch);
router.patch('/schedule/:id', MatchesController.scheduleMatch);
router.patch('/start/:id', MatchesController.startMatch);
router.post('/', MatchesController.createMatch);
router.get('/', MatchesController.getMatches);
router.get('/:id', MatchesController.getMatchById);
router.patch('/:id', MatchesController.updateMatch);
router.delete('/:id', MatchesController.deleteMatch);

export const matchesRoutes = router;
