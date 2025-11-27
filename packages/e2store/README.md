# @ethereumjs/e2store `v10`

[![NPM Package][e2store-npm-badge]][e2store-npm-link]
[![GitHub Issues][e2store-issues-badge]][e2store-issues-link]
[![Actions Status][e2store-actions-badge]][e2store-actions-link]
[![Code Coverage][e2store-coverage-badge]][e2store-coverage-link]
[![Discord][discord-badge]][discord-link]

| A collection of utility functions for Ethereum data storage formats. |
| ------------------------------------------------------------------- |

> **\[CONSIDERED FOR DEPRECATION\]** This library is being considered for deprecation. If you find it useful, please let us know!

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
      - [E2HS Helper Functions](#e2hs-helper-functions)
    - [Era1](#era1)
      - [Export History as Era1](#export-history-as-era1)
      - [Read Era1 file](#read-era1-file)
      - [Validate Era1 file](#validate-era1-file)
      - [Era1 Helper Functions](#era1-helper-functions)
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
// ./examples/e2hs.ts#L30-L32

const tuples = readTuplesFromE2HS(e2hsFile)

const tuple = (await tuples.next()).value
```

#### Read E2HS Tuple at Index

```ts
// ./examples/e2hs.ts#L47-L49

const targetIndex = 1234
const tupleAtIndex = await readE2HSTupleAtIndex(e2hsFile, targetIndex)
console.log('tuple at index 1234', tupleAtIndex)
```

#### E2HS Helper Functions

`getBlockIndex` returns the index of the block in the e2hs file:
`readBlockIndex` returns the starting number and offsets of the blocks in the e2hs file:
```ts
// ./examples/e2hs.ts#L18-L28

const blockIndex = getBlockIndex(e2hsFile)
console.log('blockIndex', {
  type: blockIndex.type,
  count: blockIndex.count,
  recordStart: blockIndex.recordStart,
  data: blockIndex.data.length + ' bytes',
})

const { startingNumber, offsets } = readBlockIndex(blockIndex.data, blockIndex.count)
console.log('startingNumber', startingNumber)
console.log('offsets', offsets.length)
```

`decompressE2HSTuple` decompresses a block tuple:
`parseEH2SBlockTuple` parses a block tuple:

```ts
// ./examples/e2hs.ts#L35-L39

const decompressedTuple = await decompressE2HSTuple(tuple!)
console.log('decompressedTuple', decompressedTuple)

const parsedTuple = parseEH2SBlockTuple(decompressedTuple)
console.log('parsedTuple', parsedTuple)
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

#### Read Era1 file

`readERA1` returns an async iterator of block tuples (header + body + receipts + totalDifficulty):

```ts
// ./examples/era1.ts#L48-L50

const tuples = await readERA1(era1File)
const tupleEntry = await tuples.next()
console.log('tupleEntry', tupleEntry.value!)
```

#### Validate Era1 file

`validateERA1` validates the era1 file by reconstructing the epoch accumulator and validating the accumulator root:

```ts
// ./examples/era1.ts#L57-L59


const valid = await validateERA1(era1File)
console.log('valid', valid)
```

#### Era1 Helper Functions

`getBlockIndex` returns the index of the block in the era1 file:
`readBlockIndex` returns the starting number and offsets of the blocks in the era1 file:
`readOtherEntries` returns the accumulator root and other entries of the era1 file:
`getHeaderRecords` returns the header records of the era1 file:

```ts
// ./examples/era1.ts#L21-L45

const blockIndex = getBlockIndex(era1File)
console.log('blockIndex', {
  type: blockIndex.type,
  count: blockIndex.count,
  recordStart: blockIndex.recordStart,
  data: blockIndex.data.length + ' bytes',
})

const { startingNumber, offsets } = readBlockIndex(blockIndex.data, blockIndex.count)
console.log('startingNumber', startingNumber)
console.log('offsets', offsets.length)

const { accumulatorRoot, otherEntries } = await readOtherEntries(era1File)
console.log('accumulatorRoot', bytesToHex(accumulatorRoot))
console.log('otherEntries', otherEntries.length)

const headerRecords = await getHeaderRecords(era1File)
const epochAccumulator = EpochAccumulator.encode(headerRecords)
const epochAccumulatorRoot = EpochAccumulator.merkleRoot(headerRecords)

console.log('epochAccumulator', epochAccumulator.length + ' bytes')
console.log('epochAccumulatorRoot', bytesToHex(epochAccumulatorRoot))
console.log(
  'Reconstructed root matches encoded root',
  bytesToHex(epochAccumulatorRoot) === bytesToHex(accumulatorRoot),
```

`parseBlockTuple` parses a block tuple:
`blockFromTuple` converts a block tuple to a block:

```ts
// ./examples/era1.ts#L53-L58

console.log('parsed tuple', tuple)

const block = blockFromTuple(tuple)
console.log('block', block)

const valid = await validateERA1(era1File)
```

### Era

Era files are used to store beacon chain data, including beacon states and blocks. 

#### Read Era file

`readBeaconState` reads the beacon state from an era file:

```ts
// ./examples/era.ts#L18-L24

// Read beacon state from era file
const state = await readBeaconState(eraFile)
console.log('beaconState', {
  slot: state.slot,
  validators: state.validators.length,
})

```

`readBeaconBlock` reads a specific beacon block from an era file:

```ts
// ./examples/era.ts#L25-L30

// Read a specific beacon block
const block = await readBeaconBlock(eraFile, 0)
console.log('beaconBlock', {
  slot: block.message.slot,
  proposer_index: block.message.proposer_index,
})
```

`readBlocksFromEra` returns an async iterator of beacon blocks:

```ts
// ./examples/era.ts#L32-L37

// Read blocks from era file
const blocks = readBlocksFromEra(eraFile)

const firstBlock = (await blocks.next()).value!

console.log(`Block`, firstBlock)
```

`readSlotIndex` reads the slot index from an era file:
```ts
// ./examples/era.ts#L10-L16

// Read slot index from era file
const slotIndex = readSlotIndex(eraFile)
console.log('slotIndex', {
  startSlot: slotIndex.startSlot,
  recordStart: slotIndex.recordStart,
  slotOffsets: slotIndex.slotOffsets.length + ' slots',
})
```

## Common Use Cases

1. **Historical Data Access**: Use E2HS and Era1 formats to efficiently access historical blockchain data
2. **Beacon Chain Analysis**: Read and analyze beacon chain states and blocks using Era files
3. **Data Export**: Export historical data in standardized formats for analysis or archival
4. **Portal History Network**: Bootstrap a Portal History Network DB using E2HS
5. **Execution Client Sync**: Sync an execution client without devp2p using Era1 or E2HS files

## EthereumJS

The `EthereumJS` GitHub organization and its repositories are managed by members of the former Ethereum Foundation JavaScript team and the broader Ethereum community. If you want to join for work or carry out improvements on the libraries see the [developer docs](../../DEVELOPER.md) for an overview of current standards and tools and review our [code of conduct](../../CODE_OF_CONDUCT.md).

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
