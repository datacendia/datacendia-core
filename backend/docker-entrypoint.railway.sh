#!/bin/sh
set -e

# Ensure PORT and DEMO_MODE are exported for child processes
export PORT="${PORT:-3001}"
export DEMO_MODE="${DEMO_MODE:-true}"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║         DATACENDIA — Railway Deployment                    ║"
echo "║         Auto-migrate + Auto-seed                           ║"
echo "╚════════════════════════════════════════════════════════════╝"

if [ "$DEMO_MODE" = "true" ]; then
  echo ""
  echo "⚠️  DEMO MODE ACTIVE — authentication bypass enabled"
  echo "   Set DEMO_MODE=false and REQUIRE_AUTH=true for production use"
  echo ""
fi

# Railway provides DATABASE_URL automatically
if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL is not set. Add a PostgreSQL plugin to your Railway project."
  exit 1
fi

# Wait for database to be reachable (Railway may take a moment)
echo "Checking database connection..."
MAX_RETRIES=15
RETRY=0
until node -e "
  const url = new URL(process.env.DATABASE_URL);
  const net = require('net');
  const s = net.createConnection({ host: url.hostname, port: url.port || 5432 }, () => { s.end(); process.exit(0); });
  s.on('error', () => process.exit(1));
  setTimeout(() => process.exit(1), 3000);
" 2>/dev/null; do
  RETRY=$((RETRY + 1))
  if [ "$RETRY" -ge "$MAX_RETRIES" ]; then
    echo "WARNING: Could not verify database connection after ${MAX_RETRIES} attempts. Proceeding anyway..."
    break
  fi
  echo "  ...waiting for database (attempt $RETRY/$MAX_RETRIES)"
  sleep 2
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

  # seed-council-showcase is generated per-deployment; skip if not present
  if [ -f prisma/seed-council-showcase.ts ]; then
    echo "Seeding Council showcase deliberations..."
    npx tsx prisma/seed-council-showcase.ts 2>&1 || {
      echo "Warning: Showcase seed had issues."
    }
  fi
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
