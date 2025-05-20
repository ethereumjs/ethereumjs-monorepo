import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createZeroAddress } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { TransactionType, createTx, paramsTx } from '../src/index.ts'

const common = new Common({
  chain: Mainnet,
  hardfork: Hardfork.Paris,
  eips: [3860, 4844, 4895],
  params: paramsTx,
})

const maxInitCodeSize = common.param('maxInitCodeSize')
const txTypes = [
  TransactionType.Legacy,
  TransactionType.AccessListEIP2930,
  TransactionType.FeeMarketEIP1559,
  //TransactionType.BlobEIP4844, // Explicitly commented out: BlobEIP4844 txs cannot create contracts
]
const addressZero = createZeroAddress()
describe('[EIP3860 tests]', () => {
  it(`Should instantiate create txs with MAX_INITCODE_SIZE`, () => {
    const data = new Uint8Array(Number(maxInitCodeSize))
    for (const txType of txTypes) {
      assert.doesNotThrow(
        () => createTx({ data, type: txType }, { common }),
        undefined,
        undefined,
        `Instantiated create tx with MAX_INITCODE_SIZE data for txType: ${txType}`,
      )
    }
  })

  it(`Should instantiate txs with MAX_INITCODE_SIZE data`, () => {
    const data = new Uint8Array(Number(maxInitCodeSize))
    for (const txType of txTypes) {
      assert.doesNotThrow(
        () => createTx({ data, type: txType, to: addressZero }, { common }),
        undefined,
        undefined,
        `Instantiated tx with MAX_INITCODE_SIZE for txType: ${txType}`,
      )
    }
  })

  it(`Should not instantiate create txs with MAX_INITCODE_SIZE+1 data`, () => {
    const data = new Uint8Array(Number(maxInitCodeSize) + 1)
    for (const txType of txTypes) {
      assert.throws(
        () => createTx({ data, type: txType }, { common }),
        'the initcode size of this transaction is too large',
        undefined,
        `Instantiated create tx with MAX_INITCODE_SIZE+1 for txType: ${txType}`,
      )
    }
  })

  it(`Should instantiate txs with MAX_INITCODE_SIZE+1 data`, () => {
    const data = new Uint8Array(Number(maxInitCodeSize) + 1)
    for (const txType of txTypes) {
      assert.doesNotThrow(
        () => createTx({ data, type: txType, to: addressZero }, { common }),
        undefined,
        undefined,
        `Instantiated tx with MAX_INITCODE_SIZE+1 for txType: ${txType}`,
      )
    }
  })

  describe('Should allow txs with MAX_INITCODE_SIZE+1 data if allowUnlimitedInitCodeSize is active', () => {
    it('should work', () => {
      const data = new Uint8Array(Number(maxInitCodeSize) + 1)
      for (const txType of txTypes) {
        assert.doesNotThrow(
          () => createTx({ data, type: txType }, { common, allowUnlimitedInitCodeSize: true }),
          undefined,
          undefined,
          `Instantiated create tx with MAX_INITCODE_SIZE+1 for txType: ${txType} with unlimited init code size`,
        )
      }
    })
  })

  describe('Should charge initcode analysis gas is allowUnlimitedInitCodeSize is active', () => {
    it('should work', () => {
      const data = new Uint8Array(Number(maxInitCodeSize))
      for (const txType of txTypes) {
        const eip3860ActiveTx = createTx(
          { data, type: txType },
          { common, allowUnlimitedInitCodeSize: true },
        )
        const eip3860DeactivatedTx = createTx(
          { data, type: txType },
          { common, allowUnlimitedInitCodeSize: false },
        )
        assert.isTrue(
          eip3860ActiveTx.getDataGas() === eip3860DeactivatedTx.getDataGas(),
          'charged initcode analysis gas',
        )
      }
    })
  })
})
