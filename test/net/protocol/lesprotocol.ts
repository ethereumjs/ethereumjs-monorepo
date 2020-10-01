// Suppresses "Cannot redeclare block-scoped variable" errors
// TODO: remove when import becomes possible
export = {}

import * as tape from 'tape-catch'
const td = require('testdouble')
const { LesProtocol } = require('../../../lib/net/protocol')
const BN = require('bn.js')

tape('[LesProtocol]', t => {
  const Chain = td.replace('../../../lib/blockchain/chain')

  t.test('should get properties', t => {
    const p = new LesProtocol({})
    t.ok(typeof p.name === 'string', 'get name')
    t.ok(Array.isArray(p.versions), 'get versions')
    t.ok(Array.isArray(p.messages), 'get messages')
    t.end()
  })

  t.test('should open correctly', async (t) => {
    const chain = new Chain()
    const p = new LesProtocol({ chain })
    await p.open()
    td.verify(chain.open())
    t.ok(p.opened, 'opened is true')
    t.notOk(await p.open(), 'repeat open')
    t.end()
  })

  t.test('should encode/decode status', t => {
    const chain = new Chain()
    const flow = {
      bl: 1000,
      mrr: 10,
      mrc: { GetBlockHeaders: { base: 10, req: 10 } }
    }
    const p = new LesProtocol({ chain, flow })
    chain.networkId = 1
    chain.headers = { td: new BN(100), latest: { hash: () => '0xaa', number: new BN(100) } }
    chain.genesis = { hash: '0xbb' }
    let status = p.encodeStatus()
    t.ok(
      status.networkId === 1 &&
      status.headTd.toString('hex') === '64' &&
      status.headHash === '0xaa' &&
      status.headNum.toNumber() === 100 &&
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
      status.networkId === 1 &&
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

  td.reset()
})
