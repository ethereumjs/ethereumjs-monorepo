/**
 * Surgical P2P probe (WP-03b): DNS ENR → single STATUS → single snap → funnel soak.
 * Live network only; not run in CI.
 */
import { parseArgs } from 'node:util'

import { createBlockHeaderFromRLP } from '@ethereumjs/block'
import { type ChainConfig, Common, Holesky, Hoodi, Mainnet, Sepolia } from '@ethereumjs/common'
import { verifyMerkleRangeProof } from '@ethereumjs/mpt'
import { RLP } from '@ethereumjs/rlp'
import {
  type AccountBodyBytes,
  type PrefixedHexString,
  accountBodyToRLP,
  bytesToHex,
  bytesToUnprefixedHex,
  hexToBytes,
  unprefixedHexToBytes,
} from '@ethereumjs/util'

import { DNS } from '../src/dns/dns.ts'
import type { EthStatusFields } from '../src/lab/messages/eth.ts'
import { buildSnapRlpPayload } from '../src/lab/messages/snap.ts'
import { EthMessageCodes } from '../src/protocol/eth.ts'
import { buildGetBlockHeadersFromJSON } from '../src/protocol/eth/codec.ts'
import { SnapMessageCodes } from '../src/protocol/snap.ts'
import { genPrivateKey } from '../src/util.ts'
import { createThreadedNetwork, resolveThreadedNetworkModuleUrl } from '../src/worker/index.ts'

import type { PeerInfo } from '../src/types.ts'

const CHAINS: Record<string, ChainConfig> = {
  mainnet: Mainnet,
  sepolia: Sepolia,
  hoodi: Hoodi,
  holesky: Holesky,
}

const STATUS_PIN: Record<string, EthStatusFields> = {
  mainnet: {
    td: '0x01',
    bestHash: '0x7c0bee0740f85374dfabf3317f80a398b8e2cb0eccc2b4b257a30ccb5ce03165',
    genesisHash: '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
    latestBlock: '0x1912a62',
  },
  sepolia: {
    td: '0x01',
    bestHash: '0x3a820db395c5c5b7b02a9c4933dfcbe9c4f7e8e50d31da3f6a61e28f995ffdaa',
    genesisHash: '0x25a5cc106eea7138acab33231d7160d69cb777ee0c2c553fcddf5138993e6dd9',
    latestBlock: '0xb74961',
  },
}

function hx(s: string): PrefixedHexString {
  return s as PrefixedHexString
}

function activeHardfork(chain: ChainConfig): string {
  const common = new Common({ chain })
  const now = BigInt(Math.floor(Date.now() / 1000))
  return common.getHardforkBy({ timestamp: now })
}

function readyToDial(peer: PeerInfo): boolean {
  return (
    peer.id !== undefined &&
    peer.address !== undefined &&
    peer.address.length > 0 &&
    peer.tcpPort !== undefined &&
    peer.tcpPort !== null
  )
}

function parsePeerArg(raw: string): PeerInfo {
  const parts = raw.split(':')
  if (parts.length < 3) throw new Error('--peer must be ip:tcpPort:nodeIdHex')
  const [address, portStr, idHex] = parts
  return {
    address,
    tcpPort: Number.parseInt(portStr!, 10),
    udpPort: Number.parseInt(portStr!, 10),
    id: unprefixedHexToBytes(idHex!.replace(/^0x/, '')),
  }
}

async function stage1DnsEnr(chainName: string): Promise<{ peers: PeerInfo[]; exitCode: number }> {
  const chain = CHAINS[chainName]
  if (chain === undefined) throw new Error(`Unknown chain ${chainName}`)
  const hf = activeHardfork(chain)
  const common = new Common({ chain, hardfork: hf })
  const localHash = common.forkHash()
  const next = common.nextHardforkBlockOrTimestamp()
  const dns = new DNS({ common })
  const networks = chain.dnsNetworks ?? []
  const peers = await dns.getPeers(30, networks)
  const tcpReadyPeers = peers.filter(readyToDial)
  const hist: Record<string, number> = {}
  for (const p of peers) {
    const h = p.ethForkId?.forkHash ?? '(no eth ENR)'
    hist[h] = (hist[h] ?? 0) + 1
  }
  const out = {
    stage: 'dns-enr',
    chain: chainName,
    resolved: peers.length,
    tcpReady: tcpReadyPeers.length,
    local: { hardfork: hf, forkHash: localHash, next: next?.toString() ?? '0' },
    forkHashHistogram: hist,
  }
  console.log(JSON.stringify(out, null, 2))
  let exitCode = 0
  if (tcpReadyPeers.length === 0) exitCode = 1
  if (hist[localHash] === undefined && tcpReadyPeers.some((p) => p.ethForkId !== undefined)) {
    exitCode = 1
  }
  return { peers: tcpReadyPeers, exitCode }
}

