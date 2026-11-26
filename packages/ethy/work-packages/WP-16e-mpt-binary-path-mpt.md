# WP-16e: `@ethereumjs/mpt` — Path-Keyed `BinaryPathMPT` Strain (Packed Binary Branch Nodes, `O(depth)` Streaming Builder, Reverse-Diff Anchor Snapshots & Proof Generator)

- **Status:** `READY_FOR_PLANNING`
- **Dependencies:** `WP-04i` (`DONE`), `WP-04j` (`DONE`)
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Holistic Scope & Architectural Requirements

### Goal
Add a clean, opt-in, **Path-Based Binary Merkle Patricia Trie (`BinaryPathMPT`)** strain directly inside **`@ethereumjs/mpt`** (separate upstream commit per **D-008**; **100% additive**, zero breaking changes to classic `MerklePatriciaTrie`!).

Classic hash-keyed `MerklePatriciaTrie` (`packages/mpt/src/mpt.ts`) stores nodes by `keccak256(nodeRlp)` and allocates JS `BranchMPTNode`/`LeafMPTNode` objects and 64-element `number[]` nibble arrays per key. At Mainnet `1/16th` custody scale (`~18.75M` accounts + `~94M` storage slots per bucket), hash-keyed node DBs suffer from unbounded orphan growth (or pruning conflicts with anchor snapshots), V8 heap pressure, and duplicate leaf storage.

