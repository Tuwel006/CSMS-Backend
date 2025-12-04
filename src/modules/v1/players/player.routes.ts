import { Router } from 'express';
import { PlayerController } from './player.controller';

const router = Router();

router.post('/', PlayerController.createPlayer);
router.get('/', PlayerController.getPlayers);
router.get('/search', PlayerController.searchPlayers);
router.get('/:id', PlayerController.getPlayerById);
router.put('/:id', PlayerController.updatePlayer);
router.delete('/:id', PlayerController.deletePlayer);

export default router;
