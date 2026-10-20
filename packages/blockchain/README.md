# @ethereumjs/blockchain `v10`

[![NPM Package][blockchain-npm-badge]][blockchain-npm-link]
[![GitHub Issues][blockchain-issues-badge]][blockchain-issues-link]
[![Actions Status][blockchain-actions-badge]][blockchain-actions-link]
[![Code Coverage][blockchain-coverage-badge]][blockchain-coverage-link]
[![Discord][discord-badge]][discord-link]

| A module to store and interact with blocks. |
| ------------------------------------------- |

Stores a sequential chain of [@ethereumjs/block](../block) blocks, tracks the canonical head, and supports reorgs via `putBlock()`. Used by `@ethereumjs/client` and `@ethereumjs/vm`.

Runnable examples live in [`examples/`](./examples/).

## Table of Contents

- [Installation](#installation)
- [Getting Started](#getting-started)
- [Block Lookup](#block-lookup)
- [Chain Iteration](#chain-iteration)
- [Hardfork by Head](#hardfork-by-head)
- [Custom Genesis](#custom-genesis)
- [Consensus Types](#consensus-types)
- [Supported Block Features](#supported-block-features)
- [Events and Debugging](#events-and-debugging)
- [Browser](#browser)
- [API](#api)
- [EthereumJS](#ethereumjs)
- [License](#license)

## Installation

```shell
npm install @ethereumjs/blockchain
```

## Getting Started

Use `createBlockchain()` — it awaits async initialization (genesis setup, consensus wiring):

```ts
import { createBlockchain } from '@ethereumjs/blockchain'
import { Common, Mainnet } from '@ethereumjs/common'

const common = new Common({ chain: Mainnet })
const blockchain = await createBlockchain({ common })
console.log(`Genesis hash: ${blockchain.genesisBlock.hash()}`)
```

Main constructors: `createBlockchain()`, `createBlockchainFromBlocksData()`.

Pass `validateBlocks: false` / `validateConsensus: false` in examples and tests when blocks are intentionally incomplete.

## Block Lookup

Retrieve blocks by number or hash after adding them with `putBlock()`:

```ts
// ./examples/getBlock.ts

import { createBlock } from '@ethereumjs/block'
import { createBlockchain } from '@ethereumjs/blockchain'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { bytesToHex } from '@ethereumjs/util'

const main = async () => {
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Prague })
  const blockchain = await createBlockchain({
    validateBlocks: false,
    validateConsensus: false,
    common,
  })

  const block1 = createBlock(
    {
      header: {
        number: 1n,
        parentHash: blockchain.genesisBlock.hash(),
        difficulty: blockchain.genesisBlock.header.difficulty + 1n,
      },
    },
    { common, setHardfork: true },
  )
  const block2 = createBlock(
    {
      header: {
        number: 2n,
        parentHash: block1.header.hash(),
        difficulty: block1.header.difficulty + 1n,
      },
    },
    { common, setHardfork: true },
  )
  await blockchain.putBlock(block1)
  await blockchain.putBlock(block2)

  const byNumber = await blockchain.getBlock(2n)
  const byHash = await blockchain.getBlock(block2.hash())

  console.log(`Block ${byNumber.header.number} hash: ${bytesToHex(byNumber.hash())}`)
  console.log(`Lookup by hash matches: ${bytesToHex(byHash.hash()) === bytesToHex(block2.hash())}`)
}

void main()
```

Also: `getBlocks()`, `getIteratorHead()`, `getLatestHeader()`.

## Chain Iteration

Walk the canonical chain with `iterator()`:

```ts
// ./examples/iterateChain.ts

import { createBlock } from '@ethereumjs/block'
import { createBlockchain } from '@ethereumjs/blockchain'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { bytesToHex } from '@ethereumjs/util'

const main = async () => {
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Prague })
  const blockchain = await createBlockchain({
    validateBlocks: false,
    validateConsensus: false,
    common,
  })

  const block = createBlock(
    {
      header: {
        number: 1n,
        parentHash: blockchain.genesisBlock.hash(),
        difficulty: blockchain.genesisBlock.header.difficulty + 1n,
      },
    },
    { common, setHardfork: true },
  )
  const block2 = createBlock(
    {
      header: {
        number: 2n,
        parentHash: block.header.hash(),
        difficulty: block.header.difficulty + 1n,
      },
    },
    { common, setHardfork: true },
  )
  await blockchain.putBlock(block)
  await blockchain.putBlock(block2)

  await blockchain.iterator('i', (block) => {
    const blockNumber = block.header.number.toString()
    const blockHash = bytesToHex(block.hash())
    console.log(`Block ${blockNumber}: ${blockHash}`)
  })
}
void main()
```

## Hardfork by Head

Pin `Common` hardfork to the current head block number on init:

```ts
// ./examples/hardforkByHead.ts

import { createBlockchain } from '@ethereumjs/blockchain'
import { Common, Mainnet } from '@ethereumjs/common'

const main = async () => {
  const common = new Common({ chain: Mainnet })
  await createBlockchain({ common, hardforkByHeadBlockNumber: true })
  console.log(`Hardfork at genesis head: ${common.hardfork()}`)
}

void main()
```

## Custom Genesis

Build a chain from a Geth genesis JSON file:

```ts
// ./examples/gethGenesis.ts

import { createBlockchain } from '@ethereumjs/blockchain'
import { createCommonFromGethGenesis, parseGethGenesisState } from '@ethereumjs/common'
import { postMergeGethGenesis } from '@ethereumjs/testdata'
import { bytesToHex } from '@ethereumjs/util'

const main = async () => {
  const common = createCommonFromGethGenesis(postMergeGethGenesis, { chain: 'customChain' })
  const genesisState = parseGethGenesisState(postMergeGethGenesis)
  const blockchain = await createBlockchain({
    genesisState,
    common,
  })
  const genesisBlockHash = blockchain.genesisBlock.hash()
  common.setForkHashes(genesisBlockHash)
  console.log(
    `Genesis hash from geth genesis parameters - ${bytesToHex(blockchain.genesisBlock.hash())}`,
  )
}

void main()
```

Built-in network genesis state lives in [@ethereumjs/genesis](../genesis). Access the genesis block via `blockchain.genesisBlock`.

## Consensus Types

| Algorithm | Class | Notes |
| --- | --- | --- |
| PoS (default post-merge) | `CasperConsensus` | Difficulty `0`, beacon client does validation |
| PoW (pre-merge) | `EthashConsensus` | Ethash difficulty rules |
| PoA (historical testnets) | `CliqueConsensus` | Goerli-style signer voting |

Clique example:

```ts
// ./examples/clique.ts

import { CliqueConsensus, createBlockchain } from '@ethereumjs/blockchain'
import { Common, ConsensusAlgorithm, Hardfork } from '@ethereumjs/common'
import { goerliChainConfig } from '@ethereumjs/testdata'

import type { ConsensusDict } from '@ethereumjs/blockchain'

const main = async () => {
  const common = new Common({ chain: goerliChainConfig, hardfork: Hardfork.London })

  const consensusDict: ConsensusDict = {}
  consensusDict[ConsensusAlgorithm.Clique] = new CliqueConsensus()
  const blockchain = await createBlockchain({
    consensusDict,
    common,
  })
  console.log(`Created blockchain with ${blockchain.consensus!.algorithm} consensus algorithm`)
}

void main()
```

Custom consensus: implement the `Consensus` interface and pass via `consensusDict` or `consensus` option. See [customConsensus.spec.ts](./test/customConsensus.spec.ts).

### Storage

Default DB is in-memory `MapDB`. For persistence, pass a `DB`-conforming backend (see [@ethereumjs/client level wrapper](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/execution/level.ts)).

## Supported Block Features

- **EIP-1559** — base fee blocks (default post-London)
- **EIP-4844** — blob txs (requires KZG on `Common`, see [@ethereumjs/tx](../tx#kzg-setup))
- **EIP-7685** — CL requests in block headers
- **EIP-4895** — withdrawals

## Events and Debugging

`blockchain.events` emits `deletedCanonicalBlocks` on reorgs.

Debug loggers: `blockchain:#`, `blockchain:clique`, `blockchain:ethash`. Enable with `DEBUG=ethjs,blockchain:clique`.

## Browser

Hybrid ESM/CJS builds are provided. See [./examples/browser.html](./examples/browser.html).

## API

Generated TypeDoc [documentation](./docs/README.md).

## EthereumJS

The `EthereumJS` GitHub organization and its repositories are managed by members of the former Ethereum Foundation JavaScript team and the broader Ethereum community. If you want to join for work or carry out improvements on the libraries see the [developer docs](../../DEVELOPER.md) for an overview of current standards and tools and review our [code of conduct](../../CODE_OF_CONDUCT.md).

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
