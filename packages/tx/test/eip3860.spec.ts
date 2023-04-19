import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { Address } from '@ethereumjs/util'
import * as tape from 'tape'

import { TransactionFactory } from '../src'

const common = new Common({
  chain: Chain.Mainnet,
  hardfork: Hardfork.Paris,
  eips: [3860, 4844, 4895],
})

const maxInitCodeSize = common.param('vm', 'maxInitCodeSize')
const txTypes = [0, 1, 2, 3]
const addressZero = Address.zero()

tape('[EIP3860 tests]', function (t) {
  t.test('Should instantiate create txs with MAX_INITCODE_SIZE', (st) => {
    const data = new Uint8Array(Number(maxInitCodeSize))
    for (const txType of txTypes) {
      try {
        TransactionFactory.fromTxData({ data, type: txType }, { common })
        st.ok('Instantiated create tx with MAX_INITCODE_SIZE data')
      } catch (e) {
        st.fail('Did not instantiate create tx with MAX_INITCODE_SIZE')
      }
    }
    st.end()
  })

  t.test('Should instantiate txs with MAX_INITCODE_SIZE data', (st) => {
    const data = new Uint8Array(Number(maxInitCodeSize))
    for (const txType of txTypes) {
      try {
        TransactionFactory.fromTxData({ data, type: txType, to: addressZero }, { common })
        st.ok('Instantiated tx with MAX_INITCODE_SIZE')
      } catch (e) {
        st.fail('Did not instantiated tx with MAX_INITCODE_SIZE')
      }
    }
    st.end()
  })

  t.test('Should not instantiate create txs with MAX_INITCODE_SIZE+1 data', (st) => {
    const data = new Uint8Array(Number(maxInitCodeSize) + 1)
    for (const txType of txTypes) {
      try {
        TransactionFactory.fromTxData({ data, type: txType }, { common })
        st.fail('Instantiated create tx with MAX_INITCODE_SIZE+1')
      } catch (e) {
        st.ok('Did not instantiate create tx with MAX_INITCODE_SIZE+1')
      }
    }
    st.end()
  })

  t.test('Should instantiate txs with MAX_INITCODE_SIZE+1 data', (st) => {
    const data = new Uint8Array(Number(maxInitCodeSize) + 1)
    for (const txType of txTypes) {
      try {
        TransactionFactory.fromTxData({ data, type: txType, to: addressZero }, { common })
        st.ok('Instantiated tx with MAX_INITCODE_SIZE+1')
      } catch (e) {
        st.fail('Did not instantiate tx with MAX_INITCODE_SIZE+1')
      }
    }
    st.end()
  })

  tape(
    'Should allow txs with MAX_INITCODE_SIZE+1 data if allowUnlimitedInitCodeSize is active',
    (st) => {
      const data = new Uint8Array(Number(maxInitCodeSize) + 1)
      for (const txType of txTypes) {
        try {
          TransactionFactory.fromTxData(
            { data, type: txType },
            { common, allowUnlimitedInitCodeSize: true }
          )
          st.ok('Instantiated create tx with MAX_INITCODE_SIZE+1')
        } catch (e) {
          st.fail('Did not instantiate tx with MAX_INITCODE_SIZE+1')
        }
      }
      st.end()
    }
  )

  tape('Should charge initcode analysis gas is allowUnlimitedInitCodeSize is active', (st) => {
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
      st.ok(
        eip3860ActiveTx.getDataFee() === eip3860DeactivedTx.getDataFee(),
        'charged initcode analysis gas'
      )
    }
    st.end()
  })
})
