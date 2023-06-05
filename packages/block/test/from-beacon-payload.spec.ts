import { Common, Hardfork } from '@ethereumjs/common'
import * as tape from 'tape'

import { Block, BlockHeader } from '../src/index'

import * as payload87335 from './testdata/payload-slot-87335.json'
import * as payload87475 from './testdata/payload-slot-87475.json'

tape('[fromExecutionPayloadJson]: 4844 devnet 5', async function (t) {
  const network = 'sharding'
  const shardingJson = require(`../../client/test/sim/configs/sharding.json`)

  // safely change chainId without modifying undelying json
  const commonJson = { ...shardingJson }
  commonJson.config = { ...commonJson.config, chainId: 4844001005 }
  const common = Common.fromGethGenesis(commonJson, { chain: network })
  common.setHardfork(Hardfork.Cancun)

  t.test('reconstruct cancun block with blob txs', async function (st) {
    for (const payload of [payload87335, payload87475]) {
      try {
        const block = await Block.fromBeaconPayloadJson(payload, { common })
        const parentHeader = BlockHeader.fromHeaderData(
          { excessDataGas: BigInt(0), dataGasUsed: block.header.excessDataGas! + BigInt(262144) },
          { common }
        )
        block.validateBlobTransactions(parentHeader)
        st.pass(`successfully constructed block=${block.header.number}`)
      } catch (e) {
        st.fail(`failed to construct block, error: ${e}`)
      }
    }
    st.end()
  })

  t.test('should validate block hash', async function (st) {
    try {
      // construct a payload with differing block hash
      await Block.fromBeaconPayloadJson(
        { ...payload87335, block_hash: payload87475.block_hash },
        { common }
      )
      st.fail(`should have failed constructing the block`)
    } catch (e) {
      st.pass(`correctly failed constructing block, error: ${e}`)
      st.ok(`${e}`.includes('Invalid blockHash'), 'failed with correct error')
    }
  })

  t.test('should validate excess data gas', async function (st) {
    try {
      // construct a payload with a different excess data gas but matching hash
      const block = await Block.fromBeaconPayloadJson(
        {
          ...payload87475,
          block_hash: '0x5be157c3b687537d20a252ad072e8d6a458108eb1b95944368f5a8f8f3325b07',
        },
        { common }
      )
      const parentHeader = BlockHeader.fromHeaderData({ excessDataGas: BigInt(0) }, { common })
      block.validateBlobTransactions(parentHeader)
      st.fail(`should have failed constructing the block`)
    } catch (e) {
      st.pass(`correctly failed constructing block, error: ${e}`)
      st.ok(`${e}`.includes('block excessDataGas mismatch'), 'failed with correct error')
    }
  })
})
