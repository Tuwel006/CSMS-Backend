import { Router } from 'express';
import { TenantController } from './controller';
import { authMiddleware } from '../../../shared/middlewares/auth.middleware';
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

const router = Router();

router.post('/', authMiddleware, validateTenantCreate, TenantController.createTenant);

export default router;
