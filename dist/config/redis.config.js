"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const redisUrl = process.env.REDIS_URL;
const isLocal = process.env.NODE_ENV === 'development';
let redis;
if (redisUrl && !isLocal) {
    // Production/Staging: Use Cloud Redis (Upstash)
    redis = new ioredis_1.default(redisUrl, {
        maxRetriesPerRequest: null,
        tls: {
            rejectUnauthorized: false
        }
    });
}
else {
    // Local: Use Local Redis
    redis = new ioredis_1.default({
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
        db: parseInt(process.env.REDIS_DB || '0'),
        maxRetriesPerRequest: null,
        retryStrategy(times) {
            return Math.min(times * 50, 2000);
        }
    });
}
redis.on('connect', () => console.log('📡 Redis client connected'));
redis.on('ready', () => console.log('✅ Redis client ready'));
redis.on('error', (err) => console.error('❌ Redis client error:', err.message));
exports.default = redis;
