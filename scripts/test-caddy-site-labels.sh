#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/deploy-production.sh"

fixture="$(mktemp)"
trap 'rm -f "${fixture}"' EXIT
CADDYFILE_PATH="${fixture}"

assert_label() {
  local expected_host="$1"
  local expected_result="$2"
  local status=0

  if site_label_exists "${expected_host}"; then
    status=0
  else
    status=$?
  fi

  if (( status > 1 )); then
    echo "site_label_exists failed for ${expected_host} with status ${status}" >&2
    return 1
  fi

  if [[ "${expected_result}" == 'present' && ${status} -ne 0 ]]; then
    echo "Expected ${expected_host} to be present" >&2
    return 1
  fi

  if [[ "${expected_result}" == 'absent' && ${status} -eq 0 ]]; then
    echo "Expected ${expected_host} to be absent" >&2
    return 1
  fi
}

cat > "${fixture}" <<'CADDY_SUBDOMAIN_ONLY'
# pegger.dev {
portfolio.pegger.dev {
    reverse_proxy portfolio:80
}
CADDY_SUBDOMAIN_ONLY

assert_label 'portfolio.pegger.dev' 'present'
assert_label 'pegger.dev' 'absent'
assert_label 'www.pegger.dev' 'absent'

cat > "${fixture}" <<'CADDY_COMBINED_LABELS'
https://pegger.dev:443, https://www.pegger.dev {
    reverse_proxy pegger-hub:80
}
CADDY_COMBINED_LABELS

assert_label 'pegger.dev' 'present'
assert_label 'www.pegger.dev' 'present'
assert_label 'portfolio.pegger.dev' 'absent'

cat > "${fixture}" <<'CADDY_EXACT_APEX'
pegger.dev {
    reverse_proxy pegger-hub:80
}
CADDY_EXACT_APEX

assert_label 'pegger.dev' 'present'
assert_label 'www.pegger.dev' 'absent'

printf '%s\n' 'Caddy site-label tests passed'
