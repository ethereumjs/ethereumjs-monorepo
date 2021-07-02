import tape from 'tape'
import { Transaction } from '@ethereumjs/tx'
import blockFromRpc from '../src/from-rpc'
import blockHeaderFromRpc from '../src/header-from-rpc'
import * as blockData from './testdata/testdata-from-rpc.json'
import * as blockDataDifficultyAsInteger from './testdata/testdata-from-rpc-difficulty-as-integer.json'
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

  t.test(
    'Should create a block with json data that includes a transaction with value parameter as integer string',
    function (st) {
      const valueAsIntegerString = '1'
      const blockDataTransactionValueAsInteger = blockData
      blockDataTransactionValueAsInteger.transactions[0].value = valueAsIntegerString
      const blockFromTransactionValueAsInteger = blockFromRpc(blockDataTransactionValueAsInteger)
      st.equal(
        blockFromTransactionValueAsInteger.transactions[0].value.toString(),
        valueAsIntegerString
      )

      st.end()
    }
  )

  t.test(
    'Should create a block with json data that includes a transaction with defaults with gasPrice parameter as integer string',
    function (st) {
      const gasPriceAsIntegerString = '1'
      const blockDataTransactionGasPriceAsInteger = blockData
      blockDataTransactionGasPriceAsInteger.transactions[0].gasPrice = gasPriceAsIntegerString
      const blockFromTransactionGasPriceAsInteger = blockFromRpc(
        blockDataTransactionGasPriceAsInteger
      )
      st.equal(
        (blockFromTransactionGasPriceAsInteger.transactions[0] as Transaction).gasPrice.toString(),
        gasPriceAsIntegerString
      )

      st.end()
    }
  )

  t.test(
    'should create a block given json data that includes a difficulty parameter of type integer string',
    function (st) {
      const blockDifficultyAsInteger = blockFromRpc(blockDataDifficultyAsInteger)
      st.equal(
        blockDifficultyAsInteger.header.difficulty.toString(),
        blockDataDifficultyAsInteger.difficulty
      )
      st.end()
    }
  )
})
