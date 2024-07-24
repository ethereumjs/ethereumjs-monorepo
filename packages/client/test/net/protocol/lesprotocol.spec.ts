import { bytesToHex } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { Chain } from '../../../src/blockchain/index.js'
import { Config } from '../../../src/config.js'
import { FlowControl, LesProtocol } from '../../../src/net/protocol/index.js'

describe('[LesProtocol]', () => {
  it('should get properties', async () => {
    const config = new Config({ accountCache: 10000, storageCache: 1000 })
    const chain = await Chain.create({ config })
    const p = new LesProtocol({ config, chain })
    assert.ok(typeof p.name === 'string', 'get name')
    assert.ok(Array.isArray(p.versions), 'get versions')
    assert.ok(Array.isArray(p.messages), 'get messages')
  })

  it('should open correctly', async () => {
    const config = new Config({ accountCache: 10000, storageCache: 1000 })
    const chain = await Chain.create({ config })
    const p = new LesProtocol({ config, chain })
    await p.open()
    assert.ok(p.opened, 'opened is true')
    assert.notOk(await p.open(), 'repeat open')
  })

  it('should encode/decode status', async () => {
    const config = new Config({ accountCache: 10000, storageCache: 1000 })
    const chain = await Chain.create({ config })
    const flow = new FlowControl({
      bl: 1000,
      mrr: 10,
      mrc: { GetBlockHeaders: { base: 10, req: 10 } },
    })
    const p = new LesProtocol({ config, chain, flow })
    Object.defineProperty(chain, 'chainId', {
      get: () => {
        return BigInt(1)
      },
    })
    Object.defineProperty(chain, 'blocks', {
      get: () => {
        return {
          td: BigInt(100),
          latest: { hash: () => '0xaa' },
        }
      },
    })
    Object.defineProperty(chain, 'genesis', {
      get: () => {
        return { hash: () => '0xbb' }
      },
    })
    Object.defineProperty(chain, 'headers', {
      get: () => {
        return {
          td: BigInt(100),
          latest: {
            hash: () => '0xaa',
            number: BigInt(100),
          },
          height: BigInt(100),
        }
      },
    })
    let status = p.encodeStatus()
    assert.ok(
      bytesToHex(status.chainId) === '0x01' &&
        bytesToHex(status.headTd) === '0x64' &&
        status.headHash === '0xaa' &&
        bytesToHex(status.headNum) === '0x64' &&
        status.genesisHash === '0xbb' &&
        bytesToHex(status.forkID[0]) === '0xfc64ec04' &&
        bytesToHex(status.forkID[1]) === '0x118c30' &&
        bytesToHex(status.recentTxLookup) === '0x01' &&
        status.serveHeaders === 1 &&
        status.serveChainSince === 0 &&
        status.serveStateSince === 0 &&
        //status.txRelay === 1 && TODO: uncomment with client tx pool functionality
        bytesToHex(status['flowControl/BL']) === '0x03e8' &&
        bytesToHex(status['flowControl/MRR']) === '0x0a' &&
        bytesToHex(status['flowControl/MRC'][0][0]) === '0x02' &&
        bytesToHex(status['flowControl/MRC'][0][1]) === '0x0a' &&
        bytesToHex(status['flowControl/MRC'][0][2]) === '0x0a',
      'encode status',
    )
    status = { ...status, chainId: [0x01] }
    status = p.decodeStatus(status)
    assert.ok(
      status.chainId === BigInt(1) &&
        status.headTd === BigInt(100) &&
        status.headHash === '0xaa' &&
        status.headNum === BigInt(100) &&
        status.genesisHash === '0xbb' &&
        bytesToHex(status.forkID[0]) === '0xfc64ec04' &&
        bytesToHex(status.forkID[1]) === '0x118c30' &&
        bytesToHex(status.recentTxLookup) === '0x01' &&
        status.serveHeaders === true &&
        status.serveChainSince === 0 &&
        status.serveStateSince === 0 &&
        //status.txRelay === true && TODO: uncomment with client tx pool functionality
        status.bl === 1000 &&
        status.mrr === 10 &&
        status.mrc['2'].base === 10 &&
        status.mrc['2'].req === 10 &&
        status.mrc.GetBlockHeaders.base === 10 &&
        status.mrc.GetBlockHeaders.req === 10,
      'decode status',
    )
  })
})
