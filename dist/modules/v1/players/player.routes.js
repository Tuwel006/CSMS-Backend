"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const player_controller_1 = require("./player.controller");
const router = (0, express_1.Router)();
router.post('/', player_controller_1.PlayerController.createPlayer);
router.get('/', player_controller_1.PlayerController.getPlayers);
router.get('/search', player_controller_1.PlayerController.searchPlayers);
router.get('/:id', player_controller_1.PlayerController.getPlayerById);
router.put('/:id', player_controller_1.PlayerController.updatePlayer);
// Player Match Routes
router.get('/:id/matches', player_controller_1.PlayerController.getPlayerMatches);
router.get('/:id/matches/summary', player_controller_1.PlayerController.getPlayerMatchSummary);
router.get('/:id/matches/recent', player_controller_1.PlayerController.getPlayerRecentMatches);
router.get('/:id/matches/by-date', player_controller_1.PlayerController.getPlayerMatchesByDate);
router.get('/:id/matches/by-team', player_controller_1.PlayerController.getPlayerMatchesByTeam);
router.delete('/:id', player_controller_1.PlayerController.deletePlayer);
exports.default = router;
