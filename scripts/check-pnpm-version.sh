#!/usr/bin/env bash

# --------------------------------------------------------------------
# Checks that pnpm >=v8 for workspace support
# --------------------------------------------------------------------

# Exit immediately on error
set -o errexit

REQUIRED_MAJOR=8

if ! command -v pnpm >/dev/null 2>&1; then
  echo 'pnpm is required to work with this repository. Please install pnpm and try again.'
  exit 1
fi

PNPM_MAJOR_V=$(pnpm -v | grep -Eo '^[0-9]+')

if [[ "$PNPM_MAJOR_V" -ge $REQUIRED_MAJOR ]]
then
  echo "pnpm >=v${REQUIRED_MAJOR} satisfied"
else
  echo "pnpm version ${REQUIRED_MAJOR} or greater is required for workspace support. Please update pnpm." && exit 1
fi
