/**
 * Local smoke test for createThreadedNetwork (real worker_threads Worker).
 *
 * From packages/devp2p:
 *   npm run threaded:smoke
 *
 * Spawns two threaded stacks (Worker + in-process MessageChannel), dials TCP,
 * prints telemetry, sends a SNAP GET_ACCOUNT_RANGE (Good Citizen on the callee),
 * then exits.
 */
import { RLP } from '@ethereumjs/rlp'
import { secp256k1 } from '@noble/curves/secp256k1.js'

import {
  createThreadedNetwork,
  genPrivateKey,
  resolveThreadedNetworkModuleUrl,
} from '../src/index.ts'
import { MAINNET_STATUS_JSON } from '../src/lab/inProcessMesh.ts'
import { SnapMessageCodes } from '../src/protocol/snap.ts'
import { pk2id } from '../src/util.ts'

function nodeIdFromPrivateKey(privateKey: Uint8Array): Uint8Array {
  return pk2id(secp256k1.getPublicKey(privateKey, false))
}

const BASE_PORT = 30800
const workerModuleUrl = resolveThreadedNetworkModuleUrl(import.meta.url)

const keyA = genPrivateKey()
const keyB = genPrivateKey()
const idB = nodeIdFromPrivateKey(keyB)

console.log('Spawning callee in worker_threads Worker…')
const callee = await createThreadedNetwork(
  {
    privateKey: keyB,
    chain: 'mainnet',
    maxPeers: 4,
    capabilities: ['eth68', 'snap1'],
    endpoint: { address: '127.0.0.1', udpPort: BASE_PORT + 1, tcpPort: BASE_PORT + 1 },
    listenPort: BASE_PORT + 1,
    status: MAINNET_STATUS_JSON,
    goodCitizen: true,
    shouldFindNeighbours: false,
    throttleDiscovery: false,
  },
  workerModuleUrl,
)

console.log('Spawning dialer in-process (MessageChannel host)…')
const dialer = await createThreadedNetwork({
  inProcess: true,
  privateKey: keyA,
  chain: 'mainnet',
  maxPeers: 4,
  capabilities: ['eth68', 'snap1'],
  endpoint: { address: '127.0.0.1', udpPort: BASE_PORT, tcpPort: BASE_PORT },
  listenPort: BASE_PORT,
  status: MAINNET_STATUS_JSON,
  goodCitizen: true,
  shouldFindNeighbours: false,
  throttleDiscovery: false,
})

dialer.events.on('error', (err) => console.error('dialer error:', err.message))
callee.events.on('error', (err) => console.error('callee error:', err.message))

const connected = new Promise<void>((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error('peer connect timeout')), 20000)
  dialer.events.on('telemetry', (snap) => {
    if (snap.peers.length >= 1) {
      clearTimeout(timer)
      resolve()
    }
  })
})

dialer.connectPeer({
  id: idB,
  address: '127.0.0.1',
  udpPort: BASE_PORT + 1,
  tcpPort: BASE_PORT + 1,
})

await connected
const snap = await new Promise<import('../src/worker/protocol.ts').WorkerTelemetrySnapshot>(
  (resolve) => dialer.events.once('telemetry', resolve),
)
console.log('RLPx connected — telemetry snapshot:')
console.log(JSON.stringify(snap, null, 2))

const gotReply = new Promise<void>((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error('ACCOUNT_RANGE timeout')), 10000)
  dialer.events.on('protocol', (msg) => {
    if (msg.protocol === 'snap' && msg.code === SnapMessageCodes.ACCOUNT_RANGE) {
      clearTimeout(timer)
      console.log(`Good Citizen reply on snap ACCOUNT_RANGE (${msg.payload.byteLength} bytes on wire)`)
      resolve()
    }
  })
})

const snapPayload = RLP.encode([1, [0, 1, 0, 0]] as never)
dialer.sendSnapMessage(idB, SnapMessageCodes.GET_ACCOUNT_RANGE, snapPayload)
await gotReply

console.log('OK — threaded network smoke finished')
dialer.stop()
callee.stop()