**`BinaryPathMPT`** brings Geth path-based / Reth trie ergonomics to pure TypeScript (`@ethereumjs/mpt`, pure-JS default with caller-injected `keccak256` per `security.mdc` S3 — zero WASM embedded in `@ethereumjs/mpt`!):
1. **Path-Keyed In-Place Overwrites (Zero Pruning Forever):** Interior nodes are keyed by their compact nibble path rather than `keccak256(nodeRlp)`. Updating a key overwrites `6–8` path entries in place — zero orphan nodes, zero garbage collection.
2. **Packed Binary Node Format (Zero JS Object / RLP Churn):** Compact binary branch/extension/leaf layout (`uint16 childMask` + packed 32B hashes or inline `< 32B` RLP bytes) that encodes to canonical Ethereum RLP **only** when hashing a dirty node or emitting EIP-1186 / range proof nodes.
3. **`O(depth)` RAM Streaming Builder from Sorted Key-Value Streams:** Builds a multi-million-key trie (or `1/16th` subtree trie rooted at high nibble `b`) in a single left-to-right streaming pass over sorted `(keyHash32, valueRlp)` rows while holding only `<= 64` stack frames in RAM.
4. **Zero-Duplicate Flat-Backed Leaf Mode (Optional):** Supports plugging in an external flat leaf lookup/iterator (e.g. Ethy's sorted `accounts/<b_hex>.bin` / `storage/<b_hex>.bin` or `FlatStateManager`) so interior branch nodes persist without duplicating millions of leaf payloads on disk.
5. **Lock-Free Reverse-Diff Anchor Snapshots (`< 100 KB / block`):** Captures immutable historical anchor views (`captureAnchor(anchorId)`, bounded ring e.g. `maxAnchors = 4`) by recording only the `~150` overwritten `(path -> previousNodeBytes)` entries per block — enabling `< 1 ms` proof generation at anchor `#A` while live BAL updates advance `#Head` concurrently!

---

### Key Deliverables (`WP-16e`)

1. **Compact Path Key & Packed Binary Node Codec (`packages/mpt/src/binaryPath/pathKey.ts`, `nodeCodec.ts`):**
   - **Compact Nibble Path Encoding (`Uint8Array` or packed binary key):** Encodes nibble paths of length `0..64` cleanly without allocating `number[]` arrays (e.g. `[lengthByte, ...packedNibbles]` — `<= 33` bytes max, typically `1–5` bytes for interior branch nodes!).
   - **Packed Binary Node Layout:**
     - **Branch Node:** `[tag = 0x01, uint16BE(childMask), uint16BE(inlineMask), ...childEntries, optionalValueBytes]` where each non-inline child is a fixed 32-byte `keccak256` hash and each inline child (`< 32` bytes RLP) is length-prefixed `[len: u8, ...rawRlp]`.
     - **Extension Node:** `[tag = 0x02, pathLen: u8, ...packedPathNibbles, childIsInline: u8, ...childHashOrInlineRlp]`.
     - **Leaf Node:** `[tag = 0x03, pathLen: u8, ...packedPathNibbles, ...valueRlp]` (or omitted from interior store when backed by external flat leaf storage).
   - **Canonical Ethereum RLP Serializer & Hasher (`encodeNodeToRlp`, `hashNode`):** Produces the **exact** canonical Ethereum MPT RLP encoding (17-element branch list, 2-element hex-prefix extension/leaf list, inline `< 32B` child rule) using caller-supplied `keccak256` (defaulting to `@noble/hashes/sha3.js` `keccak_256`).

2. **Pluggable Path-Node Store Seam (`packages/mpt/src/binaryPath/store.ts`):**
   - Minimal synchronous-or-async `BinaryPathNodeStore` interface (`getNode(pathKey)`, `putNode(pathKey, bytes)`, `deleteNode(pathKey)`, `applyBatch(ops)`) with:
     - Built-in fast `InMemoryBinaryPathStore` (zero deps, used for tests, small contract storage tries, and caching).
     - Clean byte-oriented persistence contract so `@ethereumjs/ethy` (`WP-16f`) can plug in a flat disk-backed / memory-mapped / chunked binary store with an LRU hot cache.
   - Optional `ExternalLeafReader` seam (`getLeafValue(keyHash32) => Uint8Array | undefined | Promise<Uint8Array | undefined>`) allowing interior-only persistence when leaves already reside in flat slabs.

3. **`BinaryPathMPT` Core Engine (`packages/mpt/src/binaryPath/binaryPathMPT.ts`):**
   - **Options (`BinaryPathMPTOpts`):**
     - `store?: BinaryPathNodeStore` (defaults to `InMemoryBinaryPathStore`)
     - `keccak256?: (data: Uint8Array) => Uint8Array` (defaults to `keccak_256`; Ethy injects WASM `ethyKeccak256` per `security.mdc` S3)
     - `prefixNibbles?: Uint8Array` (optional fixed root prefix — e.g. single nibble `[b]` for a `1/16th` custody bucket subtree whose `root()` returns `h_b` directly!)
     - `maxAnchorSnapshots?: number` (default `4`)
   - **Core Operations:**
     - `root(): Uint8Array` — returns current 32-byte root hash (`EMPTY_TRIE_ROOT` if empty; or `h_b` when scoped to prefix `[b]`).
     - `get(keyHash32: Uint8Array): Promise<Uint8Array | null>` — looks up canonical leaf value.
     - `put(keyHash32: Uint8Array, valueRlp: Uint8Array): Promise<void>` & `del(keyHash32: Uint8Array): Promise<void>` — in-place path updates (splitting/merging extensions & branches with exact Ethereum MPT semantics, including single-child branch collapse on `del`!).
     - `applyBatch(mutations: ReadonlyArray<{ key: Uint8Array; value: Uint8Array | null }>): Promise<Uint8Array>` — sorts & deduplicates a block's mutations (e.g. a BAL's `1/16th` writes), applies all updates, and re-hashes every dirty ancestor node **at most once** per block!
   - **Streaming Sorted-Slab Builder (`BinaryPathMPT.buildFromSortedStream`):**
     - Consumes an `Iterable` / `AsyncIterable` of strictly ascending `(keyHash32, valueRlp)` entries (accepting zero-copy views into `136B` account slabs or `64B` storage slabs!).
     - Maintains an `O(depth)` active path stack (`<= 64` frames), emits completed interior nodes straight to `store.applyBatch(...)` in bounded chunks (`e.g. 4,096` nodes/flush), and yields the exact final root hash (`root` or `h_b`) with flat RAM usage regardless of whether the stream has `1,000` or `20,000,000` leaves!

