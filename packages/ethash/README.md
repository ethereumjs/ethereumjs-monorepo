# @ethereumjs/ethash `v10`

[![NPM Package][ethash-npm-badge]][ethash-npm-link]
[![GitHub Issues][ethash-issues-badge]][ethash-issues-link]
[![Actions Status][ethash-actions-badge]][ethash-actions-link]
[![Code Coverage][ethash-coverage-badge]][ethash-coverage-link]
[![Discord][discord-badge]][discord-link]

| [Ethash](https://github.com/ethereum/wiki/wiki/Ethash) implementation in TypeScript. |
| ------------------------------------------------------------------------------------ |

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [EthereumJS](#ethereumjs)
- [License](#license)

## Installation

To obtain the latest version, simply require the project using `npm`:

```shell
npm install @ethereumjs/ethash
```

## Usage

### PoW Validation

```ts
// ./examples/powBlock.ts

import { createBlockFromRLP } from '@ethereumjs/block'
import { Ethash } from '@ethereumjs/ethash'
import { MapDB, hexToBytes } from '@ethereumjs/util'

import type { DBObject } from '@ethereumjs/util'

const cacheDB = new MapDB<number, DBObject>()

const ethash = new Ethash(cacheDB)
const validblockRlp =
  '0xf90667f905fba0a8d5b7a4793baaede98b5236954f634a0051842df6a252f6a80492fd888678bda01dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347948888f1f195afa192cfee860698584c030f4c9db1a0f93c8db1e931daa2e22e39b5d2da6fb4074e3d544094857608536155e3521bc1a0bb7495628f9160ddbcf6354380ee32c300d594e833caec3a428041a66e7bade1a0c7778a7376099ee2e5c455791c1885b5c361b95713fddcbe32d97fd01334d296b90100000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000000000008000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000400000000000000000000000000000000000000000000000000000008302000001832fefd882560b84559c17b9b9040001020304050607080910111213141516171819202122232410000000000000000000200000000000000000003000000000000000000040000000000000000000500000000000000000006000000000000000000070000000000000000000800000000000000000009000000000000000000010000000000000000000100000000000000000002000000000000000000030000000000000000000400000000000000000005000000000000000000060000000000000000000700000000000000000008000000000000000000090000000000000000000100000000000000000001000000000000000000020000000000000000000300000000000000000004000000000000000000050000000000000000000600000000000000000007000000000000000000080000000000000000000900000000000000000001000000000000000000010000000000000000000200000000000000000003000000000000000000040000000000000000000500000000000000000006000000000000000000070000000000000000000800000000000000000009000000000000000000010000000000000000000100000000000000000002000000000000000000030000000000000000000400000000000000000005000000000000000000060000000000000000000700000000000000000008000000000000000000090000000000000000000100000000000000000001000000000000000000020000000000000000000300000000000000000004000000000000000000050000000000000000000600000000000000000007000000000000000000080000000000000000000900000000000000000001000000000000000000010000000000000000000200000000000000000003000000000000000000040000000000000000000500000000000000000006000000000000000000070000000000000000000800000000000000000009000000000000000000010000000000000000000100000000000000000002000000000000000000030000000000000000000400000000000000000005000000000000000000060000000000000000000700000000000000000008000000000000000000090000000000000000000100000000000000000001000000000000000000020000000000000000000300000000000000000004000000000000000000050000000000000000000600000000000000000007000000000000000000080000000000000000000900000000000000000001000000000000000000010000000000000000000200000000000000000003000000000000000000040000000000000000000500000000000000000006000000000000000000070000000000000000000800000000000000000009000000000000000000010000000000000000000a09c7b47112a3afb385c12924bf6280d273c106eea7caeaf5131d8776f61056c148876ae05d46b58d1fff866f864800a82c35094095e7baea6a6c7c4c2dfeb977efac326af552d8785012a05f200801ba01d2c92cfaeb04e53acdff2b5d42005ff6aacdb0105e64eb8c30c273f445d2782a01e7d50ffce57840360c57d94977b8cdebde614da23e8d1e77dc07928763cfe21c0'

const validBlock = createBlockFromRLP(hexToBytes(validblockRlp), {
  setHardfork: true,
  skipConsensusFormatValidation: true,
})

const result = await ethash.verifyPOW(validBlock)
console.log(result) // => true
```

### PoW Ethash CPU Miner

There is a simple CPU miner included within `Ethash` package which can be used for testing purposes.

See the following example on how to use the new `Miner` class:

```ts
// ./examples/miner.ts

import { createBlock } from '@ethereumjs/block'
import { Ethash } from '@ethereumjs/ethash'
import { MapDB, bytesToHex } from '@ethereumjs/util'

import type { DBObject } from '@ethereumjs/util'

const block = createBlock(
  {
    header: {
      difficulty: BigInt(100),
      number: BigInt(1),
    },
  },
  { setHardfork: true, skipConsensusFormatValidation: true },
)

const cacheDB = new MapDB<number, DBObject>()

const e = new Ethash(cacheDB)
const miner = e.getMiner(block.header)
const solution = await miner.iterate(-1) // iterate until solution is found
console.log(bytesToHex(solution!.mixHash)) // 0x892177e7bbb1f31ade0610707c96c6bf86e1415b26073d17b2da2dbd2daefd1e
```

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

## EthereumJS

See our organizational [documentation](https://ethereumjs.readthedocs.io) for an introduction to `EthereumJS` as well as information on current standards and best practices. If you want to join for work or carry out improvements on the libraries, please review our [contribution guidelines](https://ethereumjs.readthedocs.io/en/latest/contributing.html) first.

## License

[MPL-2.0](<https://tldrlegal.com/license/mozilla-public-license-2.0-(mpl-2)>)

[discord-badge]: https://img.shields.io/static/v1?logo=discord&label=discord&message=Join&color=blue
[discord-link]: https://discord.gg/TNwARpR
[ethash-npm-badge]: https://img.shields.io/npm/v/@ethereumjs/ethash.svg
[ethash-npm-link]: https://www.npmjs.org/package/@ethereumjs/ethash
[ethash-issues-badge]: https://img.shields.io/github/issues/ethereumjs/ethereumjs-monorepo/package:%20ethash?label=issues
[ethash-issues-link]: https://github.com/ethereumjs/ethereumjs-monorepo/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+ethash"
[ethash-actions-badge]: https://github.com/ethereumjs/ethereumjs-monorepo/actions/workflows/static-build.yml/badge.svg
[ethash-actions-link]: https://github.com/ethereumjs/ethereumjs-monorepo/actions?query=workflow%3A%22Ethash%22
[ethash-coverage-badge]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/branch/master/graph/badge.svg?flag=ethash
[ethash-coverage-link]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/tree/master/packages/ethash
