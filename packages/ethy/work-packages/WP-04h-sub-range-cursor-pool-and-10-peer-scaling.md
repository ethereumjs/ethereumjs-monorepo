# WP-04h: General `N`-Way Sub-Range Cursor Pool & 10-Peer Dynamic Work-Stealing (`@ethereumjs/ethy`)

- **Status:** `DONE`
- **Dependencies:** `WP-04g` (`DONE`)
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Context & Architectural Goal

In `WP-04g`, Ethy reached **41,000+ accounts/sec** across 4–5 connected `snap/1` peers. However, `SnapBucket` (`0x0..0xf`) currently serves two conflicting roles:
1. **UI / Persistence Nibble Bucket (`0x0..0xf`):** The 16 top-level hex nibbles displayed in the `Node Pulse` / `/buckets` view and persisted to `accounts/0.bin .. accounts/f.bin`.
2. **Network Concurrency Unit:** Because `SnapAccountSynchronizer` tracks a single primary `[currentLastHash .. limitHash]` cursor per bucket (plus a special-cased 1-slot `bucketStealUpper` map), **at most 1–2 requests can be in flight per nibble bucket**, and splitting a bucket requires complex `flight.steal` branching (`filterAccountSlabFromMid` / `filterAccountSlabBeforeMid`).

When 4–10 peers are connected with `4×` pipelining (`16–40` concurrent request slots), or when the first 8–12 buckets finish early and only 4 buckets remain, having 1 cursor per bucket leaves most peer pipeline slots idle and creates fragile special-case steal logic.

### Architectural Solution: Decouple the **16 Nibble Buckets (`0x0..0xf`)** from an **`N`-Way Non-Overlapping Sub-Range Pool (`SnapRangeCursor`)**

Each of the 16 nibble buckets (`0x0..0xf`) owns a sorted list of **independent, non-overlapping sub-range cursors** (`subRanges: SnapRangeCursor[]`):
```ts
export type SnapRangeCursor = {
  id: number
  bucketIndex: number
  origin: Uint8Array // 32 bytes (inclusive)
  limit: Uint8Array  // 32 bytes (inclusive)
  inFlightReqKey?: string
  verifying?: boolean
}
```
- **Initial State (or Dynamic Bisection):**
  - Each bucket `0x0..0xf` starts with either `1` cursor (`[startHash .. limitHash]`) or `4` quarter-nibble cursors (`0x00..0x03`, `0x04..0x07`, `0x08..0x0b`, `0x0c..0x0f` = **64 independent cursors across the 256-bit keyspace**).
  - **Dynamic Range Bisection (`splitWidestSubRange`):** Whenever any proven peer has an available pipeline slot (`inFlightCount < maxInFlightForPeer(peer)`) and all existing `SnapRangeCursor`s with `origin <= limit` are currently busy (`inFlightReqKey !== undefined || verifying === true`), pick the active `SnapRangeCursor` with the largest remaining span `bucketPosition36(cursor.limit) - bucketPosition36(cursor.origin) >= MIN_SPLIT_SPAN`:
    1. Compute `mid = midpointKey32(cursor.origin, cursor.limit)`.
    2. Clamp the existing cursor's upper bound in place: `const oldLimit = cursor.limit; cursor.limit = mid`.
    3. Insert a new independent `SnapRangeCursor` right after it: `{ id: nextCursorId++, bucketIndex: cursor.bucketIndex, origin: incrementKey32(mid), limit: oldLimit }`.
    4. Assign the new cursor immediately to the free peer slot!
- **Why This Eliminates All Special-Case `steal` Code:**
  - Every `SnapRangeCursor` is a first-class, non-overlapping `[origin .. limit]` range!
  - When a reply arrives for `cursor`:
    1. Filter/clip any accounts in `result.slab` that exceed `cursor.limit` (since `snap/1` peers may return accounts past the requested `limitHash` up to `responseBytes`).
    2. If `result.hasRight && compareBytes32(result.lastKey, cursor.limit) < 0`, advance `cursor.origin = incrementKey32(result.lastKey)`.
    3. Otherwise, the sub-range is exhausted — remove `cursor` from the bucket's active `subRanges`!
  - **Bucket Progress & Completion (`buckets.ts` & `snapStore.ts`):**
    - A bucket `i` is `'done'` when all of its `subRanges` are exhausted (`subRanges.length === 0`).
    - Its `bucketCursorFraction(bucket)` is simply `1 - (sum(span(c) for c in bucket.subRanges) / FULL_BUCKET_SPAN_36)`, which is **100% monotonic (`0.0 → 1.0`)** regardless of how many sub-ranges are running in parallel!
    - Its `currentLastHash` (for `buckets.json` persistence compatibility) is the lowest `origin` among remaining `subRanges` (or `limitHash` when empty), and `buckets.json` optionally persists `subRanges?: Array<{ origin: string; limit: string }>` so exact multi-cursor state resumes seamlessly!

