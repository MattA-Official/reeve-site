#!/usr/bin/env bash
# Blocks shell commands that use the wrong package manager, leak secrets, or push code.
# Exit 2 blocks the tool call and shows stderr to Claude.
set -euo pipefail

input=$(cat)
cmd=$(printf '%s' "$input" | jq -r '.tool_input.command // ""')

block() {
  echo "Blocked by .claude/hooks/pre-bash.sh: $1" >&2
  exit 2
}

# Bun is the only package manager.
pm_re='(^|[[:space:];&|(])(npm|npx|pnpm|pnpx|yarn)([[:space:]]|$)'
[[ "$cmd" =~ $pm_re ]] \
  && block "use Bun (bun install, bun add, bun run, bunx), not npm, pnpm or yarn."

# New dependencies are added with an exact version.
if [[ "$cmd" =~ (^|[[:space:];&|])bun[[:space:]]+(add|a)[[:space:]] ]]; then
  for word in $cmd; do
    [[ "$word" == bun || "$word" == add || "$word" == a || "$word" == -* ]] && continue
    [[ "$word" =~ @[0-9]+\.[0-9]+\.[0-9]+([-+][0-9A-Za-z.-]+)?$ ]] \
      || block "add dependencies with an exact version, for example 'bun add -d vitest@5.1.0' (got '$word')."
  done
fi
[[ "$cmd" =~ (^|[[:space:];&|])bun[[:space:]]+(update|upgrade)([[:space:]]|$) ]] \
  && block "upgrades go in their own PR; change one exact version in package.json instead."

# Pushing is the maintainer's job. Cloud sessions (CLAUDE_CODE_REMOTE=true) lose
# unpushed work when the container is reclaimed, so they may push their own
# claude/* branch, without force.
if [[ "$cmd" =~ (^|[[:space:];&|])git([[:space:]]+-[cC][[:space:]]+[^[:space:]]+)*[[:space:]]+push ]]; then
  push_re='^git[[:space:]]+push([[:space:]]+(-u|--set-upstream))?[[:space:]]+origin[[:space:]]+claude/[A-Za-z0-9._/-]+$'
  if [[ "${CLAUDE_CODE_REMOTE:-}" != "true" ]] || [[ ! "$cmd" =~ $push_re ]]; then
    block "git push is reserved for the maintainer (cloud sessions may run 'git push -u origin claude/<branch>' on its own)."
  fi
fi

# Secrets: never read env files or print the environment.
[[ "$cmd" =~ \.env($|[^.a-z]|\.local|\.prod) ]] && [[ ! "$cmd" =~ \.env\.example ]] \
  && block "env files contain secrets; use .env.example."
[[ "$cmd" =~ (^|[[:space:]])(env|printenv)([[:space:]]*$|[[:space:]]*\|) ]] \
  && block "printing the whole environment can leak secrets."
[[ "$cmd" =~ (TOKEN|SECRET|API_KEY|STRIPE_[A-Z_]*KEY) ]] && [[ "$cmd" =~ (echo|printf|cat|printenv) ]] \
  && block "do not print secret variables."

# Destructive deletes outside the project.
[[ "$cmd" =~ rm[[:space:]]+-[a-zA-Z]*r[a-zA-Z]*f?[[:space:]]+(/|~|\$HOME|\.\.) ]] \
  && block "recursive delete outside the project."

exit 0
