# @ethereumjs/util `v10`

[![NPM Package][util-npm-badge]][util-npm-link]
[![GitHub Issues][util-issues-badge]][util-issues-link]
[![Actions Status][util-actions-badge]][util-actions-link]
[![Code Coverage][util-coverage-badge]][util-coverage-link]
[![Discord][discord-badge]][discord-link]

| A collection of utility functions for Ethereum. |
| ----------------------------------------------- |

- 🧰 Shared primitives for the whole monorepo (bytes, accounts, addresses, signatures)
- 📋 **EIP-7928** Block Level Access Lists — parse, validate, hash (Amsterdam, experimental)
- 📲 **EIP-7702** authorization signing helpers
- 🔮 **EIP-4844 / EIP-7594** blob and cell proof utilities
- 📨 **EIP-7685** consensus-layer request types
- 💸 **EIP-4895** withdrawal helpers
- 🌴 Tree-shakeable root imports (`import { … } from '@ethereumjs/util'`)
- 👷🏼 Controlled dependency set (`@noble` crypto + minimal externals)
- 🏄🏾‍♂️ WASM-free default + fully browser ready

Everything is re-exported from the package root; deep imports are not necessary. Runnable examples live in [`examples/`](./examples/).

## Table of Contents

- [Installation](#installation)
- [Getting Started](#getting-started)
- [Bytes and Units](#bytes-and-units)
- [Accounts and Addresses](#accounts-and-addresses)
- [Signatures](#signatures)
- [EIP-7702 Authorization Lists](#eip-7702-authorization-lists)
- [EIP-7685 CL Requests](#eip-7685-cl-requests)
- [EIP-4895 Withdrawals](#eip-4895-withdrawals)
- [EIP-4844 / EIP-7594 Blobs](#eip-4844--eip-7594-blobs)
- [EIP-7928 Block Access Lists](#eip-7928-block-access-lists)
- [Storage](#storage)
- [Browser](#browser)
- [API](#api)
- [EthereumJS](#ethereumjs)
- [License](#license)

## Installation

```shell
npm install @ethereumjs/util
```

## Getting Started

```ts
import { hexToBytes, isValidChecksumAddress } from '@ethereumjs/util'
```

Use the sections below as a map from task to module. Source files are grouped under [`src/`](./src/).

| If you need… | Start here | Example |
| --- | --- | --- |
| Hex ↔ bytes ↔ bigint | [`bytes.ts`](./src/bytes.ts) | [`bytesConversions.ts`](./examples/bytesConversions.ts) |
| Wei / gwei / ether | [`units.ts`](./src/units.ts) | [`units.ts`](./examples/units.ts) |
| State trie accounts | [`account.ts`](./src/account.ts) | [`account.ts`](./examples/account.ts) |
| Ethereum addresses | [`address.ts`](./src/address.ts) | [`address.ts`](./examples/address.ts) |
| secp256k1 recovery | [`signature.ts`](./src/signature.ts) | [`ecrecover.ts`](./examples/ecrecover.ts) |
| EIP-7702 auth signing | [`authorization.ts`](./src/authorization.ts) | [`eoaCode7702Authorization.ts`](./examples/eoaCode7702Authorization.ts) |
| CL requests (7685) | [`request.ts`](./src/request.ts) | [`clRequest.ts`](./examples/clRequest.ts) |
| Beacon withdrawals | [`withdrawal.ts`](./src/withdrawal.ts) | [`withdrawal.ts`](./examples/withdrawal.ts) |
| Blob / cell proofs | [`blobs.ts`](./src/blobs.ts) | [`blobs.ts`](./examples/blobs.ts) |
| BAL JSON/RLP/hash | [`bal/`](./src/bal/) | [`blockAccessList.ts`](./examples/blockAccessList.ts) |
| In-memory DB | [`mapDB.ts`](./src/mapDB.ts) | [`mapDB.ts`](./examples/mapDB.ts) |

## Bytes and Units

Byte conversion helpers and shared constants (`KECCAK256_NULL_S`, `BIGINT_2EXP96`, …) live in [`bytes.ts`](./src/bytes.ts) and [`constants.ts`](./src/constants.ts).

```ts
// ./examples/bytesConversions.ts

import {
  BIGINT_2EXP96,
  KECCAK256_NULL_S,
  bytesToBigInt,
  bytesToHex,
  hexToBytes,
} from '@ethereumjs/util'

const bytesValue = new Uint8Array([97])
console.log(`bytesToBigInt: ${bytesToBigInt(bytesValue)}`)
console.log(`bytesToHex: ${bytesToHex(bytesValue)}`)
console.log(`hexToBytes length: ${hexToBytes('0x61').length}`)

console.log(`KECCAK256 null hash: ${KECCAK256_NULL_S}`)
console.log(`BIGINT_2EXP96: ${BIGINT_2EXP96}`)
```

For human-readable amounts, use `Units` — values are bigint wei:

```ts
// ./examples/units.ts

import { Units } from '@ethereumjs/util'

console.log(`1 ether = ${Units.ether(1)} wei`)
console.log(`2 gwei = ${Units.gwei(2)} wei`)
console.log(`0.5 ether in wei would be: ${Units.ether(1) / 2n} (use bigint math on wei values)`)
```

## Accounts and Addresses

`createAccount()` builds a full MPT account object. For Verkle or other partial contexts, `createPartialAccount()` omits unset fields (v9.1+).

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

```ts
// ./examples/accountPartial.ts

import { createPartialAccount } from '@ethereumjs/util'

const account = createPartialAccount({
  nonce: '0x02',
  balance: '0x0384',
})
console.log(`Partial account with nonce=${account.nonce} and balance=${account.balance} created`)
```

Address helpers cover parsing, validation, and derivation from keys or contract nonces:

```ts
// ./examples/address.ts

import { createAddressFromPrivateKey, createContractAddress, hexToBytes } from '@ethereumjs/util'

const privateKey = hexToBytes('0x45A915E4D060149EB4365960E6A7A45F334393093061116B197E3240065FF2D8')
const eoa = createAddressFromPrivateKey(privateKey)
const contract = createContractAddress(eoa, 0n)

console.log(`EOA ${eoa.toString()}`)
console.log(`First contract for nonce 0: ${contract.toString()}`)
```

## Signatures

Thin wrappers around `@noble/secp256k1` for recovery and validation. Prefer the underlying Noble libraries directly when you need full control.

```ts
// ./examples/ecrecover.ts

import { createAddressFromPublicKey, ecrecover, hexToBytes } from '@ethereumjs/util'

const chainId = BigInt(3) // EIP-155 chain ID encoded in v (must match the signature)

const ecHash = hexToBytes('0x82ff40c0a986c6a5cfad4ddf4c3aa6996f1a7837f9c398e17e5de5cbd5a12b28')
const r = hexToBytes('0x99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9')
const s = hexToBytes('0x129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66')
const v = BigInt(41)

const pubkey = ecrecover(ecHash, v, r, s, chainId)
console.log(`Recovered address: ${createAddressFromPublicKey(pubkey).toString()}`)
```

## EIP-7702 Authorization Lists

Prague+ EOAs can delegate code via signed authorization tuples. Helpers cover signing, recovery, and JSON ↔ bytes conversion — see [`authorization.ts`](./src/authorization.ts).

```ts
// ./examples/eoaCode7702Authorization.ts

import {
  eoaCode7702AuthorizationListBytesItemToJSON,
  eoaCode7702RecoverAuthority,
  eoaCode7702SignAuthorization,
  hexToBytes,
} from '@ethereumjs/util'

const privateKey = hexToBytes('0x45A915E4D060149EB4365960E6A7A45F334393093061116B197E3240065FF2D8')

const unsigned = {
  chainId: '0x',
  address: '0x0000000000000000000000000000000000001000',
  nonce: '0x',
}

const signed = eoaCode7702SignAuthorization(unsigned, privateKey)
const authority = eoaCode7702RecoverAuthority(signed)

console.log(`Recovered authority: ${authority.toString()}`)
console.log(`Signed item: ${JSON.stringify(eoaCode7702AuthorizationListBytesItemToJSON(signed))}`)
```

## EIP-7685 CL Requests

`CLRequest` wraps typed execution-layer requests to the consensus layer (deposits, withdrawals, consolidations). Block-level usage is documented in [@ethereumjs/block](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/block).

```ts
// ./examples/clRequest.ts

import { CLRequest, CLRequestType, hexToBytes } from '@ethereumjs/util'

// Payload layout is defined by the Prague EL request types (see @ethereumjs/block)
const depositPayload = hexToBytes(`0x${'ab'.repeat(48)}`)
const request = new CLRequest(CLRequestType.Deposit, depositPayload)

console.log(`CLRequest type=${request.type} (Deposit)`)
console.log(`Data length: ${request.data.length} bytes`)
```

Request types: `Deposit` (6110), `Withdrawal` (7002), `Consolidation` (7251), plus experimental builder types for Amsterdam.

## EIP-4895 Withdrawals

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

## EIP-4844 / EIP-7594 Blobs

Helpers for KZG commitments, blob proofs, versioned hashes, and PeerDAS cell proofs. Requires a `KZG` implementation — see [@ethereumjs/tx KZG setup](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/tx/README.md#kzg-setup).

```ts
// ./examples/blobs.ts

//import * as fs from 'fs'
import {
  type PrefixedHexString,
  blobsToCellProofs,
  blobsToProofs,
  computeVersionedHash,
  hexToBytes,
} from '@ethereumjs/util'
import { trustedSetup } from '@paulmillr/trusted-setups/fast-peerdas.js'
import { KZG as microEthKZG } from 'micro-eth-signer/kzg.js'

const kzg = new microEthKZG(trustedSetup)

/**
 *  Uncomment for a more realistic example using a real blob, e.g. from https://blobscan.com/
 *  Use with node ./examples/blobs.ts <file path>
 */
// const filePath = process.argv[2]
//const blob: PrefixedHexString = `0x${fs.readFileSync(filePath, 'ascii')}`
const blob: PrefixedHexString = `0x${'11'.repeat(131072)}` // 128 KiB
console.log(blob)

const commitment = kzg.blobToKzgCommitment(blob)

const blobCommitmentVersion = 0x01
const versionedHash = computeVersionedHash(commitment as PrefixedHexString, blobCommitmentVersion)

// EIP-4844 only
const blobProof = blobsToProofs(kzg, [blob], [commitment as PrefixedHexString])
const cellProofs = blobsToCellProofs(kzg, [blob])

console.log(`Blob size                   : ${hexToBytes(blob).length / 1024}KiB`)
console.log(`Commitment                  : ${commitment}`)
console.log(`Versioned hash              : ${versionedHash}`)
console.log(`Blob proof (EIP-4844)       : ${blobProof}`)
console.log(`First cell proof (EIP-7594) : ${cellProofs[0]}`)
console.log(`Num cell proofs (EIP-7594)  : ${cellProofs.length}`)
```

## EIP-7928 Block Access Lists

Helpers for [EIP-7928](https://eips.ethereum.org/EIPS/eip-7928) Block Level Access Lists (BAL): JSON/RLP conversion, hashing, and validation. Use for offline fixture checks or tooling; block execution and BAL accumulation live in [@ethereumjs/vm](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/vm#eip-7928-block-level-access-lists-amsterdam).

```ts
// ./examples/blockAccessList.ts

import {
  bytesToHex,
  createBlockLevelAccessListFromJSON,
  validateBlockAccessListHashFromJSON,
  validateBlockAccessListStructure,
} from '@ethereumjs/util'

const main = () => {
  const balJson = [
    {
      address: '0x0000000000000000000000000000000000000001',
      storageChanges: [],
      storageReads: [],
      balanceChanges: [{ blockAccessIndex: '0x01', postBalance: '0x03e8' }],
      nonceChanges: [],
      codeChanges: [],
    },
  ]

  const bal = createBlockLevelAccessListFromJSON(balJson)
  validateBlockAccessListStructure(bal)
  validateBlockAccessListHashFromJSON(balJson, bal.hash())

  console.log(`BAL account count: ${bal.toJSON().length}`)
  console.log(`BAL hash: ${bytesToHex(bal.hash())}`)
}

void main()
```

`bal.get(address)` returns the per-account storage/balance/nonce/code entry without walking `toJSON()`.

## Storage

`MapDB` is a minimal in-memory implementation of the shared `DB` interface used by trie and blockchain packages:

```ts
// ./examples/mapDB.ts

import { MapDB, hexToBytes } from '@ethereumjs/util'

const main = async () => {
  const db = new MapDB<string, Uint8Array>()
  const key = 'state-key'
  const value = hexToBytes('0xdeadbeef')

  await db.put(key, value)
  const read = await db.get(key)

  console.log(`Stored and read back ${read?.length} bytes`)
}

void main()
```

For persistent storage, see [@ethereumjs/trie recipes](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/trie/recipes/level.ts). KZG typing lives in [`kzg.ts`](./src/kzg.ts); genesis helpers in [`genesis.ts`](./src/genesis.ts).

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

Prefer the documented helpers in [`bytes.ts`](./src/bytes.ts) and [`address.ts`](./src/address.ts) for new code when an equivalent exists.

## EthereumJS

The `EthereumJS` GitHub organization and its repositories are managed by members of the former Ethereum Foundation JavaScript team and the broader Ethereum community. If you want to join for work or carry out improvements on the libraries see the [developer docs](../../DEVELOPER.md) for an overview of current standards and tools and review our [code of conduct](../../CODE_OF_CONDUCT.md).

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
