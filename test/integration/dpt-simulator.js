const test = require('tape')
const util = require('./util.js')

async function delay (ms) {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

function destroy (dpts) {
  for (let dpt of dpts) dpt.destroy()
}

test('DPT: add working node', async (t) => {
  const dpts = util.getTestDPTs(2)
  const peer = { address: util.localhost, udpPort: util.basePort + 1 }
  dpts[0].addPeer(peer)

  dpts[0].on('peer:new', function (peer) {
    t.equal(peer.address, '127.0.0.1', 'should have added peer on peer:new')
    destroy(dpts)
    t.end()
  })
})

test('DPT: add non-available node', async (t) => {
  const dpts = util.getTestDPTs(1)
  const peer = { address: util.localhost, udpPort: util.basePort + 1 }

  await dpts[0].addPeer(peer).catch((e) => {
    t.equal(e.message, 'Timeout error: ping 127.0.0.1:30307', 'should throw Timeout error')
    destroy(dpts)
    t.end()
  })
})

test('DPT: simulate bootstrap', async (t) => {
  const numDPTs = 6
  const dpts = util.getTestDPTs(numDPTs)

  await delay(250)
  await dpts[0].addPeer({ address: util.localhost, udpPort: util.basePort + 1 })
  await delay(100)

  for (let dpt of dpts.slice(2)) {
    await dpt.bootstrap({ address: util.localhost, udpPort: util.basePort + 1 })
  }

  for (let dpt of dpts) {
    dpt.refresh()
    await delay(400)
  }

  await delay(250)
  destroy(dpts)

  // dpts.forEach((dpt, i) => console.log(`${i}:${dpt.getPeers().length}`))
  for (let dpt of dpts) t.equal(dpt.getPeers().length, numDPTs, 'Peers should be distributed to all DPTs')

  t.end()
})
