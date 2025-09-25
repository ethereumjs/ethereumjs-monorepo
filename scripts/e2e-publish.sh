#!/usr/bin/env bash

# --------------------------------------------------------------------
# Publishes all ethereumjs-monorepo packages to a local npm proxy
# registry in CI so the package can be E2E tested by installing it in
# another project
# --------------------------------------------------------------------

# Exit immediately on error
set -o errexit

# Should only run in Github Actions CI
if [ -z "$GITHUB_SHA" ]; then
  echo "==================================================================================="
  echo "This script publishes ethereumjs-monorepo to an npm proxy registry. Only run in CI."
  echo "==================================================================================="
  exit 1
fi

# Launch npm proxy registry
pnpm dlx verdaccio --config verdaccio.yml &

pnpm dlx wait-port 4873

# Register a user in the temporary registry
TOKEN=$(curl -XPUT \
  -H "Content-type: application/json" \
  -d '{ "name": "test", "password": "test" }' \
  'http://localhost:4873/-/user/org.couchdb.user:test')

pnpm config set registry "http://localhost:4873"
pnpm config set //localhost:4873/:_authToken $TOKEN

# pnpm version
pnpm version minor \
  --recursive \
  --workspace-root \
  --no-git-tag-version \
  --force

# Set identity prior to publishing
git config user.email "someone@example.com"
git config user.name "someone"

# Clear prepublish script (no need to run clean/build/test)
cp /dev/null config/cli/prepublish.sh

# Publish to e2e tag
pnpm -r publish \
  --dist-tag e2e \
  --registry http://localhost:4873
