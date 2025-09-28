import { Router } from 'express';
import { TenantController } from './tenant.controller';
import { authMiddleware, tenantAdminOnly } from '../../shared/middlewares/auth.middleware';
import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

const validateTenantCreate = [
  body('organizationName').isLength({ min: 2, max: 100 }).withMessage('Organization name must be 2-100 characters'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    next();
  }
];

const validateTenantUpdate = [
  body('name').optional().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('planId').optional().isInt({ min: 1 }).withMessage('Plan ID must be a positive integer'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    next();
  }
];

const router = Router();

router.post('/create', authMiddleware, validateTenantCreate, TenantController.createTenant);
router.get('/dashboard', authMiddleware, tenantAdminOnly, TenantController.getDashboard);
router.put('/update', authMiddleware, tenantAdminOnly, validateTenantUpdate, TenantController.updateTenant);

export default router;