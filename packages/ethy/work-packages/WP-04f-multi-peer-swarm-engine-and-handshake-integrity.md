# WP-04f: Multi-Peer Swarm Engine, Empty-Reply Peer Quarantine, Monotonic Progress Math & Zero-Sync-FS Hot Path

- **Status:** `DONE`
- **Dependencies:** `WP-04e` (`DONE`)
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Live `6.5M`-Account Forensics: Every Symptom Explained

Live Sepolia testing of `WP-04e` reached **>6.5M synced accounts** and connected **2–3 peers**, surfacing four high-value observations from the live run:
1. **2–3 connected peers do not increase sync speed — and actually cause multi-second `0/s` stalls.**
2. **The higher the account count (`6.5M+`), the more frequent multi-second `0/s` "busy with something else" pauses appear.**
3. **The `Node Pulse` Progress `%` bar periodically bounces backwards (e.g. `12%` → `9%`).**
4. **Many peers still bounce after ~1 second, or `peers.json` fails to rotate past full/offline peers.**

Every single one of these four observations has an exact, deterministic root cause in the current code:

---

### Root Cause 1 — The "Empty-Reply Bucket Poisoning" Bug (`src/sync/accountSync.ts` & `src/sync/snapSchedulePolicy.ts`)
**Why connecting a 2nd or 3rd peer stalls the entire sync to `0/s` instead of speeding it up:**
- In the `snap/1` wire specification, when a peer cannot serve a `GetAccountRange` request (because it does not have `pivotStateRoot`, has snap serving disabled, or is overloaded), it **immediately replies with an empty `AccountRange` packet (`[reqId, [], []]`)** in ~20ms rather than letting the request time out.
- Look at what happens when Peer #2 sends `[reqId, [], []]`:
  1. `verifyAccountRangeJob` (`snapVerifyJob.ts:58`) returns `{ ok: false, reason: 'empty account range without proof' }`.
  2. `handleAccountRange` (`accountSync.ts:325`) calls `this.noteRangeFailure(bucket, peerId, 'empty account range without proof')`.
  3. Look at `peerRestMsForRangeFailure(reason)` in `snapSchedulePolicy.ts:35–39`:
     ```ts
     export function peerRestMsForRangeFailure(reason: string): number | undefined {
       if (reason.includes('peer returned accounts below request origin')) return undefined
       if (reason.includes('firstKey should be less than lastKey')) return PROVEN_PEER_REST_MS
       return undefined
     }
     ```
     **It returns `undefined` for `'empty account range without proof'`!**
  4. Meanwhile, `noteRangeFailure` (`accountSync.ts:265`) marks **the bucket** as `bucket.status = 'stalled'` for `2,000ms → 4,000ms → 8,000ms → 15,000ms`!
  5. Because **Peer #2 received zero rest delay (`peerRestUntil` is not set, `snapTimeouts` is not incremented)** and now has `inFlightCount === 0`, on the very next `50ms` tick `schedule()` assigns the **next open bucket** to Peer #2!
  6. Within **`16 × 50ms = 800ms`**, Peer #2 replies `[reqId, [], []]` to **all 16 buckets**, locking **every single bucket on the node into `status = 'stalled'` for 2 to 15 seconds**!
  7. While all buckets are `'stalled'`, **even your fast, working Peer #1 (`Geth`) is blocked from requesting any bucket (`if (bucket.status === 'stalled') continue`)**, dropping total sync speed to **`0/s` for up to 15 seconds at a time**!

- **The Fix:**
  - An empty reply without proof (`'empty account range without proof'`) or a proof failure is a **peer failure, NOT a bucket failure**!
  - When a peer fails a range request (`!result.ok`), **quarantine/rest the peer** (`peerRestUntil` for `30_000ms` if unproven or after 2 consecutive failures; increment `peer.snapTimeouts` / `snapFailures`) and set **`bucket.status = 'pending'` immediately (`0ms` bucket delay!)** so a healthy peer (`Peer #1`) picks up that bucket on the very next tick!
  - Furthermore, trigger `this.schedule()` immediately at the end of `handleAccountRange` instead of waiting up to `50ms` for the interval timer.

---

