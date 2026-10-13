# @ethereumjs/tx `v10`

[![NPM Package][tx-npm-badge]][tx-npm-link]
[![GitHub Issues][tx-issues-badge]][tx-issues-link]
[![Actions Status][tx-actions-badge]][tx-actions-link]
[![Code Coverage][tx-coverage-badge]][tx-coverage-link]
[![Discord][discord-badge]][discord-link]

| Implements schema and functions for the different Ethereum transaction types |
| ---------------------------------------------------------------------------- |

- 🦄 All tx types up to **Osaka**
- 🌴 Tree-shakeable API
- 👷🏼 Controlled dependency set (1 external + `@Noble` crypto)
- 🎼 Unified tx type API
- 📲 New type for **EIP-7702** account abstraction
- 🔮 `EIP-7594` PeerDAS Blob Transactions
- 🛵 190KB bundle size (all tx types) (47KB gzipped)
- 🏄🏾‍♂️ WASM-free default + Fully browser ready

Runnable examples live in [`examples/`](./examples/).

## Table of Contents

- [Installation](#installation)
- [Getting Started](#getting-started)
- [Transaction Types](#transaction-types)
- [Transaction Factory](#transaction-factory)
- [Signing and Deserialization](#signing-and-deserialization)
- [Custom Chains](#custom-chains)
- [EIP-7702 Set-Code Transactions](#eip-7702-set-code-transactions)
- [KZG Setup](#kzg-setup)
- [Sending a Transaction](#sending-a-transaction)
- [Amsterdam Validation](#amsterdam-validation)
- [Architecture](#architecture)
- [Browser](#browser)
- [Hardware Wallets](#hardware-wallets)
- [API](#api)
- [EthereumJS](#ethereumjs)
- [License](#license)

## Installation

```shell
npm install @ethereumjs/tx
```

## Getting Started

Prefer factory functions (`createLegacyTx`, `createTx`, …) over calling transaction class constructors directly. Every transaction needs a `Common` for chain ID, hardfork, and field validation.

```ts
import { Common, Mainnet } from '@ethereumjs/common'
import { createFeeMarket1559Tx } from '@ethereumjs/tx'
```

| Hardfork | Tx types introduced |
| --- | --- |
| `chainstart` | Legacy (type 0) |
| `spuriousDragon` | EIP-155 replay protection |
| `berlin` | EIP-2930 access list (type 1) |
| `london` | EIP-1559 fee market (type 2) |
| `cancun` | EIP-4844 blob (type 3) |
| `prague` | EIP-7702 set-code (type 4) |
| `amsterdam` | EIP-2780 intrinsic split; EIP-7976 / EIP-7981 floor (experimental) |

Properties are frozen by default (`freeze: false` to opt out).

## Transaction Types

### Gas Fee Market (EIP-1559, type 2)

Recommended tx type from `london` onward.

```ts
// ./examples/eip1559Tx.ts

import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import type { FeeMarketEIP1559TxData } from '@ethereumjs/tx'
import { createFeeMarket1559Tx } from '@ethereumjs/tx'
import { bytesToHex } from '@ethereumjs/util'

const common = new Common({ chain: Mainnet, hardfork: Hardfork.Cancun })

const txData: FeeMarketEIP1559TxData = {
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

### Access List (EIP-2930, type 1)

```ts
// ./examples/accessListTx.ts

import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import type { AccessList2930TxData } from '@ethereumjs/tx'
import { createAccessList2930Tx } from '@ethereumjs/tx'
import { bytesToHex } from '@ethereumjs/util'

const common = new Common({ chain: Mainnet, hardfork: Hardfork.Berlin })

const txData: AccessList2930TxData = {
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

For generating access lists from network state, use `reportAccessList` on `VM.runTx()` in [@ethereumjs/vm](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/vm).

### Blob (EIP-4844 / EIP-7594, type 3)

Requires KZG on `Common` — see [KZG Setup](#kzg-setup). Use `serializeNetworkWrapper()` for JSON-RPC submission (includes blobs); `serialize()` for block-body format.

```ts
// ./examples/blobTx.ts

import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import type { BlobEIP4844TxData } from '@ethereumjs/tx'
import { createBlob4844Tx } from '@ethereumjs/tx'
import { bytesToHex, getBlobs, randomBytes } from '@ethereumjs/util'
import { trustedSetup } from '@paulmillr/trusted-setups/fast-peerdas.js'
import { KZG as microEthKZG } from 'micro-eth-signer/kzg.js'

const main = async () => {
  const kzg = new microEthKZG(trustedSetup)
  // EIP-4844 only
  const common4844 = new Common({
    chain: Mainnet,
    hardfork: Hardfork.Cancun,
    customCrypto: { kzg },
  })

  // EIP-4844 and EIP-7594
  const common4844and7594 = new Common({
    chain: Mainnet,
    hardfork: Hardfork.Osaka,
    customCrypto: { kzg },
  })
  const setups = [
    {
      title: 'Blob transaction (EIP-4844 only)',
      common: common4844,
      proofAmountComment: 'one proof per blob',
    },
    {
      title: 'Blob transaction (EIP-4844 + EIP-7594)',
      common: common4844and7594,
      proofAmountComment: '128 cells per blob + one proof per cell -> NUM_BLOBS * 128 proofs',
    },
  ]

  for (const setup of setups) {
    console.log(`\n${setup.title}:`)
    console.log('---------------------------------------')

    const blobsData = ['blob 1', 'blob 2', 'blob 3']
    console.log(`Blobs (Data) : "${blobsData.join('", "')}"`)
    // Final format, filled with a lot of 0s, added marker
    const blobs = getBlobs(blobsData)

    console.log('Generating tx...')

    const txData: BlobEIP4844TxData = {
      data: '0x1a8451e600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      gasLimit: 16_000_000n,
      maxPriorityFeePerGas: '0x01',
      maxFeePerGas: '0xff',
      maxFeePerBlobGas: '0xfff',
      nonce: '0x00',
      to: '0xcccccccccccccccccccccccccccccccccccccccc',
      value: '0x0186a0',
      v: '0x01',
      r: '0xafb6e247b1c490e284053c87ab5f6b59e219d51f743f7a4d83e400782bc7e4b9',
      s: '0x479a268e0e0acd4de3f1e28e4fac2a6b32a4195e8dfa9d19147abe8807aa6f64',
      chainId: '0x01',
      accessList: [],
      type: '0x05',
      blobs,
    }

    const tx = createBlob4844Tx(txData, { common: setup.common })

    console.log(`Tx hash               : ${bytesToHex(tx.hash())}`)
    console.log(`Num blobs             : ${tx.numBlobs()}`)
    console.log(`Blob versioned hashes : ${tx.blobVersionedHashes.join(', ')}`)
    console.log(`KZG commitments       : ${tx.kzgCommitments!.join(', ')}`)
    console.log(`First KZG (cell) proof: ${tx.kzgProofs![0]}`)
    console.log(`Num KZG (cell) proofs : ${tx.kzgProofs!.length} (${setup.proofAmountComment})`)
  }

  // To send a transaction via RPC, you can something like this:
  // const rawTx = tx.sign(privateKeyBytes).serializeNetworkWrapper()
  // myRPCClient.request('eth_sendRawTransaction', [rawTx]) // submits a transaction via RPC
  //
  // Also see ./sendRawSepoliaTx.ts example
}

void main()
```

### EOA Code (EIP-7702, type 4)

Prague+ txs with an authorization list. See [EIP-7702 Set-Code Transactions](#eip-7702-set-code-transactions) for a full sign-and-delegate workflow.

```ts
// ./examples/eoaCode7702Tx.ts

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

### Legacy (type 0)

```ts
// ./examples/legacyTx.ts

import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import type { LegacyTxData } from '@ethereumjs/tx'
import { createLegacyTx } from '@ethereumjs/tx'
import { bytesToHex, hexToBytes } from '@ethereumjs/util'

const txData: LegacyTxData = {
  nonce: '0x0',
  gasPrice: '0x09184e72a000',
  gasLimit: '0x2710',
  to: '0x0000000000000000000000000000000000000000',
  value: '0x00',
  data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057',
}

const common = new Common({ chain: Mainnet, hardfork: Hardfork.Istanbul })
const tx = createLegacyTx(txData, { common })

const privateKey = hexToBytes('0xe331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109')

const signedTx = tx.sign(privateKey)

const _serializedTx = signedTx.serialize()
console.log(bytesToHex(signedTx.hash())) // 0x894b72d87f8333fccd29d1b3aca39af69d97a6bc281e7e7a3a60640690a3cd2b
```

## Transaction Factory

When the tx type is only known at runtime, use `createTx()` — it dispatches on the `type` field or RLP prefix:

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

Factory methods: `createTx`, `createTxFromRLP`, `createTxFromBlockBodyData`, `createTxFromRPC`, `createTxFromJSONRPCProvider`.

## Signing and Deserialization

### Sign, serialize, and verify

```ts
// ./examples/transactions.ts

import { createLegacyTx, createLegacyTxFromBytesArray } from '@ethereumjs/tx'
import { bytesToHex, hexToBytes, randomBytes } from '@ethereumjs/util'

// Create and sign a contract-creation tx
const tx = createLegacyTx({
  nonce: 0,
  gasPrice: 100,
  gasLimit: 1_000_000_000,
  value: 0,
  data: '0x7f4e616d65526567000000000000000000000000000000000000000000000000003057307f4e616d6552656700000000000000000000000000000000000000000000000000573360455760415160566000396000f20036602259604556330e0f600f5933ff33560f601e5960003356576000335700604158600035560f602b590033560f60365960003356573360003557600035335700',
})

const signedTx = tx.sign(randomBytes(32))
console.log(`Upfront cost: ${signedTx.getUpfrontCost()} wei`)
console.log(`Serialized: ${bytesToHex(signedTx.serialize())}`)

// Parse a signed legacy tx from its values array
const rawTx = [
  '0x',
  '0x09184e72a000',
  '0x2710',
  '0x0000000000000000000000000000000000000000',
  '0x',
  '0x7f7465737432000000000000000000000000000000000000000000000000000000600057',
  '0x1c',
  '0x5e1d3a76fbf824220eafc8c79ad578ad2b67d01b0c2425eb1f1347e8f50882ab',
  '0x5bd428537f05f9830e93792f90ea6a3e2d1ee84952dd96edbae9f658f831ab13',
].map(hexToBytes)

const parsed = createLegacyTxFromBytesArray(rawTx)
console.log(`Sender: ${parsed.getSenderAddress().toString()}`)
console.log(`Signature valid: ${parsed.verifySignature()}`)
```

### Deserialize from RLP

```ts
// ./examples/txFromRLP.ts

import { Common, Mainnet } from '@ethereumjs/common'
import { createFeeMarket1559Tx, createTxFromRLP } from '@ethereumjs/tx'
import { bytesToHex, hexToBytes } from '@ethereumjs/util'

const common = new Common({ chain: Mainnet })
const privateKey = hexToBytes('0xe331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109')

const tx = createFeeMarket1559Tx(
  {
    type: 2,
    nonce: 0n,
    gasLimit: 21_000n,
    maxFeePerGas: 20n,
    maxPriorityFeePerGas: 1n,
    to: '0xcccccccccccccccccccccccccccccccccccccccc',
  },
  { common },
).sign(privateKey)

const roundTrip = createTxFromRLP(tx.serialize(), { common })

console.log(`Type preserved: ${roundTrip.type === tx.type}`)
console.log(`Hash match: ${bytesToHex(roundTrip.hash()) === bytesToHex(tx.hash())}`)
```

### Deserialize with custom chain ID

When parsing txs from a non-mainnet chain, pass a matching `Common`:

```ts
// ./examples/customChainIdTx.ts

import { Hardfork, Mainnet, createCustomCommon } from '@ethereumjs/common'
import { createLegacyTxFromRLP } from '@ethereumjs/tx'
import { hexToBytes, toBytes } from '@ethereumjs/util'

const txData = hexToBytes(
  '0xf9010b82930284d09dc30083419ce0942d18de92e0f9aee1a29770c3b15c6cf8ac5498e580b8a42f43f4fb0000000000000000000000000000000000000000000000000000016b78998da900000000000000000000000000000000000000000000000000000000000cb1b70000000000000000000000000000000000000000000000000000000000000fa00000000000000000000000000000000000000000000000000000000001363e4f00000000000000000000000000000000000000000000000000000000000186a029a0fac36e66d329af0e831b2e61179b3ec8d7c7a8a2179e303cfed3364aff2bc3e4a07cb73d56e561ccbd838818dd3dea5fa0b5158577ffc61c0e6ec1f0ed55716891',
)

const common = createCustomCommon({ chainId: 3 }, Mainnet)
common.setHardfork(Hardfork.Prague)
const tx = createLegacyTxFromRLP(txData, { common })

if (
  tx.isValid() &&
  tx.getSenderAddress().toString() === '0x9dfd2d2b2ed960923f7bf2e8883d73f213f3b24b'
) {
  console.log('Correctly created the tx')
} else {
  console.error('Invalid tx')
}
```

## Custom Chains

Use `createCustomCommon()` from `@ethereumjs/common` to override `chainId` (and optionally name) while keeping mainnet parameters:

```ts
// ./examples/customChainTx.ts

import { Hardfork, Mainnet, createCustomCommon } from '@ethereumjs/common'
import { createLegacyTx } from '@ethereumjs/tx'
import { createAddressFromPrivateKey, hexToBytes } from '@ethereumjs/util'

// In this example we create a transaction for a custom network.

// This custom network has the same params as mainnet,
// except for name, chainId, so we use the `Common.custom` method.
const customCommon = createCustomCommon(
  {
    name: 'my-network',
    chainId: 2134,
  },
  Mainnet,
  {
    hardfork: Hardfork.Prague,
  },
)

// We pass our custom Common object whenever we create a transaction
const opts = { common: customCommon }
const tx = createLegacyTx(
  {
    nonce: 0,
    gasPrice: 100,
    gasLimit: 1000000000,
    value: 100000,
  },
  opts,
)

// Once we created the transaction using the custom Common object, we can use it as a normal tx.

// Here we sign it and validate its signature
const privateKey = hexToBytes('0xe331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109')

const signedTx = tx.sign(privateKey)
const address = createAddressFromPrivateKey(privateKey)

if (signedTx.isValid() && signedTx.getSenderAddress().equals(address)) {
  console.log('Valid signature')
} else {
  console.log('Invalid signature')
}

console.log("The transaction's chain id is: ", signedTx.common.chainId().toString())
```

L2 example (xDai / Gnosis chain ID 100):

```ts
// ./examples/l2Tx.ts

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

## EIP-7702 Set-Code Transactions

Full workflow: sign authorization items with `@ethereumjs/util`, attach to a type-4 tx, sign and serialize. **Do not use real keys with funds.**

```ts
// ./examples/setEOATx.ts

/**
 * This example shows how to initialize an EIP-7702 (Set EOA account code) transaction
 * WARNING: do NOT try this or sign this with any keys which have any value on any network
 * This is for educational purposes only.
 */

// This example will show how to self-delegate a fresh EOA account to the address `0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`
// In the same transaction, it will also delegate another account to address `0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb`
// It will self-delegate. Note that in a 7702-tx, you are free to include any authorization item.
// If the authorization item is valid (it has the correct nonce, and matches the chainId (or the chainId is 0))
// then it will delegate the code of the account **who signed that authorization item** to the address in that authority item
import { createEOACode7702Tx } from '@ethereumjs/tx'
import type { EOACode7702AuthorizationListItemUnsigned } from '@ethereumjs/util'
import {
  Address,
  eoaCode7702AuthorizationListBytesItemToJSON,
  eoaCode7702SignAuthorization,
  privateToAddress,
} from '@ethereumjs/util'

const privateKey = new Uint8Array(32).fill(0x20)
const privateKeyOther = new Uint8Array(32).fill(0x99)

const myAddress = new Address(privateToAddress(privateKey))

const unsignedAuthorizationListItemSelf: EOACode7702AuthorizationListItemUnsigned = {
  chainId: '0x1337', // This delegation will only work on the chain with chainId 0x1337
  address: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  nonce: '0x01', // Since we are self-delegating we need account for the nonce being bumped of the account
}
const signedSelf = eoaCode7702SignAuthorization(unsignedAuthorizationListItemSelf, privateKey)
// To convert the bytes array to a human-readable form, use `eoaCode7702AuthorizationListBytesItemToJSON`
console.log(eoaCode7702AuthorizationListBytesItemToJSON(signedSelf))

const unsignedAuthorizationListItemOther: EOACode7702AuthorizationListItemUnsigned = {
  chainId: '0x', // The chainId 0 is special: this authorization will work on any chain which supports EIP-7702
  address: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
  nonce: '0x',
}
const signedOther = eoaCode7702SignAuthorization(
  unsignedAuthorizationListItemOther,
  privateKeyOther,
)

const authorizationList = [signedSelf, signedOther]

const unsignedTx = createEOACode7702Tx({
  authorizationList,
  to: myAddress, // Call into self, so call into own address into `0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`
})

const signed = unsignedTx.sign(privateKey)

console.log(signed.toJSON())
```

## KZG Setup

Blob transactions and KZG precompiles need a KZG implementation on `Common.customCrypto.kzg`:

```ts
// ./examples/initKZG.ts

import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { trustedSetup } from '@paulmillr/trusted-setups/fast-peerdas.js'
import { KZG as microEthKZG } from 'micro-eth-signer/kzg.js'

const main = async () => {
  const kzg = new microEthKZG(trustedSetup)
  // Instantiate `common`
  const common = new Common({
    chain: Mainnet,
    hardfork: Hardfork.Cancun,
    customCrypto: { kzg },
  })

  console.log(`KZG configured: ${Boolean(common.customCrypto.kzg)}`)
}

void main()
```

Install [micro-eth-signer](https://github.com/paulmillr/micro-eth-signer) and [@paulmillr/trusted-setups](https://github.com/paulmillr/trusted-setups) as dependencies. The trusted setup is large and intentionally not bundled.

## Sending a Transaction

See [sendRawSepoliaTx.ts](./examples/sendRawSepoliaTx.ts) for submitting a signed blob tx via JSON-RPC. For blob txs use `serializeNetworkWrapper()`, not `serialize()`.

## Amsterdam Validation

See the [canonical Amsterdam overview](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/vm#amsterdam-hardfork-experimental) in `@ethereumjs/vm`.

Intrinsic gas and the calldata floor are **two meters**. Wallets take `max` of both (`getMinimumGasLimit()`). They share EIP-2780's recipient/value extras as a common base; they are not two names for the same formula.

**Intrinsic ([EIP-2780](https://eips.ethereum.org/EIPS/eip-2780))** splits the old flat 21_000. A value transfer to another account is still 21_000:

| Part | Gas |
| --- | --- |
| `TX_BASE` (`txGas`) | 12_000 |
| Recipient access | 3_000 |
| Value (+ transfer log) | 6_000 |

Self-transfers skip the extras (12_000). `getIntrinsicGas()` still adds calldata execution cost, create, access-list, and 7702 auth on top.

**Calldata floor ([EIP-7623](https://eips.ethereum.org/EIPS/eip-7623), raised by [EIP-7976](https://eips.ethereum.org/EIPS/eip-7976))** is `floor_base + totalCostFloorPerToken × tokens`. Prague introduced the floor so data-heavy txs cannot underpay. Amsterdam's EIP-7976 counts **4 tokens per calldata byte** (zero and non-zero alike) and sets `totalCostFloorPerToken` to 16 → 64 gas per byte. [EIP-7981](https://eips.ethereum.org/EIPS/eip-7981) adds access-list bytes to the same token count. EIP-2780 extras are the floor **base** (`TX_BASE` + recipient/value), not a second floor.

**Minimum `gasLimit`:** `getMinimumGasLimit()` = `max(intrinsic, floor)`. Empty transfers still pass 21_000 (intrinsic ≥ floor). Calldata often cannot. First-touch state gas ([EIP-8037](https://eips.ethereum.org/EIPS/eip-8037)) is **not** in this bound — use `estimateTxGasDimensions()` on `@ethereumjs/vm`.

```ts
// ./examples/calldataFloorGas.ts

import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import {
  countCalldataFloorTokens,
  createLegacyTx,
  getCalldataFloorGas,
  getEip2780FloorBaseGas,
  getEip2780RecipientRegularGas,
} from '@ethereumjs/tx'
import { createAddressFromPrivateKey, createZeroAddress, hexToBytes } from '@ethereumjs/util'

import type { LegacyTxInterface } from '@ethereumjs/tx'

const main = () => {
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })
  const senderKey = hexToBytes(`0x${'20'.repeat(32)}`)
  const sender = createAddressFromPrivateKey(senderKey)
  const other = createZeroAddress()

  const report = (label: string, tx: LegacyTxInterface) => {
    console.log(label)
    console.log(`  TX_BASE:      ${tx.common.param('txGas')}`)
    console.log(`  2780 extras:  ${getEip2780RecipientRegularGas(tx)}`)
    console.log(`  floor base:   ${getEip2780FloorBaseGas(tx)}`)
    console.log(`  floor tokens: ${countCalldataFloorTokens(tx)}`)
    console.log(`  intrinsic:    ${tx.getIntrinsicGas()}`)
    console.log(`  floor:        ${getCalldataFloorGas(tx)}`)
    console.log(`  minimum:      ${tx.getMinimumGasLimit()}`)
    console.log(`  gasLimit:     ${tx.gasLimit} valid=${tx.isValid()}`)
  }

  report(
    'Value transfer to another account (still 21_000)',
    createLegacyTx(
      { to: other, value: 1n, gasLimit: 21_000n, gasPrice: 10n },
      { common },
    ).sign(senderKey),
  )

  report(
    'Self-transfer (2780 extras skipped)',
    createLegacyTx(
      { to: sender, value: 1n, gasLimit: 21_000n, gasPrice: 10n },
      { common },
    ).sign(senderKey),
  )

  report(
    '100 calldata bytes (7976 floor exceeds 21_000)',
    createLegacyTx(
      { to: other, data: new Uint8Array(100).fill(1), gasLimit: 21_000n, gasPrice: 10n },
      { common },
    ).sign(senderKey),
  )
}

void main()
```

First-touch state gas is still a VM concern: [`@ethereumjs/vm` Amsterdam gas dimensions](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/vm#amsterdam-gas-dimensions).

## Architecture

One directory per typed transaction (`legacy/`, `2930/`, `1559/`, `4844/`, `7702/`) with shared behavior in `capabilities/`. `transactionFactory.ts` dispatches `createTx*` calls. Every tx is built with a `Common` instance.

## Browser

We provide hybrid ESM/CJS builds for all our libraries. With the v10 breaking release round from Spring 2025, all libraries are "pure-JS" by default and we have eliminated all hard-wired WASM code. Additionally we have substantially lowered the bundle sizes, reduced the number of dependencies, and cut out all usages of Node.js-specific primitives (like the Node.js event emitter).

It is easily possible to run a browser build of one of the EthereumJS libraries within a modern browser using the provided ESM build. For a setup example see [./examples/browser.html](./examples/browser.html).

## Hardware Wallets

Use `tx.getMessageToSign()` for unsigned payloads. Legacy txs return an RLP values list; typed txs return serialized bytes. See [ledgerSigner.mts](./examples/ledgerSigner.mts) for `@ledgerhq/hw-app-eth` integration.

## API

Generated TypeDoc [documentation](./docs/README.md).

WASM crypto backends can be plugged in via `Common.customCrypto` — see [@ethereumjs/common](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/common#custom-cryptography-wasm--kzg).

## EthereumJS

The `EthereumJS` GitHub organization and its repositories are managed by members of the former Ethereum Foundation JavaScript team and the broader Ethereum community. If you want to join for work or carry out improvements on the libraries see the [developer docs](../../DEVELOPER.md) for an overview of current standards and tools and review our [code of conduct](../../CODE_OF_CONDUCT.md).

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
