FROM hub.aiursoft.cn/oven/bun:slim as node-env

USER root

WORKDIR /app

COPY bunfig.toml .
COPY package.json .
RUN bun i

COPY . .
RUN bun --bun run build

WORKDIR /app/build
# RUN bunx node-pg-migrate up

EXPOSE 3000

CMD ["bun", "--bun", "run", "start"]