import tape from 'tape-catch'
import { BN } from 'ethereumjs-util'
import { Chain } from '../../../lib/blockchain'
import { Config } from '../../../lib/config'
import { FlowControl, LesProtocol } from '../../../lib/net/protocol'

tape('[LesProtocol]', (t) => {
  t.test('should get properties', (t) => {
    const config = new Config({ transports: [], loglevel: 'error' })
    const chain = new Chain({ config })
    const p = new LesProtocol({ config, chain })
    t.ok(typeof p.name === 'string', 'get name')
    t.ok(Array.isArray(p.versions), 'get versions')
    t.ok(Array.isArray(p.messages), 'get messages')
    t.end()
  })

  t.test('should open correctly', async (t) => {
    const config = new Config({ transports: [], loglevel: 'error' })
    const chain = new Chain({ config })
    const p = new LesProtocol({ config, chain })
    await p.open()
    t.ok(p.opened, 'opened is true')
    t.notOk(await p.open(), 'repeat open')
    t.end()
  })

  t.test('should encode/decode status', (t) => {
    const config = new Config({ transports: [], loglevel: 'error' })
    const chain = new Chain({ config })
    const flow = new FlowControl({
      bl: 1000,
      mrr: 10,
      mrc: { GetBlockHeaders: { base: 10, req: 10 } },
    })
    const p = new LesProtocol({ config, chain, flow })
    Object.defineProperty(chain, 'networkId', {
      get: () => {
        return new BN(1)
      },
    })
    Object.defineProperty(chain, 'blocks', {
      get: () => {
        return {
          td: new BN(100),
          latest: { hash: () => '0xaa' },
        }
      },
    })
    Object.defineProperty(chain, 'genesis', {
      get: () => {
        return { hash: '0xbb' }
      },
    })
    Object.defineProperty(chain, 'headers', {
      get: () => {
        return {
          td: new BN(100),
          latest: {
            hash: () => '0xaa',
            number: new BN(100),
          },
        }
      },
    })
    let status = p.encodeStatus()
    t.ok(
      status.networkId.toString('hex') === '01' &&
        status.headTd.toString('hex') === '64' &&
        status.headHash === '0xaa' &&
        status.headNum.toString('hex') === '64' &&
        status.genesisHash === '0xbb' &&
        status.serveHeaders === 1 &&
        status.serveChainSince === 0 &&
        status.serveStateSince === 0 &&
        status.txRelay === 1 &&
        status['flowControl/BL'].toString('hex') === '03e8' &&
        status['flowControl/MRR'].toString('hex') === '0a' &&
        status['flowControl/MRC'][0].toString() === '2,10,10',
      'encode status'
    )
    status = { ...status, networkId: [0x01] }
    status = p.decodeStatus(status)
    t.ok(
      status.networkId.toNumber() === 1 &&
        status.headTd.toString('hex') === '64' &&
        status.headHash === '0xaa' &&
        status.headNum.toNumber() === 100 &&
        status.genesisHash === '0xbb' &&
        status.serveHeaders === true &&
        status.serveChainSince === 0 &&
        status.serveStateSince === 0 &&
        status.txRelay === true &&
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
