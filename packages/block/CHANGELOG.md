# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
(modification: no type change headlines) and this project adheres to
[Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 3.0.0-beta.2 - 2020-11-12

This is the second beta release towards a final library release, see [beta.1 release notes](https://github.com/ethereumjs/ethereumjs-vm/releases/tag/%40ethereumjs%2Ftx%403.0.0-beta.1) for an overview on the full changes since the last publicly released version.

- Added `freeze` option to allow for block freeze deactivation (e.g. to allow for subclassing block and adding additional parameters), see PR [#941](https://github.com/ethereumjs/ethereumjs-vm/pull/941)
- **Breaking:** Difficulty-depending methods `canonicalDifficulty()` and `validateDifficulty()` in block and header now throw on non-PoW chains, see PR [#937](https://github.com/ethereumjs/ethereumjs-vm/pull/937)
- **Breaking:** Non-blockchain dependent validation checks have been extracted from `validate()` to its own `Block.validateData()` function. For the `validate()` method in block and header `blockchain` is now a mandatory parameter, see PR [#942](https://github.com/ethereumjs/ethereumjs-vm/pull/942)
- Fixed bug where block options have not been passed on to the main constructor from the static factory methods, see PR [#941](https://github.com/ethereumjs/ethereumjs-vm/pull/941)

## 3.0.0-beta.1 - 2020-10-22

### New Package Name

**Attention!** This new version is part of a series of EthereumJS releases all moving to a new scoped package name format. In this case the library is renamed as follows:

- `ethereumjs-block` -> `@ethereumjs/block`

Please update your library references accordingly or install with:

```shell
npm i @ethereumjs/block
```

### TypeScript/Library Import

This is the first TypeScript based release of the library, see PR [#72](https://github.com/ethereumjs/ethereumjs-block/pull/72).
The import structure has slightly changed along:

**TypeScript**

```typescript
import { BlockHeader } from 'ethereumjs-block'
import { Block } from 'ethereumjs-block'
```

**JavaScript/Node.js**

```javascript
const BlockHeader = require('ethereumjs-block').BlockHeader
const Block = require('ethereumjs-block').Block
```

The library now also comes with a **type declaration file** distributed
along with the package published.

### Major Refactoring - Breaking Changes

This release is a major refactoring of the block library to simplify and strengthen its code base.
Refactoring work has been done along PR [#72](https://github.com/ethereumjs/ethereumjs-block/pull/72)
(Promises) and PR [#883](https://github.com/ethereumjs/ethereumjs-vm/pull/883) (refactoring of API
and internal code structure).

#### New Constructor Params

The way to instantiate a new `BlockHeader` or `Block` object has been completely reworked and is
now more explicit, less error prone and produces more `TypeScript` friendly and readable code.

The old direct constructor usage is now discouraged in favor of different dedicated static
factory methods to create new objects.

**Breaking**: While the main constructors can still be called, signatures changed significantly and
your old `new Block(...)`, `new BlockHeader(...)` instantiations won't work any more and needs to be
updated.

**BlockHeader Class**

There are three new factory methods to create a new `BlockHeader`:

1. Pass in a Header-attribute named dictionary to `BlockHeader.fromHeaderData(headerData: HeaderData = {}, opts?: BlockOptions)`:

```typescript
const headerData = {
  number: 15,
  parentHash: '0x6bfee7294bf44572b7266358e627f3c35105e1c3851f3de09e6d646f955725a7',
  difficulty: 131072,
  gasLimit: 8000000,
  timestamp: 1562422144,
}
const header = BlockHeader.fromHeaderData(headerData)
```

2. Create a `BlockHeader` from an RLP-serialized header `Buffer` with `BlockHeader.fromRLPSerializedHeader(serialized: Buffer, opts: BlockOptions)`.

```typescript
const serialized = Buffer.from(
  'f901f7a06bfee7294bf44572b7266358e627f3c35105e1c3851f3de09e6d646f955725a7a01dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347940000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421b9010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000830200000f837a120080845d20ab8080a00000000000000000000000000000000000000000000000000000000000000000880000000000000000',
  'hex'
)
const header = BlockHeader.fromRLPSerializedHeader(serialized)
```

3. Create a `BlockHeader` from an array of `Buffer` values, you can do a first short roundtrip test with:

```typescript
const valuesArray = header.raw()
BlockHeader.fromValuesArray(valuesArray)
```

Generally internal types representing block header values are now closer to their domain representation
(number, difficulty, gasLimit) instead of having everthing represented as a `Buffer`.

**Block Class**

There are analogue new static factories for the `Block` class:

- `Block.fromBlockData(blockData: BlockData = {}, opts?: BlockOptions)`
- `Block.fromRLPSerializedBlock(serialized: Buffer, opts?: BlockOptions)`
- `Block.fromValuesArray(values: BlockBuffer, opts?: BlockOptions)`

Learn more about the full API in the [docs](./docs/README.md).

#### Immutability

The returned block is now frozen and immutable. To work with a maliable block, copy it with `const fakeBlock = Object.create(block)`.

#### Promise-based API

The API of this library is now completely promise-based and the old callback-style interface
has been dropped.

This affects the following methods of the API now being defined as `async` and
returning a `Promise`:

**Header Class**

- `BlockHeader.validate(blockchain: Blockchain, height?: BN): Promise<void>`

**Block Class**

- `Block.genTxTrie(): Promise<void>`
- `Block.validate(blockChain: Blockchain): Promise<void>`
- `Block.validateUncles(blockchain: Blockchain): Promise<void>`

Usage example:

```javascript
try {
  await block.validate(blockchain)
  // Block validation has passed
} catch (err) {
  // handle errors appropriately
}
```

### Header Validation Methods > Signature Changes

**Breaking**: The signatures of the following header validation methods have been updated to take a `parentBlockHeader` instead of a
`parentBlock` input parameter for consistency and removing a circling dependency with `Block`:

- `BlockHeader.canonicalDifficulty(parentBlockHeader: BlockHeader): BN`
- `BlockHeader.validateDifficulty(parentBlockHeader: BlockHeader): boolean`
- `BlockHeader.validateGasLimit(parentBlockHeader: BlockHeader): boolean`

On the `Block` library new corresponding methods have been added which both operate on a block instance and expect a `parentBlock`
as an input parameter.

### New Default Hardfork

**Breaking:** The default HF on the library has been updated from `petersburg` to `istanbul`, see PR [#906](https://github.com/ethereumjs/ethereumjs-vm/pull/906).
The HF setting is now automatically taken from the HF set for `Common.DEAULT_HARDFORK`,
see PR [#863](https://github.com/ethereumjs/ethereumjs-vm/pull/863).

### Dual ES5 and ES2017 Builds

We significantly updated our internal tool and CI setup along the work on
PR [#913](https://github.com/ethereumjs/ethereumjs-vm/pull/913) with an update to `ESLint` from `TSLint`
for code linting and formatting and the introduction of a new build setup.

Packages now target `ES2017` for Node.js builds (the `main` entrypoint from `package.json`) and introduce
a separate `ES5` build distributed along using the `browser` directive as an entrypoint, see
PR [#921](https://github.com/ethereumjs/ethereumjs-vm/pull/921). This will result
in performance benefits for Node.js consumers, see [here](https://github.com/ethereumjs/merkle-patricia-tree/pull/117) for a releated discussion.

### Other Changes

**Features**

- Added `Block.genesis()` and `BlockHeader.genesis()` aliases to create
  a genesis block or header,
  PR [#883](https://github.com/ethereumjs/ethereumjs-vm/pull/883)
- Added `DAO` hardfork support (check for `extraData` attribute if `DAO` HF is active),
  PR [#843](https://github.com/ethereumjs/ethereumjs-vm/pull/843)
- Added the `calcDifficultyFromHeader` constructor option. If this `BlockHeader` is supplied, then the `difficulty` of the constructed `BlockHeader` will be set to the canonical difficulty (also if `difficulty` is set as parameter in the constructor). See [#929](https://github.com/ethereumjs/ethereumjs-vm/pull/929)

**Changes and Refactoring**

- Added Node `10`, `12` support, dropped Node `7` support,
  PR [#72](https://github.com/ethereumjs/ethereumjs-block/pull/72)
- Passing in a blockchain is now optional on `Block.validate()`,
  PR [#883](https://github.com/ethereumjs/ethereumjs-vm/pull/883)
- **Breaking**: `Block.validateTransactions(stringError: true)` now returns a `string[]`,
  PR [#883](https://github.com/ethereumjs/ethereumjs-vm/pull/883)
- **Breaking**: Decoupling of the `Block.serialize()` and `Block.raw()` methods,
  `Block.serialize()` now always returns the RLP-encoded block (signature change!),
  `Block.raw()` always returns the pure `Buffer` array,
  PR [#883](https://github.com/ethereumjs/ethereumjs-vm/pull/883)
- **Breaking**: `Block.toJSON()` now always returns the labeled `JSON` representation,
  removal of the `labeled` function parameter,
  PR [#883](https://github.com/ethereumjs/ethereumjs-vm/pull/883)
- Updated `merkle-patricia-tree` dependency to `v4`,
  PR [#787](https://github.com/ethereumjs/ethereumjs-vm/pull/787)
- Updated `ethereumjs-util` dependency to `v7`,
  PR [#748](https://github.com/ethereumjs/ethereumjs-vm/pull/748)
- Removal of the `async` dependency,
  PR [#72](https://github.com/ethereumjs/ethereumjs-block/pull/72)

**CI and Testing**

- Browser test run on CI,
  PR [#72](https://github.com/ethereumjs/ethereumjs-block/pull/72)
- Karma browser test run config modernization and simplification
  PR [#72](https://github.com/ethereumjs/ethereumjs-block/pull/72)
- Updated test source files to `TypeScript`,
  PR [#72](https://github.com/ethereumjs/ethereumjs-block/pull/72)

**Bug Fixes**

- Signature fix for pre-homestead blocks,
  PR [#67](https://github.com/ethereumjs/ethereumjs-block/issues/67)

## [2.2.2] - 2019-12-17

**MuirGlacier** support by updating to the new difficulty formula as stated
in [EIP-2384](https://eips.ethereum.org/EIPS/eip-2384).

Please note that this release does not contain all the changes merged into
master since the `v2.2.0` release and only backports the difficulty formula
adjustments to support MuirGlacier without having to go through migration to
the `v3.0.0` which contains breaking changes.

[2.2.2]: https://github.com/ethereumjs/ethereumjs-vm/compare/%40ethereumjs%2Fblock%402.2.1...%40ethereumjs%2Fblock%402.2.2

## [2.2.1] - 2019-11-14

**Istanbul** support by updating to the most recent `ethereumjs-tx` version
[v2.1.1](https://github.com/ethereumjs/ethereumjs-tx/releases/tag/v2.1.1).

Please note that this release does not contain all the changes merged into
master since the `v2.2.0` release and only backports the most recent
`ethereumjs-tx` version to allow users to support Istanbul without having
to go through migration to the `v3.0.0` which contains breaking changes.

[2.2.1]: https://github.com/ethereumjs/ethereumjs-vm/compare/%40ethereumjs%2Fblock%402.2.0...%40ethereumjs%2Fblock%402.2.1

## [2.2.0] - 2019-02-06

**Petersburg** (aka `constantinopleFix`) as well as **Goerli**
support/readiness by updating to a supporting `ethereumjs-common` version
[v1.1.0](https://github.com/ethereumjs/ethereumjs-common/releases/tag/v1.1.0),
PR [#64](https://github.com/ethereumjs/ethereumjs-block/pull/64)

**Other Changes:**

- Fixed package size issue by excluding tests and docs from being included in
  the package, PR [#66](https://github.com/ethereumjs/ethereumjs-block/pull/66)
- Error message fixes in `index.js`,
  PR [#62](https://github.com/ethereumjs/ethereumjs-block/pull/62)
- Replace uses of deprecated `new Buffer` with `Buffer.from`,
  PR [#60](https://github.com/ethereumjs/ethereumjs-block/pull/60)
- Remove `ethereumjs-testing` dependency (much smaller dev dependencies),
  PR [#61](https://github.com/ethereumjs/ethereumjs-block/pull/61)

[2.2.0]: https://github.com/ethereumjs/ethereumjs-vm/compare/%40ethereumjs%2Fblock%402.1.0...%40ethereumjs%2Fblock%402.2.0

## [2.1.0] - 2018-10-19

- **Constantinople** support, added difficulty bomb delay (EIP-1234), PR [#54](https://github.com/ethereumjs/ethereumjs-block/pull/54)
- Updated test data, added Constantinople tests, PR [#56](https://github.com/ethereumjs/ethereumjs-block/pull/56), [#57](https://github.com/ethereumjs/ethereumjs-block/pull/57)
- Added `timestamp` field to `setGenesisParams()`, PR [#52](https://github.com/ethereumjs/ethereumjs-block/pull/52)

[2.1.0]: https://github.com/ethereumjs/ethereumjs-vm/compare/%40ethereumjs%2Fblock%402.0.1...%40ethereumjs%2Fblock%402.1.0

## [2.0.1] - 2018-08-08

- Fixes `BlockHeader.prototype.validate()` bug, see PR [#49](https://github.com/ethereumjs/ethereumjs-block/pull/49)

[2.0.1]: https://github.com/ethereumjs/ethereumjs-vm/compare/%40ethereumjs%2Fblock%402.0.0...%40ethereumjs%2Fblock%402.0.1

## [2.0.0] - 2018-06-25

This release introduces both support for different `chains` (`mainnet`, `ropsten`, ...)
and `hardforks` up to the latest applied HF (`byzantium`). Parameters and genesis values
are provided by the new [ethereumjs-common](https://github.com/ethereumjs/ethereumjs-common)
library which also defines the set of supported chains and forks.

Changes in detail:

- New initialization parameters `opts.chain` (default: `mainnet`) and `opts.hardfork`
  (default: `null`, block number-based behaviour), PR [#44](https://github.com/ethereumjs/ethereumjs-block/pull/44)
- Alternatively a `Common` class object can be provided directly with the `opts.common` parameter,
  see [API](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/docs/index.md) docs
- Correct block validation for all know hardforks, PR
  [#47](https://github.com/ethereumjs/ethereumjs-block/pull/47), if no hardfork is set validation logic
  is determined by block number in combination with the `chain` set
- Genesis block initialization depending on the `chain` set (see `ethereumjs-common` for supported chains)
- Extensive test additions to cover the newly introduced capabilities and changes
- Fix default value for `nonce` (empty buffer -> `<Buffer 00 00 00 00 00 00 00 00>`), PR [#42](https://github.com/ethereumjs/ethereumjs-block/pull/42)

[2.0.0]: https://github.com/ethereumjs/ethereumjs-vm/compare/%40ethereumjs%2Fblock%401.7.1...%40ethereumjs%2Fblock%402.0.0

## [1.7.1] - 2018-02-15

- Fix `browserify` issue blocking updates for packages depending on `ethereumjs-block`
  library, PR [#40](https://github.com/ethereumjs/ethereumjs-block/pull/40)
- Updated `ethereumjs/common` dependency, PR [#38](https://github.com/ethereumjs/ethereumjs-block/pull/38)

[1.7.1]: https://github.com/ethereumjs/ethereumjs-vm/compare/%40ethereumjs%2Fblock%401.7.0...%40ethereumjs%2Fblock%401.7.1

## [1.7.0] - 2017-10-11

- `Metro-Byzantium` compatible
- New difficulty formula (EIP 100)
- Difficulty bomb delay (EIP 649)
- Removed `isHomestead`, `isHomesteadReprice` from API methods

[1.7.0]: https://github.com/ethereumjs/ethereumjs-vm/compare/%40ethereumjs%2Fblock%401.6.0...%40ethereumjs%2Fblock%401.7.0

## [1.6.0] - 2017-07-12

- Breakout header-from-rpc as separate module

[1.6.0]: https://github.com/ethereumjs/ethereumjs-vm/compare/%40ethereumjs%2Fblock%401.5.1...%40ethereumjs%2Fblock%401.6.0

## [1.5.1] - 2017-06-04

- Dev dependency updates
- BN for gas limit

[1.5.1]: https://github.com/ethereumjs/ethereumjs-vm/compare/%40ethereumjs%2Fblock%401.5.0...%40ethereumjs%2Fblock%401.5.1

## Older releases:

- [1.5.0](https://github.com/ethereumjs/ethereumjs-vm/compare/%40ethereumjs%2Fblock%401.4.0...%40ethereumjs%2Fblock%401.5.0) - 2017-01-31
- [1.4.0](https://github.com/ethereumjs/ethereumjs-vm/compare/%40ethereumjs%2Fblock%401.3.1...%40ethereumjs%2Fblock%401.4.0) - 2016-12-15
- [1.3.1](https://github.com/ethereumjs/ethereumjs-vm/compare/%40ethereumjs%2Fblock%401.3.0...%40ethereumjs%2Fblock%401.3.1) - 2016-10-14
- [1.3.0](https://github.com/ethereumjs/ethereumjs-vm/compare/%40ethereumjs%2Fblock%401.2.2...%40ethereumjs%2Fblock%401.3.0) - 2017-10-11
