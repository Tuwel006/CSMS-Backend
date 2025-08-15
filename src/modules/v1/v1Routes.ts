import { Router } from 'express';
import userRoute from './routes/user.route';
import authRoute from './routes/auth.route';

const router = Router();

router.use('/users', userRoute);
router.use('/auth', authRoute);
//more routes;

export default router;