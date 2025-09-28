import { Router } from 'express';
import { RoleController } from './role.controller';
import { authMiddleware, tenantAdminOnly } from '../../shared/middlewares/auth.middleware';
import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

const validateRoleCreate = [
  body('name').isLength({ min: 2, max: 50 }).withMessage('Role name must be 2-50 characters'),
  body('description').optional().isLength({ max: 255 }).withMessage('Description must not exceed 255 characters'),
  body('permissionIds').isArray({ min: 1 }).withMessage('At least one permission must be selected'),
  body('permissionIds.*').isInt({ min: 1 }).withMessage('Permission IDs must be positive integers'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    next();
  }
];

const validateRoleUpdate = [
  param('id').isInt({ min: 1 }).withMessage('Role ID must be a positive integer'),
  body('name').optional().isLength({ min: 2, max: 50 }).withMessage('Role name must be 2-50 characters'),
  body('description').optional().isLength({ max: 255 }).withMessage('Description must not exceed 255 characters'),
  body('permissionIds').optional().isArray({ min: 1 }).withMessage('At least one permission must be selected'),
  body('permissionIds.*').optional().isInt({ min: 1 }).withMessage('Permission IDs must be positive integers'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    next();
  }
];

const validateRoleId = [
  param('id').isInt({ min: 1 }).withMessage('Role ID must be a positive integer'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    next();
  }
];

const router = Router();

router.post('/', authMiddleware, tenantAdminOnly, validateRoleCreate, RoleController.createRole);
router.get('/', authMiddleware, tenantAdminOnly, RoleController.getRoles);
router.get('/permissions', authMiddleware, tenantAdminOnly, RoleController.getPermissions);
router.get('/:id', authMiddleware, tenantAdminOnly, validateRoleId, RoleController.getRoleById);
router.put('/:id', authMiddleware, tenantAdminOnly, validateRoleUpdate, RoleController.updateRole);
router.delete('/:id', authMiddleware, tenantAdminOnly, validateRoleId, RoleController.deleteRole);

export default router;