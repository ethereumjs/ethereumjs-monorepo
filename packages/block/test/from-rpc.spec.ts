import * as tape from 'tape'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import { Transaction } from '@ethereumjs/tx'
import blockFromRpc from '../src/from-rpc'
import blockHeaderFromRpc from '../src/header-from-rpc'
import * as blockData from './testdata/testdata-from-rpc.json'
import * as blockDataDifficultyAsInteger from './testdata/testdata-from-rpc-difficulty-as-integer.json'
import * as blockDataWithUncles from './testdata/testdata-from-rpc-with-uncles.json'
import * as uncleBlockData from './testdata/testdata-from-rpc-with-uncles_uncle-block-data.json'
import * as testDataFromRpcGoerliLondon from './testdata/testdata-from-rpc-goerli-london.json'

tape('[fromRPC]: block #2924874', function (t) {
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })

  t.test('should create a block with transactions with valid signatures', function (st) {
    const block = blockFromRpc(blockData, [], { common })
    const allValid = block.transactions.every((tx) => tx.verifySignature())
    st.equal(allValid, true, 'all transaction signatures are valid')
    st.end()
  })

  t.test('should create a block header with the correct hash', function (st) {
    const block = blockHeaderFromRpc(blockData, { common })
    const hash = Buffer.from(blockData.hash.slice(2), 'hex')
    st.ok(block.hash().equals(hash))
    st.end()
  })

  t.test('should create a block with uncles', function (st) {
    const block = blockFromRpc(blockDataWithUncles, [uncleBlockData], { common })
    st.ok(block.validateUnclesHash())
    st.end()
  })
})

tape('[fromRPC]:', function (t) {
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

  t.test('should create a block from london hardfork', function (st) {
    const common = new Common({ chain: Chain.Goerli, hardfork: Hardfork.London })
    const block = blockFromRpc(testDataFromRpcGoerliLondon, [], { common })
    st.equal(
      `0x${block.header.baseFeePerGas?.toString(16)}`,
      testDataFromRpcGoerliLondon.baseFeePerGas
    )
    st.equal(`0x${block.hash().toString('hex')}`, testDataFromRpcGoerliLondon.hash)
    st.end()
  })
})
