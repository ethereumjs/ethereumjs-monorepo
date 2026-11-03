# WP-04j: Stack-Wide WASM Crypto Acceleration (`customCrypto` / `awasm-noble`) for `@ethereumjs/mpt`, `@ethereumjs/devp2p` & `@ethereumjs/ethy`

- **Status:** `READY_FOR_PLANNING`
- **Dependencies:** `WP-04i`
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Context & Architectural Goal

Even after reducing redundant hashes in `WP-04i`, `keccak_256` (in `@ethereumjs/mpt` range proofs, `@ethereumjs/statemanager`, and `@ethereumjs/devp2p` RLPx frame `MAC`s) and `secp256k1` (in `@ethereumjs/devp2p` DNS ENR verification, `DPT` UDP discovery, and `RLPx` ECIES handshakes) remain the hottest CPU primitives in the stack:
- **Why Pure-JS `keccak_256` Is CPU-Heavy:** Keccak-f[1600] operates on 25× 64-bit lanes using 64-bit bitwise rotations (`ROTL64`) and XORs. Because JavaScript Numbers only have 32-bit bitwise operators, `@noble/hashes` must emulate every 64-bit rotation using pairs of 32-bit `Uint32Array` words (`~4×` more CPU instructions per round).
- **Why WASM Is `3×–5×` Faster:** WebAssembly (`i64.rotl`, `i64.xor`, `i64.and`) maps **1-to-1 to native 64-bit ARM64 (`M1–M5`) and `x86_64` CPU instructions** with zero heap allocation and zero BigInt overhead!

### Architectural Principles (`security.mdc` S3 & `dependencies.mdc`)
1. **Opt-In for Library Packages, Automatic in Ethy Workers:**
   - Core `@ethereumjs/*` libraries (`common`, `mpt`, `statemanager`, `devp2p`) keep `@noble/*` as their zero-config fallback and accept WASM implementations cleanly via `Common.customCrypto` (`{ keccak256, ecsign, ecdsaRecover, ... }`).
   - `@ethereumjs/ethy` (both `SnapVerifyPool` workers and `Devp2pWorkerHost`) enables the fast WASM `customCrypto` backend automatically at worker startup (with graceful fallback to `@noble/*` if WASM initialization is unavailable).
2. **Closing the Missing `customCrypto` Wiring Gaps in `@ethereumjs/mpt` and `@ethereumjs/devp2p`:**
   - **Gap 1 (`@ethereumjs/mpt` `verifyMerkleRangeProof`):** Look at `packages/mpt/src/proof/range.ts:520`:
     ```ts
     const trie = await createMPTFromProof(proof, {
       useKeyHashingFunction,
       root: rootHash,
     })
     ```
     Wait: in `createMPTFromProof` (`packages/mpt/src/proof/proof.ts`), passing `useKeyHashingFunction` only sets `trie._opts.useKeyHashingFunction` if `opts.common?.customCrypto.keccak256` is not overriding it — ensure `verifyMerkleRangeProof` and `verifyMPTWithMerkleProof` consistently thread `useKeyHashingFunction` into `createMPTFromProof`!
   - **Gap 2 (`@ethereumjs/devp2p` `MAC` & `Peer`):**
     - `packages/devp2p/src/rlpx/mac.ts` hardcodes `import { keccak_256 } from '@noble/hashes/sha3.js'` and calls `createCipheriv('aes-256-ecb', this._secret, '')` on **every single 16-byte header and body frame**! Pre-creating the reusable `aes-256-ecb` cipher instance once in `new MAC(secret)` eliminates thousands of OpenSSL cipher allocations per second!
     - `packages/devp2p/src/worker/host.ts` (`commonFromInit`) creates `new Common({ chain, hardfork })` without passing `customCrypto` when WASM crypto is available in the worker.

---

## 2. Key Deliverables (3 Cohesive Slices)

### Slice 1 (`@ethereumjs/mpt` & `@ethereumjs/devp2p`): Complete `customCrypto` Plumb-Through & `RLPx` `MAC` Cipher Reuse
1. **`@ethereumjs/mpt` (`packages/mpt/src/proof/range.ts` & `proof.ts`):**
   - Ensure `useKeyHashingFunction` passed to `verifyMerkleRangeProof(rootHash, firstKey, lastKey, keys, values, proof, useKeyHashingFunction)` is used for **every** trie hash operation inside `createMPTFromProof`, ` verifyMPTWithMerkleProof`, and `verifyMerkleRangeProof`.
