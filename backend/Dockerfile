# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Prisma picks its query engine by the OpenSSL it finds at generate time.
# node:20-alpine ships OpenSSL 3 but not the `openssl` package Prisma probes
# for, so without this it guesses 1.1.x and the engine fails to load libssl.so.1.1
# at runtime.
RUN apk add --no-cache openssl

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies (npm install instead of npm ci for workspace monorepo compatibility)
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Skip TypeScript compilation during Docker build; run via tsx at runtime

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# dumb-init for proper signal handling; openssl for the Prisma query engine
RUN apk add --no-cache dumb-init openssl

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy built files, owned by the runtime user at copy time. A separate
# `chown -R /app` afterwards rewrote every file in node_modules into a second
# multi-GB layer and took over ten minutes on Docker Desktop.
COPY --chown=nodejs:nodejs --from=builder /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs --from=builder /app/src ./src
COPY --chown=nodejs:nodejs --from=builder /app/prisma ./prisma
COPY --chown=nodejs:nodejs --from=builder /app/package*.json ./

# Copy entrypoint scripts
COPY --chown=nodejs:nodejs docker-entrypoint.sh docker-entrypoint.demo.sh ./
# Strip CRLF in case the build context came from a Windows checkout.
RUN sed -i 's/\r$//' docker-entrypoint.sh docker-entrypoint.demo.sh && \
    chmod +x docker-entrypoint.sh docker-entrypoint.demo.sh && \
    chown nodejs:nodejs /app

USER nodejs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

# Start with dumb-init, run entrypoint (migrations), then app
ENTRYPOINT ["dumb-init", "--", "./docker-entrypoint.sh"]
CMD ["node", "--import", "tsx", "src/index.ts"]
