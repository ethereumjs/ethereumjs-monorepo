# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
(modification: no type change headlines) and this project adheres to
[Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 8.0.6 - 2023-04-20

- Bump `@chainsafe/ssz` dependency to 0.11.1 (no WASM, native SHA-256 implementation, ES2019 compatible, explicit imports), PRs [#2622](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2622), [#2564](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2564) and [#2656](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2656)
- Update ethereum-cryptography from 1.2 to 2.0 (switch from noble-secp256k1 to noble-curves), PR [#2641](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2641)

## 8.0.5 - 2023-02-27

- Pinned `@chainsafe/ssz` dependency to `v0.9.4` due to ES2021 features used in `v0.10.+` causing compatibility issues, PR [#2555](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2555)

## 8.0.4 - 2023-02-21

**DEPRECATED**: Release is deprecated due to broken dependencies, please update to the subsequent bugfix release version.

- Removed `async` library dependency, PR [#2514](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2514)
- New `GWEI_TO_WEI` constant in a newly created `units` module, PR [#2483](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2483)
- Change withdrawal amount representation from Wei to Gwei (see EIP-4895 PR [#6325](https://github.com/ethereum/EIPs/pull/6325)) in `withdrawal` module `Withdrawal` class, PR [#2483](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2483)
  )
- Added `@chainsafe/ssz` dependency, new prepartory `ssz` container module, PR [#2488](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2488)
- Use literal value instead of formula for `MAX_INTEGER_BIGINT`, PR [#2536](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2536)

## 8.0.3 - 2022-12-09

- New `withdrawal` module exposing an `EIP-4895` `Withdrawal`-representing class and other withdrawal helpers (input type, JSON RPC interface), PR [#2401](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2401)

## 8.0.2 - 2022-10-21

- Added internalized and reexported modernized version of the [async-eventemitter](https://www.google.com/search?client=firefox-b-d&q=async-eventemitter+github) library, PR [#2376](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2376)

## 8.0.1 - 2022-10-19

- Added new `Lock` functionality, PR [#2308](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2308)

## 8.0.0 - 2022-09-06

Final release - tada 🎉 - of a wider breaking release round on the [EthereumJS monorepo](https://github.com/ethereumjs/ethereumjs-monorepo) libraries, see the Beta 1 release notes for the main long change set description as well as the Beta 2, Beta 3 and Release Candidate (RC) 1 release notes for notes on some additional changes ([CHANGELOG](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/CHANGELOG.md)).

### Changes

- Internal refactor: removed ambiguous boolean checks within conditional clauses, PR [#2261](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2261)

## 8.0.0-rc.1 - 2022-08-29

Release candidate 1 for the upcoming breaking release round on the [EthereumJS monorepo](https://github.com/ethereumjs/ethereumjs-monorepo) libraries, see the Beta 1 release notes for the main long change set description as well as the Beta 2 and 3 release notes for notes on some additional changes ([CHANGELOG](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/CHANGELOG.md)).

### Changes

- **Breaking:** Renamed `Account.stateRoot` to `Account.storageRoot` for clarity in `account` module, PR [#2140](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2140)

### Maintenance Updates

- Added `engine` field to `package.json` limiting Node versions to v14 or higher, PR [#2164](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2164)
- Replaced `nyc` (code coverage) configurations with `c8` configurations, PR [#2192](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2192)
- Code formats improvements by adding various new linting rules, see Issue [#1935](https://github.com/ethereumjs/ethereumjs-monorepo/issues/1935)

## 8.0.0-beta.3 - 2022-08-10

Beta 3 release for the upcoming breaking release round on the [EthereumJS monorepo](https://github.com/ethereumjs/ethereumjs-monorepo) libraries, see the Beta 1 release notes for the main long change set description as well as the Beta 2 release notes for notes on some additional changes ([CHANGELOG](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/CHANGELOG.md)).

Alignment release without direct changes on the library.

## 8.0.0-beta.2 - 2022-07-15

Beta 2 release for the upcoming breaking release round on the [EthereumJS monorepo](https://github.com/ethereumjs/ethereumjs-monorepo) libraries, see the Beta 1 release notes ([CHANGELOG](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/CHANGELOG.md)) for the main change set description.

### Removed Default Exports

The change with the biggest effect on UX since the last Beta 1 releases is for sure that we have removed default exports all accross the monorepo, see PR [#2018](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2018), we even now added a new linting rule that completely disallows using.

Default exports were a common source of error and confusion when using our libraries in a CommonJS context, leading to issues like Issue [#978](https://github.com/ethereumjs/ethereumjs-monorepo/issues/978).

Now every import is a named import and we think the long term benefits will very much outweigh the one-time hassle of some import adoptions.

The Util library itself has no import changes along this update.

## Other Changes

- Added `ESLint` strict boolean expressions linting rule, PR [#2030](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2030)

## 8.0.0-beta.1 - 2022-06-30

This release is part of a larger breaking release round where all [EthereumJS monorepo](https://github.com/ethereumjs/ethereumjs-monorepo) libraries (VM, Tx, Trie, other) get major version upgrades. This round of releases has been prepared for a long time and we are really pleased with and proud of the result, thanks to all team members and contributors who worked so hard and made this possible! 🙂 ❤️

We have gotten rid of a lot of technical debt and inconsistencies and removed unused functionality, renamed methods, improved on the API and on TypeScript typing, to name a few of the more local type of refactoring changes. There are also broader structural changes like a full transition to native JavaScript `BigInt` values as well as various somewhat deep-reaching refactorings, both within a single package as well as some reaching beyond the scope of a single package. Also two completely new packages - `@ethereumjs/evm` (in addition to the existing `@ethereumjs/vm` package) and `@ethereumjs/statemanager` - have been created, leading to a more modular Ethereum JavaScript VM.

We are very much confident that users of the libraries will greatly benefit from the changes being introduced. However - along the upgrade process - these releases require some extra attention and care since the changeset is both so big and deep reaching. We highly recommend to closely read the release notes, we have done our best to create a full picture on the changes with some special emphasis on delicate code and API parts and give some explicit guidance on how to upgrade and where problems might arise!

So, enjoy the releases (this is a first round of Beta releases, with final releases following a couple of weeks after if things go well)! 🎉

The EthereumJS Team

### New Package Name

**Attention!** This library release aligns (and therefore: changes!) the library name with the other EthereumJS libraries and switches to the new scoped package name format, see PR [#1952](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1952). In this case the library is renamed as follows:

- `ethereumjs-util` -> `@ethereumjs/util`

Please update your library references accordingly and install with:

```shell
npm i @ethereumjs/util
```

### BigInt Introduction / ES2020 Build Target

With this round of breaking releases the whole EthereumJS library stack removes the [BN.js](https://github.com/indutny/bn.js/) library and switches to use native JavaScript [BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) values for large-number operations and interactions.

This makes the libraries more secure and robust (no more BN.js v4 vs v5 incompatibilities) and generally comes with substantial performance gains for the large-number-arithmetic-intense parts of the libraries (particularly the VM).

To allow for BigInt support our build target has been updated to [ES2020](https://262.ecma-international.org/11.0/). We feel that some still remaining browser compatibility issues on the edges (old Safari versions e.g.) are justified by the substantial gains this step brings along.

See [#1671](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1671) and [#1771](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1771) for the core `BigInt` transition PRs.

### Disabled esModuleInterop and allowSyntheticDefaultImports TypeScript Compiler Options

The above TypeScript options provide some semantic sugar like allowing to write an import like `import React from "react"` instead of `import * as React from "react"`, see [esModuleInterop](https://www.typescriptlang.org/tsconfig#esModuleInterop) and [allowSyntheticDefaultImports](https://www.typescriptlang.org/tsconfig#allowSyntheticDefaultImports) docs for some details.

While this is convenient it deviates from the ESM specification and forces downstream users into these options which might not be desirable, see [this TypeScript Semver docs section](https://www.semver-ts.org/#module-interop) for some more detailed argumentation.

Along the breaking releases we have therefore deactivated both of these options and you might therefore need to adopt some import statements accordingly. Note that you still have got the possibility to activate these options in your bundle and/or transpilation pipeline (but now you also have the option to _not_ do which you didn't have before).

### BigInt Helpers and API Changes

The Util library is a utility library for other EthereumJS and third-party libraries. Some core helpers around the newly introduced `BigInt` usage have been added to this library to be available throughout the stack, see `BigInt` related PRs as well as PR [#1825](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1825).

There is a new `BigIntLike` type representing some `BigInt`-compatible type flavors (`bigint | PrefixedHexString | number | Buffer`) and replacing the old `BNLike` type. This is used for typing of various API methods.

In the `bytes` module the generic `toBuffer()` method now also allows for `bigint` input and new helpers `bufferToBigInt()`, `bigIntToBuffer()`, `bigIntToUnpaddedBuffer()` (useful for RLP) and `bigIntToHex()` are introduced.

All `constants` module `BN` constants have been replaced with corresponding `BigInt` versions (same name, so you need to update!).

The `nonce` and `balance` properties from the `Account` class are now taken in and represented as `BigInt` values.

Last but not least the signatures of the following API methods have been changed to take in `BigInt` instead of `BN` values:

- `address`: `Address.generate(from: Address, nonce: bigint): Address`
- `bytes`: `fromSigned(num: Buffer): bigint`
- `bytes`: `toUnsigned(num: bigint): Buffer`
- `signature`: `ecsign(msgHash: Buffer, privateKey: Buffer, chainId?: bigint): ECDSASignature`
- `signature`: `ecrecover(msgHash: Buffer, v: bigint, r: Buffer, s: Buffer, chainId?: bigint): Buffer`
- `signature`: `toRpcSig(v: bigint, r: Buffer, s: Buffer, chainId?: bigint): string)`
- `signature`: `toCompactSig(v: bigint, r: Buffer, s: Buffer, chainId?: bigint): string`
- `signature`: `fromRpcSig(sig: string): ECDSASignature` (see `ECDSASignature` type)

And finally the `BN` export has been removed from the library.

### Hash Module Removal

There is now a stable and audited base layer cryptography and hashing library with [ethereum-cryptography](https://github.com/ethereum/js-ethereum-cryptography), bundling the various Ethereum needs under a single package.

The abstraction layer provided by the `hash` module in the `Util` package is therefore not needed any more and would just be some unnecessary chaining of hash function calls. Therefore the module has been removed from the library in favor of using the `ethereum-cryptography` library directly, see PR [#1859](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1859).

Please replace your hash function calls accordingly.

### Signature Module Clean-Up

The signature code in the `signature` module has been cleaned up and partly refactored.

There is now a single `ECDSASignature` signature TypeScript interface which now takes in `v` as a `BigInt` value and not a `number` any more, the `ECDSASignatureBuffer` interface has been removed.

The previously overloaded (multiple possible signature variations) `ecsign()` function has been simplified and now adheres to only one signature using `BigInt` as `chainId` input and the new `ECDSASignature` format as output:

- `ecsign(msgHash: Buffer, privateKey: Buffer, chainId?: bigint): ECDSASignature`

Various other methods have been moved over to `bigint` usage, see "BigInt Helpers and API Changes" for a summary.

### Other Changes

- Removal of the deprecated `object` module, PR [#1809](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1809)
- Removal of deprecated alias `bigIntToRlp`, PR [#1809](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1809)
- New `bytes` -> `short()` method for `Buffer` string output formatting, PR [#1817](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1817)

## 7.1.5 - 2022-06-02

- More flexible `signature` module methods now allow for passing in `v` values of `0` and `1` in the context of typed txs (e.g. EIP-1559 txs): `ecrecover()`, `toRpcSig()`, `toCompactSig()`, `isValidSignature()`, PR [#1905](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1905)

## 7.1.4 - 2022-02-01

### Buffer <-> Uint8Array Conversion Helpers (RLP v3)

The new RLP [v3](https://github.com/ethereumjs/ethereumjs-monorepo/releases/tag/rlp%403.0.0) release is accepting and returning `Uint8Array` objects instead of `Buffer` for improved browser compatibility and usage.

There are two new helper functions in the `bytes` module from the `Util` library introduced in PR [#1648](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1648) to help with associated Buffer conversions (while this is our main reason for introducing these functions the functionality can of course be used for other things as well):

- `arrToBufArr()`: Converts a `Uint8Array` or `NestedUint8Array` to `Buffer` or `NestedBufferArray`
- `bufArrToArr()`: Converts a `Buffer` or `NestedBufferArray` to `Uint8Array` or `NestedUint8Array`

Note: the RLP version exposed by this package as a re-export is still RLP `v2`. This won't change along additional `v7` Util releases and other current monorepo libraries (VM, Tx,...) are also still using the `v2` RLP version.

### Features

- New `validateNoLeadingZeroes()` function in `bytes` module for validating Buffers to have no leading zeros (mainly within an RLP context), PR [#1568](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1568)
- New `MAX_UINT64` constant which can be used to check if a `BN` instance exceeds the max. possible 64-bit integer value, PR [#1568](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1568)

### Maintenance

- `toBuffer` (`bytes` module) now throws when a negative BN is provided as input, PR [#1606](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1606)
- Dependencies: deduplicated RLP import, PR [#1549](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1549)

## 7.1.3 - 2021-10-12

### Removal of ethjs-util Package Re-Export

This release replaces `ethjs-util` dependency with an `internal.ts` file which re-exports all the used functions (thanks to @talentlessguy for the PR).

This has a list of benefits:

- Less maintenance burden (fewer dependencies to care about)
- Better types and avoids use of deprecated APIs (e.g. new Buffer)
- Smaller bundle/install size

See: PR [#1517](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1517)

### Related Changes / Bug Fixes

- Fixed a bug in `toUtf8` not working correctly with leading or trailing single 0s, see PR [#1522](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1522)
- Rewrote `toUtf8` function and added extended code docs, method now throws on malformed uneven hex input values, see PR [#1525](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1525)

## 7.1.2 - 2021-09-30

- Replaced the `ethjs-util` `intToHex` and `intToBuffer` re-exports with own implementations which throw on wrong integer input (decimal values, non-safe integers, negative numbers,...) to allow for a safer integer type input, PR [#1500](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1500)

## 7.1.1 - 2021-09-24

- Fixed a bug in `toType()` helper function to now return `null`/`undefined` for respective input values, PR [#1477](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1477)
- Add note discouraging use of `EIP-1191` format checksums when using `toChecksumAddress()` (breaks checksum backwards compatibility in current form), PR [#1463](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1463)

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
  undefined // codeHash, default: KECCAK256_NULL (hash of null)
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
  'hex'
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
