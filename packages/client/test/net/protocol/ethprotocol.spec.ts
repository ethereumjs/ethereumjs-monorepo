import tape from 'tape-catch'
import { BN } from 'ethereumjs-util'
import { Chain } from '../../../lib/blockchain/chain'
import { Config } from '../../../lib/config'
import { EthProtocol } from '../../../lib/net/protocol'

tape('[EthProtocol]', (t) => {
  t.test('should get properties', (t) => {
    const config = new Config({ transports: [], loglevel: 'error' })
    const chain = new Chain({ config })
    const p = new EthProtocol({ config, chain })
    t.ok(typeof p.name === 'string', 'get name')
    t.ok(Array.isArray(p.versions), 'get versions')
    t.ok(Array.isArray(p.messages), 'get messages')
    t.end()
  })

  t.test('should open correctly', async (t) => {
    const config = new Config({ transports: [], loglevel: 'error' })
    const chain = new Chain({ config })
    const p = new EthProtocol({ config, chain })
    await p.open()
    t.ok(p.opened, 'opened is true')
    t.notOk(await p.open(), 'repeat open')
    t.end()
  })

  t.test('should encode/decode status', (t) => {
    const config = new Config({ transports: [], loglevel: 'error' })
    const chain = new Chain({ config })
    const p = new EthProtocol({ config, chain })
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
    t.deepEquals(
      p.encodeStatus(),
      {
        networkId: Buffer.from('01', 'hex'),
        td: Buffer.from('64', 'hex'),
        bestHash: '0xaa',
        genesisHash: '0xbb',
      },
      'encode status'
    )
    const status = p.decodeStatus({
      networkId: [0x01],
      td: Buffer.from('64', 'hex'),
      bestHash: '0xaa',
      genesisHash: '0xbb',
    })
    t.ok(
      status.networkId.eqn(1) &&
        status.td.eqn(100) &&
        status.bestHash === '0xaa' &&
        status.genesisHash === '0xbb',
      'decode status'
    )
    t.end()
  })
})
