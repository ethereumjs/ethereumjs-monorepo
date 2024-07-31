import { createBlock } from '@ethereumjs/block'
import { Common, parseGethGenesis } from '@ethereumjs/common'
import { assert, describe, expect, it, vi } from 'vitest'

import { Config } from '../../../src/index.js'
import { CLConnectionManager, ConnectionStatus } from '../../../src/rpc/modules/engine/index.js'
import { Event } from '../../../src/types.js'
import genesisJSON from '../../testdata/geth-genesis/post-merge.json'

import type { PrefixedHexString } from '@ethereumjs/util'

const payload = {
  payload: {
    parentHash:
      '0xff10941138a407482a2651e3eaf0132f66c82ea1386a1f43287aa0fd6298698a' as PrefixedHexString,
    feeRecipient: '0xf97e180c050e5ab072211ad2c213eb5aee4df134' as PrefixedHexString,
    stateRoot:
      '0x9933050575efffde6b1cdbfb9bca2f1a82df1c3e691f5878afe85eaf21df7d4f' as PrefixedHexString,
    receiptsRoot:
      '0x7d1842a048756ca0aa200ff3eb1b66a52434bc7c1ece5e179eb303a0efa1c944' as PrefixedHexString,
    logsBloom:
      '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040' as PrefixedHexString,
    prevRandao:
      '0xae8dc2c1223d402fb8e1a48ff6f0f15a543357aca40f34099ef5f5502f97d17d' as PrefixedHexString,
    blockNumber: '0xd8d0' as PrefixedHexString,
    gasLimit: '0x7a1200' as PrefixedHexString,
    gasUsed: '0xc2f8e' as PrefixedHexString,
    timestamp: '0x6230c760' as PrefixedHexString,
    extraData: '0x' as PrefixedHexString,
    baseFeePerGas: '0x3af046a' as PrefixedHexString,
    blockHash:
      '0x67b92008edff169c08bc186918a843f7363a747b50ed24d59fbfdee2ffd15882' as PrefixedHexString,
    transactions: [],
  },
}
const update = {
  state: {
    headBlockHash:
      '0x67b92008edff169c08bc186918a843f7363a747b50ed24d59fbfdee2ffd15882' as PrefixedHexString,
    safeBlockHash:
      '0x67b92008edff169c08bc186918a843f7363a747b50ed24d59fbfdee2ffd15882' as PrefixedHexString,
    finalizedBlockHash:
      '0x90ce8a06162cf161cc7323aa30f1de70b30542cd5da65e521884f517a4548017' as PrefixedHexString,
  },
}
describe('starts and stops connection manager', () => {
  const config = new Config()
  const manager = new CLConnectionManager({ config })
  it('should start', () => {
    manager.start()
    assert.ok(manager.running, 'should start')
  })
  it('should stop', () => {
    manager.stop()
    assert.notOk(manager.running, 'should stop')
  })
})

describe('hardfork MergeForkBlock', () => {
  ;(genesisJSON.config as any).mergeForkBlock = 0
  const params = parseGethGenesis(genesisJSON, 'post-merge', false)
  const common = new Common({
    chain: params.name,
    customChains: [params],
  })
  common.setHardforkBy({ blockNumber: 0 })
  const config = new Config({ common })
  it('instantiates with config', () => {
    const manager = new CLConnectionManager({ config })
    assert.ok(manager.running, 'starts on instantiation if hardfork is MergeForkBlock')
    manager.stop()
  })
})
describe('postmerge hardfork', () => {
  it('starts on mergeBlock', async () => {
    ;(genesisJSON.config as any).mergeForkBlock = 10
    const params = parseGethGenesis(genesisJSON, 'post-merge', false)

    const common = new Common({
      chain: params.name,
      customChains: [params],
    })
    common.setHardforkBy({ blockNumber: 11 })
    const config = new Config({ common })
    const manager = new CLConnectionManager({ config })

    config.events.on(Event.CHAIN_UPDATED, () => {
      assert.ok(manager.running, 'connection manager started on chain update on mergeBlock')
      config.events.emit(Event.CLIENT_SHUTDOWN)
    })

    config.events.emit(Event.CHAIN_UPDATED)
    config.events.on(Event.CLIENT_SHUTDOWN, () => {
      it('stops on client shutdown', () => {
        assert.notOk(manager.running, 'connection manager stopped on client shutdown')
      })
    })
  })
})

describe('Status updates', async () => {
  const config = new Config()
  const manager = new CLConnectionManager({ config })
  config.logger.on('data', (chunk) => {
    it('received status message', () => {
      if ((chunk.message as string).includes('consensus forkchoice update head=0x67b9')) {
        assert.ok(true, 'received last fork choice message')
      }
      if ((chunk.message as string).includes('consensus payload received number=55504')) {
        assert.ok(true, 'received last payload message')
        manager.stop()
        config.logger.removeAllListeners()
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
    config.logger.on('data', (chunk) => {
      if ((chunk.message as string).includes('Payload stats blocks count=1')) {
        assert.ok(true, 'received last payload stats message')
        manager.stop()
        config.logger.removeAllListeners()
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
    assert.ok(manager.running, 'connection manager started when updateStatus called')
    assert.equal(
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
    assert.equal(
      manager['connectionStatus'],
      ConnectionStatus.Disconnected,
      'should disconnect from CL',
    )
  })
  it('should change status to uncertain', () => {
    manager['connectionStatus'] = ConnectionStatus.Connected
    manager['lastRequestTimestamp'] = Date.now() - manager['UNCERTAIN_THRESHOLD'] - 1
    manager['connectionCheck']()
    assert.equal(
      manager['connectionStatus'],
      ConnectionStatus.Uncertain,
      'should update status to uncertain',
    )
  })

  it('incremented disconnection check', () => {
    manager['config'].chainCommon.setHardfork('paris')
    ;(manager as any)._inActivityCb = () => vi.fn()
    const callbackSpy = vi.spyOn(manager as any, '_inActivityCb')
    manager['connectionCheck']()
    expect(callbackSpy).toHaveBeenCalledTimes(1)
    assert.equal(manager['disconnectedCheckIndex'], 1, 'disconnection check incremented correctly')
  })
})
