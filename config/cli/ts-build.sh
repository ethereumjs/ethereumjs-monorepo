#!/bin/sh
set -e
# Purposefully not using `set -o xtrace`, for friendlier output.

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

# Build functions declaration.

build_esm() {
    blue "[ESM build] "
    echo "Using tsconfig.esm.json"

    echo "> tsc --build ./tsconfig.esm.json"
    printf "${BLUE}[ESM build] Working... "

    tsc --build ./tsconfig.esm.json
    green "DONE"

    echo "\n";
}

build_cjs() {
    blue "[CJS build] "
    echo "Using tsconfig.cjs.json"

    echo "> tsc --build ./tsconfig.cjs.json"
    printf "${BLUE}[CJS build] Working... "

    tsc -p ./tsconfig.cjs.json
    green "DONE"

    echo "\n";
}

# Begin build process.

build_esm
#build_cjs