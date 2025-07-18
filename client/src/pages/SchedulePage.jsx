// 스케줄 표 컴포넌트
import { useState, useMemo, useEffect } from 'react';
import ScheduleTable from '../Components/ScheduleTable';
import HolidayTable from '../Components/HolidayTable';
import { GetCalData } from '../Utils/GetCalender';
import { GetSchedule } from '../Utils/GetSchedule';

function SchedulePage({ onLogout }) {
  const [Workers, setWorkers] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [monthDetails, setMonthDetails] = useState([]);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // 0-11

  //근무자
  useEffect(() => {
    async function getWorkers() {
      const result = await fetch(`/DB/getWorkers`);
      const data = await result.json();
      setWorkers(data);
    }
    getWorkers();
  }, []);

  //달력
  useEffect(() => {
    const fetchData = async () => {
      const temp = await GetCalData(currentYear, currentMonth);
      setMonthDetails(temp);
    };
    fetchData();
  }, [currentYear, currentMonth]);

  //근무 스케쥴
  const scheduleData = useMemo(() => {
    return GetSchedule(Workers, monthDetails.length, currentYear, currentMonth);
  }, [monthDetails]);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
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

          <ScheduleTable monthDetails={monthDetails} Workers={Workers} scheduleData={scheduleData} />

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

          <HolidayTable Workers={Workers} />
        </div>
      </main>
    </div>
  );
}

export default SchedulePage;
