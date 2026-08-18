# @ethereumjs/block `v10`

[![NPM Package][block-npm-badge]][block-npm-link]
[![GitHub Issues][block-issues-badge]][block-issues-link]
[![Actions Status][block-actions-badge]][block-actions-link]
[![Code Coverage][block-coverage-badge]][block-coverage-link]
[![Discord][discord-badge]][discord-link]

| Implements schema and functions related to Ethereum blocks. |
| ----------------------------------------------------------- |

- 🦄 All block features till **Osaka**
- 🌴 Tree-shakeable API
- 👷🏼 Controlled dependency set (4 external + `@noble` crypto)
- 🔮 `EIP-4844` Shard Blob Txs
- 🔮 `EIP-7594` PeerDAS Blob Transactions
- 💸 `EIP-4895` Beacon Chain Withdrawals
- 📨 `EIP-7685` Consensus Layer Requests
- 📋 `EIP-7928` Block Level Access List Hash (Amsterdam, experimental)
- 🕐 `EIP-7843` Slot Number header field (Amsterdam, experimental)
- 🛵 324KB bundle size (81KB gzipped)
- 🏄🏾‍♂️ WASM-free default + Fully browser ready

Runnable examples live in [`examples/`](./examples/).

## Table of Contents

- [Installation](#installation)
- [Getting Started](#getting-started)
- [Creating Blocks](#creating-blocks)
- [EIP-1559 Base Fee](#eip-1559-base-fee)
- [EIP-4895 Withdrawals](#eip-4895-withdrawals)
- [EIP-4844 Blob Blocks](#eip-4844-blob-blocks)
- [EIP-7685 CL Requests](#eip-7685-cl-requests)
- [EIP-7928 Block Access List Hash](#eip-7928-block-access-list-hash)
- [EIP-7843 Slot Number](#eip-7843-slot-number)
- [Consensus Types](#consensus-types)
- [Browser](#browser)
- [API](#api)
- [Testing](#testing)
- [EthereumJS](#ethereumjs)
- [License](#license)

## Installation

```shell
npm install @ethereumjs/block
```

**Note:** For `EIP-4844` blob blocks you need a KZG setup on `Common` — see [@ethereumjs/tx KZG setup](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/tx#kzg-setup).

## Getting Started

`Block` and `BlockHeader` objects are created via standalone factory functions (not `new Block()`). Properties are frozen by default (`freeze: false` to opt out).

```ts
// ./examples/createBlockHeader.ts

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

Main constructors:

| Factory | Purpose |
| --- | --- |
| `createBlock()` | Full block from `BlockData` |
| `createEmptyBlock()` | Block with header only |
| `createBlockFromRLP()` | Decode serialized block bytes |
| `createBlockFromRPC()` / `createBlockFromJSONRPCProvider()` | From JSON-RPC block object |
| `createBlockFromExecutionPayload()` / `createBlockFromBeaconPayloadJSON()` | From CL execution payload |
| `createBlockHeader()` | Header-only variants of the above |

Trie helpers: `genTransactionsTrieRoot()`, `genWithdrawalsTrieRoot()`, `genRequestsRoot()`.

## Creating Blocks

### With transactions

```ts
// ./examples/createBlockWithTxs.ts

import { createBlock, genTransactionsTrieRoot } from '@ethereumjs/block'
import { Common, Mainnet } from '@ethereumjs/common'
import { createFeeMarket1559Tx } from '@ethereumjs/tx'
import { bytesToHex, createAddressFromString, hexToBytes } from '@ethereumjs/util'

const main = async () => {
  const common = new Common({ chain: Mainnet })
  const privateKey = hexToBytes('0xe331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109')

  const tx = createFeeMarket1559Tx(
    {
      type: 2,
      nonce: 0n,
      gasLimit: 21_000n,
      maxFeePerGas: 100n,
      maxPriorityFeePerGas: 1n,
      to: createAddressFromString('0xcccccccccccccccccccccccccccccccccccccccc'),
      value: 1n,
    },
    { common },
  ).sign(privateKey)

  const block = createBlock({ transactions: [tx] }, { common, skipConsensusFormatValidation: true })
  const transactionsRoot = await genTransactionsTrieRoot(block.transactions)

  console.log(`Block with ${block.transactions.length} transaction(s)`)
  console.log(`Transactions root: ${bytesToHex(transactionsRoot)}`)
}

void main()
```

### RLP round-trip

```ts
// ./examples/blockFromRLP.ts

import { createBlock, createBlockFromRLP } from '@ethereumjs/block'
import { Common, Mainnet } from '@ethereumjs/common'
import { bytesToHex } from '@ethereumjs/util'

const common = new Common({ chain: Mainnet })

const block = createBlock(
  {
    header: {
      number: 1n,
      gasLimit: 30_000_000n,
    },
  },
  { common, skipConsensusFormatValidation: true },
)

const serialized = block.serialize()
const decoded = createBlockFromRLP(serialized, { common })

console.log(`Serialized ${serialized.length} bytes`)
console.log(`Round-trip hash match: ${bytesToHex(decoded.hash()) === bytesToHex(block.hash())}`)
```

Call `await block.validateData()` to run consensus and transaction checks. Use `skipConsensusFormatValidation: true` in examples and tests when header fields are intentionally incomplete.

## EIP-1559 Base Fee

Blocks created with default Mainnet `Common` are [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559) compatible. `BlockHeader.calcNextBaseFee()` computes the base fee for the child block.

```ts
// ./examples/1559.ts

import { createBlock } from '@ethereumjs/block'
import { Common, Mainnet } from '@ethereumjs/common'
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
  console.log(`Expected validation failure: ${(err as Error).message.split('\n')[0]}`)
}
```

## EIP-4895 Withdrawals

Shanghai+ blocks carry beacon-chain withdrawals. Provide `withdrawals` and a matching `withdrawalsRoot`:

```ts
// ./examples/withdrawals.ts

import { createBlock } from '@ethereumjs/block'
import { Common, Mainnet } from '@ethereumjs/common'
import { Address, hexToBytes } from '@ethereumjs/util'

import type { WithdrawalData } from '@ethereumjs/util'

const common = new Common({ chain: Mainnet })

const withdrawal: WithdrawalData = {
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

Validate the withdrawals trie with `await block.withdrawalsTrieIsValid()`.

## EIP-4844 Blob Blocks

Cancun+ blocks include `excessBlobGas` and `blobGasUsed`. Blob txs require KZG on `Common`:

```ts
// ./examples/eip4844Block.ts

import { createBlock } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createBlob4844Tx } from '@ethereumjs/tx'
import { createAddressFromPrivateKey } from '@ethereumjs/util'
import { randomBytes } from '@noble/hashes/utils.js'
import { trustedSetup } from '@paulmillr/trusted-setups/fast-peerdas.js'
import { KZG as microEthKZG } from 'micro-eth-signer/kzg.js'

const main = async () => {
  const kzg = new microEthKZG(trustedSetup)

  const common = new Common({
    chain: Mainnet,
    customCrypto: {
      kzg,
    },
    hardfork: Hardfork.Cancun,
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

Blob gas pricing from the header:

```ts
// ./examples/blobGasPrice.ts

import { createBlockHeader } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'

const common = new Common({ chain: Mainnet, hardfork: Hardfork.Cancun })
const header = createBlockHeader({ excessBlobGas: 1_000_000n }, { common })

console.log(`Blob gas price at excessBlobGas=1_000_000: ${header.getBlobGasPrice()}`)
```

## EIP-7685 CL Requests

Prague+ blocks carry a `requestsHash` over sorted consensus-layer requests. Use `genRequestsRoot()` and `@ethereumjs/util` request types:

```ts
// ./examples/clrequests.ts

import { createBlock, genRequestsRoot } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { bytesToHex, createCLRequest, hexToBytes } from '@ethereumjs/util'
import { sha256 } from '@noble/hashes/sha2.js'

const common = new Common({ chain: Mainnet, hardfork: Hardfork.Prague })

const depositData = hexToBytes(
  '0x00ac842878bb70009552a4cfcad801d6e659c50bd50d7d03306790cb455ce7363c5b6972f0159d170f625a99b2064dbefc010000000000000000000000818ccb1c4eda80270b04d6df822b1e72dd83c3030040597307000000a747f75c72d0cf0d2b52504c7385b516f0523e2f0842416399f42b4aee5c6384a5674f6426b1cc3d0827886fa9b909e616f5c9f61f986013ed2b9bf37071cbae951136265b549f44e3c8e26233c0433e9124b7fd0dc86e82f9fedfc0a179d7690000000000000000',
)
const withdrawalData = hexToBytes(
  '0x01000000000000000000000000000000000000000001000000000000000000000de0b6b3a7640000',
)
const consolidationData = hexToBytes('0x020000000100000000000000000000000000000000000001')

// Requests must be sorted by type (Deposit=0, Withdrawal=1, Consolidation=2)
const requests = [
  createCLRequest(depositData),
  createCLRequest(withdrawalData),
  createCLRequest(consolidationData),
]

const requestsHash = genRequestsRoot(requests, sha256)
const block = createBlock({ header: { requestsHash } }, { common })

console.log(`Created ${requests.length} CL requests`)
console.log(`requestsHash: ${bytesToHex(requestsHash)}`)
console.log(`Block hash: ${bytesToHex(block.hash())}`)
```

## EIP-7928 Block Access List Hash

See the [canonical Amsterdam overview](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/vm#amsterdam-hardfork-experimental) in `@ethereumjs/vm` for release ↔ spec tracking.

When [EIP-7928](https://eips.ethereum.org/EIPS/eip-7928) is active (`Hardfork.Amsterdam`, experimental), blocks carry a `blockAccessListHash` header field. Compute it with `@ethereumjs/util` or obtain it from `runBlock({ generate: true })` in the VM.

```ts
// ./examples/blockAccessListHash.ts

import { createBlock } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { bytesToHex, createBlockLevelAccessListFromJSON } from '@ethereumjs/util'

const main = () => {
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })

  const balJson = [
    {
      address: '0x0000000000000000000000000000000000000001',
      storageChanges: [],
      storageReads: [],
      balanceChanges: [{ blockAccessIndex: '0x01', postBalance: '0x03e8' }],
      nonceChanges: [],
      codeChanges: [],
    },
  ]

  const bal = createBlockLevelAccessListFromJSON(balJson)
  const block = createBlock(
    {
      header: {
        blockAccessListHash: bal.hash(),
      },
    },
    { common, skipConsensusFormatValidation: true },
  )

  console.log(`blockAccessListHash: ${bytesToHex(block.header.blockAccessListHash!)}`)
  console.log(`matches BAL hash: ${bytesToHex(bal.hash())}`)
  console.log(`hash length: ${block.header.blockAccessListHash!.length} bytes`)
}

void main()
```

## EIP-7843 Slot Number

When [EIP-7843](https://eips.ethereum.org/EIPS/eip-7843) is active (`Hardfork.Amsterdam`, experimental), blocks carry a `slotNumber` header field. Set it explicitly when constructing blocks — `runBlock({ generate: true })` does not populate it automatically.

```ts
// ./examples/blockSlotNumber.ts

import { createBlock } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'

const main = () => {
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })

  const block = createBlock(
    {
      header: {
        slotNumber: 42n,
      },
    },
    { common, skipConsensusFormatValidation: true },
  )

  console.log(`slotNumber: ${block.header.slotNumber}`)
}

void main()
```

## Consensus Types

### Proof-of-Stake (default)

Post-merge blocks (`Hardfork.Paris` and higher) use PoS header rules — difficulty `0`, no ommers, and related [EIP-3675](https://eips.ethereum.org/EIPS/eip-3675) changes:

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

### Ethash / PoW

Pre-merge or dedicated PoW chains:

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

Pass `calcDifficultyFromHeader` with the parent header to auto-compute difficulty.

### Clique / PoA

For historical PoA testnet blocks (e.g. Goerli). Use `createSealedCliqueBlock()` with a `cliqueSigner` key to seal on instantiation:

```ts
// ./examples/clique.ts

import { createBlock } from '@ethereumjs/block'
import { Common, Hardfork } from '@ethereumjs/common'
import { goerliChainConfig } from '@ethereumjs/testdata'

const common = new Common({ chain: goerliChainConfig, hardfork: Hardfork.Chainstart })

console.log(common.consensusType()) // 'poa'
console.log(common.consensusAlgorithm()) // 'clique'

createBlock({ header: { extraData: new Uint8Array(97) } }, { common })
console.log(`Old Clique Proof-of-Authority block created`)
```

Clique utility functions (`cliqueSigner`, `cliqueVerifySignature`, …) throw outside a PoA context.

## Browser

We provide hybrid ESM/CJS builds for all our libraries. With the v10 breaking release round from Spring 2025, all libraries are "pure-JS" by default and we have eliminated all hard-wired WASM code. Additionally we have substantially lowered the bundle sizes, reduced the number of dependencies, and cut out all usages of Node.js-specific primitives (like the Node.js event emitter).

It is easily possible to run a browser build of one of the EthereumJS libraries within a modern browser using the provided ESM build. For a setup example see [./examples/browser.html](./examples/browser.html).

## API

Generated TypeDoc [documentation](./docs/README.md).

Every `Block` / `BlockHeader` is built with a `Common` instance that determines the active hardfork, EIP set, and validation rules. See [@ethereumjs/common](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/common) for chain configuration.

WASM crypto backends can be plugged in via `Common.customCrypto` — see the [common README](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/common#custom-cryptography-wasm--kzg).

## Testing

Tests in the `tests` directory are partly outdated; primary coverage comes from `BlockchainTests` in [@ethereumjs/vm](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/vm).

To wrap [ethereum/tests](https://github.com/ethereum/tests) JSON fixtures locally, use [wrap-ethereum-test.sh](./scripts/wrap-ethereum-test.sh).

## EthereumJS

The `EthereumJS` GitHub organization and its repositories are managed by members of the former Ethereum Foundation JavaScript team and the broader Ethereum community. If you want to join for work or carry out improvements on the libraries see the [developer docs](../../DEVELOPER.md) for an overview of current standards and tools and review our [code of conduct](../../CODE_OF_CONDUCT.md).

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
