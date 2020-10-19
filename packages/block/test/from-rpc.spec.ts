import tape from 'tape'
import blockFromRpc from '../src/from-rpc'
import blockHeaderFromRpc from '../src/header-from-rpc'
import * as blockData from './testdata/testdata-from-rpc.json'
import * as blockDataWithUncles from './testdata/testdata-from-rpc-with-uncles.json'
import * as uncleBlockData from './testdata/testdata-from-rpc-with-uncles_uncle-block-data.json'

tape('[fromRPC]: block #2924874', function (t) {
  t.test('should create a block with transactions with valid signatures', function (st) {
    const block = blockFromRpc(blockData)
    const allValid = block.transactions.every((tx) => tx.verifySignature())
    st.equal(allValid, true, 'all transaction signatures are valid')
    st.end()
  })

  t.test('should create a block header with the correct hash', function (st) {
    const block = blockHeaderFromRpc(blockData)
    const hash = Buffer.from(blockData.hash.slice(2), 'hex')
    st.ok(block.hash().equals(hash))
    st.end()
  })

  t.test('should create a block with uncles', function (st) {
    const block = blockFromRpc(blockDataWithUncles, [uncleBlockData])
    st.ok(block.validateUnclesHash())
    st.end()
  })
})
