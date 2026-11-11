import { RLP } from '@ethereumjs/rlp'
import type { Input } from '@ethereumjs/rlp'
import { bigIntToUnpaddedBytes, hexToBytes, intToUnpaddedBytes } from '@ethereumjs/util'
import { secp256k1 } from '@noble/curves/secp256k1.js'
import { keccak_256 } from '@noble/hashes/sha3.js'
import { assert, describe, it } from 'vitest'

import {
  createThreadedNetwork,
  genPrivateKey,
  resolveThreadedNetworkModuleUrl,
} from '../../src/index.ts'
import { MAINNET_STATUS_JSON } from '../../src/lab/inProcessMesh.ts'
import { EthyMessageCodes } from '../../src/protocol/ethy/codes.ts'
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

describe('[DevP2P/Worker]: ETHY/0 swarm', () => {
  it('negotiates ethy/0, exposes localEnode and ethyStatus', async () => {
    const keyA = genPrivateKey()
    const keyB = genPrivateKey()
    const idB = nodeIdFromPrivateKey(keyB)
    const BASE = 33200
    const status = { ...MAINNET_STATUS_JSON, earliestBlock: '0x0', latestBlock: '0x0' }

    const server = await createThreadedNetwork(
      {
        inProcess: true,
        privateKey: keyB,
        chain: 'mainnet',
        maxPeers: 4,
        capabilities: ['eth71', 'ethy0'],
        endpoint: { address: '127.0.0.1', udpPort: BASE + 1, tcpPort: BASE + 1 },
        listenPort: BASE + 1,
        status,
        goodCitizen: true,
        shouldFindNeighbours: false,
        throttleDiscovery: false,
      },
      workerModuleUrl,
    )
    server.setEthyStatus({ bucketsBitmask: '0xff', basePivotBlock: '100' })

    const client = await createThreadedNetwork(
      {
        inProcess: true,
        privateKey: keyA,
        chain: 'mainnet',
        maxPeers: 4,
        capabilities: ['eth71', 'ethy0'],
        endpoint: { address: '127.0.0.1', udpPort: BASE, tcpPort: BASE },
        listenPort: BASE,
        status,
        goodCitizen: true,
        shouldFindNeighbours: false,
        throttleDiscovery: false,
      },
      workerModuleUrl,
    )
    client.setEthyStatus({ bucketsBitmask: '255' })
    client.connectPeer({ id: idB, address: '127.0.0.1', tcpPort: BASE + 1, udpPort: BASE + 1 })

    const snap = await waitTelemetry(client, (s) => {
      const p = s.peers.find((row) => row.ethySession === true && row.ethyStatus !== undefined)
      return p !== undefined && s.discovery?.localEnode?.startsWith('enode://') === true
    })
    assert.match(snap.discovery!.localEnode!, /^enode:\/\/[a-f0-9]+@127\.0\.0\.1:\d+/)
    const peer = snap.peers.find((p) => p.ethyStatus !== undefined)
    assert.equal(peer?.ethyStatus?.bucketsBitmask, '255')

    client.stop()
    server.stop()
  })

  it('serves BAL_RANGE from RollingBlockStore', async () => {
    const keyA = genPrivateKey()
    const keyB = genPrivateKey()
    const idB = nodeIdFromPrivateKey(keyB)
    const BASE = 33300
    const status = { ...MAINNET_STATUS_JSON, earliestBlock: '0x0', latestBlock: '0x10' }

    const server = await createThreadedNetwork(
      {
        inProcess: true,
        privateKey: keyB,
        chain: 'mainnet',
        maxPeers: 2,
        capabilities: ['eth71', 'ethy0'],
        endpoint: { address: '127.0.0.1', udpPort: BASE + 1, tcpPort: BASE + 1 },
        listenPort: BASE + 1,
        status,
        goodCitizen: true,
        shouldFindNeighbours: false,
        throttleDiscovery: false,
      },
      workerModuleUrl,
    )

    let parent = new Uint8Array(32)
    for (let i = 1; i <= 4; i++) {
      const hash = new Uint8Array(32)
      hash[31] = i
      const headerFields: unknown[] = [
        parent,
        new Uint8Array(32),
        new Uint8Array(20),
        new Uint8Array(32),
        new Uint8Array(32),
        new Uint8Array(32),
        new Uint8Array(32),
        bigIntToUnpaddedBytes(BigInt(i)),
        intToUnpaddedBytes(0),
        intToUnpaddedBytes(0),
        intToUnpaddedBytes(0),
        bigIntToUnpaddedBytes(BigInt(i * 1000)),
        new Uint8Array(32),
        new Uint8Array(32),
        new Uint8Array(32),
        new Uint8Array(32),
        new Uint8Array(32),
      ]
      const balEmpty = RLP.encode([])
      headerFields.push(keccak_256(balEmpty))
      const headerRlp = RLP.encode(headerFields as Input[])
      server.putServableBlock({
        number: BigInt(i),
        hash,
        headerRlp,
        bodyRlp: RLP.encode([[], []]),
        receiptsEth69Rlp: RLP.encode([]),
        balRlp: balEmpty,
      })
      parent = hash
    }

    const client = await createThreadedNetwork(
      {
        inProcess: true,
        privateKey: keyA,
        chain: 'mainnet',
        maxPeers: 2,
        capabilities: ['eth71', 'ethy0'],
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

    await waitTelemetry(client, (s) => s.peers.some((p) => p.ethySession === true))

    const peerId = await new Promise<string>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('no peer id')), 10000)
      client.events.on('telemetry', (s) => {
        const p = s.peers.find((row) => row.ethySession)
        if (p === undefined) return
        clearTimeout(timer)
        resolve(p.id)
      })
    })

    const req = RLP.encode([
      bigIntToUnpaddedBytes(1n),
      bigIntToUnpaddedBytes(1n),
      intToUnpaddedBytes(4),
    ])
    client.sendEthyMessage(hexToBytes(`0x${peerId}`), EthyMessageCodes.GET_BAL_RANGE, req)

    const reply = await new Promise<Uint8Array>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('no BAL_RANGE')), 10000)
      client.events.on('protocol', (msg) => {
        if (msg.protocol !== 'ethy' || msg.code !== EthyMessageCodes.BAL_RANGE) return
        clearTimeout(timer)
        resolve(msg.payload)
      })
    })
    const decoded = RLP.decode(reply) as unknown[]
    const blocks = decoded[1] as unknown[]
    assert.equal(blocks.length, 4)

    const served = await waitTelemetry(
      server,
      (s) => (s.serving.ethyBalBlocksServed ?? 0) >= 1,
      5000,
    )
    assert.isAtLeast(served.serving.ethyBalBlocksServed ?? 0, 1)

    client.stop()
    server.stop()
  })

  it('ETHY_PEX: C discovers A via B without manual dial to A', async () => {
    const keyA = genPrivateKey()
    const keyB = genPrivateKey()
    const keyC = genPrivateKey()
    const idA = nodeIdFromPrivateKey(keyA)
    const idB = nodeIdFromPrivateKey(keyB)
    const idHexA = Buffer.from(idA).toString('hex')
    const BASE = 33400
    const status = { ...MAINNET_STATUS_JSON, earliestBlock: '0x0', latestBlock: '0x0' }

    const nodeA = await createThreadedNetwork(
      {
        inProcess: true,
        privateKey: keyA,
        chain: 'mainnet',
        maxPeers: 8,
        capabilities: ['eth71', 'ethy0'],
        endpoint: { address: '127.0.0.1', udpPort: BASE, tcpPort: BASE },
        listenPort: BASE,
        status,
        goodCitizen: true,
        shouldFindNeighbours: false,
        throttleDiscovery: false,
      },
      workerModuleUrl,
    )

    const nodeB = await createThreadedNetwork(
      {
        inProcess: true,
        privateKey: keyB,
        chain: 'mainnet',
        maxPeers: 8,
        capabilities: ['eth71', 'ethy0'],
        endpoint: { address: '127.0.0.1', udpPort: BASE + 1, tcpPort: BASE + 1 },
        listenPort: BASE + 1,
        status,
        goodCitizen: true,
        shouldFindNeighbours: false,
        throttleDiscovery: false,
      },
      workerModuleUrl,
    )

    nodeA.connectPeer({ id: idB, address: '127.0.0.1', tcpPort: BASE + 1, udpPort: BASE + 1 })
    await waitTelemetry(nodeA, (s) => s.peers.some((p) => p.ethySession === true))

    const nodeC = await createThreadedNetwork(
      {
        inProcess: true,
        privateKey: keyC,
        chain: 'mainnet',
        maxPeers: 8,
        capabilities: ['eth71', 'ethy0'],
        endpoint: { address: '127.0.0.1', udpPort: BASE + 2, tcpPort: BASE + 2 },
        listenPort: BASE + 2,
        status,
        goodCitizen: true,
        shouldFindNeighbours: false,
        throttleDiscovery: false,
      },
      workerModuleUrl,
    )
    nodeC.connectPeer({ id: idB, address: '127.0.0.1', tcpPort: BASE + 1, udpPort: BASE + 1 })

    const idHexB = Buffer.from(idB).toString('hex')
    await waitTelemetry(nodeC, (s) =>
      s.peers.some((p) => p.id === idHexB && p.ethySession === true),
    )

    const pexReq = RLP.encode([bigIntToUnpaddedBytes(1n), bigIntToUnpaddedBytes(16n)])
    nodeC.sendEthyMessage(idB, EthyMessageCodes.GET_ETHY_PEERS, pexReq)

    await waitTelemetry(
      nodeC,
      (s) => s.peers.length >= 2 && s.peers.some((p) => p.id === idHexA),
      45_000,
    )

    nodeC.stop()
    nodeB.stop()
    nodeA.stop()
  }, 90_000)

  it('does not mount ETHY when remote advertises only eth71', async () => {
    const keyA = genPrivateKey()
    const keyB = genPrivateKey()
    const idB = nodeIdFromPrivateKey(keyB)
    const BASE = 33500
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
        capabilities: ['eth71', 'ethy0'],
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
    assert.equal(peer?.ethySession, false)
    assert.equal(peer?.ethyStatus, undefined)

    client.stop()
    server.stop()
  })
})
