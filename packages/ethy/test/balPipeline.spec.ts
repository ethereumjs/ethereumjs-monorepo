import { createBlockHeader } from '@ethereumjs/block'
import { Common, Hardfork, Sepolia } from '@ethereumjs/common'
import { RLP } from '@ethereumjs/rlp'
import { createFlatStateManager } from '@ethereumjs/statemanager'
import { intToUnpaddedBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { ethyKeccak256, initEthyKeccak } from '../src/crypto/keccak.ts'
import { EthMessageCodes } from '../src/net/pivotHeader.ts'
import { createSpine, setPhase } from '../src/spine/createSpine.ts'
import {
  BAL_BATCH_PEER_MAX_REST_MS,
  BAL_BATCH_PEER_REST_MS,
  noteBalCatchUpPeerSuccess,
  restBalCatchUpPeer,
} from '../src/sync/balBatch.ts'
import {
  MAX_READY_BAL_BATCHES,
  balPipelineActive,
  highestReadyBlock,
  maxConcurrentBalFlights,
  nextBalFlightStartBlock,
  nextOccupiedRangeStart,
  occupiedBalBlockRanges,
} from '../src/sync/balPipeline.ts'
import { BUNDLE_IN_FLIGHT_TIMEOUT_MS, BalChainStreamer } from '../src/sync/balSync.ts'

describe('[Ethy/BalPipeline]: WP-14 scheduler helpers', () => {
  it('maxConcurrentBalFlights() scales peers up to 6', () => {
    assert.equal(maxConcurrentBalFlights(0), 2)
    assert.equal(maxConcurrentBalFlights(1), 2)
    assert.equal(maxConcurrentBalFlights(2), 4)
    assert.equal(maxConcurrentBalFlights(10), 6)
  })

  it('nextBalFlightStartBlock() skips occupied ranges including committing batch', () => {
    const ranges = occupiedBalBlockRanges(
      [{ startBlock: 100n, count: 32 }],
      [{ startBlock: 200n, blockCount: 32 }],
      { startBlock: 132n, blockCount: 32 },
    )
    assert.equal(nextBalFlightStartBlock(100n, 500n, ranges), 164n)
    assert.equal(nextBalFlightStartBlock(132n, 500n, ranges), 164n)
    assert.equal(nextBalFlightStartBlock(200n, 500n, ranges), 232n)
  })

  it('balPipelineActive() is false in snap and within 64-block tail', () => {
    assert.isFalse(balPipelineActive('SNAP_SYNCING', 100n, 10_000n, 100n))
    assert.isFalse(balPipelineActive('BAL_CATCHUP', 9_950n, 10_000n, 50n))
    assert.isTrue(balPipelineActive('BAL_CATCHUP', 100n, 10_000n, 100n))
  })
})

type SyntheticBlock = {
  number: bigint
  hash: Uint8Array
  headerRaw: Uint8Array[]
  balRlp: Uint8Array
}

const SEPOLIA_AMSTERDAM_BASE = 12_200_000n
const SEPOLIA_AMSTERDAM_TS = 1_791_295_000n

function buildSyntheticChain(
  start: bigint,
  count: number,
  initialParentHash: Uint8Array,
): SyntheticBlock[] {
  const common = new Common({ chain: Sepolia, hardfork: Hardfork.Amsterdam })
  const emptyBalRlp = new Uint8Array([0xc0])
  const emptyBalHash = ethyKeccak256(emptyBalRlp)
  const out: SyntheticBlock[] = []
  let parentHash = initialParentHash
  for (let i = 0; i < count; i++) {
    const number = start + BigInt(i)
    const header = createBlockHeader(
      {
        number,
        parentHash,
        gasLimit: 30_000_000n,
        timestamp: SEPOLIA_AMSTERDAM_TS + (number - SEPOLIA_AMSTERDAM_BASE) * 12n,
        blockAccessListHash: emptyBalHash,
      },
      { common, skipConsensusFormatValidation: true },
    )
    const hash = header.hash()
    out.push({
      number,
      hash,
      headerRaw: header.raw(),
      balRlp: emptyBalRlp,
    })
    parentHash = hash
  }
  return out
}

function addEth72Peer(
  spine: ReturnType<typeof createSpine>,
  id: string,
  latestBlock: bigint,
  avgLatencyMs: number,
) {
  spine.peers.set(id, {
    id,
    clientName: 'Nethermind',
    caps: ['eth/72'],
    hasHead: true,
    latestBlock,
    snapRequestsSent: 0,
    snapResponsesOk: 0,
    snapTimeouts: 0,
    avgLatencyMs,
  })
}

async function flushMicrotasks(rounds = 8): Promise<void> {
  for (let i = 0; i < rounds; i++) {
    await Promise.resolve()
  }
}

describe('[Ethy/BalPipeline]: BalChainStreamer multi-peer pipeline integration', () => {
  it('spreads 6 flights across 3 peers, handles out-of-order replies with verifiedTipHash, and preserves pipeline when peerHead rises', async () => {
    await initEthyKeccak()
    const B = SEPOLIA_AMSTERDAM_BASE
    const HEAD = B + 400n
    const spine = createSpine('sepolia', 11155111n)
    setPhase(spine, 'BAL_CATCHUP')
    spine.pivotBlockNumber = B - 1n
    spine.lastVerifiedBlockNumber = B - 1n
    spine.bestPeerHead = HEAD
    spine.balCatchUp = { fromBlock: B, applied: 0, total: 401 }

    addEth72Peer(spine, 'peer-a', HEAD, 30)
    addEth72Peer(spine, 'peer-b', HEAD, 50)
    addEth72Peer(spine, 'peer-c', HEAD, 70)

    const genesisAnchor = new Uint8Array(32).fill(0x99)
    const chain = buildSyntheticChain(B, 224, genesisAnchor)
    const byNumber = new Map<bigint, SyntheticBlock>(chain.map((b) => [b.number, b]))

    type SentReq = { peerId: string; code: number; payload: Uint8Array }
    const sent: SentReq[] = []
    const persistedBatches: number[] = []
    const sm = createFlatStateManager()

    const streamer = new BalChainStreamer({
      spine,
      stateManager: sm,
      chain: Sepolia,
      hardfork: Hardfork.Amsterdam,
      getClient: () => {
        throw new Error('unexpected single-block client call in fast pipeline')
      },
      sendEthMessage: (peerId, code, payload) => {
        sent.push({ peerId, code, payload })
      },
      pickEthPeer: () => ({ id: 'peer-a', ethVersion: 72, latestBlock: Number(HEAD) }),
      putServableBlock: () => {},
      appendBalTailBatch: (entries) => {
        persistedBatches.push(entries.length)
      },
    })

    // Seed verifiedTipHash to block #(B-1)'s hash so head-of-line checks anchor while lookahead flights don't falsely fail
    const internal = streamer as unknown as { verifiedTipHash?: Uint8Array; tick(): void }
    internal.verifiedTipHash = genesisAnchor

    internal.tick()

    // Expect 6 concurrent header flights distributed 2 per peer across all 3 peers
    const headerReqs = sent.filter((r) => r.code === EthMessageCodes.GET_BLOCK_HEADERS)
    assert.equal(headerReqs.length, 6)
    const countsByPeer = new Map<string, number>()
    const reqByStart = new Map<bigint, { peerId: string; reqId: Uint8Array; count: number }>()
    for (const req of headerReqs) {
      countsByPeer.set(req.peerId, (countsByPeer.get(req.peerId) ?? 0) + 1)
      const [reqId, body] = RLP.decode(req.payload) as [Uint8Array, Uint8Array[]]
      const startBytes = body[0]!
      let start = 0n
      for (const b of startBytes) start = (start << 8n) | BigInt(b)
      let count = 0
      for (const b of body[1]!) count = (count << 8) | b
      reqByStart.set(start, { peerId: req.peerId, reqId, count })
    }
    assert.equal(countsByPeer.get('peer-a'), 2)
    assert.equal(countsByPeer.get('peer-b'), 2)
    assert.equal(countsByPeer.get('peer-c'), 2)
    assert.isTrue(reqByStart.has(B))
    assert.isTrue(reqByStart.has(B + 32n))

    const completeFlight = (start: bigint) => {
      const info = reqByStart.get(start)!
      const headers = Array.from({ length: info.count }, (_, i) => byNumber.get(start + BigInt(i))!)
      const beforeLen = sent.length
      const handledHdr = streamer.handleEthMessage({
        peerId: info.peerId,
        code: EthMessageCodes.BLOCK_HEADERS,
        payload: RLP.encode([info.reqId, headers.map((h) => h.headerRaw)] as never),
      })
      assert.isTrue(handledHdr)
      const balReq = sent
        .slice(beforeLen)
        .find((r) => r.code === EthMessageCodes.GET_BLOCK_ACCESS_LISTS)
      assert.isDefined(balReq)
      const [balReqId] = RLP.decode(balReq!.payload) as [Uint8Array, unknown]
      const handledBal = streamer.handleEthMessage({
        peerId: info.peerId,
        code: EthMessageCodes.BLOCK_ACCESS_LISTS,
        payload: RLP.encode([balReqId, headers.map(() => [])] as never),
      })
      assert.isTrue(handledBal)
    }

    // Advance bestPeerHead mid-pipeline (simulating a new live Sepolia block): must NOT wipe in-flight batches!
    spine.bestPeerHead = HEAD + 5n
    internal.tick()

    // Deliver batch #(B+32..B+63) OUT OF ORDER before #(B..B+31)!
    completeFlight(B + 32n)
    await flushMicrotasks()
    // #(B+32..B+63) must buffer cleanly without committing ahead of #(B..B+31)
    assert.equal(spine.lastVerifiedBlockNumber, B - 1n)

    // Now deliver #(B..B+31): BOTH batches must drain and commit in strict ascending order!
    completeFlight(B)
    await flushMicrotasks(20)
    assert.equal(spine.lastVerifiedBlockNumber, B + 63n)
    assert.deepEqual(persistedBatches, [32, 32])
  })

  it('catches cross-batch parentHash reorg at commit time and rests the bad lookahead peer', async () => {
    await initEthyKeccak()
    const B = SEPOLIA_AMSTERDAM_BASE
    const HEAD = B + 400n
    const spine = createSpine('sepolia', 11155111n)
    setPhase(spine, 'BAL_CATCHUP')
    spine.pivotBlockNumber = B - 1n
    spine.lastVerifiedBlockNumber = B - 1n
    spine.bestPeerHead = HEAD
    spine.balCatchUp = { fromBlock: B, applied: 0, total: 401 }

    addEth72Peer(spine, 'peer-good', HEAD, 20)
    addEth72Peer(spine, 'peer-reorg', HEAD, 40)

    const anchor = new Uint8Array(32).fill(0x55)
    const batch0Chain = buildSyntheticChain(B, 32, anchor)
    // Forked parent hash for #(B+32..B+63) (does NOT match batch0Chain[31].hash!)
    const forkedBatch1Chain = buildSyntheticChain(B + 32n, 32, new Uint8Array(32).fill(0xde))

    const sent: Array<{ peerId: string; code: number; payload: Uint8Array }> = []
    const streamer = new BalChainStreamer({
      spine,
      stateManager: createFlatStateManager(),
      chain: Sepolia,
      hardfork: Hardfork.Amsterdam,
      getClient: () => {
        throw new Error('unexpected single-block call')
      },
      sendEthMessage: (peerId, code, payload) => {
        sent.push({ peerId, code, payload })
      },
      pickEthPeer: () => ({ id: 'peer-good', ethVersion: 72, latestBlock: Number(HEAD) }),
      putServableBlock: () => {},
    })
    const internal = streamer as unknown as { verifiedTipHash?: Uint8Array; tick(): void }
    internal.verifiedTipHash = anchor

    internal.tick()

    const findReq = (targetStart: bigint) => {
      for (const req of sent) {
        if (req.code !== EthMessageCodes.GET_BLOCK_HEADERS) continue
        const [reqId, body] = RLP.decode(req.payload) as [Uint8Array, Uint8Array[]]
        let start = 0n
        for (const b of body[0]!) start = (start << 8n) | BigInt(b)
        if (start === targetStart) return { peerId: req.peerId, reqId }
      }
      return undefined
    }

    const req0 = findReq(B)!
    const req1 = findReq(B + 32n)!
    assert.isDefined(req0)
    assert.isDefined(req1)

    const deliver = (req: { peerId: string; reqId: Uint8Array }, blocks: SyntheticBlock[]) => {
      const before = sent.length
      streamer.handleEthMessage({
        peerId: req.peerId,
        code: EthMessageCodes.BLOCK_HEADERS,
        payload: RLP.encode([req.reqId, blocks.map((b) => b.headerRaw)] as never),
      })
      const balReq = sent
        .slice(before)
        .find((r) => r.code === EthMessageCodes.GET_BLOCK_ACCESS_LISTS)!
      const [balReqId] = RLP.decode(balReq.payload) as [Uint8Array, unknown]
      streamer.handleEthMessage({
        peerId: req.peerId,
        code: EthMessageCodes.BLOCK_ACCESS_LISTS,
        payload: RLP.encode([balReqId, blocks.map(() => [])] as never),
      })
    }

    deliver(req1, forkedBatch1Chain)
    deliver(req0, batch0Chain)
    await flushMicrotasks(20)

    // Batch 0 (#B..B+31) committed; forked batch 1 (#B+32..B+63) was REJECTED at commit time!
    assert.equal(spine.lastVerifiedBlockNumber, B + 31n)
    // Bad lookahead peer was rested and #(B+32) was re-dispatched cleanly
    const reDispatched = sent.filter((r) => {
      if (r.code !== EthMessageCodes.GET_BLOCK_HEADERS) return false
      const [, body] = RLP.decode(r.payload) as [Uint8Array, Uint8Array[]]
      let start = 0n
      for (const b of body[0]!) start = (start << 8n) | BigInt(b)
      return start === B + 32n
    })
    assert.isAtLeast(reDispatched.length, 2)
    assert.equal(intToUnpaddedBytes(1).length, 1)
  })

  it('does not deadlock when fast peer fills MAX_READY_BAL_BATCHES while head-of-line flight times out on a slow peer', async () => {
    await initEthyKeccak()
    const B = SEPOLIA_AMSTERDAM_BASE
    const HEAD = B + 500n
    const spine = createSpine('sepolia', 11155111n)
    setPhase(spine, 'BAL_CATCHUP')
    spine.pivotBlockNumber = B - 1n
    spine.lastVerifiedBlockNumber = B - 1n
    spine.bestPeerHead = HEAD
    spine.balCatchUp = { fromBlock: B, applied: 0, total: 501 }

    // peer-slow has lower RTT so it grabs Flight 0 (#B..B+31), then never answers GET_BLOCK_ACCESS_LISTS.
    addEth72Peer(spine, 'peer-slow', HEAD, 10)
    addEth72Peer(spine, 'peer-fast', HEAD, 40)

    const anchor = new Uint8Array(32).fill(0x77)
    const chain = buildSyntheticChain(B, 501, anchor)
    const byNumber = new Map(chain.map((b) => [b.number, b]))

    const sent: Array<{ peerId: string; code: number; payload: Uint8Array }> = []
    const diagnostics: string[] = []
    const streamer = new BalChainStreamer({
      spine,
      stateManager: createFlatStateManager(),
      chain: Sepolia,
      hardfork: Hardfork.Amsterdam,
      getClient: () => {
        throw new Error('unexpected single-block call')
      },
      sendEthMessage: (peerId, code, payload) => {
        sent.push({ peerId, code, payload })
      },
      pickEthPeer: () => ({ id: 'peer-fast', ethVersion: 72, latestBlock: Number(HEAD) }),
      putServableBlock: () => {},
      onDiagnostic: (_sev, message) => diagnostics.push(message),
    })
    const internal = streamer as unknown as {
      verifiedTipHash?: Uint8Array
      catchUp?: {
        pipeline?: {
          inFlight: Map<string, { startedAt: number; peerId: string; startBlock: bigint }>
          ready: Map<string, unknown>
        }
      }
      tick(): void
    }
    internal.verifiedTipHash = anchor

    let cursor = 0
    const completeFastPeerRequests = (): number => {
      let completed = 0
      while (cursor < sent.length) {
        const req = sent[cursor++]!
        if (req.peerId !== 'peer-fast' || req.code !== EthMessageCodes.GET_BLOCK_HEADERS) continue
        const [reqId, body] = RLP.decode(req.payload) as [Uint8Array, Uint8Array[]]
        let start = 0n
        for (const b of body[0]!) start = (start << 8n) | BigInt(b)
        let count = 0
        for (const b of body[1]!) count = (count << 8) | b
        const blocks = Array.from({ length: count }, (_, i) => byNumber.get(start + BigInt(i))!)
        const beforeBal = sent.length
        streamer.handleEthMessage({
          peerId: 'peer-fast',
          code: EthMessageCodes.BLOCK_HEADERS,
          payload: RLP.encode([reqId, blocks.map((b) => b.headerRaw)] as never),
        })
        const balReq = sent
          .slice(beforeBal)
          .find(
            (r) => r.peerId === 'peer-fast' && r.code === EthMessageCodes.GET_BLOCK_ACCESS_LISTS,
          )
        if (balReq === undefined) break
        const [balReqId] = RLP.decode(balReq.payload) as [Uint8Array, unknown]
        streamer.handleEthMessage({
          peerId: 'peer-fast',
          code: EthMessageCodes.BLOCK_ACCESS_LISTS,
          payload: RLP.encode([balReqId, blocks.map(() => [])] as never),
        })
        completed++
      }
      return completed
    }

    // Initial tick dispatches Flight 0 (#B) to peer-slow and lookahead flights to peer-fast.
    internal.tick()
    // Keep fulfilling peer-fast lookahead flights until ready hits MAX_READY_BAL_BATCHES (8)!
    for (let round = 0; round < 10; round++) {
      if (completeFastPeerRequests() === 0) break
      await flushMicrotasks(8)
    }
    const pipe = internal.catchUp?.pipeline
    assert.isDefined(pipe)
    assert.equal(pipe!.ready.size, MAX_READY_BAL_BATCHES)
    assert.equal(spine.lastVerifiedBlockNumber, B - 1n)

    // Now advance wall-clock past timeout on peer-slow's in-flight batches (exact live stall condition!).
    const holFlight = pipe!.inFlight.get(B.toString())
    assert.isDefined(holFlight)
    assert.equal(holFlight!.peerId, 'peer-slow')
    for (const flight of pipe!.inFlight.values()) {
      if (flight.peerId === 'peer-slow') {
        flight.startedAt = Date.now() - BUNDLE_IN_FLIGHT_TIMEOUT_MS - 1_000
      }
    }

    internal.tick()
    // Must have logged timeout and re-dispatched #B to peer-fast even though ready.size === 8!
    assert.isTrue(diagnostics.some((d) => d.includes('timed out')))
    const retriedHol = pipe!.inFlight.get(B.toString())
    assert.isDefined(retriedHol)
    assert.equal(retriedHol!.peerId, 'peer-fast')

    // Fulfill retried #B (and any other missing hole before buffered ready batches) on peer-fast.
    for (let round = 0; round < 6; round++) {
      if (completeFastPeerRequests() === 0) break
      await new Promise((r) => setTimeout(r, 5))
    }
    // All buffered batches drained cleanly through at least 9 batches (288 blocks)!
    assert.isAtLeast(Number(spine.lastVerifiedBlockNumber! - B + 1n), 288)
  })

  it('caps gap-fill width cleanly to next buffered ready range after a partial head-of-line batch', async () => {
    await initEthyKeccak()
    const B = SEPOLIA_AMSTERDAM_BASE
    const HEAD = B + 500n
    const spine = createSpine('sepolia', 11155111n)
    setPhase(spine, 'BAL_CATCHUP')
    spine.pivotBlockNumber = B - 1n
    spine.lastVerifiedBlockNumber = B - 1n
    spine.bestPeerHead = HEAD
    spine.balCatchUp = { fromBlock: B, applied: 0, total: 501 }

    addEth72Peer(spine, 'peer-a', HEAD, 15)
    addEth72Peer(spine, 'peer-b', HEAD, 30)

    const anchor = new Uint8Array(32).fill(0x33)
    const chain = buildSyntheticChain(B, 320, anchor)
    const byNumber = new Map(chain.map((b) => [b.number, b]))

    const sent: Array<{ peerId: string; code: number; payload: Uint8Array }> = []
    const streamer = new BalChainStreamer({
      spine,
      stateManager: createFlatStateManager(),
      chain: Sepolia,
      hardfork: Hardfork.Amsterdam,
      getClient: () => {
        throw new Error('unexpected single-block call')
      },
      sendEthMessage: (peerId, code, payload) => {
        sent.push({ peerId, code, payload })
      },
      pickEthPeer: () => ({ id: 'peer-a', ethVersion: 72, latestBlock: Number(HEAD) }),
      putServableBlock: () => {},
    })
    const internal = streamer as unknown as { verifiedTipHash?: Uint8Array; tick(): void }
    internal.verifiedTipHash = anchor

    internal.tick()

    const decodeHeaderReq = (req: { peerId: string; code: number; payload: Uint8Array }) => {
      const [reqId, body] = RLP.decode(req.payload) as [Uint8Array, Uint8Array[]]
      let start = 0n
      for (const b of body[0]!) start = (start << 8n) | BigInt(b)
      let count = 0
      for (const b of body[1]!) count = (count << 8) | b
      return { peerId: req.peerId, reqId, start, count }
    }

    const deliverCount = (
      req: { peerId: string; reqId: Uint8Array; start: bigint },
      deliverLen: number,
    ) => {
      const blocks = Array.from(
        { length: deliverLen },
        (_, i) => byNumber.get(req.start + BigInt(i))!,
      )
      const before = sent.length
      streamer.handleEthMessage({
        peerId: req.peerId,
        code: EthMessageCodes.BLOCK_HEADERS,
        payload: RLP.encode([req.reqId, blocks.map((b) => b.headerRaw)] as never),
      })
      const balReq = sent
        .slice(before)
        .find((r) => r.peerId === req.peerId && r.code === EthMessageCodes.GET_BLOCK_ACCESS_LISTS)!
      const [balReqId] = RLP.decode(balReq.payload) as [Uint8Array, unknown]
      streamer.handleEthMessage({
        peerId: req.peerId,
        code: EthMessageCodes.BLOCK_ACCESS_LISTS,
        payload: RLP.encode([balReqId, blocks.map(() => [])] as never),
      })
    }

    const initialHeaderReqs = sent
      .filter((r) => r.code === EthMessageCodes.GET_BLOCK_HEADERS)
      .map(decodeHeaderReq)
    const req0 = initialHeaderReqs.find((r) => r.start === B)!
    const req1 = initialHeaderReqs.find((r) => r.start === B + 32n)!
    assert.isDefined(req0)
    assert.isDefined(req1)

    // Deliver full batch 1 (#B+32..B+63) into ready first, then only 10 blocks for batch 0 (#B..B+9).
    deliverCount(req1, 32)
    deliverCount(req0, 10)
    await flushMicrotasks(20)

    assert.equal(spine.lastVerifiedBlockNumber, B + 9n)

    // Next dispatched flight for #(B+10) must be capped to exact 22 blocks so it hits #(B+32) cleanly!
    const gapReq = sent
      .filter((r) => r.code === EthMessageCodes.GET_BLOCK_HEADERS)
      .map(decodeHeaderReq)
      .find((r) => r.start === B + 10n)
    assert.isDefined(gapReq)
    assert.equal(gapReq!.count, 22)

    deliverCount(gapReq!, 22)
    await flushMicrotasks(20)
    assert.equal(spine.lastVerifiedBlockNumber, B + 63n)
  })

  it('backs off repeatedly failing BAL peers exponentially and resets on success', () => {
    const restUntil = new Map<string, number>()
    const streaks = new Map<string, number>()
    const t0 = 1_000_000

    restBalCatchUpPeer(restUntil, 'p1', t0, streaks)
    assert.equal(restUntil.get('p1'), t0 + BAL_BATCH_PEER_REST_MS)

    restBalCatchUpPeer(restUntil, 'p1', t0, streaks)
    assert.equal(restUntil.get('p1'), t0 + BAL_BATCH_PEER_REST_MS * 2)

    restBalCatchUpPeer(restUntil, 'p1', t0, streaks)
    assert.equal(restUntil.get('p1'), t0 + BAL_BATCH_PEER_REST_MS * 4)

    restBalCatchUpPeer(restUntil, 'p1', t0, streaks)
    assert.equal(restUntil.get('p1'), t0 + BAL_BATCH_PEER_MAX_REST_MS)

    noteBalCatchUpPeerSuccess(streaks, 'p1')
    restBalCatchUpPeer(restUntil, 'p1', t0, streaks)
    assert.equal(restUntil.get('p1'), t0 + BAL_BATCH_PEER_REST_MS)

    assert.equal(highestReadyBlock([{ startBlock: 100n, blockCount: 32 }]), 131n)
    assert.equal(
      nextOccupiedRangeStart(10n, [
        { lo: 32n, hi: 63n },
        { lo: 64n, hi: 95n },
      ]),
      32n,
    )
  })

  it('does not spin microtasks or starve timers while pipeline flights are awaiting network replies', async () => {
    await initEthyKeccak()
    const B = SEPOLIA_AMSTERDAM_BASE
    const HEAD = B + 500n
    const spine = createSpine('sepolia', 11155111n)
    setPhase(spine, 'BAL_CATCHUP')
    spine.pivotBlockNumber = B - 1n
    spine.lastVerifiedBlockNumber = B - 1n
    spine.bestPeerHead = HEAD
    spine.balCatchUp = { fromBlock: B, applied: 0, total: 501 }

    addEth72Peer(spine, 'peer-a', HEAD, 20)
    addEth72Peer(spine, 'peer-b', HEAD, 30)

    let sentCount = 0
    const streamer = new BalChainStreamer({
      spine,
      stateManager: createFlatStateManager(),
      chain: Sepolia,
      hardfork: Hardfork.Amsterdam,
      getClient: () => {
        throw new Error('unexpected single-block call')
      },
      sendEthMessage: () => {
        sentCount++
      },
      pickEthPeer: () => ({ id: 'peer-a', ethVersion: 72, latestBlock: Number(HEAD) }),
      putServableBlock: () => {},
    })
    const internal = streamer as unknown as { tick(): void }
    const origTick = internal.tick.bind(streamer)
    let tickCalls = 0
    internal.tick = () => {
      tickCalls++
      origTick()
    }

    internal.tick()
    assert.equal(sentCount, 4)

    // Event loop timers and worker events must fire immediately without starvation.
    const t0 = Date.now()
    await new Promise((r) => setTimeout(r, 15))
    const elapsed = Date.now() - t0
    assert.isBelow(elapsed, 200)
    assert.equal(tickCalls, 1)
  })
})
