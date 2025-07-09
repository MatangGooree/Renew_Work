import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. Context 생성
const AuthContext = createContext(null);

// 2. Provider 컴포넌트 생성
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // user 상태 관리

  // 앱이 처음 로드될 때 서버에 사용자 정보를 요청
  useEffect(() => {
    fetch('/api/verifyUser')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser(data.user); // 성공 시 사용자 정보 저장
        }
      })
      .catch(() => {
        setUser(null); // 실패 시 사용자 정보 초기화
      });
  }, []);

  const logIn = async (username, password) => {
    try {
      const response = await fetch('/api/logIn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      const data = await response.json();
      if (data.success) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
    } finally {
    }
  };

  // 로그아웃 함수
  const logOut = async () => {
    try {
      const response = await fetch('/api/logOut', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        setUser(null);
      } else {
      }
    } catch (error) {}
  };

  const value = { user, logIn, logOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
