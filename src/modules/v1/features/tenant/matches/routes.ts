import { Router } from 'express';
import { MatchesController } from './controller';
import { authMiddleware, tenantAdminOnly } from '../../../shared/middlewares/auth.middleware';

const router = Router();

// Public routes (no authentication required)
router.get('/all', MatchesController.getAllMatches);
router.get('/get-score/:id', MatchesController.getPublicMatchScore);
router.get('/:id/score', MatchesController.getPublicMatchScore);

// Protected tenant-admin routes
router.use(authMiddleware);
router.use(tenantAdminOnly);

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

export default router;