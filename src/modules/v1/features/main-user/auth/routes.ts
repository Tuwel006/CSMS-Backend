import { Router } from "express";
import { UserAuthController } from "./controller";
import { validateRegister, validateLogin } from "./dtos/auth.validation";

const router = Router();

router.post('/signup', validateRegister, UserAuthController.register);
router.post('/login', validateLogin, UserAuthController.login);

export default router;