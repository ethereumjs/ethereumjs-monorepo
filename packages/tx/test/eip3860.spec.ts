import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { Address } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { TransactionFactory, TransactionType } from '../src/index.js'

const common = new Common({
  chain: Chain.Mainnet,
  hardfork: Hardfork.Paris,
  eips: [3860, 4844, 4895],
})

const maxInitCodeSize = common.param('vm', 'maxInitCodeSize')
const txTypes = [
  TransactionType.Legacy,
  TransactionType.AccessListEIP2930,
  TransactionType.FeeMarketEIP1559,
  TransactionType.BlobEIP4844,
]
const addressZero = Address.zero()

describe('[EIP3860 tests]', () => {
  it(`Should instantiate create txs with MAX_INITCODE_SIZE`, () => {
    const data = new Uint8Array(Number(maxInitCodeSize))
    for (const txType of txTypes) {
      try {
        TransactionFactory.fromTxData({ data, type: txType }, { common })
        assert.ok('Instantiated create tx with MAX_INITCODE_SIZE data')
      } catch (e) {
        assert.fail('Did not instantiate create tx with MAX_INITCODE_SIZE')
      }
    }
  })

  it(`Should instantiate txs with MAX_INITCODE_SIZE data`, () => {
    const data = new Uint8Array(Number(maxInitCodeSize))
    for (const txType of txTypes) {
      try {
        TransactionFactory.fromTxData({ data, type: txType, to: addressZero }, { common })
        assert.ok('Instantiated tx with MAX_INITCODE_SIZE')
      } catch (e) {
        assert.fail('Did not instantiated tx with MAX_INITCODE_SIZE')
      }
    }
  })

  it(`Should not instantiate create txs with MAX_INITCODE_SIZE+1 data`, () => {
    const data = new Uint8Array(Number(maxInitCodeSize) + 1)
    for (const txType of txTypes) {
      try {
        TransactionFactory.fromTxData({ data, type: txType }, { common })
        assert.fail('Instantiated create tx with MAX_INITCODE_SIZE+1')
      } catch (e) {
        assert.ok('Did not instantiate create tx with MAX_INITCODE_SIZE+1')
      }
    }
  })

  it(`Should instantiate txs with MAX_INITCODE_SIZE+1 data`, () => {
    const data = new Uint8Array(Number(maxInitCodeSize) + 1)
    for (const txType of txTypes) {
      try {
        TransactionFactory.fromTxData({ data, type: txType, to: addressZero }, { common })
        assert.ok('Instantiated tx with MAX_INITCODE_SIZE+1')
      } catch (e) {
        assert.fail('Did not instantiate tx with MAX_INITCODE_SIZE+1')
      }
    }
  })

  describe('Should allow txs with MAX_INITCODE_SIZE+1 data if allowUnlimitedInitCodeSize is active', () => {
    it('should work', () => {
      const data = new Uint8Array(Number(maxInitCodeSize) + 1)
      for (const txType of txTypes) {
        try {
          TransactionFactory.fromTxData(
            { data, type: txType },
            { common, allowUnlimitedInitCodeSize: true }
          )
          assert.ok('Instantiated create tx with MAX_INITCODE_SIZE+1')
        } catch (e) {
          assert.fail('Did not instantiate tx with MAX_INITCODE_SIZE+1')
        }
      }
    })
  })

  describe('Should charge initcode analysis gas is allowUnlimitedInitCodeSize is active', () => {
    it('should work', () => {
      const data = new Uint8Array(Number(maxInitCodeSize))
      for (const txType of txTypes) {
        const eip3860ActiveTx = TransactionFactory.fromTxData(
          { data, type: txType },
          { common, allowUnlimitedInitCodeSize: true }
        )
        const eip3860DeactivedTx = TransactionFactory.fromTxData(
          { data, type: txType },
          { common, allowUnlimitedInitCodeSize: false }
        )
        assert.ok(
          eip3860ActiveTx.getDataFee() === eip3860DeactivedTx.getDataFee(),
          'charged initcode analysis gas'
        )
      }
    })
  })
})
