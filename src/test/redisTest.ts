import redis from '../config/redis.config';

async function testRedis() {
  await redis.set('hello', 'world');
  const value = await redis.get('hello');

  console.log('Redis value:', value);
  process.exit(0);
}

testRedis();
