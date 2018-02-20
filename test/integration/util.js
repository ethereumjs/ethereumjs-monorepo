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

exports.getTestRLPXs = function (numRLPXs, capabilities) {
  const rlpxs = []
  const dpts = exports.getTestDPTs(numRLPXs)

  for (let i = 0; i < numRLPXs; ++i) {
    const rlpx = new devp2p.RLPx(dpts[i]._privateKey, {
      dpt: dpts[i],
      maxPeers: 25,
      capabilities: [
        devp2p.ETH.eth63,
        devp2p.ETH.eth62
      ],
      listenPort: basePort + i
    })
    rlpx.listen(basePort + i)
    rlpxs.push(rlpx)
  }
  return rlpxs
}

exports.localhost = localhost
exports.basePort = basePort
