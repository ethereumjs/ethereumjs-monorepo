import { RLP } from '@ethereumjs/rlp'
import {
  bigIntToUnpaddedBytes,
  bytesToBigInt,
  hexToBytes,
  intToUnpaddedBytes,
} from '@ethereumjs/util'
import { secp256k1 } from '@noble/curves/secp256k1.js'
import { assert, describe, it } from 'vitest'

import {
  createThreadedNetwork,
  genPrivateKey,
  resolveThreadedNetworkModuleUrl,
} from '../../src/index.ts'
import { MAINNET_STATUS_JSON } from '../../src/lab/inProcessMesh.ts'
import { StatyMessageCodes } from '../../src/protocol/staty/codes.ts'
import { pk2id } from '../../src/util.ts'
import type { WorkerTelemetrySnapshot } from '../../src/worker/protocol.ts'

const workerModuleUrl = resolveThreadedNetworkModuleUrl(import.meta.url)

function nodeIdFromPrivateKey(privateKey: Uint8Array): Uint8Array {
  return pk2id(secp256k1.getPublicKey(privateKey, false))
}

function waitTelemetry(
  client: Awaited<ReturnType<typeof createThreadedNetwork>>,
  pred: (s: WorkerTelemetrySnapshot) => boolean,
  ms = 20000,
): Promise<WorkerTelemetrySnapshot> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('telemetry timeout')), ms)
    const onTelemetry = (snap: WorkerTelemetrySnapshot) => {
      if (!pred(snap)) return
      clearTimeout(timer)
      client.events.off('telemetry', onTelemetry)
      resolve(snap)
    }
    client.events.on('telemetry', onTelemetry)
  })
}

describe('[DevP2P/Worker]: STATY/0 swarm', () => {
  it('STATY_PEX: C discovers A via B', async () => {
    const keyA = genPrivateKey()
    const keyB = genPrivateKey()
    const keyC = genPrivateKey()
    const idA = nodeIdFromPrivateKey(keyA)
    const idB = nodeIdFromPrivateKey(keyB)
    const idHexA = Buffer.from(idA).toString('hex')
    const BASE = 33700
    const status = { ...MAINNET_STATUS_JSON, earliestBlock: '0x0', latestBlock: '0x0' }

    const nodeA = await createThreadedNetwork(
      {
        inProcess: true,
        privateKey: keyA,
        chain: 'mainnet',
        maxPeers: 8,
        capabilities: ['eth71', 'staty0'],
        endpoint: { address: '127.0.0.1', udpPort: BASE, tcpPort: BASE },
        listenPort: BASE,
        status,
        goodCitizen: true,
        shouldFindNeighbours: false,
        throttleDiscovery: false,
        minStatyPeers: 0,
      },
      workerModuleUrl,
    )
    nodeA.setStatyStatus({ latestEpoch: '10', epochMask: '255' })

    const nodeB = await createThreadedNetwork(
      {
        inProcess: true,
        privateKey: keyB,
        chain: 'mainnet',
        maxPeers: 8,
        capabilities: ['eth71', 'staty0'],
        endpoint: { address: '127.0.0.1', udpPort: BASE + 1, tcpPort: BASE + 1 },
        listenPort: BASE + 1,
        status,
        goodCitizen: true,
        shouldFindNeighbours: false,
        throttleDiscovery: false,
        minStatyPeers: 0,
      },
      workerModuleUrl,
    )
    nodeB.setStatyStatus({ latestEpoch: '5', epochMask: '255' })
    const partRoot = new Uint8Array(32).fill(0x03)
    nodeB.putStatyEpochPart({
      epochNumber: 1n,
      shardIndex: 0,
      partIndex: 0,
      anchorBlock: 7n,
      anchorStateRoot: partRoot,
      accounts: [],
      slots: [],
      proofNodes: [],
    })

    nodeA.connectPeer({ id: idB, address: '127.0.0.1', tcpPort: BASE + 1, udpPort: BASE + 1 })
    await waitTelemetry(nodeA, (s) => s.peers.some((p) => p.statySession === true))

    const idHexB = Buffer.from(idB).toString('hex')
    const partReq = RLP.encode([
      bigIntToUnpaddedBytes(1n),
      bigIntToUnpaddedBytes(1n),
      intToUnpaddedBytes(0),
      intToUnpaddedBytes(0),
    ])
    nodeA.sendStatyMessage(hexToBytes(`0x${idHexB}`), StatyMessageCodes.GET_EPOCH_PART, partReq)
    await waitTelemetry(nodeB, (s) => (s.serving.statyPartsServed ?? 0) >= 1, 15_000)

    const nodeC = await createThreadedNetwork(
      {
        inProcess: true,
        privateKey: keyC,
        chain: 'mainnet',
        maxPeers: 8,
        capabilities: ['eth71', 'staty0'],
        endpoint: { address: '127.0.0.1', udpPort: BASE + 2, tcpPort: BASE + 2 },
        listenPort: BASE + 2,
        status,
        goodCitizen: true,
        shouldFindNeighbours: false,
        throttleDiscovery: false,
        minStatyPeers: 0,
      },
      workerModuleUrl,
    )
    nodeC.connectPeer({ id: idB, address: '127.0.0.1', tcpPort: BASE + 1, udpPort: BASE + 1 })

    await waitTelemetry(nodeC, (s) =>
      s.peers.some((p) => p.id === idHexB && p.statySession === true),
    )

    const pexReq = RLP.encode([bigIntToUnpaddedBytes(1n), intToUnpaddedBytes(16)])
    nodeC.sendStatyMessage(hexToBytes(`0x${idHexB}`), StatyMessageCodes.GET_STATY_PEERS, pexReq)

    await waitTelemetry(
      nodeC,
      (s) => s.peers.length >= 2 && s.peers.some((p) => p.id === idHexA),
      45_000,
    )

    nodeC.stop()
    nodeB.stop()
    nodeA.stop()
  }, 90_000)

  it('does not mount STATY when remote advertises only eth71', async () => {
    const keyA = genPrivateKey()
    const keyB = genPrivateKey()
    const idB = nodeIdFromPrivateKey(keyB)
    const BASE = 33800
    const status = { ...MAINNET_STATUS_JSON, earliestBlock: '0x0', latestBlock: '0x0' }

    const server = await createThreadedNetwork(
      {
        inProcess: true,
        privateKey: keyB,
        chain: 'mainnet',
        maxPeers: 2,
        capabilities: ['eth71'],
        endpoint: { address: '127.0.0.1', udpPort: BASE + 1, tcpPort: BASE + 1 },
        listenPort: BASE + 1,
        status,
        goodCitizen: true,
        shouldFindNeighbours: false,
        throttleDiscovery: false,
      },
      workerModuleUrl,
    )

    const client = await createThreadedNetwork(
      {
        inProcess: true,
        privateKey: keyA,
        chain: 'mainnet',
        maxPeers: 2,
        capabilities: ['eth71', 'staty0'],
        endpoint: { address: '127.0.0.1', udpPort: BASE, tcpPort: BASE },
        listenPort: BASE,
        status,
        goodCitizen: true,
        shouldFindNeighbours: false,
        throttleDiscovery: false,
      },
      workerModuleUrl,
    )
    client.connectPeer({ id: idB, address: '127.0.0.1', tcpPort: BASE + 1, udpPort: BASE + 1 })

    const snap = await waitTelemetry(client, (s) => s.peers.length >= 1)
    const peer = snap.peers[0]
    assert.equal(peer?.statySession, false)
    assert.equal(peer?.statyStatus, undefined)

    client.stop()
    server.stop()
  })
})
