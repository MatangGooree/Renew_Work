const mysql = require('mysql2/promise');

const dbPool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  waitForConnections: true, // 풀에 연결이 없을 때 대기할지 여부
  connectionLimit: 10, // 풀에 유지할 최대 연결 수
  queueLimit: 0, // 연결    대기열에 들어갈 수 있는 최대 요청 수 (0은 무제한)
});

async function executeQuery(sql, values = []) {
  let connection;
  try {
    // dbPool이 제대로 초기화되었는지 확인하세요.
    // 예: const dbPool = mysql.createPool({...}); 또는 mariadb.createPool({...});
    connection = await dbPool.getConnection();
    const [rows, fields] = await connection.execute(sql, values);
    return rows;
  } catch (error) {
    // 여기서 오류를 콘솔에 출력하여 어떤 문제가 있는지 확인합니다.
    console.error('데이터베이스 쿼리 실행 중 오류 발생:', error);
    // 실제 애플리케이션에서는 오류를 적절히 처리하거나 다시 throw 할 수 있습니다.
    throw error; // 오류를 호출자에게 다시 던져서 상위 레벨에서 처리할 수 있도록 합니다.
  } finally {
    if (connection) {
      // 연결이 성공적으로 얻어졌다면 반드시 반환해야 합니다.
      connection.release();
    }
  }
}


module.exports = {
  executeQuery,
};
