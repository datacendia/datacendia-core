#!/bin/sh
set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║         DATACENDIA DEMO MODE                               ║"
echo "║         Auto-migrate + Auto-seed                           ║"
echo "╚════════════════════════════════════════════════════════════╝"

# Wait for postgres
echo "Waiting for PostgreSQL..."
until wget -q --spider http://postgres:5432 2>/dev/null || pg_isready -h postgres -U datacendia_demo 2>/dev/null; do
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

# Seed showcase deliberations (5 verticals + human override)
echo "Seeding Council showcase deliberations..."
npx tsx prisma/seed-council-showcase.ts 2>&1 || {
  echo "Warning: Showcase seed had issues. Deliberations may be incomplete."
}

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  DEMO READY                                                ║"
echo "║                                                            ║"
echo "║  Frontend:  http://localhost:5173                          ║"
echo "║  API:       http://localhost:3001                          ║"
echo "║  API Docs:  http://localhost:3001/api/v1                   ║"
echo "║                                                            ║"
echo "║  Demo Login: sarah.chen@acme.demo                         ║"
echo "║  (dev auth bypass — no password needed)                    ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

echo "Starting backend server..."
exec "$@"
