#!/usr/bin/env bash
# Runs ESLint with --fix on the file Claude just edited, and reports what it can't fix.
# Exit 2 shows stderr to Claude without undoing the edit.
set -uo pipefail

input=$(cat)
path=$(printf '%s' "$input" | jq -r '.tool_input.file_path // ""')
root="${CLAUDE_PROJECT_DIR:-$PWD}"

case "$path" in
  *.ts|*.mts|*.js|*.mjs|*.vue) ;;
  *) exit 0 ;;
esac
[[ -f "$path" && -x "$root/node_modules/.bin/eslint" ]] || exit 0
[[ -f "$root/.nuxt/eslint.config.mjs" ]] || exit 0

cd "$root" || exit 0
if ! out=$(bunx --bun eslint --fix --no-warn-ignored "$path" 2>&1); then
  echo "ESLint found problems it couldn't fix in $path:" >&2
  echo "$out" | tail -30 >&2
  exit 2
fi
exit 0
