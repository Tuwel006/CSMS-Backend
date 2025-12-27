"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const plans_controller_1 = require("./plans.controller");
const express_validator_1 = require("express-validator");
const auth_middleware_1 = require("../../shared/middlewares/auth.middleware");
const validateCreatePlan = [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Plan name is required'),
    (0, express_validator_1.body)('description').notEmpty().withMessage('Description is required'),
    (0, express_validator_1.body)('price').isNumeric().withMessage('Price must be a number'),
    (0, express_validator_1.body)('currency').notEmpty().withMessage('Currency is required'),
    (0, express_validator_1.body)('billing_cycle').isIn(['monthly', 'yearly', 'lifetime']).withMessage('Invalid billing cycle'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }
        next();
    }
];
const validateUpdatePlan = [
    (0, express_validator_1.param)('id').isNumeric().withMessage('Plan ID must be a number'),
    (0, express_validator_1.body)('price').optional().isNumeric().withMessage('Price must be a number'),
    (0, express_validator_1.body)('billing_cycle').optional().isIn(['monthly', 'yearly', 'lifetime']).withMessage('Invalid billing cycle'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }
        next();
    }
];
const validatePlanId = [
    (0, express_validator_1.param)('id').isNumeric().withMessage('Plan ID must be a number'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }
        next();
    }
];
const router = (0, express_1.Router)();
// Admin only routes - require authentication and admin role
router.post('/', auth_middleware_1.authMiddleware, auth_middleware_1.globalAdminOnly, validateCreatePlan, plans_controller_1.PlansController.createPlan);
router.put('/:id', auth_middleware_1.authMiddleware, auth_middleware_1.globalAdminOnly, validateUpdatePlan, plans_controller_1.PlansController.updatePlan);
router.delete('/:id', auth_middleware_1.authMiddleware, auth_middleware_1.globalAdminOnly, validatePlanId, plans_controller_1.PlansController.deletePlan);
// Public routes - anyone can view plans
router.get('/', plans_controller_1.PlansController.getAllPlans);
router.get('/active', plans_controller_1.PlansController.getActivePlans);
router.get('/:id', validatePlanId, plans_controller_1.PlansController.getPlanById);
exports.default = router;
