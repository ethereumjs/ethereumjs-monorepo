#!/bin/sh

set -e

# Presentational variables and functions declaration.

BLUE="\033[0;34m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
RED="\033[0;31m"
NOCOLOR="\033[0m"
DIM="\033[2m"

blue() {
    printf "${BLUE}$1${NOCOLOR}"
}
green() {
    printf "${GREEN}$1${NOCOLOR}"
}
yellow() {
    printf "${YELLOW}$1${NOCOLOR}"
}
red() {
    printf "${RED}$1${NOCOLOR}"
}
dim() {
    printf "${DIM}$1${NOCOLOR}"
}

post_build_fixes() {
    blue "[Post Build Fixes]"
    if [ -f ./dist/esm/bin/cli.js ];
    then
        echo "Adding ./dist/esm/package.json"
        rm -f ./dist/esm/package.json
        cat <<EOT >> ./dist/esm/package.json
{
    "type": "module"
}
EOT
    else
        echo "Skipping post build fixes (no ESM setup yet)."
    fi
    echo "\n";
}

post_build_fixes