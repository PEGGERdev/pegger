#!/usr/bin/env bash
set -Eeuo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_REVISION=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
source "$SCRIPT_DIR/deploy-production.sh"
fixture="$(mktemp -d)"
trap 'rm -rf "$fixture"' EXIT
CADDYFILE_PATH="$fixture/Caddyfile"
caddy_backup="${CADDYFILE_PATH}.pegger-backup"
PROXY_CONTAINER=fixture-proxy
docker_failure=''
docker() {
  [[ "$1" == 'exec' && "$2" == 'fixture-proxy' ]] || { echo 'Unexpected Docker operation' >&2; return 1; }
  if [[ -n "$docker_failure" && "$*" == *"caddy $docker_failure"* ]]; then return 1; fi
}
cat > "$fixture/original" <<'CADDY'
(security_headers) { }
spotonsight.com {
    reverse_proxy prod-frontend:8080
}
portfolio.pegger.dev {
    reverse_proxy portfolio-frontend:80
}
CADDY

cp "$fixture/original" "$CADDYFILE_PATH"
configure_caddy
[[ -f "$caddy_backup" ]] || { echo 'Backup was removed before public revision verification' >&2; exit 1; }
[[ "$caddy_modified" == true ]]
grep -q 'reverse_proxy pegger-hub:80' "$CADDYFILE_PATH"
# A failure at the subsequent public-revision gate must still be recoverable.
restore_caddy
cmp "$fixture/original" "$CADDYFILE_PATH"
[[ ! -f "$caddy_backup" && "$caddy_modified" == false ]]

for phase in validate reload; do
  docker_failure="$phase"
  if configure_caddy; then echo "Expected $phase failure" >&2; exit 1; fi
  [[ -f "$caddy_backup" && "$caddy_modified" == true ]]
  docker_failure=''
  restore_caddy
  cmp "$fixture/original" "$CADDYFILE_PATH"
done

configure_caddy
docker_failure=reload
if restore_caddy; then echo 'Expected restore reload failure' >&2; exit 1; fi
[[ -f "$caddy_backup" && "$caddy_modified" == true ]]
docker_failure=''
restore_caddy
cmp "$fixture/original" "$CADDYFILE_PATH"
printf '%s\n' 'Deployment rollback tests passed'
