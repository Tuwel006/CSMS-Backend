import { Router } from 'express';
import { MatchesController } from './matches.controller';
import { TeamSetupController } from './team-setup.controller';
import { authMiddleware, tenantAdminOnly } from '../shared/middlewares/auth.middleware';

const router = Router();

// Public routes (no authentication required)
router.get('/all', MatchesController.getAllMatches);
router.get('/get-score/:id', MatchesController.getPublicMatchScore);
router.get('/:id/score', MatchesController.getPublicMatchScore);


// Apply auth middleware to all routes below
router.use(authMiddleware);
router.use(tenantAdminOnly);

router.post('/team-setup', TeamSetupController.setupTeam);
router.patch('/team-setup/:matchId/:teamId', TeamSetupController.updateTeamSetup);
router.delete('/team-setup/:matchId/:teamId', TeamSetupController.deleteTeamSetup);
router.post('/generate-token', MatchesController.generateMatchToken);
router.delete('/delete-token/:id', MatchesController.deleteMatchToken);
router.get('/current/:id', MatchesController.getCurrentCreatedMatch);
router.get('/:id/available-batsmen', MatchesController.getAvailableBatsmen);
router.get('/:id/bowling-team', MatchesController.getBowlingTeamPlayers);
router.post('/:id/set-batsman', MatchesController.setBatsman);
router.post('/:id/set-bowler', MatchesController.setBowler);
router.post('/:id/record-ball', MatchesController.recordBall);
router.post('/:id/next-innings', MatchesController.switchToNextInnings);
router.patch('/:id/complete', MatchesController.completeMatch);
router.patch('/schedule/:id', MatchesController.scheduleMatch);
router.patch('/start/:id', MatchesController.startMatch);
router.post('/', MatchesController.createMatch);
router.get('/tenant', MatchesController.getMatchesByTenant);
router.get('/', MatchesController.getMatches);
router.get('/:id', MatchesController.getMatchById);
router.patch('/:id', MatchesController.updateMatch);
router.delete('/:id', MatchesController.deleteMatch);

export const matchesRoutes = router;
