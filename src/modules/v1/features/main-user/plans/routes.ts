import { Router } from 'express';
import { PlansController } from './controller';

const router = Router();

router.get('/', PlansController.getAllPlans);

export default router;
