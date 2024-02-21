# @ethereumjs/tx

[![NPM Package][tx-npm-badge]][tx-npm-link]
[![GitHub Issues][tx-issues-badge]][tx-issues-link]
[![Actions Status][tx-actions-badge]][tx-actions-link]
[![Code Coverage][tx-coverage-badge]][tx-coverage-link]
[![Discord][discord-badge]][discord-link]

| Implements schema and functions related to Ethereum's transaction. |
| ------------------------------------------------------------------ |

Note: this `README` reflects the state of the library from `v3.0.0` onwards. See `README` from the [standalone repository](https://github.com/ethereumjs/ethereumjs-tx) for an introduction on the last preceding release.

## Installation

### General

To obtain the latest version, simply require the project using `npm`:

```shell
npm install @ethereumjs/tx
```

### KZG Setup

This library supports an experimental version of `EIP-4844` blob transactions (see usage instructions below) starting with `v4.1.0`.

For blob transactions and other KZG related proof functionality (e.g. for EVM precompiles) KZG has to be manually installed and initialized in the `common` instance to be used in instantiating blob transactions.

#### Manual Installation

The following two manual installation steps for a KZG library and the trusted setup are needed.

1. Install an additional dependency that supports the `kzg` interface defined in [the kzg interface](./src/kzg/kzg.ts). You can install the default option [c-kzg](https://github.com/ethereum/c-kzg-4844) by simply running `npm install c-kzg`.
2. Download the trusted setup required for the KZG module. It can be found [here](../client/src/trustedSetups/trusted_setup.txt) within the client package.

#### KZG Initialization

Initialization can then be done like this (using the `c-kzg` module for our KZG dependency):

```ts
// ./examples/initKzg.ts

import * as kzg from 'c-kzg'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { initKZG } from '@ethereumjs/util'

// Instantiate KZG
initKZG(kzg, __dirname + '/../../client/src/trustedSetups/official.txt')

// Instantiate `common`
const common = new Common({
  chain: Chain.Mainnet,
  hardfork: Hardfork.Cancun,
  customCrypto: { kzg },
})

console.log(common.customCrypto.kzg) // should output the KZG API as an object
```

At the moment using the Node.js bindings for the `c-kzg` library is the only option to get KZG related functionality to work, note that this solution is not browser compatible. We are currently working on a WASM build of that respective library which can hopefully be released soon [TM].

## Usage

### Static Constructor Methods

To instantiate a tx it is not recommended to use the constructor directly. Instead each tx type comes with the following set of static constructor methods which helps on instantiation depending on the input data format:

- `public static fromTxData(txData: TxData, opts: TxOptions = {})`: instantiate from a data dictionary
- `public static fromSerializedTx(serialized: Uint8Array, opts: TxOptions = {})`: instantiate from a serialized tx
- `public static fromValuesArray(values: Uint8Array[], opts: TxOptions = {})`: instantiate from a values array

See one of the code examples on the tx types below on how to use.

All types of transaction objects are frozen with `Object.freeze()` which gives you enhanced security and consistency properties when working with the instantiated object. This behavior can be modified using the `freeze` option in the constructor if needed.

### Chain and Hardfork Support

The `LegacyTransaction` constructor receives a parameter of an [`@ethereumjs/common`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common) object that lets you specify the chain and hardfork to be used. If there is no `Common` provided the chain ID provided as a parameter on typed tx or the chain ID derived from the `v` value on signed EIP-155 conforming legacy txs will be taken (introduced in `v3.2.1`). In other cases the chain defaults to `mainnet`.

Base default HF (determined by `Common`): `Hardfork.Shanghai`

Hardforks adding features and/or tx types:

| Hardfork         | Introduced | Description                                                                                             |
| ---------------- | ---------- | ------------------------------------------------------------------------------------------------------- |
| `spuriousDragon` |  `v2.0.0`  |  `EIP-155` replay protection (disable by setting HF pre-`spuriousDragon`)                               |
| `istanbul`       |  `v2.1.1`  | Support for reduced non-zero call blob gas prices ([EIP-2028](https://eips.ethereum.org/EIPS/eip-2028)) |
| `muirGlacier`    |  `v2.1.2`  |  -                                                                                                      |
| `berlin`         | `v3.1.0`   |  `EIP-2718` Typed Transactions, Optional Access Lists Tx Type `EIP-2930`                                |
| `london`         | `v3.2.0`   | `EIP-1559` Transactions                                                                                 |
| `cancun`         | `v5.0.0`   | `EIP-4844` Transactions                                                                                 |

### WASM Crypto Support

This library by default uses JavaScript implementations for the basic standard crypto primitives like hashing or signature verification. See `@ethereumjs/common` [README](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/common) for instructions on how to replace with e.g. a more performant WASM implementation by using a shared `common` instance.

### Transaction Types

This library supports the following transaction types ([EIP-2718](https://eips.ethereum.org/EIPS/eip-2718)):

- `BlobEIP4844Transaction` ([EIP-4844](https://eips.ethereum.org/EIPS/eip-4844), proto-danksharding)
- `FeeMarketEIP1559Transaction` ([EIP-1559](https://eips.ethereum.org/EIPS/eip-1559), gas fee market)
- `AccessListEIP2930Transaction` ([EIP-2930](https://eips.ethereum.org/EIPS/eip-2930), optional access lists)
- `BlobEIP4844Transaction` ([EIP-4844](https://eips.ethereum.org/EIPS/eip-4844), blob transactions)
- `LegacyTransaction`, the Ethereum standard tx up to `berlin`, now referred to as legacy txs with the introduction of tx types

#### Blob Transactions (EIP-4844)

- Class: `BlobEIP4844Transaction`
- Activation: `cancun`
- Type: `3`

This library supports the blob transaction type introduced with [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844).

**Note:** This functionality needs a manual KZG library installation and global initialization, see [KZG Setup](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/tx/README.md#kzg-setup) for instructions.

##### Usage

See the following code snipped for an example on how to instantiate (using the `c-kzg` module for our KZG dependency).

```ts
// ./examples/blobTx.ts

import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { BlobEIP4844Transaction } from '@ethereumjs/tx'
import { bytesToHex, initKZG } from '@ethereumjs/util'
import * as kzg from 'c-kzg'

initKZG(kzg, __dirname + '/../../client/src/trustedSetups/devnet6.txt')

const common = new Common({
  chain: Chain.Mainnet,
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

const tx = BlobEIP4844Transaction.fromTxData(txData, { common })

console.log(bytesToHex(tx.hash())) //0x3c3e7c5e09c250d2200bcc3530f4a9088d7e3fb4ea3f4fccfd09f535a3539e84
```

Note that `versionedHashes` and `kzgCommitments` have a real length of 32 bytes, `blobs` have a real length of `4096` bytes and values are trimmed here for brevity.

Alternatively, you can pass a `blobsData` property with an array of strings corresponding to a set of blobs and the `fromTxData` constructor will derive the corresponding `blobs`, `versionedHashes`, `kzgCommitments`, and `kzgProofs` for you.

See the [Blob Transaction Tests](./test/eip4844.spec.ts) for examples of usage in instantiating, serializing, and deserializing these transactions.

#### Gas Fee Market Transactions (EIP-1559)

- Class: `FeeMarketEIP1559Transaction`
- Activation: `london`
- Type: `2`

This is the recommended tx type starting with the activation of the `london` HF, see the following code snipped for an example on how to instantiate:

```ts
// ./examples/londonTx.ts

import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx'
import { bytesToHex } from '@ethereumjs/util'

const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London })

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

const tx = FeeMarketEIP1559Transaction.fromTxData(txData, { common })
console.log(bytesToHex(tx.hash())) // 0x6f9ef69ccb1de1aea64e511efd6542541008ced321887937c95b03779358ec8a
```

#### Access List Transactions (EIP-2930)

- Class: `AccessListEIP2930Transaction`
- Activation: `berlin`
- Type: `1`

This transaction type has been introduced along the `berlin` HF. See the following code snipped for an example on how to instantiate:

```ts
// ./examples/accessListTx.ts

import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { AccessListEIP2930Transaction } from '@ethereumjs/tx'
import { bytesToHex } from '@ethereumjs/util'

const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Berlin })

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

const tx = AccessListEIP2930Transaction.fromTxData(txData, { common })
console.log(bytesToHex(tx.hash())) // 0x9150cdebad74e88b038e6c6b964d99af705f9c0883d7f0bbc0f3e072358f5b1d
```

For generating access lists from tx data based on a certain network state there is a `reportAccessList` option
on the `Vm.runTx()` method of the `@ethereumjs/vm` `TypeScript` VM implementation.

### Legacy Transactions

- Class: `LegacyTransaction`
- Activation: `chainstart` (with modifications along the road, see HF section below)
- Type: `0` (internal)

Legacy transaction are still valid transaction within Ethereum `mainnet` but will likely be deprecated at some point.
See this [example script](./examples/transactions.ts) or the following code example on how to use.

```ts
// ./examples/legacyTx.ts

import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { LegacyTransaction } from '@ethereumjs/tx'
import { bytesToHex } from '@ethereumjs/util'

const txParams = {
  nonce: '0x00',
  gasPrice: '0x09184e72a000',
  gasLimit: '0x2710',
  to: '0x0000000000000000000000000000000000000000',
  value: '0x00',
  data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057',
}

const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })
const tx = LegacyTransaction.fromTxData(txParams, { common })

const privateKey = Buffer.from(
  'e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109',
  'hex'
)

const signedTx = tx.sign(privateKey)

const serializedTx = signedTx.serialize()
console.log(bytesToHex(signedTx.hash())) // 0x894b72d87f8333fccd29d1b3aca39af69d97a6bc281e7e7a3a60640690a3cd2b
```

### Transaction Factory

If you only know on runtime which tx type will be used within your code or if you want to keep your code transparent to tx types, this library comes with a `TransactionFactory` for your convenience which can be used as follows:

```ts
// ./examples/txFactory.ts

import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { Capability, EIP1559CompatibleTx, TransactionFactory } from '@ethereumjs/tx'

const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London })

const txData = { type: 2, maxFeePerGas: BigInt(20) } // Creates an EIP-1559 compatible transac
const tx = TransactionFactory.fromTxData(txData, { common })

if (tx.supports(Capability.EIP1559FeeMarket)) {
  console.log(
    `The max fee per gas for this transaction is ${(tx as EIP1559CompatibleTx).maxFeePerGas}`
  )
}
```

The correct tx type class for instantiation will then be chosen on runtime based on the data provided as an input.

`TransactionFactory` supports the following static constructor methods:

- `public static fromTxData(txData: TxData | AccessListEIP2930TxData, txOptions: TxOptions = {}): TypedTransaction`
- `public static fromSerializedData(data: Uint8Array, txOptions: TxOptions = {}): TypedTransaction`
- `public static fromBlockBodyData(data: Uint8Array | Uint8Array[], txOptions: TxOptions = {})`
- `public static async fromJsonRpcProvider(provider: string | EthersProvider, txHash: string, txOptions?: TxOptions)`

### Sending a Transaction

#### L2 Support

This library has been tested to work with various L2 networks (`v3.3.0`+). All predefined supported custom chains introduced with `Common` `v2.4.0` or higher are supported, the following is a simple example to send a tx to the xDai chain:

```ts
// ./examples/l2tx.ts

import { Common, CustomChain } from '@ethereumjs/common'
import { LegacyTransaction } from '@ethereumjs/tx'
import { Address, bytesToHex, hexToBytes } from '@ethereumjs/util'

const pk = hexToBytes('0x076247989df60a82f6e86e58104368676096f84e60972282ee00d4673a2bc9b9')
const to = Address.fromString('0x256e8f0ba532ad83a0debde7501669511a41a1f3')
const common = Common.custom(CustomChain.xDaiChain)

const txData = {
  nonce: 0,
  gasPrice: 1000000000,
  gasLimit: 21000,
  to,
  value: 1,
}

const tx = LegacyTransaction.fromTxData(txData, { common })
const signedTx = tx.sign(pk)
console.log(bytesToHex(signedTx.hash())) // 0xbf98f6f8700812ed6f2314275070256e11945fa48afd80fb301265f6a41a2dc2
```

The following L2 networks have been tested to work with `@ethereumjs/tx`, see usage examples as well as some notes on peculiarities in the issues linked below:

|  L2 Network              |  Common name                          |  Issue                                                                  |
| ------------------------ | ------------------------------------- | ----------------------------------------------------------------------- |
| Arbitrum Rinkeby Testnet |  `CustomChain.ArbitrumRinkebyTestnet` |  [#1290](https://github.com/ethereumjs/ethereumjs-monorepo/issues/1290) |
| Polygon Mainnet          |  `CustomChain.PolygonMainnet`         |  [#1289](https://github.com/ethereumjs/ethereumjs-monorepo/issues/1289) |
| Polygon Mumbai Testnet   |  `CustomChain.PolygonMumbai`          |  [#1289](https://github.com/ethereumjs/ethereumjs-monorepo/issues/1289) |
| xDai Chain               |  `Common.xDaiChain`                   |  [#1323](https://github.com/ethereumjs/ethereumjs-monorepo/issues/1323) |
| Optimistic Kovan         | `Common.OptimisticKovan`              | [#1554](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1554)    |
| Optimistic Ethereum      | `Common.OptimisticEthereum`           | [#1554](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1554)    |

Note: For Optimistic Kovan and Optimistic Ethereum, the London hardfork has not been implemented so transactions submitted with a `baseFee` will revert.
The London hardfork is targeted to implement on Optimism in Q1.22.

For a non-predefined custom chain it is also possible to just provide a chain ID as well as other parameters to `Common`:

```ts
const common = Common.custom({ chainId: 1234 })
```

## Browser

With the breaking release round in Summer 2023 we have added hybrid ESM/CJS builds for all our libraries (see section below) and have eliminated many of the caveats which had previously prevented a frictionless browser usage.

It is now easily possible to run a browser build of one of the EthereumJS libraries within a modern browser using the provided ESM build. For a setup example see [./examples/browser.html](./examples/browser.html).

## Special Topics

### Signing with a hardware or external wallet

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

### Buffer -> Uint8Array

With the breaking releases from Summer 2023 we have removed all Node.js specific `Buffer` usages from our libraries and replace these with [Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) representations, which are available both in Node.js and the browser (`Buffer` is a subclass of `Uint8Array`).

We have converted existing Buffer conversion methods to Uint8Array conversion methods in the [@ethereumjs/util](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/util) `bytes` module, see the respective README section for guidance.

### BigInt Support

Starting with v4 the usage of [BN.js](https://github.com/indutny/bn.js/) for big numbers has been removed from the library and replaced with the usage of the native JS [BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) data type (introduced in `ES2020`).

Please note that number-related API signatures have changed along with this version update and the minimal build target has been updated to `ES2020`.

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
