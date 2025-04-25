# @ethereumjs/rlp `v10`

[![NPM Package][rlp-npm-badge]][rlp-npm-link]
[![GitHub Issues][rlp-issues-badge]][rlp-issues-link]
[![Actions Status][rlp-actions-badge]][rlp-actions-link]
[![Code Coverage][rlp-coverage-badge]][rlp-coverage-link]
[![Discord][discord-badge]][discord-link]

| [Recursive Length Prefix](https://ethereum.org/en/developers/docs/data-structures-and-encoding/rlp) encoding for Node.js and the browser. |
| ----------------------------------------------------------------------------------------------------------------------------------------- |

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Browser](#browser)
- [API](#api)
- [CLI](#cli)
- [EthereumJS](#ethereumjs)
- [License](#license)

## Installation

To obtain the latest version, simply require the project using `npm`:

```shell
npm install @ethereumjs/rlp
```

Install with `-g` if you want to use the CLI.

## Usage

```ts
// ./examples/simple.ts

import { RLP } from '@ethereumjs/rlp'
import assert from 'assert'

const nestedList = [[], [[]], [[], [[]]]]
const encoded = RLP.encode(nestedList)
const decoded = RLP.decode(encoded)
assert.deepStrictEqual(decoded, nestedList, 'decoded output does not match original')
console.log('assert.deepStrictEqual would have thrown if the decoded output did not match')
```

## Browser

We provide hybrid ESM/CJS builds for all our libraries. With the v10 breaking release round from Spring 2025, all libraries are "pure-JS" by default and we have eliminated all hard-wired WASM code. Additionally we have substantially lowered the bundle sizes, reduced the number of dependencies, and cut out all usages of Node.js-specific primitives (like the Node.js event emitter).

It is easily possible to run a browser build of one of the EthereumJS libraries within a modern browser using the provided ESM build. For a setup example see [./examples/browser.html](./examples/browser.html).

## API

`RLP.encode(plain)` - RLP encodes an `Array`, `Uint8Array` or `String` and returns a `Uint8Array`.

`RLP.decode(encoded, [stream=false])` - Decodes an RLP encoded `Uint8Array`, `Array` or `String` and returns a `Uint8Array` or `NestedUint8Array`. If `stream` is enabled, it will just decode the first rlp sequence in the Uint8Array. By default, it would throw an error if there are more bytes in Uint8Array than used by the rlp sequence.

## CLI

`rlp encode <JSON string>`\
`rlp decode <0x-prefixed hex string>`

### Examples

- `rlp encode '5'` -> `0x05`
- `rlp encode '[5]'` -> `0xc105`
- `rlp encode '["cat", "dog"]'` -> `0xc88363617483646f67`
- `rlp decode 0xc88363617483646f67` -> `["cat","dog"]`

## EthereumJS

See our organizational [documentation](https://ethereumjs.readthedocs.io) for an introduction to `EthereumJS` as well as information on current standards and best practices. If you want to join for work or carry out improvements on the libraries, please review our [contribution guidelines](https://ethereumjs.readthedocs.io/en/latest/contributing.html) first.

## License

[MPL-2.0](<https://tldrlegal.com/license/mozilla-public-license-2.0-(mpl-2)>)

[discord-badge]: https://img.shields.io/static/v1?logo=discord&label=discord&message=Join&color=blue
[discord-link]: https://discord.gg/TNwARpR
[rlp-npm-badge]: https://img.shields.io/npm/v/@ethereumjs/rlp.svg
[rlp-npm-link]: https://www.npmjs.com/package/@ethereumjs/rlp
[rlp-issues-badge]: https://img.shields.io/github/issues/ethereumjs/ethereumjs-monorepo/package:%20rlp?label=issues
[rlp-issues-link]: https://github.com/ethereumjs/ethereumjs-monorepo/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+rlp"
[rlp-actions-badge]: https://github.com/ethereumjs/ethereumjs-monorepo/workflows/rlp/badge.svg
[rlp-actions-link]: https://github.com/ethereumjs/ethereumjs-monorepo/actions?query=workflow%3A%22rlp%22
[rlp-coverage-badge]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/branch/master/graph/badge.svg?flag=rlp
[rlp-coverage-link]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/tree/master/packages/rlp