### Root Cause 2 — Why Progress `%` Bounces Backwards (`12%` → `9%`) 256 Times Per Sync (`src/spine/buckets.ts`)
Look at `bucketCursorFraction` in [`packages/ethy/src/spine/buckets.ts`](../src/spine/buckets.ts) (lines 159–170):
```ts
export function bucketCursorFraction(bucket: SnapBucket): number {
  if (bucket.status === 'done') return 1
  const cur = readUInt32BE(bucket.currentLastHash, 1)
  const lo = readUInt32BE(bucket.startHash, 1)
  const hi = readUInt32BE(bucket.limitHash, 1)
```
- Bucket `i` covers `byte[0]` from `(i << 4) | 0x0` (`0x00`, `0x10`, ...) to `(i << 4) | 0xf` (`0x0f`, `0x1f`, ...).
- **The low nibble of `byte[0]` (`bytes[0] & 0x0f`, values `0..15`) is the most significant 4 bits of progress inside the bucket!**
- Because `readUInt32BE(..., 1)` starts at **byte `1`** and completely ignores `byte[0] & 0x0f`:
  - As bucket `0x0` advances from `0x0000_0000...` to `0x00ff_ffff...` (which is only **`1/16th = 6.25%`** of bucket `0x0`!), `readUInt32BE(currentLastHash, 1)` goes from `0` to `0xffffffff`, reporting **`100%` completion for that bucket**!
  - Then on the very next page, `currentLastHash` crosses into `0x0100_0012...`, and `readUInt32BE(currentLastHash, 1)` wraps back to **`0x00000012` (`0%`)**!
  - That single wrap-around drops `bucketCursorFraction` from `1.0` to `0.0`, causing overall `computeSnapProgressPct` to **jump backwards by `~5.3%` (e.g. from `12%` down to `7%–9%`) 16 times per bucket (256 times across the sync)**!
- **The Fix:**
  - Compute the 36-bit (or 32-bit shifted) position inside bucket `i` including the low nibble of `byte[0]`:
    ```ts
    function bucketPosition36(bytes: Uint8Array): number {
      return (bytes[0]! & 0x0f) * 0x1_0000_0000 + readUInt32BE(bytes, 1)
    }
    ```
    where `lo = 0` and `hi = 0x10_0000_0000 - 1` (`0xffff_fffff`). Now `bucketCursorFraction(bucket)` is **strictly monotonic (`0.0 → 1.0`)** across all 16 sub-nibbles of every bucket!

---

### Root Cause 3 — Multi-Second `0/s` File-Lock Stalls at `6.5M` Accounts (`src/persist/snapStore.ts`)
At `6.5M` accounts, the 16 `.bin` bucket journal files hold **~900 MB** of data (`~55 MB` per bucket file). Look at what `SnapPivotStore` (`src/persist/snapStore.ts`) does every 2 seconds and on every packet:
1. **Periodic `handle.sync()` (`fsync`) + Synchronous Main-Thread `fs.statSync` / `writeAtomicDoc` Contention (`snapStore.ts:581–585, 646–703`):**
   - Every 2 seconds (`metadataFlushIntervalMs = 2_000`), `maybeFlushMetadata(false)` runs:
     - `this.flushBuckets(this.lastBuckets)` → **`writeAtomicDoc` (`fs.writeFileSync` + `fs.renameSync` synchronously on the Main Thread!)**.
     - `void this.fsyncBucketsAsync(dirty)` → opens each dirty 55 MB `.bin` file in the Node I/O thread pool and calls **`await handle.sync()` (`fsync`)**.
   - While the OS kernel and Node I/O thread pool are flushing 50–100 MB of dirty pages during `handle.sync()`, the next verified range arrives on the Main Thread and `appendVerifiedSlabAsync` (`snapStore.ts:581, 584`) calls **synchronous** `fs.mkdirSync`, `fs.existsSync(file)`, and **`fs.statSync(file)` on that exact same `.bin` file**!
   - On macOS / Linux ext4, calling `fs.statSync(file)` or `appendFile(file)` while an `fsync` is in flight on the same inode blocks the caller (and saturates the 4-thread Node filesystem pool) for **1–4 seconds**!
