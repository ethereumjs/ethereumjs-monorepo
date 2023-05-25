import * as tape from 'tape'

import { TransactionFactory } from '../src'

const optimismTx = require('./json/optimismTx_postRegolith_1559.json')
const optimismSystemTx = require('./json/optimismTx_postRegolith_system.json')

tape('[Optimism]', (t: tape.Test) => {
  t.test('Instantiation/Usage -> 1559 tx', async (st: tape.Test) => {
    const tx = TransactionFactory.fromTxData(optimismTx)
    st.equal(tx.type, 2, 'should be able to instantiate a non-system Optimism tx')
    st.end()
  })

  t.test('Instantiation/Usage -> Optimism system tx', async (st: tape.Test) => {
    try {
      TransactionFactory.fromTxData(optimismSystemTx)
    } catch (e) {
      st.pass('should throw when trying to instantiate a Optimism system tx')
    }
    st.end()
  })
})
