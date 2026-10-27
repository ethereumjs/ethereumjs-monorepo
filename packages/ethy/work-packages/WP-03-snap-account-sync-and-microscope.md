# WP-03: 16-Bucket `snap/1` Account Sync, Range Proofs & Developer Microscope

- **Status:** `BLOCKED_BY_WP-02`
- **Dependencies:** `WP-01`, `WP-02`
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Holistic Scope & Architectural Requirements

### Goal
Implement the 16-bucket (`0x0..0xf`) `snap/1` Account Range Synchronizer backed by the `StateStore` abstraction (`InMemoryFlatStore`), verifying every downloaded chunk with `@ethereumjs/mpt`'s `verifyMerkleRangeProof`, and wire the interactive **Developer Microscope** tools (`inspectRawAccountRange`, `sampleSyncedAccounts`, `triggerDevAction`) so stalled buckets, slow peers, and freshly synced accounts can be inspected and controlled live from the TUI prompt.

### Key Technical Nuances (From EthereumJS Codebase Audit)
1. **Slim RLP vs. Full RLP in `snap/1` `AccountRange`:**
   - In the `snap/1` wire specification, each account in `ACCOUNT_RANGE` (`[reqId, [[accountHash, slimBody], ...], proof]`) uses **slim RLP** where an empty `storageRoot` is encoded as `Uint8Array(0)` (instead of `KECCAK256_RLP`) and an empty `codeHash` is encoded as `Uint8Array(0)` (instead of `KECCAK256_NULL`).
   - Before passing `values` into `verifyMerkleRangeProof` from `@ethereumjs/mpt`, each account body must be converted back to standard full RLP (`createAccount({ nonce, balance, storageRoot: storageRoot.length === 0 ? KECCAK256_RLP : storageRoot, codeHash: codeHash.length === 0 ? KECCAK256_NULL : codeHash }).serialize()`).
2. **Identity Key Hashing in `verifyMerkleRangeProof`:**
   - Because `snap/1` `accountHash` keys are *already* 32-byte keccak256 hashes, `verifyMerkleRangeProof` **must** be called with `useKeyHashingFunction = (key: Uint8Array) => key` (identity function), **not** the default `keccak_256`!
3. **Continuation Flag (`hasRightElement`):**
   - `verifyMerkleRangeProof` returns `Promise<boolean>` indicating whether more trie leaves exist to the right of the last key in the response. Use this return value + bucket `limitHash` (`0x0fff...`, `0x1fff...`, ..., `0xffff...`) to advance `bucket.currentLastHash` (incremented by 1) or mark the bucket `done`.

### Key Deliverables

1. **`StateStore` Interface & `InMemoryFlatStore` (`src/store/`):**
   - Clean, synchronous/fast-async interface `StateStore`:
     - `putAccountsBatch(entries: Array<{ accountHash: Uint8Array; address?: Uint8Array; nonce: bigint; balance: bigint; storageRoot: Uint8Array; codeHash: Uint8Array }>): void`
     - `getAccountByHash(accountHash: Uint8Array): FlatAccount | undefined`
     - `sampleAccounts(opts: { prefixHex?: string; limit?: number; sortByBalanceDesc?: boolean }): FlatAccount[]`
     - `accountCount(): number`
   - `InMemoryFlatStore` implementation with zero external dependencies.

2. **`SnapTransport` Abstraction & `SyntheticSnapPeer` for CI (`src/sync/syntheticPeer.ts`):**
   - `SnapTransport` interface decoupling the bucket scheduler from raw sockets.
   - `SyntheticSnapPeer`: At test startup, builds a real `@ethereumjs/mpt` `MerklePatriciaTrie` with N deterministic accounts (e.g., 160 accounts across all 16 hex buckets `0x0..0xf`), computes the real `stateRoot`, and serves `requestAccountRange(req)` with valid slim-RLP bodies and real Merkle edge proofs (`createMerkleProof` on `originHash` and last key). Also supports injecting simulated timeouts or corrupted proofs on specific buckets (e.g., bucket `0x3`).

3. **16-Bucket `SnapAccountSynchronizer` (`src/sync/accountSync.ts`):**
   - Divides `0x0000...` – `0xffff...` into 16 `SnapBucket` ranges (`0x0`..`0xf`).
   - Assigns idle `snap/1` peers to pending/stalled buckets, tracks per-peer request RTT and timeouts in `EthySpine.peers`, verifies range proofs via `verifyMerkleRangeProof`, writes verified accounts to `StateStore`, and updates `EthySpine.snapBuckets`, `totalAccountsSynced`, and `accountsPerSec`.
   - If a peer times out or fails `verifyMerkleRangeProof`, records a detailed `DiagnosticEvent` (with `bucketIndex`, `peerId`, and failure reason) in `spine.diagnosticRingBuffer`, marks the bucket `stalled` briefly, and reassigns to a healthy peer.

4. **Stage-2 Microscope Tools (`src/tools/`):**
   - `inspectRawAccountRange`: Queries `StateStore.sampleAccounts({ prefixHex })` (or triggers an on-demand `GET_ACCOUNT_RANGE` for that prefix) and returns a `table` `WidgetSpec` showing Account Hash, Balance (ETH), Nonce, Contract (`yes`/`no`), and Storage Root.
   - `sampleSyncedAccounts`: Shows top accounts by ETH balance or highest nonce among the accounts synced so far.
   - `triggerDevAction`: Allows `/drop <peerId>`, `/reassign <bucketHex>`, `/pause`, `/resume` directly from the TUI prompt.

5. **Tier-1 Unit Test Suite (`test/snapSync.spec.ts`):**
   - End-to-end 16-bucket sync against `SyntheticSnapPeer` (160 accounts) completing in `<100ms` and verifying that all 16 buckets reach `done` and `StateStore.accountCount() === 160`.
   - Fault-injection test: `SyntheticSnapPeer` returns a corrupted edge proof on bucket `0x3` → synchronizer logs anomaly to `diagnosticRingBuffer`, marks peer error, reassigns bucket `0x3` to a healthy peer, and finishes 100% sync.

### Acceptance Criteria
- [ ] Full 16-bucket `snap/1` account sync + `verifyMerkleRangeProof` passes against `SyntheticSnapPeer` in `<100ms` in unit tests.
- [ ] Running `ethy sepolia` live pulls real Sepolia account ranges into `InMemoryFlatStore`, advances the 16-segment progress bar in Zone 1, and lets the user inspect synced accounts via `/sample` or `/range 0x0` in Zone 2.
- [ ] `npm run tsc`, `npm test`, and `npm run spellcheck` pass with 0 errors.

---

## 2. Concrete Implementation Plan (Planner — Grok 4.7)

*(To be filled out by Grok 4.7 during the Planning pass.)*

---

## 3. Implementation Notes & Deviations (Implementer — Composer 2.5)

*(To be filled out by Composer 2.5 after implementation and verification.)*
