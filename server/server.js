require('dotenv').config();

const express = require('express');
const session = require('express-session');
const { createClient } = require('redis'); // redis 클라이언트
const RedisStore = require('connect-redis').default;
const path = require('path');
const app = express();
const PORT = 8080; // 환경변수 PORT를 사용하거나 기본값 5000

// 1. Redis 클라이언트 생성 및 연결
const redisClient = createClient({
  url: 'redis://192.168.45.126:6379',
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

// 3. express-session의 store 옵션에 redisStore를 지정
app.use(
  session({
    store: redisStore, // 세션 저장소로 Redis를 사용
    secret: 'ㅁㄴ',
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

//로그인
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  console.log(username, password);
  // 데이터베이스에서 사용자 찾기 (쿼리 사용)
  const sql = `SELECT worker_ID, Name, Roll, remain_Day, remain_Night FROM Workers WHERE login_ID = ? AND login_PW = ? LIMIT 1`;
  let user;
  try {
    const result = await executeQuery(sql, [username, password]);
    console.log(result);
    if (result && result.length > 0) {
      user = result[0];
    } else {
      user = null;
    }
  } catch (error) {
    console.error('로그인 쿼리 오류:', error);
    user = null;
  }

  console.log(user);
  console.log(req.session);

  if (user) {
    req.session.user = {
      id: user.worker_ID,
      roll: user.Roll,
      name: user.Name,
      remain_Day: user.remain_Day,
      remain_Night: user.remain_Night,
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

app.get('/{*any}', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