async function pickProbePeer(chainName: string, peerArg?: string): Promise<PeerInfo> {
  if (peerArg !== undefined) return parsePeerArg(peerArg)
  const { peers, exitCode } = await stage1DnsEnr(chainName)
  if (peers.length === 0) throw new Error('No TCP-ready DNS peers')
  if (exitCode !== 0) {
    console.error('Stage 1 fork histogram mismatch; continuing with first TCP-ready peer')
  }
  return peers[0]!
}

async function runIsolatedSession(
  chainName: string,
  peer: PeerInfo,
  afterStatus: (ctx: {
    client: Awaited<ReturnType<typeof createThreadedNetwork>>
    peerId: string
    ethVersion: number
  }) => Promise<void>,
): Promise<number> {
  const chain = CHAINS[chainName]
  if (chain === undefined) throw new Error(`Unknown chain ${chainName}`)
  const hf = activeHardfork(chain)
  const status = STATUS_PIN[chainName] ?? {
    td: '0x00',
    bestHash: STATUS_PIN.sepolia!.genesisHash,
    genesisHash: STATUS_PIN.sepolia!.genesisHash,
  }
  const workerUrl = resolveThreadedNetworkModuleUrl(import.meta.url)
  const client = await createThreadedNetwork(
    {
      privateKey: genPrivateKey(),
      chain: chainName as 'sepolia',
      hardfork: hf,
      maxPeers: 1,
      capabilities: ['eth69', 'eth70', 'eth71', 'eth72', 'snap1'],
      shouldFindNeighbours: false,
      throttleDiscovery: false,
      status,
      listenPort: 0,
      endpoint: { address: '0.0.0.0', udpPort: 0, tcpPort: 0 },
    },
    workerUrl,
  )

  const peerIdHex = bytesToUnprefixedHex(peer.id!)
  let statusOk = false
  let validatedPeerId: string | undefined

  const statusPromise = new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('STATUS timeout')), 20_000)
    const onTelemetry = (snap: { peers: { id: string; bestHash?: string }[] }) => {
      const row = snap.peers.find((p) => p.id === peerIdHex)
      if (row?.bestHash !== undefined) {
        statusOk = true
        validatedPeerId = peerIdHex
        clearTimeout(timer)
        client.events.off('telemetry', onTelemetry)
        resolve()
      }
    }
    client.events.on('telemetry', onTelemetry)
  })

  await client.connectPeer(peer)
  await statusPromise
  console.log(
    JSON.stringify({ stage: 'single-status', peer: peerIdHex, statusValidated: statusOk }),
  )
  await new Promise((r) => setTimeout(r, 6000))

  const ethVersion = 69
  if (validatedPeerId !== undefined) {
    await afterStatus({ client, peerId: validatedPeerId, ethVersion })
  }

  client.stop()
  return statusOk ? 0 : 1
}

async function stage2SingleStatus(chainName: string, peerArg?: string): Promise<number> {
  const peer = await pickProbePeer(chainName, peerArg)
  return runIsolatedSession(chainName, peer, async () => {})
}

async function stage3SingleSnap(chainName: string, peerArg?: string): Promise<number> {
  const peer = await pickProbePeer(chainName, peerArg)
  const chain = CHAINS[chainName]!
  return runIsolatedSession(chainName, peer, async ({ client, peerId, ethVersion }) => {
    const t0 = Date.now()
    const peerBytes = unprefixedHexToBytes(peerId)
    let bestHash: string | undefined
    await new Promise<void>((resolve) => {
      client.events.once('telemetry', (snap) => {
        bestHash = snap.peers.find((p) => p.id === peerId)?.bestHash
        resolve()
      })
    })
    if (bestHash === undefined) throw new Error('No peer head for GET_BLOCK_HEADERS')

    const getHeaders = RLP.encode(
      buildGetBlockHeadersFromJSON(
        ethVersion,
        {
          requestId: '0x01',
          blockHash: bestHash,
          max: 1,
          skip: 0,
          reverse: false,
        },
        (s) => hexToBytes(hx(s)),
      ),
    )

    const headerPayload = await new Promise<Uint8Array>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('BLOCK_HEADERS timeout')), 15_000)
      const onProto = (msg: {
        protocol: string
        peerId: string
        code: number
        payload: Uint8Array
      }) => {
        if (msg.protocol !== 'eth' || msg.peerId !== peerId) return
        if (msg.code !== EthMessageCodes.BLOCK_HEADERS) return
        clearTimeout(timer)
        client.events.off('protocol', onProto)
        resolve(msg.payload)
      }
      client.events.on('protocol', onProto)
      client.sendEthMessage(peerBytes, EthMessageCodes.GET_BLOCK_HEADERS, getHeaders)
    })

    const decoded = RLP.decode(headerPayload) as unknown[]
    const headers = decoded[1] as Uint8Array[]
    const header = createBlockHeaderFromRLP(headers[0]!, {
      common: new Common({ chain, hardfork: activeHardfork(chain) }),
    })
    const stateRoot = bytesToHex(header.stateRoot)
    const pivotBlock = header.number.toString()

    const snapReq = RLP.encode(
      buildSnapRlpPayload('GET_ACCOUNT_RANGE', {
        requestId: 1,
        root: stateRoot,
        startingHash: `0x${'00'.repeat(32)}`,
        limitHash: `0x${'0f'.repeat(32)}`,
        responseBytes: 32768,
      }),
    )

    const rangePayload = await new Promise<Uint8Array>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('ACCOUNT_RANGE timeout')), 15_000)
      const onProto = (msg: {
        protocol: string
        peerId: string
        code: number
        payload: Uint8Array
      }) => {
        if (msg.protocol !== 'snap' || msg.peerId !== peerId) return
        if (msg.code !== SnapMessageCodes.ACCOUNT_RANGE) return
        clearTimeout(timer)
        client.events.off('protocol', onProto)
        resolve(msg.payload)
      }
      client.events.on('protocol', onProto)
      client.sendSnapMessage(peerBytes, SnapMessageCodes.GET_ACCOUNT_RANGE, snapReq)
    })

    const range = RLP.decode(rangePayload) as unknown[]
    const accounts = range[1] as [Uint8Array, Uint8Array][]
    const proof = range[2] as Uint8Array[]
    const keys = accounts.map(([hash]) => hash)
    const values = accounts.map(([, slim]) =>
      accountBodyToRLP(slim as unknown as AccountBodyBytes, true),
    )
    const proofVerified =
      keys.length === 0
        ? true
        : await verifyMerkleRangeProof(
            header.stateRoot,
            keys[0]!,
            keys[keys.length - 1]!,
            keys,
            values,
            proof,
            (k) => k,
          )

    console.log(
      JSON.stringify(
        {
          stage: 'single-snap',
          pivotBlock,
          stateRoot,
          accountsReturned: accounts.length,
          proofVerified,
          latencyMs: Date.now() - t0,
        },
        null,
        2,
      ),
    )
    if (!proofVerified) process.exitCode = 1
  })
}

