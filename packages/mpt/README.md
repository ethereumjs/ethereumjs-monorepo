# @ethereumjs/mpt `v10`

[![NPM Package][mpt-npm-badge]][mpt-npm-link]
[![GitHub Issues][mpt-issues-badge]][mpt-issues-link]
[![Actions Status][mpt-actions-badge]][mpt-actions-link]
[![Code Coverage][mpt-coverage-badge]][mpt-coverage-link]
[![Discord][discord-badge]][discord-link]

| Implementation of the [Modified Merkle Patricia Trie](https://ethereum.org/en/developers/docs/data-structures-and-encoding/patricia-merkle-mpt/) as specified in the [Ethereum Yellow Paper](http://gavwood.com/Paper.pdf) |
| ---------------------------------------------------------------------------- |

- 🔭 Highly scalable
- 🌴 Tree-shakeable API
- 👷🏼 Controlled dependency set (3 external + `@Noble` crypto)
- ⏳ Checkpoint Functionality
- 🛢️ Flexible storage backends
- ⚖️ `EIP-1186` Proofs
- 🛵 176KB bundle size (48KB gzipped)
- 🏄🏾‍♂️ WASM-free default + Fully browser ready

## Table of Contents

- [Installation](#installation)
- [Getting Started](#getting-started)
- [Merkle Patricia Tries](#merkle-patricia-tries)
- [Proofs](#proofs)
- [Examples](#examples)
- [Browser](#browser)
- [API](#api)
- [Benchmarking](#benchmarking)
- [Debugging](#debugging)
- [References](#references)
- [EthereumJS](#ethereumjs)
- [License](#license)


## Installation

To obtain the latest version, simply require the project using `npm`:

```shell
npm install @ethereumjs/mpt
```

## Getting Started

This class implements the basic [Modified Merkle Patricia Trie](https://ethereum.org/en/developers/docs/data-structures-and-encoding/patricia-merkle-mpt/) in the `Trie` base class, which you can use with the `useKeyHashing` option set to `true` to create a Merkle Patricia Trie which stores values under the `keccak256` hash of its keys (this is the Trie flavor which is used in Ethereum production systems).

Checkpointing functionality to `Trie` through the methods `checkpoint`, `commit` and `revert`.

It is best to select the variant that is most appropriate for your unique use case.

### Initialization and Basic Usage

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

### WASM Crypto Support

This library by default uses JavaScript implementations for the basic standard crypto primitives like hashing for keys. See `@ethereumjs/common` [README](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/common) for instructions on how to replace with e.g. a more performant WASM implementation by using a shared `common` instance.

### Use with Standalone Constructors

Tries can be instantiated using standalone constructor functions:

```ts
// ./examples/basicUsage.ts#L5-L6

const trie = await createMPT({ db: new MapDB() })
await trie.put(utf8ToBytes('test'), utf8ToBytes('one'))
```

Tries can also be instantiated from a merkle proof:

```ts
// ./examples/createFromProof.ts#L17-L19

const proof = await createMerkleProof(someOtherTrie, k1)
const trie = await createMPTFromProof(proof, { useKeyHashing: true })
const otherProof = await createMerkleProof(someOtherTrie, k2)
```

#### Create new Trie

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

When the `createMPT` constructor is used without any options, the `MerklePatriciaTrie` object is instantiated with defaults configured to match the Ethereum production spec (i.e. keys are hashed using SHA256). It also persists the state root of the tree on each write operation, ensuring that your Merkle Patricia Trie remains in the state you left it when you start your application the next time.

#### Create from a Proof

The MPT library supports basic creation of [EIP-1186](https://eips.ethereum.org/EIPS/eip-1186) proofs as well as the instantiation of new MPTs from an existing proof.

The following is an example for using the `createMPTFromProof()` constructor. This instantiates a new partial Merkle Patricia Trie based only on the branch of the MPT contained in the provided proof.

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

  // To add more proofs to the trie, use `updateMPTFromMerkleProof`
  await updateMPTFromMerkleProof(trie, otherProof)

  const value = await trie.get(k1)
  console.log(bytesToUtf8(value!)) // valueOne
  const otherValue = await trie.get(k2)
  console.log(bytesToUtf8(otherValue!)) // valueTwo
}

void main()
```

For further proof usage documentation see additional documentation section below.

### Walking a Trie

Starting with the v6 release there is a new API for walking and iterating a trie by using an async walk generator, which now enables to walk tries without altering the walk controller and also now enables to walk a sparse (not completely filled) trie.

The new walk functionality can be used like the following:

```ts
// ./examples/trieWalking.ts

import { createMPT } from '@ethereumjs/mpt'
import { utf8ToBytes } from '@ethereumjs/util'

async function main() {
  const trie = await createMPT()
  await trie.put(utf8ToBytes('key'), utf8ToBytes('val'))
  const walk = trie.walkTrieIterable(trie.root())

  for await (const { node, currentKey } of walk) {
    // ... do something
    console.log({ node, currentKey })
  }
}
void main()
```

## Merkle Patricia Tries

### Database Options

The `DB` opt in the `MPTOpts` allows you to use any database that conforms to the `DB` interface to store the trie data in. We provide several [examples](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/trie/examples) for database implementations. The [level.js](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/trie/examples/level.js) example is used in the `ethereumjs client` while [lmdb.js](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/trie/examples/lmdb.js) is an alternative implementation that uses the popular [LMDB](https://en.wikipedia.org/wiki/Lightning_Memory-Mapped_Database) as its underlying database.

If no `db` option is provided, an in-memory database powered by [a Javascript Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) will fulfill this role (imported from `@ethereumjs/util`, see [mapDB](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/mapDB.ts) module).

If you want to use an alternative database, you can integrate your own by writing a DB wrapper that conforms to the [`DB` interface](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/db.ts) (in `@ethereumjs/util`). The `DB` interface defines the methods `get`, `put`, `del`, `batch` and `copy` that a concrete implementation of the `DB` interface will need to implement.

#### LevelDB

As an example, to leverage `LevelDB` for all operations then you should create a file with the [following implementation from our recipes](./recipes//level.ts) in your project. Then instantiate your DB and trie as below:

```ts
// ./examples/customLevelDB.ts#L127-L131

}

async function main() {
  const trie = new MerklePatriciaTrie({ db: new LevelDB(new Level('MY_TRIE_DB_LOCATION')) })
  console.log(trie.database().db) // LevelDB { ...
```

### Node Deletion (Pruning)

By default, the deletion of trie nodes from the underlying database does not occur in order to avoid corrupting older trie states (as of `v4.2.0`). Should you only wish to work with the latest state of a trie, you can switch to a delete behavior (for example, if you wish to save disk space) by using the `useNodePruning` constructor option (see related release notes in the changelog for further details).

### Root Persistence

You can enable persistence by setting the `useRootPersistence` option to `true` when constructing a trie through the `createMPT` function. As such, this value is preserved when creating copies of the trie and is incapable of being modified once a trie is instantiated.

```ts
// ./examples/rootPersistence.ts

import { createMPT } from '@ethereumjs/mpt'
import { bytesToHex } from '@ethereumjs/util'

async function main() {
  const trie = await createMPT({
    useRootPersistence: true,
  })

  // this logs the empty root value that has been persisted to the trie db
  console.log(bytesToHex(trie.root())) // 0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421
}
void main()
```

## Proofs

### Merkle Proofs

The `createMerkleProof` and `verifyMerkleProof` functions allow you to verify that a certain value does or does not exist within a Merkle Patricia Tree with a given root.

#### Proof-of-Inclusion

The following code demonstrates how to construct and subsequently verify a proof that confirms the existence of the key `test` (which corresponds with the value `one`) within the given trie. This is also known as inclusion, hence the name 'Proof-of-Inclusion.'

```ts
// ./examples/proofs.ts#L12-L16

// proof-of-inclusion
await trie.put(k1, v1)
let proof = await createMerkleProof(trie, k1)
let value = await verifyMPTWithMerkleProof(trie, trie.root(), k1, proof)
console.log(value ? bytesToUtf8(value) : 'not found') // 'one'
```

#### Proof-of-Exclusion

The following code demonstrates how to construct and subsequently verify a proof that confirms that the key `test3` does not exist within the given trie. This is also known as exclusion, hence the name 'Proof-of-Exclusion.'

```ts
// ./examples/proofs.ts#L18-L23

// proof-of-exclusion
await trie.put(k1, v1)
await trie.put(k2, v2)
proof = await createMerkleProof(trie, utf8ToBytes('key3'))
value = await verifyMPTWithMerkleProof(trie, trie.root(), utf8ToBytes('key3'), proof)
console.log(value ? bytesToUtf8(value) : 'null') // null
```

#### Invalid Proofs

If `verifyProof` detects an invalid proof, it will throw an error. While contrived, the below example illustrates the resulting error condition in the event a prover tampers with the data in a merkle proof.

```ts
// ./examples/proofs.ts#L25-L34

// invalid proof
await trie.put(k1, v1)
await trie.put(k2, v2)
proof = await createMerkleProof(trie, k2)
proof[0].reverse()
try {
  const _value = await verifyMPTWithMerkleProof(trie, trie.root(), k2, proof) // results in error
} catch (err) {
  console.log(err)
}
```

### Range Proofs

You may use the `verifyMPTRangeProof()` function to confirm if the given leaf nodes and edge proof possess the capacity to prove that the given trie leaves' range matches the specific root (which is useful for snap sync, for instance).

## Examples

You can find additional examples complete with detailed explanations [here](./examples/README.md).

## Browser

We provide hybrid ESM/CJS builds for all our libraries. With the v10 breaking release round from Spring 2025, all libraries are "pure-JS" by default and we have eliminated all hard-wired WASM code. Additionally we have substantially lowered the bundle sizes, reduced the number of dependencies, and cut out all usages of Node.js-specific primitives (like the Node.js event emitter).

It is easily possible to run a browser build of one of the EthereumJS libraries within a modern browser using the provided ESM build. For a setup example see [./examples/browser.html](./examples/browser.html).

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

## Benchmarking

You will find two simple **benchmarks** in the `benchmarks` folder:

- `random.ts` runs random `PUT` operations on the tree, and
- `checkpointing.ts` runs checkpoints and commits between `PUT` operations

A third benchmark using mainnet data to simulate real load is also being considered.

You may run benchmarks using:

```shell
npm run benchmarks
```

To run a **profiler** on the `random.ts` benchmark and generate a flamegraph with [0x](https://github.com/davidmarkclements/0x), you may use:

```shell
npm run profiling
```

0x processes the stacks and generates a profile folder (`<pid>.0x`) containing [`flamegraph.html`](https://github.com/davidmarkclements/0x/blob/master/docs/ui.md).

## Debugging

This library uses the [debug](https://github.com/visionmedia/debug) debugging utility package.

The `Trie` class features optional debug logging. Individual debug selections can be activated on the CL with `DEBUG=ethjs,[Logger Selection]`.

The following options are available:

| Logger                           | Description                                                        |
| -------------------------------- | ------------------------------------------------------------------ |
| `mpt:#`                          | minimal info logging for all mpt methods                           |
| `mpt:#:put`                      | a mpt put operation has occurred                                   |
| `mpt:#:get`                      | a mpt get operation has occurred                                   |
| `mpt:#:del`                      | a mpt del operation has occurred                                   |
| `mpt:#:find_path`                | a node is being searched for                                       |
| `mpt:#:find_path:branch_node`    | a branch node has been found during a node search                  |
| `mpt:#:find_path:extension_node` | an extension node has been found during a node search              |
| `mpt:#:lookup_node`              | node lookup operations                                             |
| `mpt:#:lookup_node:raw_node`     | node lookup operations that have hit a raw node                    |
| `mpt:#:lookup_node:by_hash`      | node lookup operations that have hit a node hash                   |
| `mpt:#:persist_root`             | operations writing the state root to the disk                      |
| `mpt:#:checkpoint`               | checkpoint operations                                              |
| `mpt:#:commit`                   | operations committing checkpoints to the disk                      |
| `mpt:#:revert:before`            | the stateRoot before reverting committed checkpoints               |
| `mpt:#:revert:after`             | the stateRoot after reverting committed checkpoints                |
| `mpt:#:flush_checkpoints`        | checkpoints are being flushed                                      |
| `mpt:#:from_proof`               | a mpt has been updated from a proof using updateMPTFromMerkleProof |
| `mpt:#:create_proof`             | a merkle proof has been created using updateMPTFromMerkleProof     |

To observe the logging in action at different levels:

Run with minimal logging:

```shell
DEBUG=ethjs,mpt npx vitest test/util/log.spec.ts
```

Run with **put** method logging:

```shell
DEBUG=ethjs,mpt:put npx vitest test/util/log.spec.ts
```

Run with **mpt** + **put**/**get**/**del** logging:

```shell
DEBUG=ethjs,mpt,mpt:put,mpt:get,mpt:del npx vitest test/util/log.spec.ts
```

Run with **findPath** debug logging:

```shell
DEBUG=ethjs,mpt:find_path npx vitest test/util/log.spec.ts
```

Run with **findPath** verbose logging:

```shell
DEBUG=ethjs,mpt:find_path:* npx vitest test/util/log.spec.ts
```

Run with max logging:

```shell
DEBUG=ethjs,mpt:* npx vitest test/util/log.spec.ts
```

`ethjs` **must** be included in the `DEBUG` environment variables to enable **any** logs.
Additional log selections can be added with a comma separated list (no spaces). Logs with extensions can be enabled with a colon `:`, and `*` can be used to include all extensions.

`DEBUG=ethjs,mpt:put,mpt:find_path:* npx vitest test/proof.spec.ts`

## References

- Wiki
  - [Ethereum Trie Specification](https://github.com/ethereum/wiki/wiki/Patricia-Tree)
- Blog posts
  - [Ethereum's Merkle Patricia Trees - An Interactive JavaScript Tutorial](https://rockwaterweb.com/ethereum-merkle-patricia-trees-javascript-tutorial/)
  - [Merkling in Ethereum](https://blog.ethereum.org/2015/11/15/merkling-in-ethereum/)
  - [Understanding the Ethereum Trie](https://easythereentropy.wordpress.com/2014/06/04/understanding-the-ethereum-trie/) (This is worth reading, but mind the outdated Python libraries)
- Videos
  - [Trie and Patricia Trie Overview](https://www.youtube.com/watch?v=jXAHLqQthKw&t=26s)

## EthereumJS

See our organizational [documentation](https://ethereumjs.readthedocs.io) for an introduction to `EthereumJS` as well as information on current standards and best practices. If you want to join for work or carry out improvements on the libraries, please review our [contribution guidelines](https://ethereumjs.readthedocs.io/en/latest/contributing.html) first.

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
