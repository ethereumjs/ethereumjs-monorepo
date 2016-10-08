import * as devp2p from '../'
import EthereumTx from 'ethereumjs-tx'
import EthereumBlock from 'ethereumjs-block'
import LRUCache from 'lru-cache'
import ms from 'ms'
import chalk from 'chalk'
import assert from 'assert'
import { randomBytes } from 'crypto'
import * as rlp from 'rlp-encoding'

const PRIVATE_KEY = randomBytes(32)
const DAO_FORK_SUPPORT = true

const BOOTNODES = [
  // ETH/DEV Go Bootnodes
  { address: '52.16.188.185', udpPort: 30303, tcpPort: 30303 },
  { address: '54.94.239.50', udpPort: 30303, tcpPort: 30303 },
  { address: '52.74.57.123', udpPort: 30303, tcpPort: 30303 },

  // ETH/DEV Cpp Bootnodes
  { address: '5.1.83.226', udpPort: 30303, tcpPort: 30303 }
]

const ETH_1920000 = '4985f5ca3d2afbec36529aa96f74de3cc10a2a4a6c44f2157a57d2c6059a11bb'
const ETH_1920000_HEADER = rlp.decode(Buffer.from('f9020da0a218e2c611f21232d857e3c8cecdcdf1f65f25a4477f98f6f47e4063807f2308a01dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d4934794bcdfc35b86bedf72f0cda046a3c16829a2ef41d1a0c5e389416116e3696cce82ec4533cce33efccb24ce245ae9546a4b8f0d5e9a75a07701df8e07169452554d14aadd7bfa256d4a1d0355c1d174ab373e3e2d0a3743a026cf9d9422e9dd95aedc7914db690b92bab6902f5221d62694a2fa5d065f534bb90100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008638c3bf2616aa831d4c008347e7c08301482084578f7aa88d64616f2d686172642d666f726ba05b5acbf4bf305f948bd7be176047b20623e1417f75597341a059729165b9239788bede87201de42426', 'hex'))
const ETC_1920000 = '94365e3a8c0b35089c1d1195081fe7489b528a84b22199c916180db8b28ade7f'

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
    devp2p.ETH.eth63,
    devp2p.ETH.eth62
  ],
  listenPort: null
})

rlpx.on('error', (err) => console.error(chalk.red(`RLPx error: ${err.stack || err}`)))

