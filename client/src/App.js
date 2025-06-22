import React, { useState, useMemo, useEffect } from 'react';

// --- Mock Data ---
const workers = [
  { index: 0, id: 1, name: '관리자' },
  { index: 1, id: 2, name: '이서연' },
  { index: 2, id: 3, name: '박하준' },
  { index: 3, id: 4, name: '최지우' },
  { index: 4, id: 5, name: '정시우' },
];
const startDate = new Date('2025-01-01');
const shifts = ['○', '●▣', 'X', 'XX']; // 주간, 야간, 비번, 휴무

const getWorkerSchedule = (days, daysDiff) => {
  const schedule = {};
  workers.forEach((worker) => {
    // 각 근무자의 index를 스케줄 패턴의 시작점으로 사용합니다.
    const startIndex = typeof worker.index === 'number' ? worker.index : 0;

    schedule[worker.name] = Array.from({ length: days }, (_, i) => shifts[(daysDiff + i + startIndex) % shifts.length]);
  });
  return schedule;
};

// 기념일 정보를 가져오는 함수

// 로그인 화면 컴포넌트
function LoginScreen({ onLogin }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">근무 스케줄 로그인</h2>
          <p className="mt-2 text-sm text-gray-600">아이디와 비밀번호를 입력해주세요.</p>
        </div>
        <form
          className="mt-8 space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            onLogin();
          }}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">
                아이디
              </label>
              <input id="username" name="username" type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="아이디" defaultValue="admin" />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                비밀번호
              </label>
              <input id="password" name="password" type="password" required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="비밀번호" defaultValue="password" />
            </div>
          </div>
          <div>
            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
              로그인
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 상단 네비게이션 바 컴포넌트
function NavigationBar({ onLogout }) {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-xl font-bold text-indigo-600">근무 스케줄</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#" className="bg-indigo-50 text-indigo-700 px-3 py-2 rounded-md text-sm font-medium">
                  스케줄 표
                </a>
                <a href="#" className="text-gray-500 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  팀 관리
                </a>
                <a href="#" className="text-gray-500 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  설정
                </a>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <button onClick={onLogout} className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition">
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

// 스케줄 표 컴포넌트
function ScheduleTable({ onLogout }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [Anniversaries, SetAnniversaries] = useState([]);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // 0-11

  const today = new Date();
  const isCurrentMonthView = today.getFullYear() === currentYear && today.getMonth() === currentMonth;
  const todaysDate = isCurrentMonthView ? today.getDate() : null;

  const monthDetails = useMemo(() => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const dayLabels = ['일', '월', '화', '수', '목', '금', '토'];

    return Array.from({ length: daysInMonth }, (_, i) => {
      const date = i + 1;
      const dayOfWeek = new Date(currentYear, currentMonth, date).getDay(); // 0: Sun, 6: Sat

      return {
        date,
        dayLabel: dayLabels[dayOfWeek],
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
        isToday: date === todaysDate,
      };
    });
  }, [currentYear, currentMonth, todaysDate, Anniversaries]);

  const daysDiff = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const timeDiff = firstDay.getTime() - startDate.getTime();
    const Diff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    return Diff;
  }, [currentMonth]);

 

  useEffect(() => {

    async function GetAnni() {
      const response = await fetch(`/api/anniversary?year=${currentYear}&month=${currentMonth}`);
      console.log(response);
  

      const result = await response.json();
      console.log(result);
      return response;
    }
    
    GetAnni();
    
  }, [currentMonth]);

  const scheduleData = useMemo(() => getWorkerSchedule(monthDetails.length, daysDiff), [currentMonth]);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <NavigationBar onLogout={onLogout} />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center mb-6">
            <button onClick={goToPreviousMonth} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 w-40 sm:w-48 text-center mx-2">
              {currentYear}년 {currentMonth + 1}월
            </h1>
            <button onClick={goToNextMonth} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200 border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th rowSpan="2" className="sticky left-0 bg-gray-300 px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider z-20 align-middle border-b border-gray-200">
                    근무자
                  </th>
                  {monthDetails.map(({ date, isWeekend, isToday }) => (
                    <th key={`date-${date}`} className={`px-4 py-2 text-center text-xs font-bold uppercase tracking-wider transition-colors duration-200 ${isWeekend ? 'bg-red-100 text-red-800' : 'bg-gray-200 text-gray-600'} `}>
                      {date}
                    </th>
                  ))}
                </tr>
                <tr>
                  {monthDetails.map(({ date, dayLabel, isWeekend, isToday }) => (
                    <th key={`day-${date}`} className={`px-4 py-2 text-center text-xs font-bold uppercase tracking-wider border-b border-gray-200 transition-colors duration-200 ${isWeekend ? 'bg-red-100 text-red-800' : 'bg-gray-200 text-gray-500'}`}>
                      {dayLabel}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white ">
                {workers.map((worker) => (
                  <tr key={worker.id}>
                    <td className="sticky left-0 bg-gray-200 px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900 z-10 border-r">{worker.name}</td>
                    {monthDetails.map(({ isWeekend, isToday }, index) => {
                      if (worker.name === '관리자') {
                        const shift = isWeekend ? 'XX' : '○';
                        return (
                          <td key={index}>
                            <div className={`w-full h-full flex items-center justify-center py-3 ${isWeekend ? 'bg-red-100' : 'bg-gray-100'}`}>{shift}</div>
                          </td>
                        );
                      } else {
                        return (
                          <td key={index}>
                            <div className={`w-full h-full flex items-center justify-center py-3 ${isWeekend ? 'bg-red-100' : 'bg-gray-100'}`}>{scheduleData[worker.name][index]}</div>
                          </td>
                        );
                      }
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex items-center justify-end space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <span className="w-4 h-4 rounded-full bg-blue-100 mr-2 border border-blue-300"></span>
              <span>주간/야간</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 rounded-full bg-gray-200 mr-2 border border-gray-300"></span>
              <span>휴무</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// 메인 앱 컴포넌트
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return <>{isLoggedIn ? <ScheduleTable onLogout={handleLogout} /> : <LoginScreen onLogin={handleLogin} />}</>;
}
