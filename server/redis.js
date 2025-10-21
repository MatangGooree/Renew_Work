import 'dotenv/config'; // 1. dotenv/config를 import하여 환경변수 로드

import { createClient } from 'redis';
import RedisStore from 'connect-redis';
// 1. Redis 클라이언트 생성 및 연결

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://192.168.45.126:6379',
});

// 연결 상태를 모니터링하는 이벤트 리스너
redisClient.on('connect', () => console.log('Redis에 연결 중...'));
redisClient.on('ready', () => console.log('✅ Redis가 준비되었습니다.'));
redisClient.on('error', (err) => console.error('❌ Redis Client Error', err));

// 비동기적으로 Redis에 연결 시도
redisClient.connect().catch(console.error);

// 2. Redis 스토어 초기화
const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'session:',
});

export default redisStore;
