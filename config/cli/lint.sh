#!/bin/sh

FILESCHANGED=$(git diff --diff-filter=d --name-only --relative $(git rev-parse --symbolic-full-name --abbrev-ref @{u}) | grep -E '\.(js|jsx|ts|tsx)')

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

dim "> eslint --format codeframe --config ./.eslintrc.js . \\ "
dim "\t --ext .js,.jsx,.ts,.tsx \\ "

blue "[Lint]${NOCOLOR} checking..."

if [ -n "$FILESCHANGED"]; then
    blue "[Lint]${GREEN} DONE."
    exit
fi

eslint --format codeframe --config ./.eslintrc.js $FILESCHANGED

RETURN_CODE=$?

if [ $RETURN_CODE -eq 0 ]; then
    blue "[Lint]${GREEN} DONE."
else
    exit $RETURN_CODE
fi