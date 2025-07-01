import React, { useState } from 'react';

import ScheduleTable from './pages/SchedulePage';
import NavigationBar from './Components/NavigationBar';
import LoginScreen from './pages/login';

// 메인 앱 컴포넌트
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
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