rlpx.on('peer:added', (peer) => {
  const addr = getPeerAddr(peer)
  const eth = peer.getProtocols()[0]
  const requests = { headers: [], bodies: [] }

  const clientId = peer.getHelloMessage().clientId
  console.log(chalk.green(`Add peer: ${addr} ${clientId} (eth${eth.getVersion()}) (total: ${rlpx.getPeers().length})`))

  eth.sendStatus({
    networkId: 1,
    td: devp2p._util.int2buffer(17179869184), // total difficulty in genesis block
    bestHash: Buffer.from('d4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3', 'hex'),
    genesisHash: Buffer.from('d4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3', 'hex')
  })

  // check DAO
  let forkDrop = null
  let forkVerified = false
  eth.once('status', () => {
    if (DAO_FORK_SUPPORT === null) return
    eth.sendMessage(devp2p.ETH.MESSAGE_CODES.GET_BLOCK_HEADERS, [ 1920000, 1, 0, 0 ])
    forkDrop = setTimeout(() => {
      peer.disconnect(devp2p.RLPx.DISCONNECT_REASONS.USELESS_PEER)
    }, ms('15s'))
    peer.once('close', () => clearTimeout(forkDrop))
  })

  eth.on('message', async (code, payload) => {
    // console.log(`new message (${addr}) ${code} ${rlp.encode(payload).toString('hex')}`)
    switch (code) {
      case devp2p.ETH.MESSAGE_CODES.NEW_BLOCK_HASHES:
        if (DAO_FORK_SUPPORT !== null && !forkVerified) break

        for (let item of payload) {
          const blockHash = item[0]
          if (blocksCache.has(blockHash.toString('hex'))) continue
          setTimeout(() => {
            eth.sendMessage(devp2p.ETH.MESSAGE_CODES.GET_BLOCK_HEADERS, [ blockHash, 1, 0, 0 ])
            requests.headers.push(blockHash)
          }, ms('0.25s'))
        }
        break

      case devp2p.ETH.MESSAGE_CODES.TX:
        if (DAO_FORK_SUPPORT !== null && !forkVerified) break

        for (let item of payload) {
          const tx = new EthereumTx(item)
          if (isValidTx(tx)) onNewTx(tx, peer)
        }

        break

      case devp2p.ETH.MESSAGE_CODES.GET_BLOCK_HEADERS:
        const headers = []
        // hack
        if (DAO_FORK_SUPPORT && devp2p._util.buffer2int(payload[0]) === 1920000) {
          headers.push(ETH_1920000_HEADER)
        }

        eth.sendMessage(devp2p.ETH.MESSAGE_CODES.BLOCK_HEADERS, headers)
        break

      case devp2p.ETH.MESSAGE_CODES.BLOCK_HEADERS:
        if (DAO_FORK_SUPPORT !== null && !forkVerified) {
          if (payload.length !== 1) {
            console.log(`${addr} expected one header for DAO fork verify (received: ${payload.length})`)
            break
          }

          const expectedHash = DAO_FORK_SUPPORT ? ETH_1920000 : ETC_1920000
          const header = new EthereumBlock.Header(payload[0])
          if (header.hash().toString('hex') === expectedHash) {
            console.log(`${addr} verified to be on the same side of the DAO fork`)
            clearTimeout(forkDrop)
            forkVerified = true
          }
        } else {
          if (payload.length > 1) {
            console.log(`${addr} not more than one block header expected (received: ${payload.length})`)
            break
          }

          const blockHash = requests.headers.shift()
          const header = new EthereumBlock.Header(payload[0])
          if (header.hash().equals(blockHash)) {
            eth.sendMessage(devp2p.ETH.MESSAGE_CODES.GET_BLOCK_BODIES, [ blockHash ])
            requests.bodies.push(header)
          } else {
            console.log(`${addr} received wrong block header ${header.hash().toString('hex')} / ${blockHash.toString('hex')}`)
          }
        }

        break

      case devp2p.ETH.MESSAGE_CODES.GET_BLOCK_BODIES:
        eth.sendMessage(devp2p.ETH.MESSAGE_CODES.BLOCK_BODIES, [])
        break

      case devp2p.ETH.MESSAGE_CODES.BLOCK_BODIES:
        if (DAO_FORK_SUPPORT !== null && !forkVerified) break

        if (payload.length !== 1) {
          console.log(`${addr} not more than one block body expected (received: ${payload.length})`)
          break
        }

        const header = requests.bodies.shift()
        const block = new EthereumBlock([ header.raw, payload[0][0], payload[0][1] ])

        const isValid = await isValidBlock(block)
        if (isValid) {
          onNewBlock(block, peer)
        } else {
          console.log(`${addr} received wrong block body for ${header.hash().toString('hex')}`)
        }

        break

      case devp2p.ETH.MESSAGE_CODES.NEW_BLOCK:
        if (DAO_FORK_SUPPORT !== null && !forkVerified) break

        const newBlock = new EthereumBlock(payload[0])
        const isValidNewBlock = await isValidBlock(newBlock)
        if (isValidNewBlock) onNewBlock(newBlock, peer)

        break

      case devp2p.ETH.MESSAGE_CODES.GET_NODE_DATA:
        eth.sendMessage(devp2p.ETH.MESSAGE_CODES.NODE_DATA, [])
        break

      case devp2p.ETH.MESSAGE_CODES.NODE_DATA:
        break

      case devp2p.ETH.MESSAGE_CODES.GET_RECEIPTS:
        eth.sendMessage(devp2p.ETH.MESSAGE_CODES.RECEIPTS, [])
        break

      case devp2p.ETH.MESSAGE_CODES.RECEIPTS:
        break
    }
  })
})

rlpx.on('peer:removed', (peer, reason, disconnectWe) => {
  const who = disconnectWe ? 'we disconnect' : 'peer disconnect'
  const total = rlpx.getPeers().length
  console.log(chalk.yellow(`Remove peer: ${getPeerAddr(peer)} (${who}, reason code: ${String(reason)}) (total: ${total})`))
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
  .catch((err) => console.log(`error on connection to local node: ${err.stack || err}`))
*/

const txCache = new LRUCache({ max: 1000 })
function onNewTx (tx, peer) {
  const txHashHex = tx.hash().toString('hex')
  if (txCache.has(txHashHex)) return

  txCache.set(txHashHex, true)
  console.log(`new tx: ${txHashHex} (from ${getPeerAddr(peer)})`)
}

const blocksCache = new LRUCache({ max: 100 })
function onNewBlock (block, peer) {
  const blockHashHex = block.hash().toString('hex')
  if (blocksCache.has(blockHashHex)) return

  blocksCache.set(blockHashHex, true)
  console.log(`new block: ${blockHashHex} (from ${getPeerAddr(peer)})`)
  for (let tx of block.transactions) onNewTx(tx, peer)
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
