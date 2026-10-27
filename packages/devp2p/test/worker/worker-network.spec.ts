import { RLP } from '@ethereumjs/rlp'
import { secp256k1 } from '@noble/curves/secp256k1.js'
import { assert, describe, it } from 'vitest'

import {
  type Devp2pWorkerClient,
  createThreadedNetwork,
  genPrivateKey,
  resolveThreadedNetworkModuleUrl,
} from '../../src/index.ts'
import { MAINNET_STATUS_JSON } from '../../src/lab/inProcessMesh.ts'
import { SnapMessageCodes } from '../../src/protocol/snap.ts'
import { pk2id } from '../../src/util.ts'
import type { WorkerTelemetrySnapshot } from '../../src/worker/protocol.ts'

const workerModuleUrl = resolveThreadedNetworkModuleUrl(import.meta.url)

function nodeIdFromPrivateKey(privateKey: Uint8Array): Uint8Array {
  return pk2id(secp256k1.getPublicKey(privateKey, false))
}

function waitForConnectedPeers(client: Devp2pWorkerClient, min = 1): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout waiting for peer telemetry')), 15000)
    const onTelemetry = (snap: WorkerTelemetrySnapshot) => {
      if (snap.peers.length >= min) {
        clearTimeout(timer)
        client.events.off('telemetry', onTelemetry)
        resolve()
      }
    }
    client.events.on('telemetry', onTelemetry)
  })
}

function collectErrors(client: Devp2pWorkerClient): Error[] {
  const errors: Error[] = []
  client.events.on('error', (err) => errors.push(err))
  return errors
}

