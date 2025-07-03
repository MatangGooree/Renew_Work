require('dotenv').config();

const { createClient } = require('redis'); // redis 클라이언트
const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const path = require('path');
const app = express();
const PORT = 8080; // 환경변수 PORT를 사용하거나 기본값 5000

// 1. Redis 클라이언트 생성 및 연결
const redisClient = createClient({
  url: 'redis://192.168.45.126:6379',
  // 만약 비밀번호가 있다면: 'redis://:your_password@192.168.0.5:6379'
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
  prefix: 'session:', // Redis 키 앞에 붙일 접두사
});

// 3. express-session의 store 옵션에 redisStore를 지정
app.use(
  session({
    store: redisStore, // 세션 저장소로 Redis를 사용
    secret: 'your-very-secret-key',
    resave: false,
    saveUninitialized: false, // 로그인한 사용자에게만 세션을 생성
    cookie: {
      secure: false, // https에서만 사용하려면 true
      maxAge: 1000 * 60 * 60 * 24, // 쿠키 유효기간: 24시간
    },
  })
);

app.use(express.json()); // 이것은 경로 지정이 없으니 괜찮습니다.
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

const { getAnniversary } = require('./utils/APIs');
const { executeQuery } = require('./utils/DB_Call');

app.get('/{*any}', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

//로그인
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // 데이터베이스에서 사용자 찾기
  const user = users.find((u) => u.username === username && u.password === password);

  if (user) {
    // 사용자를 찾았으면, 세션에 사용자 정보를 저장합니다.
    // 이 정보가 서버에 저장되고, 클라이언트는 세션 ID만 갖게 됩니다.
    req.session.user = {
      id: user.id,
      username: user.username,
      name: user.name,
    };
    console.log('로그인 성공. 세션 정보:', req.session);
    res.json({ success: true, message: '로그인 성공!', user: req.session.user });
  } else {
    res.status(401).json({ success: false, message: '아이디 또는 비밀번호가 잘못되었습니다.' });
  }
});

//공휴일 정보
app.get('/api/anniversary', async (req, res) => {
  const year = parseInt(req.query.year);
  const month = parseInt(req.query.month);

  const data = await getAnniversary(year, month);
  res.json({ data });
});

//근무자
app.get('/DB/getWorkers', async (req, res) => {
  const sql = `SELECT Worker_ID,Name,Roll,remain_Day,remain_Night FROM Workers;`;
  const result = await executeQuery(sql);
  res.json(result);
});
