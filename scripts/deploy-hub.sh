#!/usr/bin/env bash
set -Eeuo pipefail

REMOTE_HOST="${REMOTE_HOST:-}"
REMOTE_USER="${REMOTE_USER:-}"
REMOTE_PORT="${REMOTE_PORT:-22}"
REMOTE_DIR="${REMOTE_DIR:-/opt/pegger-hub}"
CADDYFILE_PATH="${CADDYFILE_PATH:-/opt/spotonsight/infrastructure/caddy/Caddyfile}"
SSH_KEY_PATH="${SSH_KEY_PATH:-${HOME}/.ssh/id_ed25519}"
PUBLIC_URL="${PUBLIC_URL:-https://pegger.dev}"
PROXY_CONTAINER="${PROXY_CONTAINER:-spotonsight-proxy-1}"

: "${REMOTE_HOST:?REMOTE_HOST is required}"
: "${REMOTE_USER:?REMOTE_USER is required}"

if [[ ! -f "${SSH_KEY_PATH}" ]]; then
  echo "SSH key not found: ${SSH_KEY_PATH}" >&2
  exit 1
fi

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REVISION="${GITHUB_SHA:-$(git -C "${ROOT_DIR}" rev-parse HEAD)}"

validate_value() {
  local name="$1"
  local value="$2"
  local pattern="$3"

  if [[ ! "${value}" =~ ${pattern} ]]; then
    echo "Invalid ${name}" >&2
    exit 1
  fi
}

validate_value REMOTE_HOST "${REMOTE_HOST}" '^[A-Za-z0-9.:-]+$'
validate_value REMOTE_USER "${REMOTE_USER}" '^[A-Za-z_][A-Za-z0-9_-]*$'
validate_value REMOTE_PORT "${REMOTE_PORT}" '^[0-9]{1,5}$'
validate_value REMOTE_DIR "${REMOTE_DIR}" '^/[A-Za-z0-9._/-]+$'
validate_value CADDYFILE_PATH "${CADDYFILE_PATH}" '^/[A-Za-z0-9._/-]+$'
validate_value PROXY_CONTAINER "${PROXY_CONTAINER}" '^[A-Za-z0-9_.-]+$'
validate_value REVISION "${REVISION}" '^[0-9a-fA-F]{40}$'

if (( REMOTE_PORT < 1 || REMOTE_PORT > 65535 )); then
  echo "Invalid REMOTE_PORT" >&2
  exit 1
fi

SSH_OPTIONS=(
  -p "${REMOTE_PORT}"
  -i "${SSH_KEY_PATH}"
  -o BatchMode=yes
  -o StrictHostKeyChecking=yes
)

ssh_cmd() {
  ssh "${SSH_OPTIONS[@]}" "${REMOTE_USER}@${REMOTE_HOST}" "$@"
}

deployment_swapped=false
public_was_healthy=false

if curl --fail --silent --max-time 15 "${PUBLIC_URL%/}/health" >/dev/null 2>&1; then
  public_was_healthy=true
fi

rollback_deployment() {
  echo "Deployment failed; restoring the previous release" >&2
  ssh_cmd "bash -s -- '${REMOTE_DIR}'" <<'REMOTE_ROLLBACK'
set -euo pipefail
remote_dir="$1"

if [[ ! -d "${remote_dir}/dist.previous" ]]; then
  exit 0
fi

rm -rf "${remote_dir}/dist.failed"
mv "${remote_dir}/dist" "${remote_dir}/dist.failed"
mv "${remote_dir}/dist.previous" "${remote_dir}/dist"

if [[ -f "${remote_dir}/config/default.conf.previous" ]]; then
  mv "${remote_dir}/config/default.conf" "${remote_dir}/config/default.conf.failed"
  mv "${remote_dir}/config/default.conf.previous" "${remote_dir}/config/default.conf"
fi

if [[ -f "${remote_dir}/docker-compose.yml.previous" ]]; then
  mv "${remote_dir}/docker-compose.yml" "${remote_dir}/docker-compose.yml.failed"
  mv "${remote_dir}/docker-compose.yml.previous" "${remote_dir}/docker-compose.yml"
fi

docker compose -f "${remote_dir}/docker-compose.yml" up -d --force-recreate

status=''
for attempt in $(seq 1 24); do
  status=$(docker inspect --format='{{.State.Health.Status}}' pegger-hub 2>/dev/null || true)
  if [[ "${status}" == 'healthy' ]]; then
    exit 0
  fi
  sleep 5
done

echo "Rollback health check failed: ${status}" >&2
docker logs --tail 50 pegger-hub >&2
exit 1
REMOTE_ROLLBACK

  if [[ "${public_was_healthy}" == true ]]; then
    curl --fail --silent --max-time 15 "${PUBLIC_URL%/}/health" >/dev/null
  fi
  echo "Previous release restored and healthy" >&2
}

