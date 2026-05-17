#!/usr/bin/env bash
set -euo pipefail

REMOTE_DIR="${REMOTE_DIR:-/home/yzb}"
COMPOSE_FILE="$REMOTE_DIR/docker-compose.yml"
MYSQL_CONTAINER="${MYSQL_CONTAINER:-yzbhc-mysql}"
BACKEND_CONTAINER="${BACKEND_CONTAINER:-yzbhc-backend}"

compose() {
  if docker compose version >/dev/null 2>&1; then
    docker compose "$@"
  else
    docker-compose "$@"
  fi
}

cd "$REMOTE_DIR"

echo "--- Pulling latest images ---"
compose -f "$COMPOSE_FILE" pull

echo "--- Restarting containers ---"
compose -f "$COMPOSE_FILE" up -d

echo "--- Container status ---"
compose -f "$COMPOSE_FILE" ps

echo "--- Backend logs ---"
docker logs --tail=30 "$BACKEND_CONTAINER"

echo "--- Nginx connectivity check ---"
sleep 3
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/ || echo "failed")
echo "HTTP status: $STATUS"

echo "--- Removing unused images ---"
docker image prune -af >/dev/null 2>&1 || true

echo "--- Deploy complete ---"
