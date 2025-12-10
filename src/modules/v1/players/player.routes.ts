import { Router } from 'express';
import { PlayerController } from './player.controller';

const router = Router();

router.post('/', PlayerController.createPlayer);
router.get('/', PlayerController.getPlayers);
router.get('/search', PlayerController.searchPlayers);
router.get('/:id', PlayerController.getPlayerById);
router.put('/:id', PlayerController.updatePlayer);
// Player Match Routes
router.get('/:id/matches', PlayerController.getPlayerMatches);
router.get('/:id/matches/summary', PlayerController.getPlayerMatchSummary);
router.get('/:id/matches/recent', PlayerController.getPlayerRecentMatches);
router.get('/:id/matches/by-date', PlayerController.getPlayerMatchesByDate);
router.get('/:id/matches/by-team', PlayerController.getPlayerMatchesByTeam);

router.delete('/:id', PlayerController.deletePlayer);

export default router;
