import { Router } from "express";
import { MatchController } from "./match.controller";
import { authMiddleware, tenantAdminOnly } from "../../shared/middlewares/auth.middleware";
import { body, param, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

const validateMatchCreate = [
  body("matchDate").isISO8601().withMessage("Match date must be a valid date"),
  body("format").notEmpty().withMessage("Format is required"),
  body("venue").notEmpty().withMessage("Venue is required"),
  body("status").notEmpty().withMessage("Status is required"),
  (req: Request, res: Response, next: NextFunction) => {
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
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    next();
  }
];

const validateMatchUpdate = [
  param("id").isInt({ min: 1 }).withMessage("Match ID must be a positive integer"),
  body("teamAId").optional().isInt({ min: 1 }).withMessage("Team A ID must be a positive integer"),
  body("teamBId").optional().isInt({ min: 1 }).withMessage("Team B ID must be a positive integer"),
  body("matchDate").optional().isISO8601().withMessage("Match date must be a valid date"),
  body("isActive").optional().isBoolean().withMessage("isActive must be a boolean"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    next();
  }
];

const validateMatchId = [
  param("id").isInt({ min: 1 }).withMessage("Match ID must be a positive integer"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    next();
  }
];

const router = Router();

router.post("/", authMiddleware, tenantAdminOnly, validateMatchCreate, MatchController.createMatch);
router.get("/", authMiddleware, tenantAdminOnly, MatchController.getMatches);
router.get("/:id", authMiddleware, tenantAdminOnly, validateMatchId, MatchController.getMatchById);
router.put("/:id", authMiddleware, tenantAdminOnly, validateMatchUpdate, MatchController.updateMatch);
router.delete("/:id", authMiddleware, tenantAdminOnly, validateMatchId, MatchController.deleteMatch);

export default router;