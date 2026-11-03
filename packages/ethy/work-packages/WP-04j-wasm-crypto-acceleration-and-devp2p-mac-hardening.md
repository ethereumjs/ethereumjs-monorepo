<!-- cspell:ignore awasm -->
# WP-04j: `@awasm/noble` WASM Crypto Integration in `@ethereumjs/ethy` + Pure-JS `customCrypto` & `MAC` Hardening in `@ethereumjs/mpt` & `@ethereumjs/devp2p`

- **Status:** `DONE`
- **Dependencies:** `WP-04i` (`DONE`)
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Context, Package Identity & Library Policy

### 1.1 `@awasm/noble` (Paul Miller's `github.com/paulmillr/awasm-noble`)
- On npm, [`paulmillr/awasm-noble`](https://github.com/paulmillr/awasm-noble) is published as **`@awasm/noble`** (current version `0.1.4`, zero mandatory dependencies, synchronous execution, reproducible auditable WASM builds):
  ```ts
  import { keccak_256 } from '@awasm/noble'
  ```
- **Explicit Human Approval Granted:** Adding `"@awasm/noble": "0.1.4"` (or `"^0.1.4"`) as a dependency of **`packages/ethy/package.json`** is **explicitly approved by the human** for `WP-04j`.
- **Do NOT hand-roll or vendor custom WASM bytecode arrays!** Use `@awasm/noble` directly in `@ethereumjs/ethy`.

### 1.2 Strict EthereumJS Library Policy: **No WASM Inside Library Packages (`mpt`, `devp2p`, `statemanager`, `common`, etc.)**
- Per `security.mdc` (S3) and `dependencies.mdc`, **no `@ethereumjs/*` library package outside `packages/ethy` may import `@awasm/noble` or contain WASM code**.
- Library packages (`@ethereumjs/mpt`, `@ethereumjs/devp2p`, `@ethereumjs/statemanager`, `@ethereumjs/common`) remain **100% pure JS (`@noble/*`) by default** and accept external hash/crypto functions strictly via their existing pure-JS injection seams (`Common.customCrypto.keccak256` and `useKeyHashingFunction`).
- Only **`@ethereumjs/ethy`** (the end-user node/CLI application in `packages/ethy/`) depends on `@awasm/noble` and injects its WASM `keccak_256` into `@ethereumjs/mpt`, `@ethereumjs/statemanager`, and `@ethereumjs/devp2p`!

---

## 2. Key Deliverables (3 Cohesive Slices)

### Slice 1 (`@ethereumjs/mpt` & `@ethereumjs/devp2p` — Pure JS Only, Zero WASM): Complete `customCrypto` Plumb-Through & `RLPx` `MAC` Cipher Reuse
1. **`@ethereumjs/mpt` (`packages/mpt/src/proof/range.ts` & `proof.ts`):**
   - Ensure `useKeyHashingFunction` passed to `verifyMerkleRangeProof(rootHash, firstKey, lastKey, keys, values, proof, useKeyHashingFunction)` is threaded into `createMPTFromProof` and `verifyMPTWithMerkleProof` so every internal trie hash call uses the caller-supplied `useKeyHashingFunction` (`keccak_256` default).
2. **`@ethereumjs/devp2p` (`packages/devp2p/src/rlpx/mac.ts`, `dpt/message.ts`, `worker/host.ts`):**
   - In `MAC` (`packages/devp2p/src/rlpx/mac.ts`):
     - Cache a single reusable `aes-256-ecb` cipher instance in the `MAC` constructor instead of creating a new cipher instance on every 16-byte header and body frame!
   - In `dpt/message.ts`: use `common?.customCrypto.keccak256 ?? keccak_256` instead of hardcoded `keccak_256`.

### Slice 2 (`@ethereumjs/ethy`): Install `@awasm/noble` in `packages/ethy` & Wire `keccak_256` into `SnapVerifyPool` and `FlatStateManager`
1. **Add `@awasm/noble` to `packages/ethy/package.json`:**
   - Add `"@awasm/noble": "^0.1.4"` to `packages/ethy/package.json` (and update `package-lock.json`).
   - Create `packages/ethy/src/crypto/keccak.ts` exporting `ethyKeccak256(data: Uint8Array): Uint8Array` backed by `keccak_256` from `@awasm/noble` (note: `@awasm/noble` is ESM-only; ensure `keccak.ts` works cleanly in both ESM/tsx/vitest and CJS builds or falls back to `@noble/hashes/sha3.js` if loaded in a CJS-only context).
2. **Wire `ethyKeccak256` into `SnapVerifyPool` (`snapVerifyJob.ts`) & `createEthyNode.ts`:**
   - Pass `ethyKeccak256` as the 7th argument (`useKeyHashingFunction`) to `verifyMerkleRangeProof(...)` in `verifyAccountRangeJob` and `verifyStorageRangeJob` (`packages/ethy/src/sync/snapVerifyJob.ts`).
   - Pass `common` with `customCrypto: { keccak256: ethyKeccak256 }` into `createFlatStateManager` in `packages/ethy/src/core/createEthyNode.ts`.

### Slice 3: Differential Equivalence & `MAC` Regression Tests (`packages/ethy/test/wasmCrypto.spec.ts` & `packages/devp2p/test/rlpx/mac.spec.ts`)
1. **`@awasm/noble` Equivalence & Range-Proof Test (`packages/ethy/test/wasmCrypto.spec.ts`):**
   - Verify `ethyKeccak256` (`@awasm/noble`) matches `@noble/hashes/sha3.js` `keccak_256` across empty, 32-byte, 135/136/137-byte (Keccak rate boundary), and 4,096-byte inputs.
   - Verify `verifyAccountRangeJob` and `verifyStorageRangeJob` invoke `ethyKeccak256` and accept valid `SyntheticSnapPeer` proofs while rejecting corrupted proofs.
2. **RLPx `MAC` Cipher Reuse Test (`packages/devp2p/test/rlpx/`):**
   - Verify that `MAC.updateHeader` and `MAC.updateBody` with the cached `aes-256-ecb` cipher produce bit-for-bit identical 16-byte digests across multiple sequential frames.

---

## 3. Acceptance Criteria & Verification Gates

- [x] **Zero WASM in library packages:** `@ethereumjs/mpt`, `@ethereumjs/devp2p`, `@ethereumjs/statemanager`, and `@ethereumjs/common` contain zero WASM code and zero `@awasm/noble` imports.
- [x] **`@awasm/noble` in `@ethereumjs/ethy`:** `packages/ethy` uses `@awasm/noble`'s `keccak_256` (no self-vendored WASM byte arrays!) and wires it into `verifyMerkleRangeProof` (`snapVerifyJob.ts`) and `FlatStateManager` (`createEthyNode.ts`).
- [x] **`@ethereumjs/devp2p` `MAC` & `dpt/message.ts`:** `MAC` reuses a single `aes-256-ecb` cipher instance per connection, and `dpt/message.ts` respects `common?.customCrypto.keccak256`.
- [x] `npm run tsc`, `npm test` (`test:node`), and `npm run spellcheck` pass across `@ethereumjs/mpt`, `@ethereumjs/devp2p`, and `@ethereumjs/ethy`.

---

## 4. Concrete Implementation Plan (Planner — Grok 4.7)

Human-approved **`@awasm/noble`** in **`packages/ethy` only**; library packages stay pure JS via existing `useKeyHashingFunction` / `Common.customCrypto` seams.

| Slice | Package | Work |
| --- | --- | --- |
| 1 | `@ethereumjs/mpt` | Counter test on all four `verifyMerkleRangeProof` shapes; JSDoc that node RLP hashing uses `useKeyHashingFunction`. |
| 2 | `@ethereumjs/devp2p` | Reuse one `aes-256-ecb` in `MAC`; regression + multi-frame MAC test; optional `encode()` custom keccak test (`dpt/message.ts` already wired). |
| 3 | `@ethereumjs/ethy` | `src/crypto/keccak.ts` (`initEthyKeccak`, `ethyKeccak256`, dynamic `import('@awasm/noble')`); wire snap verify jobs + `Common` on `FlatStateManager`; CLI + verify worker init; `test/wasmCrypto.spec.ts`. |

Out of scope: vendored WASM, `@awasm/noble` in `mpt`/`devp2p`, `cryptoModuleUrl`, devp2p worker WASM, streaming MAC keccak.

---

## 5. Implementation Notes & Deviations (Implementer — Composer 2.5)

- **`snapVerifyWorkerEntry`:** `initEthyKeccak()` runs in a `.then()` before `parentPort.on('message')` so CJS prod build avoids top-level `await`.
- **`verifyAccountRangeJob` / `verifyStorageRangeJob`:** optional `useKeyHashingFunction` parameter (default `ethyKeccak256`) for counting tests; each job still `await initEthyKeccak()`.
- **Corruption tests:** wrong `stateRoot` / `storageRoot` (not RLP tail flip) to assert `ok: false`.
- **Gates:** `npm run tsc` + tests green in `mpt`, `devp2p`, `ethy`; no `@awasm/noble` imports under library packages.
