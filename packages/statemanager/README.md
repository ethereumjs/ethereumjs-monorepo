# @ethereumjs/statemanager

[![NPM Package][statemanager-npm-badge]][statemanager-npm-link]
[![GitHub Issues][statemanager-issues-badge]][statemanager-issues-link]
[![Actions Status][statemanager-actions-badge]][statemanager-actions-link]
[![Code Coverage][statemanager-coverage-badge]][statemanager-coverage-link]
[![Discord][discord-badge]][discord-link]

| TypeScript implementation of the Ethereum StateManager. |
| ------------------------------------------------------- |

## Installation

To obtain the latest version, simply require the project using `npm`:

```shell
npm install @ethereumjs/statemanager
```

Note: this library was part of the [@ethereumjs/vm](../vm/) package up till VM `v5`.

## Usage

### Introduction

The `StateManager` provides high-level access and manipulation methods to and for the Ethereum state, thinking in terms of accounts or contract code rather then the storage operations of the underlying data structure (e.g. a [Trie](../trie/)).

The library includes a TypeScript interface `StateManager` to ensure a unified interface (e.g. when passed to the VM) as well as a concrete Trie-based implementation `DefaultStateManager` as well as an `EthersStateManager` implementation that sources state and history data from an external `ethers` provider.

### `DefaultStateManager` Example

```typescript
import { Account, Address } from '@ethereumjs/util'
import { DefaultStateManager } from '@ethereumjs/statemanager'

const stateManager = new DefaultStateManager()
const address = new Address(Buffer.from('a94f5374fce5edbc8e2a8697c15331677e6ebf0b', 'hex'))
const account = new Account(BigInt(0), BigInt(1000))
await stateManager.checkpoint()
await stateManager.putAccount(address, account)
await stateManager.commit()
await stateManager.flush()
```

### `EthersStateManager`

First, a simple example of usage:

```typescript
import { Account, Address } from '@ethereumjs/util'
import { EthersStateManager } from '@ethereumjs/statemanager'
import { ethers } from 'ethers'

const provider = new ethers.providers.JsonRpcProvider('https://path.to.my.provider.com')
const stateManager = new EthersStateManager({ provider })
const vitalikDotEth = Address.fromString('0xd8da6bf26964af9d7eed9e03e53415d37aa96045')
const account = await stateManager.getAccount(vitalikDotEth)
console.log('Vitalik has a current ETH balance of ', account.balance)
```

The `EthersStateManager` can be be used with an `ethers` `JsonRpcProvider` or one of its subclasses. It can be used in conjunction with the VM to run transactions against accounts sourced from the provider or to run blocks pulled from the provider.

Refer to [this test script](./tests/ethersStateManager.spec.ts) for complete examples of running transactions and blocks in the `vm` with data sourced from a provider.

**WARNING** When running blocks in the VM with the `EthersStateManager`, there is an edge case where an account self destruct occurs or a storage slot is deleted. In this case, the block result produced by the VM when using the `EthersStateManager` will have a different state root than reported by the provider. Most blocks should execute successfully but this would be a prime suspect if the `vm` reports an invalid stateRoot reported after executing the block.

## API

### Docs

Generated TypeDoc API [Documentation](./docs/README.md)

### BigInt Support

Starting with v1 the usage of [BN.js](https://github.com/indutny/bn.js/) for big numbers has been removed from the library and replaced with the usage of the native JS [BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) data type (introduced in `ES2020`).

Please note that number-related API signatures have changed along with this version update and the minimal build target has been updated to `ES2020`.

## Development

Developer documentation - currently mainly with information on testing and debugging - can be found [here](./DEVELOPER.md).

## EthereumJS

See our organizational [documentation](https://ethereumjs.readthedocs.io) for an introduction to `EthereumJS` as well as information on current standards and best practices. If you want to join for work or carry out improvements on the libraries, please review our [contribution guidelines](https://ethereumjs.readthedocs.io/en/latest/contributing.html) first.

## License

[MPL-2.0](<https://tldrlegal.com/license/mozilla-public-license-2.0-(mpl-2)>)

[discord-badge]: https://img.shields.io/static/v1?logo=discord&label=discord&message=Join&color=blue
[discord-link]: https://discord.gg/TNwARpR
[statemanager-npm-badge]: https://img.shields.io/npm/v/@ethereumjs/statemanager.svg
[statemanager-npm-link]: https://www.npmjs.com/package/@ethereumjs/statemanager
[statemanager-issues-badge]: https://img.shields.io/github/issues/ethereumjs/ethereumjs-monorepo/package:%20statemanager?label=issues
[statemanager-issues-link]: https://github.com/ethereumjs/ethereumjs-monorepo/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+statemanager"
[statemanager-actions-badge]: https://github.com/ethereumjs/ethereumjs-monorepo/workflows/StateManager/badge.svg
[statemanager-actions-link]: https://github.com/ethereumjs/ethereumjs-monorepo/actions?query=workflow%3A%22Statemanager%22
[statemanager-coverage-badge]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/branch/master/graph/badge.svg?flag=statemanager
[statemanager-coverage-link]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/tree/master/packages/statemanager
