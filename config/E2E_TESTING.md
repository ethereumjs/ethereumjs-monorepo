# EthereumJS - Local and E2E Testing

## Testing packages locally on other projects

There are some ways you can link this repository packages to other projects before publishing. You can symlink dependencies with [`npm link <package>`](https://docs.npmjs.com/cli/link), or install packages from the filesystem using [`npm install <folder>`](https://docs.npmjs.com/cli/install). But they are subject to some externalities and most importantly with how your package manager handles the lifecycle of packages during installs.

_Note: Git references do not work with monorepo setups out of the box due to the lack of directory traversal on the syntax. E.g.:_

`npm install git@github.com:ethereumjs/ethereumjs-monorepo.git`

_One way to fetch packages remotely from GitHub before publishing is using [gitpkg.now.sh](https://gitpkg.now.sh/)._

But there's a cleaner way to manage your dependencies using Verdaccio.

### Install Verdaccio

Verdaccio is an npm registry and proxy that can be of great help to test packages locally. Check out their [Getting Started guide](https://github.com/verdaccio/verdaccio#get-started).

### Installs, hoists dependencies and builds packages

`npm install`

### Publish monorepo packages to Verdaccio

`npm publish --registry http://localhost:4873 --workspaces`

### Unpublish all monorepo packages from Verdaccio

`npm unpublish PACKAGE_NAME --registry http://localhost:4873 --force --workspace=PACKAGE_NAME`

### Setup @ethereumjs scope to local Verdaccio server

`npm config set @ethereumjs:registry http://localhost:4873`

### Teardown @ethereumjs scope to local Verdaccio server

`npm config delete @ethereumjs:registry`

## E2E testing in CI

Verdaccio is also set up in the [`e2e-tests`](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1134/files) CI workflow and provides a way to install @ethereumjs
packages at an arbitrary commit in an external real-world project and run their unit
tests with it. This testing strategy is borrowed from ethereum/solidity which checks latest Solidity
against OpenZeppelin and others to keep abreast of how local changes might affect critical projects
downstream from them.

Tests like this are:

- a pre-publication sanity check that discovers how @ethereumjs performs in the wild
- useful for catching problems which are difficult to anticipate
- exposed to failure for reasons outside of @ethereumjs's control, ex: when fixes here surface bugs
  in the target.

E2E tests are constructed by cloning a real world target and using npm or yarn to replace its
existing @ethereumjs dependencies with the versions published to CI's ephemeral private npm registry.

In practice, complex projects might have several versions of @ethereumjs packages nested in
their dependency tree. It's important to coerce all of them to the virtually published versions
for the test to be valid. This can be done using Yarn's selective dependency resolutions feature.
The verdaccio publication step writes a json map of @ethereumjs package names and their
virtually published versions to `resolutions.json` in the root directory. This object can be
injected into the E2E target's package.json under the `resolutions` key and Yarn will install
new versions everywhere as expected.
