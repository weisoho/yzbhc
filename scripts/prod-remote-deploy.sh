#!/usr/bin/env bash
set -euo pipefail
set +H

REMOTE_DIR="${REMOTE_DIR:-/home/yzb}"
DEPLOY_DIR="$REMOTE_DIR/.deploy"
COMPOSE_FILE="$REMOTE_DIR/docker-compose.yml"
MYSQL_CONTAINER="${MYSQL_CONTAINER:-yzbhc-mysql}"
BACKEND_CONTAINER="${BACKEND_CONTAINER:-yzbhc-backend}"
NGINX_CONTAINER="${NGINX_CONTAINER:-yzbhc-nginx}"
SQL_FILE="$DEPLOY_DIR/20260506_add_status_columns.sql"
TIMESTAMP="$(date +%Y%m%d%H%M%S)"

compose() {
  if docker compose version >/dev/null 2>&1; then
    docker compose "$@"
  else
    docker-compose "$@"
  fi
}

resolve_mysql_root_password() {
  local resolved_password="${MYSQL_ROOT_PASSWORD:-}"

  if [ -n "$resolved_password" ]; then
    printf '%s' "$resolved_password"
    return
  fi

  if docker inspect "$MYSQL_CONTAINER" >/dev/null 2>&1; then
    resolved_password="$(docker inspect "$MYSQL_CONTAINER" --format '{{range .Config.Env}}{{println .}}{{end}}' | sed -n 's/^MYSQL_ROOT_PASSWORD=//p' | head -n 1)"
  fi

  if [ -z "$resolved_password" ] && [ -f "$COMPOSE_FILE" ]; then
    resolved_password="$(sed -n 's/^[[:space:]]*MYSQL_ROOT_PASSWORD:[[:space:]]*//p' "$COMPOSE_FILE" | head -n 1 | sed 's/^"//; s/"$//')"
  fi

  if [ -z "$resolved_password" ] && [ -f "$DEPLOY_DIR/docker-compose.yml" ]; then
    resolved_password="$(sed -n 's/^[[:space:]]*MYSQL_ROOT_PASSWORD:[[:space:]]*//p' "$DEPLOY_DIR/docker-compose.yml" | head -n 1 | sed 's/^"//; s/"$//')"
  fi

  if [ -z "$resolved_password" ]; then
    echo "Unable to resolve MySQL root password. Provide MYSQL_ROOT_PASSWORD in the environment." >&2
    exit 1
  fi

  printf '%s' "$resolved_password"
}

backup_if_exists() {
  local source_path="$1"
  local backup_path="$2"

  if [ -e "$source_path" ]; then
    cp -a "$source_path" "$backup_path"
  fi
}

column_count() {
  local table_name="$1"
  docker exec -e MYSQL_PWD="$MYSQL_ROOT_PASSWORD" "$MYSQL_CONTAINER" \
    mysql -uroot -Nse "SELECT COUNT(*) FROM information_schema.columns WHERE table_schema='yzb' AND table_name='${table_name}' AND column_name='status'"
}

cd "$REMOTE_DIR"
MYSQL_ROOT_PASSWORD="$(resolve_mysql_root_password)"

backup_if_exists "$COMPOSE_FILE" "$COMPOSE_FILE.bak.$TIMESTAMP"
backup_if_exists "$REMOTE_DIR/nginx.conf" "$REMOTE_DIR/nginx.conf.bak.$TIMESTAMP"
backup_if_exists "$REMOTE_DIR/yzb.jar" "$REMOTE_DIR/yzb.jar.bak.$TIMESTAMP"

if [ -d "$REMOTE_DIR/dist" ]; then
  rm -rf "$REMOTE_DIR/dist.bak.$TIMESTAMP"
  cp -a "$REMOTE_DIR/dist" "$REMOTE_DIR/dist.bak.$TIMESTAMP"
fi

cp "$DEPLOY_DIR/docker-compose.yml" "$COMPOSE_FILE"
cp "$DEPLOY_DIR/nginx.conf" "$REMOTE_DIR/nginx.conf"
cp "$DEPLOY_DIR/yzb.jar" "$REMOTE_DIR/yzb.jar"
rm -rf "$REMOTE_DIR/dist"
tar -xzf "$DEPLOY_DIR/frontend-dist.tar.gz" -C "$REMOTE_DIR"

if [ -f "$SQL_FILE" ]; then
  adverse_count="$(column_count adverse_event_record)"
  issue_count="$(column_count consumable_quality_issue)"

  if [ "$adverse_count" = "0" ] || [ "$issue_count" = "0" ]; then
    docker exec -i -e MYSQL_PWD="$MYSQL_ROOT_PASSWORD" "$MYSQL_CONTAINER" mysql -uroot yzb < "$SQL_FILE"
  fi
fi

compose -f "$COMPOSE_FILE" up -d
docker restart "$BACKEND_CONTAINER" "$NGINX_CONTAINER" >/dev/null
compose -f "$COMPOSE_FILE" ps
docker logs --tail=80 "$BACKEND_CONTAINER"