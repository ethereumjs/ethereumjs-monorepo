const devp2p = require('../src')
// const EthereumTx = require('ethereumjs-tx')
const EthereumBlock = require('ethereumjs-block')
// const LRUCache = require('lru-cache')
const ms = require('ms')
const chalk = require('chalk')
const assert = require('assert')
const { randomBytes } = require('crypto')
const Buffer = require('safe-buffer').Buffer

const PRIVATE_KEY = randomBytes(32)

const CHAIN_ID = 4 // Rinkeby
const GENESIS_TD = 1
const GENESIS_HASH = Buffer.from('6341fd3daf94b748c72ced5a5b26028f2474f5f00d824504e4fa37a75767e177', 'hex')

const BOOTNODES = require('ethereum-common').bootstrapNodes.filter((node) => {
  return node.chainId === CHAIN_ID
}).map((node) => {
  return {
    address: node.ip,
    udpPort: node.port,
    tcpPort: node.port
  }
})
const REMOTE_CLIENTID_FILTER = ['go1.5', 'go1.6', 'go1.7', 'Geth/v1.7', 'quorum', 'pirl', 'ubiq', 'gmc', 'gwhale', 'prichain']

const getPeerAddr = (peer) => `${peer._socket.remoteAddress}:${peer._socket.remotePort}`

// DPT
const dpt = new devp2p.DPT(PRIVATE_KEY, {
  refreshInterval: 30000,
  endpoint: {
    address: '0.0.0.0',
    udpPort: null,
    tcpPort: null
  }
})

dpt.on('error', (err) => console.error(chalk.red(`DPT error: ${err}`)))

// RLPx
const rlpx = new devp2p.RLPx(PRIVATE_KEY, {
  dpt: dpt,
  maxPeers: 25,
  capabilities: [
    devp2p.LES.les2
  ],
  remoteClientIdFilter: REMOTE_CLIENTID_FILTER,
  listenPort: null
})

rlpx.on('error', (err) => console.error(chalk.red(`RLPx error: ${err.stack || err}`)))

rlpx.on('peer:added', (peer) => {
  const addr = getPeerAddr(peer)
  const les = peer.getProtocols()[0]
  const requests = { headers: [], bodies: [] }

  const clientId = peer.getHelloMessage().clientId
  console.log(chalk.green(`Add peer: ${addr} ${clientId} (les${les.getVersion()}) (total: ${rlpx.getPeers().length})`))

  les.sendStatus({
    networkId: CHAIN_ID,
    headTd: devp2p._util.int2buffer(GENESIS_TD),
    headHash: GENESIS_HASH,
    headNum: Buffer.from([]),
    genesisHash: GENESIS_HASH
  })

  les.once('status', (status) => {
    let msg = [ devp2p._util.buffer2int(status['headNum']), 1, 0, 1 ]
    les.sendMessage(devp2p.LES.MESSAGE_CODES.GET_BLOCK_HEADERS, 1, msg)
  })

  les.on('message', async (code, payload) => {
    switch (code) {
      case devp2p.LES.MESSAGE_CODES.BLOCK_HEADERS:
        if (payload[2].length > 1) {
          console.log(`${addr} not more than one block header expected (received: ${payload[2].length})`)
          break
        }
        let header = new EthereumBlock.Header(payload[2][0])

        setTimeout(() => {
          les.sendMessage(devp2p.LES.MESSAGE_CODES.GET_BLOCK_BODIES, 2, [ header.hash() ])
          requests.bodies.push(header)
        }, ms('0.1s'))
        break

      case devp2p.LES.MESSAGE_CODES.BLOCK_BODIES:
        if (payload[2].length !== 1) {
          console.log(`${addr} not more than one block body expected (received: ${payload[2].length})`)
          break
        }

        let header2 = requests.bodies.shift()
        let block = new EthereumBlock([header2.raw, payload[2][0][0], payload[2][0][1]])
        let isValid = await isValidBlock(block)
        let isValidPayload = false
        if (isValid) {
          isValidPayload = true
          onNewBlock(block, peer)
          break
        }

        if (!isValidPayload) {
          console.log(`${addr} received wrong block body`)
        }
        break
    }
  })
})

rlpx.on('peer:removed', (peer, reasonCode, disconnectWe) => {
  const who = disconnectWe ? 'we disconnect' : 'peer disconnect'
  const total = rlpx.getPeers().length
  console.log(chalk.yellow(`Remove peer: ${getPeerAddr(peer)} - ${who}, reason: ${peer.getDisconnectPrefix(reasonCode)} (${String(reasonCode)}) (total: ${total})`))
})

rlpx.on('peer:error', (peer, err) => {
  if (err.code === 'ECONNRESET') return

  if (err instanceof assert.AssertionError) {
    const peerId = peer.getId()
    if (peerId !== null) dpt.banPeer(peerId, ms('5m'))

    console.error(chalk.red(`Peer error (${getPeerAddr(peer)}): ${err.message}`))
    return
  }

  console.error(chalk.red(`Peer error (${getPeerAddr(peer)}): ${err.stack || err}`))
})

// uncomment, if you want accept incoming connections
// rlpx.listen(30303, '0.0.0.0')
// dpt.bind(30303, '0.0.0.0')

for (let bootnode of BOOTNODES) {
  dpt.bootstrap(bootnode).catch((err) => {
    console.error(chalk.bold.red(`DPT bootstrap error: ${err.stack || err}`))
  })
}

// connect to local ethereum node (debug)
/*
dpt.addPeer({ address: '127.0.0.1', udpPort: 30303, tcpPort: 30303 })
  .then((peer) => {
    return rlpx.connect({
      id: peer.id,
      address: peer.address,
      port: peer.tcpPort
    })
  })
  .catch((err) => console.log(`error on connection to local node: ${err.stack || err}`)) */

function onNewBlock (block, peer) {
  const blockHashHex = block.hash().toString('hex')
  const blockNumber = devp2p._util.buffer2int(block.header.number)

  console.log(`----------------------------------------------------------------------------------------------------------`)
  console.log(`block ${blockNumber} received: ${blockHashHex} (from ${getPeerAddr(peer)})`)
  console.log(`----------------------------------------------------------------------------------------------------------`)
}

function isValidTx (tx) {
  return tx.validate(false)
}

async function isValidBlock (block) {
  if (!block.validateUnclesHash()) return false
  if (!block.transactions.every(isValidTx)) return false
  return new Promise((resolve, reject) => {
    block.genTxTrie(() => {
      try {
        resolve(block.validateTransactionsTrie())
      } catch (err) {
        reject(err)
      }
    })
  })
}

setInterval(() => {
  const peersCount = dpt.getPeers().length
  const openSlots = rlpx._getOpenSlots()
  const queueLength = rlpx._peersQueue.length
  const queueLength2 = rlpx._peersQueue.filter((o) => o.ts <= Date.now()).length

  console.log(chalk.yellow(`Total nodes in DPT: ${peersCount}, open slots: ${openSlots}, queue: ${queueLength} / ${queueLength2}`))
}, ms('30s'))