---

## 2. Key Deliverables

1. **Unified `SnapRangeCursor` Pool in `SnapAccountSynchronizer` (`packages/ethy/src/sync/accountSync.ts` & `src/spine/buckets.ts`):**
   - Replace `bucketStealReq`, `bucketStealMid`, `bucketStealUpper`, and `flight.steal` branching with a clean `subRanges: SnapRangeCursor[]` list per bucket.
   - Implement `splitWidestSubRange(bucket)` when a peer slot is free and no unassigned cursor is waiting, allowing up to **64 concurrent range requests across 4–10 peers** with zero idle pipeline slots and zero duplicate account downloads.
   - Clip any trailing accounts `> cursor.limit` using `filterAccountSlabUpToLimit(slab, cursor.limit)` before ingesting and appending to the bucket journal.
2. **Span-Based Monotonic Progress & Multi-Cursor Persistence (`packages/ethy/src/spine/buckets.ts` & `src/persist/snapStore.ts`):**
   - Update `bucketCursorFraction(bucket)` so that when `bucket.subRanges` is present, progress is computed from the exact remaining 36-bit span `1 - remainingSpan36 / 0x10_0000_0000` (falling back to `bucketPosition36(bucket.currentLastHash)` when a single cursor is active).
   - Persist active `subRanges` in `buckets.json` and restore them in `loadInto` / `loadIntoAsync`.
   - Maintain sorted order (or handle out-of-order sub-range appends in `lookupBinaryAccountByHash`) when sub-ranges within the same nibble append to `accounts/<nibble>.bin`.
3. **10-Peer / 40-Slot High-Concurrency Swarm Test (`packages/ethy/test/multiPeerSwarm.spec.ts`):**
   - Simulate **8 proven `SyntheticSnapPeer` servers** (`maxInFlight = 4` each = `32` concurrent pipeline slots) syncing a 16-bucket trie.
   - Assert that `SnapAccountSynchronizer` dynamically splits buckets so **all 8 peers (`> 16` concurrent requests)** are utilized simultaneously, **zero** duplicate `origin` requests are sent, `computeSnapProgressPct` is strictly monotonic, and all accounts are ingested accurately.

---

## 3. Acceptance Criteria & Verification Gates

- [x] `SnapAccountSynchronizer` uses a unified `SnapRangeCursor` pool (removing `bucketStealReq`, `bucketStealMid`, `bucketStealUpper`, and `flight.steal` special cases).
- [x] Up to 8–10 proven peers (`32+` concurrent in-flight slots) can sync 16 buckets simultaneously via dynamic cursor bisection without idle peer slots or duplicate range requests.
- [x] `bucketCursorFraction` and `computeSnapProgressPct` remain strictly monotonic (`0% → 100%`) under multi-cursor bisection.
- [x] `npm run tsc`, `npm test`, and `npm run spellcheck` pass with 0 errors.

---

## 4. Concrete Implementation Plan (Planner — Grok 4.7)

**D-079 refinements:** one prefix cursor per nibble at start, bisect on demand (`MIN_SPLIT_SPAN = 0x1_0000_0000`); fixed `startHash`/`limitHash` (no mutating bucket `limitHash` for steal); peer faults clear only that cursor’s in-flight state (Law 1 — siblings keep syncing); sorted journals via sticky `accounts/<nibble>.bin` plus `accounts/<nibble>.<origin-hex>.seg` per split-born cursor; discovery hold aligned to 10-peer pool (`VIP_SNAP_PEER_TARGET = 10`, hold at ≥8 serving, sticky at ≥6 while held). Out of scope: WP-04i/WP-04j, code/storage pipelining, response-byte tuning, live Sepolia CI gate.

