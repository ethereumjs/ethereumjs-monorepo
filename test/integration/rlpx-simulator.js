const test = require('tape')
const util = require('./util.js')

function destroy (rlpxs) {
  for (let rlpx of rlpxs) {
    // FIXME: Call destroy() on dpt instance from the rlpx.destroy() method
    rlpx._dpt.destroy()
    rlpx.destroy()
  }
}

test('RLPX: add working node', async (t) => {
  const rlpxs = util.getTestRLPXs(2, [])

  const peer = { address: util.localhost, udpPort: util.basePort + 1, tcpPort: util.basePort + 1 }
  rlpxs[0]._dpt.addPeer(peer)

  rlpxs[0].on('peer:added', function (peer) {
    t.equal(peer._port, 30306, 'should have added peer on peer:added after successful handshake')
    destroy(rlpxs)
    t.end()
  })
})
