import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL;
const isLocal = process.env.NODE_ENV === 'development';

let redis: Redis;

if (redisUrl && !isLocal) {
    // Production/Staging: Use Cloud Redis (Upstash)
    redis = new Redis(redisUrl, {
        maxRetriesPerRequest: null,
        tls: {
            rejectUnauthorized: false
        }
    });
} else {
    // Local: Use Local Redis
    redis = new Redis({
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
        db: parseInt(process.env.REDIS_DB || '0'),
        maxRetriesPerRequest: null,
        retryStrategy(times: number): number {
            return Math.min(times * 50, 2000);
        }
    });
}

redis.on('connect', () => console.log('📡 Redis client connected'));
redis.on('ready', () => console.log('✅ Redis client ready'));
redis.on('error', (err: any) => console.error('❌ Redis client error:', err.message));

export default redis;