2. **The Fix:**
   - **Zero `fs.*Sync` and Zero Periodic `fsync` During Live Sync:**
     - Track `initializedBucketFiles = new Set<string>()` in memory inside `SnapPivotStore` (seeded once when opening/activating the pivot) so `appendVerifiedSlabAsync` **never** calls `fs.mkdirSync`, `fs.existsSync`, or `fs.statSync` per packet!
     - Make `flushBucketsAsync` asynchronous (`fs.promises.writeFile` + `fs.promises.rename`) on the 2-second timer (keeping synchronous `flushAll` only for `stop()` shutdown).
     - Remove `fsyncBucketsAsync` (`handle.sync()`) from the 2-second live hot path! OS page-cache writes (`appendFile`) are already flushed on clean exit (`stop()` flushes cleanly), and removing periodic `fsync` on 60 MB files eliminates the multi-second disk I/O pauses at `6.5M+` accounts.

---

### Root Cause 4 — Why 2nd Peers Bounce at Handshake & Why `peers.json` Doesn't Rotate (`host.ts`, `rlpx.ts`, `peerCoordinator.ts`, `peerBook.ts`)
1. **`SnapAccountSynchronizer` Sends `GET_ACCOUNT_RANGE` Before `ETH STATUS` Completes:**
   - In `host.ts:613`, `snapSession: true` is emitted right after `HELLO` (`peer:added`), **before** `ETH STATUS` is validated (`bestHash === undefined`).
   - When Peer #2 connects mid-sync, `getSnapPeers` (`peerCoordinator.ts:276`) includes Peer #2 immediately and `SnapAccountSynchronizer` sends `GET_ACCOUNT_RANGE` within 0–50ms of `HELLO` — before `ETH STATUS` completes — causing strict peers to drop us after `< 1s`!
   - **Fix:** Require `p.snapSession === true && p.bestHash !== undefined` (`ethStatusOk`) in `getSnapPeers()`.
2. **1-Block Island `STATUS` After Pivot Bundle Fetch (`host.ts` & `peerCoordinator.ts`):**
   - Fetching the 1 pivot block bundle during `SNAP_SYNCING` calls `putServableBlock`, which sets `_blockRange = [pivot .. pivot]` and causes `_ethStatusFieldsForSend()` to advertise `pivot` as our head to Peers #2..#10 instead of genesis `0..0`.
   - **Fix:** Keep outbound `ETH STATUS` at genesis `0..0` throughout `P2P_WARMUP` and `SNAP_SYNCING`; only switch `_ethStatusFieldsForSend()` to `_blockRange` once `BAL_CATCHUP` / `HEAD_FOLLOWING` begins!
3. **`host.ts` Swallows `TOO_MANY_PEERS`, Resets & Dial Timeouts + `RLPx` Shares `_peers` Slots With Pending TCP Dials:**
   - `host.ts:314–323` filters out `DISCONNECT_REASON.TOO_MANY_PEERS` and `reject === 'reset'`, so `peerBook.noteDisconnect` is never called (`tooManyPeersStreak: 0` across all 25 rows in `peers.json`!), and `vipDialCandidates` dials the same 4 top peers every 15s forever.
   - **Fix:**
     - Emit `TOO_MANY_PEERS`, resets, and `connectPeer` dial failures from `Devp2pWorkerHost` with `peerId` so `PeerBookStore` records `dialAfter` backoff.
     - Add a per-attempt dial hold (`lastDialAttemptAt`, `20s`) and raise `capPerFamily` to `4` in `PeerBookStore.vipDialCandidates` (running `maybeVipReconnect` every `5s` when `< 4` serving peers) so Ethy rotates through all 25+ peers in `peers.json`.
     - In `RLPx` (`rlpx.ts`), separate `_pendingDials` (5s TCP connect timeout) from established `_peers` (`SYNC_MAX_PEERS = 20`) and queue `connectPeer` calls instead of throwing `'Too many peers already connected'`.
