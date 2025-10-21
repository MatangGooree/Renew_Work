import express from "express";
import { getAnniversary } from "./APIs.js";
import { GetEmptySchedule } from "./utils/GetFinalSchedule.js";
import { FindWorker, GetWorkers } from "./WorkerDB.js";
import { addVacation } from "./VacationDB.js";

const router = express.Router();

const AuthCheck = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401).send("로그인을 해야합니다.");
  }
};

//로그인
router.post("/login", async (req, res) => {
  console.dir(req.body);
  const { id, password } = req.body;

  try {
    const results = await FindWorker(id, password);
    console.dir(results);
    if (results) {
      const user = results;
      req.session.user = {
        id: user.worker_ID,
        roll: user.Roll,
        name: user.Name,
        remain_Day: user.remain_Day,
        remain_Night: user.remain_Night,
      };
      console.log("로그인 성공. 세션 정보:", req.session);
      res.json({
        success: true,
        message: "로그인 성공!",
        user: req.session.user,
      });
    } else {
      res.status(401).json({
        success: false,
        message: "아이디 또는 비밀번호가 잘못되었습니다.",
      });
    }
  } catch (error) {
    console.error("로그인 쿼리 오류:", error);
    res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다." });
  }
});

router.get("/logout", (req, res) => {
  if (req.session.user) {
    req.session.destroy();
    res.status(200).json({ success: true, message: "로그아웃 성공!" });
  } else {
    res.status(401).json({ success: false, message: "로그아웃 실패!" });
  }
});

router.get("/AuthCheck", AuthCheck, async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.session.user,
  });
});

//스케줄
router.get("/getSchedule", AuthCheck, async (req, res) => {
  const { year, month } = req.query;
  const scheduleData = GetEmptySchedule(year, month);
  const workers = await GetWorkers();
  scheduleData.ScheduleInfo.forEach((worker) => {
    worker.worker.name = workers.find(
      (s) => s.worker_ID === parseInt(worker.worker.name) + 1,
    ).Name;
  });

  res.json(scheduleData);
});

//근무자
router.get("/getWorkers", AuthCheck, async (req, res) => {
  const result = await GetWorkers();
  console.dir(result);
  res.json(result);
});
//공휴일 정보
router.get("/anniversary", async (req, res) => {
  const year = parseInt(req.query.year);
  const month = parseInt(req.query.month);

  const data = await getAnniversary(year, month);
  res.json({ data });
});

export default router;
