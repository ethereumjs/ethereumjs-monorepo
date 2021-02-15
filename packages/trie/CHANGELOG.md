# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
(modification: no type change headlines) and this project adheres to
[Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 4.1.0 - 2021-02-16

This release comes with a reworked checkpointing mechanism (PR [#1030](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1030) and subsequently PR [#1035](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1035)). Instead of copying over the whole DB on checkpoints the operations in between checkpoints are now recorded in memory and either applied in batch on a `Trie.checkpoint()` call or discarded along a `Trie.revert()`. This more fine-grained operational mode leads to a substantial performance gain (up to 50x) when working with larger tries.

Another performance related bug has been fixed along PR [#127](https://github.com/ethereumjs/merkle-patricia-tree/pull/127) removing an unnecessary double-serialization call on nodes. This gives a general performance gain of 10-20% on putting new values in a trie.

Other changes:

## New Features

A new exported `WalkController` class has been added and `trie.walkTrie()` has been made a public method along. This allows for creating own custom ways to traverse a trie. PR [#135](https://github.com/ethereumjs/merkle-patricia-tree/pull/135)

### Refactoring, Development and Documentation

- Better `Trie` code documentation, PR [#125](https://github.com/ethereumjs/merkle-patricia-tree/pull/125)
- Internal `Trie` function reordering & partial retwrite, PR [#125](https://github.com/ethereumjs/merkle-patricia-tree/pull/125)
- Added simple integrated profiling, PR [#128](https://github.com/ethereumjs/merkle-patricia-tree/pull/128)
- Reworked benchmarking to be based on `benchmark.js`, basic CI integration, PR [#130](https://github.com/ethereumjs/merkle-patricia-tree/pull/130)
- Upgrade to `ethereumjs-config` `2.0` libs for linting and formatting, PR [#133](https://github.com/ethereumjs/merkle-patricia-tree/pull/133)
- Switched coverage from `coverall` to `codecov`, PR [#137](https://github.com/ethereumjs/merkle-patricia-tree/pull/137)

## [4.0.0] - 2020-04-17

This release introduces a major API upgrade from callbacks to Promises.

Example using async/await syntax:

```typescript
import { BaseTrie as Trie } from 'merkle-patricia-tree'
const trie = new Trie()
async function test() {
  await trie.put(Buffer.from('test'), Buffer.from('one'))
  const value = await trie.get(Buffer.from('test'))
  console.log(value.toString()) // 'one'
}
test()
```

### Breaking Changes

#### Trie methods

See the [docs](https://github.com/ethereumjs/merkle-patricia-tree/tree/master/docs) for the latest Promise-based method signatures.

#### Trie.prove renamed to Trie.createProof

To clarify the method's purpose `Trie.prove` has been renamed to `Trie.createProof`. `Trie.prove` has been deprecated but will remain as an alias for `Trie.createProof` until removed.

#### Trie raw methods

`getRaw`, `putRaw` and `delRaw` were deprecated in `v3.0.0` and have been removed from this release. Instead, please use `trie.db.get`, `trie.db.put`, and `trie.db.del`. If using a `SecureTrie` or `CheckpointTrie`, use `trie._maindb` to override the checkpointing mechanism and interact directly with the db.

#### SecureTrie.copy

`SecureTrie.copy` now includes checkpoint metadata by default. To maintain original behavior of _not_ copying checkpoint state, pass `false` to param `includeCheckpoints`.

### Changed

- Convert trieNode to ES6 class ([#71](https://github.com/ethereumjs/merkle-patricia-tree/pull/71))
- Merge checkpoint and secure interface with their ES6 classes ([#73](https://github.com/ethereumjs/merkle-patricia-tree/pull/73))
- Extract db-related methods from baseTrie ([#74](https://github.com/ethereumjs/merkle-patricia-tree/pull/74))
- \_lookupNode callback to use standard error, response pattern ([#83](https://github.com/ethereumjs/merkle-patricia-tree/pull/83))
- Accept leveldb in constructor, minor fixes ([#92](https://github.com/ethereumjs/merkle-patricia-tree/pull/92))
- Refactor TrieNode, add levelup types ([#98](https://github.com/ethereumjs/merkle-patricia-tree/pull/98))
- Promisify rest of library ([#107](https://github.com/ethereumjs/merkle-patricia-tree/pull/107))
- Use `Nibbles` type for `number[]` ([#115](https://github.com/ethereumjs/merkle-patricia-tree/pull/115))
- Upgrade ethereumjs-util to 7.0.0 / Upgrade level-mem to 5.0.1 ([#116](https://github.com/ethereumjs/merkle-patricia-tree/pull/116))
- Create dual ES5 and ES2017 builds ([#117](https://github.com/ethereumjs/merkle-patricia-tree/pull/117))
- Include checkpoints by default in SecureTrie.copy ([#119](https://github.com/ethereumjs/merkle-patricia-tree/pull/119))
- Rename Trie.prove to Trie.createProof ([#122](https://github.com/ethereumjs/merkle-patricia-tree/pull/122))

### Added

- Support for proofs of null/absence. Dried up prove/verify. ([#82](https://github.com/ethereumjs/merkle-patricia-tree/pull/82))
- Add more Ethereum state DB focused example accessing account values ([#89](https://github.com/ethereumjs/merkle-patricia-tree/pull/89))

### Fixed

- Drop ethereumjs-testing dep and fix bug in branch value update ([#69](https://github.com/ethereumjs/merkle-patricia-tree/pull/69))
- Fix prove and verifyProof in SecureTrie ([#79](https://github.com/ethereumjs/merkle-patricia-tree/pull/79))
- Fixed src code links in docs ([#93](https://github.com/ethereumjs/merkle-patricia-tree/pull/93))

### Dev / Testing / CI

- Update tape to v4.10.1 ([#81](https://github.com/ethereumjs/merkle-patricia-tree/pull/81))
- Org links and git hooks ([#87](https://github.com/ethereumjs/merkle-patricia-tree/pull/87))
- Use module.exports syntax in util files ([#90](https://github.com/ethereumjs/merkle-patricia-tree/pull/90))
- Rename deprecated sha3 consts and func to keccak256 ([#91](https://github.com/ethereumjs/merkle-patricia-tree/pull/91))
- Migrate to Typescript ([#96](https://github.com/ethereumjs/merkle-patricia-tree/pull/96))
- Fix Travis's xvfb service ([#97](https://github.com/ethereumjs/merkle-patricia-tree/pull/97))
- Fix test cases and docs ([#104](https://github.com/ethereumjs/merkle-patricia-tree/pull/104))
- Upgrade CI Provider from Travis to GH Actions ([#105](https://github.com/ethereumjs/merkle-patricia-tree/pull/105))
- Upgrade test suite to TS ([#106](https://github.com/ethereumjs/merkle-patricia-tree/pull/106))
- Better document `_formatNode` ([#109](https://github.com/ethereumjs/merkle-patricia-tree/pull/109))
- Move `failingRefactorTests` to `secure.spec.ts` ([#110](https://github.com/ethereumjs/merkle-patricia-tree/pull/110))
- Fix test suite typos ([#114](https://github.com/ethereumjs/merkle-patricia-tree/pull/110))

[4.0.0]: https://github.com/ethereumjs/merkle-patricia-tree/compare/v3.0.0...v4.0.0

## [3.0.0] - 2019-01-03

This release comes along with some major version bump of the underlying `level`
database storage backend. If you have the library deeper integrated in one of
your projects make sure that the new DB version plays well with the rest of the
code.

The release also introduces modern `ES6` JavaScript for the library (thanks @alextsg)
switching to `ES6` classes and clean inheritance on all the modules.

- Replace `levelup` 1.2.1 + `memdown` 1.0.0 with `level-mem` 3.0.1 and upgrade `level-ws` to 1.0.0, PR [#56](https://github.com/ethereumjs/merkle-patricia-tree/pull/56)
- Support for `ES6` classes, PRs [#57](https://github.com/ethereumjs/merkle-patricia-tree/pull/57), [#61](https://github.com/ethereumjs/merkle-patricia-tree/pull/61)
- Updated `async` and `readable-stream` dependencies (resulting in smaller browser builds), PR [#60](https://github.com/ethereumjs/merkle-patricia-tree/pull/60)
- Updated, automated and cleaned up [API documentation](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/docs/index.md) build, PR [#63](https://github.com/ethereumjs/merkle-patricia-tree/pull/63)

[3.0.0]: https://github.com/ethereumjs/merkle-patricia-tree/compare/v2.3.2...v3.0.0

## [2.3.2] - 2018-09-24

- Fixed a bug in verify proof if the tree contains an extension node with an embedded branch node, PR [#51](https://github.com/ethereumjs/merkle-patricia-tree/pull/51)
- Fixed `_scratch` 'leak' to global/window, PR [#42](https://github.com/ethereumjs/merkle-patricia-tree/pull/42)
- Fixed coverage report leaving certain tests, PR [#53](https://github.com/ethereumjs/merkle-patricia-tree/pull/53)

[2.3.2]: https://github.com/ethereumjs/merkle-patricia-tree/compare/v2.3.1...v2.3.2

## [2.3.1] - 2018-03-14

- Fix OutOfMemory bug when trying to create a read stream on large trie structures
  (e.g. a current state DB from a Geth node), PR [#38](https://github.com/ethereumjs/merkle-patricia-tree/pull/38)
- Fix race condition due to mutated `_getDBs`/`_putDBs`, PR [#28](https://github.com/ethereumjs/merkle-patricia-tree/pull/28)

[2.3.1]: https://github.com/ethereumjs/merkle-patricia-tree/compare/v2.3.0...v2.3.1

## [2.3.0] - 2017-11-30

- Methods for merkle proof generation `Trie.prove()` and verification `Trie.verifyProof()` (see [./proof.js](./proof.js))

[2.3.0]: https://github.com/ethereumjs/merkle-patricia-tree/compare/v2.2.0...v2.3.0

## [2.2.0] - 2017-08-03

- Renamed `root` functions argument to `nodeRef` for passing a node reference
- Make `findPath()` (path to node for given key) a public method

[2.2.0]: https://github.com/ethereumjs/merkle-patricia-tree/compare/v2.1.2...v2.2.0

## [2.1.2] - 2016-03-01

- Added benchmark (see [./benchmarks/](./benchmarks/))
- Updated dependencies

[2.1.2]: https://github.com/ethereumjs/merkle-patricia-tree/compare/v2.1.1...v2.1.2

## [2.1.1] - 2016-01-06

- Added README, API documentation
- Dependency updates

[2.1.1]: https://github.com/ethereumjs/merkle-patricia-tree/compare/2.0.3...v2.1.1

## [2.0.3] - 2015-09-24

- Initial, first of the currently released version on npm

[2.0.3]: https://github.com/ethereumjs/merkle-patricia-tree/compare/1.1.x...2.0.3
