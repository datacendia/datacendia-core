#!/bin/sh
set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║         DATACENDIA DEMO MODE                               ║"
echo "║         Auto-migrate + Auto-seed                           ║"
echo "╚════════════════════════════════════════════════════════════╝"

# Wait for postgres. Postgres doesn't speak HTTP and the image has no
# pg_isready, so check the TCP port directly (busybox nc ships with Alpine).
PG_HOST="${PG_HOST:-postgres}"
PG_PORT="${PG_PORT:-5432}"
echo "Waiting for PostgreSQL at ${PG_HOST}:${PG_PORT}..."
tries=0
until nc -z "$PG_HOST" "$PG_PORT" 2>/dev/null; do
  tries=$((tries + 1))
  if [ "$tries" -ge 60 ]; then
    echo "PostgreSQL did not accept connections after 120s. Giving up."
    exit 1
  fi
  sleep 2
  echo "  ...waiting for PostgreSQL"
done
echo "PostgreSQL is ready."

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
echo "Seeding demo data..."
npx tsx prisma/seed-full-demo.ts 2>&1 || {
  echo "Warning: Base seed had issues. Demo may have partial data."
}

# Seed showcase deliberations (5 verticals + human override) when this edition ships them
if [ -f prisma/seed-council-showcase.ts ]; then
  echo "Seeding Council showcase deliberations..."
  npx tsx prisma/seed-council-showcase.ts 2>&1 || {
    echo "Warning: Showcase seed had issues. Deliberations may be incomplete."
  }
else
  echo "No showcase deliberations in this edition (prisma/seed-council-showcase.ts not present)."
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  DEMO READY                                                ║"
echo "║                                                            ║"
echo "║  Frontend:  http://localhost:5173                          ║"
echo "║  API:       http://localhost:3001                          ║"
echo "║  API Docs:  http://localhost:3001/api/v1                   ║"
echo "║                                                            ║"
echo "║  Demo login:    sarah.chen@acme.demo                       ║"
echo "║  Password:      demo-password-2024                         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

echo "Starting backend server..."
exec "$@"
