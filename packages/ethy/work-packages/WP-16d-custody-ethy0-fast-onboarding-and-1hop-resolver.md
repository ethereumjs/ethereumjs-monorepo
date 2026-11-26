# WP-16d: Unified Custody `ETHY/0` — Default Fast Onboarding (`--custody 2`), Background 3-Plane Custody Sync & 1-Hop Cold-Miss Resolver (Option B)

- **Status:** `READY_FOR_PLANNING`
- **Dependencies:** `WP-16b` (`DONE`), `WP-16c` (`READY_FOR_PLANNING`), `WP-06f` (`DONE`), `WP-08b` (`DONE`), `WP-11b` (`DONE`), `WP-14` (`DONE`)
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Holistic Scope & Architectural Requirements

### Goal
Ship **Option B (Unified Custody `ETHY/0`)** end-to-end as Ethy's default operating mode so a fresh `ethy sepolia` (or `ethy mainnet`) node:
1. **Goes live in 2–3 minutes** by syncing its rolling `eth/71` BAL window (`4,096..8,192` blocks) and immediately serving verified JSON-RPC (`eth_call`, ENS, ERC-20/DeFi, AI forensics) via Open-World `FlatStateManager`.
2. **Custodies `2/16` (`1/8th`) of Ethereum by default (`--custody 2`, ~16–20 GB flat / ~20–26 GB with Option-C trie on Mainnet, ~3–4 GB on Sepolia)** — syncing all three planes (`Accounts` + `Bytecode` + `Storage`) for its deterministic nibble buckets in the background over `ETHY/0` `v0.4` and atomically flipping each finished custody bucket to **Closed-World** (`stateManager.markBucketClosed(b)`). Holding 2 buckets per node means **only 7 peers give 100% 1-hop coverage, `14–20` peers give 2× fault-tolerant redundancy, and just 8 Ethy nodes bootstrap a 100% self-sustaining swarm!**
3. **Zero `snap/1` by default — not even negotiated in `HELLO`!** Default Ethy clients resolve all custody syncs and cold misses 100% over `ETHY/0` + `eth/71` BALs (`0` `snap/1` slots occupied on full nodes). Only an explicit Day-0 origin seeder (`ethy --full --snap-bootstrap`) mounts `snap/1` once to seed a brand-new network; once synced, even that seeder drops `snap/1` permanently!
4. Supports clean scaling via the **Custody Dial (`1..16`, no free-rider `0`)**: `--custody 1` (minimum, tight-disk laptops/CI), `--custody 2` (**default**, 1/8th), `--custody 3..15` (multi-bucket custodian), and `--full` (`--custody 16`, 100% Closed-World read privacy).

---

### Key Deliverables (`WP-16d`)

1. **CLI Custody Dial, `--snap-bootstrap` Gate & Deterministic Bucket Assignment (`packages/ethy/src/cli/args.ts`, `src/custody/custodyPlan.ts`):**
   - Add first-class custody flags:
     - `--custody <1..16>` (**default `2`**; values `< 1` or `> 16` rejected with a clear CLI usage error — no `--custody 0` free-rider mode!).
     - `--full` (alias for `--custody 16`).
     - `--snap-bootstrap` (**default `false`**): explicit opt-in flag allowing a Day-0 `--full` seed node (or solo-island dev test) to mount `snap/1` until its initial state is synced. When `false` (all normal clients), `snap/1` is **never mounted or dialed**!
     - Preserve `--sync-mode auto | ethy | snap` (`--sync-mode snap` implies `--snap-bootstrap`).
   - **Deterministic Custody Assignment (`selectCustodyBuckets(localNodeId, count)`):**
     - `count === 16`: `[0..15]` (`custodyMask = 0xffff`).
     - `1 <= count <= 15`: deterministically derive `start = keccak256(localNodeId)[0] >> 4` and select `count` well-spread buckets (e.g. for `count = 2`, `(start, (start + 8) & 0xf)` — opposite halves of the address space; for general `count`, deterministic stride/permutation from `keccak256(localNodeId)`), persisted in `ActiveMeta` so restarts keep the same assigned custody buckets instead of re-downloading different nibbles!
   - **Shared Binary Block Calendar (`packages/ethy/src/sync/blockCalendar.ts`):**
     - Power-of-two constants: `CANONICAL_PIVOT_GRID_BLOCKS = 32n`, `ANCHOR_EPOCH_BLOCKS = 256n`, `MACRO_GENERATION_GRID_BLOCKS = 1_024n`, `BAL_RETENTION_WINDOW_BLOCKS = 8_192n` (`~27.3 h`), `ONBOARDING_BAL_WINDOW_BLOCKS = 4_096n` (`~13.6 h`).

