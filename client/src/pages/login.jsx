import { useState } from 'react';

// 로그인 화면 컴포넌트
function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        // 로그인 성공 시 스케줄 페이지로 이동
        window.location.href = '/schedule';
      } else {
        setError(data.message || '로그인에 실패했습니다.');
      }
    } catch (error) {
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
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
              <input id="username" name="username" type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="아이디" defaultValue="sm00004" onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                비밀번호
              </label>
              <input id="password" name="password" type="password" required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="비밀번호" defaultValue="1234" onChange={(e) => setPassword(e.target.value)} />
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
