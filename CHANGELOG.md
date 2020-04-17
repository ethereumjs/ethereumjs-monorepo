# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
(modification: no type change headlines) and this project adheres to
[Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [4.0.0] - 2020-04-17

This release introduces a major API upgrade from callbacks to Promises. Behind the scenes the library and its tests have been refactored to TypeScript.

See the items below for other various updates and fixes included in this release.

- Move `failingRefactorTests` to `secure.spec.ts`, PR [#110](https://github.com/ethereumjs/merkle-patricia-tree/pull/110)
- Better document `_formatNode`, PR [#109](https://github.com/ethereumjs/merkle-patricia-tree/pull/109)
- Promisify rest of library, PR [#107](https://github.com/ethereumjs/merkle-patricia-tree/pull/107)
- Upgrade test suite to TS, PR [#106](https://github.com/ethereumjs/merkle-patricia-tree/pull/106)
- Upgrade from Travis to GH Actions, PR [#105](https://github.com/ethereumjs/merkle-patricia-tree/pull/105)
- Fix test cases and docs, PR [#104](https://github.com/ethereumjs/merkle-patricia-tree/pull/104)
- Refactor TrieNode, add levelup types, PR [#98](https://github.com/ethereumjs/merkle-patricia-tree/pull/98)
- Fix Travis's xvfb service, PR [#97](https://github.com/ethereumjs/merkle-patricia-tree/pull/97)
- Migrate to Typescript, PR [#96](https://github.com/ethereumjs/merkle-patricia-tree/pull/96)
- fixed src code links in docs, PR [#93](https://github.com/ethereumjs/merkle-patricia-tree/pull/93)
- Re-add raw methods, accept leveldb in constructor, minor fixes, PR [#92](https://github.com/ethereumjs/merkle-patricia-tree/pull/92)
- Rename deprecated sha3 consts and func to keccak256, PR [#91](https://github.com/ethereumjs/merkle-patricia-tree/pull/91)
- Use module.exports syntax in util files, PR [#90](https://github.com/ethereumjs/merkle-patricia-tree/pull/90)
- Add more Ethereum state DB focused example accessing account values, PR [#89](https://github.com/ethereumjs/merkle-patricia-tree/pull/89)
- Org links and git hooks, PR [#87](https://github.com/ethereumjs/merkle-patricia-tree/pull/87)
- \_lookupNode callback to use standard error, response pattern, PR [#83](https://github.com/ethereumjs/merkle-patricia-tree/pull/83)
- Support for proofs of null/absence. Dried up prove/verify. PR [#82](https://github.com/ethereumjs/merkle-patricia-tree/pull/82)
- Update tape to v4.10.1, PR [#81](https://github.com/ethereumjs/merkle-patricia-tree/pull/81)
- Fix prove and verifyProof in SecureTrie, PR [#79](https://github.com/ethereumjs/merkle-patricia-tree/pull/79)
- Extract db-related methods from baseTrie, PR [#74](https://github.com/ethereumjs/merkle-patricia-tree/pull/74)
- Merge checkpoint and secure interface with their ES6 classes, PR [#73](https://github.com/ethereumjs/merkle-patricia-tree/pull/73)
- Convert trieNode to ES6 class, PR [#71](https://github.com/ethereumjs/merkle-patricia-tree/pull/71)
- Drop ethereumjs-testing dep and fix bug in branch value update, PR [#69](https://github.com/ethereumjs/merkle-patricia-tree/pull/69)

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
