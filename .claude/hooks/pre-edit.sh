#!/usr/bin/env bash
# Blocks edits to generated, locked or vendored files.
# Exit 2 blocks the tool call and shows stderr to Claude.
set -euo pipefail

input=$(cat)
path=$(printf '%s' "$input" | jq -r '.tool_input.file_path // ""')
root="${CLAUDE_PROJECT_DIR:-$PWD}"
rel="${path#"$root"/}"

block() {
  echo "Blocked by .claude/hooks/pre-edit.sh: $1" >&2
  exit 2
}

case "$rel" in
  bun.lock) block "bun.lock is written by 'bun install' and 'bun add'; never by hand." ;;
  .nuxt/*|.output/*|.data/*|node_modules/*) block "$rel is generated; change the source instead." ;;
  .env|.env.*)
    [[ "$rel" == .env.example ]] || block "env files hold secrets; edit .env.example instead." ;;
  design/citation/*) block "design/citation/ is a copy of the design system; re-copy it from the artifact (see design/README.md)." ;;
esac

# Vendored skills are updated by re-copying from upstream (see .claude/skills/VENDORED.md).
if [[ "$rel" == .claude/skills/* ]]; then
  skill="${rel#.claude/skills/}"
  skill="${skill%%/*}"
  case "$skill" in
    reeve-design-system|reeve-copy|page-from-board|VENDORED.md) ;;
    *) block ".claude/skills/$skill is vendored; update it from upstream as VENDORED.md describes." ;;
  esac
fi
exit 0
