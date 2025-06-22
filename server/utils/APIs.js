require('dotenv').config();

const Key = process.env.AnniversaryAPIkey;
async function getAnniversary(year, month) {
  const url = `http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?serviceKey=${Key}&solYear=${year}&solMonth=${String(month + 1).padStart(2, '0')}&_type=json`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const result = data.response.body.items.item;

    for (let i = 0; i < result.length; i++) {
      const date = String(result[i]['locdate']).slice(-2);

      result[i]['locdate'] = parseInt(date);
    }

    console.log(result);
    return data;
  } catch (error) {
    console.error('기념일 정보를 가져오는 데 실패했습니다:', error);
    return null;
  }
}

module.exports = {
  getAnniversary,
};
