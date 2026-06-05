# Use the official Bun image
FROM oven/bun:1 as base
WORKDIR /usr/src/app

# Install dependencies
FROM base AS install
COPY . .

# Run pnpm install
RUN bun install -g pnpm@8.15.5
RUN pnpm install --frozen-lockfile=false

# Copy application source
FROM base AS release
COPY --from=install /usr/src/app /usr/src/app

WORKDIR /usr/src/app/apps/backend

EXPOSE 8080

ENV PORT=8080

# Run the app
ENTRYPOINT ["bun", "run", "start"]
