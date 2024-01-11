# @ethereumjs/blockchain

[![NPM Package][blockchain-npm-badge]][blockchain-npm-link]
[![GitHub Issues][blockchain-issues-badge]][blockchain-issues-link]
[![Actions Status][blockchain-actions-badge]][blockchain-actions-link]
[![Code Coverage][blockchain-coverage-badge]][blockchain-coverage-link]
[![Discord][discord-badge]][discord-link]

| A module to store and interact with blocks. |
| ------------------------------------------- |

Note: this `README` reflects the state of the library from `v5.0.0` onwards. See `README` from the [standalone repository](https://github.com/ethereumjs/ethereumjs-blockchain) for an introduction on the last preceding release.

## Installation

To obtain the latest version, simply require the project using `npm`:

```shell
npm install @ethereumjs/blockchain
```

**Note:** If you want to work with `EIP-4844` related functionality, you will have additional manual installation steps for the **KZG setup**, see related section below.

## Usage

### Introduction

The `Blockchain` package represents an Ethereum-compatible blockchain storing a sequential chain of [@ethereumjs/block](../block) blocks and holding information about the current canonical head block as well as the context the chain is operating in (e.g. the hardfork rules the current head block adheres to).

New blocks can be added to the blockchain. Validation ensures that the block format adheres to the given chain rules (with the `Blockchain.validateBlock()` function) and consensus rules (`Blockchain.consensus.validateConsensus()`).

The library also supports reorg scenarios e.g. by allowing to add a new block with `Blockchain.putBlock()` which follows a different canonical path to the head than given by the current canonical head block.

## Example

The following is an example to instantiate a simple Blockchain object, put blocks into the blockchain and then iterate through the blocks added:

```ts
// ./examples/simple.ts

import { Block } from '@ethereumjs/block'
import { Blockchain } from '@ethereumjs/blockchain'
import { Common, Hardfork } from '@ethereumjs/common'
import { bytesToHex } from '@ethereumjs/util'

const main = async () => {
  const common = new Common({ chain: 'mainnet', hardfork: Hardfork.London })
  // Use the safe static constructor which awaits the init method
  const blockchain = await Blockchain.create({
    validateBlocks: false, // Skipping validation so we can make a simple chain without having to provide complete blocks
    validateConsensus: false,
    common,
  })

  // We use minimal data to provide a sequence of blocks (increasing number, difficulty, and then setting parent hash to previous block)
  const block = Block.fromBlockData(
    {
      header: {
        number: 1n,
        parentHash: blockchain.genesisBlock.hash(),
        difficulty: blockchain.genesisBlock.header.difficulty + 1n,
      },
    },
    { common, setHardfork: true }
  )
  const block2 = Block.fromBlockData(
    {
      header: {
        number: 2n,
        parentHash: block.header.hash(),
        difficulty: block.header.difficulty + 1n,
      },
    },
    { common, setHardfork: true }
  )
  // See @ethereumjs/block for more details on how to create a block
  await blockchain.putBlock(block)
  await blockchain.putBlock(block2)

  // We iterate over the blocks in the chain to the current head (block 2)
  await blockchain.iterator('i', (block) => {
    const blockNumber = block.header.number.toString()
    const blockHash = bytesToHex(block.hash())
    console.log(`Block ${blockNumber}: ${blockHash}`)
  })

  // Block 1: 0xa1a061528d74ba81f560e1ebc4f29d6b58171fc13b72b876cdffe6e43b01bdc5
  // Block 2: 0x5583be91cf9fb14f5dbeb03ad56e8cef19d1728f267c35a25ba5a355a528f602
}
main()
```

### Database Abstraction / Removed LevelDB Dependency

With the v7 release the Blockchain library database has gotten an additional abstraction layer which allows to switch the backend to whatever is fitting the best for a use case, see PR [#2669](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2669) and PR [#2673](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2673). The database just needs to conform to the new [DB](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/db.ts) interface provided in the `@ethereumjs/util` package (since this is used in other places as well).

By default the blockchain package now uses a [MapDB](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/mapDB.ts) non-persistent data storage which is also generically provided in the `@ethereumjs/util` package.

If you need a persistent data store for your use case you can consider using the wrapper we have written within our [client](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/execution/level.ts) library.

### Consensus

Starting with v6 there is a dedicated consensus class for each type of supported consensus, `Ethash`, `Clique` and `Casper` (PoS, this one is rather the do-nothing part of `Casper` and letting the respective consensus/beacon client do the hard work! 🙂). Each consensus class adheres to a common interface `Consensus` implementing the following five methods in a consensus-specific way:

- `genesisInit(genesisBlock: Block): Promise<void>`
- `setup(): Promise<void>`
- `validateConsensus(block: Block): Promise<void>`
- `validateDifficulty(header: BlockHeader): Promise<void>`
- `newBlock(block: Block, commonAncestor?: BlockHeader, ancientHeaders?: BlockHeader[]): Promise<void>`

#### Custom Consensus Algorithms

Also part of V6, you can also create a custom consensus class implementing the above interface and pass it into the `Blockchain` constructor using the `consensus` option at instantiation. See [this test script](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/test/customConsensus.spec.ts) for a complete example of how write and use a custom consensus implementation.

Note, if you construct a blockchain with a custom consensus implementation, transition checks for switching from PoW to PoS are disabled so defining a merge hardfork will have no impact on the consensus mechanism defined for the chain.

## Custom Genesis State

### Genesis in v7 (removed genesis dependency)

Genesis state was huge and had previously been bundled with the `Blockchain` package with the burden going over to the VM, since `Blockchain` is a dependency.

Starting with the v7 release genesis state has been removed from `blockchain` and moved into its own auxiliary package [@ethereumjs/genesis](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/genesis), from which it can be included if needed (for most - especially VM - use cases it is not necessary), see PR [#2844](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2844).

This goes along with some changes in Blockchain and VM API:

- Blockchain: There is a new constructor option `genesisStateRoot` beside `genesisBlock` and `genesisState` for an alternative condensed way to provide the genesis state root directly
- Blockchain: `genesisState(): GenesisState` method has been replaced by the async `getGenesisStateRoot(chainId: Chain): Promise<Uint8Array>` method
- VM: `activateGenesisState?: boolean` constructor option has been replaced with a `genesisState?: GenesisState` option

### Genesis in v6

For the v6 release responsibility for setting up a custom genesis state moved from the [Common](../common/) library to the `Blockchain` package, see PR [#1924](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1924) for some work context.

A genesis state can be set along `Blockchain` creation by passing in a custom `genesisBlock` and `genesisState`. For `mainnet` and the official test networks like `sepolia` or `goerli` genesis is already provided with the block data coming from `@ethereumjs/common`. The genesis state is being integrated in the `Blockchain` library (see `genesisStates` folder).

### Custom genesis from a Geth genesis config

For many custom chains we might come across a genesis configuration, which can be used to build both chain config as well the genesis state (and hence the genesis block as well to start off with)

```ts
// ./examples/gethGenesis.ts

import { Blockchain } from '@ethereumjs/blockchain'
import { Common, parseGethGenesis } from '@ethereumjs/common'
import { bytesToHex, parseGethGenesisState } from '@ethereumjs/util'
import gethGenesisJson from './genesisData/post-merge.json'

const main = async () => {
  // Load geth genesis json file into lets say `gethGenesisJson`
  const common = Common.fromGethGenesis(gethGenesisJson, { chain: 'customChain' })
  const genesisState = parseGethGenesisState(gethGenesisJson)
  const blockchain = await Blockchain.create({
    genesisState,
    common,
  })
  const genesisBlockHash = blockchain.genesisBlock.hash()
  common.setForkHashes(genesisBlockHash)
  console.log(
    `Genesis hash from geth genesis parameters - ${bytesToHex(blockchain.genesisBlock.hash())}`
  )
}

main()
```

The genesis block from the initialized `Blockchain` can be retrieved via the `Blockchain.genesisBlock` getter. For creating a genesis block from the params in `@ethereumjs/common`, the `createGenesisBlock(stateRoot: Buffer): Block` method can be used.

## Supported Blocks and Tx Types

### EIP-1559 Support

This library supports the handling of `EIP-1559` blocks and transactions starting with the `v5.3.0` release.

### EIP-4844 Shard Blob Transactions Support

This library supports the blob transaction type introduced with [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844) as being specified in the [b9a5a11](https://github.com/ethereum/EIPs/commit/b9a5a117ab7e1dc18f937841d00598b527c306e7) EIP version from July 2023 deployed along [4844-devnet-7](https://github.com/ethpandaops/4844-testnet) (July 2023), see PR [#2349](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2349) and following.

**Note:** 4844 support is not yet completely stable and there will still be (4844-)breaking changes along all types of library releases.

The blockchain library now allows for blob transactions to be validated and included in a chain where EIP-4844 activated either by hardfork or standalone EIP (see latest tx library release for additional details).

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

Starting with v6 the usage of [BN.js](https://github.com/indutny/bn.js/) for big numbers has been removed from the library and replaced with the usage of the native JS [BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) data type (introduced in `ES2020`).

Please note that number-related API signatures have changed along with this version update and the minimal build target has been updated to `ES2020`.

## Developer

For debugging blockchain control flows the [debug](https://github.com/visionmedia/debug) library is used and can be activated on the CL with `DEBUG=[Logger Selection] node [Your Script to Run].js`.

The following initial logger is currently available:

| Logger              | Description                                                 |
| ------------------- | ----------------------------------------------------------- |
| `blockchain:clique` | Clique operations like updating the vote and/or signer list |

The following is an example for a logger run:

Run with the clique logger:

```shell
DEBUG=ethjs,blockchain:clique tsx test.ts
```

## EthereumJS

See our organizational [documentation](https://ethereumjs.readthedocs.io) for an introduction to `EthereumJS` as well as information on current standards and best practices. If you want to join for work or carry out improvements on the libraries, please review our [contribution guidelines](https://ethereumjs.readthedocs.io/en/latest/contributing.html) first.

## License

[MPL-2.0](<https://tldrlegal.com/license/mozilla-public-license-2.0-(mpl-2)>)

[discord-badge]: https://img.shields.io/static/v1?logo=discord&label=discord&message=Join&color=blue
[discord-link]: https://discord.gg/TNwARpR
[blockchain-npm-badge]: https://img.shields.io/npm/v/@ethereumjs/blockchain.svg
[blockchain-npm-link]: https://www.npmjs.com/package/@ethereumjs/blockchain
[blockchain-issues-badge]: https://img.shields.io/github/issues/ethereumjs/ethereumjs-monorepo/package:%20blockchain?label=issues
[blockchain-issues-link]: https://github.com/ethereumjs/ethereumjs-monorepo/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+blockchain"
[blockchain-actions-badge]: https://github.com/ethereumjs/ethereumjs-monorepo/workflows/Blockchain/badge.svg
[blockchain-actions-link]: https://github.com/ethereumjs/ethereumjs-monorepo/actions?query=workflow%3A%22Blockchain%22
[blockchain-coverage-badge]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/branch/master/graph/badge.svg?flag=blockchain
[blockchain-coverage-link]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/tree/master/packages/blockchain
