import tape = require('tape')
import blockFromRpc from '../src/from-rpc'
import blockHeaderFromRpc from '../src/header-from-rpc'
import * as blockData from './testdata/testdata-from-rpc.json'

tape('[fromRPC]: block #2924874', function(t) {
  t.test('should create a block with transactions with valid signatures', function(st) {
    let block = blockFromRpc(blockData)
    let allValid = block.transactions.every(tx => tx.verifySignature())
    st.equal(allValid, true, 'all transaction signatures are valid')
    st.end()
  })
  t.test('should create a block header with the correct hash', function(st) {
    let block = blockHeaderFromRpc(blockData)
    st.ok(block.hash().compare(Buffer.from(blockData.hash)))
    st.end()
  })
})
