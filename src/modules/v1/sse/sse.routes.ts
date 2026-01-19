import { Router } from "express";
import { scoreSSEHandler } from "../../../sse/score.sse";

const router = Router();

router.get('/score/:matchId/innings/:inningsId', scoreSSEHandler);

export default router;