const startDate = new Date('2025-01-01');

const shifts = ['○', '●▣', 'X', 'XX']; // 주간, 야간, 비번, 휴무

function daysDiff(currentYear, currentMonth) {
  const firstDay = new Date(currentYear, currentMonth, 1);
  const timeDiff = firstDay.getTime() - startDate.getTime();
  const Diff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  return Diff;
}

function GetSchedule(Workers, days, currentYear, currentMonth) {
  const schedule = {};
  Workers.forEach((worker) => {
    const startIndex = parseInt(worker.Worker_ID);
    const index = daysDiff(currentYear, currentMonth) + startIndex;
    schedule[worker.Name] = Array.from({ length: days }, (_, i) => shifts[(index + i) % shifts.length]);
  });
  return schedule;
}

export { GetSchedule };
