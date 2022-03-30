import Common from '@ethereumjs/common'
import tape from 'tape'
import { Config } from '../../../lib'
import { CLConnectionManager } from '../../../lib/rpc/util/CLConnectionManager'
import genesisJSON from '../../testdata/geth-genesis/post-merge.json'
import { parseCustomParams } from '../../../lib/util'
import { Event } from '../../../lib/types'
tape('[CLConnectionManager]: Public method tests', (t) => {
  t.test('constructor/initialization tests', async (st) => {
    st.plan(5)
    const config = new Config()
    const connMan = new CLConnectionManager({ config: config })
    connMan.start()
    st.ok(connMan.running, 'connection manager should start')
    connMan.stop()
    st.ok(!connMan.running, 'connection manager should stop')
    ;(genesisJSON.config as any).mergeForkBlock = 0
    const params = await parseCustomParams(genesisJSON, 'post-merge')
    const mergeCommon = new Common({
      chain: params.name,
      customChains: [params],
    })
    mergeCommon.setHardforkByBlockNumber(0, 0)
    const mergeConfig = new Config({ common: mergeCommon })
    const mergeConMan = new CLConnectionManager({ config: mergeConfig })
    st.ok(mergeConMan.running, 'starts on instantiation if hardfork is MergeForkBlock')
    mergeConMan.stop()
    ;(genesisJSON.config as any).mergeForkBlock = 10
    const preMergeCommon = new Common({
      chain: params.name,
      customChains: [params],
    })
    const preMergeConfig = new Config({ common: preMergeCommon })
    const preMergeConnMan = new CLConnectionManager({ config: preMergeConfig })
    preMergeConfig.chainCommon.setHardforkByBlockNumber(11)
    preMergeConfig.events.on(Event.CHAIN_UPDATED, () => {
      st.ok(preMergeConnMan.running, 'connection manager started on chain update on mergeBlock')
    })
    preMergeConfig.events.on(Event.CLIENT_SHUTDOWN, () => {
      st.ok(!preMergeConnMan.running, 'connection manager stopped on client shutdown')
    })
    preMergeConfig.events.emit(Event.CHAIN_UPDATED)
    preMergeConfig.events.emit(Event.CLIENT_SHUTDOWN)
    st.end()
  })

  t.test('status update tests', async (st) => {
    st.plan(2)
    const config = new Config()
    const connMan = new CLConnectionManager({ config: config })
    const newPayload = {
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
    }
    const lastForkChoiceUpdate = {
      state: {
        headBlockHash: '0x67b92008edff169c08bc186918a843f7363a747b50ed24d59fbfdee2ffd15882',
        safeBlockHash: '0x67b92008edff169c08bc186918a843f7363a747b50ed24d59fbfdee2ffd15882',
        finalizedBlockHash: '0x90ce8a06162cf161cc7323aa30f1de70b30542cd5da65e521884f517a4548017',
      },
    }
    config.logger.on('data', (chunk) => {
      if (chunk.message.includes('consensus forkchoice update head=0x67b9')) {
        st.pass('received last fork choice message')
      }
      if (chunk.message.includes('consensus payload received number=55504')) {
        st.pass('received last payload message')
        connMan.stop()
        config.logger.removeAllListeners()
      }
    })
    connMan.lastForkchoiceUpdate(lastForkChoiceUpdate)
    connMan.lastNewPayload({ payload: newPayload })
  })
})
