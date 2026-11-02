# WP-04c: `@ethereumjs/util` `BinaryAccount`, Constant-Time Sync Throughput, Multi-Peer Pipelining & Discovery Pause

- **Status:** `READY_FOR_PLANNING`
- **Dependencies:** `WP-00`–`WP-04b` (`DONE`)
- **Branch:** `ethy-continuation`
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Strategic Context & Root-Cause Forensics

After `WP-04a` and `WP-04b` (#4425), live Sepolia sync starts reliably and the 4-row `Node Pulse` UI is clean, but live runs exposed **two critical throughput and scaling bottlenecks**:
1. **Linear Throughput Decay Over Time (`3,000 acc/s → 2,000 acc/s → 500 acc/s` after 5–10 minutes):**
   - As `totalAccountsSynced` grows into the hundreds of thousands, ingestion speed steadily degrades.
2. **Flat Multi-Peer Scaling (Going from 1 peer to 2+ peers does not double throughput):**
   - Adding a second or third `snap/1` peer produces almost no visible increase in `accountsPerSec`.

### The 4 Codebase Culprits Behind Both Observations

1. **Culprit #1 (V8 Heap & GC Thrashing): Instantiating Millions of `Account` Objects + 4× RLP Decoding per Packet:**
   - Every `Account` instance in `@ethereumjs/util` allocates 5 separate V8 heap objects (the class instance, 2 `BigInt` boxes, and 2 `Uint8Array` headers/buffers ≈ 350 bytes per account). At 1M–3.5M accounts in `FlatStateManager._accounts`, V8's old-generation heap holds 5M–17M objects, triggering increasingly expensive Mark-Sweep Garbage Collection pauses on every incoming packet!
   - Worse, `handleAccountRange` (`packages/ethy/src/sync/accountSync.ts:256-315`) + `ingestAccountRangeReply` (`syntheticPeer.ts:248-302`) currently **decodes the 128 KiB RLP packet and its 2,000 slim accounts 4 separate times** on the Main Thread!

2. **Culprit #2 (Main-Thread Disk Blocking): 2,000× `fs.writeSync` + Blocking `fs.fsyncSync` on Every Packet (`snapStore.ts:386-399`):**
   - In `SnapPivotStore.appendVerifiedRange`:
     ```ts
     const fd = fs.openSync(file, 'a')
     for (const row of records) {
       const encoded = encodeAccountJournalRecord(row)
       fs.writeSync(fd, encoded) // <-- 2,000 synchronous system calls per packet!
     }
     fs.fsyncSync(fd) // <-- blocks the entire Node event loop waiting on SSD flush!
     writeAtomicDoc(..., buckets.json) // <-- synchronous writeFileSync + renameSync on every packet!
     ```
   - Because `verifyMerkleRangeProof` + 4× RLP decode + 2,000× `fs.writeSync` + `fs.fsyncSync` all block the Main Thread for 30–80ms per packet, **Peer 2's incoming packet literally waits in a single-file queue behind Peer 1's disk flush and GC pause**!

3. **Culprit #3 (Multi-Peer Scheduler & Idle RTT Gap): Unproven "Zombie" Peers Locking Buckets for 20s + Depth-1 Serialization (`accountSync.ts:132-174`):**
   - `getSnapPeers()` includes every peer that negotiated `snap/1` in `HELLO` (`snapSession === true`), even public nodes that have `snap/1` serving disabled (`snapResponsesOk === 0`). When `schedule()` assigns a bucket to an unproven peer in fixed array order, that zombie peer holds the bucket hostage for **`RANGE_TIMEOUT_MS = 20_000` (20 seconds!)**.
   - Furthermore, proven fast peers (`snapResponsesOk > 0`) are restricted to **1 in-flight request at a time**, leaving the peer and network pipe 100% idle during the 80–150ms round-trip time between responses!

4. **Culprit #4 (Continuous Discovery Churn): `DPT` Never Pauses When `connected < 25` (`rlpx.ts:450`):**
   - `_syncDiscoveryThrottle()` only pauses `DPT` when `connected >= maxPeers (25)`. Because Sepolia peers frequently reject dials with `TOO_MANY_PEERS`, `connected` stays at `2..6`, so `DPT` keeps running DNS tree walks and UDP `secp256k1` pings every 3 seconds indefinitely during sync!

---

## 2. Key Architectural Design (4 Atomic Slices)

### Slice 1 — `@ethereumjs/util`: Low-Level `BinaryAccount` (`Uint8Array(104)`) & Offset-Aware Helpers (`packages/util/src/binaryAccount.ts`)

Introduce a first-class, zero-object-allocation **fixed 104-byte binary account representation** in `@ethereumjs/util` living alongside the high-level `Account` class (100% backwards-compatible; separate upstream commit):

```ts
/**
 * Fixed 104-byte binary layout for an Ethereum account (`Uint8Array(104)`):
 * - bytes [0..8]:    nonce (uint64 big-endian)
 * - bytes [8..40]:   balance (uint256 big-endian, 32 bytes)
 * - bytes [40..72]:  storageRoot (32 bytes; KECCAK256_RLP when empty)
 * - bytes [72..104]: codeHash (32 bytes; KECCAK256_NULL when EOA)
 */
export const BINARY_ACCOUNT_SIZE = 104
export type BinaryAccount = Uint8Array
```

All helpers accept an optional `offset = 0` so callers can operate either on a standalone `Uint8Array(104)` **or** directly inside a contiguous multi-account slab/arena `Uint8Array(N * 104)` with **zero heap object allocations**:

- **Creation & Conversion (`packages/util/src/binaryAccount.ts`, re-exported from `src/index.ts`):**
  - `createBinaryAccount(fields?: AccountData, target?: Uint8Array, offset = 0): BinaryAccount`
  - `accountBodyToBinary(body: AccountBodyBytes, couldBeSlim = true, target?: Uint8Array, offset = 0): BinaryAccount`
  - `binaryAccountToBody(buf: Uint8Array, offset = 0, slim = false): AccountBodyBytes`
  - `binaryAccountToRLP(buf: Uint8Array, offset = 0): Uint8Array`
  - `binaryAccountToAccount(buf: Uint8Array, offset = 0): Account`
  - `accountToBinaryAccount(account: Account, target?: Uint8Array, offset = 0): BinaryAccount`
- **Zero-Allocation Field Accessors & Predicates:**
  - `getBinaryAccountNonce(buf: Uint8Array, offset = 0): bigint` / `setBinaryAccountNonce(buf: Uint8Array, nonce: bigint, offset = 0): void`
  - `getBinaryAccountBalance(buf: Uint8Array, offset = 0): bigint` / `setBinaryAccountBalance(buf: Uint8Array, balance: bigint, offset = 0): void`
  - `getBinaryAccountStorageRoot(buf: Uint8Array, offset = 0): Uint8Array` / `setBinaryAccountStorageRoot(buf: Uint8Array, root: Uint8Array, offset = 0): void`
  - `getBinaryAccountCodeHash(buf: Uint8Array, offset = 0): Uint8Array` / `setBinaryAccountCodeHash(buf: Uint8Array, codeHash: Uint8Array, offset = 0): void`
  - `isBinaryAccountContract(buf: Uint8Array, offset = 0): boolean` (compares `[offset+72..offset+104]` against `KECCAK256_NULL`)
  - `isBinaryAccountEmptyStorage(buf: Uint8Array, offset = 0): boolean` (compares `[offset+40..offset+72]` against `KECCAK256_RLP`)
  - `isBinaryAccountEmpty(buf: Uint8Array, offset = 0): boolean` (EIP-161 emptiness check in pure bytes)
- **Unit Tests (`packages/util/test/binaryAccount.spec.ts`):**
  - Round-trip equivalence with `Account` (`createAccount`, `serialize`, slim/full `AccountBodyBytes`, EIP-161 `isEmpty()`, `isContract()`), plus offset-slab indexing tests (`offset = 0, 104, 208`).

---

### Slice 2 — `@ethereumjs/statemanager`: `BinaryAccount`-Backed `FlatStateManager` (`packages/statemanager/src/flatStateManager.ts`)

Upgrade `FlatStateManager` internally so snap-synced accounts are stored as compact **104-byte `BinaryAccount`s** (or slab-backed byte views) instead of millions of `Account` class instances (100% backwards-compatible with `StateManagerInterface`; separate upstream commit):

- Store account state internally as `BinaryAccount` (`Uint8Array(104)`), converting to `Account` via `binaryAccountToAccount` only when `getAccount(address)` / `getAccountByHash(hash)` is called!
- Add fast batch ingestion & binary lookup methods:
  - `putSnapBinaryAccountsBatch(entries: Array<{ accountHash: Uint8Array; binaryAccount: BinaryAccount; address?: Address }>): void`
  - `getBinaryAccountByHash(accountHash: Uint8Array): BinaryAccount | undefined`
- Keep `putSnapAccountsBatch` working seamlessly (converting via `accountToBinaryAccount`).
- Update `packages/statemanager/test/flatStateManager.spec.ts` to test `putSnapBinaryAccountsBatch` and `getBinaryAccountByHash`.

---

### Slice 3 — `@ethereumjs/devp2p`: Sync-First Discovery Pause (`packages/devp2p/src/worker/`)

Stop continuous DNS and UDP discovery from burning CPU and bandwidth once Ethy has enough working sync peers (separate upstream commit):

- Add worker command `{ type: 'setDiscoveryPaused'; paused: boolean }` to `WorkerCommand` (`protocol.ts`), `Devp2pWorkerClient.setDiscoveryPaused(paused: boolean)` (`client.ts`), and `Devp2pWorkerHost` (`host.ts` → `this._dpt?.setDiscoveryPaused(paused)`).
- Expose `discoveryPaused: boolean` on `WorkerDiscoverySnapshot` (`metrics.ts`) so the TUI and diagnostics can see when discovery is paused.
- In `PeerCoordinator` (`packages/ethy/src/net/peerCoordinator.ts`):
  - Pause discovery (`client.setDiscoveryPaused(true)`) whenever Ethy has **`>= 3` proven `snap/1` peers** (`snapResponsesOk > 0`) during `SNAP_SYNCING` (or `>= 3` validated `eth` peers during `HEAD_FOLLOWING`).
  - Automatically resume discovery (`client.setDiscoveryPaused(false)`) whenever proven `snap/1` peers drop below `2`!

---

### Slice 4 — `@ethereumjs/ethy`: Single-Pass Ingest, Batched Disk Writes & Multi-Peer Pipelined Scheduler (`packages/ethy/src/sync/` & `src/persist/`)

1. **Single-Pass Decode & `BinaryAccount` Ingest (`syntheticPeer.ts` & `accountSync.ts`):**
   - In `ingestAccountRangeReply`: decode the RLP packet **once**, convert each `[accountHash, slimBody]` to a `BinaryAccount` (`accountBodyToBinary`) **once**, expand to full RLP for `verifyMerkleRangeProof` from that single pass, and return `{ ok, hasRight, count, lastKey, binaryEntries }` directly!
   - Eliminate the redundant 2nd, 3rd, and 4th `RLP.decode` calls in `handleAccountRange` and `accountRecordsFromRangeReply`!
2. **100× Faster Batched Disk Journal Writes (`src/persist/snapStore.ts` & `journal.ts`):**
   - Support fixed-size binary account journal records (`32-byte accountHash + 104-byte BinaryAccount = 136 bytes` per account, or a single concatenated buffer write per range reply).
   - In `appendVerifiedRange`: allocate **one single combined `Uint8Array`** for the entire batch of ~2,000 accounts and write it in **one single `fs.writeSync(fd, batchBuffer)`** call!
   - Remove the per-packet `fs.fsyncSync(fd)` and per-packet `writeAtomicDoc(..., buckets.json)` from the hot 50ms packet handler! Instead, throttle `buckets.json` flush + disk sync to **once every 2 seconds** (and unconditionally in `stop()` / `flushBuckets()`).
3. **Smart Multi-Peer Work Distribution, Fast Unproven Probe & 2× Pipelining (`accountSync.ts` & `snapFlight.ts`):**
   - **Peer Quality Ranking in `schedule()`:** Sort available `snap/1` peers so **proven peers (`snapResponsesOk > 0`) ordered by lowest average RTT (`avgLatencyMs`)** are always assigned before unproven (`snapResponsesOk === 0`) peers!
   - **Fast Probe Timeout for Unproven Peers (`4,000ms` vs `15,000ms`):** If a peer has `snapResponsesOk === 0`, apply a **4-second timeout** on its first range request (instead of 20 seconds!). If it times out, put it on a 30s rest timer and immediately free the bucket for a proven peer.
   - **2× In-Flight Request Pipelining per Proven Peer:** Upgrade `SnapPeerFlightTracker` to key in-flight requests by `(peerId, reqId)` and allow up to **`MAX_IN_FLIGHT_PER_PROVEN_PEER = 2`** concurrent bucket requests for proven peers (`snapResponsesOk >= 2` and `snapTimeouts === 0`). When Peer 1 and Peer 2 are both proven, 4 buckets sync concurrently with zero RTT idle gap!
4. **Deterministic Throughput & Multi-Peer Scaling Benchmark (`scripts/sync-bench.ts` & `test/syncScaling.spec.ts`):**
   - Add `test/syncScaling.spec.ts` verifying:
     1. **Multi-peer scaling:** 2 simulated peers (with 40ms simulated latency) complete a 16-bucket sync **`>= 1.7×` faster** than 1 peer.
     2. **Unproven zombie peer resilience:** 1 working peer + 2 silent zombie peers (that never reply to `GET_ACCOUNT_RANGE`) still finishes all 16 buckets rapidly because the zombie peers time out in 4s and the proven peer takes over all 16 buckets.
     3. **Single-pass binary journal round-trip:** `SnapPivotStore` writes and reloads `BinaryAccount` journals accurately into `FlatStateManager`.

---

## 3. Acceptance Criteria
- [ ] `BinaryAccount` (`BINARY_ACCOUNT_SIZE = 104`) and its offset-aware helpers are exported from `@ethereumjs/util` with full TypeDoc JSDoc comments (`api-docs.mdc`) and pass `packages/util/test/binaryAccount.spec.ts`.
- [ ] `FlatStateManager` stores accounts internally as `BinaryAccount` (`putSnapBinaryAccountsBatch` / `getBinaryAccountByHash`) and passes all `@ethereumjs/statemanager`, `@ethereumjs/evm`, and `@ethereumjs/vm` tests.
- [ ] `Devp2pWorkerClient.setDiscoveryPaused(boolean)` pauses/resumes discovery in the worker when proven sync peers are active (`>= 3` pause, `< 2` resume).
- [ ] `SnapAccountSynchronizer` decodes each `ACCOUNT_RANGE` packet in a single pass, writes each batch to disk in a single `fs.writeSync` (with 2s throttled `buckets.json` flush), pipelines up to 2 requests per proven peer, and times out unproven zombie peers in 4s.
- [ ] `test/syncScaling.spec.ts` proves `>= 1.7×` speedup with 2 peers vs. 1 peer and fast completion despite silent zombie peers.
- [ ] `npm run tsc`, `npm test`, and `npm run spellcheck` pass with 0 errors across `packages/util`, `packages/statemanager`, `packages/devp2p`, and `packages/ethy`.

---

## 4. Concrete Implementation Plan (Planner — Grok 4.7)

*(To be filled out by Grok 4.7 during the Planning pass. Plan 4 isolated commits: `@ethereumjs/util` → `@ethereumjs/statemanager` → `@ethereumjs/devp2p` → `@ethereumjs/ethy`.)*

---

## 5. Implementation Notes & Deviations (Implementer — Composer 2.5)

*(To be filled out by Composer 2.5 after implementation and verification.)*
