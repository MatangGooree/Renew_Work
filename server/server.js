import "dotenv/config"; // 1. dotenv/config를 import하여 환경변수 로드
import express from "express";
import session from "express-session";
import { fileURLToPath } from "url"; // 2. __dirname을 대체하기 위해 추가
import path from "path";
import redisStore from "./redis.js";
import router from "./Routes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    store: redisStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);
app.use("/api", router);

app.use(express.static(path.join(__dirname, "..", "client", "build")));

app.get("/{*any}", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "client", "build", "index.html"));
});
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