describe('[Devp2p/Worker]: createThreadedNetwork', () => {
  it('inProcess boot emits ready and telemetry snapshots', async () => {
    const client = await createThreadedNetwork({
      inProcess: true,
      privateKey: genPrivateKey(),
      chain: 'mainnet',
      maxPeers: 2,
      capabilities: ['eth68'],
      endpoint: { address: '127.0.0.1', udpPort: 30700, tcpPort: 30700 },
      listenPort: 30700,
      status: MAINNET_STATUS_JSON,
      shouldFindNeighbours: false,
      throttleDiscovery: false,
    })

    const snap = await new Promise<WorkerTelemetrySnapshot>((resolve) => {
      client.events.once('telemetry', resolve)
    })
    assert.ok(Array.isArray(snap.peers))
    client.stop()
  })

  it('inProcess nodes exchange SNAP GET_ACCOUNT_RANGE with goodCitizen disabled', async () => {
    const keyA = genPrivateKey()
    const keyB = genPrivateKey()
    const idB = nodeIdFromPrivateKey(keyB)
    const BASE_PORT = 30710

    const nodeA = await createThreadedNetwork({
      inProcess: true,
      privateKey: keyA,
      chain: 'mainnet',
      maxPeers: 2,
      capabilities: ['eth68', 'snap1'],
      endpoint: { address: '127.0.0.1', udpPort: BASE_PORT, tcpPort: BASE_PORT },
      listenPort: BASE_PORT,
      status: MAINNET_STATUS_JSON,
      goodCitizen: false,
      shouldFindNeighbours: false,
      throttleDiscovery: false,
    })

    const nodeB = await createThreadedNetwork({
      inProcess: true,
      privateKey: keyB,
      chain: 'mainnet',
      maxPeers: 2,
      capabilities: ['eth68', 'snap1'],
      endpoint: { address: '127.0.0.1', udpPort: BASE_PORT + 1, tcpPort: BASE_PORT + 1 },
      listenPort: BASE_PORT + 1,
      status: MAINNET_STATUS_JSON,
      goodCitizen: false,
      shouldFindNeighbours: false,
      throttleDiscovery: false,
    })

    const errorsA = collectErrors(nodeA)
    const errorsB = collectErrors(nodeB)

    try {
      const gotSnap = new Promise<{ payload: Uint8Array }>((resolve) => {
        nodeB.events.on('protocol', (msg) => {
          if (msg.protocol === 'snap' && msg.code === SnapMessageCodes.GET_ACCOUNT_RANGE) {
            resolve({ payload: msg.payload })
          }
        })
      })

      nodeA.connectPeer({
        id: idB,
        address: '127.0.0.1',
        udpPort: BASE_PORT + 1,
        tcpPort: BASE_PORT + 1,
      })

      await waitForConnectedPeers(nodeA, 1)
      await waitForConnectedPeers(nodeB, 1)

      const snapPayload = RLP.encode([1, [0, 1, 0, 0]] as never)
      nodeA.sendSnapMessage(idB, SnapMessageCodes.GET_ACCOUNT_RANGE, snapPayload)

      const received = await Promise.race([
        gotSnap,
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('timeout waiting for SNAP')), 8000),
        ),
      ])

      assert.strictEqual(received.payload.byteLength, snapPayload.byteLength)
      if (errorsA.length > 0 || errorsB.length > 0) {
        assert.fail(`worker errors: ${[...errorsA, ...errorsB].map((e) => e.message).join('; ')}`)
      }
    } finally {
      nodeA.stop()
      nodeB.stop()
    }
  }, 30000)

  it('goodCitizen answers GET_ACCOUNT_RANGE inside the worker without forwarding', async () => {
    const keyA = genPrivateKey()
    const keyB = genPrivateKey()
    const idB = nodeIdFromPrivateKey(keyB)
    const BASE_PORT = 30720

    const nodeA = await createThreadedNetwork({
      inProcess: true,
      privateKey: keyA,
      chain: 'mainnet',
      maxPeers: 2,
      capabilities: ['eth68', 'snap1'],
      endpoint: { address: '127.0.0.1', udpPort: BASE_PORT, tcpPort: BASE_PORT },
      listenPort: BASE_PORT,
      status: MAINNET_STATUS_JSON,
      goodCitizen: true,
      shouldFindNeighbours: false,
      throttleDiscovery: false,
    })

    const nodeB = await createThreadedNetwork({
      inProcess: true,
      privateKey: keyB,
      chain: 'mainnet',
      maxPeers: 2,
      capabilities: ['eth68', 'snap1'],
      endpoint: { address: '127.0.0.1', udpPort: BASE_PORT + 1, tcpPort: BASE_PORT + 1 },
      listenPort: BASE_PORT + 1,
      status: MAINNET_STATUS_JSON,
      goodCitizen: true,
      shouldFindNeighbours: false,
      throttleDiscovery: false,
    })

    try {
      let forwarded = false
      nodeB.events.on('protocol', (msg) => {
        if (msg.protocol === 'snap' && msg.code === SnapMessageCodes.GET_ACCOUNT_RANGE) {
          forwarded = true
        }
      })

      const gotReply = new Promise<void>((resolve) => {
        nodeA.events.on('protocol', (msg) => {
          if (msg.protocol === 'snap' && msg.code === SnapMessageCodes.ACCOUNT_RANGE) {
            resolve()
          }
        })
      })

      nodeA.connectPeer({
        id: idB,
        address: '127.0.0.1',
        udpPort: BASE_PORT + 1,
        tcpPort: BASE_PORT + 1,
      })

      await waitForConnectedPeers(nodeA, 1)
      await waitForConnectedPeers(nodeB, 1)

      const snapPayload = RLP.encode([2, [0, 1, 0, 0]] as never)
      nodeA.sendSnapMessage(idB, SnapMessageCodes.GET_ACCOUNT_RANGE, snapPayload)

      await Promise.race([
        gotReply,
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('timeout waiting for ACCOUNT_RANGE')), 8000),
        ),
      ])

      assert.strictEqual(forwarded, false)
    } finally {
      nodeA.stop()
      nodeB.stop()
    }
  }, 30000)

  it('Worker thread host connects to inProcess peer and Good Citizen replies on SNAP', async () => {
    const keyA = genPrivateKey()
    const keyB = genPrivateKey()
    const idB = nodeIdFromPrivateKey(keyB)
    const BASE_PORT = 30750

    const nodeB = await createThreadedNetwork(
      {
        privateKey: keyB,
        chain: 'mainnet',
        maxPeers: 2,
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

    const nodeA = await createThreadedNetwork({
      inProcess: true,
      privateKey: keyA,
      chain: 'mainnet',
      maxPeers: 2,
      capabilities: ['eth68', 'snap1'],
      endpoint: { address: '127.0.0.1', udpPort: BASE_PORT, tcpPort: BASE_PORT },
      listenPort: BASE_PORT,
      status: MAINNET_STATUS_JSON,
      goodCitizen: true,
      shouldFindNeighbours: false,
      throttleDiscovery: false,
    })

    try {
      const gotReply = new Promise<void>((resolve) => {
        nodeA.events.on('protocol', (msg) => {
          if (msg.protocol === 'snap' && msg.code === SnapMessageCodes.ACCOUNT_RANGE) {
            resolve()
          }
        })
      })

      nodeA.connectPeer({
        id: idB,
        address: '127.0.0.1',
        udpPort: BASE_PORT + 1,
        tcpPort: BASE_PORT + 1,
      })

      await waitForConnectedPeers(nodeA, 1)
      await waitForConnectedPeers(nodeB, 1)

      const snapPayload = RLP.encode([3, [0, 1, 0, 0]] as never)
      nodeA.sendSnapMessage(idB, SnapMessageCodes.GET_ACCOUNT_RANGE, snapPayload)

      await Promise.race([
        gotReply,
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('timeout waiting for ACCOUNT_RANGE')), 15000),
        ),
      ])
    } finally {
      nodeA.stop()
      nodeB.stop()
    }
  }, 45000)
})
