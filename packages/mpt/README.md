# @ethereumjs/mpt `v10`

[![NPM Package][mpt-npm-badge]][mpt-npm-link]
[![GitHub Issues][mpt-issues-badge]][mpt-issues-link]
[![Actions Status][mpt-actions-badge]][mpt-actions-link]
[![Code Coverage][mpt-coverage-badge]][mpt-coverage-link]
[![Discord][discord-badge]][discord-link]

| Implementation of the [Modified Merkle Patricia Trie](https://ethereum.org/en/developers/docs/data-structures-and-encoding/patricia-merkle-trie/) as specified in the [Ethereum Yellow Paper](http://gavwood.com/Paper.pdf) |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

- 🔭 Highly scalable
- 🌴 Tree-shakeable API
- 👷🏼 Controlled dependency set (3 external + `@Noble` crypto)
- ⏳ Checkpoint Functionality
- 🛢️ Flexible storage backends
- ⚖️ `EIP-1186` Proofs
- 🛵 176KB bundle size (48KB gzipped)
- 🏄🏾‍♂️ WASM-free default + Fully browser ready

Runnable examples live in [`examples/`](./examples/). Additional walk-throughs: [`examples/README.md`](./examples/README.md).

## Table of Contents

- [Installation](#installation)
- [Getting Started](#getting-started)
- [Checkpoints](#checkpoints)
- [Walking a Trie](#walking-a-trie)
- [Merkle Proofs](#merkle-proofs)
- [Trie from Proof](#trie-from-proof)
- [Value Map](#value-map)
- [Storage Backends](#storage-backends)
- [Root Persistence and Pruning](#root-persistence-and-pruning)
- [Browser](#browser)
- [API](#api)
- [Benchmarking](#benchmarking)
- [Debugging](#debugging)
- [References](#references)
- [EthereumJS](#ethereumjs)
- [License](#license)

## Installation

```shell
npm install @ethereumjs/mpt
```

## Getting Started

Use `createMPT()` for the async factory (recommended) or `new MerklePatriciaTrie()` directly. With `useKeyHashing: true` (Ethereum production default), keys are hashed with keccak256 before lookup.

```ts
// ./examples/basicUsage.ts

import { createMPT } from '@ethereumjs/mpt'
import { MapDB, bytesToUtf8, utf8ToBytes } from '@ethereumjs/util'

async function test() {
  const trie = await createMPT({ db: new MapDB() })
  await trie.put(utf8ToBytes('test'), utf8ToBytes('one'))
  const value = await trie.get(utf8ToBytes('test'))
  console.log(value ? bytesToUtf8(value) : 'not found') // 'one'
}

void test()
```

Main constructors: `createMPT()`, `createMPTFromProof()`, `new MerklePatriciaTrie(opts)`.

Properties are frozen by default on returned nodes where applicable. Pass a `Common` with `customCrypto` for WASM hashing backends — see [@ethereumjs/common](../common#custom-cryptography-wasm--kzg).

## Checkpoints

Nested `checkpoint()` / `commit()` / `revert()` stack for speculative writes (used by `@ethereumjs/statemanager` and `@ethereumjs/vm`):

```ts
// ./examples/checkpoint.ts

import { createMPT } from '@ethereumjs/mpt'
import { bytesToHex, hexToBytes } from '@ethereumjs/util'

const main = async () => {
  const trie = await createMPT()
  const key = hexToBytes('0x11')

  await trie.put(key, hexToBytes('0xaa'))
  trie.checkpoint()
  await trie.put(key, hexToBytes('0xbb'))
  console.log(`In checkpoint: ${bytesToHex((await trie.get(key))!)}`)

  await trie.revert()
  console.log(`After revert: ${bytesToHex((await trie.get(key))!)}`)

  trie.checkpoint()
  await trie.put(key, hexToBytes('0xcc'))
  await trie.commit()
  console.log(`After commit: ${bytesToHex((await trie.get(key))!)}`)
}

void main()
```

## Walking a Trie

`walkTrieIterable()` yields `{ node, currentKey }` pairs for `for await` loops. Use `walkTrie()` with `WalkController` when you need concurrent DB reads or per-node traversal control (see API docs).

```ts
// ./examples/trieWalking.ts

import { createMPT } from '@ethereumjs/mpt'
import { utf8ToBytes } from '@ethereumjs/util'

async function main() {
  const trie = await createMPT()
  await trie.put(utf8ToBytes('key'), utf8ToBytes('val'))
  const walk = trie.walkTrieIterable(trie.root())

  for await (const { node, currentKey } of walk) {
    console.log({ node, currentKey })
  }
}
void main()
```

## Merkle Proofs

[EIP-1186](https://eips.ethereum.org/EIPS/eip-1186) proof creation and verification:

```ts
// ./examples/proofs.ts

import { MerklePatriciaTrie, createMerkleProof, verifyMPTWithMerkleProof } from '@ethereumjs/mpt'
import { bytesToUtf8, utf8ToBytes } from '@ethereumjs/util'

const trie = new MerklePatriciaTrie()

async function main() {
  const k1 = utf8ToBytes('key1')
  const k2 = utf8ToBytes('key2')
  const v1 = utf8ToBytes('one')
  const v2 = utf8ToBytes('two')

  // proof-of-inclusion
  await trie.put(k1, v1)
  let proof = await createMerkleProof(trie, k1)
  let value = await verifyMPTWithMerkleProof(trie, trie.root(), k1, proof)
  console.log(value ? bytesToUtf8(value) : 'not found') // 'one'

  // proof-of-exclusion
  await trie.put(k1, v1)
  await trie.put(k2, v2)
  proof = await createMerkleProof(trie, utf8ToBytes('key3'))
  value = await verifyMPTWithMerkleProof(trie, trie.root(), utf8ToBytes('key3'), proof)
  console.log(value ? bytesToUtf8(value) : 'null') // null

  // invalid proof
  await trie.put(k1, v1)
  await trie.put(k2, v2)
  proof = await createMerkleProof(trie, k2)
  proof[0].reverse()
  try {
    const _value = await verifyMPTWithMerkleProof(trie, trie.root(), k2, proof)
  } catch (err) {
    console.log(`Invalid proof rejected: ${(err as Error).message.split('\n')[0]}`)
  }
}

void main()
```

Range proofs: `verifyMPTRangeProof()` for snap-sync style leaf ranges.

## Trie from Proof

Build a partial trie from existing proofs — useful for light clients and `@ethereumjs/statemanager`:

```ts
// ./examples/createFromProof.ts

import {
  MerklePatriciaTrie,
  createMPTFromProof,
  createMerkleProof,
  updateMPTFromMerkleProof,
} from '@ethereumjs/mpt'
import { bytesToUtf8, utf8ToBytes } from '@ethereumjs/util'

async function main() {
  const k1 = utf8ToBytes('keyOne')
  const k2 = utf8ToBytes('keyTwo')

  const someOtherTrie = new MerklePatriciaTrie({ useKeyHashing: true })
  await someOtherTrie.put(k1, utf8ToBytes('valueOne'))
  await someOtherTrie.put(k2, utf8ToBytes('valueTwo'))

  const proof = await createMerkleProof(someOtherTrie, k1)
  const trie = await createMPTFromProof(proof, { useKeyHashing: true })
  const otherProof = await createMerkleProof(someOtherTrie, k2)

  await updateMPTFromMerkleProof(trie, otherProof)

  const value = await trie.get(k1)
  console.log(bytesToUtf8(value!)) // valueOne
  const otherValue = await trie.get(k2)
  console.log(bytesToUtf8(otherValue!)) // valueTwo
}

void main()
```

## Value Map

Dump leaf key/value pairs with `getValueMap()`:

```ts
// ./examples/getValueMap.ts

import { createMPT } from '@ethereumjs/mpt'
import { bigIntToBytes, hexToBytes } from '@ethereumjs/util'

const main = async () => {
  const trie = await createMPT({})
  const entries: [Uint8Array, string][] = [
    [bigIntToBytes(1n), '0x' + '0a'.repeat(32)],
    [bigIntToBytes(2n), '0x' + '0b'.repeat(32)],
    [bigIntToBytes(3n), '0x' + '0c'.repeat(32)],
  ]

  for (const entry of entries) {
    await trie.put(entry[0], hexToBytes(entry[1]))
  }

  const dump = await trie.getValueMap()
  console.log(`All leaf values: ${Object.keys(dump.values).length} entries`)

  const selectiveDump = await trie.getValueMap(1n, 2)
  console.log(`Selective dump: ${Object.keys(selectiveDump.values).length} entries`)
}

void main()
```

## Storage Backends

Pass any `@ethereumjs/util` `DB` implementation via `opts.db`. Default is in-memory `MapDB`.

| Example | Backend |
| --- | --- |
| [`examples/level.js`](./examples/level.js) | LevelDB (used by `@ethereumjs/client`) |
| [`examples/lmdb.js`](./examples/lmdb.js) | LMDB |
| [`recipes/level.ts`](./recipes/level.ts) | TypeScript LevelDB wrapper recipe |

```ts
// ./examples/customLevelDB.ts (excerpt)

// const trie = new MerklePatriciaTrie({ db: new LevelDB(new Level('MY_TRIE_DB_LOCATION')) })
```

Implement the [`DB` interface](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/db.ts) for custom backends.

## Root Persistence and Pruning

Persist the trie root across restarts:

```ts
// ./examples/rootPersistence.ts

import { createMPT } from '@ethereumjs/mpt'
import { bytesToHex } from '@ethereumjs/util'

async function main() {
  const trie = await createMPT({
    useRootPersistence: true,
  })

  console.log(bytesToHex(trie.root())) // 0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421
}
void main()
```

Enable `useNodePruning: true` to delete superseded nodes from the DB (saves disk space; only safe when you do not need historical trie states).

## Browser

Hybrid ESM/CJS builds are provided. See [./examples/browser.html](./examples/browser.html).

## API

Generated TypeDoc [documentation](./docs/README.md).

## Benchmarking

```shell
npm run benchmarks   # random PUT + checkpointing benchmarks
npm run profiling    # flamegraph via 0x
```

## Debugging

Uses the [debug](https://github.com/visionmedia/debug) package. Enable with `DEBUG=ethjs,mpt` (see full logger table in previous docs or run `DEBUG=ethjs,mpt:* npm test`).

## References

- [Ethereum Trie Specification](https://github.com/ethereum/wiki/wiki/Patricia-Tree)
- [Merkling in Ethereum](https://blog.ethereum.org/2015/11/15/merkling-in-ethereum/)
- [Trie and Patricia Trie Overview (video)](https://www.youtube.com/watch?v=jXAHLqQthKw&t=26s)

## EthereumJS

The `EthereumJS` GitHub organization and its repositories are managed by members of the former Ethereum Foundation JavaScript team and the broader Ethereum community. If you want to join for work or carry out improvements on the libraries see the [developer docs](../../DEVELOPER.md) for an overview of current standards and tools and review our [code of conduct](../../CODE_OF_CONDUCT.md).

## License

[MPL-2.0](<https://tldrlegal.com/license/mozilla-public-license-2.0-(mpl-2)>)

[discord-badge]: https://img.shields.io/static/v1?logo=discord&label=discord&message=Join&color=blue
[discord-link]: https://discord.gg/TNwARpR
[mpt-npm-badge]: https://img.shields.io/npm/v/@ethereumjs/mpt.svg
[mpt-npm-link]: https://www.npmjs.com/package/@ethereumjs/mpt
[mpt-issues-badge]: https://img.shields.io/github/issues/ethereumjs/ethereumjs-monorepo/package:%20mpt?label=issues
[mpt-issues-link]: https://github.com/ethereumjs/ethereumjs-monorepo/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+mpt"
[mpt-actions-badge]: https://github.com/ethereumjs/ethereumjs-monorepo/workflows/Trie/badge.svg
[mpt-actions-link]: https://github.com/ethereumjs/ethereumjs-monorepo/actions?query=workflow%3A%22Trie%22
[mpt-coverage-badge]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/branch/master/graph/badge.svg?flag=mpt
[mpt-coverage-link]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/tree/master/packages/mpt
