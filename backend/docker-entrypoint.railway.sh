#!/bin/sh
set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║         DATACENDIA — Railway Deployment                    ║"
echo "║         Auto-migrate + Auto-seed                           ║"
echo "╚════════════════════════════════════════════════════════════╝"

# Railway provides DATABASE_URL automatically
if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL is not set. Add a PostgreSQL plugin to your Railway project."
  exit 1
fi

# Railway injects PORT; ensure the app binds to it.
# Default to 3001 to match the Dockerfile EXPOSE if PORT is not set.
export PORT="${PORT:-3001}"

# Enable demo mode by default on Railway so the server can start without
# requiring REQUIRE_AUTH=true.  Set DEMO_MODE=false and REQUIRE_AUTH=true
# in the Railway dashboard to switch to a fully-authenticated deployment.
export DEMO_MODE="${DEMO_MODE:-true}"

if [ "$DEMO_MODE" = "true" ]; then
  echo "⚠️  DEMO MODE: Authentication bypass is active (seeded demo accounts only)."
  echo "⚠️  Set DEMO_MODE=false and REQUIRE_AUTH=true in the Railway dashboard to secure this deployment."
fi

# Wait for database to be reachable (Railway may take a moment)
echo "Checking database connection..."
MAX_RETRIES=15
RETRY=0
until node -e "
  const { PrismaClient } = require('@prisma/client');
  const p = new PrismaClient();
  p.\$connect().then(() => { p.\$disconnect(); process.exit(0); }).catch(() => process.exit(1));
" 2>/dev/null; do
  RETRY=$((RETRY + 1))
  if [ "$RETRY" -ge "$MAX_RETRIES" ]; then
    echo "WARNING: Could not verify database connection after ${MAX_RETRIES} attempts. Proceeding anyway..."
    break
  fi
  echo "  ...waiting for database (attempt $RETRY/$MAX_RETRIES)"
  sleep 3
done
echo "Database connection ready."

# Run migrations
echo "Running Prisma migrations..."
npx prisma migrate deploy --schema=prisma/schema 2>&1 || {
  echo "Falling back to db push..."
  npx prisma db push --schema=prisma/schema --accept-data-loss 2>&1 || {
    echo "Warning: Schema push failed. Starting anyway..."
  }
}
echo "Database schema ready."

# Seed demo data (idempotent — checks for existing data)
if [ "${SKIP_SEED:-false}" != "true" ]; then
  echo "Seeding demo data..."
  npx tsx prisma/seed-full-demo.ts 2>&1 || {
    echo "Warning: Base seed had issues. Demo may have partial data."
  }

  echo "Seeding Council showcase deliberations..."
  npx tsx prisma/seed-council-showcase.ts 2>&1 || {
    echo "Warning: Showcase seed had issues."
  }
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  RAILWAY DEPLOYMENT READY                                  ║"
echo "║                                                            ║"
echo "║  Health:  /health                                          ║"
echo "║  API:     /api/v1                                          ║"
echo "║                                                            ║"
echo "║  Demo Login: sarah.chen@acme.demo                         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

echo "Starting backend server..."
exec "$@"
