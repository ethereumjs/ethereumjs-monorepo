#!/usr/bin/env bash

# --------------------------------------------------------------------
# Runs hardhat-core's test suite using releases of ethereumjs packages
# which have been published to a proxy npm registry in `e2e-publish.sh`
# --------------------------------------------------------------------

# Exit immediately on error
set -o errexit

# Should only run in Github Actions CI
if [ -z "$GITHUB_SHA" ]; then
  echo "==================================================================================="
  echo "This script installs hardhat with proxied ethereumjs components. Only run in CI."
  echo "==================================================================================="
  exit 1
fi

echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo "Cloning hardhat                             "
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"

git clone https://github.com/nomiclabs/hardhat.git

echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo "Installing updated ethereumjs components via virtual registry"
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"

npm run e2e:inject
cd hardhat/packages/hardhat-core

yarn config set registry http://localhost:4873
yarn --ignore-engines

echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo "Debugging output                            "
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"

yarn list --pattern "@ethereumjs/block|@ethereumjs/blockchain|@ethereumjs/common|@ethereumjs/tx|@ethereumjs/vm|ethereumjs-util|merkle-patricia-tree"
cat ./package.json

# Build
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo "Building hardhat                            "
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"

yarn build

# Test
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo "Running hardhat tests.                      "
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"

yarn run test:except-tracing