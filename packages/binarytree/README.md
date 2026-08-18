# @ethereumjs/binarytree `v10` (EXPERIMENTAL)

[![NPM Package][binarytree-npm-badge]][binarytree-npm-link]
[![GitHub Issues][binarytree-issues-badge]][binarytree-issues-link]
[![Actions Status][binarytree-actions-badge]][binarytree-actions-link]
[![Code Coverage][binarytree-coverage-badge]][binarytree-coverage-link]
[![Discord][discord-badge]][discord-link]

| Implementation of Binary Trees as specified in [EIP-7864](https://eips.ethereum.org/EIPS/eip-7864) |
| -------------------------------------------------------------------------------------------------- |

Binary Trees are a novel cryptographic data structure proposed for Ethereum state storage with smaller proof sizes than Merkle Patricia Tries. Keys map to a **stem** (first 31 bytes) and **index** (last byte) within a stem node.

**This library is experimental** — APIs are not stable and it must not be used in production.

Runnable examples live in [`examples/`](./examples/).

## Table of Contents

- [Installation](#installation)
- [Getting Started](#getting-started)
- [Proofs](#proofs)
- [Browser](#browser)
- [API](#api)
- [EthereumJS](#ethereumjs)
- [License](#license)

## Installation

```shell
npm install @ethereumjs/binarytree
```

## Getting Started

Use `createBinaryTree()` to instantiate a tree. By default an in-memory `MapDB` is used; pass `db` for persistence.

```ts
// ./examples/basicUsage.ts

import { createBinaryTree } from '@ethereumjs/binarytree'
import { bytesToHex, hexToBytes } from '@ethereumjs/util'

const main = async () => {
  const tree = await createBinaryTree()

  const key = hexToBytes(`0x${'00'.repeat(32)}`)
  const value = hexToBytes(`0x${'01'.repeat(32)}`)
  const stem = key.slice(0, 31)
  const index = key[31]

  await tree.put(stem, [index], [value])
  const [retrieved] = await tree.get(stem, [index])

  console.log(`Root: ${bytesToHex(tree.root())}`)
  console.log(`Value match: ${bytesToHex(retrieved!)}`)
}

void main()
```

`put(stem, indices, values)` accepts parallel arrays of slot indices and 32-byte values within one stem. `get(stem, indices)` returns values in the same order.

Options (`BinaryTreeOpts`): `db`, `useRootPersistence`, `cacheSize`, `hashFunction` (defaults to BLAKE3).

## Proofs

Create inclusion proofs with `tree.createBinaryProof(key)`, verify with `verifyBinaryProof()`, and rebuild a sparse tree from proof nodes with `binaryTreeFromProof()`:

```ts
// ./examples/binaryProof.ts

import { binaryTreeFromProof, createBinaryTree, verifyBinaryProof } from '@ethereumjs/binarytree'
import { bytesToHex, hexToBytes } from '@ethereumjs/util'
import { blake3 } from '@noble/hashes/blake3.js'

const main = async () => {
  const tree = await createBinaryTree()

  const key = hexToBytes(`0x${'00'.repeat(31)}01`)
  const hashedKey = blake3(key)
  const value = hexToBytes(`0x${'02'.repeat(32)}`)
  const stem = hashedKey.slice(0, 31)
  const index = hashedKey[31]

  await tree.put(stem, [index], [value])

  const proof = await tree.createBinaryProof(hashedKey)
  const verified = await verifyBinaryProof(tree.root(), hashedKey, proof)
  const sparse = await binaryTreeFromProof(proof)

  console.log(`Proof length: ${proof.length} nodes`)
  console.log(`Verified value: ${bytesToHex(verified!)}`)
  console.log(`Sparse tree root match: ${bytesToHex(sparse.root()) === bytesToHex(tree.root())}`)
}

void main()
```

Proof keys are typically `blake3(address || treeIndex || subIndex)` as used by the Verkle/binary-tree state layer. A valid proof of non-existence returns `null` / `undefined` from `verifyBinaryProof()`.

## Browser

Hybrid ESM/CJS builds are provided. For a browser setup see [./examples/browser.html](./examples/browser.html) (build the package, then `npx vite` from the package root).

## API

Generated TypeDoc [documentation](./docs/README.md).

Main exports: `BinaryTree`, `createBinaryTree`, `binaryTreeFromProof`, `verifyBinaryProof`, `CheckpointDB`, node types under `./node`.

Used by [`StatefulBinaryTreeStateManager`](../statemanager) in `@ethereumjs/statemanager` when EIP-7864 is activated on `Common`.

## EthereumJS

The `EthereumJS` GitHub organization and its repositories are managed by members of the former Ethereum Foundation JavaScript team and the broader Ethereum community. If you want to join for work or carry out improvements on the libraries see the [developer docs](../../DEVELOPER.md) for an overview of current standards and tools and review our [code of conduct](../../CODE_OF_CONDUCT.md).

## License

[MIT](https://opensource.org/licenses/MIT)

[discord-badge]: https://img.shields.io/static/v1?logo=discord&label=discord&message=Join&color=blue
[discord-link]: https://discord.gg/TNwARpR
[binarytree-npm-badge]: https://img.shields.io/npm/v/@ethereumjs/binarytree.svg
[binarytree-npm-link]: https://www.npmjs.com/package/@ethereumjs/binarytree
[binarytree-issues-badge]: https://img.shields.io/github/issues/ethereumjs/ethereumjs-monorepo/package:%20binarytree?label=issues
[binarytree-issues-link]: https://github.com/ethereumjs/ethereumjs-monorepo/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+binarytree"
[binarytree-actions-badge]: https://github.com/ethereumjs/ethereumjs-monorepo/workflows/binarytree/badge.svg
[binarytree-actions-link]: https://github.com/ethereumjs/ethereumjs-monorepo/actions?query=workflow%3A%22binarytree%22
[binarytree-coverage-badge]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/branch/master/graph/badge.svg?flag=binarytree
[binarytree-coverage-link]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/tree/master/packages/binarytree
