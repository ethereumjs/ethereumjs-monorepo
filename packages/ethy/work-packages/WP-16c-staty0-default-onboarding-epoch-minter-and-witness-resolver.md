<!-- cspell:ignore dedup -->
# WP-16c: `@ethereumjs/ethy` — `STATY/0` Default Fast Onboarding, Hot Epoch Bundle Sync, `O(1)` Micro-Epoch Minter & Cold-Miss Witness Pipeline

- **Status:** `READY_FOR_PLANNING`
- **Dependencies:** `WP-16a` (`READY_FOR_PLANNING`), `WP-16b` (`READY_FOR_PLANNING`), `WP-08b` (`DONE`), `WP-14` (`DONE`), [`protocols/devp2p/STATY-0-SPEC.md`](../../../../protocols/devp2p/STATY-0-SPEC.md) § 4, § 7, § 8
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Holistic Scope & Architectural Requirements

### Goal
Wire **`STATY/0`** end-to-end as Ethy's **default fast-onboarding protocol** so a fresh `ethy sepolia` (or `ethy mainnet`) launch goes from zero disk state to **live, consensus-verified JSON-RPC (`eth_call`, ENS resolution, ERC-20/DeFi queries, AI contract forensics) in `3–5` minutes (`~3–10 GB` disk)** — while symmetrically giving back Hot Epoch Bundles, cached witnesses, contract bytecodes, and its rolling `8,192`-block `eth/71` BAL window to the P2P network.

---

### Key Deliverables (`WP-16c`)

1. **Shared Binary Block Calendar (`packages/ethy/src/sync/blockCalendar.ts`):**
   - Canonical power-of-two constants shared by `STATY/0` and `ETHY/0`:
     - `CANONICAL_PIVOT_GRID_BLOCKS = 32n` (`K`)
     - `STATY_MICRO_EPOCH_BLOCKS = 256n` (`E`)
     - `MACRO_GENERATION_GRID_BLOCKS = 1_024n` (`G`)
     - `STATY_MACRO_DAY_BLOCKS = 4_096n` (`D`, `16` micro-epochs)
     - `DEFAULT_BAL_WINDOW_BLOCKS = 8_192n` (`2D`, `32` micro-epochs)
     - `EPOCH_FINALITY_DELAY_BLOCKS = 8n`
   - Pure calendar helpers: `epochForBlock`, `anchorBlockForEpoch`, `macroDayForEpoch`, `dedupBaseEpochForEpoch`, `onboardingBalStartBlock(headBlock)`.

2. **Default `STATY/0` Fast Onboarding & Hot Epoch Sync (`packages/ethy/src/staty/statyOnboarding.ts`, `epochSync.ts`):**
   - **Step 1 — Rolling `eth/71` BAL Window (`Macro-Day (d - 1) .. #Head`):**
     - Anchor head via `@ethereumjs/beacon-light` (or best verified P2P head in `p2p_only`).
     - Reuse the high-throughput `WP-14` `eth/71` BAL catch-up pipeline (`balPipeline.ts`) to pull and verify contiguous `(headerRlp, balRlp)` from `onboardingBalStartBlock(#Head)` through `#Head` (`4,096..8,192` blocks).
     - Populate `StatyWriteIndex` + apply BAL writes to `FlatStateManager` (`closedBucketsMask = 0x0000` in default `STATY/0` mode) + persist verified bundles into the shared rolling BAL archive so the node immediately serves them back over **`eth/71`**!
   - **Step 2 — Rarest-First Hot Epoch Bundle Striping (`epochSync.ts`):**
     - Discover servable epochs from connected `STATY/0` peers (`STATUS.latestEpoch`, `STATUS.epochMask`).
     - Download missing micro-epochs in `[(d - 1) * 16 .. latestClosedEpoch]` rarest-first:
       - `GET_EPOCH_MANIFEST (0x01)` → verify `anchorBlock === e * 256` and `anchorStateRoot === verifiedHeader(anchorBlock).stateRoot`.
       - Stripe `GET_EPOCH_PART (0x03)` across peers (shards `0x0..0xf`, parallel worker verification via `SnapVerifyPool` or dedicated verifier worker).
       - Verify every part (`verifyStatyMultiProof`), fold local BALs (`foldWitnessToHead`), commit to `FlatStateManager`, persist to `StatyStore`, and **immediately flip the epoch bit in outbound `STATY/0 STATUS.epochMask`** to start seeding!
   - **Step 3 — Content-Addressed Bytecode Batching (`GET_BYTECODES`, `0x07`):**
     - Collect distinct missing `codeHash` values from verified accounts (excluding `KECCAK256_NULL` and hashes already in `SharedCodeStore`), pull in batches of `64` via `STATY/0 GET_BYTECODES` (with `snap/1 GetByteCodes` fallback only if no `STATY/0` peer holds a hash), verify `keccak256(code) === codeHash`, and persist to `SharedCodeStore`.
   - **Zero-Seeder Cold Bootstrap Resilience:**
     - If `0` `STATY/0` peers exist on a brand-new network (e.g., first Ethy node on Sepolia!), do **not** stall: transition to live `HEAD_FOLLOWING` immediately after the rolling `eth/71` BAL window completes, resolve misses via the Cold-Miss Pipeline below, and mint the current closed micro-epoch via the `O(1)` Epoch Minter to seed the very first Hot Epoch Bundle for the swarm!

