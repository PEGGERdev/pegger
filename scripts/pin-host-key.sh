#!/usr/bin/env bash
set -Eeuo pipefail

verify_host_keys() {
  local expected="$1" scan="$2" output="$3"
  local line='' host='' algorithm='' key='' extra='' details='' bits='' fingerprint='' staged=''
  local -a verified=()
  [[ "$expected" =~ ^SHA256:[A-Za-z0-9+/]{43}$ ]] || { echo 'Invalid expected host fingerprint' >&2; return 1; }

  while IFS= read -r line || [[ -n "$line" ]]; do
    case "$line" in ''|\#*) continue ;; esac
    read -r host algorithm key extra <<< "$line"
    [[ -n "$host" && "$algorithm" == 'ssh-ed25519' && -n "$key" && -z "$extra" ]] || { echo 'Unexpected host-key record' >&2; return 1; }
    details="$(printf '%s\n' "$line" | ssh-keygen -lf - -E sha256 2>/dev/null)" || { echo 'Malformed host key' >&2; return 1; }
    read -r bits fingerprint extra <<< "$details"
    [[ "$fingerprint" == "$expected" ]] || { echo 'SSH host fingerprint mismatch' >&2; return 1; }
    verified+=("$line")
    (( ${#verified[@]} <= 16 )) || { echo 'Too many host-key records' >&2; return 1; }
  done < "$scan"

  (( ${#verified[@]} > 0 )) || { echo 'No verified host keys' >&2; return 1; }
  staged="$(mktemp "${output}.XXXXXX")" || return 1
  if ! printf '%s\n' "${verified[@]}" > "$staged" || ! chmod 600 "$staged" || ! mv -f "$staged" "$output"; then
    rm -f "$staged"
    return 1
  fi
}

main() {
  [[ $# == 3 ]] || { echo 'Usage: pin-host-key.sh HOST SHA256:FINGERPRINT OUTPUT' >&2; return 1; }
  local host="$1" expected="$2" output="$3" scan='' status=0
  [[ "$host" =~ ^[A-Za-z0-9][A-Za-z0-9.-]*$ ]] || { echo 'Invalid deployment host' >&2; return 1; }
  scan="$(mktemp)"
  if ! ssh-keyscan -T 10 -H -t ed25519 "$host" > "$scan"; then
    status=1
  elif ! verify_host_keys "$expected" "$scan" "$output"; then
    status=1
  fi
  rm -f "$scan"
  return "$status"
}

if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then
  main "$@"
fi
