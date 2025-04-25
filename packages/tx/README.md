# @ethereumjs/tx `v10`

[![NPM Package][tx-npm-badge]][tx-npm-link]
[![GitHub Issues][tx-issues-badge]][tx-issues-link]
[![Actions Status][tx-actions-badge]][tx-actions-link]
[![Code Coverage][tx-coverage-badge]][tx-coverage-link]
[![Discord][discord-badge]][discord-link]

| Implements schema and functions for the different Ethereum transaction types |
| ---------------------------------------------------------------------------- |

- 🦄 All tx types up till **Pectra**
- 🌴 Tree-shakeable API
- 👷🏼 Controlled dependency set (1 external + `@Noble` crypto)
- 🎼 Unified tx type API
- 📲 New type for **EIP-7702** account abstraction
- 🛵 190KB bundle size (all tx types) (47KB gzipped)
- 🏄🏾‍♂️ WASM-free default + Fully browser ready

## Table of Contents

- [Installation](#installation)
- [Getting Started](#getting-started)
- [Chain and Hardfork Support](#chain-and-hardfork-support)
- [Transaction Types](#transaction-types)
- [Transaction Factory](#transaction-factory)
- [KZG Setup](#kzg-setup)
- [Sending a Transaction](#sending-a-transaction)
- [Browser](#browser)
- [Hardware Wallets](#hardware-wallets)
- [API](#api)
- [EthereumJS](#ethereumjs)
- [License](#license)

## Installation

To obtain the latest version, simply require the project using `npm`:

```shell
npm install @ethereumjs/tx
```

## Getting Started

### Static Constructor Methods

To instantiate a tx it is not recommended to use the constructor directly. Instead each tx type comes with the following set of static constructor methods which helps on instantiation depending on the input data format:

- `public static fromTxData(txData: TxData, opts: TxOptions = {})`: instantiate from a data dictionary
- `public static fromSerializedTx(serialized: Uint8Array, opts: TxOptions = {})`: instantiate from a serialized tx
- `public static fromValuesArray(values: Uint8Array[], opts: TxOptions = {})`: instantiate from a values array

See one of the code examples on the tx types below on how to use.

All types of transaction objects are frozen with `Object.freeze()` which gives you enhanced security and consistency properties when working with the instantiated object. This behavior can be modified using the `freeze` option in the constructor if needed.

### WASM Crypto Support

This library by default uses JavaScript implementations for the basic standard crypto primitives like hashing or signature verification. See `@ethereumjs/common` [README](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/common) for instructions on how to replace with e.g. a more performant WASM implementation by using a shared `common` instance.

## Chain and Hardfork Support

To use a chain other than the default Mainnet chain, or a different hardfork than the default [`@ethereumjs/common`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common) hardfork (`Hardfork.Prague`), provide a `common` object in the constructor of the tx.

Base default HF (determined by `Common`): `Hardfork.Prague`

Hardforks adding features and/or tx types:

| Hardfork         | Introduced | Description                                                                                             |
| ---------------- | ---------- | ------------------------------------------------------------------------------------------------------- |
| `spuriousDragon` |  `v2.0.0`  |  `EIP-155` replay protection (disable by setting HF pre-`spuriousDragon`)                               |
| `istanbul`       |  `v2.1.1`  | Support for reduced non-zero call blob gas prices ([EIP-2028](https://eips.ethereum.org/EIPS/eip-2028)) |
| `muirGlacier`    |  `v2.1.2`  |  -                                                                                                      |
| `berlin`         | `v3.1.0`   |  `EIP-2718` Typed Transactions, Optional Access Lists Tx Type `EIP-2930`                                |
| `london`         | `v3.2.0`   | `EIP-1559` Transactions                                                                                 |
| `cancun`         | `v5.0.0`   | `EIP-4844` Transactions                                                                                 |
| `prague`         | `v10.0.0`  | `EIP-7702` Transactions                                                                                 |

## Transaction Types

### Table of Contents

This library supports the following transaction types ([EIP-2718](https://eips.ethereum.org/EIPS/eip-2718)):

- [Gas Fee Market Transactions (EIP-1559)](#gas-fee-market-transactions-eip-1559)
- [Access List Transactions (EIP-2930)](#access-list-transactions-eip-2930)
- [Blob Transactions (EIP-4844)](#blob-transactions-eip-4844)
- [EOA Code Transaction (EIP-7702)](#eoa-code-transaction-eip-7702)
- [Legacy Transactions](#legacy-transactions) (original Ethereum txs)

### Gas Fee Market Transactions (EIP-1559)

- Class: `FeeMarketEIP1559Tx`
- EIP: [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559)
- Activation: `london`
- Type: `2`

This is the recommended tx type starting with the activation of the `london` HF, see the following code snipped for an example on how to instantiate:

```ts
// ./examples/londonTx.ts

import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createFeeMarket1559Tx } from '@ethereumjs/tx'
import { bytesToHex } from '@ethereumjs/util'

const common = new Common({ chain: Mainnet, hardfork: Hardfork.London })

const txData = {
  data: '0x1a8451e600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  gasLimit: '0x02625a00',
  maxPriorityFeePerGas: '0x01',
  maxFeePerGas: '0xff',
  nonce: '0x00',
  to: '0xcccccccccccccccccccccccccccccccccccccccc',
  value: '0x0186a0',
  v: '0x01',
  r: '0xafb6e247b1c490e284053c87ab5f6b59e219d51f743f7a4d83e400782bc7e4b9',
  s: '0x479a268e0e0acd4de3f1e28e4fac2a6b32a4195e8dfa9d19147abe8807aa6f64',
  chainId: '0x01',
  accessList: [],
  type: '0x02',
}

const tx = createFeeMarket1559Tx(txData, { common })
console.log(bytesToHex(tx.hash())) // 0x6f9ef69ccb1de1aea64e511efd6542541008ced321887937c95b03779358ec8a
```

### Access List Transactions (EIP-2930)

- Class: `AccessListEIP2930Tx`
- EIP: [EIP-2930](https://eips.ethereum.org/EIPS/eip-2930)
- Activation: `berlin`
- Type: `1`

This transaction type has been introduced along the `berlin` HF. See the following code snipped for an example on how to instantiate:

```ts
// ./examples/accessListTx.ts

import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createAccessList2930Tx } from '@ethereumjs/tx'
import { bytesToHex } from '@ethereumjs/util'

const common = new Common({ chain: Mainnet, hardfork: Hardfork.Berlin })

const txData = {
  data: '0x1a8451e600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  gasLimit: '0x02625a00',
  gasPrice: '0x01',
  nonce: '0x00',
  to: '0xcccccccccccccccccccccccccccccccccccccccc',
  value: '0x0186a0',
  v: '0x01',
  r: '0xafb6e247b1c490e284053c87ab5f6b59e219d51f743f7a4d83e400782bc7e4b9',
  s: '0x479a268e0e0acd4de3f1e28e4fac2a6b32a4195e8dfa9d19147abe8807aa6f64',
  chainId: '0x01',
  accessList: [
    {
      address: '0x0000000000000000000000000000000000000101',
      storageKeys: [
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x00000000000000000000000000000000000000000000000000000000000060a7',
      ],
    },
  ],
  type: '0x01',
}

const tx = createAccessList2930Tx(txData, { common })
console.log(bytesToHex(tx.hash())) // 0x9150cdebad74e88b038e6c6b964d99af705f9c0883d7f0bbc0f3e072358f5b1d
```

For generating access lists from tx data based on a certain network state there is a `reportAccessList` option
on the `Vm.runTx()` method of the `@ethereumjs/vm` `TypeScript` VM implementation.

### Blob Transactions (EIP-4844)

- Class: `BlobEIP4844Tx`
- EIP: [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844)
- Activation: `cancun`
- Type: `3`

This library supports the blob transaction type introduced with [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844).

**Note:** This functionality needs a manual KZG library installation and global initialization, see [KZG Setup](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/tx/README.md#kzg-setup) for instructions.

See the following code snipped for an example on how to instantiate:

```ts
// ./examples/blobTx.ts

import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createBlob4844Tx } from '@ethereumjs/tx'
import { bytesToHex } from '@ethereumjs/util'
import { trustedSetup } from '@paulmillr/trusted-setups/fast.js'
import { KZG as microEthKZG } from 'micro-eth-signer/kzg'

const main = async () => {
  const kzg = new microEthKZG(trustedSetup)
  const common = new Common({
    chain: Mainnet,
    hardfork: Hardfork.Shanghai,
    eips: [4844],
    customCrypto: { kzg },
  })

  const txData = {
    data: '0x1a8451e600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    gasLimit: '0x02625a00',
    maxPriorityFeePerGas: '0x01',
    maxFeePerGas: '0xff',
    maxFeePerDataGas: '0xfff',
    nonce: '0x00',
    to: '0xcccccccccccccccccccccccccccccccccccccccc',
    value: '0x0186a0',
    v: '0x01',
    r: '0xafb6e247b1c490e284053c87ab5f6b59e219d51f743f7a4d83e400782bc7e4b9',
    s: '0x479a268e0e0acd4de3f1e28e4fac2a6b32a4195e8dfa9d19147abe8807aa6f64',
    chainId: '0x01',
    accessList: [],
    type: '0x05',
    blobsData: ['abcd'],
  }

  const tx = createBlob4844Tx(txData, { common })

  console.log(bytesToHex(tx.hash())) //0x3c3e7c5e09c250d2200bcc3530f4a9088d7e3fb4ea3f4fccfd09f535a3539e84
}

void main()
```

Note that `versionedHashes` and `kzgCommitments` have a real length of 32 bytes, `blobs` have a real length of `4096` bytes and values are trimmed here for brevity.

Alternatively, you can pass a `blobsData` property with an array of strings corresponding to a set of blobs and the `fromTxData` constructor will derive the corresponding `blobs`, `versionedHashes`, `kzgCommitments`, and `kzgProofs` for you.

See the [Blob Transaction Tests](./test/eip4844.spec.ts) for examples of usage in instantiating, serializing, and deserializing these transactions.

### EOA Code Transaction (EIP-7702)

- Class: `EOACodeEIP7702Tx`
- EIP: [EIP-7702](https://eips.ethereum.org/EIPS/eip-7702)
- Activation: `prague`
- Type: `4`

This tx type allows to run code in the context of an EOA and therefore extend the functionality which can be "reached" from respectively integrated into the scope of an otherwise limited EOA account.

The following is a simple example how to use an `EOACodeEIP7702Tx` with one authorization list item:

```ts
// ./examples/EOACodeTx.ts

import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createEOACode7702Tx } from '@ethereumjs/tx'
import { type PrefixedHexString, createAddressFromPrivateKey, randomBytes } from '@ethereumjs/util'

const ones32 = `0x${'01'.repeat(32)}` as PrefixedHexString

const common = new Common({ chain: Mainnet, hardfork: Hardfork.Cancun, eips: [7702] })
const tx = createEOACode7702Tx(
  {
    authorizationList: [
      {
        chainId: '0x2',
        address: `0x${'20'.repeat(20)}`,
        nonce: '0x1',
        yParity: '0x1',
        r: ones32,
        s: ones32,
      },
    ],
    to: createAddressFromPrivateKey(randomBytes(32)),
  },
  { common },
)

console.log(
  `EIP-7702 EOA code tx created with ${tx.authorizationList.length} authorization list item(s).`,
)
```

### Legacy Transactions

- Class: `LegacyTx`
- Activation: `chainstart` (with modifications along the road, see HF section below)
- Type: `0` (internal)

Legacy transaction are still valid transaction within Ethereum `mainnet` but will likely be deprecated at some point.
See this [example script](./examples/transactions.ts) or the following code example on how to use.

```ts
// ./examples/legacyTx.ts

import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createLegacyTx } from '@ethereumjs/tx'
import { bytesToHex, hexToBytes } from '@ethereumjs/util'

const txParams = {
  nonce: '0x0',
  gasPrice: '0x09184e72a000',
  gasLimit: '0x2710',
  to: '0x0000000000000000000000000000000000000000',
  value: '0x00',
  data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057',
}

const common = new Common({ chain: Mainnet, hardfork: Hardfork.Istanbul })
const tx = createLegacyTx(txParams, { common })

const privateKey = hexToBytes('0xe331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109')

const signedTx = tx.sign(privateKey)

const _serializedTx = signedTx.serialize()
console.log(bytesToHex(signedTx.hash())) // 0x894b72d87f8333fccd29d1b3aca39af69d97a6bc281e7e7a3a60640690a3cd2b

```

## Transaction Factory

If you only know on runtime which tx type will be used within your code or if you want to keep your code transparent to tx types, this library comes with a `TransactionFactory` for your convenience which can be used as follows:

```ts
// ./examples/txFactory.ts

import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { Capability, createTx } from '@ethereumjs/tx'

import type { EIP1559CompatibleTx } from '@ethereumjs/tx'

const common = new Common({ chain: Mainnet, hardfork: Hardfork.London })

const txData = { type: 2, maxFeePerGas: BigInt(20) } // Creates an EIP-1559 compatible transaction
const tx = createTx(txData, { common })

if (tx.supports(Capability.EIP1559FeeMarket)) {
  console.log(
    `The max fee per gas for this transaction is ${(tx as EIP1559CompatibleTx).maxFeePerGas}`,
  )
}
```

The correct tx type class for instantiation will then be chosen on runtime based on the data provided as an input.

`TransactionFactory` supports the following static constructor methods:

- `public static fromTxData(txData: TxData | AccessListEIP2930TxData, txOptions: TxOptions = {})`
- `public static fromSerializedData(data: Uint8Array, txOptions: TxOptions = {})`
- `public static fromBlockBodyData(data: Uint8Array | Uint8Array[], txOptions: TxOptions = {})`
- `public static async fromJsonRpcProvider(provider: string | EthersProvider, txHash: string, txOptions?: TxOptions)`

## KZG Setup

This library fully supports `EIP-4844` blob transactions. For blob transactions and other KZG related proof functionality (e.g. for EVM precompiles) KZG has to be manually installed and initialized in the `common` instance to be used in instantiating blob transactions.

As a first step add the [micro-eth-signer](https://github.com/paulmillr/micro-eth-signer) package for KZG and [@paulmillr/trusted-setups](https://github.com/paulmillr/trusted-setups) for the trusted setup data as dependencies to your `package.json` file and install the libraries. Then initialization can then be done like the following:

```ts
// ./examples/initKzg.ts

import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { trustedSetup } from '@paulmillr/trusted-setups/fast.js'
import { KZG as microEthKZG } from 'micro-eth-signer/kzg'

const main = async () => {
  const kzg = new microEthKZG(trustedSetup)
  // Instantiate `common`
  const common = new Common({
    chain: Mainnet,
    hardfork: Hardfork.Cancun,
    customCrypto: { kzg },
  })

  console.log(common.customCrypto.kzg) // should output the KZG API as an object
}

void main()
```

Note: We did not want to directly bundle because bundle sizes are large due to the large trusted setup inclusion (especially for the mainnet trusted setup).

## Sending a Transaction

### L2 Support

This library has been tested to work with various L2 networks. To set an associated chainID, use the `createCustomCommon()` constructor from our `Common` library. The following is a simple example to send a tx to the xDai chain:

```ts
// ./examples/l2tx.ts

import { Mainnet, createCustomCommon } from '@ethereumjs/common'
import { createLegacyTx } from '@ethereumjs/tx'
import { bytesToHex, createAddressFromString, hexToBytes } from '@ethereumjs/util'

const pk = hexToBytes('0x076247989df60a82f6e86e58104368676096f84e60972282ee00d4673a2bc9b9')
// xDai chain ID
const common = createCustomCommon({ chainId: 100 }, Mainnet)
const to = createAddressFromString('0x256e8f0ba532ad83a0debde7501669511a41a1f3')

const txData = {
  nonce: 0,
  gasPrice: 1000000000,
  gasLimit: 21000,
  to,
  value: 1,
}

const tx = createLegacyTx(txData, { common })
const signedTx = tx.sign(pk)
console.log(bytesToHex(signedTx.hash())) // 0xbf98f6f8700812ed6f2314275070256e11945fa48afd80fb301265f6a41a2dc2
```

## Browser

We provide hybrid ESM/CJS builds for all our libraries. With the v10 breaking release round from Spring 2025, all libraries are "pure-JS" by default and we have eliminated all hard-wired WASM code. Additionally we have substantially lowered the bundle sizes, reduced the number of dependencies, and cut out all usages of Node.js-specific primitives (like the Node.js event emitter).

It is easily possible to run a browser build of one of the EthereumJS libraries within a modern browser using the provided ESM build. For a setup example see [./examples/browser.html](./examples/browser.html).

## Hardware Wallets

### Ledger

To sign a tx with a hardware or external wallet use `tx.getMessageToSign()` to return an [EIP-155](https://eips.ethereum.org/EIPS/eip-155) compliant unsigned tx.

A legacy transaction will return a Buffer list of the values, and a Typed Transaction ([EIP-2718](https://eips.ethereum.org/EIPS/eip-2718)) will return the serialized output.

Here is an example of signing txs with `@ledgerhq/hw-app-eth` as of `v6.5.0`:

```ts
import { Chain, Common } from '@ethereumjs/common'
import { LegacyTransaction, FeeMarketEIP1559Transaction } from '@ethereumjs/tx'
import { bytesToHex } from '@ethereumjs/util'
import { RLP } from '@ethereumjs/rlp'
import Eth from '@ledgerhq/hw-app-eth'

const eth = new Eth(transport)
const common = new Common({ chain: Chain.Sepolia })

let txData: any = { value: 1 }
let tx: LegacyTransaction | FeeMarketEIP1559Transaction
let unsignedTx: Uint8Array[] | Uint8Array
let signedTx: typeof tx
const bip32Path = "44'/60'/0'/0/0"

const run = async () => {
  // Signing a legacy tx
  tx = LegacyTransaction.fromTxData(txData, { common })
  tx = tx.getMessageToSign()
  // ledger signTransaction API expects it to be serialized
  let { v, r, s } = await eth.signTransaction(bip32Path, RLP.encode(tx))
  tx.addSignature(v, r, s, true)
  let from = tx.getSenderAddress().toString()
  console.log(`signedTx: ${bytesToHex(tx.serialize())}\nfrom: ${from}`)

  // Signing a 1559 tx
  txData = { value: 1 }
  tx = FeeMarketEIP1559Transaction.fromTxData(txData, { common })
  tx = tx.getMessageToSign()
  ;({ v, r, s } = await eth.signTransaction(bip32Path, unsignedTx)) // this syntax is: object destructuring - assignment without declaration
  tx.addSignature(v, r, s)
  from = tx.getSenderAddress().toString()
  console.log(`signedTx: ${bytesToHex(tx.serialize())}\nfrom: ${from}`)
}

run()
```

## API

### Docs

Generated TypeDoc API [Documentation](./docs/README.md)

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

## EthereumJS

See our organizational [documentation](https://ethereumjs.readthedocs.io) for an introduction to `EthereumJS` as well as information on current standards and best practices. If you want to join for work or carry out improvements on the libraries, please review our [contribution guidelines](https://ethereumjs.readthedocs.io/en/latest/contributing.html) first.

## License

[MPL-2.0](<https://tldrlegal.com/license/mozilla-public-license-2.0-(mpl-2)>)

[discord-badge]: https://img.shields.io/static/v1?logo=discord&label=discord&message=Join&color=blue
[discord-link]: https://discord.gg/TNwARpR
[tx-npm-badge]: https://img.shields.io/npm/v/@ethereumjs/tx.svg
[tx-npm-link]: https://www.npmjs.com/package/@ethereumjs/tx
[tx-issues-badge]: https://img.shields.io/github/issues/ethereumjs/ethereumjs-monorepo/package:%20tx?label=issues
[tx-issues-link]: https://github.com/ethereumjs/ethereumjs-monorepo/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+tx"
[tx-actions-badge]: https://github.com/ethereumjs/ethereumjs-monorepo/workflows/Tx/badge.svg
[tx-actions-link]: https://github.com/ethereumjs/ethereumjs-monorepo/actions?query=workflow%3A%22Tx%22
[tx-coverage-badge]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/branch/master/graph/badge.svg?flag=tx
[tx-coverage-link]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/tree/master/packages/tx
