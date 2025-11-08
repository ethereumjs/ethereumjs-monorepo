#!/bin/sh
REMOTE=$(git rev-parse --symbolic-full-name --abbrev-ref @{u})

if [ -z "$REMOTE" ]; then
    FILESCHANGED=". --ext .js,.ts"
else
    FILESCHANGED=$(git diff --diff-filter=d --name-only --relative $REMOTE | grep -E '\.(js|ts)')
fi

echo $FILESCHANGED
BLUE="\033[0;34m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
RED="\033[0;31m"
NOCOLOR="\033[0m"
DIM="\033[2m"

blue() {
    echo "${BLUE}$1${NOCOLOR}"
}
green() {
    echo "${GREEN}$1${NOCOLOR}"
}
dim() {
    echo "${DIM}$1${NOCOLOR}"
}

dim "> eslint --config ./eslint.config.mjs ."

blue "[Lint]${NOCOLOR} checking..."

if [ -z "$FILESCHANGED" ]; then
    blue "[Lint]${GREEN} DONE."
    exit
fi

eslint --config ./eslint.config.mjs $FILESCHANGED

RETURN_CODE=$?

if [ $RETURN_CODE -eq 0 ]; then
    blue "[Lint]${GREEN} DONE."
else
    exit $RETURN_CODE
fi