const devp2p = require('../../src')

const localhost = '127.0.0.1'
const basePort = 30306

exports.getTestDPTs = function (numDPTs) {
  const dpts = []

  for (let i = 0; i < numDPTs; ++i) {
    const dpt = new devp2p.DPT(devp2p._util.genPrivateKey(), {
      endpoint: {
        address: localhost,
        udpPort: basePort + i,
        tcpPort: basePort + i
      },
      timeout: 100
    })
    dpt.bind(basePort + i)
    dpts.push(dpt)
  }
  return dpts
}

exports.initTwoPeerDPTSetup = function () {
  const dpts = exports.getTestDPTs(2)
  const peer = { address: localhost, udpPort: basePort + 1 }
  dpts[0].addPeer(peer)
  return dpts
}

exports.destroyDPTs = function (dpts) {
  for (let dpt of dpts) dpt.destroy()
}

exports.getTestRLPXs = function (numRLPXs, maxPeers, capabilities) {
  const rlpxs = []
  if (!capabilities) {
    capabilities = [
      devp2p.ETH.eth63,
      devp2p.ETH.eth62
    ]
  }
  const dpts = exports.getTestDPTs(numRLPXs)

  for (let i = 0; i < numRLPXs; ++i) {
    const rlpx = new devp2p.RLPx(dpts[i]._privateKey, {
      dpt: dpts[i],
      maxPeers: maxPeers,
      capabilities: capabilities,
      listenPort: basePort + i
    })
    rlpx.listen(basePort + i)
    rlpxs.push(rlpx)
  }
  return rlpxs
}

exports.initTwoPeerRLPXSetup = function (maxPeers, capabilities) {
  const rlpxs = exports.getTestRLPXs(2, maxPeers, capabilities)
  const peer = { address: localhost, udpPort: basePort + 1, tcpPort: basePort + 1 }
  rlpxs[0]._dpt.addPeer(peer)
  return rlpxs
}

exports.destroyRLPXs = function (rlpxs) {
  for (let rlpx of rlpxs) {
    // FIXME: Call destroy() on dpt instance from the rlpx.destroy() method
    rlpx._dpt.destroy()
    rlpx.destroy()
  }
}

exports.localhost = localhost
exports.basePort = basePort
