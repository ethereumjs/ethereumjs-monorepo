# @ethereumjs/rlp `v10`

[![NPM Package][rlp-npm-badge]][rlp-npm-link]
[![GitHub Issues][rlp-issues-badge]][rlp-issues-link]
[![Actions Status][rlp-actions-badge]][rlp-actions-link]
[![Code Coverage][rlp-coverage-badge]][rlp-coverage-link]
[![Discord][discord-badge]][discord-link]

| [Recursive Length Prefix](https://ethereum.org/en/developers/docs/data-structures-and-encoding/rlp) encoding for Node.js and the browser. |
| ----------------------------------------------------------------------------------------------------------------------------------------- |

RLP serializes nested byte arrays — the wire format behind Ethereum transactions, blocks, and trie nodes. This package exposes a small `encode` / `decode` API plus lightweight byte helpers that do not depend on `@ethereumjs/util`.

Runnable examples live in [`examples/`](./examples/).

## Table of Contents

- [Installation](#installation)
- [Getting Started](#getting-started)
- [Scalar Input Types](#scalar-input-types)
- [Stream Decoding](#stream-decoding)
- [CLI](#cli)
- [Browser](#browser)
- [API](#api)
- [EthereumJS](#ethereumjs)
- [License](#license)

## Installation

```shell
npm install @ethereumjs/rlp
```

Install with `-g` if you want to use the [CLI](#cli).

## Getting Started

```ts
// ./examples/encodeDecode.ts

import { RLP } from '@ethereumjs/rlp'

const nestedList = [[], [[]], [[], [[]]]]
const encoded = RLP.encode(nestedList)
const decoded = RLP.decode(encoded)

console.log(`Encoded ${encoded.length} bytes`)
console.log(`Decoded top-level is array: ${Array.isArray(decoded)}`)
```

`RLP.encode()` accepts nested arrays of scalars (see below) and always returns a `Uint8Array`. `RLP.decode()` returns a `NestedUint8Array` — nested lists of `Uint8Array` leaves.

## Scalar Input Types

Strings, numbers, bigint, and `0x`-prefixed hex are accepted on encode. Each scalar becomes a byte string in the output.

```ts
// ./examples/scalarTypes.ts

import { RLP, utils } from '@ethereumjs/rlp'

const { bytesToHex } = utils

// Strings, numbers, bigint, and 0x-prefixed hex all encode to Uint8Array output
console.log(`encode('dog'): ${bytesToHex(RLP.encode('dog'))}`)
console.log(`encode(15): ${bytesToHex(RLP.encode(15))}`)
console.log(`encode(15n): ${bytesToHex(RLP.encode(15n))}`)
console.log(`encode('0x01'): ${bytesToHex(RLP.encode('0x01'))}`)
console.log(`encode(['cat','dog']): ${bytesToHex(RLP.encode(['cat', 'dog']))}`)
```

## Stream Decoding

Pass `stream: true` to decode only the first RLP item and receive the unconsumed remainder. Useful when a buffer holds multiple back-to-back RLP values.

The package also exports `RLP.utils` (`hexToBytes`, `bytesToHex`, `utf8ToBytes`, `concatBytes`) for byte work without pulling in `@ethereumjs/util`.

```ts
// ./examples/decodeStream.ts

import { RLP, utils } from '@ethereumjs/rlp'

const { bytesToHex, concatBytes, hexToBytes } = utils

// Stream mode decodes the first RLP item and returns the remainder buffer
const buffer = concatBytes(RLP.encode(1), RLP.encode('hello'), RLP.encode([2, 3]))

let decoded = RLP.decode(buffer, true)
console.log(`item 1: ${bytesToHex(decoded.data as Uint8Array)}`)

decoded = RLP.decode(decoded.remainder, true)
console.log(`item 2: ${new TextDecoder().decode(decoded.data as Uint8Array)}`)

decoded = RLP.decode(decoded.remainder, true)
const list = decoded.data as Uint8Array[]
console.log(`item 3: [${list.map((x) => bytesToHex(x)).join(', ')}]`)
console.log(`remainder length: ${decoded.remainder.length}`)

// utils: hex ↔ bytes without pulling in @ethereumjs/util
console.log(`hexToBytes('0x05'): ${bytesToHex(hexToBytes('0x05'))}`)
```

By default, `decode()` throws if trailing bytes remain after the first RLP sequence.

## CLI

When installed globally:

```shell
rlp encode '<JSON string>'
rlp decode <0x-prefixed hex string>
```

Examples:

- `rlp encode '5'` → `0x05`
- `rlp encode '[5]'` → `0xc105`
- `rlp encode '["cat", "dog"]'` → `0xc88363617483646f67`
- `rlp decode 0xc88363617483646f67` → `["cat","dog"]`

## Browser

We provide hybrid ESM/CJS builds for all our libraries. With the v10 breaking release round from Spring 2025, all libraries are "pure-JS" by default and we have eliminated all hard-wired WASM code. Additionally we have substantially lowered the bundle sizes, reduced the number of dependencies, and cut out all usages of Node.js-specific primitives (like the Node.js event emitter).

It is easily possible to run a browser build of one of the EthereumJS libraries within a modern browser using the provided ESM build. For a setup example see [./examples/browser.html](./examples/browser.html).

## API

### `RLP.encode(input)`

RLP-encodes an `Array`, `Uint8Array`, `string`, `number`, `bigint`, or `null`/`undefined` and returns a `Uint8Array`.

### `RLP.decode(input, stream?)`

Decodes an RLP-encoded `Uint8Array`, `Array`, or `string`. Returns a `Uint8Array` or `NestedUint8Array`. With `stream: true`, returns `{ data, remainder }` and decodes only the first sequence.

### `RLP.utils`

- `hexToBytes(hex)` — parse a hex string (with or without `0x`) to `Uint8Array`
- `bytesToHex(bytes)` — format bytes as a `0x`-prefixed hex string
- `utf8ToBytes(str)` — encode a UTF-8 string to bytes
- `concatBytes(...arrays)` — concatenate byte arrays

Types: `Input`, `NestedUint8Array`, `Decoded`. See [source](./src/index.ts).

## EthereumJS

The `EthereumJS` GitHub organization and its repositories are managed by members of the former Ethereum Foundation JavaScript team and the broader Ethereum community. If you want to join for work or carry out improvements on the libraries see the [developer docs](../../DEVELOPER.md) for an overview of current standards and tools and review our [code of conduct](../../CODE_OF_CONDUCT.md).

## License

[MPL-2.0](<https://tldrlegal.com/license/mozilla-public-license-2.0-(mpl-2)>)

[discord-badge]: https://img.shields.io/static/v1?logo=discord&label=discord&message=Join&color=blue
[discord-link]: https://discord.gg/TNwARpR
[rlp-npm-badge]: https://img.shields.io/npm/v/@ethereumjs/rlp.svg
[rlp-npm-link]: https://www.npmjs.com/package/@ethereumjs/rlp
[rlp-issues-badge]: https://img.shields.io/github/issues/ethereumjs/ethereumjs-monorepo/package:%20rlp?label=issues
[rlp-issues-link]: https://github.com/ethereumjs/ethereumjs-monorepo/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+rlp"
[rlp-actions-badge]: https://github.com/ethereumjs/ethereumjs-monorepo/actions/workflows/static-build.yml/badge.svg
[rlp-actions-link]: https://github.com/ethereumjs/ethereumjs-monorepo/actions?query=workflow%3A%22rlp%22
[rlp-coverage-badge]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/branch/master/graph/badge.svg?flag=rlp
[rlp-coverage-link]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/tree/master/packages/rlp
