# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
(modification: no type change headlines) and this project adheres to
[Semantic Versioning](http://semver.org/spec/v2.0.0.html).


# 5.4.0 - 2021-07-08

### Finalized London HF Support

This release integrates a `Common` library version which provides the `london` HF blocks for all networks including `mainnet` and is therefore the first release with finalized London HF support.

# 5.3.1 - 2021-06-25

### PoA Reorg Fix

This release includes a fix for blockchain's reorg logic when handling PoA chains. PR [#1253](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1253) fixes this to choose the fork with the larger total difficulty and rebuilds the internal clique snapshots accordingly.

### Included Source Files

Source files from the `src` folder are now included in the distribution build, see PR [#1301](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1301). This allows for a better debugging experience in debug tools like Chrome DevTools by having working source map references to the original sources available for inspection.

## 5.3.0 - 2021-05-26

### Functional London HF Support (no finalized HF blocks yet)

This release comes with full functional `london` HF support (all EIPs are finalized and integrated and `london` HF can be activated, there are no final block numbers for the HF integrated though yet) by setting the `Block`, `Tx` and `Common` dependencies to versions which ensure a working set of `london`-enabled library versions. In particular this allows for running a blockchain with EIP-1559 blocks and transactions.

Please note that the default HF is still set to `istanbul`. You therefore need to explicitly set the `hardfork` parameter for instantiating a `Blockchain` instance with a `london` HF activated:

```typescript
import Blockchain from '@ethereumjs/blockchain'
import Common from '@ethereumjs/common'
const common = new Common({ chain: 'mainnet', hardfork: 'london' })
const blockchain = await Blockchain.create({ common })
```

### Other Changes

- New `hardforkByHeadBlockNumber` option to set the HF to the fork determined by the head block and update on head updates (default: `false`), PR [#1148](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1148)

## 5.2.1 - 2021-03-26

- Fixed a bug leading `Blockchain` to fail instantiating with a `common` **custom chain** setup when no `genesisBlock` was provided, PR [#1167](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1167)

## 5.2.0 - 2021-03-18

### Berlin HF Support

This release comes with full `berlin` HF support by setting the `Block`, `Tx` and `Common` dependencies to versions which ensure a working set of `berlin`-enabled library versions. In particular this allows for running a blockchain with blocks containing typed transactions.

Please note that the default HF is still set to `istanbul`. You therefore need to explicitly set the `hardfork` parameter for instantiating a `Blockchain` instance with a `berlin` HF activated:

```typescript
import Blockchain from '@ethereumjs/blockchain'
import Common from '@ethereumjs/common'
const common = new Common({ chain: 'mainnet', hardfork: 'berlin' })
const blockchain = await Blockchain.create({ common })
```

#### EthereumJS Libraries - Typed Transactions Readiness

If you are using this library in conjunction with other EthereumJS libraries make sure to minimally have the following library versions installed for typed transaction support:

- `@ethereumjs/common` `v2.2.0`
- `@ethereumjs/tx` `v3.1.0`
- `@ethereumjs/block` `v3.2.0`
- `@ethereumjs/blockchain` `v5.2.0`
- `@ethereumjs/vm` `v5.2.0`

## 5.1.0 2021-02-22

### Clique/PoA Support

This release introduces Clique/PoA support for the `Blockchain` library, see the main PR [#1032](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1032) as well as the follow-up PRs [#1074](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1074) and PR [#1088](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1088).

The blockchain package now keeps track of the latest signers and votes on new Clique/PoA signers and saves them to DB. Block format validation is now also taking all the Clique/PoA specifics into account (`extraData` format and other formal requirements from the EIP) and consensus validation is now also working for Clique/PoA chains (this verifies the respective block signatures from the corresponding authorized signers) and can be activated with the `validateConsensus` constructor flag. There is a new public method `Blockchain.cliqueActiveSigners()` to get the currently active signer list.

### Other Features/Changes

- Added optional `maxBlocks` parameter to `Blockchain.iterator()` method, PR [#965](https://github.com/ethereumjs/ethereumjs-monorepo/pull/965)
- `Blockchain.iterator()` now returns a `number` (instead of `void`) with the blocks actually iterated (the `Blockchain` interface allows for both for backwards-compatibility reasons for now, `void` is considered deprecated though), PR [#1065](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1065)
- Blocks in the blockchain package are now always created with the `hardforkByBlockNumber` option set to `true` to avoid inconsistencies in block behavior, PR [#1089](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1089)
- New `Blockchain.setHead(tag: string, headHash: Buffer)` method to set a specific iterator head to a certain block, PR [#965](https://github.com/ethereumjs/ethereumjs-monorepo/pull/965)
- Added `debug` logger integration, first `blockchain:clique` debug logger (see README), PR [#1103](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1103)
- Fixed a bug in the validation logic to only validate the block header if a header is passed to the internal `Blockchain._putBlockOrHeader()` function, PR [#1105](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1105)

## 5.0.0 - 2020-11-24

### New Package Name

**Attention!** This new version is part of a series of EthereumJS releases all moving to a new scoped package name format. In this case the library is renamed as follows:

- `ethereumjs-blockchain` -> `@ethereumjs/blockchain`

Please update your library references accordingly or install with:

```shell
npm i @ethereumjs/blockchain
```

### Library Promisification

The `Blockchain` library has been promisified and callbacks have been removed along PR [#833](https://github.com/ethereumjs/ethereumjs-monorepo/pull/833) and preceeding PR [#779](https://github.com/ethereumjs/ethereumjs-monorepo/pull/779).

Old API example:

```typescript
blockchain.getBlock(blockId, (block) => {
  console.log(block)
})
```

New API example:

```typescript
const block = await blockchain.getBlock(blockId)
console.log(block)
```

See `Blockchain` [README](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/blockchain#example) for a complete example.

**Safe Static Constructor**

The library now has an additional safe static constructor `Blockchain.create()` which awaits the init method and throws if the init method throws:

```typescript
import Blockchain from '@ethereumjs/blockchain'
const common = new Common({ chain: 'ropsten' })
const blockchain = await Blockchain.create({ common })
```

This is the new recommended way to instantiate a `Blockchain` object, see PR [#930](https://github.com/ethereumjs/ethereumjs-monorepo/pull/930).

Constructor options (both for the static and the main constructor) for chain setup on all VM monorepo libraries have been simplified and the plain `chain` and `hardfork` options have been removed. Passing in a `Common` instance is now the single way to switch to a non-default chain (`mainnet`) or start a blockchain with a higher than `chainstart` hardfork, see PR [#863](https://github.com/ethereumjs/ethereumjs-monorepo/pull/863).

**Refactored Genesis Block Handling Mechanism**

Genesis handling has been reworked to now be safer and reduce the risk of wiping a blockchain by setting a new genesis, see PR [#930](https://github.com/ethereumjs/ethereumjs-monorepo/pull/930).

**Breaking**: The dedicated `setGenesisBlock()` methods and the optional `isGenesis` option on `Blockchain.putBlock()` have been removed. Instead the genesis block is created on initialization either from the `Common` library instance passed or a custom genesis block passed along with the `genesisBlock` option. If a custom genesis block is used, this custom block now always has to be passed along on `Blockchain` initialization, also when operating on an already existing DB. 

### Removed deprecated `validate` option

The deprecated `validate` option has been removed, please use `valdiateBlock` and `validatePow` for options when instantiating a new `Blockchain`.

### Dual ES5 and ES2017 Builds

We significantly updated our internal tool and CI setup along the work on PR [#913](https://github.com/ethereumjs/ethereumjs-monorepo/pull/913) with an update to `ESLint` from `TSLint` for code linting and formatting and the introduction of a new build setup.

Packages now target `ES2017` for Node.js builds (the `main` entrypoint from `package.json`) and introduce a separate `ES5` build distributed along using the `browser` directive as an entrypoint, see PR [#921](https://github.com/ethereumjs/ethereumjs-monorepo/pull/921). This will result in performance benefits for Node.js consumers, see [here](https://github.com/ethereumjs/merkle-patricia-tree/pull/117) for a releated discussion.

### Other Changes

**Changes and Refactoring**

- **Breaking:** `validatePow` option has been renamed to `validateConsensus` to prepare for a future integration of non-PoW (PoA) consensus mechanisms, `validateConsensus` as well as `validateBlocks` options now throw when set to `true` for validation on a non-PoW chain (determined by `Common`, e.g. 'goerli'), see PR [#937](https://github.com/ethereumjs/ethereumjs-monorepo/pull/937)
- Exposed private `Blockchain._getTd()` total difficulty function as `Blockchain.getTotalDifficulty()`, PR [#956](https://github.com/ethereumjs/ethereumjs-monorepo/issues/956)
- Refactored `DBManager` with the introduction of an abstract DB operation handling mechanism, if you have modified `DBManager` in your code this will be a **potentially breaking** change for you, PR [#927](https://github.com/ethereumjs/ethereumjs-monorepo/pull/927)
- Renaming of internal variables like `Blockchain._headBlock`, if you are using these variables in your code this will be a **potentially breaking** change for you, PR [#930](https://github.com/ethereumjs/ethereumjs-monorepo/pull/930)
- Made internal `_` methods like `_saveHeads()` private, if you are using these functions in your code this will be a **potentially breaking** change for you, PR [#930](https://github.com/ethereumjs/ethereumjs-monorepo/pull/930)
- Improved code documentation, PR [#930](https://github.com/ethereumjs/ethereumjs-monorepo/pull/930)
- Fixed potential blockchain DB concurrency issues along PR [#930](https://github.com/ethereumjs/ethereumjs-monorepo/pull/930)
- Use `@ethereumjs/block` `v3.0.0` block library version, PR [#883](https://github.com/ethereumjs/ethereumjs-monorepo/pull/883)
- Removed `async` dependency, PR [#779](https://github.com/ethereumjs/ethereumjs-monorepo/pull/779)
- Updated `ethereumjs-util` to v7, PR [#748](https://github.com/ethereumjs/ethereumjs-monorepo/pull/748)

**Bug Fixes**

- Fixed blockchain hanging forever in case code throws between a semaphore `lock`/`unlock`,
  Issue [#877](https://github.com/ethereumjs/ethereumjs-monorepo/issues/877)

**Testing and CI**

- Dedicated `blockchain` reorg test setup and executable test, PR [#926](https://github.com/ethereumjs/ethereumjs-monorepo/pull/926)

## 5.0.0-rc.1 2020-11-19

This is the first release candidate towards a final library release, see [beta.2](https://github.com/ethereumjs/ethereumjs-monorepo/releases/tag/%40ethereumjs%2Fblockchain%405.0.0-beta.2) and especially [beta.1](https://github.com/ethereumjs/ethereumjs-monorepo/releases/tag/%40ethereumjs%2Fblockchain%405.0.0-beta.1) release notes for an overview on the full changes since the last publicly released version.

- Exposed private `Blockchain._getTd()` total difficulty function as `Blockchain.getTotalDifficulty()`, PR [#956](https://github.com/ethereumjs/ethereumjs-monorepo/issues/956)

## 5.0.0-beta.2 - 2020-11-12

This is the second beta release towards a final library release, see [beta.1 release notes](https://github.com/ethereumjs/ethereumjs-monorepo/releases/tag/%40ethereumjs%2Fblockchain%405.0.0-beta.1) for an overview on the full changes since the last publicly released version.

This release introduces **new breaking changes**, so please carefully read the additional release note sections!

**Safe Static Constructor**

The library now has an additional safe static constructor `Blockchain.create()` which awaits the init method and throws if the init method throws:

```typescript
const common = new Common({ chain: 'ropsten' })
const blockchain = await Blockchain.create({ common })
```

This is the new recommended way to instantiate a `Blockchain` object, see PR [#930](https://github.com/ethereumjs/ethereumjs-monorepo/pull/930).

**Refactored Genesis Block Handling Mechanism**

Genesis handling has been reworked to now be safer and reduce the risk of wiping a blockchain by setting a new genesis, see PR [#930](https://github.com/ethereumjs/ethereumjs-monorepo/pull/930).

**Breaking**: The dedicated `setGenesisBlock()` methods and the optional `isGenesis` option on `Blockchain.putBlock()` have been removed. Instead the genesis block is created on initialization either from the `Common` library instance passed or a custom genesis block passed along with the `genesisBlock` option. If a custom genesis block is used, this custom block now always has to be passed along on `Blockchain` initialization, also when operating on an already existing DB. 

**Changes and Refactoring**

- Refactored `DBManager` with the introduction of an abstract DB operation handling mechanism, if you have modified `DBManager` in your code this will be a **potentially breaking** change for you, PR [#927](https://github.com/ethereumjs/ethereumjs-monorepo/pull/927)
- Renaming of internal variables like `Blockchain._headBlock`, if you are using these variables in your code this will be a **potentially breaking** change for you, PR [#930](https://github.com/ethereumjs/ethereumjs-monorepo/pull/930)
- Made internal `_` methods like `_saveHeads()` private, if you are using these functions in your code this will be a **potentially breaking** change for you, PR [#930](https://github.com/ethereumjs/ethereumjs-monorepo/pull/930)
- Improved code documentation, PR [#930](https://github.com/ethereumjs/ethereumjs-monorepo/pull/930)
- Fixed potential blockchain DB concurrency issues along PR [#930](https://github.com/ethereumjs/ethereumjs-monorepo/pull/930)

**Testing and CI**

- Dedicated `blockchain` reorg test setup and executable test, PR [#926](https://github.com/ethereumjs/ethereumjs-monorepo/pull/926)
- **Breaking:** `validatePow` option has been renamed to `validateConsensus` to prepare for a future integration of non-PoW (PoA) consensus mechanisms, `validateConsensus` as well as `validateBlocks` options now throw when set to `true` for validation on a non-PoW chain (determined by `Common`, e.g. 'goerli'), see PR [#937](https://github.com/ethereumjs/ethereumjs-monorepo/pull/937)

## 5.0.0-beta.1 - 2020-10-22

### New Package Name

**Attention!** This new version is part of a series of EthereumJS releases all moving to a new scoped package name format. In this case the library is renamed as follows:

- `ethereumjs-blockchain` -> `@ethereumjs/blockchain`

Please update your library references accordingly or install with:

```shell
npm i @ethereumjs/blockchain
```

### Library Promisification

The `Blockchain` library has been promisified and callbacks have been removed along
PR [#833](https://github.com/ethereumjs/ethereumjs-monorepo/pull/833) and preceeding PR
[#779](https://github.com/ethereumjs/ethereumjs-monorepo/pull/779).

Old API example:

```typescript
blockchain.getBlock(blockId, (block) => {
  console.log(block)
})
```

New API example:

```typescript
const block = await blockchain.getBlock(blockId)
console.log(block)
```

See `Blockchain` [README](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/blockchain#example) for a complete example.

### Constructor API Changes

Constructor options for chain setup on all VM monorepo libraries have been simplified and the plain `chain` and `hardfork` options have been removed. Passing in a `Common` instance is now the single way to switch to a non-default chain (`mainnet`) or start a blockchain with a higher than `chainstart` hardfork, see PR [#863](https://github.com/ethereumjs/ethereumjs-monorepo/pull/863).

Example:

```typescript
import Blockchain from '@ethereumjs/blockchain'
const common = new Common({ chain: 'ropsten', hardfork: 'byzantium' })
const blockchain = new Blockchain({ common })
```

### Removed deprecated `validate` option

The deprecated `validate` option has been removed, please use `valdiateBlock` and `validatePow` for options when instantiating a new `Blockchain`.

### Dual ES5 and ES2017 Builds

We significantly updated our internal tool and CI setup along the work on 
PR [#913](https://github.com/ethereumjs/ethereumjs-monorepo/pull/913) with an update to `ESLint` from `TSLint` 
for code linting and formatting and the introduction of a new build setup.

Packages now target `ES2017` for Node.js builds (the `main` entrypoint from `package.json`) and introduce
a separate `ES5` build distributed along using the `browser` directive as an entrypoint, see
PR [#921](https://github.com/ethereumjs/ethereumjs-monorepo/pull/921). This will result
in performance benefits for Node.js consumers, see [here](https://github.com/ethereumjs/merkle-patricia-tree/pull/117) for a releated discussion.

### Other Changes

**Changes and Refactoring**

- Use `@ethereumjs/block` `v3.0.0` block library version,
  PR [#883](https://github.com/ethereumjs/ethereumjs-monorepo/pull/883)
- Removed `async` dependency,
  PR [#779](https://github.com/ethereumjs/ethereumjs-monorepo/pull/779)
- Updated `ethereumjs-util` to v7,
  PR [#748](https://github.com/ethereumjs/ethereumjs-monorepo/pull/748)

**Bug Fixes**

- Fixed blockchain hanging forever in case code throws between a semaphore `lock`/`unlock`,
  Issue [#877](https://github.com/ethereumjs/ethereumjs-monorepo/issues/877)

## 4.0.4 - 2020-07-27

This release replaces the tilde (`~`) dependency from `ethereumjs-util` for a caret (`^`) one, meaning that any update to `ethereumjs-util` v6 will also be available for this library.

## [4.0.3] - 2019-12-19

Supports `MuirGlacier` by updating `ethereumjs-block` to
[v2.2.2](https://github.com/ethereumjs/ethereumjs-block/releases/tag/v2.2.2)
and `ethereumjs-common` to
[v1.5.0](https://github.com/ethereumjs/ethereumjs-common/releases/tag/v1.5.0).

This release comes also with a completely refactored test suite, see
PR [#134](https://github.com/ethereumjs/ethereumjs-blockchain/pull/134).
Tests are now less coupled and it gets easier to modify tests or extend
the test suite.

[4.0.3]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fblockchain%404.0.2...%40ethereumjs%2Fblockchain%404.0.3

## [4.0.2] - 2019-11-15

Supports Istanbul by updating `ethereumjs-block` to
[v2.2.1](https://github.com/ethereumjs/ethereumjs-block/releases/tag/v2.2.1) which in turn
uses `ethereumjs-tx` [v2.1.1](https://github.com/ethereumjs/ethereumjs-tx/releases/tag/v2.1.1)
which implements EIP-2028 (calldata fee reduction),
PR [#130](https://github.com/ethereumjs/ethereumjs-blockchain/pull/130).

From this release the `validate` flag is deprecated and users are encouraged
to use the more granular flags `validatePow` and `validateBlocks`. For more
on this please see [#121](https://github.com/ethereumjs/ethereumjs-blockchain/pull/121).

For Typescript users this release also comes with a `BlockchainInterface` interface
which the `Blockchain` class implements,
PR [#124](https://github.com/ethereumjs/ethereumjs-blockchain/pull/124).

[4.0.2]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fblockchain%404.0.1...%40ethereumjs%2Fblockchain%404.0.2

## [4.0.1] - 2019-07-01

- Fixes a browser-compatibility issue caused by the library using `util.callbackify`,
  PR [#117](https://github.com/ethereumjs/ethereumjs-blockchain/pull/117)

[4.0.1]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fblockchain%404.0.0...%40ethereumjs%2Fblockchain%404.0.1

## [4.0.0] - 2019-04-26

First **TypeScript** based release of the library. `TypeScript` handles `ES6` transpilation
[a bit differently](https://github.com/Microsoft/TypeScript/issues/2719) (at the
end: cleaner) than `babel` so `require` syntax of the library slightly changes to:

```javascript
let Blockchain = require('ethereumjs-blockchain').default
```

The library now also comes with a **type declaration file** distributed along
with the package published.

This release drops support for Node versions `4` and `6` due to
internal code updates requiring newer Node.js versions and removes the previously
deprecated DB constructor options `opts.blockDb` and `opts.detailsDb`.

**Change Summary:**

- Migration of code base and internal toolchain to `TypeScript`,
  PR [#92](https://github.com/ethereumjs/ethereumjs-blockchain/pull/92)
- Refactoring of `DB` operations introducing a separate `DBManager` class
  (comes along with dropped Node `6` support),
  PR [#91](https://github.com/ethereumjs/ethereumjs-blockchain/pull/91)
- Auto-generated `TSDoc` documentation,
  PR [#98](https://github.com/ethereumjs/ethereumjs-blockchain/pull/98)
- Replaced `safe-buffer` with native Node.js `Buffer` usage (this comes along
  with dropped support for Node `4`),
  PR [#92](https://github.com/ethereumjs/ethereumjs-blockchain/pull/92)
- Dropped deprecated `DB` options,
  PR [#100](https://github.com/ethereumjs/ethereumjs-blockchain/pull/100)

[4.0.0]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fblockchain%403.4.0...%40ethereumjs%2Fblockchain%404.0.0

## [3.4.0] - 2019-02-06

**Petersburg** (aka `constantinopleFix`) as well as **Goerli**
support/readiness by updating to a supporting `ethereumjs-common` version
[v1.1.0](https://github.com/ethereumjs/ethereumjs-common/releases/tag/v1.1.0),
PR [#86](https://github.com/ethereumjs/ethereumjs-blockchain/pull/86)

[3.4.0]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fblockchain%403.3.3...%40ethereumjs%2Fblockchain%403.4.0

## [3.3.3] - 2019-01-03

- Fixed a bug causing the `iterate()` method to fail when an older version
  `levelup` DB instance is passed, see PR [#83](https://github.com/ethereumjs/ethereumjs-blockchain/pull/83)

[3.3.3]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fblockchain%403.3.2...%40ethereumjs%2Fblockchain%403.3.3

## [3.3.2] - 2018-12-20

- Updated `levelup` dependency to `level-mem` `v3.0.1`, PR [#75](https://github.com/ethereumjs/ethereumjs-blockchain/pull/75)
- Fix `putBlock()` edge case, PR [#79](https://github.com/ethereumjs/ethereumjs-blockchain/pull/79)
- Replaced uses of deprecated `new Buffer` with `Buffer.from`, PR [#80](https://github.com/ethereumjs/ethereumjs-blockchain/pull/80)

[3.3.2]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fblockchain%403.3.1...%40ethereumjs%2Fblockchain%403.3.2

## [3.3.1] - 2018-10-26

- Replaced calls to BN.toBuffer() with BN.toArrayLike() so that `ethereumjs-blockchain` can run in a browser environment, PR [#73](https://github.com/ethereumjs/ethereumjs-blockchain/pull/73)

[3.3.1]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fblockchain%403.3.0...%40ethereumjs%2Fblockchain%403.3.1

## [3.3.0] - 2018-10-19

- Constantinople support when using block validation (set with `opts.validate` in constructor),
  update to a Constantinople-ready version of the `ethereumjs-block` dependency (>2.1.0), PR [#71](https://github.com/ethereumjs/ethereumjs-blockchain/pull/71)

[3.3.0]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fblockchain%403.2.1...%40ethereumjs%2Fblockchain%403.3.0

## [3.2.1] - 2018-08-29

- Fixed an issue with the `iterator()` function returning an error on end of block iteration instead of finish gracefully, PR [#64](https://github.com/ethereumjs/ethereumjs-blockchain/pull/64)
- Updated `ethereumjs-common` dependency to `v0.5.0` (custom chain support), PR [#63](https://github.com/ethereumjs/ethereumjs-blockchain/pull/63)

[3.2.1]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fblockchain%403.2.0...%40ethereumjs%2Fblockchain%403.2.1

## [3.2.0] - 2018-08-13

- Added support for setting network and performing hardfork-specific validation by integrating with [ethereumjs-common](https://github.com/ethereumjs/ethereumjs-common), PR [#59](https://github.com/ethereumjs/ethereumjs-blockchain/pull/59)
- Added `Blockchain.putHeader()` and `Blockchain.putHeaders()` functions to provide header-chain functionality (needed by ethereumjs-client), PR [#59](https://github.com/ethereumjs/ethereumjs-blockchain/pull/59)
- Fixed a bug with caching, PR [#59](https://github.com/ethereumjs/ethereumjs-blockchain/pull/59)
- Fixed error propagation in `Blockchain.iterator()`, PR [#60](https://github.com/ethereumjs/ethereumjs-blockchain/pull/60)

[3.2.0]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fblockchain%403.1.0...%40ethereumjs%2Fblockchain%403.2.0

## [3.1.0] - 2018-05-24

- New `getLatestHeader()` and `getLatestBlock()` methods for retrieving the latest header
  respectively full block in the canonical chain, PR [#52](https://github.com/ethereumjs/ethereumjs-blockchain/pull/52)
- Fixed `saveHeads()` bug not storing the internal `headHeader`/`headBlock` header cursors
  to the DB, PR [#52](https://github.com/ethereumjs/ethereumjs-blockchain/pull/52)
- Updated API docs

[3.1.0]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fblockchain%403.0.0...%40ethereumjs%2Fblockchain%403.1.0

## [3.0.0] - 2018-05-18

This release comes with heavy internal changes bringing Geth DB compatibility to the
`ethereumjs-blockchain` library. For a full list of changes and associated discussion
see PR [#47](https://github.com/ethereumjs/ethereumjs-blockchain/pull/47)
(thanks to @vpulim for this amazing work!). To test iterating through your local Geth
chaindata DB you can run the [example](https://github.com/ethereumjs/ethereumjs-blockchain#example)
in the README file.

This allows for various new use cases of the library in the areas of testing, simulation or
running actual blockchain data from a Geth node through the VM. The Geth data model used is
not compatible with the old format where chaindata and metadata have been stored separately on two leveldb
instances, so it is not possible to load an old DB with the new library version (if this causes
problems for you get in touch on GitHub or Gitter!).

Summary of the changes:

- New unified constructor where `detailsDB` and `blockDB` are replaced by a single `db` reference
- Deprecation of the `getDetails()` method now returning an empty object
- `td` and `height` are not stored in the db as meta info but computed as needed
- Block headers and body are stored under two separate keys
- Changes have been made to properly rebuild the chain and number/hash mappings as a result of forks and deletions
- A write-through cache has been added to reduce database reads
- Similar to geth, we now defend against selfish mining vulnerability
- Added many more tests to increase coverage to over 90%
- Updated docs to reflect the API changes
- Updated library dependencies

[3.0.0]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fblockchain%402.1.0...%40ethereumjs%2Fblockchain%403.0.0

## [2.1.0] - 2017-10-11

- `Metro-Byzantium` compatible
- Updated `ethereumjs-block` dependency (new difficulty formula / difficulty bomb delay)

[2.1.0]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fblockchain%402.0.2...%40ethereumjs%2Fblockchain%402.1.0

## [2.0.2] - 2017-09-19

- Tightened dependencies to prevent the `2.0.x` version of the library to break
  after `ethereumjs` Byzantium library updates

[2.0.2]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fblockchain%402.0.1...%40ethereumjs%2Fblockchain%402.0.2

## [2.0.1] - 2017-09-14

- Fixed severe bug adding blocks before blockchain init is complete

[2.0.1]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fblockchain%402.0.0...%40ethereumjs%2Fblockchain%402.0.1

## [2.0.0] - 2017-01-01

- Split `db` into `blockDB` and `detailsDB` (breaking)

[2.0.0]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fblockchain%401.4.2...%40ethereumjs%2Fblockchain%402.0.0

## [1.4.2] - 2016-12-29

- New `getBlocks` API method
- Testing improvements

[1.4.2]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fblockchain%401.4.1...%40ethereumjs%2Fblockchain%401.4.2

## [1.4.1] - 2016-03-01

- Update dependencies to support Windows

[1.4.1]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fblockchain%401.4.0...%40ethereumjs%2Fblockchain%401.4.1

## [1.4.0] - 2016-01-09

- Bump dependencies

[1.4.0]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fblockchain%401.3.4...%40ethereumjs%2Fblockchain%401.4.0

## Older releases:

- [1.3.4](https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fblockchain%401.3.3...%40ethereumjs%2Fblockchain%401.3.4) - 2016-01-08
- [1.3.3](https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fblockchain%401.3.2...%40ethereumjs%2Fblockchain%401.3.3) - 2015-11-27
- [1.3.2](https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fblockchain%401.3.1...%40ethereumjs%2Fblockchain%401.3.2) - 2015-11-27
- [1.3.1](https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fblockchain%401.2.0...%40ethereumjs%2Fblockchain%401.3.1) - 2015-10-23
- 1.2.0 - 2015-10-01