handle_exit() {
  local status=$?
  trap - EXIT

  if (( status != 0 )) && [[ "${deployment_swapped}" == true ]]; then
    rollback_deployment || echo "Automatic rollback failed" >&2
  fi

  exit "${status}"
}

trap handle_exit EXIT

cd "${ROOT_DIR}"

npm run build
printf '%s\n' "${REVISION}" > dist/revision.txt

ssh_cmd "rm -rf '${REMOTE_DIR}/dist.next' && mkdir -p '${REMOTE_DIR}/dist.next' '${REMOTE_DIR}/config'"
tar -C dist -czf - . | ssh "${SSH_OPTIONS[@]}" \
  "${REMOTE_USER}@${REMOTE_HOST}" "tar -xzf - -C '${REMOTE_DIR}/dist.next'"

ssh_cmd "cat > '${REMOTE_DIR}/config/default.conf.next' <<'EOF'
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location = /health {
        access_log off;
        add_header Content-Type text/plain;
        return 200 'ok';
    }
}
EOF"

ssh_cmd "cat > '${REMOTE_DIR}/docker-compose.yml.next' <<'EOF'
services:
  pegger-hub:
    image: nginx:alpine
    container_name: pegger-hub
    restart: unless-stopped
    read_only: true
    tmpfs:
      - /var/cache/nginx
      - /var/run
      - /tmp
    volumes:
      - ./dist:/usr/share/nginx/html:ro
      - ./config/default.conf:/etc/nginx/conf.d/default.conf:ro
    healthcheck:
      test: [\"CMD-SHELL\", \"wget -qO- http://127.0.0.1/health >/dev/null\"]
      interval: 5s
      timeout: 3s
      retries: 12
      start_period: 5s
    networks:
      - edge

networks:
  edge:
    external: true
    name: spotonsight_proxy
EOF"

deployment_swapped=true

ssh_cmd "bash -s -- '${REMOTE_DIR}'" <<'REMOTE_SWAP'
set -euo pipefail
remote_dir="$1"
swap_started=false

restore_partial_swap() {
  local status=$?
  trap - EXIT

  if (( status != 0 )) && [[ "${swap_started}" == true ]]; then
    if [[ -d "${remote_dir}/dist.previous" ]]; then
      rm -rf "${remote_dir}/dist"
      mv "${remote_dir}/dist.previous" "${remote_dir}/dist"
    fi

    if [[ -f "${remote_dir}/config/default.conf.previous" ]]; then
      rm -f "${remote_dir}/config/default.conf"
      mv "${remote_dir}/config/default.conf.previous" "${remote_dir}/config/default.conf"
    fi

    if [[ -f "${remote_dir}/docker-compose.yml.previous" ]]; then
      rm -f "${remote_dir}/docker-compose.yml"
      mv "${remote_dir}/docker-compose.yml.previous" "${remote_dir}/docker-compose.yml"
    fi
  fi

  exit "${status}"
}

trap restore_partial_swap EXIT
swap_started=true

rm -rf "${remote_dir}/dist.previous"
if [[ -d "${remote_dir}/dist" ]]; then
  mv "${remote_dir}/dist" "${remote_dir}/dist.previous"
fi
mv "${remote_dir}/dist.next" "${remote_dir}/dist"

rm -f "${remote_dir}/config/default.conf.previous"
if [[ -f "${remote_dir}/config/default.conf" ]]; then
  mv "${remote_dir}/config/default.conf" "${remote_dir}/config/default.conf.previous"
fi
mv "${remote_dir}/config/default.conf.next" "${remote_dir}/config/default.conf"

rm -f "${remote_dir}/docker-compose.yml.previous"
if [[ -f "${remote_dir}/docker-compose.yml" ]]; then
  mv "${remote_dir}/docker-compose.yml" "${remote_dir}/docker-compose.yml.previous"
fi
mv "${remote_dir}/docker-compose.yml.next" "${remote_dir}/docker-compose.yml"

swap_started=false
REMOTE_SWAP

ssh_cmd "docker compose -f '${REMOTE_DIR}/docker-compose.yml' up -d --force-recreate"

ssh_cmd "status=''; for attempt in \$(seq 1 24); do status=\$(docker inspect --format='{{.State.Health.Status}}' pegger-hub 2>/dev/null || true); if [ \"\${status}\" = 'healthy' ]; then exit 0; fi; sleep 5; done; echo \"pegger-hub health check failed: \${status}\" >&2; docker logs --tail 50 pegger-hub >&2; exit 1"

ssh_cmd "bash -s -- '${CADDYFILE_PATH}' '${PROXY_CONTAINER}'" <<'REMOTE_CADDY'
set -euo pipefail
caddyfile_path="$1"
proxy_container="$2"
backup_path="${caddyfile_path}.pegger-backup"
route_added=false
site_label=''

restore_caddy() {
  local status=$?
  trap - EXIT

  if (( status != 0 )) && [[ "${route_added}" == true ]] && [[ -f "${backup_path}" ]]; then
    cat "${backup_path}" > "${caddyfile_path}"
    rm -f "${backup_path}"
    docker exec "${proxy_container}" caddy reload --config /etc/caddy/Caddyfile >/dev/null 2>&1 || true
  fi

  exit "${status}"
}

trap restore_caddy EXIT

site_label_exists() {
  local expected_host="$1"

  awk -v expected_host="${expected_host}" '
    /^[[:space:]]*#/ { next }
    /\{[[:space:]]*$/ {
      line = $0
      sub(/[[:space:]]*\{[[:space:]]*$/, "", line)
      gsub(/,/, " ", line)
      count = split(line, labels, /[[:space:]]+/)

      for (index = 1; index <= count; index++) {
        label = labels[index]
        sub(/^https?:\/\//, "", label)
        sub(/:[0-9]+$/, "", label)
        if (label == expected_host) {
          found = 1
        }
      }
    }
    END { exit found ? 0 : 1 }
  ' "${caddyfile_path}"
}

if ! site_label_exists 'pegger.dev'; then
  site_label='pegger.dev'
fi

if ! site_label_exists 'www.pegger.dev'; then
  if [[ -n "${site_label}" ]]; then
    site_label="${site_label}, www.pegger.dev"
  else
    site_label='www.pegger.dev'
  fi
fi

if [[ -n "${site_label}" ]]; then
  cp -p "${caddyfile_path}" "${backup_path}"
  route_added=true
  cat >> "${caddyfile_path}" <<CADDY_ROUTE

${site_label} {
    encode zstd gzip
    import security_headers

    handle {
        reverse_proxy pegger-hub:80
    }
}
CADDY_ROUTE
fi

if ! docker exec "${proxy_container}" caddy validate --config /etc/caddy/Caddyfile; then
  exit 1
fi

docker exec "${proxy_container}" caddy reload --config /etc/caddy/Caddyfile
rm -f "${backup_path}"
route_added=false
REMOTE_CADDY

deployed_revision=''
for attempt in {1..24}; do
  deployed_revision="$(curl --fail --silent --max-time 15 "${PUBLIC_URL%/}/revision.txt" 2>/dev/null || true)"
  if [[ "${deployed_revision}" == "${REVISION}" ]]; then
    ssh_cmd "rm -rf '${REMOTE_DIR}/dist.previous' '${REMOTE_DIR}/dist.failed' && rm -f '${REMOTE_DIR}/config/default.conf.previous' '${REMOTE_DIR}/config/default.conf.failed' '${REMOTE_DIR}/docker-compose.yml.previous' '${REMOTE_DIR}/docker-compose.yml.failed'"
    deployment_swapped=false
    echo "Deployment verified at ${PUBLIC_URL} (${REVISION})"
    exit 0
  fi
  sleep 5
done

echo "Deployment verification failed for ${PUBLIC_URL}" >&2
echo "Expected revision: ${REVISION}" >&2
echo "Deployed revision: ${deployed_revision:-unavailable}" >&2
exit 1
