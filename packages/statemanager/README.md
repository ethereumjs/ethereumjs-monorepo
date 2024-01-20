# @ethereumjs/statemanager

[![NPM Package][statemanager-npm-badge]][statemanager-npm-link]
[![GitHub Issues][statemanager-issues-badge]][statemanager-issues-link]
[![Actions Status][statemanager-actions-badge]][statemanager-actions-link]
[![Code Coverage][statemanager-coverage-badge]][statemanager-coverage-link]
[![Discord][discord-badge]][discord-link]

| Library to provide high level access to Ethereum State |
| ------------------------------------------------------ |

## Installation

To obtain the latest version, simply require the project using `npm`:

```shell
npm install @ethereumjs/statemanager
```

Note: this library was part of the [@ethereumjs/vm](../vm/) package up till VM `v5`.

## Usage

### Introduction

The `StateManager` provides high-level access and manipulation methods to and for the Ethereum state, thinking in terms of accounts or contract code rather then the storage operations of the underlying data structure (e.g. a [Trie](../trie/)).

The library includes a TypeScript interface `StateManager` to ensure a unified interface (e.g. when passed to the VM), a concrete Trie-based `DefaultStateManager` implementation, as well as an `RPCStateManager` implementation that sources state and history data from an external JSON-RPC provider.

It also includes a checkpoint/revert/commit mechanism to either persist or revert state changes and provides a sophisticated caching mechanism under the hood to reduce the need for direct state accesses.

### `DefaultStateManager`

#### Usage example

```ts
import { Account, Address } from '@ethereumjs/util'
import { DefaultStateManager } from '@ethereumjs/statemanager'
import { hexToBytes } from '@ethereumjs/util'

const stateManager = new DefaultStateManager()
const address = new Address(hexToBytes('0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b'))
const account = new Account(BigInt(0), BigInt(1000))
await stateManager.checkpoint()
await stateManager.putAccount(address, account)
await stateManager.commit()
await stateManager.flush()
```

#### Account, Storage and Code Caches

Starting with the v2 release and complemented by the v2.1 release the StateManager comes with a significantly more elaborate caching mechanism for account, storage and code caches.

There are now two cache options available: an unbounded cache (`CacheType.ORDERED_MAP`) for short-lived usage scenarios (this one is the default cache) and a fixed-size cache (`CacheType.LRU`) for a long-lived large cache scenario.

Caches now "survive" a flush operation and especially long-lived usage scenarios will benefit from increased performance by a growing and more "knowing" cache leading to less and less trie reads.

Have a loot at the extended `CacheOptions` on how to use and leverage the new cache system.

#### Instantiating from a proof

