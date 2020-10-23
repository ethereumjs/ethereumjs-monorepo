/* eslint-disable */
// TODO: re-enable linting. Disabled because much of test is commented out
// resulting in unused variable false positives
import tape from 'tape-catch'
import { BN } from 'ethereumjs-util'
import { Chain } from '../../../lib/blockchain/chain'
const { EthProtocol } = require('../../../lib/net/protocol')

tape('[EthProtocol]', (t) => {
  t.test('should get properties', (t) => {
    const p = new EthProtocol({})
    t.ok(typeof p.name === 'string', 'get name')
    t.ok(Array.isArray(p.versions), 'get versions')
    t.ok(Array.isArray(p.messages), 'get messages')
    t.end()
  })

  t.test('should open correctly', async (t) => {
    const chain = new Chain()
    const p = new EthProtocol({ chain })
    await p.open()
    t.ok(p.opened, 'opened is true')
    t.notOk(await p.open(), 'repeat open')
    t.end()
  })

  /*t.test('should encode/decode status', t => {
    const chain = new Chain()
    const p = new EthProtocol({ chain })
    chain.networkId = 1
    chain.blocks = { td: new BN(100), latest: { hash: () => '0xaa' } }
    chain.genesis = { hash: '0xbb' }
    t.deepEquals(p.encodeStatus(), {
      networkId: 1,
      td: Buffer.from('64', 'hex'),
      bestHash: '0xaa',
      genesisHash: '0xbb'
    }, 'encode status')
    const status = p.decodeStatus({
      networkId: [0x01],
      td: Buffer.from('64', 'hex'),
      bestHash: '0xaa',
      genesisHash: '0xbb'
    })
    t.ok(
      status.networkId === 1 &&
      status.td.toNumber() === 100 &&
      status.bestHash === '0xaa' &&
      status.genesisHash === '0xbb',
      'decode status'
    )
    t.end()
  })*/
})
