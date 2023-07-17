# @ethereumjs/genesis

[![NPM Package][genesis-npm-badge]][genesis-npm-link]
[![GitHub Issues][genesis-issues-badge]][genesis-issues-link]
[![Actions Status][genesis-actions-badge]][genesis-actions-link]
[![Code Coverage][genesis-coverage-badge]][genesis-coverage-link]
[![Discord][discord-badge]][discord-link]

Note: this README has been updated containing the changes from our next breaking release round [UNRELEASED] targeted for Summer 2023. See the README files from the [maintenance-v6](https://github.com/ethereumjs/ethereumjs-monorepo/tree/maintenance-v6/) branch for documentation matching our latest releases.

| A module to provide genesis states of well known networks. |
| ---------------------------------------------------------- |

This module provides access to Ethereum genesis state for the following networks:

- Mainnet
- Goerli
- Sepolia

The package can be install with:

```shell
npm i @ethereumjs/genesis
```

## Usage

```typescript
import { getGenesis } from '@ethereumjs/genesis'
import { Chain } from '@ethereumjs/common' // or directly use chain ID

const mainnetGenesis = getGenesis(Chain.Mainnet)
```

## EthereumJS

See our organizational [documentation](https://ethereumjs.readthedocs.io) for an introduction to `EthereumJS` as well as information on current standards and best practices. If you want to join for work or carry out improvements on the libraries, please review our [contribution guidelines](https://ethereumjs.readthedocs.io/en/latest/contributing.html) first.

## License

[MIT](https://opensource.org/licenses/MIT)

[discord-badge]: https://img.shields.io/static/v1?logo=discord&label=discord&message=Join&color=blue
[discord-link]: https://discord.gg/TNwARpR
[genesis-npm-badge]: https://img.shields.io/npm/v/@ethereumjs/genesis.svg
[genesis-npm-link]: https://www.npmjs.com/package/@ethereumjs/genesis
[genesis-issues-badge]: https://img.shields.io/github/issues/ethereumjs/ethereumjs-monorepo/package:%20genesis?label=issues
[genesis-issues-link]: https://github.com/ethereumjs/ethereumjs-monorepo/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+genesis"
[genesis-actions-badge]: https://github.com/ethereumjs/ethereumjs-monorepo/workflows/Genesis/badge.svg
[genesis-actions-link]: https://github.com/ethereumjs/ethereumjs-monorepo/actions?query=workflow%3A%22Genesis%22
[genesis-coverage-badge]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/branch/master/graph/badge.svg?flag=genesis
[genesis-coverage-link]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/tree/master/packages/genesis
