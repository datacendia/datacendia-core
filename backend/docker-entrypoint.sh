#!/bin/sh
set -e

echo "=== Datacendia Backend Startup ==="

# Run Prisma migrations if DATABASE_URL is a PostgreSQL connection
if echo "$DATABASE_URL" | grep -q "postgresql"; then
  echo "Running Prisma migrations..."
  npx prisma migrate deploy --schema=prisma/schema 2>&1 || {
    echo "ERROR: Prisma migrate deploy failed."
    echo "Do NOT use 'db push --accept-data-loss' in production — it can drop columns/tables."
    echo "Fix migrations manually or set SKIP_MIGRATIONS=true to start without migrating."
    if [ "${SKIP_MIGRATIONS:-false}" = "true" ]; then
      echo "SKIP_MIGRATIONS=true — proceeding without migrations."
    else
      exit 1
    fi
  }
  echo "Database schema ready."
else
  echo "Non-PostgreSQL DATABASE_URL detected, skipping migrations."
fi

echo "Starting backend server..."
exec "$@"
