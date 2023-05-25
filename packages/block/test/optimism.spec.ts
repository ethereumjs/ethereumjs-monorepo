import { Chain, Common } from '@ethereumjs/common'
import * as tape from 'tape'

import { Block } from '../src'

// 1 system tx (tx type 126), 1 normal tx
const optimismBlockWith2Txs = require('./testdata/optimism_bedrock_regolith_goerli_6826186.json')

tape('[Optimism]', function (t) {
  t.test('should test block initialization', function (st) {
    const common = new Common({ chain: Chain.OptimismGoerli })
    Block.fromBlockData({}, { common })
    st.pass('should create a default block with Optimism Bedrock Goerli common')

    try {
      Block.fromBlockData(optimismBlockWith2Txs, { common })
      st.fail('should throw')
    } catch (e) {
      st.pass(
        'should throw when trying to initialize an Optimism block with skipTxTypes=false (default)'
      )
    }

    Block.fromBlockData(optimismBlockWith2Txs, { common, skipTxTypes: [126] })
    st.pass('fromBlockData: should instantiate block with skipTxTypes=[126]')

    st.end()
  })

  t.test('should test controlled non-functionality', async function (st) {
    const common = new Common({ chain: Chain.OptimismGoerli })

    const block = Block.fromBlockData(optimismBlockWith2Txs, { common, skipTxTypes: [126] })

    try {
      block.raw()
      st.fail('should throw')
    } catch (e) {
      st.pass('should throw on raw() call')
    }

    try {
      await block.validateTransactionsTrie()
      st.fail('should throw')
    } catch (e) {
      st.pass('should throw on validateTransactionsTrie() call')
    }

    try {
      block.validateTransactions()
      st.fail('should throw')
    } catch (e) {
      st.pass('should throw on validateTransactions() call')
    }

    st.end()
  })
})
