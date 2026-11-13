#!/usr/bin/env bash
# Starts Playwright MCP. Uses a preinstalled Chromium when one is available
# (PLAYWRIGHT_CHROMIUM_PATH, or the cloud container's /opt/pw-browsers), so the
# server doesn't download its own browser.
set -euo pipefail

exe="${PLAYWRIGHT_CHROMIUM_PATH:-}"
if [[ -z "$exe" ]]; then
  for candidate in /opt/pw-browsers/chromium-*/chrome-linux64/chrome /opt/pw-browsers/chromium; do
    [[ -x "$candidate" && ! -d "$candidate" ]] && { exe="$candidate"; break; }
  done
fi

args=(--headless --isolated)
[[ -n "$exe" ]] && args+=(--executable-path "$exe")
exec bunx @playwright/mcp@0.0.84 "${args[@]}"
