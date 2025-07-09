require('dotenv').config();

const express = require('express');
const session = require('express-session');
const { createClient } = require('redis'); // redis 클라이언트
const RedisStore = require('connect-redis').default;
const path = require('path');
const app = express();
const PORT = 8080; // 환경변수 PORT를 사용하거나 기본값 5000

const { getAnniversary } = require('./utils/APIs');
const { executeQuery } = require('./utils/DB_Call');

// Redis
const redisClient = createClient({
  url: process.env.Redis_Host,
});
redisClient.on('connect', () => console.log('Redis에 연결 중...'));
redisClient.on('ready', () => console.log('✅ Redis가 준비되었습니다.'));
redisClient.on('error', (err) => console.error('❌ Redis Client Error', err));

redisClient.connect().catch(console.error);
const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'session:',
});

//미들웨어
app.use(express.json()); // 이것은 경로 지정이 없으니 괜찮습니다.
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
app.use(
  session({
    store: redisStore, // 세션 저장소로 Redis를 사용
    secret: process.env.Redis_SecretKey,
    resave: false,
    saveUninitialized: false, // 로그인한 사용자에게만 세션을 생성
    cookie: {
      secure: false, // https에서만 사용하려면 true
      maxAge: 1000 * 60 * 60 * 24, // 쿠키 유효기간: 24시간
    },
  })
);

//로그인
app.post('/api/logIn', async (req, res) => {
  const { username, password } = req.body;

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

  if (user) {
    req.session.user = {
      id: user.worker_ID,
      roll: user.Roll,
      name: user.Name,
      remain_Day: user.remain_Day,
      remain_Night: user.remain_Night,
    };
    res.json({ success: true, message: '로그인 성공!', user: req.session.user });
  } else {
    res.status(401).json({ success: false, message: '아이디 또는 비밀번호가 잘못되었습니다.' });
  }
});

//인가된 사용자인지 확인
app.get('/api/verifyUser', (req, res) => {
  if (req.session.user) {
    res.json({ success: true, user: req.session.user });
  } else {
    res.status(401).json({ success: false, message: '인증되지 않았습니다.' });
  }
});

//로그아웃
app.get('/api/logOut', (req, res) => {
  console.log(req);
  if (req.session.user) {
    req.session.destroy((err) => {
      if (err) {
        return req.status(500).send(err);
      }
      res.clearCookie('connect.sid'); // 'connect.sid'는 기본 쿠키 이름
      res.send('Logged out successfully.');
    });
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
