#!/bin/sh
set -e

echo "=== Datacendia Backend Startup ==="

# Run Prisma migrations if DATABASE_URL is a PostgreSQL connection
if echo "$DATABASE_URL" | grep -q "postgresql"; then
  echo "Running Prisma migrations..."
  npx prisma migrate deploy --schema=prisma/schema 2>&1 || {
    echo "Warning: Prisma migrate deploy failed. Falling back to db push..."
    npx prisma db push --schema=prisma/schema --accept-data-loss 2>&1 || {
      echo "Warning: Prisma db push also failed. Starting anyway..."
    }
  }
  echo "Database schema ready."
else
  echo "Non-PostgreSQL DATABASE_URL detected, skipping migrations."
fi

echo "Starting backend server..."
exec "$@"