2. **2–3 Minute Fast Onboarding & Background 3-Plane Custody Sync (`packages/ethy/src/custody/custodyOnboarding.ts`, `src/sync/ethyCodeStorageSync.ts`):**
   - **Stage 1 — Immediate Live Boot via Rolling `eth/71` BAL Window:**
     - Anchor head via `@ethereumjs/beacon-light` (or best verified P2P head in `p2p_only`).
     - Pull and verify contiguous `(headerRlp, balRlp)` across the rolling BAL window (`onboardingBalStartBlock(#Head) .. #Head`) using `WP-14`'s `balPipeline.ts`.
     - Populate local `StatyWriteIndex` (renamed/aliased `BalWriteIndex`), apply BAL post-state into `FlatStateManager` (starting with `closedBucketsMask` equal to already-completed custody buckets on disk), persist verified bundles into the rolling BAL archive so the node immediately serves them back over `eth/71` + `ETHY/0 BAL_RANGE`, and **enter live `HEAD_FOLLOWING` immediately**!
   - **Stage 2 — Background 3-Plane Custody Sync (`Accounts` + `Bytecode` + `Storage` for `custodyBuckets`):**
     - Runs in a `ResourceBudget`-aware background lane while live `HEAD_FOLLOWING`, JSON-RPC, and AI storytelling remain 100% responsive.
     - For each assigned bucket `b` in `custodyBuckets`:
       1. **Accounts:** Sync via `ETHY/0` `0x01`/`0x03` (using `snap/1` **only** when `--snap-bootstrap` is explicitly enabled and no `ETHY/0` custodian holds bucket `b`), saving `accounts/<b_hex>.bin` + `accounts/<b_hex>.proof.idx` (always self-proving for re-serving!).
       2. **Bytecode (`kind = 0`):** Batch up to `64` missing `codeHashes` from `ETHY/0` `0x05` (`kind = 0`, skipping hashes already in `SharedCodeStore`), verifying `keccak256(code) === codeHash` (`snap/1 GetByteCodes` only when `--snap-bootstrap` is enabled).
       3. **Storage (`kind = 2` + `kind = 1`):**
          - Small complete-trie contracts (`kind = 2`): batch up to `64` `[accountHash, storageRoot]` pairs; verify complete storage trie root in `SnapVerifyPool` (`computedRoot === storageRoot`, zero sidecar bytes); persist to `storage/<b_hex>.bin`.
          - Large multi-chunk contracts (`kind = 1`): cursor-stream `originSlotHash` → `lastSlotHash + 1`, verify `verifyMerkleRangeProof`, replay verified BALs `(chunkBlockNumber + 1 .. #Head)`, persist 64B slab + `storage/<b_hex>.proof.idx`.
          - Only when `--snap-bootstrap` is explicitly set: fall back to `snap/1` (`SnapCodeAndStorageSynchronizer`) if `ETHY/0` peers are `v0.2` accounts-only (`storageBucketsBitmask === 0`).
       4. **Atomic Closed-World Flip:** Once all 3 planes for bucket `b` are verified and BAL-replayed to `#Head`, call `stateManager.markBucketClosed(b)` and emit updated `ETHY/0 STATUS` setting `(1 << b)` across `bucketsBitmask`, `storageBucketsBitmask`, and `codeBucketsBitmask`!
   - **Laptop-Sleep / Restart Resume:**
     - On restart, reload completed custody buckets (immediately closed!) and `BalWriteIndex` checkpoint, catch up missed `eth/71` BALs (`lastVerifiedBlock + 1 .. #Head`) to stay live, and resume any incomplete custody bucket in the background.

