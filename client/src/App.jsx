import React, { use, useState } from 'react';

import ScheduleTable from './pages/SchedulePage';
import NavigationBar from './Components/NavigationBar';
import LoginScreen from './pages/login';
import { useAuth } from './context/AuthContext';
// 메인 앱 컴포넌트
export default function App() {
  const { user } = useAuth();

  return (
    <>
      {user != null ? (
        <div>
          <NavigationBar />
          <ScheduleTable />
        </div>
      ) : (
        <LoginScreen />
      )}
    </>
  );
}
