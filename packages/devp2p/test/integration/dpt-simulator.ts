import * as test from 'tape'
import * as util from './util'
import * as testdata from '../testdata.json'

test('DPT: new working node', (t) => {
  const dpts = util.initTwoPeerDPTSetup()

  dpts[0].on('peer:new', async (peer: any) => {
    t.equal(peer.address, '127.0.0.1', 'should have added peer on peer:new')
    await util.delay(500)
    util.destroyDPTs(dpts)
    t.end()
  })
})

test('DPT: working node added', (t) => {
  const dpts = util.initTwoPeerDPTSetup()

  dpts[0].on('peer:added', async () => {
    t.equal(dpts[0].getPeers().length, 1, 'should have added peer to k-bucket on peer:added')
    await util.delay(500)
    util.destroyDPTs(dpts)
    t.end()
  })
})

test('DPT: remove node', (t) => {
  const dpts = util.initTwoPeerDPTSetup()

  try {
    dpts[0].on('peer:added', async (peer) => {
      await util.delay(400)
      dpts[0].removePeer(peer)
    })
    dpts[0].on('peer:removed', async () => {
      t.equal(
        dpts[0].getPeers().length,
        0,
        'should have removed peer from k-bucket on peer:removed'
      )
      await util.delay(500)
      util.destroyDPTs(dpts)
      t.end()
    })
  } catch (err) {
    t.fail(`An unexpected error occurred: ${err}`)
  }
})

test('DPT: ban node', (t) => {
  const dpts = util.initTwoPeerDPTSetup()

  try {
    dpts[0].once('peer:added', async (peer) => {
      await util.delay(400)
      dpts[0].banPeer(peer)
    })
    dpts[0].once('peer:removed', async (peer) => {
      t.equal(dpts[0].banlist.has(peer), true, 'ban-list should contain peer')
      t.equal(
        dpts[0].getPeers().length,
        0,
        'should have removed peer from k-bucket on peer:removed'
      )
      await util.delay(500)
      util.destroyDPTs(dpts)
      t.end()
    })
  } catch (err) {
    t.fail(`An unexpected error occurred: ${err}`)
  }
})

test('DPT: k-bucket ping', (t) => {
  const dpts = util.initTwoPeerDPTSetup()

  try {
    dpts[0].once('peer:added', async (peer: any) => {
      dpts[0]._onKBucketPing([peer], peer)
      await util.delay(400)
      t.equal(dpts[0].getPeers().length, 1, 'should still have one peer in k-bucket')
      await util.delay(400)
      util.destroyDPTs(dpts)
      t.end()
    })
  } catch (err) {
    t.fail(`An unexpected error occurred: ${err}`)
  }
})

test('DPT: add non-available node', async (t) => {
  const dpts = util.getTestDPTs(1)
  const peer = { address: util.localhost, udpPort: util.basePort + 1 }

  await dpts[0].addPeer(peer).catch(async (e: Error) => {
    t.equal(e.message, 'Timeout error: ping 127.0.0.1:30307', 'should throw Timeout error')
    await util.delay(400)
    util.destroyDPTs(dpts)
  })
})

test('DPT: simulate bootstrap', async (t) => {
  const numDPTs = 6
  const dpts = util.getTestDPTs(numDPTs)

  await util.delay(250)
  await dpts[0].addPeer({ address: util.localhost, udpPort: util.basePort + 1 })
  await util.delay(100)

  for (const dpt of dpts.slice(2)) {
    await dpt.bootstrap({ address: util.localhost, udpPort: util.basePort + 1 })
  }

  for (const dpt of dpts) {
    for (let i = 0; i < 10; i++) {
      dpt.refresh()
    }
    await util.delay(400)
  }

  await util.delay(250)

  // dpts.forEach((dpt, i) => console.log(`${i}:${dpt.getPeers().length}`))
  for (const dpt of dpts) {
    t.equal(dpt.getPeers().length, numDPTs, 'Peers should be distributed to all DPTs')
  }
  await util.delay(1000)

  util.destroyDPTs(dpts)
})

test('DPT: simulate acquiring peers via DNS', async () => {
  const dpts = util.getTestDPTsWithDns(1)

  const mockDns = {
    resolve: () => {
      return [[testdata.dns.enr]]
    },
  }

  dpts[0].dns.__setNativeDNSModuleResolve(mockDns)
  dpts[0].refresh()
  await util.delay(400)

  util.destroyDPTs(dpts)
})
