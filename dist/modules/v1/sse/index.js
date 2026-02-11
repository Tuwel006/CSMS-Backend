"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const score_sse_1 = require("../../../sse/score.sse");
const router = (0, express_1.Router)();
router.get('/score/:matchId', score_sse_1.scoreSSEHandler);
exports.default = router;
