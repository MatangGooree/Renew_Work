# --- 1단계: React 프론트엔드 빌드 (Builder) ---
# 'builder'라는 별명을 가진 빌드 전용 환경을 만듭니다.
FROM node:18-alpine AS builder

# 프론트엔드 작업 폴더로 이동
WORKDIR /client

# 의존성 설치 (캐시 활용을 위해 package.json 먼저 복사)
COPY client/package*.json ./
RUN npm install

# 나머지 프론트엔드 소스 코드 복사 및 빌드
COPY client/ ./
RUN npm run build
# (이 단계가 끝나면 /app/frontend/build 폴더에 결과물이 생깁니다)


# --- 2단계: 최종 Node.js 서버 (Production) ---
# 깨끗한 Node.js 18 이미지에서 다시 시작합니다.
FROM node:18-alpine

# 최종 서버의 작업 폴더를 지정합니다.
WORKDIR /usr/src/app

# 백엔드 의존성 설치 (실제 서비스에 필요한 것만)
COPY server/package*.json ./
RUN npm install --omit=dev

# 백엔드 소스 코드를 복사합니다.
# (server.js, api 라우터 등이 모두 복사됩니다)
COPY server/ .

# ★★★★★ 여기가 핵심 ★★★★★
# 1단계(builder)에서 빌드했던 React 결과물(/app/frontend/build)을
# 현재 폴더(WORKDIR) 아래 'build'라는 이름으로 복사해옵니다.
COPY --from=builder client/build ./build

# Node.js 서버가 5000번 포트를 사용한다고 알림
# (사용자님 서버 포트가 다르면 이 숫자를 변경하세요)
EXPOSE 5000

# 최종 컨테이너 실행 명령어
# (package.json의 "start" 스크립트로 실행한다면 ["npm", "start"])
CMD [ "node", "server.js" ]