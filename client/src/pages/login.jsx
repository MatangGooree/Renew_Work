import { use, useState } from 'react';
import { useAuth } from '../context/AuthContext';

// 로그인 화면 컴포넌트
function LoginScreen() {
  const [username, setUsername] = useState('sm00004');
  const [password, setPassword] = useState('1234');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { logIn } = useAuth(); // 'logIn' 대신 'login'으로 변경했습니다. (AuthContext와 일치)
  // const navigate = useNavigate(); // 페이지 이동을 위한 훅

  // 로그인 로직을 담고 있는 비동기 함수
  const handleLogin = async () => {
    setIsLoading(true); // 로딩 상태 시작
    setError(''); // 에러 메시지 초기화

    try {
      // AuthContext에서 가져온 login 함수를 await로 호출하여 결과를 기다립니다.
      const result = await logIn(username, password);

      if (result.success) {
      } else {
        setError(result.message || '로그인에 실패했습니다.');
      }
    } catch (err) {
      setError('로그인 처리 중 예상치 못한 오류가 발생했습니다.');
    } finally {
      setIsLoading(false); // 로딩 상태 종료
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">KBS 관제근무 로그인</h2>
          <p className="mt-2 text-sm text-gray-600">아이디와 비밀번호를 입력해주세요.</p>
        </div>
        <form
          className="mt-8 space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">
                아이디
              </label>
              <input id="username" name="username" type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="아이디" defaultValue={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                비밀번호
              </label>
              <input id="password" name="password" type="password" required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="비밀번호" defaultValue={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          <div>
            <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginScreen;
