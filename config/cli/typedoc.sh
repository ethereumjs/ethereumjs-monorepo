#!/usr/bin/env bash
# Run TypeDoc with TypeScript 6 (see config/typedoc/typescript-hook.mjs).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
REGISTER="$ROOT/config/typedoc/register.mjs"
TYPEDOC="$ROOT/node_modules/typedoc/bin/typedoc"

if [[ ! -f "$TYPEDOC" ]]; then
  echo "typedoc not found; run npm install from the monorepo root" >&2
  exit 1
fi

export NODE_OPTIONS="${NODE_OPTIONS:+$NODE_OPTIONS }--import $REGISTER"
exec node "$TYPEDOC" "$@"
