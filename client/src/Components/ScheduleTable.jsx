import React from 'react'

function ScheduleTable({ scheduleData }) {
  // 1. scheduleData가 객체이므로, 내부 키로 존재하는지 확인합니다.
  if (!scheduleData || !scheduleData.DayInfo || !scheduleData.ScheduleInfo) {
    return null // 또는 <p>Loading...</p>
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

            {/* 2. 날짜(숫자) 렌더링 (map 함수 수정) */}
            {scheduleData.DayInfo.map((_, index) => (
              <th
                key={`date-${index}`}
                className={`px-4 py-2 text-center text-xs font-bold uppercase tracking-wider transition-colors duration-200`}
              >
                {index + 1}
              </th>
            ))}
          </tr>
          <tr>
            {/* 요일(문자) 렌더링 (이 부분은 거의 정확했습니다) */}
            {scheduleData.DayInfo.map(({ dayString, isWeekend }, index) => (
              <th
                key={`day-${index}`}
                className={`px-4 py-2 text-center text-xs font-bold uppercase tracking-wider border-b border-gray-200 transition-colors duration-200 ${
                  isWeekend ? 'text-red-600' : 'text-gray-600'
                }`}
              >
                {dayString}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='bg-white '>
          {/* 3. ScheduleInfo가 객체이므로 Object.values()로 순회 */}
          {scheduleData.ScheduleInfo.map((item, workerIndex) => {
            return (
              <tr key={`worker-${workerIndex}`}>
                {/* 근무자 이름 (고정 셀) */}
                <td className='sticky left-0 bg-gray-200 px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900 z-10 border-r'>
                  {item.worker.name}
                </td>

                {/* 4. 각 근무자의 일별 스케줄 순회 */}
                {item.schedule.map((shift, dayIndex) => {
                  // 5. isWeekend 정보는 DayInfo 배열에서 가져와야 합니다.
                  const dayInfo = scheduleData.DayInfo[dayIndex]
                  const isWeekend = dayInfo ? dayInfo.isWeekend : false
                  const isHoliday = dayInfo ? dayInfo.isHoliday : false

                  return (
                    <td
                      key={`cell-${workerIndex}-${dayIndex}`}
                      className='border-b'
                    >
                      <div
                        className={`w-full h-full flex items-center justify-center py-3 text-sm ${
                          isWeekend || isHoliday
                            ? 'bg-red-50 text-red-700'
                            : 'bg-white text-gray-700'
                        }`}
                      >
                        {shift}
                      </div>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default ScheduleTable
