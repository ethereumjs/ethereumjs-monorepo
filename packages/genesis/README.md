# @ethereumjs/genesis

[![NPM Package][genesis-npm-badge]][genesis-npm-link]
[![GitHub Issues][genesis-issues-badge]][genesis-issues-link]
[![Actions Status][genesis-actions-badge]][genesis-actions-link]
[![Code Coverage][genesis-coverage-badge]][genesis-coverage-link]
[![Discord][discord-badge]][discord-link]

| A module to provide genesis states of well known networks. |
| ---------------------------------------------------------- |

This module provides access to Ethereum genesis state for the following networks:

- Mainnet
- Goerli
- Sepolia
- Holesky

The package can be install with:

```shell
npm i @ethereumjs/genesis
```

## Usage

```ts
// ./examples/simple.ts

import { getGenesis } from '@ethereumjs/genesis'
import { Chain } from '@ethereumjs/common' // or directly use chain ID

const mainnetGenesis = getGenesis(Chain.Mainnet)
console.log(
  `This balance for account 0x000d836201318ec6899a67540690382780743280 in this chain's genesis state is ${parseInt(
    mainnetGenesis!['0x000d836201318ec6899a67540690382780743280'] as string
  )}`
)
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
