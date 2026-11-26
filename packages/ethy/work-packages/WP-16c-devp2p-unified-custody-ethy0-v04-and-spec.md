# WP-16c: Unified Custody `ETHY/0` `v0.4` Consolidation (`@ethereumjs/devp2p` & `ETHY-0-SPEC.md`)

- **Status:** `DONE`
- **Dependencies:** `WP-16a` (`DONE`), `WP-16b` (`DONE`), `WP-06b` (`DONE`), `WP-11b` (`DONE`), `WP-13` (`DONE`)
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Holistic Scope & Architectural Requirements

### Goal
Consolidate the two-protocol `STATY/0` + `ETHY/0` split into **one unified, custody-sharded DevP2P protocol: `ETHY/0` (`["ethy", 0]`, `v0.4`, `length = 15`)** (Decision **D-144**).

Every Ethy node speaks **one** state protocol (`ethy/0`), uses **one** ENR tag (`"ethy"`), and participates in **one** 16-bucket custody swarm controlled by a single `--custody <1..16>` dial (default `2` = 1/8th of Ethereum for 2× redundancy within `14–20` peers and an 8-node self-sustaining threshold; `--custody 1` for low-disk devices; `--full` = `16`; **no `--custody 0` free-rider mode**). By absorbing on-demand state witnesses (`0x0b`/`0x0c`), targeted single-key chunk lookup (`0x03`), bucket-diverse `ETHY_PEX` (`0x09`/`0x0a`), protocol-level custody reciprocity, and 512-byte root-branch assembly (`0x0d`/`0x0e`) directly into `ETHY/0`, we eliminate duplicate subprotocol plumbing in `@ethereumjs/devp2p` and unlock **Option B (1-hop custody chunk reads, zero `snap/1` cold-miss dependency)** followed seamlessly by **Option C (live subtree tries + `[h_0..h_f]` root assembly = zero `snap/1` forever)**.

---

### Key Deliverables (`WP-16c`)