3. **1-Hop Custody Cold-Miss Resolver (`packages/ethy/src/custody/custodyStateResolver.ts`):**
   - Wires directly into `FlatStateManager`'s `WP-16b` open-world miss hooks (`resolveAccountMiss`, `resolveStorageMiss`, `resolveCodeMiss`), with a `10–25 ms` micro-batch coalescing window and strict policy enforcement (`'full' | 'swarm-only' | 'local-only'`):
   - **Account & Storage Resolution Escalation Ladder (Bucket `b = accountHash[0] >> 4`):**
     1. **Step 1 — `ETHY/0` 1-Hop State Witness (`0x0b GET_STATE_WITNESS`):**
        - Route to connected `ETHY/0` peers covering bucket `b` (preferring peers with `trieBucketsBitmask & (1 << b)` once Option C is active, then any peer holding bucket `b` or cached witnesses).
        - Verify returned `0x0c STATE_WITNESS` via `verifyStatyMultiProof`, fold local verified BALs `(anchorBlock + 1 .. #Head)` via `foldWitnessToHead`, commit account/slots/proven-empty tombstones into `FlatStateManager`, and cache verified witness in `EthyWitnessStore` for P2P re-serving.
     2. **Step 2 — `ETHY/0` 1-Hop Proven Custody Chunk (Option B Zero-`snap/1` Cold Miss!):**
        - For keys still unresolved after Step 1 (e.g. custodian holds flat slabs without a live subtree trie yet):
          - **Account miss:** Send targeted `0x03 GET_PROVEN_ACCOUNT_CHUNK(bucket = b, originHash = accountHash)` to a bucket-`b` custodian whose `basePivotBlock >= localBalEarliestBlock`. Verify `verifyMerkleRangeProof(chunkStateRoot, origin, last, slab136B, proofNodesRlp)`.
            - If `accountHash` is in the chunk → fold local BALs `(chunkBlockNumber + 1 .. #Head)` and commit!
            - If `origin <= accountHash <= last` and `accountHash` is **absent** from the sorted chunk (or `accountHash < origin` on the first chunk / `accountHash > last` with `hasRight === 0`) → **cryptographically proven non-existent at `chunkBlockNumber`**! Check `BalWriteIndex`: if untouched in BALs since `chunkBlockNumber`, commit a **Proven-Empty Tombstone**!
            - Opportunistically warm hot neighbor accounts from the verified chunk into cache as well!
          - **Storage miss (after account's `storageRoot` is known):**
            - If `storageRoot === KECCAK256_RLP` → immediately commit Proven-Empty Tombstone (0 network calls!).
            - Otherwise query a custodian with `storageBucketsBitmask & (1 << b)` via `0x05 GET_PROVEN_STORAGE_OR_CODE` (`kind = 2` for complete small-contract trie, falling back to `kind = 1` chunk covering `slotHash`), verify Merkle root/range proof, fold local BALs `(chunkBlockNumber + 1 .. #Head)`, and commit value or proven-empty tombstone!
     3. **Step 3 — Explicit `--snap-bootstrap` Fallback ONLY (`snapBootstrapEnabled && policy === 'full'`):**
        - **Disabled by default (`0` `snap/1` calls on all normal clients!).** If no `ETHY/0` custodian covers bucket `b` on a default client, return `undefined` cleanly so `FlatStateManager` throws `StateMissUnavailableError` (`-32000` honest JSON-RPC error, never fabricating a false zero!).
        - Only when `--snap-bootstrap` was explicitly passed AND `policy === 'full'` (e.g. a solo Day-0 origin seeder before its own sync completes): fetch a single-key `snap/1` proof, verify, fold local BALs, commit to `FlatStateManager`, and persist into local `EthyWitnessStore`.
   - **Code Resolution (`resolveCodeMiss`):**
     - Check `SharedCodeStore` → query `ETHY/0` `0x05` (`kind = 0`) from bucket-`b` / code-advertising peers → verify `keccak256(code) === codeHash` → persist to `SharedCodeStore` (`snap/1 GetByteCodes` only if `snapBootstrapEnabled && policy === 'full'`).

4. **End-to-End Offline Loopback & Transition Tests (`packages/ethy/test/custodyEthySync.spec.ts`):**
   - **Zero-`snap/1` 1-Hop Cold-Miss Loopback:** Custodian Node A holds verified bucket `0x0` (accounts + code + small `kind = 2` contract + large multi-chunk `kind = 1` contract) over `ETHY/0` `v0.4`; Joiner Node B (`--custody 1` on bucket `0x1`, **zero `snap/1` peers**) boots from rolling BALs and executes cold `eth_getBalance`, `eth_getStorageAt` (both present and proven-empty non-existent keys!), `eth_getCode`, and `eth_call` targeting bucket `0x0` — asserting **100% success, `0` `snap/1` calls**, and verified BAL folding across post-pivot mutations!
   - **Policy Isolation Test:** Confirm a `'swarm-only'` miss on an uncovered bucket throws `StateMissUnavailableError` without touching `snap/1`, while a `'full'` miss on the same key resolves cleanly.
   - **Hybrid `--full` (`--custody 16`) Open-World → Closed-World Flip Test:** Continuously run `eth_call` while buckets finish background sync and flip `closedBucketsMask` to `0xffff`, asserting zero failed RPC calls and zero outbound network queries once closed.
   - **`v0.2` Peer Interop Test:** Confirm `v0.4` joiner cleanly handles a `v0.2` 9-tuple accounts-only peer without disconnecting or stalling.

---

### Acceptance Criteria (`WP-16d`)
- [ ] `ethy` defaults to `--custody 2` (1/8th of Ethereum; live in minutes via rolling `eth/71` BALs + background 3-plane custody sync); `--custody 1..16` and `--full` (`16`) work cleanly, and `--custody 0` is rejected.
- [ ] Open-World cold misses resolve in 1 hop over `ETHY/0` (`0x0b` witness → `0x03`/`0x05` targeted custody chunk + BAL fold) with **zero `snap/1` calls** when a bucket custodian is connected.
- [ ] Unresolved misses throw `StateMissUnavailableError`; `'swarm-only'` never calls `snap/1`; completed custody buckets flip atomically to Closed-World and advertise honest per-plane `ETHY/0 STATUS` bitmasks.
- [ ] `npm run tsc`, `npm test`, and `npm run spellcheck` pass in `packages/ethy`.

---

## 2. Concrete Implementation Plan (Planner — Grok 4.7)

*(To be filled out by Grok 4.7 before implementation begins.)*

---

## 3. Implementation Notes & Deviations (Implementer — Composer 2.5)

*(To be filled out by Composer 2.5 upon completion.)*
