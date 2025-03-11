# @ethereumjs/era

[![NPM Package][era-npm-badge]][era-npm-link]
[![GitHub Issues][era-issues-badge]][era-issues-link]
[![Actions Status][era-actions-badge]][era-actions-link]
[![Code Coverage][era-coverage-badge]][era-coverage-link]
[![Discord][discord-badge]][discord-link]

| A collection of utility functions for Ethereum. |
| ----------------------------------------------- |

## Installation

To obtain the latest version, simply require the project using `npm`:

```shell
npm install @ethereumjs/era
```

## Usage

All helpers are re-exported from the root level and deep imports are not necessary. So an import can be done like this:

```ts
import { formatEntry } from "@ethereumjs/era";
```

#### Export History as Era1

Export history in epochs of 8192 blocks as Era1 files

```ts
import { exportEpochAsEra1 } from "@ethereumjs/era";

const dataDir = PATH_TO_ETHEREUMJS_CLIENT_DB;
const epoch = 0;

// generates ${dataDir}/era1/epoch-0.era1
await exportEpochAsEra1(epoch, dataDir);
```

#### Read Era1 file

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
} from "@ethereumjs/era";

const era1File = readBinaryFile(PATH_TO_ERA1_FILE);

// validate era1 file
const isValid = validateERA1(era1File);

// read blocks from era1 file
const blocks = readERA1(era1File);

for await (const blockTuple of blocks) {
  const { header, body, receipts } = await parseBlockTuple(blockTuple);
  const block = blockFromTuple({ header, body });
  console.log(block.header.number);
}

// reconstruct epoch accumulator
const headerRecords = await getHeaderRecords(era1File);
const epochAccumulator = EpochAccumulator.encode(headerRecords);
const epochAccumulatorRoot = EpochAccumulator.merkleRoot(headerRecords);
```

## EthereumJS

See our organizational [documentation](https://ethereumjs.readthedocs.io) for an introduction to `EthereumJS` as well as information on current standards and best practices. If you want to join for work or carry out improvements on the libraries, please review our [contribution guidelines](https://ethereumjs.readthedocs.io/en/latest/contributing.html) first.

## License

[MPL-2.0](<https://tldrlegal.com/license/mozilla-public-license-2.0-(mpl-2)>)

[era-npm-badge]: https://img.shields.io/npm/v/@ethereumjs/era.svg
[era-npm-link]: https://www.npmjs.org/package/@ethereumjs/era
[era-issues-badge]: https://img.shields.io/github/issues/ethereumjs/ethereumjs-monorepo/package:%20era?label=issues
[era-issues-link]: https://github.com/ethereumjs/ethereumjs-monorepo/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+era"
[era-actions-badge]: https://github.com/ethereumjs/ethereumjs-monorepo/workflows/Era/badge.svg
[era-actions-link]: https://github.com/ethereumjs/ethereumjs-monorepo/actions?query=workflow%3A%22Era%22
[era-coverage-badge]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/branch/master/graph/badge.svg?flag=era
[era-coverage-link]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/tree/master/packages/era
[discord-badge]: https://img.shields.io/static/v1?logo=discord&label=discord&message=Join&color=blue
[discord-link]: https://discord.gg/TNwARpR
