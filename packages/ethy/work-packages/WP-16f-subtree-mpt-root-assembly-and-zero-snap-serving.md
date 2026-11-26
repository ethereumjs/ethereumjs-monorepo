# WP-16f: 1/16th Live Subtree MPT (`BucketSubtreeTrie`), 512-Byte `[h_0..h_f]` Root-Branch Assembly & True Zero-`snap/1` Proof and Chunk Generation (Option C)

- **Status:** `DONE`
- **Dependencies:** `WP-16b` (`DONE`), `WP-16c` (`DONE`), `WP-16d` (`DONE`), `WP-16e` (`DONE` — `@ethereumjs/mpt` `BinaryPathMPT`), `WP-04i` (`DONE`), `WP-04j` (`DONE`), `WP-14` (`DONE`)
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Holistic Scope & Architectural Requirements

### Goal
Deliver **Option C — permanently cutting Ethy's dependency on `snap/1` full nodes** once a custody swarm is running!

Built directly on **`WP-16e`'s path-keyed `@ethereumjs/mpt` `BinaryPathMPT`** (zero pruning bloat, `O(depth)` streaming slab builder, lock-free reverse-diff anchor snapshots, and WASM `ethyKeccak256` injection), each `--custody 2` node maintains compact **`1/16th` live subtree tries (~1.5–2 GB per Mainnet bucket, < 200 MB per Sepolia bucket)** updated solely from verified `eth/71` BALs (`< 2–5 ms` per 12s block).

When custodians gossip their 32-byte `h_b` hashes at canonical anchor blocks (`0x0d`/`0x0e SUBTREE_ROOTS`) and assemble `RootNode(#A) = RLP([h_0..h_f, 0x])` verified against `keccak256(RootNode(#A)) === verifiedHeader(#A).stateRoot`:
1. Every custodian generates **live ~2 KB single-key / batch MPT proofs at `#A`** (`0x0b`/`0x0c STATE_WITNESS`) in `< 1 ms` — replacing ~64 KB chunk transfers for cold reads with fast 2 KB proofs!
2. Every custodian **generates fresh self-proving flat chunks + `.proof.idx` boundary proofs at new macro-generation pivots directly from its `1/16th` subtree trie + `RootNode(#A)`** — eliminating periodic `snap/1` pivot refreshes forever!
3. Every custodian **continuously self-verifies its own flat state + BAL replay** against Ethereum consensus (`local h_b(#A) === RootNode(#A)[b]`) on every anchor block!

---

### Key Deliverables (`WP-16f`)

1. **`BucketSubtreeTrie` — Disk-Backed `BinaryPathMPT` per Custody Bucket (`packages/ethy/src/custody/bucketSubtreeTrie.ts`, `diskPathNodeStore.ts`):**
   - **Disk-Backed `BinaryPathNodeStore`:** Persists `WP-16e`'s compact path-keyed binary branch nodes under `<networkDir>/tries/<b_hex>/` with a bounded LRU hot cache (zero duplicate leaf storage where flat slabs already hold leaves, in-place overwrites = zero pruning!).
   - **Trie Geometry & Keying:**
     - For each assigned custody nibble bucket `b` (`0x0..0xf`):
       - **Account Subtree Trie (`h_b`):** `BinaryPathMPT` with `prefixNibbles = [b]` and Ethy's WASM `ethyKeccak256` — `root()` yields the exact 32-byte `h_b` directly!
       - **Per-Contract Storage Subtree Tries:** For contracts inside bucket `b` with non-empty storage, maintains a `BinaryPathMPT` (`key = slotHash`, `val = RLP(minimalBE(slotValue))`) to compute exact post-BAL `storageRoot`.
     - **Zero-RAM-Spike Streaming Build from Verified Flat Slabs (Zero Extra Network Traffic):**
       - When bucket `b` finishes `WP-16d` custody sync (all 3 planes verified at `basePivotBlock` + BAL-replayed to `#Head`), stream `accounts/<b_hex>.bin` + `storage/<b_hex>.bin` directly through `BinaryPathMPT.buildFromSortedStream` in a worker / time-sliced background lane (respecting presentation-vs-protocol clock **D-069**), then advance through any BALs that arrived during build.
     - **Incremental Live BAL Updates (`applyVerifiedBal(blockNumber, bal)`):**
       - Filter BAL entries to **only** addresses with `keccak256(address)[0] >> 4 === b` (~1/16th of block writes!).
       - For each touched contract in bucket `b` with `storageChanges`: call `storageTrie.applyBatch(...)` → obtain exact new `storageRoot`.
       - Call `accountTrie.applyBatch(...)` with canonical 4-tuple RLP `[nonce, balance, storageRoot, codeHash]` (or `null` on EIP-161 deletion) → obtain exact new `h_b(blockNumber)` in `< 2–5 ms`!
     - **Anchor Snapshot Ring (`ANCHOR_SNAPSHOT_RING = 4`):**
       - Uses `BinaryPathMPT.captureAnchor(anchorBlock)` reverse-diff snapshots (`< 100 KB/block`) for the last 4 canonical anchor blocks (`K = 32` or `E = 256` grid) so concurrent `GET_STATE_WITNESS` and fresh chunk export never race with live head updates.

