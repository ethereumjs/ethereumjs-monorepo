# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
(modification: no type change headlines) and this project adheres to
[Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2020-04-01

Verion 3.0.0 brings modernizations to the code and some **breaking changes** you should be aware of.

### TypeScript/Library Import

First TypeScript based release of the library. The import structure has slightly changed along:

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

### Promise-based API

The API of this library is now completely promise-based, the old callback-style
interface has been dropped.

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

### Different signature for constructor

From now on, it's not allowed to initialize `Block` with a `null` value. If for any reason you need to initialize it without defining a value, use the more semantic `undefined` like the examples below:

```typescript
const b = new Block(undefined, options)
```

or just:

```typescript
const b = new Block()
```

### Change Summary

Other changes along with the `TypeScript` transition PR
[#72](https://github.com/ethereumjs/ethereumjs-block/pull/72)

- Added Node `10`, `12` support, dropped Node `7` support
- Browser test run on CI
- Karma browser test run config modernization and simplification
- Removal of the `async` dependency
- Update `ethereumjs-common` dependency from `v1.1.0` to `v1.5.0`
- Update `ethereumjs-tx` dependency from `v1.2.2` to `v2.1.1`
- Update `ethereumjs-util` dependency from `v5.0.0` to `v6.1.0`
- Updated test source files to `TypeScript`
- Signature fix for pre-homestead blocks, see
  [#67](https://github.com/ethereumjs/ethereumjs-block/issues/67)

[3.0.0]: https://github.com/ethereumjs/ethereumjs-vm/compare/%40ethereumjs%2Fblock%402.2.0...%40ethereumjs%2Fblock%403.0.0

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
