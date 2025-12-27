"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tenant_controller_1 = require("./tenant.controller");
const auth_middleware_1 = require("../../shared/middlewares/auth.middleware");
const express_validator_1 = require("express-validator");
const validateTenantCreate = [
    (0, express_validator_1.body)('organizationName').isLength({ min: 2, max: 100 }).withMessage('Organization name must be 2-100 characters'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }
        next();
    }
];
const validateTenantUpdate = [
    (0, express_validator_1.body)('name').optional().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
    (0, express_validator_1.body)('planId').optional().isInt({ min: 1 }).withMessage('Plan ID must be a positive integer'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }
        next();
    }
];
const router = (0, express_1.Router)();
router.post('/create', auth_middleware_1.authMiddleware, validateTenantCreate, tenant_controller_1.TenantController.createTenant);
router.get('/dashboard', auth_middleware_1.authMiddleware, auth_middleware_1.tenantAdminOnly, tenant_controller_1.TenantController.getDashboard);
router.put('/update', auth_middleware_1.authMiddleware, auth_middleware_1.tenantAdminOnly, validateTenantUpdate, tenant_controller_1.TenantController.updateTenant);
exports.default = router;
