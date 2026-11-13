#!/usr/bin/env bash
# Runs before Claude finishes a turn. Exit 2 sends stderr back to Claude and keeps it working.
set -uo pipefail

input=$(cat)
# Avoid loops: if this Stop was already triggered by a previous block, let it finish.
active=$(printf '%s' "$input" | jq -r '.stop_hook_active // false')
[[ "$active" == "true" ]] && exit 0

root="${CLAUDE_PROJECT_DIR:-.}"
cd "$root" || exit 0
[[ -f package.json && -d node_modules ]] || exit 0

# Only run when source, content or config changed: uncommitted, or committed on
# this branch since it left main (sessions often commit before they finish).
paths=(app server shared layers public content i18n tests '*.ts' '*.mts' '*.mjs' '*.vue' package.json bun.lock)
if git rev-parse --git-dir >/dev/null 2>&1; then
  uncommitted=$(git status --porcelain -- "${paths[@]}" | wc -l)
  base=$(git merge-base HEAD origin/main 2>/dev/null || git rev-parse HEAD)
  committed=$(git diff --name-only "$base" HEAD -- "${paths[@]}" | wc -l)
  [[ "$uncommitted" -eq 0 && "$committed" -eq 0 ]] && exit 0
fi

fail() {
  printf '%b\n' "$1" >&2
  echo "Fix these before finishing. (Stop hook: .claude/hooks/stop-check.sh)" >&2
  exit 2
}

out=$(bun run lint 2>&1) || fail "Lint failed:\n$(echo "$out" | tail -40)"
out=$(bun run typecheck 2>&1) || fail "Typecheck failed:\n$(echo "$out" | tail -40)"
out=$(bun run test 2>&1) || fail "Tests failed:\n$(echo "$out" | tail -60)"

# Project rules a linter can't see.
if [[ -d app ]]; then
  hex=$(grep -rnE '#[0-9a-fA-F]{3,8}\b' app --include='*.vue' --include='*.css' 2>/dev/null \
    | grep -v 'app/assets/css/tokens.css' | grep -vE ':[[:space:]]*(//|<!--)' | head -5 || true)
  [[ -n "$hex" ]] && fail "Raw colour values outside the token file (use a token):\n$hex"
fi
us=$(grep -rnoiE '\b(color|colors|behavior|organize|organization|analyze|center|favorite|canceled)\b' i18n/locales content 2>/dev/null | head -5 || true)
[[ -n "$us" ]] && fail "American spelling in copy:\n$us"
exit 0
