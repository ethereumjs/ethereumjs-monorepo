# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
(modification: no type change headlines) and this project adheres to
[Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 7.1.0 - 2021-07-08

### Distribution Changes

#### Dual ES5 and ES2017 Builds

We significantly updated our internal tool and CI setup along the work on PR [#913](https://github.com/ethereumjs/ethereumjs-monorepo/pull/913) with an update to `ESLint` from `TSLint` for code linting and formatting and the introduction of a new build setup.

Packages now target `ES2017` for Node.js builds (the `main` entrypoint from `package.json`) and introduce a separate `ES5` build distributed along using the `browser` directive as an entrypoint, see PR [#921](https://github.com/ethereumjs/ethereumjs-monorepo/pull/921). This will result in performance benefits for Node.js consumers, see [here](https://github.com/ethereumjs/merkle-patricia-tree/pull/117) for a releated discussion.

#### Included Source Files

Source files from the `src` folder are now included in the distribution build, see PR [#1301](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1301). This allows for a better debugging experience in debug tools like Chrome DevTools by having working source map references to the original sources available for inspection.

### EIP-2098 Support (Compact 64-byte Signatures)

The `signature` module comes with a new helper function `toCompactSig(v: BNLike, r: Buffer, s: Buffer, chainId?: BNLike): string` which allows to convert signature parameters into the format of Compact Signature Representation as defined in [EIP-2098](https://eips.ethereum.org/EIPS/eip-2098).

### Other Changes

- Renamed `bnToRlp()`helper function to `bnToUnpaddedBuffer()`, PR [#1293](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1293)

## 7.0.10 - 2021-03-31

- Added `Address.isPrecompileOrSystemAddress()` method which returns `true` if address is in the address range defined by [EIP-1352](https://eips.ethereum.org/EIPS/eip-1352), PR [#1170](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1170)
- Return `false` (instead of throwing) for non-hex-string values in account module `isValidAddress`, `isValidChecksumAddress`, `isZeroAddress` methods (it now gets enough to just handle the `false` case on function usage), PR [#1173](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1173)

## [7.0.9] - 2021-03-04

This release adds support for very high `chainId` numbers exceeding `MAX_SAFE_INTEGER` (an example is the chain ID `34180983699157880` used for the ephemeral Yolov3 testnet preparing for the `berlin` hardfork, but high chain IDs might be used for things like private test networks and the like as well), see PR [#290](https://github.com/ethereumjs/ethereumjs-util/pull/290).

Function signatures for methods in `address` and `signature` are therefore expanded to allow for a `BNLike` input type (`BN | PrefixedHexString | number | Buffer`) for chain ID related parameters.

All function signatures are still taking in a `number` input for backwards-compatibility reasons. If you use one of the following functions to implement generic use cases in your library where the chain ID is not yet known it is recommended to updated to one of the other input types (with plain `Buffer` likely be the most future-proof). Note that on some functions this changes the return value as well.

- `account`: `toChecksumAddresss(hexAddress: string, eip1191ChainId?: number): string`
  - -> `toChecksumAddress = function(hexAddress: string, eip1191ChainId?: BNLike): string`
- `account`: `isValidChecksumAddress(hexAddress: string, eip1191ChainId?: number)`
  - -> `isValidChecksumAddress(hexAddress: string, eip1191ChainId?: BNLike)`
- `signature`: `ecsign(msgHash: Buffer, privateKey: Buffer, chainId?: number): ECDSASignature`
  - -> `ecsign(msgHash: Buffer, privateKey: Buffer, chainId?: number): ECDSASignature` (return value stays the same on `number` input)
  - -> `ecsign(msgHash: Buffer, privateKey: Buffer, chainId: BNLike): ECDSASignatureBuffer` (changed return value for other type inputs)
- `signature`: `ecrecover(msgHash: Buffer, v: number, r: Buffer, s: Buffer, chainId?: number): Buffer`
  - -> `ecrecover(msgHash: Buffer, v: BNLike, r: Buffer, s: Buffer, chainId?: BNLike): Buffer`
- `signature`: `toRpcSig(v: number, r: Buffer, s: Buffer, chainId?: number): string`
  - -> `toRpcSig(v: BNLike, r: Buffer, s: Buffer, chainId?: BNLike): string`
- `signature`: `isValidSignature(v: number, r: Buffer, s: Buffer, homesteadOrLater: boolean = true, chainId?: number)`
  - -> `isValidSignature(v: BNLike, r: Buffer, s: Buffer, homesteadOrLater: boolean = true, chainId?: BNLike)`

Along there is a new `toType()` helper function which can be used to easily convert to a `BNLike` output type.

[7.0.9]: https://github.com/ethereumjs/ethereumjs-util/compare/v7.0.8...v7.0.9

## [7.0.8] - 2021-02-01

- New `Address.equals(address: Address)` function for easier address equality comparions, PR [#285](https://github.com/ethereumjs/ethereumjs-util/pull/285)
- Fixed a bug in `fromRpcSig()` in the `signature` module not working correctly for chain IDs greater than 110, PR [#287](https://github.com/ethereumjs/ethereumjs-util/pull/287)

[7.0.8]: https://github.com/ethereumjs/ethereumjs-util/compare/v7.0.7...v7.0.8

## [7.0.7] - 2020-10-15

- Removed `stateRoot` check for `Account.isEmpty()` to make emptiness check `EIP-161` compliant, PR [#279](https://github.com/ethereumjs/ethereumjs-util/pull/279)
- Added type `AddressLike` and helper `bnToHex()`, PR [#279](https://github.com/ethereumjs/ethereumjs-util/pull/279)
- Added `account.raw()` which returns a Buffer Array of the raw Buffers for the account in order, PR [#279](https://github.com/ethereumjs/ethereumjs-util/pull/279)

[7.0.7]: https://github.com/ethereumjs/ethereumjs-util/compare/v7.0.6...v7.0.7

## [7.0.6] - 2020-10-07

### New `Account` class

This release adds a new `Account` class intended as a modern replacement for `ethereumjs-account`. It has a shape of `Account(nonce?: BN, balance?: BN, stateRoot?: Buffer, codeHash?: Buffer)`.

**Instantiation**

The static factory methods assist in creating an `Account` object from varying data types: `Object: fromAccountData`, `RLP: fromRlpSerializedAccount`, and `Array: fromValuesArray`.

**Methods**: `isEmpty(): boolean`, `isContract(): boolean`, `serialize(): Buffer`

Example usage:

```typescript
import { Account, BN } from 'ethereumjs-util'

const account = new Account(
  new BN(0), // nonce, default: 0
  new BN(10).pow(new BN(18)), // balance, default: 0
  undefined, // stateRoot, default: KECCAK256_RLP (hash of RLP of null)
  undefined, // codeHash, default: KECCAK256_NULL (hash of null)
)
```

For more info see the documentation, examples of usage in `test/account.spec.ts` or
PR [#275](https://github.com/ethereumjs/ethereumjs-util/pull/275).

### New export: TypeScript types

A new file with helpful TypeScript types has been added to the exports of this project,
see PR [#275](https://github.com/ethereumjs/ethereumjs-util/pull/275).

In this release it contains `BNLike`, `BufferLike`, and `TransformableToBuffer`.

### Address.toBuffer()

The Address class has as a new method `address.toBuffer()` that will give you a copy of the underlying `address.buf`
(PR [#277](https://github.com/ethereumjs/ethereumjs-util/pull/277)).

### `toBuffer()` now converts TransformableToBuffer

The `toBuffer()` exported function now additionally converts any object with a `toBuffer()` method
(PR [#277](https://github.com/ethereumjs/ethereumjs-util/pull/277)).

[7.0.6]: https://github.com/ethereumjs/ethereumjs-util/compare/v7.0.5...v7.0.6

## [7.0.5] - 2020-09-09

This release adds a new module `address` - see [README](https://github.com/ethereumjs/ethereumjs-util#modules) -
with a new `Address` class and type which can be used for creating and representing Ethereum addresses.

Example usage:

```typescript
import { Address } from 'ethereumjs-util'

const pubKey = Buffer.from(
  '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d',
  'hex',
)
const address = Address.fromPublicKey(pubKey)
```

In `TypeScript` the associated `Address` type can be used to more strictly enforce type checks
(e.g. on the length of an address) on function parameters expecting an address input.
So you can declare a function like the following: `myAddressRelatedFunction(Address: address)`
to get more assurance that the address input is correct.

See PR [#186](https://github.com/ethereumjs/ethereumjs-util/pull/186)

[7.0.5]: https://github.com/ethereumjs/ethereumjs-util/compare/v7.0.4...v7.0.5

## [7.0.4] - 2020-08-04

- Fixed `BN.js` and `RLP` re-export failures from TypeScript,
  PR [#270](https://github.com/ethereumjs/ethereumjs-util/pull/270)
- Fixed an issue along large-value input due to a string copy inconsistency
  within the `assertIs*` helper functions, issue affects most methods of the
  library,
  PR [#269](https://github.com/ethereumjs/ethereumjs-util/pull/269)

[7.0.4]: https://github.com/ethereumjs/ethereumjs-util/compare/v7.0.3...v7.0.4

## [7.0.3] - 2020-07-07

This release replaces the `keccak` and `secp256k1` dependencies
(PR [#257](https://github.com/ethereumjs/ethereumjs-util/pull/257))
and instead uses the
[ethereum-cryptography](https://github.com/ethereum/js-ethereum-cryptography)
package that uses native JS implementations for cryptographic primitives
and makes use of modern and forward-compatible N-API implementations in Node
wherever possible.

This is part of a larger initiative led by Nomic Labs to improve the developer
experience within the Ethereum developer ecosystem,
see https://github.com/ethereum/js-organization/issues/18 for context.

**Other Changes:**

- Added `TypeScript` definitions for `ethjs-util` methods,
  PR [#248](https://github.com/ethereumjs/ethereumjs-util/pull/248) and
  PR [#260](https://github.com/ethereumjs/ethereumjs-util/pull/260)

[7.0.3]: https://github.com/ethereumjs/ethereumjs-util/compare/v7.0.2...v7.0.3

## [7.0.2] - 2020-05-25

This patch release re-establishes the state of `v7.0.0` release and upgrades
the `BN.js` re-export version back to `v5` since quick patches for both
the `v5` ([v5.1.2](https://github.com/indutny/bn.js/releases/tag/v5.1.2)) and
the `v4` branch ([v4.11.9](https://github.com/indutny/bn.js/releases/tag/v4.11.9))
have been released to fix interoperability issues between the `BN.js` versions.

This now makes it possible to move to the latest `BN.js` `v5` version and profit
from future upgrades and patches.

An upgrade is highly recommended, the `v7.0.1` release will be marked as
deprecated along this release.

See: Issue [#250](https://github.com/ethereumjs/ethereumjs-util/issues/250)

[7.0.2]: https://github.com/ethereumjs/ethereumjs-util/compare/v7.0.1...v7.0.2

## [7.0.1] - 2020-05-15

[DEPRECATED in favour of v7.0.2]

This patch release downgrades the re-exported `BN.js` version from `v5` to
`v4` (so a continuation of what has being used within the `v6.x` versions).
This is due to some unexpected interoperability problems in libraries using
the older `v4` `BN.js` branch in their some of their respective dependencies.

An upgrade is highly recommended, the `v7.0.0` release will be marked as
deprecated along this release.

See: Issue [#250](https://github.com/ethereumjs/ethereumjs-util/issues/250)

[7.0.1]: https://github.com/ethereumjs/ethereumjs-util/compare/v7.0.0...v7.0.1

## [7.0.0] - 2020-04-30

[DEPRECATED in favour of v7.0.1]

This release comes with significant changes to the API, updated versions of
the core crypto libraries and substantial developer improvements in the form
of a refactored test suite and API documentation.

### API Changes

Changes to the API have been discussed in Issue
[#172](https://github.com/ethereumjs/ethereumjs-util/issues/172) and are
guided by the principles of:

- Make the API more typestrict
- Be less ambiguous regarding accepted values
- Avoid implicit type conversions
- Be more explicit on wrong input (just: throw)

While the implemented changes come with some additional need for manual type
conversions depending on the usage context, they should finally lead to
cleaner usage patterns on the cosuming side and a more predictable, robust and
less error-prone control flow.

Some note: for methods where `Buffer` usage is now enforced you can use the
`Bytes.toBuffer()` method for conversion.

#### Account Module

##### Enforced Hex Prefixing for Address Strings

PR: [#241](https://github.com/ethereumjs/ethereumjs-util/pull/241)

Hex prefixing is now enforced for all address string inputs and functions
will throw if a non-hex string is provided:

- `Account.isValidAddress()`
- `Account.isZeroAddress()`
- `Account.toChecksumAddress()`
- `Account.isValidChecksumAddress()`

The `Account.isPrecompile()` method was removed from the code base,
PR [#242](https://github.com/ethereumjs/ethereumjs-util/pull/242)

##### Enforce Buffer Inputs for Account Methods

PR: [#245](https://github.com/ethereumjs/ethereumjs-util/pull/245)

Implicit `Buffer` conversions for the following methods have been removed
and `Buffer` inputs are now enforced:

- `Account.generateAddress()`
- `Account.generateAddress2()`
- `Account.pubToAddress()`
- `AccountprivateToPublic()`
- `AccountimportPublic()`

#### Bytes Module

##### Typestrict Methods and Type-Explicit Method Split-Up

PR: [#244](https://github.com/ethereumjs/ethereumjs-util/pull/244)

- Enforced `Buffer` input for `Bytes.setLengthLeft()`, `Bytes.setLengthRight()`
- `Bytes.setLength()` has been removed (alias for `Bytes.setLengthLeft()`)
- `Bytes.stripZeros()` has been removed (alias for `Bytes.unPad()`)
- `Bytes.unpad` has been split up into:
  - `Bytes.unpadBuffer()`
  - `Bytes.unpadHexString()`
  - `Bytes.unpadArray()`

#### Hash Module

##### Typestrict Methods and Type-Explicit Method Split-Up

PR [#247](https://github.com/ethereumjs/ethereumjs-util/pull/247)

The following methods are now `Buffer`-only:

- `Hash.keccak()`
- `Hash.keccak256()`
- `Hash.sha256()`
- `Hash.ripemd160()`

`Hash.keccak()` gets the following additional convenience methods:

- `Hash.keccakFromString()`
- `Hash.keccakFromHexString()` (hex string enforced)
  `Hash.keccakFromArray()`

`Hash.sha256()` gets the following additional convenience methods:

- `Hash.sha256FromString()`
- `Hash.sha256FromArray()`

`Hash.ripemd160()` gets the following additional convenience methods:

- `Hash.ripemd160FromString()`
- `Hash.ripemd160FromArray()`

#### Other Breaking Changes

- Added support for Node 14,
  PR [#249](https://github.com/ethereumjs/ethereumjs-util/pull/249)
- Dropped support for Node `8` along
  PR [#228](https://github.com/ethereumjs/ethereumjs-util/pull/228)
- Updated `BN.js` library re-export from `4.x` to `5.x`,
  PR [#249], https://github.com/ethereumjs/ethereumjs-util/pull/249
- Removed `secp2561` re-export (use methods provided or import directly),
  PR [#228](https://github.com/ethereumjs/ethereumjs-util/pull/228)

### Cryto Library Updates: Keccak, secp2561

`Keccak` dependency has been updated from `2.1.0` to `3.0.0`. This version
comes with prebuilds for Linux, MacOS and Windows so most users won't need
to have `node-gyp` run on installation.

The version update also brings in feature compatibility with newer Node.js
versions.

The `secp2561` ECDSA dependency has been updated from `3.0.1` to `4.0.1`.

### Developer Improvements

- Refactored test suite (module split-up, headless Firefox and Chrome),
  PR [#231](https://github.com/ethereumjs/ethereumjs-util/pull/231)
- Moved CI from Travis to GitHub Actions,
  PR [#231](https://github.com/ethereumjs/ethereumjs-util/pull/231)
- Improved and updated `TypeDoc` API documentation,
  PR [#232](https://github.com/ethereumjs/ethereumjs-util/pull/232) and
  PR [#236](https://github.com/ethereumjs/ethereumjs-util/pull/236)
- Basic API tests for re-exports (BN.js, RLP, ethjsUtil),
  PR [#235](https://github.com/ethereumjs/ethereumjs-util/pull/235)

[7.0.0]: https://github.com/ethereumjs/ethereumjs-util/compare/v6.2.0...v7.0.0

## [6.2.0] - 2019-11-06

This release comes with a new file structure, related functionality is now broken
down into separate files (like `account.js`) allowing for more oversight and
modular integration. All functionality is additionally exposed through an
aggregating `index.js` file, so this version remains backwards-compatible.

Overview on the new structure:

- `account`: Private/public key and address-related functionality
  (creation, validation, conversion)
- `byte`: Byte-related helper and conversion functions
- `constants`: Exposed constants (e.g. `KECCAK256_NULL_S` for the string
  representation of the Keccak-256 hash of null)
- `hash`: Hash functions
- `object`: Helper function for creating a binary object (`DEPRECATED`)
- `signature`: Signing, signature validation, conversion, recovery

See associated PRs [#182](https://github.com/ethereumjs/ethereumjs-util/pull/182)
and [#179](https://github.com/ethereumjs/ethereumjs-util/pull/179).

**Features**

- `account`: Added `EIP-1191` address checksum algorithm support for
  `toChecksumAddress()`,
  PR [#204](https://github.com/ethereumjs/ethereumjs-util/pull/204)

**Bug Fixes**

- `bytes`: `toBuffer()` conversion function now throws if strings aren't
  `0x`-prefixed hex values making the behavior of `toBuffer()` more predictable
  respectively less error-prone (you might generally want to check cases in your
  code where you eventually allowed non-`0x`-prefixed input before),
  PR [#197](https://github.com/ethereumjs/ethereumjs-util/pull/197)

**Dependencies / Environment**

- Dropped Node `6`, added Node `11` and `12` to officially supported Node versions,
  PR [#207](https://github.com/ethereumjs/ethereumjs-util/pull/207)
- Dropped `safe-buffer` dependency,
  PR [#182](https://github.com/ethereumjs/ethereumjs-util/pull/182)
- Updated `rlp` dependency from `v2.0.0` to `v2.2.3` (`TypeScript` improvements
  for RLP hash functionality),
  PR [#187](https://github.com/ethereumjs/ethereumjs-util/pull/187)
- Made `@types/bn.js` a `dependency` instead of a `devDependency`,
  PR [#205](https://github.com/ethereumjs/ethereumjs-util/pull/205)
- Updated `keccak256` dependency from `v1.4.0` to `v2.0.0`, PR [#168](https://github.com/ethereumjs/ethereumjs-util/pull/168)

[6.2.0]: https://github.com/ethereumjs/ethereumjs-util/compare/v6.1.0...v6.2.0

## [6.1.0] - 2019-02-12

First **TypeScript** based release of the library, now also including a
**type declaration file** distributed along with the package published,
see PR [#170](https://github.com/ethereumjs/ethereumjs-util/pull/170).

**Bug Fixes**

- Fixed a bug in `isValidSignature()` not correctly returning `false`
  if passed an `s`-value greater than `secp256k1n/2` on `homestead` or later.
  If you use the method signature with more than three arguments (so not just
  passing in `v`, `r`, `s` and use it like `isValidSignature(v, r, s)` and omit
  the optional args) please read the thread from
  PR [#171](https://github.com/ethereumjs/ethereumjs-util/pull/171) carefully
  and check your code.

**Development**

- Updated `@types/node` to Node `11` types,
  PR [#175](https://github.com/ethereumjs/ethereumjs-util/pull/175)
- Changed browser from Chrome to ChromeHeadless,
  PR [#156](https://github.com/ethereumjs/ethereumjs-util/pull/156)

[6.1.0]: https://github.com/ethereumjs/ethereumjs-util/compare/v6.0.0...v6.1.0

## [6.0.0] - 2018-10-08

- Support for `EIP-155` replay protection by adding an optional `chainId` parameter
  to `ecsign()`, `ecrecover()`, `toRpcSig()` and `isValidSignature()`, if present the
  new signature format relying on the `chainId` is used, see PR [#143](https://github.com/ethereumjs/ethereumjs-util/pull/143)
- New `generateAddress2()` for `CREATE2` opcode (`EIP-1014`) address creation
  (Constantinople HF), see PR [#146](https://github.com/ethereumjs/ethereumjs-util/pull/146)
- [BREAKING] Fixed signature to comply with Geth and Parity in `toRpcSig()` changing
  `v` from 0/1 to 27/28, this changes the resulting signature buffer, see PR [#139](https://github.com/ethereumjs/ethereumjs-util/pull/139)
- [BREAKING] Remove deprecated `sha3`-named constants and methods (see `v5.2.0` release),
  see PR [#154](https://github.com/ethereumjs/ethereumjs-util/pull/154)

[6.0.0]: https://github.com/ethereumjs/ethereumjs-util/compare/v5.2.0...v6.0.0

## [5.2.0] - 2018-04-27

- Rename all `sha3` hash related constants and functions to `keccak`, see
  [this](https://github.com/ethereum/EIPs/issues/59) EIP discussion for context
  (tl;dr: Ethereum uses a slightly different hash algorithm then in the official
  `SHA-3` standard)
- Renamed constants:
  - `SHA3_NULL_S` -> `KECCAK256_NULL_S`
  - `SHA3_NULL` -> `KECCAK256_NULL`
  - `SHA3_RLP_ARRAY_S` -> `KECCAK256_RLP_ARRAY_S`
  - `SHA3_RLP_ARRAY` -> `KECCAK256_RLP_ARRAY`
  - `SHA3_RLP_S` -> `KECCAK256_RLP_S`
  - `SHA3_RLP` -> `KECCAK256_RLP`
- Renamed functions:
  - `sha3()` -> `keccak()` (number of bits determined in arguments)
- New `keccak256()` alias function for `keccak(a, 256)`
- The usage of the `sha`-named versions is now `DEPRECATED` and the related
  constants and functions will be removed on the next major release `v6.0.0`

[5.2.0]: https://github.com/ethereumjs/ethereumjs-util/compare/v5.1.5...v5.2.0

## [5.1.5] - 2018-02-28

- Fix `browserify` issue leading to 3rd-party build problems, PR [#119](https://github.com/ethereumjs/ethereumjs-util/pull/119)

[5.1.5]: https://github.com/ethereumjs/ethereumjs-util/compare/v5.1.4...v5.1.5

## [5.1.4] - 2018-02-03

- Moved to `ES5` Node distribution version for easier toolchain integration, PR [#114](https://github.com/ethereumjs/ethereumjs-util/pull/114)
- Updated `isPrecompile()` with Byzantium precompile address range, PR [#115](https://github.com/ethereumjs/ethereumjs-util/pull/115)

[5.1.4]: https://github.com/ethereumjs/ethereumjs-util/compare/v5.1.3...v5.1.4

## [5.1.3] - 2018-01-03

- `ES6` syntax updates
- Dropped Node `5` support
- Moved babel to dev dependencies, switched to `env` preset
- Usage of `safe-buffer` instead of Node `Buffer`
- Do not allow capital `0X` as valid address in `isValidAddress()`
- New methods `zeroAddress()` and `isZeroAddress()`
- Updated dependencies

[5.1.3]: https://github.com/ethereumjs/ethereumjs-util/compare/v5.1.2...v5.1.3

## [5.1.2] - 2017-05-31

- Add browserify for `ES2015` compatibility
- Fix hex validation

[5.1.2]: https://github.com/ethereumjs/ethereumjs-util/compare/v5.1.1...v5.1.2

## [5.1.1] - 2017-02-10

- Use hex utils from `ethjs-util`
- Move secp vars into functions
- Dependency updates

[5.1.1]: https://github.com/ethereumjs/ethereumjs-util/compare/v5.1.0...v5.1.1

## [5.1.0] - 2017-02-04

- Fix `toRpcSig()` function
- Updated Buffer creation (`Buffer.from`)
- Dependency updates
- Fix npm error
- Use `keccak` package instead of `keccakjs`
- Helpers for `eth_sign` RPC call

[5.1.0]: https://github.com/ethereumjs/ethereumjs-util/compare/v5.0.1...v5.1.0

## [5.0.1] - 2016-11-08

- Fix `bufferToHex()`

[5.0.1]: https://github.com/ethereumjs/ethereumjs-util/compare/v5.0.0...v5.0.1

## [5.0.0] - 2016-11-08

- Added `isValidSignature()` (ECDSA signature validation)
- Change `v` param in `ecrecover()` from `Buffer` to `int` (breaking change!)
- Fix property alias for setting with initial parameters
- Reject invalid signature lengths for `fromRpcSig()`
- Fix `sha3()` `width` param (byte -> bit)
- Fix overflow bug in `bufferToInt()`

[5.0.0]: https://github.com/ethereumjs/ethereumjs-util/compare/v4.5.0...v5.0.0

## [4.5.0] - 2016-17-12

- Introduced `toMessageSig()` and `fromMessageSig()`

[4.5.0]: https://github.com/ethereumjs/ethereumjs-util/compare/v4.4.1...v4.5.0

## Older releases:

- [4.4.1](https://github.com/ethereumjs/ethereumjs-util/compare/v4.4.0...v4.4.1) - 2016-05-20
- [4.4.0](https://github.com/ethereumjs/ethereumjs-util/compare/v4.3.1...v4.4.0) - 2016-04-26
- [4.3.1](https://github.com/ethereumjs/ethereumjs-util/compare/v4.3.0...v4.3.1) - 2016-04-25
- [4.3.0](https://github.com/ethereumjs/ethereumjs-util/compare/v4.2.0...v4.3.0) - 2016-03-23
- [4.2.0](https://github.com/ethereumjs/ethereumjs-util/compare/v4.1.0...v4.2.0) - 2016-03-18
- [4.1.0](https://github.com/ethereumjs/ethereumjs-util/compare/v4.0.0...v4.1.0) - 2016-03-08
- [4.0.0](https://github.com/ethereumjs/ethereumjs-util/compare/v3.0.0...v4.0.0) - 2016-02-02
- [3.0.0](https://github.com/ethereumjs/ethereumjs-util/compare/v2.0.0...v3.0.0) - 2016-01-20