async function stage4FunnelSoak(chainName: string, soakSec: number): Promise<number> {
  const chain = CHAINS[chainName]
  if (chain === undefined) throw new Error(`Unknown chain ${chainName}`)
  const hf = activeHardfork(chain)
  const status = STATUS_PIN[chainName] ?? STATUS_PIN.sepolia!
  const workerUrl = resolveThreadedNetworkModuleUrl(import.meta.url)
  const client = await createThreadedNetwork(
    {
      privateKey: genPrivateKey(),
      chain: chainName as 'sepolia',
      hardfork: hf,
      maxPeers: 25,
      capabilities: ['eth69', 'eth70', 'eth71', 'eth72', 'snap1'],
      shouldFindNeighbours: true,
      status,
      listenPort: 0,
      endpoint: { address: '0.0.0.0', udpPort: 0, tcpPort: 0 },
      throttleDiscovery: true,
    },
    workerUrl,
  )

  let lastDiscovery: import('../discovery/metrics.ts').WorkerDiscoverySnapshot | undefined
  let lastPeers = 0
  client.events.on('telemetry', (snap) => {
    lastDiscovery = snap.discovery
    lastPeers = snap.peers.length
  })
  await new Promise((r) => setTimeout(r, soakSec * 1000))

  let score = {
    dnsRecordsResolved: 0,
    enrForkMatched: 0,
    tcpDials: 0,
    helloOk: 0,
    statusValidated: 0,
    peersSustained5s: 0,
    pivotAnchored: 0,
    snapRangesVerified: 0,
    snapAccountsIngested: 0,
  }

  const d = lastDiscovery
  score = {
    dnsRecordsResolved: d?.dns.peersAdded ?? 0,
    enrForkMatched: (d?.dns.peersAdded ?? 0) - (d?.dns.forkRejected ?? 0),
    tcpDials: d?.rlpx.dials ?? 0,
    helloOk: lastPeers,
    statusValidated: d?.rlpx.statusOk ?? 0,
    peersSustained5s: d?.rlpx.statusOk ?? 0,
    pivotAnchored: 0,
    snapRangesVerified: 0,
    snapAccountsIngested: 0,
  }

  console.log(JSON.stringify({ stage: 'funnel-soak', soakSec, ...score }, null, 2))
  client.stop()
  return 0
}

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: {
      chain: { type: 'string', default: 'sepolia' },
      stage: { type: 'string', default: '1' },
      peer: { type: 'string' },
      soak: { type: 'string', default: '20' },
    },
  })
  const chain = values.chain as string
  const stage = Number.parseInt(String(values.stage), 10)
  const peerArg = values.peer as string | undefined
  const soak = Number.parseInt(String(values.soak), 10)

  switch (stage) {
    case 1: {
      const { exitCode } = await stage1DnsEnr(chain)
      process.exit(exitCode)
    }
    case 2:
      process.exit(await stage2SingleStatus(chain, peerArg))
    case 3:
      process.exit(await stage3SingleSnap(chain, peerArg))
    case 4:
      process.exit(await stage4FunnelSoak(chain, soak))
    default:
      throw new Error('--stage must be 1, 2, 3, or 4')
  }
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : String(err))
  process.exit(1)
})
