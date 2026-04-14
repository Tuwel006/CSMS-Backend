import { Router } from 'express';
import { TournamentController } from './tournament.controller';

const router = Router();

router.post('/', TournamentController.createTournament);
router.get('/', TournamentController.getTournaments);
router.get('/:id', TournamentController.getTournamentById);
router.put('/:id', TournamentController.updateTournament);
router.delete('/:id', TournamentController.deleteTournament);

export default router;
