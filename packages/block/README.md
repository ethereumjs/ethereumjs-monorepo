# @ethereumjs/block `v10`

[![NPM Package][block-npm-badge]][block-npm-link]
[![GitHub Issues][block-issues-badge]][block-issues-link]
[![Actions Status][block-actions-badge]][block-actions-link]
[![Code Coverage][block-coverage-badge]][block-coverage-link]
[![Discord][discord-badge]][discord-link]

| Implements schema and functions related to Ethereum blocks. |
| ----------------------------------------------------------- |

- 🦄 All block features till **Pectra**
- 🌴 Tree-shakeable API
- 👷🏼 Controlled dependency set (4 external + `@Noble` crypto)
- 🔮 `EIP-4844` Shard Blob Txs
- 💸 `EIP-4895` Beacon Chain Withdrawals
- 📨 `EIP-7685` Consensus Layer Requests
- 🛵 324KB bundle size (81KB gzipped)
- 🏄🏾‍♂️ WASM-free default + Fully browser ready

## Table of Contents

- [Installation](#installation)
- [Getting Started](#getting-started)
- [EIP Integrations](#eip-integrations)
- [Consensus Types](#consensus-types)
- [Browser](#browser)
- [API](#api)
- [Testing](#testing)
- [EthereumJS](#ethereumjs)
- [License](#license)

## Installation

To obtain the latest version, simply install the project using `npm`:

```shell
npm install @ethereumjs/block
```

**Note:** If you want to work with `EIP-4844` related functionality, you will have additional initialization steps for the **KZG setup**, see related section below.

## Getting Started

### Instantiation

There are several standalone functions to instantiate a `Block`:

- `createBlock(blockData: BlockData = {}, opts?: BlockOptions)`
- `createEmptyBlock(headerData: HeaderData, opts?: BlockOptions)`
- `createBlockFromBytesArray(values: BlockBytes, opts?: BlockOptions)`
- `createBlockFromRLP(serialized: Uint8Array, opts?: BlockOptions)`
- `createBlockFromRPC(blockParams: JSONRPCBlock, uncles?: any[], opts?: BlockOptions)`
- `createBlockFromJSONRPCProvider(provider: string | EthersProvider, blockTag: string | bigint, opts: BlockOptions)`
- `createBlockFromExecutionPayload(payload: ExecutionPayload, opts?: BlockOptions)`
- `createBlockFromBeaconPayloadJSON(payload: BeaconPayloadJSON, opts?: BlockOptions)`
- `createSealedCliqueBlock(blockData: BlockData = {}, cliqueSigner: Uint8Array, opts?: BlockOptions)`

For `BlockHeader` instantiation, there are similar standalone functions:

- `createBlockHeader(headerData: HeaderData = {}, opts?: BlockOptions)`
- `createBlockHeaderFromBytesArray(values: BlockHeaderBytes, opts?: BlockOptions)`
- `createBlockHeaderFromRLP(serializedHeaderData: Uint8Array, opts?: BlockOptions)`
- `createBlockHeaderFromRPC(blockParams: JSONRPCBlock, options?: BlockOptions)`
- `createSealedCliqueBlockHeader(headerData: HeaderData = {}, cliqueSigner: Uint8Array, opts?: BlockOptions)`

Instantiation Example:

```ts
// ./examples/simple.ts

import { createBlockHeader } from '@ethereumjs/block'
import { bytesToHex } from '@ethereumjs/util'

import type { HeaderData } from '@ethereumjs/block'

const headerData: HeaderData = {
  number: 15,
  parentHash: '0x6bfee7294bf44572b7266358e627f3c35105e1c3851f3de09e6d646f955725a7',
  gasLimit: 8000000,
  timestamp: 1562422144,
}
const header = createBlockHeader(headerData)
console.log(`Created block header with hash=${bytesToHex(header.hash())}`)
```

Properties of a `Block` or `BlockHeader` object are frozen with `Object.freeze()` which gives you enhanced security and consistency properties when working with the instantiated object. This behavior can be modified using the `freeze` option in the constructor if needed.

API Usage Example:

```ts
// ./examples/1559.ts#L46-L50

try {
  await blockWithMatchingBaseFee.validateData()
} catch (err) {
  console.log(err) // block validation fails
}
```

### WASM Crypto Support

This library by default uses JavaScript implementations for the basic standard crypto primitives like hashing or signature verification (for included txs). See `@ethereumjs/common` [README](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/common) for instructions on how to replace with e.g. a more performant WASM implementation by using a shared `common` instance.

## EIP Integrations

### Blocks with an EIP-1559 Fee Market

By default (since `Hardfork.London`) blocks created with this library are [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559) compatible.

```ts
// ./examples/1559.ts

import { createBlock } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createTx } from '@ethereumjs/tx'
const common = new Common({ chain: Mainnet })

const block = createBlock(
  {
    header: {
      baseFeePerGas: BigInt(10),
      gasLimit: BigInt(100),
      gasUsed: BigInt(60),
    },
  },
  { common },
)

// Base fee will increase for next block since the
// gas used is greater than half the gas limit
console.log(Number(block.header.calcNextBaseFee())) // 11

// So for creating a block with a matching base fee in a certain
// chain context you can do:
const blockWithMatchingBaseFee = createBlock(
  {
    header: {
      baseFeePerGas: block.header.calcNextBaseFee(),
      gasLimit: BigInt(100),
      gasUsed: BigInt(60),
    },
  },
  { common },
)

console.log(Number(blockWithMatchingBaseFee.header.baseFeePerGas)) // 11

// successful validation does not throw error
await blockWithMatchingBaseFee.validateData()

// failed validation throws error
const tx = createTx(
  { type: 2, maxFeePerGas: BigInt(20) },
  { common: new Common({ chain: Mainnet }) },
)
blockWithMatchingBaseFee.transactions.push(tx)
console.log(blockWithMatchingBaseFee.getTransactionsValidationErrors()) // invalid transaction added to block
try {
  await blockWithMatchingBaseFee.validateData()
} catch (err) {
  console.log(err) // block validation fails
}
```

### Blocks with EIP-4895 Beacon Chain Withdrawals

Starting with the `v4.1.0` release there is support for [EIP-4895](https://eips.ethereum.org/EIPS/eip-4895) beacon chain withdrawals (`Hardfork.Shanghai` or higher). To create a block containing system-level withdrawals, the `withdrawals` data option together with a matching `withdrawalsRoot` can be used:

```ts
// ./examples/withdrawals.ts

import { createBlock } from '@ethereumjs/block'
import { Common, Mainnet } from '@ethereumjs/common'
import { Address, hexToBytes } from '@ethereumjs/util'

import type { WithdrawalData } from '@ethereumjs/util'

const common = new Common({ chain: Mainnet })

const withdrawal = <WithdrawalData>{
  index: BigInt(0),
  validatorIndex: BigInt(0),
  address: new Address(hexToBytes(`0x${'20'.repeat(20)}`)),
  amount: BigInt(1000),
}

const block = createBlock(
  {
    header: {
      withdrawalsRoot: hexToBytes(
        '0x69f28913c562b0d38f8dc81e72eb0d99052444d301bf8158dc1f3f94a4526357',
      ),
    },
    withdrawals: [withdrawal],
  },
  {
    common,
  },
)

console.log(`Block with ${block.withdrawals!.length} withdrawal(s) created`)
```

Validation of the withdrawals trie can be manually triggered with the newly introduced async `Block.withdrawalsTrieIsValid()` method.

### Blocks with EIP-4844 Shard Blob Transactions

This library supports the blob transaction type introduced with [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844) (`Hardfork.Cancun` or higher), see the following example:

```ts
// ./examples/4844.ts

import { createBlock } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createBlob4844Tx } from '@ethereumjs/tx'
import { createAddressFromPrivateKey } from '@ethereumjs/util'
import { trustedSetup } from '@paulmillr/trusted-setups/fast.js'
import { randomBytes } from 'crypto'
import { KZG as microEthKZG } from 'micro-eth-signer/kzg'

const main = async () => {
  const kzg = new microEthKZG(trustedSetup)

  const common = new Common({
    chain: Mainnet,
    customCrypto: {
      kzg,
    },
  })
  const blobTx = createBlob4844Tx(
    { blobsData: ['myFirstBlob'], to: createAddressFromPrivateKey(randomBytes(32)) },
    { common },
  )

  const block = createBlock(
    {
      header: {
        excessBlobGas: 0n,
      },
      transactions: [blobTx],
    },
    {
      common,
      skipConsensusFormatValidation: true,
    },
  )

  console.log(
    `4844 block header with excessBlobGas=${block.header.excessBlobGas} created and ${
      block.transactions.filter((tx) => tx.type === 3).length
    } blob transactions`,
  )
}

void main()
```

**Note:** Working with blob transactions needs a manual KZG library installation and global initialization, see [KZG Setup](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/tx/README.md#kzg-setup) for instructions.

### Blocks with EIP-7685 Consensus Layer Requests

Starting with v10 this library supports requests to the consensus layer which have been introduced with [EIP-7685](https://eips.ethereum.org/EIPS/eip-7685) (`Hardfork.Prague` or higher). See the `@ethereumjs/util` [Request](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/util#module-request) README section for an overview of current request types.

```ts
// ./examples/clrequests.ts

import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createCLRequest, CLRequestType, hexToBytes, bytesToHex } from '@ethereumjs/util'
import { sha256 } from 'ethereum-cryptography/sha256.js'

import { createBlock, genRequestsRoot } from '../src'

// Enable EIP-7685 to support CLRequests
const common = new Common({ chain: Mainnet, hardfork: Hardfork.Cancun, eips: [7685] })

// Create the three CLRequest types (Deposit, Withdrawal, Consolidation)
const depositData = hexToBytes('0x00...') // Deposit request data
const depositRequest = createCLRequest(depositData)

const withdrawalData = hexToBytes('0x01...') // Withdrawal request data
const withdrawalRequest = createCLRequest(withdrawalData)

const consolidationData = hexToBytes('0x02...') // Consolidation request data
const consolidationRequest = createCLRequest(consolidationData)

// CLRequests must be sorted by type (Deposit=0, Withdrawal=1, Consolidation=2)
const requests = [depositRequest, withdrawalRequest, consolidationRequest]

// Generate the requestsHash
const requestsHash = genRequestsRoot(requests, sha256)

// Create a block with the CLRequests hash
const block = createBlock({ header: { requestsHash } }, { common })
console.log(`Created block with CLRequests hash: 0x${bytesToHex(block.hash())}`)
```

### Consensus Types

### Proof-of-Stake

By default (`Hardfork.Paris` (aka: Merge) and higher) blocks are created as Proof-of-Stake blocks. These blocks come with their own set of header field simplifications and associated validation rules. The difficulty is set to `0` since not relevant anymore, just to name an example. For a full list of changes see [EIP-3675](https://eips.ethereum.org/EIPS/eip-3675).

You can instantiate a Merge/PoS block like this:

```ts
// ./examples/pos.ts

import { createBlock } from '@ethereumjs/block'
import { Common, Mainnet } from '@ethereumjs/common'

const common = new Common({ chain: Mainnet })

const block = createBlock(
  {
    // Provide your block data here or use default values
  },
  { common },
)

console.log(`Proof-of-Stake (default) block created with hardfork=${block.common.hardfork()}`)
```

### Ethash/PoW

Blocks before the Merge or blocks on dedicated PoW chains are created as Proof-of-work blocks. An Ethash/PoW block can be instantiated as follows:

```ts
// ./examples/pow.ts

import { createBlock } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'

const common = new Common({ chain: Mainnet, hardfork: Hardfork.Chainstart })

console.log(common.consensusType()) // 'pow'
console.log(common.consensusAlgorithm()) // 'ethash'

createBlock({}, { common })
console.log(`Old Proof-of-Work block created`)
```

To calculate the difficulty when creating the block pass in the block option `calcDifficultyFromHeader` with the preceding (parent) `BlockHeader`.

### Clique/PoA

Clique is a standalone Proof-of-Authority protocol which had been in use for older Ethereum testnets (like e.g. the `Goerli` testnet). This library still supports Clique/PoA so that blocks from those testnets can still be read.

A clique block can be instantiated as follows:

```ts
// ./examples/clique.ts

import { createBlock } from '@ethereumjs/block'
import { Common, Goerli, Hardfork } from '@ethereumjs/common'

const common = new Common({ chain: Goerli, hardfork: Hardfork.Chainstart })

console.log(common.consensusType()) // 'poa'
console.log(common.consensusAlgorithm()) // 'clique'

createBlock({ header: { extraData: new Uint8Array(97) } }, { common })
console.log(`Old Clique Proof-of-Authority block created`)
```

For sealing a block on instantiation you can use the `cliqueSigner` constructor option:

```ts
const cliqueSigner = hexToBytes('PRIVATE_KEY_HEX_STRING')
const block = createSealedCliqueBlock(blockData, cliqueSigner)
```

See the API docs for detailed documentation on Clique/PoA related utility methods. Note that these methods will throw if called in a non-Clique/PoA context.

## Browser

We provide hybrid ESM/CJS builds for all our libraries. With the v10 breaking release round from Spring 2025, all libraries are "pure-JS" by default and we have eliminated all hard-wired WASM code. Additionally we have substantially lowered the bundle sizes, reduced the number of dependencies, and cut out all usages of Node.js specific primities (like the Node.js event emitter).

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


## Testing

Tests in the `tests` directory are partly outdated and testing is primarily done by running the `BlockchainTests` from within the [@ethereumjs/vm](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/vm) package.

To avoid bloating this repository with [ethereum/tests](https://github.com/ethereum/tests) JSON files, we usually copy specific JSON files and wrap them with some metadata (source, date, commit hash). There's a helper to aid in that process and can be found at [wrap-ethereum-test.sh](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/scripts/wrap-ethereum-test.sh).

## EthereumJS

See our organizational [documentation](https://ethereumjs.readthedocs.io) for an introduction to `EthereumJS` as well as information on current standards and best practices. If you want to join for work or carry out improvements on the libraries, please review our [contribution guidelines](https://ethereumjs.readthedocs.io/en/latest/contributing.html) first.

## License

[MPL-2.0](<https://tldrlegal.com/license/mozilla-public-license-2.0-(mpl-2)>)

[discord-badge]: https://img.shields.io/static/v1?logo=discord&label=discord&message=Join&color=blue
[discord-link]: https://discord.gg/TNwARpR
[block-npm-badge]: https://img.shields.io/npm/v/@ethereumjs/block.svg
[block-npm-link]: https://www.npmjs.com/package/@ethereumjs/block
[block-issues-badge]: https://img.shields.io/github/issues/ethereumjs/ethereumjs-monorepo/package:%20block?label=issues
[block-issues-link]: https://github.com/ethereumjs/ethereumjs-monorepo/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+block"
[block-actions-badge]: https://github.com/ethereumjs/ethereumjs-monorepo/workflows/Block/badge.svg
[block-actions-link]: https://github.com/ethereumjs/ethereumjs-monorepo/actions?query=workflow%3A%22Block%22
[block-coverage-badge]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/branch/master/graph/badge.svg?flag=block
[block-coverage-link]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/tree/master/packages/block
