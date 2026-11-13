#!/usr/bin/env bash
# Blocks shell commands that use the wrong package manager, leak secrets, or push code.
# Exit 2 blocks the tool call and shows stderr to Claude.
set -euo pipefail
set -f # never expand globs in the command we inspect

# Without jq this hook can't read the command. Fail closed: a crash would let it through.
command -v jq >/dev/null || { echo "Blocked: jq is required by .claude/hooks/pre-bash.sh. Install jq." >&2; exit 2; }

input=$(cat)
cmd=$(printf '%s' "$input" | jq -r '.tool_input.command // ""')
root="${CLAUDE_PROJECT_DIR:-$PWD}"

block() {
  echo "Blocked by .claude/hooks/pre-bash.sh: $1" >&2
  exit 2
}

# The command with quoted text removed, so words inside commit messages or
# echo strings don't count as commands. Used for the command-name checks below.
bare=$(printf '%s' "$cmd" | sed -E "s/'[^']*'//g; s/\"([^\"\\\\]|\\\\.)*\"//g")

# Bun is the only package manager.
pm_re='(^|[[:space:];&|(])(npm|npx|pnpm|pnpx|yarn)([[:space:]]|$)'
[[ "$bare" =~ $pm_re ]] && block "use Bun (bun install, bun add, bun run, bunx), not npm, pnpm or yarn."

# Installs only reproduce the lockfile.
install_re='(^|[;&|][[:space:]]*|^[[:space:]]*)bun[[:space:]]+(install|i)([[:space:]]+[^;&|]*)?'
if [[ "$bare" =~ $install_re ]]; then
  args="${BASH_REMATCH[3]:-}"
  for word in $args; do
    [[ "$word" == -* ]] && continue
    block "add packages with 'bun add <name>@<exact version>', not 'bun install <name>'."
  done
fi

# New dependencies are added with an exact version. Only the words up to the
# next ;, & or | belong to bun add.
add_re='(^|[;&|[:space:]])bun[[:space:]]+(add|a)[[:space:]]+([^;&|]*)'
if [[ "$bare" =~ $add_re ]]; then
  for word in ${BASH_REMATCH[3]}; do
    [[ "$word" == -* ]] && continue
    [[ "$word" =~ @[0-9]+\.[0-9]+\.[0-9]+([-+][0-9A-Za-z.-]+)?$ ]] \
      || block "add dependencies with an exact version, for example 'bun add -d vitest@5.1.0' (got '$word')."
  done
fi
update_re='(^|[;&|[:space:]])bun[[:space:]]+(update|upgrade)([[:space:]]|$)'
[[ "$bare" =~ $update_re ]] && block "upgrades go in their own PR; change one exact version in package.json instead."

# Pushing is the maintainer's job. Cloud sessions (CLAUDE_CODE_REMOTE=true) lose
# unpushed work when the container is reclaimed, so they may push their own
# claude/* branch, without force. Catches git's global options too
# (git -C dir push, git --no-pager push).
push_any_re='(^|[;&|[:space:]])git([[:space:]]+[^;&|]*)?[[:space:]]push([[:space:]]|$)'
if [[ "$bare" =~ $push_any_re ]]; then
  push_ok_re='^[[:space:]]*git[[:space:]]+push([[:space:]]+(-u|--set-upstream))?[[:space:]]+origin[[:space:]]+claude/[A-Za-z0-9._/-]+[[:space:]]*$'
  if [[ "${CLAUDE_CODE_REMOTE:-}" != "true" ]] || [[ ! "$cmd" =~ $push_ok_re ]]; then
    block "git push is reserved for the maintainer (cloud sessions may run 'git push -u origin claude/<branch>' on its own)."
  fi
fi

# Secrets: never read env files (any .env or .env.<name> except .env.example) or print the environment.
env_re='(^|[^A-Za-z0-9_.-])\.env(\.[A-Za-z0-9_-]+)?($|[^A-Za-z0-9_.-])'
if [[ "$cmd" =~ $env_re ]]; then
  stripped=${cmd//.env.example/}
  [[ "$stripped" =~ $env_re ]] && block "env files contain secrets; use .env.example."
fi
printenv_re='(^|[;&|[:space:]])(env|printenv|export[[:space:]]+-p|set)[[:space:]]*($|[;&|])'
[[ "$bare" =~ $printenv_re ]] && block "printing the whole environment can leak secrets."
secret_re='(TOKEN|SECRET|API_KEY|STRIPE_[A-Z_]*KEY)'
print_re='(^|[;&|[:space:]])(echo|printf|cat|printenv)([[:space:]]|$)'
[[ "$cmd" =~ $secret_re ]] && [[ "$bare" =~ $print_re ]] && block "do not print secret variables."

# Recursive deletes must stay inside the project.
rm_re='(^|[;&|[:space:]])rm[[:space:]]+(-[A-Za-z]*[rR][A-Za-z]*)[[:space:]]+([^;&|]+)'
if [[ "$bare" =~ $rm_re ]]; then
  for target in ${BASH_REMATCH[3]}; do
    [[ "$target" == -* ]] && continue
    case "$target" in
      "$root"/?*) [[ "$target" == *..* ]] && block "recursive delete with '..' in the path." ;;
      /*|~*|\$*|..|../*|*/..|*/../*) block "recursive delete outside the project ($target)." ;;
      *) [[ "$target" == *..* ]] && block "recursive delete with '..' in the path." ;;
    esac
  done
fi

exit 0
