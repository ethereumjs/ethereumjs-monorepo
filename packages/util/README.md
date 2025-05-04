# @ethereumjs/util `v10`

[![NPM Package][util-npm-badge]][util-npm-link]
[![GitHub Issues][util-issues-badge]][util-issues-link]
[![Actions Status][util-actions-badge]][util-actions-link]
[![Code Coverage][util-coverage-badge]][util-coverage-link]
[![Discord][discord-badge]][discord-link]

| A collection of utility functions for Ethereum. |
| ----------------------------------------------- |

## Table of Contents

- [Installation](#installation)
- [Getting Started](#getting-started)
- [Module: [account]](#module-account)
- [Module: [address]](#module-address)
- [Module: [authorization]](#module-authorization)
- [Module: [blobs]](#module-blobs)
- [Module: [bytes]](#module-bytes)
- [Module: [constants]](#module-constants)
- [Module: [db]](#module-db)
- [Module: [genesis]](#module-genesis)
- [Module: [internal]](#module-internal)
- [Module: [kzg]](#module-kzg)
- [Module: [mapDB]](#module-mapdb)
- [Module: [request]](#module-request)
- [Module: [signature]](#module-signature)
- [Module: [types]](#module-types)
- [Module: [verkle]](#module-verkle)
- [Module: [withdrawal]](#module-withdrawal)
- [Browser](#browser)
- [API](#api)
- [EthereumJS](#ethereumjs)
- [License](#license)

## Installation

To obtain the latest version, simply require the project using `npm`:

```shell
npm install @ethereumjs/util
```

## Getting Started

This package contains the following modules providing respective helper methods, classes and commonly re-used constants.

All helpers are re-exported from the root level and deep imports are not necessary. So an import can be done like this:

```ts
import { hexToBytes, isValidChecksumAddress } from '@ethereumjs/util'
```

## Module: [account](src/account.ts)

Class representing an `Account` and providing private/public key and address-related functionality (creation, validation, conversion). It is not recommended to use this constructor directly. Instead use the static factory methods to assist in creating an Account from varying data types.

```ts
// ./examples/account.ts

import { createAccount } from '@ethereumjs/util'

const account = createAccount({
  nonce: '0x02',
  balance: '0x0384',
  storageRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
  codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
})
console.log(`Account with nonce=${account.nonce} and balance=${account.balance} created`)
```

For Verkle or other contexts it can be useful to create partial accounts not containing all the account parameters. This is supported starting with v9.1.0:

```ts
// ./examples/accountPartial.ts

import { createPartialAccount } from '@ethereumjs/util'

const account = createPartialAccount({
  nonce: '0x02',
  balance: '0x0384',
})
console.log(`Partial account with nonce=${account.nonce} and balance=${account.balance} created`)
```

## Module: [address](src/address.ts)

Class representing an Ethereum `Address` with instantiation helpers and validation methods.

```ts
// ./examples/address.ts

import { createAddressFromString } from '@ethereumjs/util'

const address = createAddressFromString('0x2f015c60e0be116b1f0cd534704db9c92118fb6a')
console.log(`Ethereum address ${address.toString()} created`)
```

## Module: [authorization](src/authorization.ts)

Module with `EIP-7702` authorization list signing utilities.

## Module: [blobs](src/blobs.ts)

Module providing helpers for 4844 blobs and versioned hashes.

```ts
// ./examples/blobs.ts

import { bytesToHex, computeVersionedHash, getBlobs } from '@ethereumjs/util'

const blobs = getBlobs('test input')

console.log('Created the following blobs:')
console.log(blobs)

const commitment = bytesToHex(new Uint8Array([1, 2, 3]))
const blobCommitmentVersion = 0x01
const versionedHash = computeVersionedHash(commitment, blobCommitmentVersion)

console.log(`Versioned hash ${versionedHash} computed`)
```

## Module: [bytes](src/bytes.ts)

Byte-related helper and conversion functions.

```ts
// ./examples/bytes.ts

import { bytesToBigInt } from '@ethereumjs/util'

const bytesValue = new Uint8Array([97])
const bigIntValue = bytesToBigInt(bytesValue)

console.log(`Converted value: ${bigIntValue}`)
```

## Module: [constants](src/constants.ts)

Exposed constants (e.g. `KECCAK256_NULL_S` for string representation of Keccak-256 hash of null)

```ts
// ./examples/constants.ts

import { BIGINT_2EXP96, KECCAK256_NULL_S } from '@ethereumjs/util'

console.log(`The keccak-256 hash of null: ${KECCAK256_NULL_S}`)
console.log(`BigInt constants (performance), e.g. BIGINT_2EXP96: ${BIGINT_2EXP96}`)
```

## Module: [db](src/db.ts)

DB interface for database abstraction (Blockchain, Trie), see e.g. [@ethereumjs/trie recipes](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/trie/recipes/level.ts)) for usage.

## Module: [genesis](src/genesis.ts)

Genesis related interfaces and helpers.

## Module: [internal](src/internal.ts)

Internalized simple helper methods like `isHexString`. Note that methods from this module might get deprecated in the future.

## Module: [kzg](src/kzg.ts)

KZG interface (used for 4844 blob txs), see [@ethereumjs/tx](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/tx/README.md#kzg-setup) README for main usage instructions.

## Module: [mapDB](src/mapDB.ts)

Simple map DB implementation using the `DB` interface (see above).

## Module: [request](src/request.ts)

Module with a compact generic request class for [EIP-7685](https://eips.ethereum.org/EIPS/eip-7685) general purpose execution layer requests to the CL (Prague hardfork) with the possibility to set `data` and a `type` conforming to the following request types:

- [EIP-6110](https://eips.ethereum.org/EIPS/eip-6110): `DepositRequest` (Prague Hardfork)
- [EIP-7002](https://eips.ethereum.org/EIPS/eip-7002): `WithdrawalRequest` (Prague Hardfork)
- [EIP-7251](https://eips.ethereum.org/EIPS/eip-7251): `ConsolidationRequest` (Prague Hardfork)

These request types are mainly used within the [@ethereumjs/block](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/block) library where applied usage instructions are provided in the README.

## Module: [signature](src/signature.ts)

Small helpers around signature validation, conversion, recovery as well as selected convenience wrappers for calls to the underlying crypo libraries, using the cryptographic primitive implementations from the [Noble](https://paulmillr.com/noble/) crypto library set. If possible for your use case it is recommended to use the underlying crypto libraries directly for robustness.

```ts
// ./examples/signature.ts

import { bytesToHex, ecrecover, hexToBytes } from '@ethereumjs/util'

const chainId = BigInt(3) // Ropsten

const ecHash = hexToBytes('0x82ff40c0a986c6a5cfad4ddf4c3aa6996f1a7837f9c398e17e5de5cbd5a12b28')
const r = hexToBytes('0x99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9')
const s = hexToBytes('0x129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66')
const v = BigInt(41)

const pubkey = ecrecover(ecHash, v, r, s, chainId)

console.log(`Recovered public key ${bytesToHex(pubkey)} from valid signature values`)
```

## Module: [types](src/types.ts)

Various TypeScript types. Direct usage is not recommended, type structure might change in the future.

## Module: [verkle](src/verkle.ts)

Various functions for accessing verkle state:

```ts
// ./examples/verkle.ts

import {
  VerkleLeafType,
  bytesToHex,
  decodeVerkleLeafBasicData,
  getVerkleKey,
  hexToBytes,
} from '@ethereumjs/util'

const state = {
  '0xdf67dea9181141d6255ac05c7ada5a590fb30a375023f16c31223f067319e300':
    '0x0100000001000000000000000000000001000000000000000000000000000000',
  '0xdf67dea9181141d6255ac05c7ada5a590fb30a375023f16c31223f067319e301':
    '0x923672e5275a0104000000000000000000000000000000000000000000000000',
  '0xdf67dea9181141d6255ac05c7ada5a590fb30a375023f16c31223f067319e302':
    '0x2c01000000000000000000000000000000000000000000000000000000000000',
  '0xdf67dea9181141d6255ac05c7ada5a590fb30a375023f16c31223f067319e303':
    '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
  '0xdf67dea9181141d6255ac05c7ada5a590fb30a375023f16c31223f067319e304': null,
}

const stem = hexToBytes('0xdf67dea9181141d6255ac05c7ada5a590fb30a375023f16c31223f067319e3')

const basicDataKey = getVerkleKey(stem, VerkleLeafType.BasicData)
const basicDataRaw = state[bytesToHex(basicDataKey)]
const basicData = decodeVerkleLeafBasicData(hexToBytes(basicDataRaw!))

console.log(basicData) // { version: 1, nonce: 1n, codeSize: 0, balance: 1n }
```

## Module: [withdrawal](src/withdrawal.ts)

Class representing an `EIP-4895` `Withdrawal` with different constructors as well as conversion and output helpers.

```ts
// ./examples/withdrawal.ts

import { createWithdrawal } from '@ethereumjs/util'

const withdrawal = createWithdrawal({
  index: 0n,
  validatorIndex: 65535n,
  address: '0x0000000000000000000000000000000000000000',
  amount: 0n,
})

console.log('Withdrawal object created:')
console.log(withdrawal.toJSON())
```

## Browser

We provide hybrid ESM/CJS builds for all our libraries. With the v10 breaking release round from Spring 2025, all libraries are "pure-JS" by default and we have eliminated all hard-wired WASM code. Additionally we have substantially lowered the bundle sizes, reduced the number of dependencies, and cut out all usages of Node.js-specific primitives (like the Node.js event emitter).

It is easily possible to run a browser build of one of the EthereumJS libraries within a modern browser using the provided ESM build. For a setup example see [./examples/browser.html](./examples/browser.html).

## API

### Documentation

Read the [API docs](docs/).

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

### ethjs-util methods

The following methods are available by an internalized version of the [ethjs-util](https://github.com/ethjs/ethjs-util) package (`MIT` license), see [internal.ts](src/internal.ts). The original package is not maintained any more and the original functionality will be replaced by own implementations over time (starting with the `v7.1.3` release, October 2021).

- arrayContainsArray
- getBinarySize
- stripHexPrefix
- isHexString
- isHexString
- padToEven
- fromAscii
- fromUtf8
- toUtf8
- toAscii
- getKeys

They can be imported by name:

```ts
import { stripHexPrefix } from '@ethereumjs/util'
```

## EthereumJS

See our organizational [documentation](https://ethereumjs.readthedocs.io) for an introduction to `EthereumJS` as well as information on current standards and best practices. If you want to join for work or carry out improvements on the libraries, please review our [contribution guidelines](https://ethereumjs.readthedocs.io/en/latest/contributing.html) first.

## License

[MPL-2.0](<https://tldrlegal.com/license/mozilla-public-license-2.0-(mpl-2)>)

[util-npm-badge]: https://img.shields.io/npm/v/@ethereumjs/util.svg
[util-npm-link]: https://www.npmjs.org/package/@ethereumjs/util
[util-issues-badge]: https://img.shields.io/github/issues/ethereumjs/ethereumjs-monorepo/package:%20util?label=issues
[util-issues-link]: https://github.com/ethereumjs/ethereumjs-monorepo/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+util"
[util-actions-badge]: https://github.com/ethereumjs/ethereumjs-monorepo/workflows/Util/badge.svg
[util-actions-link]: https://github.com/ethereumjs/ethereumjs-monorepo/actions?query=workflow%3A%22Util%22
[util-coverage-badge]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/branch/master/graph/badge.svg?flag=util
[util-coverage-link]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/tree/master/packages/util
[discord-badge]: https://img.shields.io/static/v1?logo=discord&label=discord&message=Join&color=blue
[discord-link]: https://discord.gg/TNwARpR
