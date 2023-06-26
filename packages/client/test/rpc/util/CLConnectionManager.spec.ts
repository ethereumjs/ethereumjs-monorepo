import { Common, parseGethGenesis } from '@ethereumjs/common'
import * as tape from 'tape'

import { Config } from '../../../src'
import { CLConnectionManager } from '../../../src/rpc/util/CLConnectionManager'
import { Event } from '../../../src/types'
import genesisJSON = require('../../testdata/geth-genesis/post-merge.json')

const payload = {
  payload: {
    parentHash: '0xff10941138a407482a2651e3eaf0132f66c82ea1386a1f43287aa0fd6298698a',
    feeRecipient: '0xf97e180c050e5ab072211ad2c213eb5aee4df134',
    stateRoot: '0x9933050575efffde6b1cdbfb9bca2f1a82df1c3e691f5878afe85eaf21df7d4f',
    receiptsRoot: '0x7d1842a048756ca0aa200ff3eb1b66a52434bc7c1ece5e179eb303a0efa1c944',
    logsBloom:
      '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040',
    prevRandao: '0xae8dc2c1223d402fb8e1a48ff6f0f15a543357aca40f34099ef5f5502f97d17d',
    blockNumber: '0xd8d0',
    gasLimit: '0x7a1200',
    gasUsed: '0xc2f8e',
    timestamp: '0x6230c760',
    extraData: '0x',
    baseFeePerGas: '0x3af046a',
    blockHash: '0x67b92008edff169c08bc186918a843f7363a747b50ed24d59fbfdee2ffd15882',
    transactions: [],
  },
}
const update = {
  state: {
    headBlockHash: '0x67b92008edff169c08bc186918a843f7363a747b50ed24d59fbfdee2ffd15882',
    safeBlockHash: '0x67b92008edff169c08bc186918a843f7363a747b50ed24d59fbfdee2ffd15882',
    finalizedBlockHash: '0x90ce8a06162cf161cc7323aa30f1de70b30542cd5da65e521884f517a4548017',
  },
}

tape('[CLConnectionManager]', (t) => {
  t.test('Initialization', async (st) => {
    st.plan(5)
    let config = new Config()
    let manager = new CLConnectionManager({ config })
    manager.start()
    st.ok(manager.running, 'should start')
    manager.stop()
    st.ok(!manager.running, 'should stop')
    const prevMergeForkBlock = (genesisJSON.config as any).mergeForkBlock
    ;(genesisJSON.config as any).mergeForkBlock = 0
    const params = parseGethGenesis(genesisJSON, 'post-merge', false)
    let common = new Common({
      chain: params.name,
      customChains: [params],
    })
    common.setHardforkBy({ blockNumber: 0 })
    config = new Config({ common })
    manager = new CLConnectionManager({ config })
    st.ok(manager.running, 'starts on instantiation if hardfork is MergeForkBlock')
    manager.stop()
    ;(genesisJSON.config as any).mergeForkBlock = 10
    common = new Common({
      chain: params.name,
      customChains: [params],
    })
    config = new Config({ common })
    manager = new CLConnectionManager({ config })
    config.chainCommon.setHardforkBy({ blockNumber: 11 })
    config.events.on(Event.CHAIN_UPDATED, () => {
      st.ok(manager.running, 'connection manager started on chain update on mergeBlock')
    })
    config.events.on(Event.CLIENT_SHUTDOWN, () => {
      st.ok(!manager.running, 'connection manager stopped on client shutdown')
    })
    config.events.emit(Event.CHAIN_UPDATED)
    config.events.emit(Event.CLIENT_SHUTDOWN)
    // reset prevMergeForkBlock as it seems to be polluting other tests
    ;(genesisJSON.config as any).mergeForkBlock = prevMergeForkBlock
  })

  t.test('Status updates', async (st) => {
    st.plan(2)
    const config = new Config()
    const manager = new CLConnectionManager({ config })
    config.logger.on('data', (chunk) => {
      if ((chunk.message as string).includes('consensus forkchoice update head=0x67b9')) {
        st.pass('received last fork choice message')
      }
      if ((chunk.message as string).includes('consensus payload received number=55504')) {
        st.pass('received last payload message')
        manager.stop()
        config.logger.removeAllListeners()
      }
    })
    manager.lastForkchoiceUpdate(update)
    manager.lastNewPayload(payload)
  })
})
