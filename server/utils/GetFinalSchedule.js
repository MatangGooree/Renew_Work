import { GetWorkers } from "../DB/WorkerDB.js";
import { getVacation } from "../DB/VacationDB.js";

const stringDays = ["일", "월", "화", "수", "목", "금", "토"];
const scheduleShifts = ["D", "N", "X", "XX"];

async function GetEmptySchedule(currentYear, currentMonth) {
  const emptySchedules = {};

  const startDate = new Date("2000-01-01");
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

  function daysDiff() {
    const firstDay = new Date(currentYear, currentMonth - 1, 1);
    const timeDiff = firstDay.getTime() - startDate.getTime();
    return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  }

  const Workers = await GetWorkers();

  const WorkerData = Workers.map((worker) => {
    return {
      worker_ID: worker.worker_ID,
      name: worker.Name,
      Roll: worker.Roll,
      remain_Day: worker.remain_Day,
      scheduleTime: [],
    };
  });

  const dayInfo = Array.from({ length: daysInMonth }, (_, day) => {
    const dayInMonth = new Date(
      currentYear,
      currentMonth - 1,
      day + 1,
    ).getDay();
    //날짜정보
    const dayString = stringDays[dayInMonth];
    const Weekend = dayInMonth === 0 || dayInMonth === 6;

    //근무자 데이터에 근무일 삽입
    WorkerData.forEach((worker) => {
      if (worker.worker_ID < 4) {
        worker.scheduleTime.push(
          scheduleShifts[(daysDiff() + day - worker.worker_ID) % 4],
        );
      } else if (worker.worker_ID === 5) {
        Weekend
          ? worker.scheduleTime.push("XX")
          : worker.scheduleTime.push("D");
      }
    });

    return {
      dayString,
      isWeekend: Weekend,
      isHoliday: false, //API 복구되면 추가하기
    };
  });

  const vacation = await getVacation(currentYear, currentMonth);
  vacation.forEach((item) => {
    //해당하는 날짜의 워커 데이터를 찾는다
    const day = item.Date.getDate() - 2;

    if (item.worker_ID < 4) {
      let replaceWorker;
      if (item.Time === "day") {
        replaceWorker = (item.worker_ID + 1) % 4;
        WorkerData[item.worker_ID].scheduleTime[day] = "XX_D_VAC";

        WorkerData[replaceWorker].scheduleTime[day] = "D_REP";
      } else if (item.Time === "night") {
        replaceWorker = (item.worker_ID + 3) % 4;
        WorkerData[item.worker_ID].scheduleTime[day] = "XX_N_VAC";
        WorkerData[replaceWorker].scheduleTime[day] = "N_REP";
      }
    } else if (item.worker_ID === 5) {
      WorkerData[item.worker_ID].scheduleTime[day] = "XX_D_VAC";
    }
  });
  emptySchedules["year"] = parseInt(currentYear);
  emptySchedules["month"] = parseInt(currentMonth);
  emptySchedules["DayInfo"] = dayInfo;
  emptySchedules["WorkerData"] = WorkerData;
  return emptySchedules;
}

export { GetEmptySchedule };