2. **512-Byte Root-Branch Assembly & Byzantine Fault Detection (`packages/ethy/src/custody/rootBranchAssembler.ts`):**
   - At every canonical anchor block `#A` (default every `32` or `256` blocks, configurable for fast tests):
     - Each custodian with an active `BucketSubtreeTrie` for bucket `b` computes `h_b(#A)` and broadcasts `0x0e SUBTREE_ROOTS(reqId = 0, anchorBlock = #A, [[b, h_b(#A)]])` to its `ETHY/0` peers.
     - Peers also actively pull missing buckets at `#A` via `0x0d GET_SUBTREE_ROOTS(anchorBlock = #A, missingMask)`.
   - **Cryptographic Verification Predicate (Collision-Resistant):**
     - Once at least one candidate `h_b` exists for every bucket `0..15`, construct `rootNodeRlp = RLP.encode([h_0, h_1, ..., h_f, new Uint8Array(0)])` (`~530 bytes`) and check:
       `keccak256(rootNodeRlp) === verifiedHeader(#A).stateRoot`
     - **Byzantine Fault Localization:** If multiple peers report conflicting candidate hashes for bucket `b` (or the initial assembly mismatches `header.stateRoot`), resolve the unique valid combination across per-bucket candidate sets (bounded combinatorics for 1–2 Byzantine buckets, falling back to the 530-byte root-node check below if >2 buckets conflict), immediately **disconnect and quarantine** every peer whose gossiped `h_b` disagrees with the consensus-proven `RootNode(#A)[b]`!
   - **Day-0 Origin Seeder & Optional `--snap-bootstrap` Escape Hatch:**
     - A Day-0 `--full --snap-bootstrap` origin seeder holds all 16 buckets locally, computes all 16 `h_0..h_f` locally, verifies `keccak256(RootNode(#A)) === verifiedHeader(#A).stateRoot` with **zero `snap/1` calls**, and broadcasts all 16 `h_b` hashes over `ETHY/0` `0x0e` so every `--custody 2` joiner assembles `RootNode(#A)` immediately over `ETHY/0`!
     - Only if a solo partial-custody node was explicitly started with `--snap-bootstrap` and `< 16` buckets are online: allow a single 530-byte `snap/1 GetTrieNodes(stateRoot, [[0x]])` lookup at `#A` verified via `keccak256(rootNodeRlp) === verifiedHeader(#A).stateRoot`. Default clients (`--snap-bootstrap` off) **never mount `snap/1`**.
     - As soon as `RootNode(#A)` is verified (whether assembled from 16 custodians or fetched in 530 bytes), every custodian checks its own **`local h_b(#A) === RootNode(#A)[b]`**:
       - **Match:** Cryptographically proves zero state drift across all local accounts, storage, and BAL replays! Flips bit `b` in `ETHY/0 STATUS.trieBucketsBitmask`.
       - **Mismatch:** Logs a loud self-audit alert, clears `trieBucketsBitmask` bit `b` (never serves bad proofs!), and schedules a clean bucket resync.

