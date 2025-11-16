import { Router } from "express";
import { MatchController } from "./match.controller";
import { authMiddleware, tenantAdminOnly } from "../../shared/middlewares/auth.middleware";
import { body, param, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

const validateMatchCreate = [
  body("teamAId").isInt({ min: 1 }).withMessage("Team A ID must be a positive integer"),
  body("teamBId").isInt({ min: 1 }).withMessage("Team B ID must be a positive integer"),
  body("matchDate").isISO8601().withMessage("Match date must be a valid date"),
    (req: Request, res: Response, next: NextFunction) => {
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