import React, { useState } from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import ScheduleTable from './pages/SchedulePage'
import NavigationBar from './Components/NavigationBar'
import LoginScreen from './pages/login'
import { useAuth } from './Contexts/Auth'

// 메인 앱 컴포넌트
export default function App() {
  const { user } = useAuth()

  return (
    <>
      <NavigationBar />
      <Routes>
        {user != null ? (
          <>
            <Route path='/schedule' element={<ScheduleTable />} />
            <Route path='/' element={<Navigate to='/schedule' />} />
          </>
        ) : (
          <>
            <Route path='*' element={<Navigate to='/' />} />
            <Route path='/' element={<LoginScreen />} />
          </>
        )}
      </Routes>
    </>
  )
}
