function GetEmptySchedule(currentYear, currentMonth) {
  const startDate = new Date("2025-01-01");
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const shifts = ["○", "●▣", "X", "XX"]; // 주간, 야간, 비번, 휴무
  const stringDays = ["일", "월", "화", "수", "목", "금", "토"];

  function daysDiff() {
    const firstDay = new Date(currentYear, currentMonth - 1, 1);
    const timeDiff = firstDay.getTime() - startDate.getTime();
    return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  }
  const emptySchedules = {};

  const dayInfo = Array.from({ length: daysInMonth }, (_, day) => {
    const dayInMonth = new Date(
      currentYear,
      currentMonth - 1,
      day + 1,
    ).getDay();

    const dayString = stringDays[dayInMonth];

    const Weekend = dayInMonth === 0 || dayInMonth === 6;

    return {
      dayString,
      isWeekend: Weekend,
      isHoliday: false, //API 복구되면 추가하기
    };
  });

  emptySchedules["DayInfo"] = dayInfo;
  emptySchedules["ScheduleInfo"] = [];

  for (let i = 0; i < 5; i++) {
    const startIndex = 5 - i;

    const index = daysDiff() + startIndex;

    const schedule = Array.from({ length: daysInMonth }, (_, j) => {
      if (i === 0) {
        return dayInfo[j].isWeekend ? shifts[3] : shifts[0];
      } else {
        return shifts[(index + j) % shifts.length];
      }
    });

    emptySchedules["ScheduleInfo"].push({
      worker: { name: i.toString() },
      schedule: schedule,
    });
  }

  return emptySchedules;
}

export { GetEmptySchedule };
