const devp2p = require('../../src')

const localhost = '127.0.0.1'
const basePort = 30306

exports.getTestDPTs = function(numDPTs) {
  const dpts = []

  for (let i = 0; i < numDPTs; ++i) {
    const dpt = new devp2p.DPT(devp2p._util.genPrivateKey(), {
      endpoint: {
        address: localhost,
        udpPort: basePort + i,
        tcpPort: basePort + i,
      },
      timeout: 100,
    })
    dpt.bind(basePort + i)
    dpts.push(dpt)
  }
  return dpts
}

exports.initTwoPeerDPTSetup = function() {
  const dpts = exports.getTestDPTs(2)
  const peer = { address: localhost, udpPort: basePort + 1 }
  dpts[0].addPeer(peer)
  return dpts
}

exports.destroyDPTs = function(dpts) {
  for (let dpt of dpts) dpt.destroy()
}

exports.getTestRLPXs = function(numRLPXs, maxPeers, capabilities) {
  const rlpxs = []
  if (!capabilities) {
    capabilities = [devp2p.ETH.eth63, devp2p.ETH.eth62]
  }
  const dpts = exports.getTestDPTs(numRLPXs)

  for (let i = 0; i < numRLPXs; ++i) {
    const rlpx = new devp2p.RLPx(dpts[i]._privateKey, {
      dpt: dpts[i],
      maxPeers: maxPeers,
      capabilities: capabilities,
      listenPort: basePort + i,
    })
    rlpx.listen(basePort + i)
    rlpxs.push(rlpx)
  }
  return rlpxs
}

exports.initTwoPeerRLPXSetup = function(maxPeers, capabilities) {
  const rlpxs = exports.getTestRLPXs(2, maxPeers, capabilities)
  const peer = { address: localhost, udpPort: basePort + 1, tcpPort: basePort + 1 }
  rlpxs[0]._dpt.addPeer(peer)
  return rlpxs
}

/**
 * @param {Test} t
 * @param {Array} capabilities Capabilities
 * @param {Object} opts
 * @param {Dictionary} opts.status0 Status values requested by protocol
 * @param {Dictionary} opts.status1 Status values requested by protocol
 * @param {Function} opts.onOnceStatus0 (rlpxs, protocol) Optional handler function
 * @param {Function} opts.onPeerError0 (err, rlpxs) Optional handler function
 * @param {Function} opts.onPeerError1 (err, rlpxs) Optional handler function
 * @param {Function} opts.onOnMsg0 (rlpxs, protocol, code, payload) Optional handler function
 * @param {Function} opts.onOnMsg1 (rlpxs, protocol, code, payload) Optional handler function
 */
exports.twoPeerMsgExchange = function(t, capabilities, opts) {
  const rlpxs = exports.initTwoPeerRLPXSetup(null, capabilities)
  rlpxs[0].on('peer:added', function(peer) {
    const protocol = peer.getProtocols()[0]
    protocol.sendStatus(opts.status0) // (1 ->)

    protocol.once('status', () => {
      if (opts.onOnceStatus0) opts.onOnceStatus0(rlpxs, protocol)
    }) // (-> 2)
    protocol.on('message', async (code, payload) => {
      if (opts.onOnMsg0) opts.onOnMsg0(rlpxs, protocol, code, payload)
    })
    peer.on('error', err => {
      if (opts.onPeerError0) {
        opts.onPeerError0(err, rlpxs)
      } else {
        console.log(`Unexpected peer 0 error: ${err}`)
      }
    }) // (-> 2)
  })

  rlpxs[1].on('peer:added', function(peer) {
    const protocol = peer.getProtocols()[0]
    protocol.on('message', async (code, payload) => {
      switch (code) {
        // Comfortability hack, use constants like devp2p.ETH.MESSAGE_CODES.STATUS
        // in production use
        case 0x00: // (-> 1)
          t.pass('should receive initial status message')
          protocol.sendStatus(opts.status1) // (2 ->)
          break
      }
      if (opts.onOnMsg1) opts.onOnMsg1(rlpxs, protocol, code, payload)
    })
    peer.on('error', err => {
      if (opts.onPeerError1) {
        opts.onPeerError1(err, rlpxs)
      } else {
        console.log(`Unexpected peer 1 error: ${err}`)
      }
    })
  })
}

exports.destroyRLPXs = function(rlpxs) {
  for (let rlpx of rlpxs) {
    // FIXME: Call destroy() on dpt instance from the rlpx.destroy() method
    rlpx._dpt.destroy()
    rlpx.destroy()
  }
}

exports.localhost = localhost
exports.basePort = basePort
