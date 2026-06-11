#!/bin/sh
# Lint only the .js / .ts files that have changed on this branch.
#
# Resolution order for the comparison base:
#   1. The branch's configured upstream (`@{u}`), if any.
#   2. The merge-base with the remote's default branch (origin/HEAD), if any.
#   3. The merge-base with origin/master, as a final fallback.
#
# Linting the entire repo (the previous fallback when no upstream was
# configured) is intentionally avoided: pre-existing lint findings on the
# default branch would otherwise block first-time pushes of unrelated branches.
# If no base can be determined, we lint nothing and exit cleanly rather than
# fail the push on errors that are not part of the current diff.

# Suppress stderr — `@{u}` errors when no upstream is configured, which is the
# normal first-push case we want to handle gracefully below.
REMOTE=$(git rev-parse --symbolic-full-name --abbrev-ref '@{u}' 2>/dev/null)

if [ -n "$REMOTE" ]; then
    BASE="$REMOTE"
else
    DEFAULT_REF=$(git symbolic-ref --short refs/remotes/origin/HEAD 2>/dev/null)
    if [ -z "$DEFAULT_REF" ]; then
        DEFAULT_REF="origin/master"
    fi
    BASE=$(git merge-base HEAD "$DEFAULT_REF" 2>/dev/null)
fi

if [ -n "$BASE" ]; then
    FILESCHANGED=$(git diff --diff-filter=d --name-only --relative "$BASE" | grep -E '\.(js|ts)')
else
    FILESCHANGED=""
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
