FROM oven/bun:1
WORKDIR /usr/src/app

COPY apps/backend/package.json ./
RUN bun install

COPY apps/backend/src ./src

EXPOSE 8080
ENV PORT=8080

ENTRYPOINT ["bun", "run", "src/index.ts"]
