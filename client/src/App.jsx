import React, { useState } from 'react';

import ScheduleTable from './pages/SchedulePage';
import NavigationBar from './Components/NavigationBar';
import LoginScreen from './pages/login';

// 메인 앱 컴포넌트
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  async function handleLogin(username, password) {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        throw new Error('로그인 실패');
      }
      setIsLoggedIn(true);
      // 로그인 성공 시 추가 처리 필요시 여기에 작성
    } catch (error) {
      alert('로그인 중 오류가 발생했습니다.');
      return;
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <>
      {isLoggedIn ? (
        <div>
          <NavigationBar />
          <ScheduleTable onLogout={handleLogout} />
        </div>
      ) : (
        <LoginScreen onLogin={handleLogin} />
      )}
    </>
  );
}
