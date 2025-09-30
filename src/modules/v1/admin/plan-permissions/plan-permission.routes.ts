import { Router } from 'express';
import { PlanPermissionController } from './plan-permission.controller';
import { authMiddleware, globalAdminOnly } from '../../shared/middlewares/auth.middleware';
import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

const validateAssignPermission = [
  body('planId').isInt({ min: 1 }).withMessage('Plan ID must be a positive integer'),
  body('permissionId').isInt({ min: 1 }).withMessage('Permission ID must be a positive integer'),
  body('limitValue').optional().isInt({ min: 0 }).withMessage('Limit value must be a non-negative integer'),
  body('isAllowed').isBoolean().withMessage('isAllowed must be a boolean'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    next();
  }
];

const validatePlanId = [
  param('planId').isInt({ min: 1 }).withMessage('Plan ID must be a positive integer'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    next();
  }
];

const router = Router();

router.post('/assign', authMiddleware, globalAdminOnly, validateAssignPermission, PlanPermissionController.assignPermission);
router.get('/plan/:planId', authMiddleware, globalAdminOnly, validatePlanId, PlanPermissionController.getPlanPermissions);
router.put('/plan/:planId/permission/:permissionId', authMiddleware, globalAdminOnly, PlanPermissionController.updatePermission);
router.delete('/plan/:planId/permission/:permissionId', authMiddleware, globalAdminOnly, PlanPermissionController.removePermission);

export default router;