2. **`@ethereumjs/devp2p` (`packages/devp2p/src/rlpx/mac.ts`, `ecies.ts`, `dpt/message.ts`, `worker/host.ts`):**
   - In `MAC` (`packages/devp2p/src/rlpx/mac.ts`):
     - Cache a single `private _aes = createCipheriv('aes-256-ecb', this._secret, '')` instance (with `setAutoPadding(false)`) in the constructor instead of calling `createCipheriv('aes-256-ecb', ...)` on every `updateHeader` and `updateBody` call!
   - In `dpt/message.ts`: use `common?.customCrypto.keccak256 ?? keccak_256` (and `common?.customCrypto.ecsign` / `ecdsaRecover` when present) instead of hardcoded `@noble` calls.
   - In `Devp2pWorkerHost` (`packages/devp2p/src/worker/host.ts` & `protocol.ts`): support an optional `customCrypto` / WASM crypto initializer inside the worker thread so `commonFromInit` wires `customCrypto` into `Common`, `DPT`, `DNS`, and `RLPx`.

### Slice 2 (`@ethereumjs/ethy` / Monorepo Crypto Provider): Zero-Copy 64-Bit WASM `keccak256` Provider (`src/crypto/wasmKeccak.ts`)
1. **Self-Contained or Approved WASM `keccak256` Accelerator (`packages/ethy/src/crypto/wasmKeccak.ts`):**
   - Provide a fast, synchronous `wasmKeccak256(data: Uint8Array): Uint8Array` function backed by native 64-bit WebAssembly `i64` Keccak-f[1600] instructions (either via an inline compiled ~1.5 KB WebAssembly module using standard `i64.rotl` / `i64.xor` Keccak-f[1600] with zero external npm dependencies, or `@polkadot/wasm-crypto` / `awasm-noble` when available, with automatic fallback to `@noble/hashes` `keccak_256`).
   - *Note why an inline/self-contained 64-bit WASM Keccak-f[1600] kernel (verified against 100% of `@noble/hashes` test vectors!) is especially powerful:*
     - It requires **zero new npm runtime dependencies** (`dependencies.mdc`),
     - It compiles synchronously via `new WebAssembly.Instance(new WebAssembly.Module(WASM_BYTES))` in **`< 1ms`** inside every `SnapVerifyPool` worker and `Devp2pWorkerHost`,
     - It operates directly on a shared linear memory buffer (zero JS/WASM boundary allocation per hash), delivering full native 64-bit `i64.rotl` speed (`3×–4×` faster than JS `@noble/hashes`)!
2. **Wire `wasmKeccak256` into `SnapVerifyPool` (`snapVerifyJob.ts`) and `FlatStateManager` (`createEthyNode.ts`):**
   - Pass `wasmKeccak256` as `useKeyHashingFunction` into `verifyMerkleRangeProof` inside `verifyAccountRangeJob` and `verifyStorageRangeJob`, and into `FlatStateManager` via `common.customCrypto.keccak256`.

### Slice 3: Differential Equivalence & Speedup Benchmark Gate (`packages/ethy/test/wasmCrypto.spec.ts` & `packages/devp2p/test/rlpx/mac.spec.ts`)
1. **1,000-Vector Differential Equivalence Gate (`test/wasmCrypto.spec.ts`):**
   - Test `wasmKeccak256` against `@noble/hashes`'s `keccak_256` across 1,000 inputs of varying lengths (`0` bytes, `1` byte, `32` bytes, `135` bytes, `136` bytes [exact rate block], `137` bytes, `532` bytes [RLP branch node], and `65,536` bytes), asserting **bit-for-bit equality** on every vector.
2. **Range-Proof Verification & `MAC` Throughput Benchmark Gate:**
   - Verify that `verifyAccountRangeJob` with `wasmKeccak256` produces identical proof results to `@noble/hashes` and achieves measurable speedup on 500-account range proofs.
   - Verify that `MAC.updateHeader` / `MAC.updateBody` with the cached `aes-256-ecb` cipher produces bit-for-bit identical 16-byte digests to the legacy per-call `createCipheriv` implementation.

---

## 3. Acceptance Criteria & Verification Gates

- [ ] `@ethereumjs/devp2p`: `MAC` reuses a single `aes-256-ecb` cipher instance per connection instead of allocating `createCipheriv` on every header/body frame, and `dpt/message.ts` respects `common.customCrypto.keccak256`.
- [ ] `@ethereumjs/mpt`: `verifyMerkleRangeProof` threads `useKeyHashingFunction` through all internal proof-trie hash operations.
- [ ] `@ethereumjs/ethy`: `wasmKeccak256` passes 1,000 differential test vectors against `@noble/hashes/sha3.js` (`0..65536` byte inputs including rate boundaries `135/136/137`) and accelerates `SnapVerifyPool` worker proof verification with zero new runtime npm dependencies.
- [ ] `npm run tsc`, `npm test` (`test:node`), and `npm run spellcheck` pass across `@ethereumjs/mpt`, `@ethereumjs/devp2p`, and `@ethereumjs/ethy`.

---

## 4. Concrete Implementation Plan (Planner — Grok 4.7)

*(To be filled out by Grok 4.7 during the Planning pass.)*

---

## 5. Implementation Notes & Deviations (Implementer — Composer 2.5)

*(To be filled out by Composer 2.5 after implementation and verification.)*
