"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const match_controller_1 = require("./match.controller");
const auth_middleware_1 = require("../../shared/middlewares/auth.middleware");
const express_validator_1 = require("express-validator");
const validateMatchCreate = [
    (0, express_validator_1.body)("matchDate").isISO8601().withMessage("Match date must be a valid date"),
    (0, express_validator_1.body)("format").notEmpty().withMessage("Format is required"),
    (0, express_validator_1.body)("venue").notEmpty().withMessage("Venue is required"),
    (0, express_validator_1.body)("status").notEmpty().withMessage("Status is required"),
    (req, res, next) => {
        const { teamAId, teamBId, teamAName, teamBName, teamALocation, teamBLocation } = req.body;
        if ((teamAId && teamAName) || (teamBId && teamBName)) {
            return res.status(400).json({ error: "Provide either team ID or team name, not both" });
        }
        if ((!teamAId && !teamAName) || (!teamBId && !teamBName)) {
            return res.status(400).json({ error: "Team A and Team B must be specified by either ID or name" });
        }
        if (teamAName && !teamALocation) {
            return res.status(400).json({ error: "Team A location is required when creating team by name" });
        }
        if (teamBName && !teamBLocation) {
            return res.status(400).json({ error: "Team B location is required when creating team by name" });
        }
        if (teamAId && (!Number.isInteger(teamAId) || teamAId < 1)) {
            return res.status(400).json({ error: "Team A ID must be a positive integer" });
        }
        if (teamBId && (!Number.isInteger(teamBId) || teamBId < 1)) {
            return res.status(400).json({ error: "Team B ID must be a positive integer" });
        }
        if (teamAName && (typeof teamAName !== 'string' || teamAName.trim().length === 0)) {
            return res.status(400).json({ error: "Team A name must be a non-empty string" });
        }
        if (teamBName && (typeof teamBName !== 'string' || teamBName.trim().length === 0)) {
            return res.status(400).json({ error: "Team B name must be a non-empty string" });
        }
        if (teamALocation && (typeof teamALocation !== 'string' || teamALocation.trim().length === 0)) {
            return res.status(400).json({ error: "Team A location must be a non-empty string" });
        }
        if (teamBLocation && (typeof teamBLocation !== 'string' || teamBLocation.trim().length === 0)) {
            return res.status(400).json({ error: "Team B location must be a non-empty string" });
        }
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }
        next();
    }
];
const validateMatchUpdate = [
    (0, express_validator_1.param)("id").isInt({ min: 1 }).withMessage("Match ID must be a positive integer"),
    (0, express_validator_1.body)("teamAId").optional().isInt({ min: 1 }).withMessage("Team A ID must be a positive integer"),
    (0, express_validator_1.body)("teamBId").optional().isInt({ min: 1 }).withMessage("Team B ID must be a positive integer"),
    (0, express_validator_1.body)("matchDate").optional().isISO8601().withMessage("Match date must be a valid date"),
    (0, express_validator_1.body)("isActive").optional().isBoolean().withMessage("isActive must be a boolean"),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }
        next();
    }
];
const validateMatchId = [
    (0, express_validator_1.param)("id").isInt({ min: 1 }).withMessage("Match ID must be a positive integer"),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }
        next();
    }
];
const router = (0, express_1.Router)();
router.post("/", auth_middleware_1.authMiddleware, auth_middleware_1.tenantAdminOnly, validateMatchCreate, match_controller_1.MatchController.createMatch);
router.get("/", auth_middleware_1.authMiddleware, auth_middleware_1.tenantAdminOnly, match_controller_1.MatchController.getMatches);
router.get("/:id", auth_middleware_1.authMiddleware, auth_middleware_1.tenantAdminOnly, validateMatchId, match_controller_1.MatchController.getMatchById);
router.put("/:id", auth_middleware_1.authMiddleware, auth_middleware_1.tenantAdminOnly, validateMatchUpdate, match_controller_1.MatchController.updateMatch);
router.delete("/:id", auth_middleware_1.authMiddleware, auth_middleware_1.tenantAdminOnly, validateMatchId, match_controller_1.MatchController.deleteMatch);
exports.default = router;
