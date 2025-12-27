"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const team_controller_1 = require("./team.controller");
const express_validator_1 = require("express-validator");
const validateTeamCreate = [
    (0, express_validator_1.body)('name').isLength({ min: 2, max: 100 }).withMessage('Team name must be 2-100 characters'),
    (0, express_validator_1.body)('short_name').isLength({ min: 2, max: 10 }).withMessage('Short name must be 2-10 characters'),
    (0, express_validator_1.body)('logo_url').optional().isURL().withMessage('Logo URL must be a valid URL'),
    (0, express_validator_1.body)('location').optional().isLength({ min: 2, max: 100 }).withMessage('Location must be 2-100 characters'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }
        next();
    }
];
const validateTeamUpdate = [
    (0, express_validator_1.param)('id').isInt({ min: 1 }).withMessage('Team ID must be a positive integer'),
    (0, express_validator_1.body)('name').optional().isLength({ min: 2, max: 100 }).withMessage('Team name must be 2-100 characters'),
    (0, express_validator_1.body)('short_name').optional().isLength({ min: 2, max: 10 }).withMessage('Short name must be 2-10 characters'),
    (0, express_validator_1.body)('logo_url').optional().isURL().withMessage('Logo URL must be a valid URL'),
    (0, express_validator_1.body)('location').optional().isLength({ min: 2, max: 100 }).withMessage('Location must be 2-100 characters'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }
        next();
    }
];
const validateTeamId = [
    (0, express_validator_1.param)('id').isInt({ min: 1 }).withMessage('Team ID must be a positive integer'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }
        next();
    }
];
const router = (0, express_1.Router)();
router.post('/', validateTeamCreate, team_controller_1.TeamController.createTeam);
router.get('/', team_controller_1.TeamController.getTeams);
router.get('/search', team_controller_1.TeamController.searchTeams);
router.get('/:id', validateTeamId, team_controller_1.TeamController.getTeamById);
router.put('/:id', validateTeamUpdate, team_controller_1.TeamController.updateTeam);
router.delete('/:id', validateTeamId, team_controller_1.TeamController.deleteTeam);
exports.default = router;
