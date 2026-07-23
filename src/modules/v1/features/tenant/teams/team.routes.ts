import { Router } from 'express';
import { TeamController } from './team.controller';
import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

const validateTeamCreate = [
  body('name').isLength({ min: 2, max: 100 }).withMessage('Team name must be 2-100 characters'),
  body('short_name').isLength({ min: 2, max: 10 }).withMessage('Short name must be 2-10 characters'),
  body('logo_url').optional().isURL().withMessage('Logo URL must be a valid URL'),
  body('location').optional().isLength({ min: 2, max: 100 }).withMessage('Location must be 2-100 characters'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    next();
  }
];

const validateTeamUpdate = [
  param('id').isInt({ min: 1 }).withMessage('Team ID must be a positive integer'),
  body('name').optional().isLength({ min: 2, max: 100 }).withMessage('Team name must be 2-100 characters'),
  body('short_name').optional().isLength({ min: 2, max: 10 }).withMessage('Short name must be 2-10 characters'),
  body('logo_url').optional().isURL().withMessage('Logo URL must be a valid URL'),
  body('location').optional().isLength({ min: 2, max: 100 }).withMessage('Location must be 2-100 characters'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    next();
  }
];

const validateTeamId = [
  param('id').isInt({ min: 1 }).withMessage('Team ID must be a positive integer'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    next();
  }
];

const router = Router();

router.post('/', validateTeamCreate, TeamController.createTeam);
router.get('/', TeamController.getTeams);
router.get('/search', TeamController.searchTeams);
router.get('/:id', validateTeamId, TeamController.getTeamById);
router.put('/:id', validateTeamUpdate, TeamController.updateTeam);
router.delete('/:id', validateTeamId, TeamController.deleteTeam);

export default router;