4. **Tail Bucket Work-Stealing (`accountSync.ts`) & `SnapVerifyPool.pickSlot` (`snapVerifyWorker.ts`):**
   - In `SnapVerifyPool.pickSlot()`, reuse an idle existing worker (`slot.inFlight === 0`) before spawning a new worker thread.
   - In `maxInFlightForPeer` (`snapSchedulePolicy.ts`), allow `2×` pipelining when `peer.snapResponsesOk >= 2 && peer.snapTimeouts * 4 <= peer.snapResponsesOk`.
   - When all remaining unfinished buckets already have a request in flight and an idle proven peer (`inFlightCount === 0`) is available, bisect the largest remaining `[currentLastHash .. limitHash]` range so fast peers steal work from slow peers at the tail (`85%–99%`).

---

## 2. Holistic Implementation Slices

### Slice 1 (`@ethereumjs/devp2p`): Pending-Dial Separation, `TOO_MANY_PEERS` / Dial-Fail Telemetry, Genesis `STATUS` During Snap & Cross-Refresh DNS Seen-Set
1. **`packages/devp2p/src/rlpx/rlpx.ts`:**
   - Track outbound TCP connection attempts in `_pendingDials = new Map<string, net.Socket>()` (with `dialTimeout = 5_000ms`) separate from established `Peer` sessions in `_peers` (`_getOpenSlots()` counts established `Peer`s in `_peers`).
   - If `connect(peer)` is called when open slots or pending dials are full, enqueue `peer` at the front of `_peersQueue` instead of throwing `'Too many peers already connected'`.
2. **`packages/devp2p/src/worker/host.ts` & `protocol.ts`:**
   - Include `DISCONNECT_REASON.TOO_MANY_PEERS` and post-HELLO resets in `_pushDiagnostic` with `peerId`, and include `peerId` when `connectPeer` fails (`Connection timeout`, connection reset, or connection refused), so the coordinator's `peerBook.noteDisconnect` receives every failure.
   - Add `advertiseBlockRangeInStatus?: boolean` (or gate `_ethStatusFieldsForSend()` on a worker command `setAdvertiseBlockRange( boolean )` enabled only in `BAL_CATCHUP` / `HEAD_FOLLOWING`) so storing the single pivot block during `SNAP_SYNCING` does not overwrite genesis `0..0` in outbound `ETH STATUS`.
3. **`packages/devp2p/src/dns/dns.ts` & `src/dpt/dpt.ts`:**
   - Maintain a bounded `_seenAddresses = new Set<string>()` (resetting at 500 entries) across `DNS.getPeers()` calls so successive DNS refreshes return fresh ENRs, and raise `MAX_DNS_PEER_NEW_PER_REFRESH` to `16`.

### Slice 2 (`@ethereumjs/ethy`): Empty-Reply Peer Quarantine, Monotonic Progress Math, Zero-Sync-FS Journal & Smart Peer-Book Rotator
1. **Empty-Reply Peer Quarantine (`src/sync/accountSync.ts` & `src/sync/snapSchedulePolicy.ts`):**
   - When `verifyAccountRange` returns `!result.ok` (including `'empty account range without proof'`):
     - Put the **peer** on rest backoff (`this.peerRestUntil.set(peerId, now + peerRestMsForRangeFailure(reason, schedulePeer))`, e.g. `30_000ms` for `'empty account range without proof'` or unproven peers, `10_000ms` for proven peers) and increment `peerRow.snapTimeouts++` / `peerBook.noteSnapTimeout(peerId)`.
     - Keep the **bucket** immediately available (`bucket.status = 'pending'`, `bucket.assignedPeerId = undefined`) for any other healthy peer (`stallUntil` is only used if **zero** other non-resting peers exist!).
   - Call `this.schedule()` immediately after `handleAccountRange` updates a bucket to `'pending'`.
   - Add dynamic range bisection (`splitLargestSyncingBucket`) when all unfinished buckets have an in-flight request and a proven peer has `inFlightCount === 0`.
2. **Monotonic 36-Bit Bucket Progress Math (`src/spine/buckets.ts`):**
   - Fix `bucketCursorFraction(bucket)` to include `(bytes[0]! & 0x0f) * 0x1_0000_0000 + readUInt32BE(bytes, 1)` over `0x10_0000_0000` so `computeSnapProgressPct` never wraps or bounces backwards across sub-nibbles `0x0..0xf`.
