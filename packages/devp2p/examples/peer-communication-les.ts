import * as devp2p from '../src/index'
import { LES, Peer } from '../src/index'
import Common from '@ethereumjs/common'
import { TypedTransaction } from '@ethereumjs/tx'
import { Block, BlockHeader } from '@ethereumjs/block'
import ms from 'ms'
import chalk from 'chalk'
import assert from 'assert'
import { randomBytes } from 'crypto'

const PRIVATE_KEY = randomBytes(32)

const GENESIS_TD = 1
const GENESIS_HASH = Buffer.from(
  '6341fd3daf94b748c72ced5a5b26028f2474f5f00d824504e4fa37a75767e177',
  'hex'
)

const common = new Common({ chain: 'rinkeby' })
const bootstrapNodes = common.bootstrapNodes()
const BOOTNODES = bootstrapNodes.map((node: any) => {
  return {
    address: node.ip,
    udpPort: node.port,
    tcpPort: node.port,
  }
})
const REMOTE_CLIENTID_FILTER = [
  'go1.5',
  'go1.6',
  'go1.7',
  'Geth/v1.7',
  'quorum',
  'pirl',
  'ubiq',
  'gmc',
  'gwhale',
  'prichain',
]

const getPeerAddr = (peer: Peer) => `${peer._socket.remoteAddress}:${peer._socket.remotePort}`

// DPT
const dpt = new devp2p.DPT(PRIVATE_KEY, {
  refreshInterval: 30000,
  endpoint: {
    address: '0.0.0.0',
    udpPort: null,
    tcpPort: null,
  },
})

/* eslint-disable no-console */
dpt.on('error', (err) => console.error(chalk.red(`DPT error: ${err}`)))

/* eslint-disable @typescript-eslint/no-use-before-define */

// RLPx
const rlpx = new devp2p.RLPx(PRIVATE_KEY, {
  dpt,
  maxPeers: 25,
  capabilities: [devp2p.LES.les2],
  common,
  remoteClientIdFilter: REMOTE_CLIENTID_FILTER,
})

rlpx.on('error', (err) => console.error(chalk.red(`RLPx error: ${err.stack || err}`)))

rlpx.on('peer:added', (peer) => {
  const addr = getPeerAddr(peer)
  const les = peer.getProtocols()[0]
  const requests: { headers: BlockHeader[]; bodies: any[] } = { headers: [], bodies: [] }

  const clientId = peer.getHelloMessage().clientId
  console.log(
    chalk.green(
      `Add peer: ${addr} ${clientId} (les${les.getVersion()}) (total: ${rlpx.getPeers().length})`
    )
  )

  les.sendStatus({
    headTd: devp2p.int2buffer(GENESIS_TD),
    headHash: GENESIS_HASH,
    headNum: Buffer.from([]),
    genesisHash: GENESIS_HASH,
  })

  les.once('status', (status: LES.Status) => {
    const msg = [devp2p.buffer2int(status['headNum']), 1, 0, 1]
    les.sendMessage(devp2p.LES.MESSAGE_CODES.GET_BLOCK_HEADERS, 1, msg)
  })

  les.on('message', async (code: LES.MESSAGE_CODES, payload: any) => {
    switch (code) {
      case devp2p.LES.MESSAGE_CODES.BLOCK_HEADERS: {
        if (payload[2].length > 1) {
          console.log(
            `${addr} not more than one block header expected (received: ${payload[2].length})`
          )
          break
        }
        const header = BlockHeader.fromValuesArray(payload[2][0], {})

        setTimeout(() => {
          les.sendMessage(devp2p.LES.MESSAGE_CODES.GET_BLOCK_BODIES, 2, [header.hash()])
          requests.bodies.push(header)
        }, ms('0.1s'))
        break
      }

      case devp2p.LES.MESSAGE_CODES.BLOCK_BODIES: {
        if (payload[2].length !== 1) {
          console.log(
            `${addr} not more than one block body expected (received: ${payload[2].length})`
          )
          break
        }

        const header2 = requests.bodies.shift()
        const txs = payload[2][0][0]
        const uncleHeaders = payload[2][0][1]
        const block = Block.fromValuesArray([header2.raw(), txs, uncleHeaders])
        const isValid = await isValidBlock(block)
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
    }
  })
})

rlpx.on('peer:removed', (peer, reasonCode, disconnectWe) => {
  const who = disconnectWe ? 'we disconnect' : 'peer disconnect'
  const total = rlpx.getPeers().length
  console.log(
    chalk.yellow(
      `Remove peer: ${getPeerAddr(peer)} - ${who}, reason: ${peer.getDisconnectPrefix(
        reasonCode
      )} (${String(reasonCode)}) (total: ${total})`
    )
  )
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

for (const bootnode of BOOTNODES) {
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

function onNewBlock(block: Block, peer: Peer) {
  const blockHashHex = block.hash().toString('hex')
  const blockNumber = block.header.number.toNumber()

  console.log(
    `----------------------------------------------------------------------------------------------------------`
  )
  console.log(`block ${blockNumber} received: ${blockHashHex} (from ${getPeerAddr(peer)})`)
  console.log(
    `----------------------------------------------------------------------------------------------------------`
  )
}

function isValidTx(tx: TypedTransaction) {
  return tx.validate()
}

async function isValidBlock(block: Block) {
  return (
    block.validateUnclesHash() &&
    block.transactions.every(isValidTx) &&
    block.validateTransactionsTrie()
  )
}

setInterval(() => {
  const peersCount = dpt.getPeers().length
  const openSlots = rlpx._getOpenSlots()
  const queueLength = rlpx._peersQueue.length
  const queueLength2 = rlpx._peersQueue.filter((o) => o.ts <= Date.now()).length

  console.log(
    chalk.yellow(
      `Total nodes in DPT: ${peersCount}, open slots: ${openSlots}, queue: ${queueLength} / ${queueLength2}`
    )
  )
}, ms('30s'))