1. **Extend `ETHY/0` to `v0.4` (`["ethy", 0]`, `length = 15`, codes `0x00`–`0x0e`) in `@ethereumjs/devp2p`:**
   - **Backward-Compatible `0x00 STATUS` (12-tuple):**
     `[protocolVersion(0), chainId, genesisHash, basePivotBlock, basePivotStateRoot, bucketsBitmask, balEarliestBlock, balLatestBlock, latestBlockHash, storageBucketsBitmask, codeBucketsBitmask, trieBucketsBitmask]`
     - Index `11` (`trieBucketsBitmask: uint16`, canonical minimal big-endian integer, `0` = `0x80`): bit `(1 << b)` is `1` **only** when the peer maintains a live `1/16th` subtree MPT for bucket `b` and can generate fresh `#Head` / recent-anchor proofs (`0x0b GET_STATE_WITNESS`) and fresh chunks without `snap/1` (Option C).
     - `parseEthyStatus`: remain backward-compatible with `v0.2` (9-tuple) and `v0.3` (11-tuple) peers (default omitted fields to `0`; ignore extra trailing fields).
   - **Upgrade `0x03 GET_PROVEN_ACCOUNT_CHUNK` for Targeted Single-Key Lookup (Option B 1-Hop Cold Miss):**
     - Wire shape stays `[reqId, bucketIndex, originHash]` — extend `EthyChunkStore.getAccountChunk(bucket, targetHash)` so that if no chunk starts at exact `originHash === targetHash`, the server returns the **unique** chunk in `bucket` satisfying `chunk.originHash <= targetHash <= chunk.lastHash`!
     - This lets an Open-World node resolve a cold `accountHash` in **1 RTT** directly from any bucket-`b` custodian **without first downloading the full bucket manifest (`0x01`/`0x02`)** — and gives k-anonymous range privacy (~500–2,500 neighbor accounts per chunk) for free.
   - **Absorb `0x0b GET_STATE_WITNESS` & `0x0c STATE_WITNESS` into `ETHY/0`:**
     - Reuse the hardened witness codec, strict DoS caps (`MAX_WITNESS_ACCOUNTS = 64`, `MAX_WITNESS_SLOTS = 256`, `MAX_PROOF_NODES_PER_MSG = 4_096`, `MAX_RESPONSE_BYTES = 524_288`, `MAX_ETHY_MESSAGE_BYTES = 2 * 1024 * 1024`), and multi-account `proofNodes[]` merge/deduplication from `WP-16a`.
     - Wire shape:
       - `0x0b GET_STATE_WITNESS`: `[reqId, minAnchorBlock, maxResponseBytes, queries: [[accountHash, [slotHash, ...]], ...]]`
       - `0x0c STATE_WITNESS`: `[reqId, groups: [[anchorBlock, anchorStateRoot, accounts, slots, proofNodes], ...]]`
     - Non-blocking worker server: serves from the node's local witness cache (`EthyWitnessStore`, disk + RAM) **or** invokes an optional synchronous/in-worker proof callback registered by `WP-16f`'s `BucketSubtreeTrie` (never blocks on upstream `snap/1`).
   - **Add `0x0d GET_SUBTREE_ROOTS` & `0x0e SUBTREE_ROOTS` (Option C 512-Byte Root-Branch Gossip):**
     - Lightweight messages carrying `(anchorBlock, bucketIndex, subtreeRootHash32)` entries for the 16 children `[h_0..h_f]` of Ethereum's state trie root branch (`RLP([h_0..h_f, 0x])`, verified via `keccak256(rootNodeRlp) === verifiedHeader(anchorBlock).stateRoot`):
       - `0x0d GET_SUBTREE_ROOTS`: `[reqId, anchorBlock, bucketsBitmask]` (asks a peer for its known `h_b` hashes at `anchorBlock` matching `bucketsBitmask`; `0` = all known).
       - `0x0e SUBTREE_ROOTS`: `[reqId, anchorBlock, entries: [[bucketIndex, subtreeRootHash32], ...]]` (`reqId = 0` for unsolicited gossip announcements at canonical anchor blocks; `entries.length <= 16`; `bucketIndex` in `0..15`, strictly ascending, unique; `subtreeRootHash32` length `32` or `0` for empty nibble).
     - Worker maintains a bounded in-memory ring of recent `(anchorBlock, bucket -> hash)` announcements (e.g. last 16 anchor blocks) so `tryServeEthyGet` answers `0x0d` without blocking and forwards incoming `0x0e` announcements to the main thread (`protocol: 'ethy'`).

2. **Bucket-Aware `ETHY_PEX` (`0x09`/`0x0a`) & Protocol-Level Custody Reciprocity (Anti-Free-Rider):**
   - Extend `0x09 GET_ETHY_PEERS` (backward-compatible optional trailing `desiredBucketsMask: uint16` at index `2`; omitted or `0` = any buckets) and `selectEthyPexPeers` in `packages/devp2p/src/worker/ethyPex.ts`:
     - When `desiredBucketsMask !== 0`, prioritize returning known `ETHY/0` peers whose `(bucketsBitmask & desiredBucketsMask) !== 0` (preferring peers with `trieBucketsBitmask` bits first, then full 3-plane storage+code bits, then freshest `basePivotBlock`), filling remaining slots with `25%` random diversity.
     - **Never advertise `bucketsBitmask === 0` peers in `ETHY_PEX` (`0x0a`)** (non-custodians cannot pollute the discovery mesh).
   - **Two-Tier Custody Reciprocity in `ethyServer.ts` & Inbound Slot Eviction:**
     - **Custodians (`remoteStatus.bucketsBitmask !== 0`, serving `>= 1` bucket):** Full priority on `0x0b GET_STATE_WITNESS` and `0x03`/`0x05` reads, plus protected inbound `ETHY/0` peer slots.
     - **Bootstrap-Only Non-Custodians (`remoteStatus.bucketsBitmask === 0`):** Allowed bounded bulk sync requests (`0x01`/`0x03`/`0x05`) so fresh joiners can bootstrap cleanly from zero, **strictly rate-limited / throttled on ad-hoc `0x0b GET_STATE_WITNESS` queries**, and **evicted first** when inbound peer slots fill up — enforcing custody participation at the protocol level!
   - Extend `NetworkProfile` (`WP-13`) with optional `desiredEthyBucketsMask?: number` so `The Machine` (`WP-16g`) can steer `ETHY_PEX` and dial priority directly toward whichever of the 16 buckets currently lack redundant custodians (`7` peers = 1× coverage under `--custody 2`, `14–20` peers = 2× fault-tolerant redundancy!).

