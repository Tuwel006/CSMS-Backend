"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const role_controller_1 = require("./role.controller");
const auth_middleware_1 = require("../../shared/middlewares/auth.middleware");
const express_validator_1 = require("express-validator");
const validateRoleCreate = [
    (0, express_validator_1.body)('name').isLength({ min: 2, max: 50 }).withMessage('Role name must be 2-50 characters'),
    (0, express_validator_1.body)('description').optional().isLength({ max: 255 }).withMessage('Description must not exceed 255 characters'),
    (0, express_validator_1.body)('permissionIds').isArray({ min: 1 }).withMessage('At least one permission must be selected'),
    (0, express_validator_1.body)('permissionIds.*').isInt({ min: 1 }).withMessage('Permission IDs must be positive integers'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }
        next();
    }
];
const validateRoleUpdate = [
    (0, express_validator_1.param)('id').isInt({ min: 1 }).withMessage('Role ID must be a positive integer'),
    (0, express_validator_1.body)('name').optional().isLength({ min: 2, max: 50 }).withMessage('Role name must be 2-50 characters'),
    (0, express_validator_1.body)('description').optional().isLength({ max: 255 }).withMessage('Description must not exceed 255 characters'),
    (0, express_validator_1.body)('permissionIds').optional().isArray({ min: 1 }).withMessage('At least one permission must be selected'),
    (0, express_validator_1.body)('permissionIds.*').optional().isInt({ min: 1 }).withMessage('Permission IDs must be positive integers'),
    (0, express_validator_1.body)('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }
        next();
    }
];
const validateRoleId = [
    (0, express_validator_1.param)('id').isInt({ min: 1 }).withMessage('Role ID must be a positive integer'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }
        next();
    }
];
const router = (0, express_1.Router)();
router.post('/', auth_middleware_1.authMiddleware, auth_middleware_1.tenantAdminOnly, validateRoleCreate, role_controller_1.RoleController.createRole);
router.get('/', auth_middleware_1.authMiddleware, auth_middleware_1.tenantAdminOnly, role_controller_1.RoleController.getRoles);
router.get('/permissions', auth_middleware_1.authMiddleware, auth_middleware_1.tenantAdminOnly, role_controller_1.RoleController.getPermissions);
router.get('/:id', auth_middleware_1.authMiddleware, auth_middleware_1.tenantAdminOnly, validateRoleId, role_controller_1.RoleController.getRoleById);
router.put('/:id', auth_middleware_1.authMiddleware, auth_middleware_1.tenantAdminOnly, validateRoleUpdate, role_controller_1.RoleController.updateRole);
router.delete('/:id', auth_middleware_1.authMiddleware, auth_middleware_1.tenantAdminOnly, validateRoleId, role_controller_1.RoleController.deleteRole);
exports.default = router;
