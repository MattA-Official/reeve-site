#!/usr/bin/env bash
# Prepares a session: checks the toolchain and installs dependencies from the lockfile.
# Output on stdout is added to Claude's context.
set -uo pipefail

root="${CLAUDE_PROJECT_DIR:-.}"
cd "$root" || exit 0

want_bun=$(jq -r '.packageManager // "" | sub("^bun@"; "")' package.json 2>/dev/null)
have_bun=$(bun --version 2>/dev/null || echo "missing")
node_ver=$(node --version 2>/dev/null || echo "missing")

if [[ "$have_bun" == "missing" ]]; then
  echo "Bun is not installed. Install Bun ${want_bun} before running any script."
  exit 0
fi
[[ -n "$want_bun" && "$have_bun" != "$want_bun" ]] && echo "Bun ${have_bun} is installed but the repo pins ${want_bun}. Results may differ from CI."
echo "Toolchain: Bun ${have_bun}, Node ${node_ver} (CI uses Node 24)."

# Point Playwright at a preinstalled Chromium (cloud containers ship one) for the rest of the session.
if [[ -z "${PLAYWRIGHT_CHROMIUM_PATH:-}" && -n "${CLAUDE_ENV_FILE:-}" ]]; then
  for candidate in /opt/pw-browsers/chromium-*/chrome-linux64/chrome; do
    if [[ -x "$candidate" ]]; then
      echo "export PLAYWRIGHT_CHROMIUM_PATH=\"$candidate\"" >> "$CLAUDE_ENV_FILE"
      echo "Playwright will use the preinstalled Chromium at $candidate."
      break
    fi
  done
fi

if [[ ! -d node_modules || bun.lock -nt node_modules ]]; then
  if out=$(bun install --frozen-lockfile 2>&1); then
    echo "Dependencies installed from bun.lock."
  else
    echo "bun install --frozen-lockfile failed:"
    echo "$out" | tail -20
  fi
fi
exit 0
