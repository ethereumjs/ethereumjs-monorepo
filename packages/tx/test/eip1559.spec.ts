import Common from '@ethereumjs/common'
import { rlp } from 'ethereumjs-util'
import tape from 'tape'
import { FeeMarketEIP1559Transaction } from '../src'

const testdata = require('./json/eip1559.json') // Source: Besu

const common = new Common({
  chain: 'aleut',
  hardfork: 'london',
})

tape('[FeeMarketEIP1559Transaction]', function (t) {
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
