/* eslint-disable */
// TODO: re-enable linting. Disabled because much of test is commented out
// resulting in unused variable false positives
import tape from 'tape-catch'
import { BN } from 'ethereumjs-util'
import { Chain } from '../../../lib/blockchain'
import { Config } from '../../../lib/config'
const { LesProtocol } = require('../../../lib/net/protocol')

tape('[LesProtocol]', (t) => {
  t.test('should get properties', (t) => {
    const p = new LesProtocol({ config: new Config() })
    t.ok(typeof p.name === 'string', 'get name')
    t.ok(Array.isArray(p.versions), 'get versions')
    t.ok(Array.isArray(p.messages), 'get messages')
    t.end()
  })

  // Test deactivated along TypeScript transition due to
  // deadlock in Blockchain library along initLock.await()
  // calls on versions still using the flow-stoplight dependency
  //
  // This was fixed along refactoring work in
  // https://github.com/ethereumjs/ethereumjs-vm/pull/833
  // and test should be reactivated once PR makes it into
  // a next blockchain release
  //
  // 2020-10-02
  /*t.test('should open correctly', async (t) => {
    const chain = new Chain({ config: new Config() })
    const p = new LesProtocol({ config: new Config(), chain })
    await p.open()
    t.ok(p.opened, 'opened is true')
    t.notOk(await p.open(), 'repeat open')
    t.end()
  })*/

  // Test deactivated along TypeScript transition due to
  // chain properties networkId, headers, genesis not accessible
  // any more along ES6 transition
  // TODO: Fix e.g. with appropriate chain mocking solution
  // 2020-10-02
  /*t.test('should encode/decode status', t => {
    const chain = new Chain({ config: new Config() })
    const flow = {
      bl: 1000,
      mrr: 10,
      mrc: { GetBlockHeaders: { base: 10, req: 10 } }
    }
    const p = new LesProtocol({ config: new Config(), chain, flow })
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
  })*/
})
