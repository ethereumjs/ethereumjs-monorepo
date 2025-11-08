import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import {
  AccessList2930Tx,
  FeeMarket1559Tx,
  LegacyTx,
  TransactionType,
  createAccessList2930Tx,
  createFeeMarket1559Tx,
  createLegacyTx,
  createTx,
  createTxFromBlockBodyData,
  createTxFromRLP,
} from '../src/index.ts'

const common = new Common({
  chain: Mainnet,
  hardfork: Hardfork.London,
})

const pKey = hexToBytes('0x4646464646464646464646464646464646464646464646464646464646464646')

const unsignedLegacyTx = createLegacyTx({})
const signedLegacyTx = unsignedLegacyTx.sign(pKey)

const unsignedEIP2930Tx = createAccessList2930Tx({ chainId: BigInt(1) }, { common })
const signedEIP2930Tx = unsignedEIP2930Tx.sign(pKey)
const unsignedEIP1559Tx = createFeeMarket1559Tx({ chainId: BigInt(1) }, { common })
const signedEIP1559Tx = unsignedEIP1559Tx.sign(pKey)

const txTypes = [
  {
    class: LegacyTx,
    name: 'LegacyTx',
    unsigned: unsignedLegacyTx,
    signed: signedLegacyTx,
    eip2718: false,
    type: TransactionType.Legacy,
  },
  {
    class: AccessList2930Tx,
    name: 'AccessList2930Tx',
    unsigned: unsignedEIP2930Tx,
    signed: signedEIP2930Tx,
    eip2718: true,
    type: TransactionType.AccessListEIP2930,
  },
  {
    class: FeeMarket1559Tx,
    name: 'FeeMarket1559Tx',
    unsigned: unsignedEIP1559Tx,
    signed: signedEIP1559Tx,
    eip2718: true,
    type: TransactionType.FeeMarketEIP1559,
  },
]

describe('[TransactionFactory]: Basic functions', () => {
  it('fromSerializedData() -> success cases', () => {
    for (const txType of txTypes) {
      const serialized = txType.unsigned.serialize()
      const factoryTx = createTxFromRLP(serialized, { common })
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
        const unsupportedCommon = new Common({ chain: Mainnet, hardfork: Hardfork.Istanbul })
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
            createTxFromRLP(serialized, { common })
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
      const tx = createTxFromBlockBodyData(rawTx, { common })
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
      const tx = createTx({ type: txType.type }, { common })
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
  })
})
