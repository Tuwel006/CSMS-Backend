import { Router } from 'express';
import { PlansController } from './plans.controller';
import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { authMiddleware, globalAdminOnly } from '../../shared/middlewares/auth.middleware';

const validateCreatePlan = [
  body('name').notEmpty().withMessage('Plan name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('currency').notEmpty().withMessage('Currency is required'),
  body('billing_cycle').isIn(['monthly', 'yearly', 'lifetime']).withMessage('Invalid billing cycle'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    next();
  }
];

const validateUpdatePlan = [
  param('id').isNumeric().withMessage('Plan ID must be a number'),
  body('price').optional().isNumeric().withMessage('Price must be a number'),
  body('billing_cycle').optional().isIn(['monthly', 'yearly', 'lifetime']).withMessage('Invalid billing cycle'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    next();
  }
];

const validatePlanId = [
  param('id').isNumeric().withMessage('Plan ID must be a number'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    next();
  }
];

const router = Router();

// Admin only routes - require authentication and admin role
router.post('/', authMiddleware, globalAdminOnly, validateCreatePlan, PlansController.createPlan);
router.put('/:id', authMiddleware, globalAdminOnly, validateUpdatePlan, PlansController.updatePlan);
router.delete('/:id', authMiddleware, globalAdminOnly, validatePlanId, PlansController.deletePlan);

// Public routes - anyone can view plans
router.get('/', PlansController.getAllPlans);
router.get('/active', PlansController.getActivePlans);
router.get('/:id', validatePlanId, PlansController.getPlanById);

export default router;