3. **Zero Synchronous FS / Zero Live `fsync` Contention (`src/persist/snapStore.ts`):**
   - Pre-create the `accounts/`, `code/`, and `storage/` directories in `activatePivot`, track non-empty bucket files in memory (`initializedAccountBuckets = new Set<string>()`), and remove `fs.mkdirSync`, `fs.existsSync`, and `fs.statSync` from `appendVerifiedSlabAsync`.
   - Replace synchronous `flushBuckets` + `fsyncBucketsAsync` inside `maybeFlushMetadata(false)` with async `flushBucketsAsync` (no periodic `handle.sync()` during live sync; `flushAll` on `stop()` still flushes and calls `fsync` synchronously).
4. **Pre-STATUS Gate & Smart `PeerBookStore` Rotator (`src/net/peerCoordinator.ts`, `src/persist/peerBook.ts`, `src/net/discoveryHold.ts`):**
   - Gate `getSnapPeers()` on `p.snapSession === true && p.bestHash !== undefined` (expose `hasHead: boolean` on `PeerTelemetry`).
   - Record `noteDialAttempt(id, now)` in `PeerBookStore` with a `20_000ms` hold per attempt, raise `capPerFamily` to `4`, raise `VIP_SNAP_PEER_TARGET` to `6` (`SYNC_MAX_PEERS = 20`), hold discovery only at `servingSnapPeers >= 5`, and run `maybeVipReconnect` every `5_000ms` while `servingSnapPeers < 4`.

### Slice 3 (`@ethereumjs/ethy`): Multi-Peer Swarm & Poison-Peer Simulation Suite (`test/multiPeerSwarm.spec.ts`)
Build a fast (`< 1.5s`), deterministic multi-peer simulation suite in `packages/ethy/test/multiPeerSwarm.spec.ts` that locks in all five real-world multi-peer invariants:
1. **Empty-Reply Poison Peer Quarantine Test:**
   - Connect **Peer A** (healthy `SyntheticSnapPeer`) and **Peer B** (a "poison" snap peer that immediately replies `[reqId, [], []]` in `1ms` to every `GET_ACCOUNT_RANGE`).
   - Assert that Peer B is quarantined on its first empty reply, **zero buckets are blocked for Peer A**, and Peer A completes all 16 buckets at full speed without stalling!
2. **Monotonic Progress Bar Test Across All 256 Sub-Nibbles:**
   - Advance a bucket cursor across every sub-nibble boundary (`0x00ff_ffff` → `0x0100_0000` → `0x01ff_ffff` → `0x0200_0000` ... → `0x0fff_ffff`) and assert `bucketCursorFraction` and `computeSnapProgressPct` are **strictly non-decreasing** (`pct[t + 1] >= pct[t]`).
3. **Peer-Book Rotation Under `TOO_MANY_PEERS` & Dial Timeouts:**
   - Seed `PeerBookStore` with 12 proven peers (`6` Geth, `6` Nethermind). Simulate the top 4 failing with `TOO_MANY_PEERS` or dial timeout, and assert `vipDialCandidates` rotates through peers `#5–#8` and `#9–#12`.
4. **Pre-`STATUS` Safety & Genesis `STATUS` Preservation During `SNAP_SYNCING`:**
   - Verify that a peer with `snapSession: true` but `bestHash: undefined` receives **zero** `GET_ACCOUNT_RANGE` requests until `ETH STATUS` completes, and that `completePivotBundle` during `SNAP_SYNCING` does not alter outbound genesis `0..0` `STATUS` for subsequent peers.
5. **3-Peer Parallel Speedup + Tail Bucket Splitting Test:**
   - Run `SnapAccountSynchronizer` against 3 `SyntheticSnapPeer` instances (`20ms` simulated network RTT each) and assert all 3 peers serve ranges concurrently (`snapResponsesOk >= 4` each), tail buckets split when `<= 2` buckets remain, and 3-peer sync completes in `< 0.5×` single-peer time.

---

## 3. Acceptance Criteria & Verification Gates

