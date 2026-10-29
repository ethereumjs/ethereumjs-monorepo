import { RLP } from '@ethereumjs/rlp'
import { intToUnpaddedBytes } from '@ethereumjs/util'
import { secp256k1 } from '@noble/curves/secp256k1.js'
import { assert, describe, it } from 'vitest'

import {
  type Devp2pWorkerClient,
  EthMessageCodes,
  createThreadedNetwork,
  genPrivateKey,
  resolveThreadedNetworkModuleUrl,
} from '../../src/index.ts'
import { MAINNET_STATUS_JSON } from '../../src/lab/inProcessMesh.ts'
import { encodeGetBlockHeaders } from '../../src/protocol/eth/codec.ts'
import { pk2id } from '../../src/util.ts'
import type { WorkerTelemetrySnapshot } from '../../src/worker/protocol.ts'

const workerModuleUrl = resolveThreadedNetworkModuleUrl(import.meta.url)

function nodeIdFromPrivateKey(privateKey: Uint8Array): Uint8Array {
  return pk2id(secp256k1.getPublicKey(privateKey, false))
}

function putDemoBlocks(client: Devp2pWorkerClient, start: bigint, count: number) {
  let parent = new Uint8Array(32)
  for (let i = 0; i < count; i++) {
    const n = start + BigInt(i)
    const hash = new Uint8Array(32)
    hash[31] = Number(n)
    const headerRlp = RLP.encode([parent, new Uint8Array(32), new Uint8Array(20)])
    client.putServableBlock({
      number: n,
      hash,
      headerRlp,
      bodyRlp: RLP.encode([[], []]),
      receiptsEth69Rlp: RLP.encode([]),
    })
    parent = hash
  }
}

function waitPeers(client: Devp2pWorkerClient, min = 1): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout waiting for peers')), 15000)
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

describe('[DevP2P/Worker]: eth rolling-window serving', () => {
  it('serves GET_BLOCK_HEADERS and increments serving telemetry', async () => {
    const keyA = genPrivateKey()
    const keyB = genPrivateKey()
    const idB = nodeIdFromPrivateKey(keyB)
    const BASE = 32100
    const status = {
      ...MAINNET_STATUS_JSON,
      latestBlock: '0x64',
      earliestBlock: '0x64',
      bestHash: '0x' + '44'.repeat(32),
    }

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
    putDemoBlocks(server, 100n, 3)

    const client = await createThreadedNetwork(
      {
        inProcess: true,
        privateKey: keyA,
        chain: 'mainnet',
        maxPeers: 2,
        capabilities: ['eth71'],
        endpoint: { address: '127.0.0.1', udpPort: BASE, tcpPort: BASE },
        listenPort: BASE,
        status,
        goodCitizen: true,
        shouldFindNeighbours: false,
        throttleDiscovery: false,
      },
      workerModuleUrl,
    )

    client.connectPeer({
      id: idB,
      address: '127.0.0.1',
      udpPort: BASE + 1,
      tcpPort: BASE + 1,
    })

    await waitPeers(client, 1)
    await waitPeers(server, 1)

    const peerId = (await new Promise<string>((resolve) => {
      client.events.once('telemetry', (snap) => {
        if (snap.peers.length > 0) resolve(snap.peers[0]!.id)
      })
    })) as string

    const getPayload = RLP.encode(
      encodeGetBlockHeaders(
        71,
        {
          startBlock: intToUnpaddedBytes(100),
          limit: intToUnpaddedBytes(2),
          skip: intToUnpaddedBytes(0),
          reverse: intToUnpaddedBytes(0),
        },
        intToUnpaddedBytes(9),
      ),
    )

    const replyPromise = new Promise<Uint8Array>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('timeout BLOCK_HEADERS')), 10000)
      client.events.on('protocol', (msg) => {
        if (msg.protocol === 'eth' && msg.code === EthMessageCodes.BLOCK_HEADERS) {
          clearTimeout(timer)
          resolve(msg.payload)
        }
      })
    })

    const idBytes = Uint8Array.from(Buffer.from(peerId, 'hex'))
    client.sendEthMessage(idBytes, EthMessageCodes.GET_BLOCK_HEADERS, getPayload)
    const reply = await replyPromise
    const decoded = RLP.decode(reply) as unknown[]
    const headers = decoded[1] as unknown[]
    assert.isAtLeast(headers.length, 1)

    const served = await new Promise<number>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('timeout serving metrics')), 5000)
      server.events.on('telemetry', (snap) => {
        if (snap.serving.headersServed > 0) {
          clearTimeout(timer)
          resolve(snap.serving.headersServed)
        }
      })
    })
    assert.isAtLeast(served, 1)

    client.stop()
    server.stop()
  }, 30_000)
})
