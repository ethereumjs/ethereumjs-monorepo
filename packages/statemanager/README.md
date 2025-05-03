# @ethereumjs/statemanager `v10`

[![NPM Package][statemanager-npm-badge]][statemanager-npm-link]
[![GitHub Issues][statemanager-issues-badge]][statemanager-issues-link]
[![Actions Status][statemanager-actions-badge]][statemanager-actions-link]
[![Code Coverage][statemanager-coverage-badge]][statemanager-coverage-link]
[![Discord][discord-badge]][discord-link]

| Library to provide high level access to Ethereum State |
| ------------------------------------------------------ |

- 🫧 Transparent state access from EVM/VM
- 🌴 Tree-shakeable API
- 👷🏼 Controlled dependency set (5 external + `@Noble` crypto)
- ⏳ Checkpoints + Diff-based Caches
- 🔌 Unified interface (for custom SMs)
- 🎁 3 SMs included (Merkle/Simple/RPC)
- 🛵 233KB bundle size (for Merkle SM) (63KB gzipped)
- 🏄🏾‍♂️ WASM-free default + Fully browser ready

## Table of Contents

- [Installation](#installation)
- [Getting Started](#getting-started)
- [MerkleStateManager](#merklestatemanager)
- [SimpleStateManager](#simplestatemanager)
- [RPCStateManager](#rpcstatemanager)
- [Verkle (experimental)](#verkle-state-managers-experimental)
- [Browser](#browser)
- [API](#api)
- [Development](#development)
- [EthereumJS](#ethereumjs)
- [License](#license)


## Installation

To obtain the latest version, simply require the project using `npm`:

```shell
npm install @ethereumjs/statemanager
```

## Getting Started

### Overview

The `StateManager` provides high-level access and manipulation methods to and for the Ethereum state, thinking in terms of accounts or contract code rather then the storage operations of the underlying data structure (e.g. a [Trie](../trie/)).

This library includes several different implementations that all implement the `StateManager` interface which is accepted by the `vm` library. These include:

- [`SimpleStateManager`](./src/simpleStateManager.ts) -a minimally functional (and dependency minimized) version of the state manager suitable for most basic EVM bytecode operations
- [`MerkleStateManager`](./src/stateManager.ts) - a Merkle-Patricia Trie-based `MerkleStateManager` implementation that is used by the `@ethereumjs/client` and `@ethereumjs/vm`
- [`RPCStateManager`](./src/rpcStateManager.ts) - a light-weight implementation that sources state and history data from an external JSON-RPC provider
- [`StatefulVerkleStateManager`](./src/statefulVerkleStateManager.ts) - an experimental implementation of a stateful verkle state manager
- [`StatelessVerkleStateManager`](./src/statelessVerkleStateManager.ts) - an experimental implementation of a "stateless" state manager that uses Verkle proofs to provide necessary state access for processing verkle-trie based blocks

It also includes a checkpoint/revert/commit mechanism to either persist or revert state changes and provides a sophisticated caching mechanism under the hood to reduce the need reading state accesses from disk.

### WASM Crypto Support

This library by default uses JavaScript implementations for the basic standard crypto primitives like hashing for underlying trie keys. See `@ethereumjs/common` [README](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/common) for instructions on how to replace with e.g. a more performant WASM implementation by using a shared `common` instance.

## `MerkleStateManager`

### Usage example

```ts
// ./examples/basicUsage.ts

import { MerkleStateManager } from '@ethereumjs/statemanager'
import { Account, Address, hexToBytes } from '@ethereumjs/util'

const main = async () => {
  const stateManager = new MerkleStateManager()
  const address = new Address(hexToBytes('0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b'))
  const account = new Account(BigInt(0), BigInt(1000))
  await stateManager.checkpoint()
  await stateManager.putAccount(address, account)
  await stateManager.commit()
  await stateManager.flush()

  // Account at address 0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b has balance 1000
  console.log(
    `Account at address ${address.toString()} has balance ${
      (await stateManager.getAccount(address))?.balance
    }`,
  )
}
void main()
```

### Account, Storage and Code Caches

Starting with the v2 release and complemented by the v2.1 release the StateManager comes with a significantly more elaborate caching mechanism for account, storage and code caches.

There are now two cache options available: an unbounded cache (`CacheType.ORDERED_MAP`) for short-lived usage scenarios (this one is the default cache) and a fixed-size cache (`CacheType.LRU`) for a long-lived large cache scenario.

Caches now "survive" a flush operation and especially long-lived usage scenarios will benefit from increased performance by a growing and more "knowing" cache leading to less and less trie reads.

Have a look at the extended `CacheOptions` on how to use and leverage the new cache system.

### Instantiating from Proofs

The `MerkleStateManager` has a standalone constructor function `fromMerkleStateProof` that accepts one or more [EIP-1186](https://eips.ethereum.org/EIPS/eip-1186) [proofs](./src/stateManager.ts) and will instantiate a `MerkleStateManager` with a partial trie containing the state provided by the proof(s). Be aware that this constructor accepts the `StateManagerOpts` dictionary as a third parameter (i.e. `fromMerkleStateProof(proof, safe, opts)`).

Therefore, if you need to use a customized trie (e.g. one that does not use key hashing) or specify caching options, you can pass them in here. If you do instantiate a trie and pass it into the `createTrieFromProof` constructor, you also need to instantiate the trie using the corresponding `createStateManagerFromProof` constructor to ensure the state root matches when the proof data is added to the trie, consider an example:

```ts
const newTrie = await createTrieFromProof(proof, { useKeyHashing: false })
const partialSM = await fromMerkleStateProof([proof], true, {
  trie: newTrie,
})
```

See below example for common usage:

```ts
// ./examples/fromProofInstantiation.ts

import {
  MerkleStateManager,
  addMerkleStateProofData,
  fromMerkleStateProof,
  getMerkleStateProof,
} from '@ethereumjs/statemanager'
import { Address, hexToBytes } from '@ethereumjs/util'

const main = async () => {
  // setup `stateManager` with some existing address
  const stateManager = new MerkleStateManager()
  const contractAddress = new Address(hexToBytes('0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b'))
  const byteCode = hexToBytes('0x67ffffffffffffffff600160006000fb')
  const storageKey1 = hexToBytes(
    '0x0000000000000000000000000000000000000000000000000000000000000001',
  )
  const storageKey2 = hexToBytes(
    '0x0000000000000000000000000000000000000000000000000000000000000002',
  )
  const storageValue1 = hexToBytes('0x01')
  const storageValue2 = hexToBytes('0x02')

  await stateManager.putCode(contractAddress, byteCode)
  await stateManager.putStorage(contractAddress, storageKey1, storageValue1)
  await stateManager.putStorage(contractAddress, storageKey2, storageValue2)

  const proof = await getMerkleStateProof(stateManager, contractAddress)
  const proofWithStorage = await getMerkleStateProof(stateManager, contractAddress, [
    storageKey1,
    storageKey2,
  ])
  const partialStateManager = await fromMerkleStateProof(proof)

  // To add more proof data, use `addMerkleStateProofData`
  await addMerkleStateProofData(partialStateManager, proofWithStorage)
  console.log(await partialStateManager.getCode(contractAddress)) // contract bytecode is not included in proof
  console.log(await partialStateManager.getStorage(contractAddress, storageKey1), storageValue1) // should match
  console.log(await partialStateManager.getStorage(contractAddress, storageKey2), storageValue2) // should match

  const accountFromNewSM = await partialStateManager.getAccount(contractAddress)
  const accountFromOldSM = await stateManager.getAccount(contractAddress)
  console.log(accountFromNewSM, accountFromOldSM) // should match

  const slot1FromNewSM = await stateManager.getStorage(contractAddress, storageKey1)
  const slot2FromNewSM = await stateManager.getStorage(contractAddress, storageKey2)
  console.log(slot1FromNewSM, storageValue1) // should match
  console.log(slot2FromNewSM, storageValue2) // should match
}
void main()
```

## `SimpleStateManager`

The `SimpleStateManager` is a dependency-minimized simple state manager implementation. While this state manager implementation lacks the implementations of some non-core functionality as well as proof related logic (e.g. `setStateRoot()`) it is suitable for a lot use cases where things like sophisticated caching or state root handling is not needed.

This state manager can be instantiated and used as follows:

```ts
// ./examples/simple.ts

import { Account, createAddressFromPrivateKey, randomBytes } from '@ethereumjs/util'

import { SimpleStateManager } from '../src/index.ts'

const main = async () => {
  const sm = new SimpleStateManager()
  const address = createAddressFromPrivateKey(randomBytes(32))
  const account = new Account(0n, 0xfffffn)
  await sm.putAccount(address, account)
  console.log(await sm.getAccount(address))
}

void main()

```

## `RPCStateManager`

The `RPCStateManager` can be be used with any JSON-RPC provider that supports the `eth` namespace. Instantiate the `VM` and pass in an `RPCStateManager` to run transactions against accounts sourced from the provider or to run blocks pulled from the provider at any specified block height.

A simple example of usage:

```ts
// ./examples/rpcStateManager.ts

import { RPCStateManager } from '@ethereumjs/statemanager'
import { createAddressFromString } from '@ethereumjs/util'

const main = async () => {
  try {
    const provider = 'https://path.to.my.provider.com'
    const stateManager = new RPCStateManager({ provider, blockTag: 500000n })
    const vitalikDotEth = createAddressFromString('0xd8da6bf26964af9d7eed9e03e53415d37aa96045')
    const account = await stateManager.getAccount(vitalikDotEth)
    console.log('Vitalik has a current ETH balance of ', account?.balance)
  } catch (e) {
    console.log(e.message) // fetch fails because provider url is not real. please replace provider with a valid rpc url string.
  }
}
void main()
```

**Note:** Usage of this StateManager can cause a heavy load regarding state request API calls, so be careful (or at least: aware) if used in combination with a JSON-RPC provider connecting to a third-party API service like Infura!

### Points on `RPCStateManager` usage

#### Instantiating the EVM

In order to have an EVM instance that supports the BLOCKHASH opcode (which requires access to block history), you must instantiate both the `RPCStateManager` and the `RpcBlockChain` and use that when initializing your EVM instance as below:

```ts
// ./examples/evm.ts

import { createEVM } from '@ethereumjs/evm'
import { RPCBlockChain, RPCStateManager } from '@ethereumjs/statemanager'

const main = async () => {
  try {
    const provider = 'https://path.to.my.provider.com'
    const blockchain = new RPCBlockChain(provider)
    const blockTag = 1n
    const state = new RPCStateManager({ provider, blockTag })
    const evm = await createEVM({ blockchain, stateManager: state }) // note that evm is ready to run BLOCKHASH opcodes (over RPC)
  } catch (e) {
    console.log(e.message) // fetch would fail because provider url is not real. please replace provider with a valid RPC url string.
  }
}
void main()
```

Note: Failing to provide the `RPCBlockChain` instance when instantiating the EVM means that the `BLOCKHASH` opcode will fail to work correctly during EVM execution.

#### Provider selection

- The provider you select must support the `eth_getProof`, `eth_getCode`, and `eth_getStorageAt` RPC methods.
- Not all providers support retrieving state from all block heights so refer to your provider's documentation. Trying to use a block height not supported by your provider (e.g. any block older than the last 256 for CloudFlare) will result in RPC errors when using the state manager.

#### Block Tag selection

- You have to pass a block number or `earliest` in the constructor that specifies the block height you want to pull state from.
- The `latest`/`pending` values supported by the Ethereum JSON-RPC are not supported as longer running scripts run the risk of state values changing as blocks are mined while your script is running.
- If using a very recent block as your block tag, be aware that reorgs could occur and potentially alter the state you are interacting with.
- If you want to rerun transactions from block X or run block X, you need to specify the block tag as X-1 in the state manager constructor to ensure you are pulling the state values at the point in time the transactions or block was run.

#### Potential gotchas

- The RPC State Manager cannot compute valid state roots when running blocks as it does not have access to the entire Ethereum state trie so can not compute correct state roots, either for the account trie or for storage tries.
- If you are replaying mainnet transactions and an account or account storage is touched by multiple transactions in a block, you must replay those transactions in order (with regard to their position in that block) or calculated gas will likely be different than actual gas consumed.

#### Further reference

Refer to [this test script](./test/rpcStateManager.spec.ts) for complete examples of running transactions and blocks in the `vm` with data sourced from a provider.

## Verkle (experimental)

There are two new verkle related state managers integrated into the code base. These state managers are very experimental and meant to be used for connecting to early [Verkle Tree](https://eips.ethereum.org/EIPS/eip-6800) test networks (Kaustinen). These state managers are not yet sufficiently tested and APIs are not yet stable and it therefore should not be used in production.

See [PRs around Verkle](https://github.com/search?q=repo%3Aethereumjs%2Fethereumjs-monorepo+verkle&type=pullrequests) in our monorepo for an entrypoint if you are interested in our current Verkle related work.

## Browser

We provide hybrid ESM/CJS builds for all our libraries. With the v10 breaking release round from Spring 2025, all libraries are "pure-JS" by default and we have eliminated all hard-wired WASM code. Additionally we have substantially lowered the bundle sizes, reduced the number of dependencies, and cut out all usages of Node.js-specific primitives (like the Node.js event emitter).

It is easily possible to run a browser build of one of the EthereumJS libraries within a modern browser using the provided ESM build. For a setup example see [./examples/browser.html](./examples/browser.html).

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