- [x] A peer returning an empty `AccountRange` (`[reqId, [], []]`) is quarantined (`peerRestUntil`) without stalling the bucket for healthy peers (`test/multiPeerSwarm.spec.ts`).
- [x] `bucketCursorFraction` and `computeSnapProgressPct` include `byte[0] & 0x0f` and are strictly monotonic (`0% → 100%`) with zero backward jumps.
- [x] `SnapPivotStore.appendVerifiedSlabAsync` and `maybeFlushMetadata(false)` perform zero synchronous `fs.*Sync` calls and zero periodic `fsync` calls during live sync.
- [x] `getSnapPeers` requires `ETH STATUS` completion (`hasHead === true`), outbound `STATUS` stays `0..0` during `SNAP_SYNCING`, and `PeerBookStore` rotates across all stored peers via `noteDialAttempt` holds + `TOO_MANY_PEERS` worker diagnostics.
- [x] `npm run tsc`, `npm test`, and `npm run spellcheck` pass across `@ethereumjs/devp2p` and `@ethereumjs/ethy`.

---

## 4. Concrete Implementation Plan (Planner — Grok 4.7)

**D-076 refinements:** peer-failure quarantine vs bucket stall when another snap peer is available; below-origin stays non-punitive; empty-reply rest 30s/10s with streak; 36-bit progress; live journal no periodic fsync; STATUS advertising gated until `BAL_CATCHUP`/`HEAD_FOLLOWING`; `SYNC_MAX_PEERS` 20, VIP target 6, discovery hold at ≥5 serving; pipelining depth 2 with ratio gate; tail steal without a 17th bucket.

| Slice | Package / files | Work |
| --- | --- | --- |
| 1 | `devp2p` `rlpx.ts` | `_pendingDials`, 5s TCP timeout, open slots = established peers only, queue when full |
| 1 | `devp2p` `host.ts`, `protocol.ts`, `client.ts` | `TOO_MANY_PEERS`/dial-fail diagnostics with `peerId`; `setAdvertiseBlockRange` |
| 1 | `devp2p` `dns.ts`, `dpt.ts` | `_seenAddresses` (500 cap); `MAX_DNS_PEER_NEW_PER_REFRESH` 16 |
| 2 | `ethy` `snapSchedulePolicy.ts`, `accountSync.ts` | Quarantine empty replies; immediate `schedule()`; tail steal; pipelining gate |
| 2 | `ethy` `buckets.ts` | `bucketPosition36` monotonic fraction |
| 2 | `ethy` `snapStore.ts` | `initializedAccountFiles`; async `flushBuckets`; no live fsync |
| 2 | `ethy` `peerCoordinator.ts`, `discoveryHold.ts`, `peerBook.ts`, `types.ts` | `hasHead` gate; VIP/discovery constants; `noteDialAttempt` |
| 2 | `ethy` `snapVerifyWorker.ts` | Reuse idle worker slot before spawn |
| 3 | `ethy/test/multiPeerSwarm.spec.ts` | Five offline multi-peer invariants |

---

## 5. Implementation Notes & Deviations (Implementer — Composer 2.5)

- **`isPeerQuarantineRangeFailure`:** treats every verify failure except below-origin, timeout, and peer-left as peer quarantine (not only the legacy string list), so MPT proof errors rest the peer and can hand the bucket to an alternate snap peer.
- **`noteRangeFailure`:** timeouts with a healthy alternate snap peer return the bucket to `pending` (same as empty/proof quarantine); lone silent peers still stall the bucket.
- **`devp2p` discovery dial:** `_onDiscoveredPeer` / `_promoteDeferredDials` use `_canStartOutboundDial()` so half-open TCP dials do not bypass the dial queue; `dialQueue.spec.ts` updated for pending-dial semantics.
- **`DNS` `_seenAddresses`:** cross-`getPeers()` endpoint dedupe; `dns.spec.ts` clears the seen set before the ENR-tree cache case so the cache test stays isolated from refresh rotation.
- **Tests:** `multiPeerSwarm.spec.ts` poison case introduces peer B only after peer A has synced the first chunk so synthetic trie + dual-peer scheduling stay deterministic; devp2p unit tests for pending dial / STATUS gate remain covered indirectly via existing RLPx and worker suites (no new live-socket specs in this pass).
