import tape from 'tape'
import { toBuffer } from 'ethereumjs-util'
import Common from '@ethereumjs/common'
import { LegacyTransaction, EIP2930Transaction } from '../src'
import { TxsJsonEntry } from './types'
import { BaseTransaction } from '../src/baseTransaction'

tape('[BaseTransaction]', function (t) {
  const legacyFixtures: TxsJsonEntry[] = require('./json/txs.json')
  const legacyTxs: BaseTransaction<LegacyTransaction>[] = []
  legacyFixtures.slice(0, 4).forEach(function (tx: any) {
    const txData = tx.raw.map(toBuffer)
    legacyTxs.push(LegacyTransaction.fromValuesArray(txData))
  })

  const eip2930Fixtures: TxsJsonEntry[] = require('./json/eip2930txs.json')
  const eip2930Txs: BaseTransaction<EIP2930Transaction>[] = []
  eip2930Fixtures.forEach(function (txData) {
    eip2930Txs.push(EIP2930Transaction.fromTxData(txData))
  })

  const zero = Buffer.alloc(0)
  const txTypes = [
    {
      class: LegacyTransaction,
      name: 'LegacyTransaction',
      values: Array(6).fill(zero),
      txs: legacyTxs,
    },
    {
      class: EIP2930Transaction,
      name: 'EIP2930Transaction',
      values: [Buffer.from([1])].concat(Array(7).fill(zero)),
      txs: eip2930Txs,
    },
  ]

  t.test('Initialization', function (st) {
    for (const txType of txTypes) {
      let tx = txType.class.fromTxData({})
      st.equal(
        tx.common.hardfork(),
        'berlin',
        `${txType.name}: should initialize with correct default HF`
      )
      st.ok(Object.isFrozen(tx), `${txType.name}: tx should be frozen by default`)

      const common = new Common({
        chain: 'mainnet',
        hardfork: 'istanbul',
        eips: [2718, 2929, 2930],
      })
      tx = txType.class.fromTxData({}, { common })
      st.equal(
        tx.common.hardfork(),
        'istanbul',
        `${txType.name}: should initialize with correct HF provided`
      )

      common.setHardfork('byzantium')
      st.equal(
        tx.common.hardfork(),
        'istanbul',
        `${txType.name}: should stay on correct HF if outer common HF changes`
      )

      tx = txType.class.fromTxData({}, { freeze: false })
      tx = txType.class.fromTxData({}, { freeze: false })
      st.ok(
        !Object.isFrozen(tx),
        `${txType.name}: tx should not be frozen when freeze deactivated in options`
      )

      // Perform the same test as above, but now using a different construction method. This also implies that passing on the
      // options object works as expected.
      tx = txType.class.fromTxData({}, { freeze: false })
      const rlpData = tx.serialize()

      tx = txType.class.fromRlpSerializedTx(rlpData)
      st.ok(Object.isFrozen(tx), `${txType.name}: tx should be frozen by default`)

      tx = txType.class.fromRlpSerializedTx(rlpData, { freeze: false })
      st.ok(
        !Object.isFrozen(tx),
        `${txType.name}: tx should not be frozen when freeze deactivated in options`
      )

      tx = txType.class.fromValuesArray(txType.values)
      st.ok(Object.isFrozen(tx), `${txType.name}: tx should be frozen by default`)

      tx = txType.class.fromValuesArray(txType.values, { freeze: false })
      st.ok(
        !Object.isFrozen(tx),
        `${txType.name}: tx should not be frozen when freeze deactivated in options`
      )
    }
    st.end()
  })
})
