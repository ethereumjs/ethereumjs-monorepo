# @ethereumjs/util

[![NPM Package][util-npm-badge]][util-npm-link]
[![GitHub Issues][util-issues-badge]][util-issues-link]
[![Actions Status][util-actions-badge]][util-actions-link]
[![Code Coverage][util-coverage-badge]][util-coverage-link]
[![Discord][discord-badge]][discord-link]

A collection of utility functions for Ethereum. It can be used in Node.js and in the browser with [browserify](http://browserify.org/).

## Installation

To obtain the latest version, simply require the project using `npm`:

```shell
npm install @ethereumjs/util
```

## Usage

```js
import assert from 'assert'
import { isValidChecksumAddress, unpadBuffer } from '@ethereumjs/util'

assert.ok(isValidChecksumAddress('0x2F015C60E0be116B1f0CD534704Db9c92118FB6A'))

assert.ok(unpadBuffer(Buffer.from('000000006600', 'hex')).equals(Buffer.from('6600', 'hex')))
```

## API

### Documentation

Read the [API docs](docs/).

### Modules

- [account](src/account.ts)
  - Account class
  - Private/public key and address-related functionality (creation, validation, conversion)
- [address](src/address.ts)
  - Address class and type
- [bytes](src/bytes.ts)
  - Byte-related helper and conversion functions
- [constants](src/constants.ts)
  - Exposed constants
    - e.g. `KECCAK256_NULL_S` for string representation of Keccak-256 hash of null
- hash
  - This module has been removed with `v8`, please use [ethereum-cryptography](https://github.com/ethereum/js-ethereum-cryptography) directly instead
- [signature](src/signature.ts)
  - Signing, signature validation, conversion, recovery
- [types](src/types.ts)
  - Helpful TypeScript types
- [internal](src/internal.ts)
  - Internalized helper methods
- [withdrawal](src/withdrawal.ts)
  - Withdrawal class (EIP-4895)

### Buffer -> Uint8Array

Starting with the Summer 2023 EthereumJS breaking release round (Util v9) all methods, constructors, constants and types of the EthereumJS libraries which took a `Buffer` instance as an input or resulted in a `Buffer` (containing) output have been updated to take in an `Uint8Array` instead and/or produce `Uint8Array` as an output.

Here are some examples of the changes:

```typescript
async putContractStorage(address: Address, key: Buffer, value: Buffer): Promise<void> // StateManager, old
async putContractStorage(address: Address, key: Uint8Array, value: Uint8Array): Promise<void> // StateManager, new

hash(): Buffer // Block, old
hash(): Uint8Array // Block, new

export const KECCAK256_NULL = Buffer.from(KECCAK256_NULL_S, 'hex') // Util, old
export const KECCAK256_NULL = hexToBytes(KECCAK256_NULL_S) // Util, new

export type AccessListBufferItem = [Buffer, Buffer[]] // Tx, old (Type)
export type AccessListBytesItem = [Uint8Array, Uint8Array[]] // Tx, new
```

As you can see, complex datastructures containing `Buffer` objects are now renamed from containing `Buffer` as an indicator key word to now having a `Bytes` containing name.

### Upgrade Helpers in bytes-Module

Depending on the extend of `Buffer` usage within your own libraries and other planning considerations, there are the two upgrade options to do the switch to `Uint8Array` yourself or keep `Buffer` and do transitions for input and output values.

We have updated the `@ethereumjs/util` `bytes` module with helpers for the most common conversions:

```typescript
Buffer.alloc(97) // Allocate a Buffer with length 97
new Uint8Array(97) // Allocate a Uint8Array with length 97

Buffer.from('342770c0', 'hex') // Convert a hex string to a Buffer
hexToBytes('0x342770c0') // Convert a prefixed hex string to a Uint8Array, Util.hexToBytes()

`0x${myBuffer.toString('hex')}` // Convert a Buffer to a prefixed hex string
bytesToHex(myUint8Array) // Convert a Uint8Array to a prefixed hex string

intToBuffer(9) // Convert an integer to a Buffer, old (removed)
intToBytes(9) // Convert an integer to a Uint8Array, Util.intToBytes()
bytesToInt(myUint8Array) // Convert a Uint8Array to an integer, Util.bytesToInt()

bigIntToBytes(myBigInt) // Convert a BigInt to a Uint8Array, Util.bigIntToBytes()
bytesToBigInt(myUint8Array) // Convert a Uint8Array to a BigInt, Util.bytesToInt()

utf8ToBytes(myUtf8String) // Converts a UTF-8 string to a Uint8Array, Util.utf8ToBytes()
bytesToUtf8(myUint8Array) // Converts a Uint8Array to a UTF-8 string, Util.bytesToUtf8()

toBuffer(v: ToBufferInputTypes) // Converts various byte compatible types to Buffer, old (removed)
toBytes(v: ToBytesInputTypes) // Converts various byte compatible types to Uint8Array, Util.toBytes()
```

Helper methods can be imported like this:

```typescript
import { hexToBytes } from '@ethereumjs/util'
```

### BigInt Support

Starting with Util v8 the usage of [BN.js](https://github.com/indutny/bn.js/) for big numbers has been removed from the library and replaced with the usage of the native JS [BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) data type (introduced in `ES2020`).

Please note that number-related API signatures have changed along with this version update and the minimal build target has been updated to `ES2020`.

### ethjs-util methods

The following methods are available by an internalized version of the [ethjs-util](https://github.com/ethjs/ethjs-util) package (`MIT` license), see [internal.ts](src/internal.ts). The original package is not maintained any more and the original functionality will be replaced by own implementations over time (starting with the `v7.1.3` release, October 2021).

- arrayContainsArray
- getBinarySize
- stripHexPrefix
- isHexPrefixed
- isHexString
- padToEven
- fromAscii
- fromUtf8
- toUtf8
- toAscii
- getKeys

They can be imported by name:

```typescript
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
