import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { assert, describe, it } from 'vitest'

import {
  AccessList2930Tx,
  Blob4844Tx,
  EOACode7702Tx,
  FeeMarket1559Tx,
  LegacyTx,
  TransactionType,
  createAccessList2930Tx,
  createBlob4844Tx,
  createEOACode7702Tx,
  createFeeMarket1559Tx,
  createLegacyTx,
  createTx,
  createTxFromBlockBodyData,
  createTxFromRLP,
} from '../src/index.ts'

import {
  MATRIX_PRIVATE_KEY,
  blobTxDefaults,
  cancunCommon,
  eoaCodeTxDefaults,
  londonCommon,
  pragueCommon,
  stubKzg,
} from './txTypeMatrix.ts'

const pKey = MATRIX_PRIVATE_KEY

const unsignedLegacyTx = createLegacyTx({})
const signedLegacyTx = unsignedLegacyTx.sign(pKey)

const unsignedEIP2930Tx = createAccessList2930Tx({ chainId: BigInt(1) }, { common: londonCommon })
const signedEIP2930Tx = unsignedEIP2930Tx.sign(pKey)
const unsignedEIP1559Tx = createFeeMarket1559Tx({ chainId: BigInt(1) }, { common: londonCommon })
const signedEIP1559Tx = unsignedEIP1559Tx.sign(pKey)
const unsignedEIP4844Tx = createBlob4844Tx(
  { chainId: BigInt(1), ...blobTxDefaults },
  { common: cancunCommon },
)
const signedEIP4844Tx = unsignedEIP4844Tx.sign(pKey)
const unsignedEIP7702Tx = createEOACode7702Tx(
  { chainId: BigInt(1), ...eoaCodeTxDefaults },
  { common: pragueCommon },
)
const signedEIP7702Tx = unsignedEIP7702Tx.sign(pKey)

const txTypes = [
  {
    class: LegacyTx,
    name: 'LegacyTx',
    unsigned: unsignedLegacyTx,
    signed: signedLegacyTx,
    eip2718: false,
    type: TransactionType.Legacy,
    common: londonCommon,
    txData: {},
  },
  {
    class: AccessList2930Tx,
    name: 'AccessList2930Tx',
    unsigned: unsignedEIP2930Tx,
    signed: signedEIP2930Tx,
    eip2718: true,
    type: TransactionType.AccessListEIP2930,
    common: londonCommon,
    txData: {},
  },
  {
    class: FeeMarket1559Tx,
    name: 'FeeMarket1559Tx',
    unsigned: unsignedEIP1559Tx,
    signed: signedEIP1559Tx,
    eip2718: true,
    type: TransactionType.FeeMarketEIP1559,
    common: londonCommon,
    txData: {},
  },
  {
    class: Blob4844Tx,
    name: 'Blob4844Tx',
    unsigned: unsignedEIP4844Tx,
    signed: signedEIP4844Tx,
    eip2718: true,
    type: TransactionType.BlobEIP4844,
    common: cancunCommon,
    txData: blobTxDefaults,
  },
  {
    class: EOACode7702Tx,
    name: 'EOACode7702Tx',
    unsigned: unsignedEIP7702Tx,
    signed: signedEIP7702Tx,
    eip2718: true,
    type: TransactionType.EOACodeEIP7702,
    common: pragueCommon,
    txData: eoaCodeTxDefaults,
  },
]

describe('[TransactionFactory]: Basic functions', () => {
  it('fromSerializedData() -> success cases', () => {
    for (const txType of txTypes) {
      const serialized = txType.unsigned.serialize()
      const factoryTx = createTxFromRLP(serialized, { common: txType.common })
      assert.strictEqual(
        factoryTx.constructor.name,
        txType.class.name,
        `should return the right type (${txType.name})`,
      )
    }
  })

  it('fromSerializedData() -> error cases', () => {
    for (const txType of txTypes) {
      if (txType.eip2718) {
        const unsupportedCommon = new Common({
          chain: Mainnet,
          hardfork: Hardfork.Istanbul,
          customCrypto: { kzg: stubKzg },
        })
        assert.throws(
          () => {
            createTxFromRLP(txType.unsigned.serialize(), {
              common: unsupportedCommon,
            })
          },
          undefined,
          undefined,
          `should throw when trying to create typed tx when not allowed in Common (${txType.name})`,
        )

        assert.throws(
          () => {
            const serialized = txType.unsigned.serialize()
            serialized[0] = 99 // edit the transaction type
            createTxFromRLP(serialized, { common: txType.common })
          },
          undefined,
          undefined,
          `should throw when trying to create typed tx with wrong type (${txType.name})`,
        )
      }
    }
  })

  it('fromBlockBodyData() -> success cases', () => {
    for (const txType of txTypes) {
      let rawTx: Uint8Array | Uint8Array[]
      if (txType.eip2718) {
        rawTx = txType.signed.serialize()
      } else {
        rawTx = txType.signed.raw() as Uint8Array[]
      }
      const tx = createTxFromBlockBodyData(rawTx, { common: txType.common })
      assert.strictEqual(
        tx.constructor.name,
        txType.name,
        `should return the right type (${txType.name})`,
      )
      if (txType.eip2718) {
        assert.deepEqual(
          tx.serialize(),
          rawTx,
          `round-trip serialization should match (${txType.name})`,
        )
      } else {
        assert.deepEqual(
          tx.raw(),
          rawTx as Uint8Array[],
          `round-trip raw() creation should match (${txType.name})`,
        )
      }
    }
  })

  it('fromTxData() -> success cases', () => {
    for (const txType of txTypes) {
      const tx = createTx({ type: txType.type, ...txType.txData }, { common: txType.common })
      assert.strictEqual(
        tx.constructor.name,
        txType.class.name,
        `should return the right type (${txType.name})`,
      )
      if (!txType.eip2718) {
        const tx = createTx({})
        assert.strictEqual(
          tx.constructor.name,
          txType.class.name,
          `should return the right type (${txType.name})`,
        )
      }
    }
  })

  it('fromTxData() -> error cases', () => {
    const unsupportedCommon = new Common({ chain: Mainnet, hardfork: Hardfork.Istanbul })
    assert.throws(() => {
      createTx({ type: 1 }, { common: unsupportedCommon })
    })

    assert.throws(() => {
      createTx({ type: 999 })
    })

    assert.throws(() => {
      createTx({ value: BigInt('-100') })
    })

    assert.throws(() => {
      createTx({ gasPrice: BigInt(-1) })
    })

    assert.throws(() => {
      createTx(
        { type: TransactionType.FeeMarketEIP1559, maxFeePerGas: BigInt(-1) },
        { common: londonCommon },
      )
    })

    assert.throws(() => {
      createTx(
        { type: TransactionType.BlobEIP4844, ...blobTxDefaults, maxFeePerBlobGas: BigInt(-1) },
        { common: cancunCommon },
      )
    })
  })
})
