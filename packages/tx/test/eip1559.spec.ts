import Common from '@ethereumjs/common'
import { BN, rlp } from 'ethereumjs-util'
import tape from 'tape'
import { FeeMarketEIP1559Transaction } from '../src'

const testdata = require('./json/eip1559.json') // Source: Besu

const common = new Common({
  chain: 'aleut',
  hardfork: 'london',
})

tape('[FeeMarketEIP1559Transaction]', function (t) {
  t.test('getUpfrontCost()', function (st) {
    const tx = FeeMarketEIP1559Transaction.fromTxData(
      {
        maxFeePerGas: 10,
        maxInclusionFeePerGas: 8,
        gasLimit: 100,
        value: 6,
      },
      { common }
    )
    st.equals(tx.getUpfrontCost().toNumber(), 806, 'correct upfront cost with default base fee')
    let baseFee = new BN(0)
    st.equals(tx.getUpfrontCost(baseFee).toNumber(), 806, 'correct upfront cost with 0 base fee')
    baseFee = new BN(4)
    st.equals(
      tx.getUpfrontCost(baseFee).toNumber(),
      1006,
      'correct upfront cost with cost-changing base fee value'
    )
    st.end()
  })

  t.test('Should sign txs correctly', function (st) {
    for (let index = 0; index < testdata.length; index++) {
      const data = testdata[index]
      const pkey = Buffer.from(data.privateKey.slice(2), 'hex')
      const txn = FeeMarketEIP1559Transaction.fromTxData(data, { common })
      const signed = txn.sign(pkey)
      const rlpSerialized = rlp.encode(signed.serialize())
      st.ok(rlpSerialized.equals(Buffer.from(data.signedTransactionRLP.slice(2), 'hex')))
    }
    st.end()
  })
})
