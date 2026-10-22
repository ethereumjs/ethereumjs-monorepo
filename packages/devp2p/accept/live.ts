/**
 * Manual live acceptance — not run in CI. Needs outbound UDP/TCP.
 *
 *   npm run accept:live -- eth68
 */
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { RLP } from '@ethereumjs/rlp'
import { bytesToHex, bytesToUnprefixedHex, equalsBytes, randomBytes } from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'

import { DPT, EthMessageCodes, RLPx } from '../src/index.ts'

import { eth68Playbook } from './playbooks/eth68.ts'
import { eth69Playbook } from './playbooks/eth69.ts'

import type { Common as CommonType } from '@ethereumjs/common'
import type { ETH as EthProtocol } from '../src/protocol/eth.ts'
import { Peer } from '../src/rlpx/peer.ts'
import type { PeerInfo } from '../src/types.ts'

const TOTAL_BUDGET_MS = 60_000
const PER_TRY_MS = 22_000
const CONNECT_TIMEOUT_MS = 15_000
const MAX_CANDIDATES = 16

const PLAYBOOKS: Record<string, typeof eth68Playbook> = {
  eth68: eth68Playbook,
  eth69: eth69Playbook,
}

type DialTarget = PeerInfo & { address: string; tcpPort: number; id: Uint8Array }

function isDialTarget(p: PeerInfo): p is DialTarget {
  return (
    p.id instanceof Uint8Array &&
    p.address !== undefined &&
    typeof p.tcpPort === 'number' &&
    p.tcpPort > 0
  )
}

/** Prefer bootnode-like TCP; skip common bad neighbour advertisements (e.g. tcp 9999, udp 30303). */
function dialScore(p: PeerInfo): number {
  const tcp = p.tcpPort ?? 0
  const udp = p.udpPort ?? 0
  if (tcp === 30303) return 100
  if (tcp === udp && tcp >= 30300 && tcp <= 30500) return 85
  if (tcp === udp) return 60
  if (tcp === 9999 || tcp === 30404 || tcp > 40000) return 0
  return 10
}

function targetKey(p: DialTarget): string {
  return `${p.address}:${p.tcpPort}:${bytesToUnprefixedHex(p.id)}`
}

async function discoverDialTargets(dpt: DPT, bootnodes: PeerInfo[]): Promise<DialTarget[]> {
  const seen = new Set<string>()
  const out: DialTarget[] = []
  const push = (p: PeerInfo) => {
    if (!isDialTarget(p)) return
    if (dialScore(p) === 0) return
    const key = targetKey(p)
    if (seen.has(key)) return
    seen.add(key)
    out.push(p)
  }

  for (const boot of bootnodes.slice(0, 4)) {
    try {
      push(await dpt.addPeer(boot))
    } catch {
      // try next bootnode
    }
  }

  const neighbours: PeerInfo[] = []
  for (const boot of bootnodes.slice(0, 3)) {
    try {
      neighbours.push(...(await dpt.lookupNeighbours(boot, 4000)))
    } catch {
      // try next bootnode
    }
  }

  for (const n of [...neighbours].sort((a, b) => dialScore(b) - dialScore(a))) {
    push(n)
    if (out.length >= MAX_CANDIDATES) break
  }

  return out.slice(0, MAX_CANDIDATES)
}

function cleanupFailedDial(rlpx: RLPx, target: DialTarget): void {
  const peerKey = bytesToUnprefixedHex(target.id)
  const entry = (rlpx as RLPx & { _peers: Map<string, Peer | import('net').Socket> })._peers.get(
    peerKey,
  )
  if (entry instanceof Peer) {
    rlpx.disconnect(target.id)
  } else if (entry && typeof entry.destroy === 'function') {
    entry.destroy()
  }
}