3. **Cleanly Retire Separate `STATY/0` Subprotocol Plumbing in `@ethereumjs/devp2p` (Separate D-008 Upstream Commit):**
   - Remove the duplicate `STATY` subprotocol (`src/protocol/staty.ts`, `src/protocol/staty/*`), `"staty"` ENR tag, `worker/statyPex.ts`, `serve/statyServer.ts`, `staty0` capability, and `minStatyPeers`/`statyDiscoveryTag`/`preferStatyDiscovery` profile fields — keeping and re-homing the hardened witness store/codec/server cleanly under `src/protocol/ethy/` and `src/serve/ethyWitnessStore.ts` alongside `SharedCodeDisk`, `EthyChunkStore`, and `EthyStorageStore`.
   - Keep `WorkerServingSnapshot` clean and unified (`ethyChunksServed`, `ethyStorageServed`, `ethyCodesServed`, `ethyWitnessesServed`, `ethyBytesServed`).
   - Refresh `config/public-api-snapshots/devp2p.json` and ensure `node --test scripts/public-api-snapshot.spec.mjs` passes (`17/17`).

4. **Update `packages/ethy` Imports & `ethereumjs/protocols` Spec Alignment:**
   - Update any `packages/ethy` references to removed `devp2p` `STATY` exports (pointing disk witness reading/writing cleanly to `EthyWitnessStore` / `EthyStatyStore` → `EthyWitnessDiskStore`, while preserving 100% of `WP-16b`'s `verifyStatyMultiProof` / `StatyWriteIndex` / `foldWitnessToHead` / `SharedCodeStore` logic and tests).
   - Update [`protocols/devp2p/ETHY-0-SPEC.md`](../../../../protocols/devp2p/ETHY-0-SPEC.md) to **`v0.4` (Unified Custody `ETHY/0`)** documenting `0x00`–`0x0e`, targeted `0x03` range lookup, bucket-aware `ETHY_PEX`, the `--custody 1..16` model, and the Option B → Option C `1/16th` subtree trie + 512-byte `[h_0..h_f]` root assembly invariant (marking `STATY-0-SPEC.md` as superseded/merged into `ETHY-0-SPEC.md`). *(Separate commit in `ethereumjs/protocols`.)*

5. **Comprehensive `@ethereumjs/devp2p` Test Suite:**
   - `test/protocol/ethy.spec.ts`: all 15 message codes (`0x00`–`0x0e`), `v0.2` (9-tuple) / `v0.3` (11-tuple) / `v0.4` (12-tuple `trieBucketsBitmask`) interoperability, canonical RLP zero (`0x80`), witness proof-node cap rejection, and `SUBTREE_ROOTS` ascending/duplicate/range validation.
   - `test/serve/ethyServer.spec.ts`: targeted `0x03` chunk lookup (`originHash <= targetHash <= lastHash`), `0x0b`/`0x0c` witness serving with `minAnchorBlock` + `maxResponseBytes` + `proofNodes` deduplication, `0x0d`/`0x0e` subtree root serving, and `kind = 0/1/2` storage & shared `code/` serving.
   - `test/worker/ethy-custody-swarm.spec.ts`: 3-node `createThreadedNetwork` integration test verifying bucket-aware `ETHY_PEX` (`desiredBucketsMask`), targeted 1-hop chunk lookup, witness transfer, and subtree root gossip.

---

### Acceptance Criteria (`WP-16c`)
- [x] `ETHY/0` (`["ethy", 0]`, `length = 15`, `0x00`–`0x0e`) is the single unified state subprotocol in `@ethereumjs/devp2p`; duplicate `staty/0` wire plumbing is cleanly removed.
- [x] Targeted `0x03` chunk lookup (`originHash <= targetHash <= lastHash`), `0x0b`/`0x0c` state witness serving, `0x0d`/`0x0e` subtree root gossip, and bucket-aware `ETHY_PEX` work end-to-end in worker-thread tests.
- [x] `devp2p` public API snapshot (`config/public-api-snapshots/devp2p.json`) is updated and `scripts/public-api-snapshot.spec.mjs` passes (`17/17`).
- [x] `npm run tsc`, `npm test`, and `npm run spellcheck` pass in `packages/devp2p` and `packages/ethy`; no new runtime dependencies added.

---

## 2. Concrete Implementation Plan (Planner — Grok 4.7)

Wire contract source of truth: [`protocols/devp2p/ETHY-0-SPEC.md`](../../../../protocols/devp2p/ETHY-0-SPEC.md) `v0.4` (already drafted; verify-only unless implementation finds a mismatch). [`STATY-0-SPEC.md`](../../../../protocols/devp2p/STATY-0-SPEC.md) is already marked superseded.

**Out of scope (later WPs):** `--custody` CLI (WP-16d), client 1-hop resolver (WP-16d), `@ethereumjs/mpt` `BinaryPathMPT` (WP-16e), live `BucketSubtreeTrie` (WP-16f), cockpit / swarm gates (WP-16g). **Preserve WP-16b:** `verifyStatyMultiProof`, `StatyWriteIndex`, `foldWitnessToHead`, `SharedCodeStore`, and `test/statyCryptoCore.spec.ts`.

### 2.1 Design locks

| Topic | Rule |
| --- | --- |
| Single subprotocol | `ETHY.ethy0` → `{ name: 'ethy', version: 0, length: 15 }`. New codes `0x0b`–`0x0e` in `ethy/codes.ts`. Remove `staty/0`, epoch wire messages, `STATY_PEX`, `"staty"` ENR — do not remap onto new codes. |
| `STATUS` | Encode always 12-tuple; index 11 = `trieBucketsBitmask`. Parse 9 / 11 / 12 tuples; omit → `0`. Canonical zero via `intToUnpaddedBytes` / `bigIntToUnpaddedBytes`. |
| `0x03` lookup | `EthyChunkStore.getAccountChunk(bucket, targetHash)`: exact `originHash` first (mem over disk); else covering chunk `origin <= target <= last`, else first chunk (left boundary), else last with `hasRight === 0` (right boundary). Same for `EthyStorageStore.sliceKind1` (kind 1). |
| Witnesses | New `EthyWitnessStore` — witness RAM/disk + `resolveWitnesses` from today's `StatyStore` (drop epoch maps). Caps: 64 accounts, 256 slots, 4096 proof nodes, 524288 response bytes, 2 MiB frame. Reuse `witnesses/<hash>.rlp` on-disk format from `EthyStatyStore`. Optional `setWitnessGenerator` stub for WP-16f; never block on `snap/1`. |
| Subtree gossip | In-worker ring (last 16 anchor blocks, bucket 0..15 → 32-byte hash). `putEthySubtreeRoots` IPC + ingest `0x0e`; serve `0x0d`; forward `0x0e` to main thread. Validate ascending unique `bucketIndex`, `entries.length <= 16`. |
| PEX | Optional `desiredBucketsMask` on `0x09` index 2. Never advertise `bucketsBitmask === 0`. Rank: mask overlap → `trieBucketsBitmask` → storage+code bits → `basePivotBlock`; 75% fresh + 25% random. `0x0a` trailing `trieBucketsBitmask` (short rows = 0). Auto `GET_ETHY_PEERS` uses `NetworkProfile.desiredEthyBucketsMask`. |
| Reciprocity | Remote `bucketsBitmask !== 0`: full serve. `=== 0`: allow `0x01`/`0x03`/`0x05`; throttle `0x0b` (e.g. 2 / 10s → empty `STATE_WITNESS`). RLPx evicts inbound mask-0 ETHY peers before custodians. Remove `minStatyPeers`; keep `minEthyPeers`. |
| DoS | `ETHY` applies 2 MiB frame + proof-node cap on send/receive for `0x04`, `0x06`, `0x0c` (mirror current `STATY` behavior). |

### 2.2 `@ethereumjs/devp2p` file tree (single D-008 commit)

**Protocol & codec**

- `src/protocol/ethy/codes.ts` — `GET_STATE_WITNESS` … `SUBTREE_ROOTS` (`0x0b`–`0x0e`).
- `src/protocol/ethy.ts` — `length: 15`, allow new codes in `sendMessage`, size/proof guards.
- `src/protocol/ethy/codec.ts` — `trieBucketsBitmask`; witness cap exports (rename from staty constants); `countProofNodesInEthyMessage`.

**Stores & serve**

- `src/serve/ethyChunkStore.ts` — `getAccountChunk`; sorted disk `ordered` for binary search.
- `src/serve/ethyStorageStore.ts` — kind-1 covering range.
- **New** `src/serve/ethyWitnessStore.ts` — witness put/resolve/disk (from `statyStore.ts` witness paths only).
- **New** `src/serve/ethySubtreeRootBook.ts` (or `worker/ethySubtreeRoots.ts`) — ring + validation.
- `src/serve/ethyServer.ts` — `0x0b`/`0x0c`/`0x0d`/`0x0e`, targeted `0x03`, PEX mask, reciprocity throttle, witness metric.

**Worker & PEX**

- `src/worker/ethyPex.ts` — store `storageBucketsBitmask`, `codeBucketsBitmask`, `trieBucketsBitmask`; `selectEthyPexPeers(rows, max, mask, rng)`.
- `src/worker/protocol.ts` / `client.ts` — `trieBucketsBitmask` on ETHY status; `putEthyWitness`, `putEthySubtreeRoots`; remove all `Staty*` / `putStaty*` / `sendStatyMessage`; `ethyWitnessesServed` on `WorkerServingSnapshot`; drop `staty*` serve counters; optional `ethyWitnessDir` (replaces `statyDataDir`).
- `src/worker/host.ts` — rip STATY handshake/serve/PEX; wire witness store, subtree book, mask on auto-PEX.

**Discovery & profile**

- `src/types.ts` — `desiredEthyBucketsMask` on `NetworkProfile`; remove `minStatyPeers`, `statyDiscoveryTag`, `preferStatyDiscovery`, `ProtocolType.STATY`.
- `src/rlpx/rlpx.ts` — mask-0 ETHY eviction; remove staty peer reserve.
- `src/dpt/*`, `src/dns/enrPeerFields.ts`, `src/discovery/metrics.ts`, `src/lab/capabilities.ts` — drop `staty0`, staty ENR helpers.

**Public API**

- `src/index.ts`, `src/protocol/index.ts` — export `EthyWitnessStore`; remove `STATY`, `StatyStore`, `tryServeStatyGet`.

**Delete**

- `src/protocol/staty.ts`, `src/protocol/staty/*`, `src/serve/statyServer.ts`, `src/serve/statyStore.ts`, `src/worker/statyPex.ts`.
- Tests: `test/protocol/staty.spec.ts`, `test/serve/staty*`, `test/worker/staty-swarm.spec.ts`.

**Snapshot**

- `config/public-api-snapshots/devp2p.json` — refresh; `node --test scripts/public-api-snapshot.spec.mjs` (`17/17`).

### 2.3 Tests (same devp2p commit)

| File | Coverage |
| --- | --- |
| `test/protocol/ethy.spec.ts` | All 15 codes; STATUS 9/11/12-tuple; canonical `0x80`; proof cap; subtree validation |
| `test/serve/ethyServer.spec.ts` | Targeted `0x03` (exact, interior, boundaries, miss); kind-1 cover; witness budget, proof deduplication, throttle; subtree; storage/code kinds |
| `test/serve/ethyPex.spec.ts` | `desiredBucketsMask`, trie rank, no mask-0 rows |
| **New** `test/worker/ethy-custody-swarm.spec.ts` | 3-node loopback: PEX mask, targeted chunk, witness, subtree gossip |
| `test/rlpx/ethyPeerReserve.spec.ts` | Mask-0 eviction (drop staty reserve cases) |

### 2.4 `packages/ethy` (follow-up commit only if types break)

No `STATY` imports today. Fix `WorkerServingSnapshot` / `NetworkProfile` literals if devp2p removes `staty*` fields. Keep `src/staty/*` crypto and tests. Optional one-line comment on `EthyStatyStore` that epoch bundles are local-only until later cleanup.

### 2.5 Finish gates

`packages/devp2p`: `npm run tsc`, `npm test`, spellcheck. `packages/ethy`: `npm run tsc`, `test/statyCryptoCore.spec.ts` if touched. No new runtime dependencies.

### 2.6 Commit split

1. This WP / PROGRESS planning doc (ethy repo path only).
2. One `@ethereumjs/devp2p` commit (implementation + tests + snapshot).
3. `packages/ethy` only if worker types force it.
4. `ethereumjs/protocols` only if spec text must change.

---

## 3. Implementation Notes & Deviations (Implementer — Composer 2.5 & Coordinator Review — Gemini 4 Neon)

- **Shipped (`b95ddf588`, `de58c53f8`, plus Coordinator review hardening D-147):**
  - Unified `ETHY/0` `v0.4` (`["ethy", 0]`, `length = 15`, `0x00`–`0x0e`) in `@ethereumjs/devp2p` and cleanly retired duplicate `staty/0` wire plumbing (`src/protocol/staty*`, `src/serve/staty*`, `src/worker/statyPex.ts`, `"staty"` ENR tag, `staty0` capability, `minStatyPeers`).
  - Refreshed `config/public-api-snapshots/devp2p.json` (`scripts/public-api-snapshot.spec.mjs` `17/17` green).
  - **Coordinator Review Hardening (D-147):**
    1. **`EthySubtreeRootBook`:** Preserved 0-byte empty nibble hashes (`0x80` = `new Uint8Array(0)`) instead of converting to 32 zero bytes; accepted valid empty `0x0e` responses (`[]`) separately from malformed entries.
    2. **`EthyWitnessStore`:** Enforced strictly ascending `accounts[]` and `(accountHash, slotHash)` `slots[]` sorting + deduplication per `ETHY-0-SPEC.md` `v0.4`, bounded per-account anchor retention (`MAX_RECORDS_PER_ACCOUNT = 8`), and wired the optional synchronous `setWitnessGenerator` seam for `WP-16f`.
    3. **`ethyPex.ts`:** Replaced fragile weighted sum (`basePivotBlock * 1e6 + lastSeenSec`, which let epoch timestamps/1-block gaps override bucket overlap) with an exact lexicographic comparator (`desiredBucketsMask` overlap → `trieBucketsBitmask` overlap → 3-plane coverage → exact `bigint` `basePivotBlock` → `lastSeenSec`).
    4. **`EthyStorageStore.sliceKind1`:** Fixed inverted `complete` right-boundary exclusion (`complete === true` returns right boundary with `hasRight = 0`; `complete === false` returns `undefined`) and included `slot[i - 1]` on gap misses so returned `[originSlotHash .. lastSlotHash]` covers `target` for Merkle range exclusion proofs.
    5. **RLPx Reciprocity & DoS Hardening:** Ensured `_trimSurplusPeers` and `_enforceEthyPeerReserve` protect only custodian ETHY peers (`bucketsBitmask !== 0`) under `minEthyPeers` and evict mask-0 peers first; enforced outbound `MAX_ETHY_PROOF_NODES` and inbound unknown-code disconnect in `ETHY`; hardened `tryServeEthyGet` against malformed non-`Uint8Array` fields; cleaned `_ethyWitnessThrottles` and `_ethyPexSent` on `peer:removed`.
    6. **End-to-End 3-Node Custody Swarm Test:** Expanded `test/worker/ethy-custody-swarm.spec.ts` to cover 3-node loopback bucket-aware `ETHY_PEX`, targeted `0x03` single-key chunk lookup, `0x0b`/`0x0c` witness serving, and `0x0d`/`0x0e` subtree root serving.
