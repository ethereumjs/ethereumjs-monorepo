#!/bin/sh

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

dim "> eslint --fix --config ./.eslintrc.cjs . \\ "
dim "\t --ext .js,.jsx,.ts,.tsx \\ "

blue "[Lint]${NOCOLOR} fixing..."

eslint --fix --config ./.eslintrc.cjs . --ext .js,.jsx,.ts,.tsx

RETURN_CODE=$?

if [ $RETURN_CODE -eq 0 ]; then
    blue "[Lint]${GREEN} DONE."
else
    exit $RETURN_CODE
fi