async function runExchange(
  rlpx: RLPx,
  target: DialTarget,
  playbook: typeof eth68Playbook,
  common: CommonType,
  deadlineMs: number,
): Promise<{ peer: Peer; eth: EthProtocol; headerHash: string }> {
  const requestPayload = playbook.headerGet()
  if (!Array.isArray(requestPayload)) throw new Error('Invalid header get payload')
  const requestId = requestPayload[0] as Uint8Array

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Acceptance timed out')), deadlineMs)

    const onPeer = (peer: Peer) => {
      const eth = peer.getProtocols().find((p) => p.constructor.name === 'ETH') as EthProtocol
      if (!eth) {
        clearTimeout(timer)
        rlpx.events.off('peer:added', onPeer)
        reject(new Error('No ETH protocol'))
        return
      }
      eth.events.once('status', () => {
        eth.sendMessage(EthMessageCodes.GET_BLOCK_HEADERS, requestPayload)
      })
      const onMessage = (code: number, payload: unknown) => {
        if (code !== EthMessageCodes.BLOCK_HEADERS) return
        const row = payload as unknown[]
        if (!equalsBytes(row[0] as Uint8Array, requestId)) {
          clearTimeout(timer)
          eth.events.off('message', onMessage)
          rlpx.events.off('peer:added', onPeer)
          reject(new Error('Request id mismatch'))
          return
        }
        const list = row[1] as unknown[]
        if (!Array.isArray(list) || list.length === 0) {
          clearTimeout(timer)
          eth.events.off('message', onMessage)
          rlpx.events.off('peer:added', onPeer)
          reject(new Error('Empty BLOCK_HEADERS'))
          return
        }
        const header = list[0] as Uint8Array[]
        const hash = bytesToHex(keccak_256(RLP.encode(header)))
        clearTimeout(timer)
        eth.events.off('message', onMessage)
        rlpx.events.off('peer:added', onPeer)
        resolve({ peer, eth, headerHash: hash })
      }
      eth.events.on('message', onMessage)
      eth.sendStatus(playbook.status(common))
    }

    rlpx.events.once('peer:added', onPeer)

    rlpx
      .connect({ id: target.id, address: target.address, tcpPort: target.tcpPort })
      .catch((err) => {
        clearTimeout(timer)
        rlpx.events.off('peer:added', onPeer)
        reject(err)
      })
  })
}

async function main() {
  const name = process.argv[2] ?? 'eth68'
  const playbook = PLAYBOOKS[name]
  if (!playbook) {
    console.error(`Unknown playbook: ${name}`)
    process.exit(1)
  }

  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Prague })
  const bootnodes = common.bootstrapNodes().map((n) => ({
    address: n.ip,
    udpPort: Number(n.port),
    tcpPort: Number(n.port),
  }))

  const privateKey = randomBytes(32)
  const dpt = new DPT(privateKey, {
    endpoint: { address: '0.0.0.0', udpPort: null, tcpPort: null },
    common,
  })
  dpt.bind(0, '0.0.0.0')

  const targets = await discoverDialTargets(dpt, bootnodes)
  if (targets.length === 0) {
    console.error('No dial targets (discovery and bootnodes failed). Check UDP to port 30303.')
    process.exit(1)
  }

  console.log(
    `Dial candidates (${targets.length}): ${targets.map((t) => `${t.address}:${t.tcpPort}`).join(', ')}`,
  )

  const started = Date.now()
  let lastErr: unknown
  for (const target of targets) {
    const remaining = TOTAL_BUDGET_MS - (Date.now() - started)
    if (remaining < 3000) break
    const tryMs = Math.min(PER_TRY_MS, remaining)
    console.log(`Trying ${target.address}:${target.tcpPort} …`)

    const rlpx = new RLPx(privateKey, {
      dpt: null,
      maxPeers: 1,
      capabilities: [playbook.capability],
      common,
      listenPort: null,
      timeout: CONNECT_TIMEOUT_MS,
    })

    try {
      const result = await runExchange(rlpx, target, playbook, common, tryMs)
      const hello = result.peer.getHelloMessage()
      const report = {
        ok: result.headerHash === playbook.expectedHeaderHash,
        playbook: name,
        peer: `${result.peer['_socket'].remoteAddress}:${result.peer['_socket'].remotePort}`,
        clientId: hello?.clientId,
        ethVersion: result.eth.getVersion(),
        headerHash: result.headerHash,
        expected: playbook.expectedHeaderHash,
      }
      console.log(JSON.stringify(report, null, 2))
      dpt.destroy()
      process.exit(report.ok ? 0 : 1)
    } catch (err) {
      lastErr = err
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`  failed: ${msg}`)
      cleanupFailedDial(rlpx, target)
      rlpx.disconnect(target.id)
    }
  }

  dpt.destroy()
  console.error(
    '\nAll dial targets failed. If the first error was "Connection timeout" to a high port (e.g. 9999),',
  )
  console.error(
    "UDP discovery worked but that peer's TCP port was unreachable — not necessarily your whole network.",
  )
  console.error('Check bootnode TCP: nc -zv 157.90.35.166 30303')
  if (lastErr instanceof Error) console.error(`Last error: ${lastErr.message}`)
  process.exit(1)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
