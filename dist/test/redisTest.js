"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_config_1 = __importDefault(require("../config/redis.config"));
async function testRedis() {
    await redis_config_1.default.set('hello', 'world');
    const value = await redis_config_1.default.get('hello');
    console.log('Redis value:', value);
    process.exit(0);
}
testRedis();
