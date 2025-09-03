FROM hub.aiursoft.cn/oven/bun:slim as build

USER root

WORKDIR /app

COPY bunfig.toml .
COPY package.json .
RUN bun i

COPY . .
RUN bun --bun run build

EXPOSE 3000

CMD bunx node-pg-migrate up && bun ./build/index.js