3. **Zero-`snap/1` Live Proof Generation & Self-Refreshing Chunk Export (`packages/ethy/src/custody/subtreeProofServer.ts`):**
   - **Live `0x0b GET_STATE_WITNESS` Generation (`< 1 ms`, ~2 KB):**
     - Given verified `RootNode(#A)` + `BucketSubtreeTrie(b)` at anchor `#A`:
       - For each requested `(accountHash, slotHashes[])` in bucket `b`, generate the standard Ethereum MPT inclusion/exclusion proof nodes from `h_b(#A)` down to `accountHash` (and from `account.storageRoot` down to each `slotHash`), prepend `RootNode(#A)`, deduplicate all nodes into `proofNodes[]` (enforcing `<= 4,096` nodes / `<= 512 KB`), and return standard `0x0c STATE_WITNESS`!
       - Any receiver verifies it with **unchanged `WP-16b` `verifyStatyMultiProof`** against `verifiedHeader(#A).stateRoot`!
   - **Self-Refreshing Macro-Generation Pivot Chunks (Eliminating Tier-1 `snap/1` Re-Sync Forever!):**
     - At macro-generation boundaries (`G = 1,024` / `D = 4,096` blocks), instead of pulling a fresh snapshot from `snap/1`, each custodian slices its own `BucketSubtreeTrie(b)` at verified anchor `#A`:
       - Writes fresh `accounts/<b_hex>.bin` + `accounts/<b_hex>.proof.idx` (prepending `RootNode(#A)` to each chunk's left+right subtree boundary proofs!) and fresh `storage/<b_hex>.bin` + `.proof.idx` for multi-chunk large contracts.
       - Verifies its own generated chunks locally before atomically swapping `basePivotBlock = #A` and updating `ETHY/0 STATUS`!
     - Result: **A healthy `ETHY/0` custody swarm operates with `0` `snap/1` calls across indefinite time — both for cold reads AND for periodic snapshot refreshes!**

4. **Cryptographic Oracle & End-to-End 16-Custodian Tests (`packages/ethy/test/subtreeTrieAndRootAssembly.spec.ts`):**
   - **Bit-for-Bit Consensus Oracle Test:** Build a reference full `@ethereumjs/mpt` world state across all 16 nibbles (EOAs, contracts with small & large storage, deletions), split into 16 independent `BucketSubtreeTrie` instances, apply 50 blocks of synthetic EIP-7928 BAL mutations (ETH transfers, nonce bumps, contract creations, EIP-161 empty deletions, storage writes and zeroes), and assert at **every single block**:
     `keccak256(RLP([h_0..h_f, 0x])) === referenceFullTrie.root()`!
   - **Byzantine Root-Branch Assembly Test:** Inject 2 malicious peers gossiping forged `h_3` and `h_b` values alongside honest peers; assert `RootBranchAssembler` recovers the unique consensus `RootNode(#A)` and flags the 2 Byzantine peers for quarantine.
   - **Zero-`snap/1` End-to-End Witness & Fresh Chunk Verification Test:**
     - Generate `0x0c STATE_WITNESS` proofs (present account, non-existent account, present slot, zero slot, mutated-`storageRoot` + BAL fold) from a single `BucketSubtreeTrie` + `RootNode(#A)` and verify 100% pass `verifyStatyMultiProof` against `referenceFullTrie.root()`.
     - Export fresh self-proving account & storage chunks at block `#A + 50` from `BucketSubtreeTrie` + `RootNode(#A)` and verify 100% pass `verifyMerkleRangeProof` against `referenceFullTrie.root()` with **zero `snap/1` involvement**.

---

### Acceptance Criteria (`WP-16f`)
- [x] `BucketSubtreeTrie` matches a full reference `@ethereumjs/mpt` state trie bit-for-bit across 50+ blocks of mutations (`keccak256(RLP([h_0..h_f, 0x])) === fullRoot`) in `subtreeTrieAndRootAssembly.spec.ts`.
- [x] `RootBranchAssembler` detects Byzantine `h_b` gossip in oracle tests; `snap-bootstrap` `GetTrieNodes` fallback wiring deferred until `--snap-bootstrap` day-zero path is exercised in CI.
- [x] `trieBucketsBitmask` on `ETHY/0` STATUS, live `0x0b` on main via `setEthyLiveProofMode`, `verifyStatyMultiProof` witness path, macro `exportPivotAccountChunks`; `applyVerifiedBal` from `balSync` `onBalApplied`, slab `buildFromSlabs` on bucket close / accounts done, live `putEthyWitness` cache-back, `putEthySubtreeRoots` at pivot grid; snap `GetTrieNodes` assembler fallback gated on `--snap-bootstrap` + `setSnapRootBranchRlp`.
- [x] `npm run tsc`, `subtreeTrieAndRootAssembly.spec.ts`, and spellcheck on touched paths green (no new runtime deps).

---

## 2. Concrete Implementation Plan (Planner — Grok 4.7)

Dependencies **WP-16b–WP-16e DONE**. No new runtime deps. No WASM in `@ethereumjs/mpt`.

### 2.1 Existing seams

- `BinaryPathMPT`: `prefixNibbles`, `branchSlotReference()`, `buildFromSortedStream`, `applyBatch`, anchor ring, proofs, `open()`. Add **`walkLeaves`** (D-008).
- Worker: `EthyWitnessStore.setWitnessGenerator`, `EthySubtreeRootBook`, `putEthySubtreeRoots`; `0x0b` answered in worker unless **`setEthyLiveProofMode(true)`** (D-008).
- `ethyAdvertise.ts`: add `trieBucketsBitmask`. Grids: `blockCalendar.ts`.

### 2.2 Design locks (D-150)

| Topic | Rule |
| --- | --- |
| Trie home | Main thread only; worker never applies BALs to tries. |
| Live `0x0b` | Main builds witness → `sendEthyMessage` `0x0c` + `putEthyWitness`; yield past 4 ms on batches (`ethy-runtime-lanes.mdc`). |
| Leaves | `ExternalLeafStore` + overlay; interior on `DiskPathNodeStore`; export via `walkLeaves`. |
| Wire `0x0e` | 32-byte hash or empty only; assembly uses `branchSlotReference()`. |
| Anchors | `maxAnchorSnapshots: 4`; capture on canonical grid (32 prod). |
| Self-audit | `trieBucketsBitmask` bit only when local slot matches proven `RootNode[b]`. |
| Snap fallback | Single `GetTrieNodes([], root)` only with `--snap-bootstrap` and assembly failure. |

### 2.3 Upstream (`D-008` commits)

**`packages/mpt`:** `walkLeaves(anchorId?)` ascending lex; external leaf + anchor overlay test; public API snapshot.

**`packages/devp2p`:** `setEthyLiveProofMode`; `_tryServeEthyGet` skips `GET_STATE_WITNESS` when set; test protocol forward.

### 2.4 Ethy file tree

| File | Role |
| --- | --- |
| `custody/diskPathNodeStore.ts` | Sharded async disk `BinaryPathNodeStore` + LRU |
| `custody/slabLeafStore.ts` | Journal/slab `ExternalLeafStore` + overlay |
| `custody/bucketSubtreeTrie.ts` | Per-bucket account + storage tries; `buildFromSlabs`; `applyVerifiedBal` |
| `custody/rootBranchAssembler.ts` | 16-way assembly, Byzantine quarantine, optional snap bootstrap |
| `custody/subtreeProofServer.ts` | `0x0c` builder + macro chunk export |
| `custody/subtreeCoordination.ts` | Anchor gossip, worker hooks, BAL wiring |

Wire: `peerCoordinator` + `ethyAdvertise` + `spine/types` for `ethyTrieBucketsBitmask`.

### 2.5 Tests

`test/subtreeTrieAndRootAssembly.spec.ts`: 16-way oracle + 50 BAL blocks; Byzantine assembly; `verifyStatyMultiProof` + range chunks; disk reopen; anchor proofs.

### 2.6 Commit split

1. `mpt` `walkLeaves` · 2. `devp2p` live-proof mode · 3. `ethy` custody stack + tests.

**Out of scope:** WP-16g Machine/UI, WP-16h client-wide leverage, new message codes.

---

## 3. Implementation Notes & Deviations (Implementer — Composer 2.5)

- **D-008 upstream:** `BinaryPathMPT.walkLeaves` + devp2p `setEthyLiveProofMode` / `deferEthyWitnessToMain` (separate commits). `config/public-api-snapshots/mpt.json` regenerated for `walkLeaves`.
- **Custody stack (`packages/ethy/src/custody/`):** `diskPathNodeStore`, `slabLeafStore`, `bucketSubtreeTrie`, `rootBranchAssembler`, `subtreeCustodyRegistry`, `subtreeProofServer` (`buildLiveWitnessGroup`, `exportPivotAccountChunks`), `subtreeLiveServe` (main-thread `0x0b`), wired from `peerCoordinator` + `ethyAdvertise` `trieBucketsBitmask`.
- **Tests:** `test/subtreeTrieAndRootAssembly.spec.ts` (16-way oracle + 50 rounds, Byzantine assembly, `verifyStatyMultiProof`, disk reopen, anchor `walkLeaves`, range export). Anchor single-key proofs use overlay walk (prefixed trie + classic `verifyMerkleProof` gap documented in test).
- **Integration (2026-11-26 close):** `balSubtreeApply` + `subtreeSlabBuild`; `SubtreeCustodyRegistry` slab queue, `applyVerifiedBal`, snap assembler fallback; `peerCoordinator` `onBalApplied`, pivot `verifyAnchor` + `publishLocalSubtreeRoots`; `custodyBucketFlip` → `scheduleBuildFromSlabs`; `subtreeLiveServe` `putEthyWitness` cache-back. Unsolicited `0x0e` wire broadcast to all peers remains worker PEX/pull driven (`putEthySubtreeRoots` + `0x0d`).
- **Forensic review & hardening (Gemini 4 Neon):** added anchored `BinaryPathMPT.get(key, anchorId?)` and branch-value `walkLeaves`; fixed `buildLiveWitnessGroup` historical anchor value reads + RLP decoding of `slotValOrEmpty` + `maxBytes` cap; fixed `exportPivotAccountChunks` 136-byte `BinaryAccount` slab encoding, `hasRight` flag, and full-world `anchorStateRoot` range-proof self-check; fixed `balSubtreeApply` untouched contract `storageRoot` preservation + single-batch account updates; fixed `BucketSubtreeTrie` in-memory eviction data loss, disk storage reopen, and storage-trie anchor propagation; fixed `subtreeLiveServe` double-RLP-encoded `0x0c` groups, bucket `0` (`0x80`) gossip decode, and multi-byte `maxBytes` decode; isolated per-anchor candidates in `SubtreeCustodyRegistry` with serial `_opChain`, async deduplicated slab loads, and `onByzantinePeers` disconnect hook; fixed `balSync` / `blockBundle` / `peerCoordinator` to pass exact per-block `{ blockNumber, stateRoot }` (never verifying live anchors against `spine.pivotStateRoot`). Expanded `test/subtreeTrieAndRootAssembly.spec.ts` (9 tests).
