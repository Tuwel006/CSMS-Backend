"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisService = void 0;
const redis_config_1 = __importDefault(require("../config/redis.config"));
class redisService {
    static async setScore({ matchId, inningsId, payload }) {
        await redis_config_1.default.set(this.SCORE_KEY({ matchId, inningsId }), JSON.stringify(payload));
    }
    static async getScore({ matchId, inningsId }) {
        const data = await redis_config_1.default.get(this.SCORE_KEY({ matchId, inningsId }));
        if (!data)
            return null;
        return JSON.parse(data);
    }
}
exports.redisService = redisService;
redisService.SCORE_KEY = ({ matchId, inningsId }) => `match:${matchId}:innings:${inningsId}:score`;
