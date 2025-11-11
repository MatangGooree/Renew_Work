import prismaClient from "../DB_Call.js";

function shiftfWorker(n, isDay) {
  if (isDay) {
    return (n + 1) % 4;
  } else {
    return (n + 3) % 4;
  }
}
export async function addVacation(worker_ID, date, schedule) {
  if (worker_ID === 5) {
    console.log(worker_ID, date, schedule);
    return await prismaClient.Vacations.create({
      data: {
        worker_ID,
        Date: date,
        Time: schedule,
      },
    });
  }

  let replaceWorker = shiftfWorker(worker_ID, schedule === "day");
  try {
    return await prismaClient.$transaction([
      prismaClient.Vacations.create({
        data: {
          worker_ID,
          Date: date,
          Time: schedule,
        },
      }),
      prismaClient.Workers.update({
        where: {
          worker_ID: worker_ID,
        },
        data: {
          remain_Day: {
            decrement: 1,
          },
        },
      }),
      prismaClient.Workers.update({
        where: {
          worker_ID: replaceWorker,
        },
        data: {
          remain_Day: {
            increment: 1,
          },
        },
      }),
    ]);
  } catch (e) {
    console.error(e);
  }
}

export async function deleteVacation(worker_ID, date, schedule) {
  try {
    console.log(worker_ID, date, schedule);
    if (worker_ID === 5) {
      console.log(worker_ID, date, schedule);
      return await prismaClient.Vacations.deleteMany({
        where: {
          worker_ID: worker_ID,
          Date: date,
        },
      });
    }

    let replaceWorker = shiftfWorker(worker_ID, schedule.includes("D"));

    return await prismaClient.$transaction([
      prismaClient.Vacations.deleteMany({
        where: {
          worker_ID: worker_ID,
          Date: date,
        },
      }),
      prismaClient.Workers.update({
        where: {
          worker_ID: worker_ID,
        },
        data: {
          remain_Day: {
            increment: 1,
          },
        },
      }),
      prismaClient.Workers.update({
        where: {
          worker_ID: replaceWorker,
        },
        data: {
          remain_Day: {
            decrement: 1,
          },
        },
      }),
    ]);
  } catch (e) {
    console.error(e);
  }
}

export async function getVacation(year, month) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  // console.log(startDate, endDate);
  return prismaClient.Vacations.findMany({
    where: {
      Date: { gte: startDate, lte: endDate },
    },
  });
}
