# WP-16e: 1/16th Live Subtree MPT, 512-Byte `[h_0..h_f]` Root-Branch Assembly & True Zero-`snap/1` Proof and Chunk Generation (Option C)

- **Status:** `READY_FOR_PLANNING`
- **Dependencies:** `WP-16b` (`DONE`), `WP-16c` (`READY_FOR_PLANNING`), `WP-16d` (`READY_FOR_PLANNING`), `WP-04i` (`DONE`), `WP-04j` (`DONE`), `WP-14` (`DONE`)
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Holistic Scope & Architectural Requirements

### Goal
Deliver **Option C — permanently cutting Ethy's dependency on `snap/1` full nodes** once a custody swarm is running!

By exploiting Ethereum's 16-way MPT root geometry — the state trie root is always a 16-way branch node `RootNode = RLP([h_0, h_1, ..., h_f, 0x])` where `h_b` depends **exclusively** on the accounts and storage inside nibble bucket `b` — each `--custody 1` node maintains a compact **`1/16th` live subtree trie (~3–4 GB on Mainnet, < 300 MB on Sepolia)** updated solely from verified `eth/71` BALs (`< 2–5 ms` per 12s block via WASM `ethyKeccak256`).

When custodians gossip their 32-byte `h_b` hashes at canonical anchor blocks (`0x0d`/`0x0e SUBTREE_ROOTS`) and assemble `RootNode(#A) = RLP([h_0..h_f, 0x])` verified against `keccak256(RootNode(#A)) === verifiedHeader(#A).stateRoot`:
1. Every custodian generates **live ~2 KB single-key / batch MPT proofs at `#A`** (`0x0b`/`0x0c STATE_WITNESS`) in `< 1 ms` — replacing ~64 KB chunk transfers for cold reads with fast 2 KB proofs!
2. Every custodian **generates fresh self-proving flat chunks + `.proof.idx` boundary proofs at new macro-generation pivots directly from its `1/16th` subtree trie + `RootNode(#A)`** — eliminating periodic `snap/1` pivot refreshes forever!
3. Every custodian **continuously self-verifies its own flat state + BAL replay** against Ethereum consensus (`local h_b(#A) === RootNode(#A)[b]`) on every anchor block!

---

### Key Deliverables (`WP-16e`)

