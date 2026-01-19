import Redis from "ioredis";

const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0'),

    lazyConnect: false,
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
    retryStrategy(times: number): number {
        return Math.min(times * 50, 2000);
    }
});

redis.on('connect', () => console.log('Redis client connected')
);

redis.on('ready', () => console.log('Redis client ready')
);

redis.on('error', (err: any) => console.error('Redis client error', err.message)
);

export default redis;