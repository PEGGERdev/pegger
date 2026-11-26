#!/usr/bin/env bash
set -Eeuo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/pin-host-key.sh"
fixture="$(mktemp -d)"
trap 'rm -rf "$fixture"' EXIT
ssh-keygen -q -t ed25519 -N '' -f "$fixture/trusted"
ssh-keygen -q -t ed25519 -N '' -f "$fixture/other"
expected="$(ssh-keygen -lf "$fixture/trusted.pub" -E sha256 | awk '{print $2}')"
read -r algorithm key comment < "$fixture/trusted.pub"
printf 'example.test %s %s\n' "$algorithm" "$key" > "$fixture/valid"
read -r other_algorithm other_key comment < "$fixture/other.pub"
printf 'example.test %s %s\n' "$other_algorithm" "$other_key" > "$fixture/wrong"
cat "$fixture/valid" "$fixture/wrong" > "$fixture/mixed"
printf 'example.test ssh-rsa %s\n' "$key" > "$fixture/algorithm"
printf 'example.test ssh-ed25519 malformed\n' > "$fixture/malformed"
: > "$fixture/empty"
verify_host_keys "$expected" "$fixture/valid" "$fixture/output"
cmp "$fixture/valid" "$fixture/output"
for name in wrong mixed algorithm malformed empty; do
  printf 'unchanged\n' > "$fixture/output"
  if verify_host_keys "$expected" "$fixture/$name" "$fixture/output"; then
    echo "Expected rejection of $name" >&2
    exit 1
  fi
  [[ "$(cat "$fixture/output")" == 'unchanged' ]]
done
printf '%s\n' 'Pinned host-key tests passed'
