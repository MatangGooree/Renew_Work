import React, { useEffect, useState, useMemo, memo } from 'react'
import { useAuth } from '../Contexts/Auth'
const shifts = {
  D: '○',
  N: '●▣',
  X: 'X',
  XX: 'XX',
  XX_D_VAC: 'XX',
  XX_N_VAC: 'XX',
  D_REP: '○',
  N_REP: '●▣',
}

function CheckSchedule(Time, holliday, Weekend) {
  if (Time.includes('_VAC')) {
    return 'bg-yellow-100 text-red-700'
  } else if (Time.includes('_REP')) {
    return 'bg-red-100 text-red-700'
  } else {
    return holliday || Weekend
      ? 'bg-red-50 text-red-700'
      : 'bg-white text-gray-700'
  }
}

function ScheduleTable({ scheduleData, getWorkers }) {
  console.log('scheduleData:', scheduleData)
  const { user } = useAuth()
  const today = useMemo(() => {
    return new Date()
  }, [])

  // 1. scheduleData가 객체이므로, 내부 키로 존재하는지 확인합니다.
  if (!scheduleData) {
    return null // 또는 <p>Loading...</p>
  }

  const summitVacation = async (shift, day, id) => {
    if (user.id < 4) {
      if (user.id.toString() !== id.toString()) {
        alert('본인의 휴가만 신청 가능합니다')
        return
      }
    }

    if (shift === 'XX' || shift === 'X') {
      return
    }

    let schedule
    if (shift === 'D') {
      schedule = 'day'
    } else if (shift === 'N') {
      schedule = 'night'
    } else if (shift === 'XX_D_VAC') {
      schedule = 'cancel_D'
    } else if (shift === 'XX_N_VAC') {
      schedule = 'cancel_N'
    } else {
      return
    }

    const date = new Date(scheduleData.year, scheduleData.month - 1, day + 2)
    const vacData = {
      worker_ID: id,
      date: date,
      schedule,
    }
    const response = await fetch(`/api/summitVacation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vacData),
      credentials: 'include',
    })
    if (response.status === 200) {
      const params = new URLSearchParams({
        year: scheduleData.year,
        month: scheduleData.month,
      })
      getWorkers(params)
    } else {
    }
  }

  return (
    <div className='overflow-x-auto bg-white rounded-lg shadow'>
      <table className='min-w-full divide-y divide-gray-200 border-collapse'>
        <thead className='bg-gray-100'>
          <tr>
            {/* 근무자 (고정 헤더) */}
            <th
              rowSpan='2'
              className='sticky left-0 bg-gray-300 px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider z-20 align-middle border-b border-gray-200'
            >
              근무자
            </th>

            {scheduleData.DayInfo.map((_, index) => {
              const isToday =
                today.getDate() === index + 1 &&
                today.getMonth() + 1 === scheduleData.month &&
                today.getFullYear() === scheduleData.year
              return (
                <th
                  key={`date-${index}`}
                  className={`px-4 py-2 text-center text-xs font-bold uppercase tracking-wider transition-colors duration-200 ${isToday ? ' bg-red-100' : ''}`}
                >
                  {index + 1}
                </th>
              )
            })}
          </tr>
          <tr>
            {/* 요일(문자) 렌더링 (이 부분은 거의 정확했습니다) */}
            {scheduleData.DayInfo.map(({ dayString, isWeekend }, index) => {
              const isToday =
                today.getDate() === index + 1 &&
                today.getMonth() + 1 === scheduleData.month &&
                today.getFullYear() === scheduleData.year

              return (
                <th
                  key={`day-${index}`}
                  className={`px-4 py-2 text-center text-xs font-bold uppercase tracking-wider border-b border-gray-200 transition-colors duration-200 ${
                    isWeekend ? 'text-red-600' : 'text-gray-600'
                  } ${isToday ? ' bg-red-100' : ''}`}
                >
                  {dayString}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody className='bg-white '>
          <tr key={`worker-manager`}>
            {/* 근무자 이름 (고정 셀) */}
            <td className='sticky left-0 bg-gray-200 px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900 z-10 border-r'>
              {scheduleData.WorkerData[5].name}
            </td>
            {scheduleData.WorkerData[5].scheduleTime.map((Time, dayIndex) => {
              return (
                <td
                  key={`cell-manager-${dayIndex}`}
                  className='border-b'
                  onDoubleClick={() => {
                    summitVacation(
                      Time,
                      dayIndex,
                      scheduleData.WorkerData[5].worker_ID
                    )
                  }}
                >
                  <div
                    className={`w-full h-full flex items-center justify-center py-3 text-sm ${CheckSchedule(
                      Time,
                      scheduleData.DayInfo[dayIndex].isWeekend,
                      scheduleData.DayInfo[dayIndex].isHoliday
                    )}`}
                  >
                    {shifts[Time]}
                  </div>
                </td>
              )
            })}
          </tr>
          {scheduleData.WorkerData.map((worker, workerIndex) => {
            if (worker.worker_ID < 4) {
              return (
                <tr key={`worker-${workerIndex}`}>
                  {/* 근무자 이름 (고정 셀) */}
                  <td className='sticky left-0 bg-gray-200 px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900 z-10 border-r'>
                    {worker.name}
                  </td>
                  {worker.scheduleTime.map((Time, dayIndex) => {
                    return (
                      <td
                        key={`cell-${workerIndex}-${dayIndex}`}
                        className='border-b'
                        onDoubleClick={() => {
                          summitVacation(Time, dayIndex, worker.worker_ID)
                        }}
                      >
                        <div
                          className={`w-full h-full flex items-center justify-center py-3 text-sm ${CheckSchedule(
                            Time,
                            scheduleData.DayInfo[dayIndex].isWeekend,
                            scheduleData.DayInfo[dayIndex].isHoliday
                          )}`}
                        >
                          {shifts[Time]}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              )
            }
          })}
        </tbody>
      </table>
    </div>
  )
}

export default memo(ScheduleTable)
