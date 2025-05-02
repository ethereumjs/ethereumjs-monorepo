# @ethereumjs/verkle `v10` (EXPERIMENTAL)

[![NPM Package][verkle-npm-badge]][verkle-npm-link]
[![GitHub Issues][verkle-issues-badge]][verkle-issues-link]
[![Actions Status][verkle-actions-badge]][verkle-actions-link]
[![Code Coverage][verkle-coverage-badge]][verkle-coverage-link]
[![Discord][discord-badge]][discord-link]

| Implementation of [Verkle Trees](https://ethereum.org/en/roadmap/verkle-trees/) as specified in [EIP-6800](https://eips.ethereum.org/EIPS/eip-6800) |
| --------------------------------------------------------------------------------------------------------------------------------------------------- |

> Verkle trees are a cryptographic data structure proposed for use in Ethereum to optimize storage and transaction verification. They combine features of Merkle Patricia Tries and Vector Commitment Trees to offer efficient data verification with smaller proof sizes. The goal is to improve scalability and efficiency in Ethereum's network operations.

**Note:** This library is in an **experimental** stage and should not be used in production!

## Table of Contents

- [Installation](#installation)
- [Getting Started](#getting-started)
- [Proofs](#proofs)
- [Browser](#browser)
- [API](#api)
- [Debugging](#debugging)
- [References](#references)
- [EthereumJS](#ethereumjs)
- [License](#license)

## Installation

To obtain the latest version, simply require the project using `npm`:

```shell
npm install @ethereumjs/verkle
```

## Getting Started

### Initialization

To initialize a verkle tree, we provide an async constructor `createVerkleTree` which returns a `VerkleTree` instance that is properly initialized with the required `VerkleCrypto` package that implements the necessary cryptographic primitives used by Verkle trees.

```ts
// ./examples/simple.ts#L7-L7

const tree = await createVerkleTree()
```

Note, the current `VerkleCrypto` library we use internally is [`verkle-cryptography-wasm`](https://github.com/ethereumjs/verkle-cryptography-wasm) which is a WASM compilation of the [`rust-verkle`](https://github.com/crate-crypto/rust-verkle) library with some Javascript specific wrappers and helper methods.

If you prefer to instantiate the verkle tree class directly, you can do so by passing in an already instantiated `VerkleCrypto` object and then initializing the root node manually.

```ts
// ./examples/diyVerkle.ts

import { MapDB, bytesToHex } from '@ethereumjs/util'
import { VerkleTree } from '@ethereumjs/verkle'
import * as verkle from 'micro-eth-signer/verkle'

const main = async () => {
  const tree = new VerkleTree({
    cacheSize: 0,
    db: new MapDB<Uint8Array, Uint8Array>(),
    useRootPersistence: false,
    verkleCrypto: verkle,
  })
  await tree.createRootNode()
  console.log(bytesToHex(tree.root())) // 0x0000000000000000000000000000000000000000000000000000000000000000
}

void main()

```

### Getting and Putting Values

Values are stored using a combination of a `stem` obtained through the `getVerkleStem` function exposed by `@ethereumjs/util`. In the context of Ethereum, to retrieve the data associated with an account at a particular address, we would first compute the verkle stem of that address (`getVerkleStem(verkleCrypto, address)`), and then get the particular pieces of data we're interested in by suffixing the stem with the suffixes corresponding to that data.

Following the design goal of verkle trees of allowing efficient reads and writes of multiple values that are "close" to each other, the `get` and `put` methods take a stem as a first argument and then an array of "suffixes" (the 32nd byte) of the key used to access a value.

#### Getting values

When retrieving values given a stem `0xc5e561a64a0f52c2d038d827293b3deab99a886d41cc0667c938946dcad853` and suffixes `[0, 1]`, the `get` method would access the values stored at `0x781f1e4238f9de8b4d0ede9932f5a4d08f15dae70000` and `0x781f1e4238f9de8b4d0ede9932f5a4d08f15dae70001`.

#### Putting values

When storing values given a stem `0xc5e561a64a0f52c2d038d827293b3deab99a886d41cc0667c938946dcad853`, suffixes `[0, 1]`, and values `['test', 'test2']`, the `put` method would store the values at `0xc5e561a64a0f52c2d038d827293b3deab99a886d41cc0667c938946dcad85300` and `0xc5e561a64a0f52c2d038d827293b3deab99a886d41cc0667c938946dcad85301`.

See below for a complete example.

```ts
// ./examples/simple.ts

import { bytesToUtf8, createAddressFromString, getVerkleStem, utf8ToBytes } from '@ethereumjs/util'
import { createVerkleTree } from '@ethereumjs/verkle'

async function test() {
  const addrHex = '0x781f1e4238f9de8b4d0ede9932f5a4d08f15dae7'
  const address = createAddressFromString(addrHex)
  const tree = await createVerkleTree()
  const stem = getVerkleStem(tree['verkleCrypto'], address)
  await tree.put(stem, [0], [utf8ToBytes('test')])
  const value = await tree.get(stem, [0, 1])
  console.log(value[0] ? bytesToUtf8(value[0]) : 'not found') // 'test'
  console.log(value[1] ? bytesToUtf8(value[1]) : 'not found') // 'not found'
}

void test()
```

## Proofs

### Verkle Proofs

The EthereumJS Verkle package is still in development and verkle proof generation is not yet supported.

## Browser

We provide hybrid ESM/CJS builds for all our libraries. With the v10 breaking release round from Spring 2025, all libraries are "pure-JS" by default and we have eliminated all hard-wired WASM code. Additionally we have substantially lowered the bundle sizes, reduced the number of dependencies, and cut out all usages of Node.js-specific primitives (like the Node.js event emitter).

It is easily possible to run a browser build of one of the EthereumJS libraries within a modern browser using the provided ESM build. For a setup example see [./examples/browser.html](./examples/browser.html).

## API

### Docs

Generated TypeDoc API [Documentation](./docs/README.md)

### Hybrid CJS/ESM Builds

The verkle package is shipped with both CommonJS and ESM builds.

If you use an ESM `import` in your code, import as below:

```ts
import { createVerkleTree } from '@ethereumjs/verkle'
```

If you use Node.js-specific `require`, the CJS build will be used:

```ts
const { createVerkleTree } = require('@ethereumjs/verkle')
```

## Debugging

This library uses the [debug](https://github.com/visionmedia/debug) debugging utility package.

The `Verkle` class features optional debug logging. Individual debug selections can be activated on the CL with `DEBUG=ethjs,[Logger Selection]`.

The following options are available:

| Logger               | Description                          |
| -------------------- | ------------------------------------ |
| `verkle:#`           | a core verkle operation has occurred |
| `verkle:#:put`       | a verkle put operation has occurred  |
| `verkle:#:get`       | a verkle get operation has occurred  |
| `verkle:#:del`       | a verkle del operation has occurred  |
| `verkle:#:find_path` | a node is being searched for         |

To observe the logging in action at different levels:

Run with minimal logging:

```shell
DEBUG=ethjs,verkle npx vitest test/verkle.spec.ts
```

Run with **put** method logging:

```shell
DEBUG=ethjs,verkle:put npx vitest test/verkle.spec.ts
```

Run with **verkle** + **put**/**get**/**del** logging:

```shell
DEBUG=ethjs,verkle,verkle:put,verkle:get,verkle:del npx vitest test/verkle.spec.ts
```

Run with max logging:

```shell
DEBUG=ethjs,verkle:* npx vitest test/verkle.spec.ts
```

`ethjs` **must** be included in the `DEBUG` environment variables to enable **any** logs.
Additional log selections can be added with a comma separated list (no spaces). Logs with extensions can be enabled with a colon `:`, and `*` can be used to include all extensions.

`DEBUG=ethjs,verkle:#:put,verkle:#:find_path:* npx vitest test/interop.spec.ts`

## References

- Wiki
  - [Overview of verkle trees](https://ethereum.org/en/roadmap/verkle-trees/)
  - [Verkle trees general resource](https://verkle.info/)
  - [Ethereum Foundation Verkle Tree Roadmap](https://ethereum.org/en/roadmap/verkle-trees)

## EthereumJS

See our organizational [documentation](https://ethereumjs.readthedocs.io) for an introduction to `EthereumJS` as well as information on current standards and best practices. If you want to join for work or carry out improvements on the libraries, please review our [contribution guidelines](https://ethereumjs.readthedocs.io/en/latest/contributing.html) first.

## License

[MIT](https://opensource.org/licenses/MIT)

[discord-badge]: https://img.shields.io/static/v1?logo=discord&label=discord&message=Join&color=blue
[discord-link]: https://discord.gg/TNwARpR
[verkle-npm-badge]: https://img.shields.io/npm/v/@ethereumjs/verkle.svg
[verkle-npm-link]: https://www.npmjs.com/package/@ethereumjs/verkle
[verkle-issues-badge]: https://img.shields.io/github/issues/ethereumjs/ethereumjs-monorepo/package:%20verkle?label=issues
[verkle-issues-link]: https://github.com/ethereumjs/ethereumjs-monorepo/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+verkle"
[verkle-actions-badge]: https://github.com/ethereumjs/ethereumjs-monorepo/workflows/Verkle/badge.svg
[verkle-actions-link]: https://github.com/ethereumjs/ethereumjs-monorepo/actions?query=workflow%3A%22Verkle%22
[verkle-coverage-badge]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/branch/master/graph/badge.svg?flag=verkle
[verkle-coverage-link]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/tree/master/packages/verkle
