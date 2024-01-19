# @ethereumjs/trie

[![NPM Package][trie-npm-badge]][trie-npm-link]
[![GitHub Issues][trie-issues-badge]][trie-issues-link]
[![Actions Status][trie-actions-badge]][trie-actions-link]
[![Code Coverage][trie-coverage-badge]][trie-coverage-link]
[![Discord][discord-badge]][discord-link]

| Implementation of the [Modified Merkle Patricia Trie](https://ethereum.org/en/developers/docs/data-structures-and-encoding/patricia-merkle-trie/) as specified in the [Ethereum Yellow Paper](http://gavwood.com/Paper.pdf) |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

> The modified Merkle Patricia tree (trie) provides a persistent data structure to map between arbitrary-length binary data (byte arrays). It is defined in terms of a mutable data structure to map between 256-bit binary fragments and arbitrary-length binary data. The core of the trie, and its sole requirement in terms of the protocol specification, is to provide a single 32-byte value that identifies a given set of key-value pairs.

## Installation

To obtain the latest version, simply require the project using `npm`:

```shell
npm install @ethereumjs/trie
```

## Usage

This class implements the basic [Modified Merkle Patricia Trie](https://ethereum.org/en/developers/docs/data-structures-and-encoding/patricia-merkle-trie/) in the `Trie` base class, which you can use with the `useKeyHashing` option set to `true` to create a trie which stores values under the `keccak256` hash of its keys (this is the Trie flavor which is used in Ethereum production systems).

Checkpointing functionality to `Trie` through the methods `checkpoint`, `commit` and `revert`.

It is best to select the variant that is most appropriate for your unique use case.

### Initialization and Basic Usage

```ts
import { Trie } from '@ethereumjs/trie'
import { bytesToUtf8, MapDB, utf8ToBytes } from '@ethereumjs/util'

const trie = new Trie({ db: new MapDB() })

async function test() {
  await trie.put(utf8ToBytes('test'), utf8ToBytes('one'))
  const value = await trie.get(utf8ToBytes('test'))
  console.log(value ? bytesToUtf8(value) : 'not found') // 'one'
}

test()
```

### Use with static constructors

#### `.create()`

```ts
import { Trie } from '@ethereumjs/trie'
import { bytesToUtf8, utf8ToBytes } from '@ethereumjs/util'

const trie = await Trie.create()

async function test() {
  await trie.put(utf8ToBytes('test'), utf8ToBytes('one'))
  const value = await trie.get(utf8ToBytes('test'))
  console.log(value ? bytesToUtf8(value) : 'not found') // 'one'
}

test()
```

When the static `Trie.create` constructor is used without any options, the `trie` object is instantiated with defaults configured to match the Ethereum production spec (i.e. keys are hashed using SHA256). It also persists the state root of the tree on each write operation, ensuring that your trie remains in the state you left it when you start your application the next time.

#### `.createTrieFromProof()`

```ts
import { Trie } from '@ethereumjs/trie'

async function test() {
  // someOtherTrie is another trie used as an example here for generating merkle proofs necessary for the
  const proof = await someOtherTrie.createProof(someKey)
  const trie = await Trie.createTrieFromProof(proof, { useKeyHashing: true })
  const otherProof = await someOtherTrie.createProof(someOtherKey)
  // To add more proofs to the trie, use `updateTrieFromProof`
  await trie.updateTrieFromProof(otherProof)
  const value = await trie.get(someKey)
  console.log(value)
  const otherValue = await trie.get(someOtherKey)
  console.log(otherValue)
}

test()
```

When the `Trie.createTrieFromProof` constructor is used, it instantiates a new partial trie based only on the branch of the trie contained in the provided proof.

### Walking a Trie

Starting with the v6 release there is a new API for walking and iterating a trie by using an async walk generator, which now enables to walk tries without altering the walk controller and also now enables to walk a sparse (not completely filled) trie.

The new walk functionality can be used like the following:

```ts
import { Trie } from '@ethereumjs/trie'

const trie = await Trie.create()
const walk = trie.walkTrieIterable(trie.root())

for await (const { node, currentKey } of walk) {
  // ... do something i.e. console.log( { node, currentKey } )
}
```

### `Trie` Configuration Options

#### Database Options

The `DB` opt in the `TrieOpts` allows you to use any database that conforms to the `DB` interface to store the trie data in. We provide several [examples](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/trie/examples) for database implementations. The [level.js](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/trie/examples/level.js) example is used in the `ethereumjs client` while [lmdb.js](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/trie/examples/lmdb.js) is an alternative implementation that uses the popular [LMDB](https://en.wikipedia.org/wiki/Lightning_Memory-Mapped_Database) as its underlying database.

If no `db` option is provided, an in-memory database powered by [a Javascript Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) will fulfill this role (imported from `@ethereumjs/util`, see [mapDB](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/mapDB.ts) module).

If you want to use an alternative database, you can integrate your own by writing a DB wrapper that conforms to the [`DB` interface](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/db.ts) (in `@ethereumjs/util`). The `DB` interface defines the methods `get`, `put`, `del`, `batch` and `copy` that a concrete implementation of the `DB` interface will need to implement.

##### LevelDB

As an example, to leverage `LevelDB` for all operations then you should create a file with the [following implementation from our recipes](./recipes//level.ts) in your project. Then instantiate your DB and trie as below:

```ts
import { Trie } from '@ethereumjs/trie'
import { Level } from 'level'

import { LevelDB } from './your-level-implementation'

const trie = new Trie({ db: new LevelDB(new Level('MY_TRIE_DB_LOCATION')) })
```

#### Node Deletion (Pruning)

By default, the deletion of trie nodes from the underlying database does not occur in order to avoid corrupting older trie states (as of `v4.2.0`). Should you only wish to work with the latest state of a trie, you can switch to a delete behavior (for example, if you wish to save disk space) by using the `useNodePruning` constructor option (see related release notes in the changelog for further details).

#### Root Persistence

You can enable persistence by setting the `useRootPersistence` option to `true` when constructing a trie through the `Trie.create` function. As such, this value is preserved when creating copies of the trie and is incapable of being modified once a trie is instantiated.

```ts
import { Trie } from '@ethereumjs/trie'

const trie = await Trie.create({
  useRootPersistence: true,
})
```

## Proofs

### Merkle Proofs

The `createProof` and `verifyProof` functions allow you to verify that a certain value does or does not exist within a Merkle Patricia Tree with a given root.

#### Proof-of-Inclusion

The following code demonstrates how to construct and subsequently verify a proof that confirms the existence of the key `test` (which corresponds with the value `one`) within the given trie. This is also known as inclusion, hence the name 'Proof-of-Inclusion.'

```ts
import { Trie } from '@ethereumjs/trie'
import { bytesToUtf8, utf8ToBytes } from '@ethereumjs/util'

const trie = new Trie()

async function test() {
  await trie.put(utf8ToBytes('test'), utf8ToBytes('one'))
  const proof = await trie.createProof(utf8ToBytes('test'))
  const value = await trie.verifyProof(trie.root(), utf8ToBytes('test'), proof)
  console.log(value ? bytesToUtf8(value) : 'not found') // 'one'
}

test()
```

#### Proof-of-Exclusion

The following code demonstrates how to construct and subsequently verify a proof that confirms that the key `test3` does not exist within the given trie. This is also known as exclusion, hence the name 'Proof-of-Exclusion.'

```ts
import { Trie } from '@ethereumjs/trie'
import { bytesToUtf8, utf8ToBytes } from '@ethereumjs/util'

const trie = new Trie()

async function test() {
  await trie.put(utf8ToBytes('test'), utf8ToBytes('one'))
  await trie.put(utf8ToBytes('test2'), utf8ToBytes('two'))
  const proof = await trie.createProof(utf8ToBytes('test3'))
  const value = await trie.verifyProof(trie.root(), utf8ToBytes('test3'), proof)
  console.log(value ? bytesToUtf8(value) : 'null') // null
}

test()
```

#### Invalid Proofs

If `verifyProof` detects an invalid proof, it will throw an error. While contrived, the below example illustrates the resulting error condition in the event a prover tampers with the data in a merkle proof.

```ts
import { Trie } from '@ethereumjs/trie'
import { bytesToUtf8, utf8ToBytes } from '@ethereumjs/util'

const trie = new Trie()

async function test() {
  await trie.put(utf8ToBytes('test'), utf8ToBytes('one'))
  await trie.put(utf8ToBytes('test2'), utf8ToBytes('two'))
  const proof = await trie.createProof(utf8ToBytes('test2'))
  proof[1].reverse()
  try {
    const value = await trie.verifyProof(trie.root(), utf8ToBytes('test2'), proof)
    console.log(value ? bytesToUtf8(value) : 'not found') // results in error
  } catch (err) {
    console.log(err) // Missing node in DB
  }
}

test()
```

### Range Proofs

You may use the `Trie.verifyRangeProof()` function to confirm if the given leaf nodes and edge proof possess the capacity to prove that the given trie leaves' range matches the specific root (which is useful for snap sync, for instance).

## Examples

You can find additional examples complete with detailed explanations [here](./examples/README.md).

## Browser

With the breaking release round in Summer 2023 we have added hybrid ESM/CJS builds for all our libraries (see section below) and have eliminated many of the caveats which had previously prevented a frictionless browser usage.

It is now easily possible to run a browser build of one of the EthereumJS libraries within a modern browser using the provided ESM build. For a setup example see [./examples/browser.html](./examples/browser.html).

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

### Buffer -> Uint8Array

With the breaking releases from Summer 2023 we have removed all Node.js specific `Buffer` usages from our libraries and replace these with [Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) representations, which are available both in Node.js and the browser (`Buffer` is a subclass of `Uint8Array`).

We have converted existing Buffer conversion methods to Uint8Array conversion methods in the [@ethereumjs/util](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/util) `bytes` module, see the respective README section for guidance.

### BigInt Support

With the 5.0.0 release, [BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) takes the place of [BN.js](https://github.com/indutny/bn.js/).

BigInt is a primitive that is used to represent and manipulate primitive `bigint` values that the number primitive is incapable of representing as a result of their magnitude. `ES2020` saw the introduction of this particular feature. Note that this version update resulted in the altering of number-related API signatures and that the minimal build target is now set to `ES2020`.

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

The `Trie` class features optional debug logging.. Individual debug selections can be activated on the CL with `DEBUG=ethjs,[Logger Selection]`.

`ethjs` **must** be included in the `DEBUG` environment variables to enable **any** logs.
Additional log selections can be added with a comma separated list (no spaces). Logs with extensions can be enabled with a colon `:`, and `*` can be used to include all extensions.

`DEBUG=ethjs,thislog,thatlog,otherlog,otherlog:sublog,anotherLog:* node myscript.js`

The following options are available:

| Logger            | Description                                    |
| ----------------- | ---------------------------------------------- |
| `trie`            | minimal info logging for all trie methods      |
| `trie:<METHOD>`   | debug logging for specific trie method         |
| `trie:<METHOD>:*` | verbose debug logging for specific trie method |
| `trie:*`          | verbose debug logging for all trie methods     |

To observe the logging in action at different levels:

Run with minimal logging:

```shell
DEBUG=ethjs,trie npx vitest test/util/log.spec.ts
```

Run with **put** method logging:

```shell
DEBUG=ethjs,trie:PUT npx vitest test/util/log.spec.ts
```

Run with **trie** + **put**/**get**/**del** logging:

```shell
DEBUG=ethjs,trie,trie:PUT,trie:GET,trie:DEL npx vitest test/util/log.spec.ts
```

Run with **findPath** debug logging:

```shell
DEBUG=ethjs,trie:FIND_PATH npx vitest test/util/log.spec.ts
```

Run with **findPath** verbose logging:

```shell
DEBUG=ethjs,trie:FIND_PATH:* npx vitest test/util/log.spec.ts
```

Run with max logging:

```shell
DEBUG=ethjs,trie:* npx vitest test/util/log.spec.ts
```

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
[trie-npm-badge]: https://img.shields.io/npm/v/@ethereumjs/trie.svg
[trie-npm-link]: https://www.npmjs.com/package/@ethereumjs/trie
[trie-issues-badge]: https://img.shields.io/github/issues/ethereumjs/ethereumjs-monorepo/package:%20trie?label=issues
[trie-issues-link]: https://github.com/ethereumjs/ethereumjs-monorepo/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+trie"
[trie-actions-badge]: https://github.com/ethereumjs/ethereumjs-monorepo/workflows/Trie/badge.svg
[trie-actions-link]: https://github.com/ethereumjs/ethereumjs-monorepo/actions?query=workflow%3A%22Trie%22
[trie-coverage-badge]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/branch/master/graph/badge.svg?flag=trie
[trie-coverage-link]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/tree/master/packages/trie