1. **`BucketSubtreeTrie` — Compact 1/16th Account & Storage MPT (`packages/ethy/src/custody/bucketSubtreeTrie.ts`):**
   - **Trie Geometry & Keying:**
     - For each assigned custody nibble bucket `b` (`0x0..0xf`):
       - **Account Subtree Trie (`h_b`):** Keyed by the remaining **63 nibbles** (`accountHash` after stripping high nibble `b`, or full 32-byte `accountHash` inside a `@ethereumjs/mpt` trie whose root branch child `[b]` is `h_b` — planner picks cleanest path-keyed or hash-keyed disk layout using `@ethereumjs/mpt` with `useKeyHashing: false` and Ethy's WASM `ethyKeccak256`!).
       - **Per-Contract Storage Subtree Tries:** For contracts inside bucket `b` with non-empty storage, maintains their storage MPT (`key = slotHash`, `val = RLP(minimalBE(slotValue))`, `useKeyHashing: false`) to compute exact post-BAL `storageRoot`.
     - **Build from Verified Flat Slabs (Zero Extra Network Traffic):**
       - When bucket `b` finishes `WP-16d` custody sync (all 3 planes verified at `basePivotBlock` + BAL-replayed to `#Head`), build bucket `b`'s account and storage subtree tries directly from `accounts/<b_hex>.bin` + `storage/<b_hex>.bin` in a bounded background worker / time-sliced lane (respecting presentation-vs-protocol clock **D-069**), then advance through any BALs that arrived during build.
     - **Incremental Live BAL Updates (`applyVerifiedBal(blockNumber, bal)`):**
       - Filter BAL entries to **only** addresses with `keccak256(address)[0] >> 4 === b` (~1/16th of block writes!).
       - For each touched contract in bucket `b` with `storageChanges`: update its storage trie (putting `RLP(postVal)` for non-zero, deleting for `0`) → obtain exact new `storageRoot`.
       - Update bucket `b`'s account subtree with canonical 4-tuple RLP `[nonce, balance, storageRoot, codeHash]` (or delete on EIP-161 empty / selfdestruct removal) → obtain exact new `h_b(blockNumber)`!
     - **Anchor Snapshot Ring (`ANCHOR_SNAPSHOT_RING = 4`):**
       - Retain lightweight immutable proof-read snapshots (e.g. copy-on-write diff or recent-root node retention) for the last 4 canonical anchor blocks (`K = 32` or `E = 256` grid) so concurrent `GET_STATE_WITNESS` and fresh chunk export never race with live head updates.

2. **512-Byte Root-Branch Assembly & Byzantine Fault Detection (`packages/ethy/src/custody/rootBranchAssembler.ts`):**
   - At every canonical anchor block `#A` (default every `32` or `256` blocks, configurable for fast tests):
     - Each custodian with an active `BucketSubtreeTrie` for bucket `b` computes `h_b(#A)` and broadcasts `0x0e SUBTREE_ROOTS(reqId = 0, anchorBlock = #A, [[b, h_b(#A)]])` to its `ETHY/0` peers.
     - Peers also actively pull missing buckets at `#A` via `0x0d GET_SUBTREE_ROOTS(anchorBlock = #A, missingMask)`.
   - **Cryptographic Verification Predicate (Collision-Resistant):**
     - Once at least one candidate `h_b` exists for every bucket `0..15`, construct `rootNodeRlp = RLP.encode([h_0, h_1, ..., h_f, new Uint8Array(0)])` (`~530 bytes`) and check:
       `keccak256(rootNodeRlp) === verifiedHeader(#A).stateRoot`
     - **Byzantine Fault Localization:** If multiple peers report conflicting candidate hashes for bucket `b` (or the initial assembly mismatches `header.stateRoot`), resolve the unique valid combination across per-bucket candidate sets (bounded combinatorics for 1–2 Byzantine buckets, falling back to the 530-byte root-node check below if >2 buckets conflict), immediately **disconnect and quarantine** every peer whose gossiped `h_b` disagrees with the consensus-proven `RootNode(#A)[b]`!
   - **Early-Network / Partial-Swarm Bootstrap Escape Hatch (`< 16` Buckets Online):**
     - When a young network (e.g. early Sepolia) has fewer than all 16 buckets covered by custodians at `#A`, allow `O(1)` fallback: fetch the **single 530-byte root branch node** (`snap/1 GetTrieNodes(stateRoot, [[0x]])` — 1 tiny message every `256` blocks!) and verify `keccak256(rootNodeRlp) === verifiedHeader(#A).stateRoot`.
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

### Acceptance Criteria (`WP-16e`)
- [ ] `BucketSubtreeTrie` matches a full reference `@ethereumjs/mpt` state trie bit-for-bit across 50+ blocks of EIP-7928 BAL mutations (`keccak256(RLP([h_0..h_f, 0x])) === fullRoot`).
- [ ] `RootBranchAssembler` assembles `RootNode(#A)` from 16 custodians via `0x0d`/`0x0e SUBTREE_ROOTS`, detects & flags Byzantine `h_b` peers, and supports the 530-byte `GetTrieNodes` bootstrap fallback when `< 16` buckets are online.
- [ ] Custodians advertise `trieBucketsBitmask`, serve `< 1 ms` ~2 KB live `0x0c STATE_WITNESS` proofs verified by `verifyStatyMultiProof`, and export fresh verified `ETHY/0` pivot chunks at new anchor blocks with **zero `snap/1`**.
- [ ] `npm run tsc`, `npm test`, and `npm run spellcheck` pass in `packages/ethy` (and no new runtime dependencies added).

---

## 2. Concrete Implementation Plan (Planner — Grok 4.7)

*(To be filled out by Grok 4.7 before implementation begins.)*

---

## 3. Implementation Notes & Deviations (Implementer — Composer 2.5)

*(To be filled out by Composer 2.5 upon completion.)*
