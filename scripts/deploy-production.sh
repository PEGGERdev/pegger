#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_FILE="${ROOT_DIR}/deployment/docker-compose.yml"
CADDYFILE_PATH="${CADDYFILE_PATH:-/opt/spotonsight/infrastructure/caddy/Caddyfile}"
PROXY_CONTAINER="${PROXY_CONTAINER:-spotonsight-proxy-1}"
PUBLIC_URL="${PUBLIC_URL:-https://pegger.dev}"
DEPLOY_REVISION="${DEPLOY_REVISION:-$(git -C "${ROOT_DIR}" rev-parse HEAD)}"

if [[ ! "${DEPLOY_REVISION}" =~ ^[0-9a-fA-F]{40}$ ]]; then
  echo "Invalid DEPLOY_REVISION" >&2
  exit 1
fi

export DEPLOY_REVISION

rollback_available=false
rollback_context=''
deployment_started=false
caddy_modified=false
caddy_backup="${CADDYFILE_PATH}.pegger-backup"

wait_for_health() {
  local status=''

  for attempt in $(seq 1 24); do
    status="$(docker inspect --format='{{.State.Health.Status}}' pegger-hub 2>/dev/null || true)"
    if [[ "${status}" == 'healthy' ]]; then
      return 0
    fi
    sleep 5
  done

  echo "pegger-hub health check failed: ${status}" >&2
  docker logs --tail 50 pegger-hub >&2 || true
  return 1
}

prepare_rollback_image() {
  if ! docker inspect pegger-hub >/dev/null 2>&1; then
    return 0
  fi

  if docker inspect --format='{{range .Mounts}}{{println .Destination}}{{end}}' pegger-hub | grep -qx '/usr/share/nginx/html'; then
    if [[ ! -d "${ROOT_DIR}/dist" ]]; then
      echo "Legacy pegger-hub dist directory is missing" >&2
      return 1
    fi

    rollback_context="$(mktemp -d)"
    cp -a "${ROOT_DIR}/dist" "${rollback_context}/dist"

    if [[ -f "${ROOT_DIR}/config/default.conf" ]]; then
      cp "${ROOT_DIR}/config/default.conf" "${rollback_context}/default.conf"
    else
      cp "${ROOT_DIR}/deployment/nginx.conf" "${rollback_context}/default.conf"
    fi

    cat > "${rollback_context}/Dockerfile" <<'ROLLBACK_DOCKERFILE'
FROM nginx:alpine
COPY default.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html
ROLLBACK_DOCKERFILE

    docker build -t pegger-hub:rollback "${rollback_context}"
    rm -rf "${rollback_context}"
    rollback_context=''
  else
    docker tag "$(docker inspect --format='{{.Image}}' pegger-hub)" pegger-hub:rollback
  fi

  rollback_available=true
}

restore_caddy() {
  if [[ "${caddy_modified}" != true || ! -f "${caddy_backup}" ]]; then
    return 0
  fi

  cat "${caddy_backup}" > "${CADDYFILE_PATH}"
  rm -f "${caddy_backup}"
  docker exec "${PROXY_CONTAINER}" caddy reload --config /etc/caddy/Caddyfile >/dev/null 2>&1 || true
  caddy_modified=false
}

rollback_deployment() {
  if [[ "${rollback_available}" != true ]]; then
    echo "No previous pegger-hub image is available for rollback" >&2
    return 1
  fi

  echo "Deployment failed; restoring the previous image" >&2
  DEPLOY_REVISION=rollback docker compose -p pegger-hub -f "${COMPOSE_FILE}" up -d --force-recreate --no-build
  wait_for_health
  echo "Previous pegger-hub image restored" >&2
}

handle_exit() {
  local status=$?
  trap - EXIT

  if (( status != 0 )); then
    if [[ -n "${rollback_context}" ]]; then
      rm -rf "${rollback_context}"
    fi
    restore_caddy || true
    if [[ "${deployment_started}" == true ]]; then
      rollback_deployment || echo "Automatic rollback failed" >&2
    fi
  fi

  exit "${status}"
}

site_label_exists() {
  local expected_host="$1"

  awk -v expected_host="${expected_host}" '
    /^[[:space:]]*#/ { next }
    /\{[[:space:]]*$/ {
      line = $0
      sub(/[[:space:]]*\{[[:space:]]*$/, "", line)
      gsub(/,/, " ", line)
      count = split(line, labels, /[[:space:]]+/)
      for (label_index = 1; label_index <= count; label_index++) {
        label = labels[label_index]
        sub(/^https?:\/\//, "", label)
        sub(/:[0-9]+$/, "", label)
        if (label == expected_host) found = 1
      }
    }
    END { exit found ? 0 : 1 }
  ' "${CADDYFILE_PATH}"
}

configure_caddy() {
  local site_label=''

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
    cp -p "${CADDYFILE_PATH}" "${caddy_backup}"
    caddy_modified=true
    cat >> "${CADDYFILE_PATH}" <<CADDY_ROUTE

${site_label} {
    encode zstd gzip
    import security_headers

    handle {
        reverse_proxy pegger-hub:80
    }
}
CADDY_ROUTE
  fi

  docker exec "${PROXY_CONTAINER}" caddy validate --config /etc/caddy/Caddyfile
  docker exec "${PROXY_CONTAINER}" caddy reload --config /etc/caddy/Caddyfile
  rm -f "${caddy_backup}"
  caddy_modified=false
}

verify_public_revision() {
  local deployed_revision=''

  for attempt in $(seq 1 24); do
    deployed_revision="$(curl --fail --silent --max-time 15 "${PUBLIC_URL%/}/revision.txt" 2>/dev/null || true)"
    if [[ "${deployed_revision}" == "${DEPLOY_REVISION}" ]]; then
      return 0
    fi
    sleep 5
  done

  echo "Deployment verification failed for ${PUBLIC_URL}" >&2
  echo "Expected revision: ${DEPLOY_REVISION}" >&2
  echo "Deployed revision: ${deployed_revision:-unavailable}" >&2
  return 1
}

main() {
  trap handle_exit EXIT
  cd "${ROOT_DIR}"

  docker network inspect spotonsight_proxy >/dev/null 2>&1 || docker network create spotonsight_proxy >/dev/null
  prepare_rollback_image

  docker compose -p pegger-hub -f "${COMPOSE_FILE}" build --pull pegger-hub
  deployment_started=true
  docker compose -p pegger-hub -f "${COMPOSE_FILE}" up -d --force-recreate --remove-orphans
  wait_for_health
  configure_caddy
  verify_public_revision

  deployment_started=false
  docker image rm pegger-hub:rollback >/dev/null 2>&1 || true
  rm -rf "${ROOT_DIR}/dist" "${ROOT_DIR}/config"
  rm -f "${ROOT_DIR}/docker-compose.yml"
  echo "Deployment verified at ${PUBLIC_URL} (${DEPLOY_REVISION})"
}

if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then
  main "$@"
fi
