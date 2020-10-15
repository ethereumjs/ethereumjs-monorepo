<p align="center">
  <img src="https://user-images.githubusercontent.com/47108/78779352-d0839500-796a-11ea-9468-fd2a0b3fe1ef.png" width=280>
</p>

# EthereumJS Monorepo

[![Code Coverage][coverage-badge]][coverage-link]
[![Discord][discord-badge]][discord-link]

This was originally the EthereumJS VM repository. On Q1 2020 we brought some of its building blocks together to simplify development. Below you can find the packages included in this repository.

🚧 Please note that the `master` branch is updated on a daily basis, and to inspect code related to a specific package version, refer to the [tags](https://github.com/ethereumjs/ethereumjs-vm/tags).

| package                                     | npm                                                         | issues                                                                  | tests                                                                  | coverage                                                                |
| ------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| [@ethereumjs/block][block-package]           | [![NPM Package][block-npm-badge]][block-npm-link]           | [![Block Issues][block-issues-badge]][block-issues-link]                | [![Actions Status][block-actions-badge]][block-actions-link]           | [![Code Coverage][block-coverage-badge]][block-coverage-link]           |
| [@ethereumjs/blockchain][blockchain-package] | [![NPM Package][blockchain-npm-badge]][blockchain-npm-link] | [![Blockchain Issues][blockchain-issues-badge]][blockchain-issues-link] | [![Actions Status][blockchain-actions-badge]][blockchain-actions-link] | [![Code Coverage][blockchain-coverage-badge]][blockchain-coverage-link] |
| [@ethereumjs/common][common-package]         | [![NPM Package][common-npm-badge]][common-npm-link]         | [![Common Issues][common-issues-badge]][common-issues-link]             | [![Actions Status][common-actions-badge]][common-actions-link]         | [![Code Coverage][common-coverage-badge]][common-coverage-link]         |
| [@ethereumjs/ethash][ethash-package]         | [![NPM Package][ethash-npm-badge]][ethash-npm-link]         | [![Ethash Issues][ethash-issues-badge]][ethash-issues-link]             | [![Actions Status][ethash-actions-badge]][ethash-actions-link]         | [![Code Coverage][ethash-coverage-badge]][ethash-coverage-link]         |
| [@ethereumjs/tx][tx-package]                 | [![NPM Package][tx-npm-badge]][tx-npm-link]                 | [![Tx Issues][tx-issues-badge]][tx-issues-link]                         | [![Actions Status][tx-actions-badge]][tx-actions-link]                 | [![Code Coverage][tx-coverage-badge]][tx-coverage-link]                 |
| [@ethereumjs/vm][vm-package]                 | [![NPM Package][vm-npm-badge]][vm-npm-link]                 | [![VM Issues][vm-issues-badge]][vm-issues-link]                         | [![Actions Status][vm-actions-badge]][vm-actions-link]                 | [![Code Coverage][vm-coverage-badge]][vm-coverage-link]                 |

## Coverage report

Detailed version can be seen on [Codecov.io][coverage-link]

[![Code Coverage](https://codecov.io/gh/ethereumjs/ethereumjs-vm/branch/master/graphs/icicle.svg)][coverage-link]

## Package dependency relationship

<p align="center">
 <img width="409" alt="diagram" src="https://user-images.githubusercontent.com/47108/84323915-b0787980-ab45-11ea-96fd-55a03ba1f3e8.png">
</p>

<!-- CREATED WITH MERMAID
https://mermaid-js.github.io/mermaid-live-editor/#/edit/eyJjb2RlIjoiZ3JhcGggVERcbiAgdm17Vk19XG4gIGNvbW1vbiAtLT4gYmxvY2tjaGFpblxuICBjb21tb24gLS0-IGJsb2NrXG4gIGNvbW1vbiAtLT4gdm1cbiAgY29tbW9uIC0tPiB0eFxuICBldGhhc2ggLS0-IGJsb2NrY2hhaW5cbiAgYmxvY2sgLS0-IGJsb2NrY2hhaW5cbiAgYmxvY2tjaGFpbiAtLT4gdm1cbiAgYmxvY2sgLS0-IHZtXG4gIHR4IC0tPiB2bVxuICB0eCAtLT4gYmxvY2tcbiAgYWNjb3VudCAtLT4gdm1cbiAgIiwibWVybWFpZCI6eyJ0aGVtZSI6ImRlZmF1bHQifSwidXBkYXRlRWRpdG9yIjpmYWxzZX0
-->

## Development quick start

This monorepo uses [Lerna](https://lerna.js.org/). It links the local packages together, making development a lot easier.

TLDR: Setup
```sh
npm install
npm build
```

TLDR: To update dependencies and (re-)link packages
```sh
npm run bootstrap
npm build
```

Above is the quickest way to set you up. Going down the road, there are two sets of commands: *project* and *package-specific* commands. You can find them at `./package.json` and `./packages/*/package.json`, respectively. Here's a breakdown:

### Project scripts — run from repository root

#### `npm install`
Adds dependencies listed in the root package. Also, it executes the `bootstrap` script described below, installing all sub-packages dependencies.

#### `npm run bootstrap`

Installs dependencies for all sub-packages, and links them to create an integrated development environment.

#### `npm run build`

Produces `dist` files for all sub-packages. This command can be scoped.

#### `npm run build:tree -- --scope @ethereumjs/blockchain`

Builds all local packages that the provided package (eg: @ethereumjs/blockchain) depends on, and itself. This unusual syntax just means: pass whatever arguments are after `--` to the underlying script. 

If no scope is provided, `npm run build:tree`, will build all sub-packages.

### Package scripts — run from `./packages/<name>`

 **⚠️ Important: if you run `npm install` from the package directory, it will remove all links to the local packages, pulling all dependencies from npm. Run `npm install` from the root only.**
 
There's a set of rather standardized commands you will find in each package of this repository.

#### `npm run build`

Uses TypeScript compiler to build files from `src` or `lib`. Files can be found at `packages/<name>/dist`.

#### `npm run coverage`

Runs whatever is on `npm run test` script, capturing coverage information. By the end, it displays a coverage table. Additional reports can be found at `packages/<name>/coverage`.

#### `npm run docs:build`

Generates package documentation and outputs it to `./packages/<name>/docs`.

#### `npm run lint`

Checks code style according to the rules defined in [ethereumjs-config](https://github.com/ethereumjs/ethereumjs-config).

#### `npm run lint:fix`

Fixes code style according to the rules.

#### `npm run test`

Runs all package tests. Note that the VM has several test scopes - refer to [packages/vm/package.json](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/package.json) for more info.

#### `npm run clean`

Removes root and package `node_modules` directories. Useful to run before `npm i` for a fresh install.

### Going further

As this project is powered by Lerna, you can install it globally to enjoy lots more options. Refer to [Lerna docs](https://github.com/lerna/lerna/tree/master/commands/run) for additional commands.

- `npm install -g lerna`
- `lerna run`
- `lerna exec`

#### Cleaning `node_modules`

Hoisting is enabled so dependencies are moved to the root `node_modules`. `lerna clean` [does not remove the root `node_modules`](https://github.com/lerna/lerna/issues/1304) so for convenience you can use the project script `npm run clean`.

# EthereumJS

See our organizational [documentation](https://ethereumjs.readthedocs.io) for an introduction to `EthereumJS` as well as information on current standards and best practices.

If you want to join for work or do improvements on the libraries have a look at our [contribution guidelines](https://ethereumjs.readthedocs.io/en/latest/contributing.html).

# LICENSE

[MIT](https://opensource.org/licenses/MIT)

[coverage-badge]: https://codecov.io/gh/ethereumjs/ethereumjs-vm/branch/master/graph/badge.svg
[coverage-link]: https://codecov.io/gh/ethereumjs/ethereumjs-vm
[discord-badge]: https://img.shields.io/static/v1?logo=discord&label=discord&message=Join&color=blue
[discord-link]: https://discord.gg/TNwARpR
[stackexchange-badge]: https://img.shields.io/badge/ethereumjs-stackexchange-brightgreen
[stackexchange-link]: https://ethereum.stackexchange.com/questions/tagged/ethereumjs
[block-package]: ./packages/block
[block-npm-badge]: https://img.shields.io/npm/v/@ethereumjs/block.svg
[block-npm-link]: https://www.npmjs.com/package/@ethereumjs/block
[block-issues-badge]: https://img.shields.io/github/issues/ethereumjs/ethereumjs-vm/package:%20block?label=issues
[block-issues-link]: https://github.com/ethereumjs/ethereumjs-vm/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+block"
[block-actions-badge]: https://github.com/ethereumjs/ethereumjs-vm/workflows/Block/badge.svg
[block-actions-link]: https://github.com/ethereumjs/ethereumjs-vm/actions?query=workflow%3A%22Block%22
[block-coverage-badge]: https://codecov.io/gh/ethereumjs/ethereumjs-vm/branch/master/graph/badge.svg?flag=block
[block-coverage-link]: https://codecov.io/gh/ethereumjs/ethereumjs-vm/tree/master/packages/block
[blockchain-package]: ./packages/blockchain
[blockchain-npm-badge]: https://img.shields.io/npm/v/@ethereumjs/blockchain.svg
[blockchain-npm-link]: https://www.npmjs.com/package/@ethereumjs/blockchain
[blockchain-issues-badge]: https://img.shields.io/github/issues/ethereumjs/ethereumjs-vm/package:%20blockchain?label=issues
[blockchain-issues-link]: https://github.com/ethereumjs/ethereumjs-vm/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+blockchain"
[blockchain-actions-badge]: https://github.com/ethereumjs/ethereumjs-vm/workflows/Blockchain/badge.svg
[blockchain-actions-link]: https://github.com/ethereumjs/ethereumjs-vm/actions?query=workflow%3A%22Blockchain%22
[blockchain-coverage-badge]: https://codecov.io/gh/ethereumjs/ethereumjs-vm/branch/master/graph/badge.svg?flag=blockchain
[blockchain-coverage-link]: https://codecov.io/gh/ethereumjs/ethereumjs-vm/tree/master/packages/blockchain
[common-package]: ./packages/common
[common-npm-badge]: https://img.shields.io/npm/v/@ethereumjs/common.svg
[common-npm-link]: https://www.npmjs.com/package/@ethereumjs/common
[common-issues-badge]: https://img.shields.io/github/issues/ethereumjs/ethereumjs-vm/package:%20common?label=issues
[common-issues-link]: https://github.com/ethereumjs/ethereumjs-vm/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+common"
[common-actions-badge]: https://github.com/ethereumjs/ethereumjs-vm/workflows/Common/badge.svg
[common-actions-link]: https://github.com/ethereumjs/ethereumjs-vm/actions?query=workflow%3A%22Common%22
[common-coverage-badge]: https://codecov.io/gh/ethereumjs/ethereumjs-vm/branch/master/graph/badge.svg?flag=common
[common-coverage-link]: https://codecov.io/gh/ethereumjs/ethereumjs-vm/tree/master/packages/common
[ethash-package]: ./packages/ethash
[ethash-npm-badge]: https://img.shields.io/npm/v/@ethereumjs/ethash.svg
[ethash-npm-link]: https://www.npmjs.org/package/@ethereumjs/ethash
[ethash-issues-badge]: https://img.shields.io/github/issues/ethereumjs/ethereumjs-vm/package:%20ethash?label=issues
[ethash-issues-link]: https://github.com/ethereumjs/ethereumjs-vm/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+ethash"
[ethash-actions-badge]: https://github.com/ethereumjs/ethereumjs-vm/workflows/Ethash/badge.svg
[ethash-actions-link]: https://github.com/ethereumjs/ethereumjs-vm/actions?query=workflow%3A%22Ethash%22
[ethash-coverage-badge]: https://codecov.io/gh/ethereumjs/ethereumjs-vm/branch/master/graph/badge.svg?flag=ethash
[ethash-coverage-link]: https://codecov.io/gh/ethereumjs/ethereumjs-vm/tree/master/packages/ethash
[tx-package]: ./packages/tx
[tx-npm-badge]: https://img.shields.io/npm/v/@ethereumjs/tx.svg
[tx-npm-link]: https://www.npmjs.com/package/@ethereumjs/tx
[tx-issues-badge]: https://img.shields.io/github/issues/ethereumjs/ethereumjs-vm/package:%20tx?label=issues
[tx-issues-link]: https://github.com/ethereumjs/ethereumjs-vm/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+tx"
[tx-actions-badge]: https://github.com/ethereumjs/ethereumjs-vm/workflows/Tx/badge.svg
[tx-actions-link]: https://github.com/ethereumjs/ethereumjs-vm/actions?query=workflow%3A%22Tx%22
[tx-coverage-badge]: https://codecov.io/gh/ethereumjs/ethereumjs-vm/branch/master/graph/badge.svg?flag=tx
[tx-coverage-link]: https://codecov.io/gh/ethereumjs/ethereumjs-vm/tree/master/packages/tx
[vm-package]: ./packages/vm
[vm-npm-badge]: https://img.shields.io/npm/v/@ethereumjs/vm.svg
[vm-npm-link]: https://www.npmjs.com/package/@ethereumjs/vm
[vm-issues-badge]: https://img.shields.io/github/issues/ethereumjs/ethereumjs-vm/package:%20vm?label=issues
[vm-issues-link]: https://github.com/ethereumjs/ethereumjs-vm/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+vm"
[vm-actions-badge]: https://github.com/ethereumjs/ethereumjs-vm/workflows/VM/badge.svg
[vm-actions-link]: https://github.com/ethereumjs/ethereumjs-vm/actions?query=workflow%3A%22VM%22
[vm-coverage-badge]: https://codecov.io/gh/ethereumjs/ethereumjs-vm/branch/master/graph/badge.svg?flag=vm
[vm-coverage-link]: https://codecov.io/gh/ethereumjs/ethereumjs-vm/tree/master/packages/vm
