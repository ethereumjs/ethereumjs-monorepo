import { Common, Hardfork } from '@ethereumjs/common'
import * as tape from 'tape'

import { Block } from '../src/index'

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
        st.pass(`successfully constructed block=${block.header.number}`)
      } catch (e) {
        st.fail(`failed to construct block, error: ${e}`)
      }
    }
    st.end()
  })

  t.test('should validate block hash', async function (st) {
    try {
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
})
