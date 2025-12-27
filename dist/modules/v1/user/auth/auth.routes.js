"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
const router = (0, express_1.Router)();
router.post('/signup', auth_validation_1.validateRegister, auth_controller_1.UserAuthController.register);
router.post('/login', auth_validation_1.validateLogin, auth_controller_1.UserAuthController.login);
exports.default = router;
