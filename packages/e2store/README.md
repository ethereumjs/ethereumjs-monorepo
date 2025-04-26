# @ethereumjs/e2store `v10`

[![NPM Package][e2store-npm-badge]][e2store-npm-link]
[![GitHub Issues][e2store-issues-badge]][e2store-issues-link]
[![Actions Status][e2store-actions-badge]][e2store-actions-link]
[![Code Coverage][e2store-coverage-badge]][e2store-coverage-link]
[![Discord][discord-badge]][discord-link]

| A collection of utility functions for Ethereum. |
| ----------------------------------------------- |

## Table of Contents

- [@ethereumjs/e2store `v10`](#ethereumjse2store-v10)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Export History as Era1](#export-history-as-era1)
    - [Read Era1 file](#read-era1-file)
    - [Read Era file](#read-era-file)
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

### Export History as Era1

Export history in epochs of 8192 blocks as Era1 files

```ts
import { exportEpochAsEra1 } from "@ethereumjs/e2store"

const dataDir = PATH_TO_ETHEREUMJS_CLIENT_DB
const epoch = 0

// generates ${dataDir}/era1/epoch-0.era1
await exportEpochAsEra1(epoch, dataDir)
```

### Read Era1 file

`readERA1` returns an async iterator of block tuples (header + body + receipts + totalDifficulty)

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

// validate era1 file
const isValid = validateERA1(era1File)

// read blocks from era1 file
const blocks = readERA1(era1File)

for await (const blockTuple of blocks) {
  const { header, body, receipts } = await parseBlockTuple(blockTuple)
  const block = blockFromTuple({ header, body })
  console.log(block.header.number)
}

// reconstruct epoch accumulator
const headerRecords = await getHeaderRecords(era1File)
const epochAccumulator = EpochAccumulator.encode(headerRecords)
const epochAccumulatorRoot = EpochAccumulator.merkleRoot(headerRecords)
```

### Read Era file

```ts
import { readBeaconState } from "@ethereumjs/e2store"

const eraFile = readBinaryFile(PATH_TO_ERA_FILE)

// Extract BeaconState
const state = await readBeaconState(eraFile)
console.log(state.slot)

// Read Beacon Blocks from era file
let count = 0
for await (const block of readBlocksFromEra(eraFile)) {
  console.log(block.message.slot)
  count++
  if (count > 10) break
}
```

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
