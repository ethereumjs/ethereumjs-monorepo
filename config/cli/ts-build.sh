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


# Begin of the build steps

blue "[Node build] "
echo "Using tsconfig.prod.json"

echo "> tsc -p ./tsconfig.prod.json"
printf "${BLUE}[Node build] Working... "

tsc -p ./tsconfig.prod.json
green "DONE"

echo "\n";

if [ -f ./tsconfig.browser.json ];
then
    blue "[Browser build] "
    echo "Using tsconfig.browser.json"
    echo "> tsc -p ./tsconfig.browser.json"

    blue "[Browser build] "
    printf "Working... "

    tsc -p ./tsconfig.browser.json
    RETURN_CODE=$?

    if [ $RETURN_CODE -eq 0 ]; then
        green "DONE"
    else
        exit $RETURN_CODE
    fi
else
    dim "Skipping browser build, because no tsconfig.browser.json file is present."
fi

