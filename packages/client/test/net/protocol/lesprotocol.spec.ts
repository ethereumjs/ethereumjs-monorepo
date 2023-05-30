import { bytesToHex } from '@ethereumjs/util'
import * as tape from 'tape'

import { Chain } from '../../../src/blockchain'
import { Config } from '../../../src/config'
import { FlowControl, LesProtocol } from '../../../src/net/protocol'

tape('[LesProtocol]', (t) => {
  t.test('should get properties', async (t) => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const chain = await Chain.create({ config })
    const p = new LesProtocol({ config, chain })
    t.ok(typeof p.name === 'string', 'get name')
    t.ok(Array.isArray(p.versions), 'get versions')
    t.ok(Array.isArray(p.messages), 'get messages')
    t.end()
  })

  t.test('should open correctly', async (t) => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const chain = await Chain.create({ config })
    const p = new LesProtocol({ config, chain })
    await p.open()
    t.ok(p.opened, 'opened is true')
    t.notOk(await p.open(), 'repeat open')
    t.end()
  })

  t.test('should encode/decode status', async (t) => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const chain = await Chain.create({ config })
    const flow = new FlowControl({
      bl: 1000,
      mrr: 10,
      mrc: { GetBlockHeaders: { base: 10, req: 10 } },
    })
    const p = new LesProtocol({ config, chain, flow })
    Object.defineProperty(chain, 'networkId', {
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
    t.ok(
      bytesToHex(status.networkId) === '01' &&
        bytesToHex(status.headTd) === '64' &&
        status.headHash === '0xaa' &&
        bytesToHex(status.headNum) === '64' &&
        status.genesisHash === '0xbb' &&
        bytesToHex(status.forkID[0]) === 'fc64ec04' &&
        bytesToHex(status.forkID[1]) === '118c30' &&
        bytesToHex(status.recentTxLookup) === '01' &&
        status.serveHeaders === 1 &&
        status.serveChainSince === 0 &&
        status.serveStateSince === 0 &&
        //status.txRelay === 1 && TODO: uncomment with client tx pool functionality
        bytesToHex(status['flowControl/BL']) === '03e8' &&
        bytesToHex(status['flowControl/MRR']) === '0a' &&
        bytesToHex(status['flowControl/MRC'][0][0]) === '02' &&
        bytesToHex(status['flowControl/MRC'][0][1]) === '0a' &&
        bytesToHex(status['flowControl/MRC'][0][2]) === '0a',
      'encode status'
    )
    status = { ...status, networkId: [0x01] }
    status = p.decodeStatus(status)
    t.ok(
      status.networkId === BigInt(1) &&
        status.headTd === BigInt(100) &&
        status.headHash === '0xaa' &&
        status.headNum === BigInt(100) &&
        status.genesisHash === '0xbb' &&
        bytesToHex(status.forkID[0]) === 'fc64ec04' &&
        bytesToHex(status.forkID[1]) === '118c30' &&
        bytesToHex(status.recentTxLookup) === '01' &&
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
      'decode status'
    )
    t.end()
  })
})
