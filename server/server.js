require('dotenv').config();

const express = require('express');
const path = require('path');
const app = express();
const PORT = 8080; // 환경변수 PORT를 사용하거나 기본값 5000

app.use(express.json()); // 이것은 경로 지정이 없으니 괜찮습니다.
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

const { getAnniversary } = require('./utils/APIs');
const { executeQuery } = require('./utils/DB_Call');

//함수

app.get('/api/anniversary', async (req, res) => {
  const year = parseInt(req.query.year);
  const month = parseInt(req.query.month);

  const data = await getAnniversary(year, month);
  res.json({ data });
});

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
