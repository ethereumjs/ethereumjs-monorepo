import { createBlock } from '@ethereumjs/block'
import { createCommonFromGethGenesis, parseGethGenesis } from '@ethereumjs/common'
import { postMergeGethGenesis } from '@ethereumjs/testdata'
import { assert, describe, expect, it, vi } from 'vitest'

import { Config } from '../../../src/index.ts'
import { CLConnectionManager, ConnectionStatus } from '../../../src/rpc/modules/engine/index.ts'
import { Event } from '../../../src/types.ts'

import { getLogger } from '../../../src/logging.ts'
import type { ForkchoiceUpdate, NewPayload } from '../../../src/rpc/modules/engine/index.ts'

const payload: NewPayload = {
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
const update: ForkchoiceUpdate = {
  state: {
    headBlockHash: '0x67b92008edff169c08bc186918a843f7363a747b50ed24d59fbfdee2ffd15882',
    safeBlockHash: '0x67b92008edff169c08bc186918a843f7363a747b50ed24d59fbfdee2ffd15882',
    finalizedBlockHash: '0x90ce8a06162cf161cc7323aa30f1de70b30542cd5da65e521884f517a4548017',
  },
}
describe('starts and stops connection manager', () => {
  const config = new Config()
  const manager = new CLConnectionManager({ config })
  it('should start', () => {
    manager.start()
    assert.isTrue(manager.running, 'should start')
  })
  it('should stop', () => {
    manager.stop()
    assert.isFalse(manager.running, 'should stop')
  })
})

describe('hardfork MergeForkBlock', () => {
  postMergeGethGenesis.config.mergeForkBlock = 0
  const params = parseGethGenesis(postMergeGethGenesis, 'post-merge')
  const common = createCommonFromGethGenesis(postMergeGethGenesis, { chain: params.name })
  common.setHardforkBy({ blockNumber: 0 })
  const config = new Config({ common })
  it('instantiates with config', () => {
    const manager = new CLConnectionManager({ config })
    assert.isTrue(manager.running, 'starts on instantiation if hardfork is MergeForkBlock')
    manager.stop()
  })
})
describe('postmerge hardfork', () => {
  it('starts on mergeBlock', async () => {
    postMergeGethGenesis.config.mergeForkBlock = 10
    const params = parseGethGenesis(postMergeGethGenesis, 'post-merge')

    const common = createCommonFromGethGenesis(postMergeGethGenesis, {
      chain: params.name,
    })
    common.setHardforkBy({ blockNumber: 11 })
    const config = new Config({ common })
    const manager = new CLConnectionManager({ config })

    config.events.on(Event.CHAIN_UPDATED, () => {
      assert.isTrue(manager.running, 'connection manager started on chain update on mergeBlock')
      config.events.emit(Event.CLIENT_SHUTDOWN)
    })

    config.events.emit(Event.CHAIN_UPDATED)
    config.events.on(Event.CLIENT_SHUTDOWN, () => {
      it('stops on client shutdown', () => {
        assert.isFalse(manager.running, 'connection manager stopped on client shutdown')
      })
    })
  })
})

describe('Status updates', async () => {
  const config = new Config({ logger: getLogger({}) })
  const manager = new CLConnectionManager({ config })
  config.logger?.on('data', (chunk) => {
    it('received status message', () => {
      if ((chunk.message as string).includes('consensus forkchoice update head=0x67b9')) {
        assert.isTrue(true, 'received last fork choice message')
      }
      if ((chunk.message as string).includes('consensus payload received number=55504')) {
        assert.isTrue(true, 'received last payload message')
        manager.stop()
        config.logger?.removeAllListeners()
      }
    })
  })
  manager.lastForkchoiceUpdate(update)
  manager.lastNewPayload(payload)
})
describe('updates stats when a new block is processed', () => {
  it('received message', async () => {
    const config = new Config()
    const manager = new CLConnectionManager({ config })
    manager.lastForkchoiceUpdate(update)
    manager.lastNewPayload(payload)
    const block = createBlock({
      header: {
        parentHash: payload.payload.blockHash,
        number: payload.payload.blockNumber,
      },
    })
    config.logger?.on('data', (chunk) => {
      if ((chunk.message as string).includes('Payload stats blocks count=1')) {
        assert.isTrue(true, 'received last payload stats message')
        manager.stop()
        config.logger?.removeAllListeners()
      }
    })

    manager.updatePayloadStats(block)
    manager['lastPayloadLog']()
  })
})
describe('updates status correctly', async () => {
  const config = new Config()
  const manager = new CLConnectionManager({ config })
  manager['updateStatus']()
  it('updates status correctly', () => {
    assert.isTrue(manager.running, 'connection manager started when updateStatus called')
    assert.strictEqual(
      manager['connectionStatus'],
      ConnectionStatus.Connected,
      'connection status updated correctly',
    )
  })
})
describe('updates connection status correctly', async () => {
  vi.useFakeTimers()
  vi.setSystemTime(1696528979492)
  const config = new Config()
  const manager = new CLConnectionManager({ config })
  it('should disconnect from CL', () => {
    manager['connectionStatus'] = ConnectionStatus.Connected
    manager['lastRequestTimestamp'] = Date.now() - manager['DISCONNECTED_THRESHOLD'] - 1
    manager['connectionCheck']()
    assert.strictEqual(
      manager['connectionStatus'],
      ConnectionStatus.Disconnected,
      'should disconnect from CL',
    )
  })
  it('should change status to uncertain', () => {
    manager['connectionStatus'] = ConnectionStatus.Connected
    manager['lastRequestTimestamp'] = Date.now() - manager['UNCERTAIN_THRESHOLD'] - 1
    manager['connectionCheck']()
    assert.strictEqual(
      manager['connectionStatus'],
      ConnectionStatus.Uncertain,
      'should update status to uncertain',
    )
  })

  it('incremented disconnection check', () => {
    manager['config'].chainCommon.setHardfork('paris')
    manager['_inActivityCb'] = () => vi.fn()
    const callbackSpy = vi.spyOn(manager as any, '_inActivityCb')
    manager['connectionCheck']()
    expect(callbackSpy).toHaveBeenCalledTimes(1)
    assert.strictEqual(
      manager['disconnectedCheckIndex'],
      1,
      'disconnection check incremented correctly',
    )
  })
})
