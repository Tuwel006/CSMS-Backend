import { Router } from 'express';
import { MatchesController } from './controller';
import { TeamAssignmentController } from './team-assignment.controller';
import { authMiddleware, tenantAdminOnly } from '../../../shared/middlewares/auth.middleware';

const router = Router();

// ---- Public routes (no authentication) ----

// Live scoreboard (publicly readable).
router.get('/:id/score', MatchesController.getPublicMatchScore);

// ---- Protected routes (tenant admin only) ----

router.use(authMiddleware);
router.use(tenantAdminOnly);

// IMPORTANT: Literal segments (e.g. `/tokens`) must be declared BEFORE
// parameterised segments (e.g. `/:id`) so that Express does not try to
// match the literal name as an `:id` value.

// Match tokens (sub-resource). /tokens must come before /:id.
router.post('/tokens', MatchesController.generateMatchToken);
router.get('/tokens/:tokenId', MatchesController.getMatchByToken);
router.delete('/tokens/:tokenId', MatchesController.deleteMatchToken);

// Match CRUD.
router.post('/', MatchesController.createMatch);
router.get('/', MatchesController.listMatches);
router.get('/:id', MatchesController.getMatchById);
router.patch('/:id', MatchesController.updateMatch);
router.delete('/:id', MatchesController.deleteMatch);

// Match lifecycle — state transitions on the match itself.
router.patch('/:id/schedule', MatchesController.scheduleMatch);
router.patch('/:id/start', MatchesController.startMatch);
router.patch('/:id/complete', MatchesController.completeMatch);

// Match scoring sub-resources.
router.post('/:id/balls', MatchesController.recordBall);
router.post('/:id/innings', MatchesController.switchToNextInnings);

// Match batsmen (sub-resource).
router.get('/:id/batsmen', MatchesController.getAvailableBatsmen);
router.post('/:id/batsmen', MatchesController.addBatsman);

// Match bowlers (sub-resource).
router.get('/:id/bowlers', MatchesController.getBowlingTeamPlayers);
router.post('/:id/bowlers', MatchesController.addBowler);

// Match team assignment (sub-resource).
router.post('/:id/teams', TeamAssignmentController.assignTeam);
router.patch('/:id/teams/:teamId', TeamAssignmentController.updateTeamAssignment);
router.delete('/:id/teams/:teamId', TeamAssignmentController.removeTeamAssignment);

export default router;
