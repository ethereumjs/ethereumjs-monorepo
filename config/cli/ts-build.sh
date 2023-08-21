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


# Build function declaration.

build_node() {
    blue "[Node build] "
    echo "Using tsconfig.prod.cjs.json"

    echo "> tsc --build ./tsconfig.prod.cjs.json"
    printf "${BLUE}[Node build] Working... "

    tsc --build ./tsconfig.prod.cjs.json
    green "DONE"

    echo "\n";
}

build_esm() {
    if [ -f ./tsconfig.prod.esm.json ];
    then
        blue "[ESM build] "
        echo "Using tsconfig.prod.esm.json"

        echo "> tsc --build ./tsconfig.prod.esm.json"
        printf "${BLUE}[ESM build] Working... "

        tsc --build ./tsconfig.prod.esm.json
        green "DONE"
    else
        echo "Skipping ESM build (no config available)."
    fi
    echo "\n";
}

post_build_fixes() {
    blue "[Post Build Fixes]"
    if [ -f ./dist/esm/index.js ];
    then
        echo "Adding ./dist/cjs/package.json"
        rm -f ./dist/cjs/package.json
        cat <<EOT >> ./dist/cjs/package.json
{
    "type": "commonjs"
}
EOT
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

build_browser() {
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

    echo "\n";
}


# Begin build process.

if [ "$1" = "browser" ];
then
    build_browser
else
    build_node
    build_esm
    post_build_fixes
fi
