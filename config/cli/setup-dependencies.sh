#!/bin/bash

# Ensure script fails if any command fails
set -e

echo "Make package.json backup"
cp package.json package.json.bak

echo "Temporarily remove postinstall script from package.json"
jq 'del(.scripts.postinstall)' package.json > pkg-temp.json

mv pkg-temp.json package.json

echo "Install dependencies"
npm i

echo "Restore package.json"
mv package.json.bak package.json

echo "Remove backup"
rm package.json.bak