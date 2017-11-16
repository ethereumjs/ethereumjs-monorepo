const test = require('tape')
const devp2p = require('../../lib')

async function delay (ms) {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

test('running simulator', async (t) => {
  const localhost = '127.0.0.1'
  const port = 30306
  const numOfNode = 10
  const nodes = []

  for (let i = 0; i < numOfNode; ++i) {
    const dpt = new devp2p.DPT(devp2p._util.genPrivateKey(), {
      endpoint: {
        address: localhost,
        udpPort: port + i,
        tcpPort: null
      },
      timeout: 100
    })
    dpt.bind(port + i)
    nodes.push(dpt)
  }

  await nodes[0].addPeer({ address: localhost, udpPort: port + 1 })
  await delay(100)

  for (let node of nodes.slice(2)) {
    await node.bootstrap({ address: localhost, udpPort: port + 1 })
  }

  for (let node of nodes) {
    node.refresh()
    await delay(50)
  }

  await delay(250)
  for (let node of nodes) node.destroy()

  // nodes.forEach((node, i) => console.log(`${i}:${node.getPeers().length}`))
  for (let node of nodes) t.equal(node.getPeers().length, numOfNode)

  t.end()
})
