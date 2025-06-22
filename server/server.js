require('dotenv').config();

const express = require('express');
const path = require('path');
const app = express();
const PORT = 5000; // 환경변수 PORT를 사용하거나 기본값 5000

app.use(express.json()); // 이것은 경로 지정이 없으니 괜찮습니다.
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

const { getAnniversary } = require('./utils/APIs');

//함수

app.get('/api/anniversary', async (req, res) => {
  const year = parseInt(req.query.year);
  const month = parseInt(req.query.month);

  const data = await getAnniversary(year, month); 
  res.json({ data });
});

app.get('/{*any}', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