The `DefaultStateManager` has a static constructor `fromProof` that accepts one or more [EIP-1186](https://eips.ethereum.org/EIPS/eip-1186) [proofs](./src/stateManager.ts) and will instantiate a `DefaultStateManager` with a partial trie containing the state provided by the proof(s). See below example:

```ts
// setup `stateManager` with some existing address
const proof = await stateManager.getProof(address)
const proofWithStorage = await stateManger.getProof(contractAddress, [storageKey1, storageKey2])

const partialStateManager = await DefaultStateManager.fromProof(proof)
// To add more proof data, use `addProofData`
await partialStateManager.addProofData(proofWithStorage)
const accountFromNewSM = await partialStateManager.getAccount(address)
const accountFromOldSM = await stateManager.getAccount(address)
console.log(accountFromNewSM, accountFromOldSM) // should match
const slot1FromNewSM = await stateManager.getContractStorage(contractAddress, storageKey1)
const slot2FromNewSM = await stateManager.getContractStorage(contractAddress, storageKey1) // should also match
```

### `RPCStateManager`

First, a simple example of usage:

```ts
import { Account, Address } from '@ethereumjs/util'
import { RPCStateManager } from '@ethereumjs/statemanager'

const provider = 'https://path.to.my.provider.com'
const stateManager = new RPCStateManager({ provider, blockTag: 500000n })
const vitalikDotEth = Address.fromString('0xd8da6bf26964af9d7eed9e03e53415d37aa96045')
const account = await stateManager.getAccount(vitalikDotEth)
console.log('Vitalik has a current ETH balance of ', account.balance)
```

The `RPCStateManager` can be be used with any JSON-RPC provider that supports the `eth` namespace. Instantiate the `VM` and pass in an `RPCStateManager` to run transactions against accounts sourced from the provider or to run blocks pulled from the provider at any specified block height.

**Note:** Usage of this StateManager can cause a heavy load regarding state request API calls, so be careful (or at least: aware) if used in combination with a JSON-RPC provider connecting to a third-party API service like Infura!

#### Points on `RPCStateManager` usage

##### Instantiating the EVM

In order to have an EVM instance that supports the BLOCKHASH opcode (which requires access to block history), you must instantiate both the `RPCStateManager` and the `RpcBlockChain` and use that when initalizing your EVM instance as below:

```js
import { RPCStateManager, RPCBlockChain } from '../src/rpcStateManager.js'
import { EVM } from '@ethereumjs/evm'

const blockchain = new RPCBlockChain({}, provider)
const blockTag = 1n
const state = new RPCStateManager({ provider, blockTag })
const evm = new EVM({ blockchain, stateManager: state })
```

Note: Failing to provide the `RPCBlockChain` instance when instantiating the EVM means that the `BLOCKHASH` opcode will fail to work correctly during EVM execution.

##### Provider selection

- The provider you select must support the `eth_getProof`, `eth_getCode`, and `eth_getStorageAt` RPC methods.
- Not all providers support retrieving state from all block heights so refer to your provider's documentation. Trying to use a block height not supported by your provider (e.g. any block older than the last 256 for CloudFlare) will result in RPC errors when using the state manager.

##### Block Tag selection

- You have to pass a block number or `earliest` in the constructor that specifies the block height you want to pull state from.
- The `latest`/`pending` values supported by the Ethereum JSON-RPC are not supported as longer running scripts run the risk of state values changing as blocks are mined while your script is running.
- If using a very recent block as your block tag, be aware that reorgs could occur and potentially alter the state you are interacting with.
- If you want to rerun transactions from block X or run block X, you need to specify the block tag as X-1 in the state manager constructor to ensure you are pulling the state values at the point in time the transactions or block was run.

##### Potential gotchas

- The RPC State Manager cannot compute valid state roots when running blocks as it does not have access to the entire Ethereum state trie so can not compute correct state roots, either for the account trie or for storage tries.
- If you are replaying mainnet transactions and an account or account storage is touched by multiple transactions in a block, you must replay those transactions in order (with regard to their position in that block) or calculated gas will likely be different than actual gas consumed.

##### Further reference

Refer to [this test script](./test/rpcStateManager.spec.ts) for complete examples of running transactions and blocks in the `vm` with data sourced from a provider.

## Browser

With the breaking release round in Summer 2023 we have added hybrid ESM/CJS builds for all our libraries (see section below) and have eliminated many of the caveats which had previously prevented a frictionless browser usage.

It is now easily possible to run a browser build of one of the EthereumJS libraries within a modern browser using the provided ESM build. For a setup example see [./examples/browser.html](./examples/browser.html).

## API

### Docs

Generated TypeDoc API [Documentation](./docs/README.md)

### Hybrid CJS/ESM Builds

With the breaking releases from Summer 2023 we have started to ship our libraries with both CommonJS (`cjs` folder) and ESM builds (`esm` folder), see `package.json` for the detailed setup.

If you use an ES6-style `import` in your code files from the ESM build will be used:

```ts
import { EthereumJSClass } from '@ethereumjs/[PACKAGE_NAME]'
```

If you use Node.js specific `require`, the CJS build will be used:

```ts
const { EthereumJSClass } = require('@ethereumjs/[PACKAGE_NAME]')
```

Using ESM will give you additional advantages over CJS beyond browser usage like static code analysis / Tree Shaking which CJS can not provide.

### Buffer -> Uint8Array

With the breaking releases from Summer 2023 we have removed all Node.js specific `Buffer` usages from our libraries and replace these with [Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) representations, which are available both in Node.js and the browser (`Buffer` is a subclass of `Uint8Array`).

We have converted existing Buffer conversion methods to Uint8Array conversion methods in the [@ethereumjs/util](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/util) `bytes` module, see the respective README section for guidance.

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
