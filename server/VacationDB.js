import prismaClient from "./DB_Call.js";

export async function addVacation(worker_ID, date) {
  return await prismaClient.Vacations.create({
    data: {
      worker_ID,
      Date: date,
    },
  });
}

export async function getVacation(year, month) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  return prismaClient.Vacations.findMany({
    where: {
      Date: { gte: startDate, lte: endDate },
    },
  });
}
