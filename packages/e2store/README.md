# @ethereumjs/e2store `v10`

[![NPM Package][e2store-npm-badge]][e2store-npm-link]
[![GitHub Issues][e2store-issues-badge]][e2store-issues-link]
[![Actions Status][e2store-actions-badge]][e2store-actions-link]
[![Code Coverage][e2store-coverage-badge]][e2store-coverage-link]
[![Discord][discord-badge]][discord-link]

| A collection of utility functions for Ethereum data storage formats. |
| ------------------------------------------------------------------- |

`@ethereumjs/e2store` provides utilities for working with Ethereum data storage formats, including E2HS, Era1, and Era files. These formats are commonly used for storing historical blockchain data, beacon states, and block data in an efficient, provable, and standardized way.

## Table of Contents

- [@ethereumjs/e2store `v10`](#ethereumjse2store-v10)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
    - [E2HS](#e2hs)
      - [Format E2HS](#format-e2hs)
      - [Read Tuples from E2HS](#read-tuples-from-e2hs)
      - [Read E2HS Tuple at Index](#read-e2hs-tuple-at-index)
    - [Era1](#era1)
      - [Export History as Era1](#export-history-as-era1)
    - [Read Era1 file](#read-era1-file)
    - [Era](#era)
      - [Read Era file](#read-era-file)
  - [Common Use Cases](#common-use-cases)
  - [EthereumJS](#ethereumjs)
  - [License](#license)

## Installation

To obtain the latest version, simply require the project using `npm`:

```shell
npm install @ethereumjs/e2store
```

## Usage

All helpers are re-exported from the root level and deep imports are not necessary. So an import can be done like this:

```ts
import { formatEntry } from "@ethereumjs/e2store"
```

### E2HS

E2HS is a format for storing historical blockchain data along with proofs. It provides efficient access to block headers, bodies, and receipts, and can be used to bootstrap a Portal History Network DB.

#### Format E2HS

```ts
import { formatE2HS } from "@ethereumjs/e2store"

// Format data into E2HS format
// data is an array of block tuple data and an epoch index
const e2hs = await formatE2HS(data)
```

#### Read Tuples from E2HS

```ts
import { readTuplesFromE2HS, parseEH2SBlockTuple } from "@ethereumjs/e2store"

// Read all tuples from an E2HS file
const tuples = await readTuplesFromE2HS(filePath)
for await (const tuple of tuples) {
  const { headerWithProof, body, receipts } = parseEH2SBlockTuple(tuple)
  console.log(headerWithProof)
  console.log(body)
  console.log(receipts)
}
```

#### Read E2HS Tuple at Index

```ts
import { readE2HSTupleAtIndex, parseEH2SBlockTuple } from "@ethereumjs/e2store"

// Read a specific tuple by index
const tuple = await readE2HSTupleAtIndex(filePath, index)
const { headerWithProof, body, receipts } = parseEH2SBlockTuple(tuple)
console.log(headerWithProof)
console.log(body)
console.log(receipts)
```

### Era1

Era1 files store historical data in epochs of 8192 blocks, making it efficient to access large ranges of historical data.  Era1 block tuples contain a header, body, receipts, and total difficulty.  The data can be verified by reconstructing the epoch accumulator, and validating again the accumulator root, also contained in the era1 file.

#### Export History as Era1

Export history from an EthereumJS client DB in epochs of 8192 blocks as Era1 files:

```ts
import { exportEpochAsEra1 } from "@ethereumjs/e2store"

const dataDir = PATH_TO_ETHEREUMJS_CLIENT_DB
const epoch = 0

// Generates ${dataDir}/era1/epoch-0.era1
await exportEpochAsEra1(epoch, dataDir)
```

### Read Era1 file

`readERA1` returns an async iterator of block tuples (header + body + receipts + totalDifficulty):

```ts
import {
  readBinaryFile,
  validateERA1,
  readERA1,
  parseBlockTuple,
  blockFromTuple,
  getHeaderRecords,
  EpochAccumulator,
} from "@ethereumjs/e2store"

const era1File = readBinaryFile(PATH_TO_ERA1_FILE)

// Validate era1 file
// Rebuilds epoch accumulator and validates the accumulator root
const isValid = validateERA1(era1File)
if (!isValid) {
  throw new Error('Invalid Era1 file')
}

// Read blocks from era1 file
const blocks = readERA1(era1File)

for await (const blockTuple of blocks) {
  const { header, body, receipts } = await parseBlockTuple(blockTuple)
  const block = blockFromTuple({ header, body })
  console.log(`Block number: ${block.header.number}`)
}

// Reconstruct epoch accumulator
const headerRecords = await getHeaderRecords(era1File)
const epochAccumulator = EpochAccumulator.encode(headerRecords)
const epochAccumulatorRoot = EpochAccumulator.merkleRoot(headerRecords)
```

### Era

Era files are used to store beacon chain data, including beacon states and blocks.

#### Read Era file

```ts
import { readBeaconState, readBlocksFromEra } from "@ethereumjs/e2store"

const eraFile = readBinaryFile(PATH_TO_ERA_FILE)

// Extract BeaconState
const state = await readBeaconState(eraFile)
console.log(`Current slot: ${state.slot}`)

// Read Beacon Blocks from era file
let count = 0
for await (const block of readBlocksFromEra(eraFile)) {
  console.log(`Block slot: ${block.message.slot}`)
  count++
  if (count > 10) break
}
```

## Common Use Cases

1. **Historical Data Access**: Use E2HS and Era1 formats to efficiently access historical blockchain data
2. **Beacon Chain Analysis**: Read and analyze beacon chain states and blocks using Era files
3. **Data Export**: Export historical data in standardized formats for analysis or archival
4. **Portal History Network**: Bootstrap a Portal History Network DB using E2HS
5. **Execution Client Sync**: Sync an execution client without devp2p using Era1 or E2HS files

## EthereumJS

See our organizational [documentation](https://ethereumjs.readthedocs.io) for an introduction to `EthereumJS` as well as information on current standards and best practices. If you want to join for work or carry out improvements on the libraries, please review our [contribution guidelines](https://ethereumjs.readthedocs.io/en/latest/contributing.html) first.

## License

[MPL-2.0](<https://tldrlegal.com/license/mozilla-public-license-2.0-(mpl-2)>)

[e2store-npm-badge]: https://img.shields.io/npm/v/@ethereumjs/e2store.svg
[e2store-npm-link]: https://www.npmjs.org/package/@ethereumjs/e2store
[e2store-issues-badge]: https://img.shields.io/github/issues/ethereumjs/ethereumjs-monorepo/package:%20e2store?label=issues
[e2store-issues-link]: https://github.com/ethereumjs/ethereumjs-monorepo/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+e2store"
[e2store-actions-badge]: https://github.com/ethereumjs/ethereumjs-monorepo/workflows/E2Store/badge.svg
[e2store-actions-link]: https://github.com/ethereumjs/ethereumjs-monorepo/actions?query=workflow%3A%22E2Store%22
[e2store-coverage-badge]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/branch/master/graph/badge.svg?flag=e2store
[e2store-coverage-link]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/tree/master/packages/e2store
[discord-badge]: https://img.shields.io/static/v1?logo=discord&label=discord&message=Join&color=blue
[discord-link]: https://discord.gg/TNwARpR