3. **Deterministic `O(1)` Micro-Epoch Minter (`packages/ethy/src/staty/epochMinter.ts`):**
   - **Deterministic Key-Set Extraction (`extractEpochKeySet`):**
     - Given verified local BALs for `[(dedupBaseEpoch - 1) * 256 + 1 .. e * 256]`:
       - `accountSet(e)`: every `address` appearing in any BAL of epoch `e` (read-only OR partially written) not already seen in `[dedupBaseEpoch .. e - 1]`.
       - `slotSet(e)`: every `(address, slot)` appearing in `storageReads` of epoch `e` that had **no** `storageChanges` write in `[dedupBaseBlock .. e * 256]` and was not already proven in `[dedupBaseEpoch .. e - 1]`.
     - Partition by `accountHash` high nibble `0x0..0xf`, enforce self-contained parts (`<= 256 KB` target; any part containing slots for `accountHash` includes `accountHash`'s account entry), and deduplicate `proofNodes[]` per part.
   - **Decentralized `O(1)` Hash-Lottery Election:**
     - Reuse the IEEE-754 top-53-bit uniform lottery math (`keccak256(localNodeId || bigIntToBytes(e))`) with `W_min = 10s`, `T_target = 45s`, `lambda = 1.5`, `W_max = 300s`, uptime/reachability weight $w \in [0.25, 4.0]$.
     - Broadcast `mintingEpoch = e` in `STATY/0 STATUS` while pulling proofs from `snap/1` at `anchorBlock = e * 256` (validating `e * 256 <= bestVerifiedHead` and enforcing `STATY_MINT_LIVENESS_TIMEOUT_MS = 180_000 ms` anti-suppression guard on remote minters).
     - Pull point proofs from `snap/1` (`GetAccountRange(origin=H, limit=H)` + `GetStorageRanges(origin=S, limit=S)`), build deduplicated `proofNodes[]` parts, verify locally before persisting to `StatyStore`, and broadcast updated `STATUS` (`latestEpoch = e`, `mintingEpoch = 0`).

4. **Coalesced Cold-Miss Resolution Pipeline (`packages/ethy/src/staty/witnessResolver.ts`):**
   - Wires directly into `FlatStateManager`'s `WP-16b` open-world miss hooks (`resolveAccountMiss`, `resolveStorageMiss`, `resolveCodeMiss`), automatically powering:
     - JSON-RPC (`eth_getBalance`, `eth_getTransactionCount`, `eth_getCode`, `eth_getStorageAt`, `eth_call`, `eth_estimateGas`, `eth_createAccessList`),
     - Local `IdentityResolver` (live ENS resolution on Sepolia/Mainnet!), and
     - AI Contract Forensics view probes (`WP-15`).
   - **2-Tier Resolution Strategy (Policy-Aware):**
     - **Coalesce:** Batch concurrent misses within a short micro-window (e.g., `10–25 ms` during EVM `SLOAD` bursts) up to `64` accounts / `256` slots.
     - **Tier 1 (`STATY/0` Swarm):** Fan out `GET_WITNESSES (0x05)` (`minAnchorBlock = localBalEarliestBlock`) to `2–3` best `STATY/0` peers. Verify, fold BALs, commit to `FlatStateManager`, cache in `StatyStore`.
     - **Tier 2 (`snap/1` Global Miss Fallback — `'full'` Policy Only):** Only when `policy === 'full'` (user RPC / explicit microscope / wallet tx) AND keys remain unresolved after Tier 1, issue targeted `snap/1` single-key proof request at a recent verified block `B` (`#Head - B <= 64`). Verify against `header(B).stateRoot`, fold BALs, commit to `FlatStateManager`, **persist in `staty/witnesses/`**, and update `STATY/0 STATUS.witnessCountHint` so the swarm never hits `snap/1` twice for the same cold contract! When `policy === 'swarm-only'` (background AI probes), skip Tier 2 completely (zero `snap/1` leeching) and let unresolved keys surface `StateMissUnavailableError` cleanly.
   - **Telemetry Counters:** Track `localHits`, `tombstoneHits`, `statyWitnessHits`, `snapFallbackHits`, and `missTimeouts` on `EthySpine` so `/staty` and diagnostics reflect real hit ratios honestly.

5. **Laptop-Sleep & Multi-Day `STATY/0` Resume (`packages/ethy/src/staty/statyResumePolicy.ts`):**
   - Unlike legacy `SNAP_RESUME_MAX_GAP = 90n` / `MAX_BAL_BRIDGE_BLOCKS = 900n`, `STATY/0` makes restart and laptop-sleep wake-ups fast across any downtime:
     - **Gap `<= 8,192` blocks (`<= 27.3h`):** Stream only missing `eth/71` BALs (`lastVerifiedBlock + 1 .. #Head`) + fetch missed `E = 256` micro-epochs over `STATY/0` → back live in `15–30s` with 100% of cached `staty/witnesses/` preserved!
     - **Gap `> 8,192` blocks (days or weeks):** Keep **100% of shared `code/`**, `contract-dossiers.json`, and `peerBook`, evict expired witnesses (`anchorBlock < newLocalBalEarliestBlock`), and re-warm the fresh `2D` rolling BAL tail + `16..32` Hot Epoch Bundles in `3–4` minutes.

6. **End-to-End Multi-Node `STATY/0` Loopback Integration Tests (`packages/ethy/test/statyLoopback.spec.ts`):**
   - Build a realistic offline `@ethereumjs/mpt` world state (ERC-20 contract + ENS-style resolver contract + cold contract) plus a multi-block verified BAL stream.
   - **Test 1 (Full Epoch Sync, Zero `snap/1` on Joiner):** Node A mints micro-epoch `e` from synthetic `snap/1` + BALs; Node B connects **only** to Node A over `eth/71` + `STATY/0` (`snap/1` disabled), syncs the BAL window + Hot Epoch Bundle + Bytecodes, and executes a verified local `eth_call` (`balanceOf` / `name`) returning exact consensus results!
   - **Test 2 (Cold-Miss Swarm Amplification):** Node B queries an untouched cold contract → triggers `1` `snap/1` fallback, verifies, caches in `staty/witnesses/`; Node C queries the exact same cold contract → resolved **100% from Node B over `STATY/0 GET_WITNESSES`** with **zero `snap/1` requests**!
   - **Test 3 (Stale-Proof Rejection):** Malicious peer returns a witness anchored before `localBalEarliestBlock` or with corrupted proof nodes → rejected & peer quarantined without polluting `FlatStateManager`.

---

### Acceptance Criteria (`WP-16c`)
- [ ] Default `ethy [network]` starts in `STATY/0` mode (`closedBucketsMask = 0x0000`), syncs the rolling `eth/71` BAL window + available `STATY/0` Hot Epoch Bundles + bytecodes, and reaches live verified JSON-RPC (including `eth_call` and live ENS resolution).
- [ ] Cold misses resolve via `STATY/0 GET_WITNESSES` first and `snap/1` only on global swarm miss, immediately caching and re-serving verified witnesses.
- [ ] `O(1)` micro-epoch minter extracts deterministic BAL key sets, mints self-contained `<= 256 KB` shard parts, and respects `mintingEpoch` suppression + 3-minute liveness timeout.
- [ ] Multi-node loopback tests, `npm run tsc`, `npm test`, and `npm run spellcheck` pass in `packages/ethy`.

---

## 2. Concrete Implementation Plan (Planner — Grok 4.7)

*(To be filled by Grok 4.7)*

---

## 3. Implementation Notes & Deviations (Implementer — Composer 2.5)

*(To be filled by Composer 2.5)*
