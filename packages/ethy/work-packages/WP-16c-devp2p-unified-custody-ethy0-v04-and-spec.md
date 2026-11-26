# WP-16c: Unified Custody `ETHY/0` `v0.4` Consolidation (`@ethereumjs/devp2p` & `ETHY-0-SPEC.md`)

- **Status:** `READY_FOR_PLANNING`
- **Dependencies:** `WP-16a` (`DONE`), `WP-16b` (`DONE`), `WP-06b` (`DONE`), `WP-11b` (`DONE`), `WP-13` (`DONE`)
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Holistic Scope & Architectural Requirements

### Goal
Consolidate the two-protocol `STATY/0` + `ETHY/0` split into **one unified, custody-sharded DevP2P protocol: `ETHY/0` (`["ethy", 0]`, `v0.4`, `length = 15`)** (Decision **D-144**).

Every Ethy node speaks **one** state protocol (`ethy/0`), uses **one** ENR tag (`"ethy"`), and participates in **one** 16-bucket custody swarm controlled by a single `--custody <0..16>` dial (default `1` = 1/16th of Ethereum; `--full` = `16`). By absorbing on-demand state witnesses (`0x0b`/`0x0c`), targeted single-key chunk lookup (`0x03`), bucket-diverse `ETHY_PEX` (`0x09`/`0x0a`), and 512-byte root-branch assembly (`0x0d`/`0x0e`) directly into `ETHY/0`, we eliminate duplicate subprotocol plumbing in `@ethereumjs/devp2p` and unlock **Option B (1-hop custody chunk reads, zero `snap/1` cold-miss dependency)** followed seamlessly by **Option C (1/16th live subtree tries + `[h_0..h_f]` root assembly = zero `snap/1` forever)**.

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
     - Non-blocking worker server: serves from the node's local witness cache (`EthyWitnessStore`, disk + RAM) **or** invokes an optional synchronous/in-worker proof callback registered by `WP-16e`'s `BucketSubtreeTrie` (never blocks on upstream `snap/1`).
   - **Add `0x0d GET_SUBTREE_ROOTS` & `0x0e SUBTREE_ROOTS` (Option C 512-Byte Root-Branch Gossip):**
     - Lightweight messages carrying `(anchorBlock, bucketIndex, subtreeRootHash32)` entries for the 16 children `[h_0..h_f]` of Ethereum's state trie root branch (`RLP([h_0..h_f, 0x])`, verified via `keccak256(rootNodeRlp) === verifiedHeader(anchorBlock).stateRoot`):
       - `0x0d GET_SUBTREE_ROOTS`: `[reqId, anchorBlock, bucketsBitmask]` (asks a peer for its known `h_b` hashes at `anchorBlock` matching `bucketsBitmask`; `0` = all known).
       - `0x0e SUBTREE_ROOTS`: `[reqId, anchorBlock, entries: [[bucketIndex, subtreeRootHash32], ...]]` (`reqId = 0` for unsolicited gossip announcements at canonical anchor blocks; `entries.length <= 16`; `bucketIndex` in `0..15`, strictly ascending, unique; `subtreeRootHash32` length `32` or `0` for empty nibble).
     - Worker maintains a bounded in-memory ring of recent `(anchorBlock, bucket -> hash)` announcements (e.g. last 16 anchor blocks) so `tryServeEthyGet` answers `0x0d` without blocking and forwards incoming `0x0e` announcements to the main thread (`protocol: 'ethy'`).

2. **Bucket-Aware `ETHY_PEX` (`0x09`/`0x0a`) for 1-Hop 16/16 Swarm Coverage:**
   - Extend `0x09 GET_ETHY_PEERS` (backward-compatible optional trailing `desiredBucketsMask: uint16` at index `2`; omitted or `0` = any buckets) and `selectEthyPexPeers` in `packages/devp2p/src/worker/ethyPex.ts`:
     - When `desiredBucketsMask !== 0`, prioritize returning known `ETHY/0` peers whose `(bucketsBitmask & desiredBucketsMask) !== 0` (preferring peers with `trieBucketsBitmask` bits first, then full 3-plane storage+code bits, then freshest `basePivotBlock`), filling remaining slots with `25%` random diversity.
   - Extend `NetworkProfile` (`WP-13`) with optional `desiredEthyBucketsMask?: number` so `The Machine` (`WP-16f`) can steer `ETHY_PEX` and dial priority directly toward whichever of the 16 buckets currently have `0` connected custodians!

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
- [ ] `ETHY/0` (`["ethy", 0]`, `length = 15`, `0x00`–`0x0e`) is the single unified state subprotocol in `@ethereumjs/devp2p`; duplicate `staty/0` wire plumbing is cleanly removed.
- [ ] Targeted `0x03` chunk lookup (`originHash <= targetHash <= lastHash`), `0x0b`/`0x0c` state witness serving, `0x0d`/`0x0e` subtree root gossip, and bucket-aware `ETHY_PEX` work end-to-end in worker-thread tests.
- [ ] `devp2p` public API snapshot (`config/public-api-snapshots/devp2p.json`) is updated and `scripts/public-api-snapshot.spec.mjs` passes (`17/17`).
- [ ] `npm run tsc`, `npm test`, and `npm run spellcheck` pass in `packages/devp2p` and `packages/ethy`; no new runtime dependencies added.

---

## 2. Concrete Implementation Plan (Planner — Grok 4.7)

*(To be filled out by Grok 4.7 before implementation begins.)*

---

## 3. Implementation Notes & Deviations (Implementer — Composer 2.5)

*(To be filled out by Composer 2.5 upon completion.)*