| Slice | Package / files | Work |
| --- | --- | --- |
| 1 | `ethy` `src/spine/types.ts` | `SnapRangeCursor` + optional `SnapBucket.subRanges`; `journal: 'prefix' \| string` |
| 1 | `ethy` `src/spine/buckets.ts` | Seed one prefix cursor in `createSnapBuckets`; `syncBucketCursorFields`; span-based `bucketCursorFraction` when `subRanges` present; exhausted = empty `subRanges` |
| 2 | `ethy` `src/sync/accountSync.ts` | Remove steal maps + `flight.steal` + mid filters; `InFlightRange` with `cursorId` + sent `origin`/`limit`; `fillPeerSlots` + `splitWidestSubRange`; `filterAccountSlabWithin`; per-cursor verify (drop bucket-wide `verifyingBuckets` gate); `noteRangeFailure` must not stall whole nibble |
| 3 | `ethy` `src/persist/snapStore.ts` | Persist `subRanges` in `buckets.json`; `appendVerifiedSlabAsync(..., journal)`; segment files; multi-file `lookupBinaryAccountByHash`; resume merges file tails into cursors; `nextContractScanBatch` + optional `contract-scan.json` `segment` |
| 4 | `ethy` `src/net/discoveryHold.ts`, `test/p2pReliability.spec.ts` | VIP target 10; hold thresholds 8/6 |
| 5 | `ethy/test/multiPeerSwarm.spec.ts`, `buckets.spec.ts` or `multiPeerSwarm`, `snapPersist.spec.ts` | 8-peer / 32-slot burst; monotonic pct under bisect; two-segment lookup + reload |
| 6 | `.cursor/rules/ethy-architecture.mdc` | Law 4: `SnapRangeCursor` owns limit; in-flight keeps sent limit; reply clipped to cursor limit |

### Scheduler (`fillPeerSlots`)

1. Skip when paused or no pivot; mark bucket `done` when `subRanges` empty.
2. **Free cursor:** `origin <= limit`, no `inFlightReqKey`, not `verifying`; pick by bucket index then origin.
3. For each ranked snap peer not in `peerRestUntil`, while below `maxInFlightForPeer`: assign free cursor, else if `snapResponsesOk >= 2` run `splitWidestSubRange` and assign new cursor; stop when neither applies.
4. **Split:** only when all cursors busy; widest span ≥ `MIN_SPLIT_SPAN`; clamp left `limit = mid`, insert right with `journal =` 16 hex of `incrementKey32(mid)`; left keeps journal binding; flight carries pre-split limit.
5. Dedupe: refuse second in-flight request with same origin bytes.

### Reply path

- `cursor.verifying` only for that cursor; sibling cursors may schedule during proof.
- Clip slab to `[flight.origin, min(flight.limit, cursor.limit)]`.
- Success: advance origin or remove cursor; failure: clear flags, rest peer; `syncBucketCursorFields`; reschedule.

### Persistence resume

- Legacy `buckets.json` without `subRanges`: tail-seek + single prefix cursor at repaired `currentLastHash`.
- With `subRanges`: restore cursors, warm prefix + segment tails, bump origin from file when ahead of saved origin, drop when `origin > limit`; do not collapse pool to prefix tail only.

### Implementer gates

`npm run tsc` and `npm test` in `packages/ethy`; `npm run spellcheck`. No new dependencies; no `@ethereumjs/*` sibling edits.

---

## 5. Implementation Notes & Deviations (Implementer — Composer 2.5)

- **`SnapRangeCursor`** on each nibble bucket with `fillPeerSlots`, `splitWidestSubRange` (bisect even when the left half is in flight), and per-cursor verify; steal maps and mid-slab filters removed.
- **Span math:** inclusive `cursorSpan36` and `bucketCursorFraction` use `hi - lo + 1` so fresh buckets read `0%`, not a floating-point sliver.
- **Persistence:** `subRanges` in `buckets.json`; prefix `.bin` plus `.seg` journals; empty `subRanges` resume; lazy `activeStateRoot` on cold lookup; `drainPendingFlushes()` for tests.
- **Discovery:** `VIP_SNAP_PEER_TARGET = 10`, hold at ≥8 serving, sticky at ≥6 while held.
- **Tests:** 8-peer delayed-reply swarm (`>16` origins, 32 accounts/bucket trie); segment journal persist/lookup; discovery thresholds updated.
