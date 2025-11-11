// 스케줄 표 컴포넌트
import { useState, useMemo, useEffect, useCallback } from 'react'
import ScheduleTable from '../Components/ScheduleTable'
import { useAuth } from '../Contexts/Auth'

function SchedulePage() {
  const { user } = useAuth()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [scheduleData, setScheduleData] = useState(null)

  const getWorkers = useCallback(async (params) => {
    const result = await fetch(`/api/getSchedule?${params}`)
    const data = await result.json()
    setScheduleData(data)
  }, [])

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    )
  }

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    )
  }

  useEffect(() => {
    const params = new URLSearchParams({
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1,
    })
    getWorkers(params)
  }, [currentDate])

  return (
    <div className='bg-gray-50 min-h-screen font-sans'>
      <main className='p-4 sm:p-6 lg:p-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='flex justify-center items-center mb-6'>
            <button
              onClick={goToPreviousMonth}
              className='p-2 rounded-full hover:bg-gray-200 transition-colors'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6 text-gray-600'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M15 19l-7-7 7-7'
                />
              </svg>
            </button>
            <h1 className='text-xl sm:text-2xl font-bold text-gray-800 w-40 sm:w-48 text-center mx-2'>
              {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
            </h1>
            <button
              onClick={goToNextMonth}
              className='p-2 rounded-full hover:bg-gray-200 transition-colors'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6 text-gray-600'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M9 5l7 7-7 7'
                />
              </svg>
            </button>
          </div>

          <ScheduleTable scheduleData={scheduleData} getWorkers={getWorkers} />

          {user && user.id < 4 && (
            <div className='mt-6 flex items-center justify-end space-x-4 text-sm text-gray-600'>
              <div className='flex items-center'>
                <span
                  className={`w-4 h-4 rounded-full mr-2 border ${scheduleData && scheduleData.WorkerData[parseInt(user.id)].remain_Day >= 0 ? 'bg-blue-100' : 'bg-red-100'} border-blue-300`}
                ></span>
                {scheduleData && (
                  <span>{`${scheduleData.WorkerData[parseInt(user.id)].remain_Day >= 0 ? '사용 가능한 대체 휴무 : ' + scheduleData.WorkerData[parseInt(user.id)].remain_Day : '해야 할 대체 근무 : ' + -scheduleData.WorkerData[parseInt(user.id)].remain_Day}`}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default SchedulePage
