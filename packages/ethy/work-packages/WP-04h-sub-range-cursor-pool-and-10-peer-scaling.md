# WP-04h: General `N`-Way Sub-Range Cursor Pool & 10-Peer Dynamic Work-Stealing (`@ethereumjs/ethy`)

- **Status:** `READY_FOR_PLANNING`
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

- [ ] `SnapAccountSynchronizer` uses a unified `SnapRangeCursor` pool (removing `bucketStealReq`, `bucketStealMid`, `bucketStealUpper`, and `flight.steal` special cases).
- [ ] Up to 8–10 proven peers (`32+` concurrent in-flight slots) can sync 16 buckets simultaneously via dynamic cursor bisection without idle peer slots or duplicate range requests.
- [ ] `bucketCursorFraction` and `computeSnapProgressPct` remain strictly monotonic (`0% → 100%`) under multi-cursor bisection.
- [ ] `npm run tsc`, `npm test`, and `npm run spellcheck` pass with 0 errors.

---

## 4. Concrete Implementation Plan (Planner — Grok 4.7)

*(To be filled out by Grok 4.7 during the Planning pass.)*

---

## 5. Implementation Notes & Deviations (Implementer — Composer 2.5)

*(To be filled out by Composer 2.5 after implementation and verification.)*