4. **Reverse-Diff Anchor Snapshots & Proof / Boundary-Range Generation (`packages/mpt/src/binaryPath/snapshots.ts`, `proofs.ts`):**
   - **Lock-Free Reverse-Diff Anchors:**
     - `captureAnchor(anchorId: string | bigint): Uint8Array` — marks the current root as an immutable snapshot anchor; subsequent `put` / `del` / `applyBatch` calls record only the first overwritten `(pathKey -> previousBytes | null)` per active anchor before mutating the live store, evicting the oldest anchor when `activeAnchors.size > maxAnchorSnapshots`.
     - `releaseAnchor(anchorId)` — frees diff memory immediately.
   - **EIP-1186 Single-Key & Multi-Key Proof Generator (`createProof(keyHash32, anchorId?)`, `createMultiProof(keys, anchorId?)`):**
     - Walks the path (at live head or historical `anchorId` via reverse-diff overlay), encodes each visited binary node to canonical Ethereum MPT RLP, deduplicates nodes across `keys`, and returns `Uint8Array[]` (`proofNodes[]`) directly verifiable by `verifyMerkleProof` / `verifyStatyMultiProof`!
     - Works identically for both **inclusion** and **exclusion** (non-existent key) proofs!
   - **Range Boundary Proof Generator (`createRangeBoundaryProof(originHash32, lastHash32, anchorId?)`):**
     - Emits the exact deduplicated left (`originHash32`) + right (`lastHash32`) boundary `proofNodes[]` directly verifiable by `@ethereumjs/mpt`'s `verifyMerkleRangeProof` — enabling `WP-16f` custodians to export brand-new self-proving `ETHY/0` chunks with **zero `snap/1`**!

5. **Public Exports, API Snapshot & Comprehensive Oracle / Perf Tests:**
   - Export `BinaryPathMPT`, `createBinaryPathMPT`, `InMemoryBinaryPathStore`, and types cleanly from `packages/mpt/src/index.ts`.
   - Refresh `config/public-api-snapshots/mpt.json` (`node --test scripts/public-api-snapshot.spec.mjs` must pass `17/17`).
   - **`packages/mpt/test/binaryPath/binaryPathMPT.spec.ts`:**
     - **Bit-for-Bit Consensus Oracle Test:** Compare `BinaryPathMPT` (both incremental `put`/`del`/`applyBatch` AND `buildFromSortedStream`) against classic `MerklePatriciaTrie` (`useKeyHashing: false`) across:
       - Empty trie, 1-key trie, 2-key shared-prefix extension splits, branch collapses on `del`, inline `< 32B` child nodes, and `2,000+` random 32-byte keys with `50` rounds of mixed `put` + overwrite + `del`!
       - Assert `equalsBytes(binaryTrie.root(), classicTrie.root())` after **every single round**!
     - **16-Way Subtree Split Oracle Test:** Split a `2,000`-key world trie into `16` independent `BinaryPathMPT` instances with `prefixNibbles = [0x0]..[0xf]` and assert `keccak256(RLP([h_0..h_f, 0x])) === classicFullTrie.root()` across 30 rounds of mutations!
     - **Proof & Range-Proof Interop Tests:** Verify every `createProof` (present + missing keys), `createMultiProof`, and `createRangeBoundaryProof` (at both live head AND captured historical `anchorId` after subsequent mutations!) passes classic `@ethereumjs/mpt` `verifyMerkleProof` and `verifyMerkleRangeProof`!
     - **Streaming Build Performance & Hash-Count Ratio Gate:** Build a `10,000`-key sorted trie via `BinaryPathMPT.buildFromSortedStream` vs classic `MerklePatriciaTrie` (`put` loop) and assert clean speed + hash-count efficiency in `< 2s` CI runtime.

---

### Acceptance Criteria (`WP-16e`)
- [ ] `BinaryPathMPT` lands in a clean, **100% additive upstream `@ethereumjs/mpt` commit (D-008)** with zero breaking changes to classic `MerklePatriciaTrie` and zero new runtime dependencies (pure-JS default, injectable `keccak256` per `security.mdc` S3).
- [ ] Matches classic `MerklePatriciaTrie` bit-for-bit on root hashes, `16`-way `[h_0..h_f]` subtree roots, EIP-1186 inclusion/exclusion proofs, and `verifyMerkleRangeProof` boundary proofs — including at historical reverse-diff anchors after subsequent live mutations.
- [ ] `buildFromSortedStream` builds sorted key-value streams in `O(depth)` stack RAM with batch flushes.
- [ ] `config/public-api-snapshots/mpt.json` is updated and `scripts/public-api-snapshot.spec.mjs` (`17/17`), `packages/mpt` `tsc`, `npm test`, and `cspell` all pass.

---

## 2. Concrete Implementation Plan (Planner — Grok 4.7)

*(To be filled out by Grok 4.7 before implementation begins.)*

---

## 3. Implementation Notes & Deviations (Implementer — Composer 2.5)

*(To be filled out by Composer 2.5 upon completion.)*
