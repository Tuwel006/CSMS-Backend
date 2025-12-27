"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const plan_permission_controller_1 = require("./plan-permission.controller");
const auth_middleware_1 = require("../../shared/middlewares/auth.middleware");
const express_validator_1 = require("express-validator");
const validateAssignPermission = [
    (0, express_validator_1.body)('planId').isInt({ min: 1 }).withMessage('Plan ID must be a positive integer'),
    (0, express_validator_1.body)('permissionId').isInt({ min: 1 }).withMessage('Permission ID must be a positive integer'),
    (0, express_validator_1.body)('limitValue').optional().isInt({ min: 0 }).withMessage('Limit value must be a non-negative integer'),
    (0, express_validator_1.body)('isAllowed').isBoolean().withMessage('isAllowed must be a boolean'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }
        next();
    }
];
const validatePlanId = [
    (0, express_validator_1.param)('planId').isInt({ min: 1 }).withMessage('Plan ID must be a positive integer'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }
        next();
    }
];
const router = (0, express_1.Router)();
router.post('/assign', auth_middleware_1.authMiddleware, auth_middleware_1.globalAdminOnly, validateAssignPermission, plan_permission_controller_1.PlanPermissionController.assignPermission);
router.get('/plan/:planId', auth_middleware_1.authMiddleware, auth_middleware_1.globalAdminOnly, validatePlanId, plan_permission_controller_1.PlanPermissionController.getPlanPermissions);
router.put('/plan/:planId/permission/:permissionId', auth_middleware_1.authMiddleware, auth_middleware_1.globalAdminOnly, plan_permission_controller_1.PlanPermissionController.updatePermission);
router.delete('/plan/:planId/permission/:permissionId', auth_middleware_1.authMiddleware, auth_middleware_1.globalAdminOnly, plan_permission_controller_1.PlanPermissionController.removePermission);
exports.default = router;
