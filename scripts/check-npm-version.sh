#!/usr/bin/env bash

# --------------------------------------------------------------------
# Checks that npm >=v7 for workspace support
# --------------------------------------------------------------------

# Exit immediately on error
set -o errexit

NPM_MAJOR_V=$(npm -v | grep -o [0-9]*)

# Remove all new line, carriage return, tab characters
# from the string, to allow integer comparison
NPM_MAJOR_V="${NPM_MAJOR_V//[$'\t\r\n ']}"

if [ "$NPM_MAJOR_V" -ge 7 ]; then
  echo 'npm >=v7 satisfied'; else
  echo 'npm version 7 or greater is required for workspaces support. Please update with "npm i -g npm@7"' && exit 1
fi