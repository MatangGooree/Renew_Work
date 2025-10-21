import prismaClient from "./DB_Call.js";

export async function GetWorkers() {
  return prismaClient.Workers.findMany();
}

export async function FindWorker(id, password) {
  return prismaClient.Workers.findFirst({
    where: {
      login_ID: id,
      login_PW: password,
    },
  });
}
