//년, 월 입력 시 달력 출력

async function GetCalData(currentYear, currentMonth) {
  const today = new Date();
  const isCurrentMonthView = today.getFullYear() === currentYear && today.getMonth() === currentMonth;
  const todaysDate = isCurrentMonthView ? today.getDate() : null;

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const dayLabels = ['일', '월', '화', '수', '목', '금', '토'];
  const Anniversaries = await getAnniData(currentYear, currentMonth);

  return Array.from({ length: daysInMonth }, (_, i) => {
    const date = i + 1;
    const dayOfWeek = new Date(currentYear, currentMonth, date).getDay(); // 0: Sun, 6: Sat

    const dailyAnniversaries = Anniversaries.filter((anni) => {
      return parseInt(anni.locdate) === date;
    });
    return {
      date,
      dayLabel: dayLabels[dayOfWeek],
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      isToday: date === todaysDate,
      Anniversary: dailyAnniversaries,
    };
  });
}

//공휴일 불러오기
async function getAnniData(currentYear, currentMonth) {
  try {
    const response = await fetch(`/api/anniversary?year=${currentYear}&month=${currentMonth}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    // API 응답 구조에 따라 안전하게 데이터 접근 및 상태 업데이트
    const items = result?.data?.response?.body?.items?.item;

    if (Array.isArray(items)) {
      return items;
    } else if (items) {
      return [items];
    } else {
      // 데이터가 없거나 예상치 못한 구조인 경우
      return [];
    }
  } catch (error) {
    console.error('기념일 데이터를 가져오는 중 오류 발생:', error);
    return [];
  }
}

export { getAnniData, GetCalData };
