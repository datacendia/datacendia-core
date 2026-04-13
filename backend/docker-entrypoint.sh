#!/bin/sh
set -e

echo "=== Datacendia Backend Startup ==="

# Run Prisma migrations if DATABASE_URL is a PostgreSQL connection
if echo "$DATABASE_URL" | grep -q "postgresql"; then
  echo "Running Prisma migrations..."
  if npx prisma migrate deploy --schema=prisma/schema 2>&1; then
    echo "Database schema ready."
  else
    echo "ERROR: Prisma migrate deploy failed."
    echo "Do NOT use 'db push --accept-data-loss' in production — it can drop columns/tables."
    if [ "${SKIP_MIGRATIONS:-false}" = "true" ]; then
      echo "WARNING: SKIP_MIGRATIONS=true — proceeding WITHOUT confirmed schema. Database may be out of date."
    else
      echo "Fix migrations manually or set SKIP_MIGRATIONS=true to start without migrating."
      exit 1
    fi
  fi
else
  echo "Non-PostgreSQL DATABASE_URL detected, skipping migrations."
fi

echo "Starting backend server..."
exec "$@"
