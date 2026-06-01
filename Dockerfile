# Use the official Bun image
FROM oven/bun:1 as base
WORKDIR /usr/src/app

# Install dependencies
FROM base AS install
COPY package.json bun.lockb* ./
COPY apps/backend/package.json ./apps/backend/

# Run bun install
RUN bun install

# Copy application source
FROM base AS release
COPY --from=install /usr/src/app/node_modules ./node_modules
COPY apps/backend ./apps/backend

WORKDIR /usr/src/app/apps/backend

EXPOSE 8080

ENV PORT=8080

# Run the app
ENTRYPOINT ["bun", "run", "start"]
