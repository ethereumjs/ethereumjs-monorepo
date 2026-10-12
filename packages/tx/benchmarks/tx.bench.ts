import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import {
  createBlob4844Tx,
  createBlob4844TxFromRLP,
  createFeeMarket1559Tx,
  createFeeMarket1559TxFromRLP,
} from '@ethereumjs/tx'
import { type KZG, hexToBytes } from '@ethereumjs/util'
import { bench, describe } from 'vitest'

/** Stub KZG — blobVersionedHashes only; no trusted setup (see tx/test/txTypeMatrix.ts). */
const stubKzg = {} as KZG
const BLOB_VERSIONED_HASH = `0x01${'00'.repeat(31)}` as const

const common = new Common({ chain: Mainnet, hardfork: Hardfork.London })
const cancunCommon = new Common({
  chain: Mainnet,
  hardfork: Hardfork.Cancun,
  customCrypto: { kzg: stubKzg },
})
const privateKey = hexToBytes('0x4646464646464646464646464646464646464646464646464646464646464646')

const signed = createFeeMarket1559Tx(
  {
    chainId: BigInt(1),
    nonce: 0,
    maxPriorityFeePerGas: BigInt(1),
    maxFeePerGas: BigInt(10),
    gasLimit: BigInt(21000),
    to: '0x0000000000000000000000000000000000000001',
    value: BigInt(1),
    data: new Uint8Array(0),
    accessList: [],
  },
  { common },
).sign(privateKey)
const serialized = signed.serialize()

const signedBlobTx = createBlob4844Tx(
  {
    chainId: BigInt(1),
    nonce: 0,
    maxPriorityFeePerGas: BigInt(1),
    maxFeePerGas: BigInt(20),
    maxFeePerBlobGas: BigInt(1),
    gasLimit: BigInt(21_000),
    to: '0x0000000000000000000000000000000000000001',
    value: BigInt(0),
    data: new Uint8Array(0),
    accessList: [],
    blobVersionedHashes: [BLOB_VERSIONED_HASH],
  },
  { common: cancunCommon },
).sign(privateKey)
const blobSerialized = signedBlobTx.serialize()

describe('tx', () => {
  bench('tx type2 decode from RLP', () => {
    createFeeMarket1559TxFromRLP(serialized, { common })
  })

  bench('tx type2 recover sender', () => {
    signed.getSenderAddress()
  })

  bench('tx type3 blob decode from RLP', () => {
    createBlob4844TxFromRLP(blobSerialized, { common: cancunCommon })
  })

  bench('tx type3 blob recover sender', () => {
    signedBlobTx.getSenderAddress()
  })
})
