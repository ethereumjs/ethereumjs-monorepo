# WP-07e: 20×–50× BAL Catch-Up & Bridge Engine — Multi-Block `eth/71` Batching (`16`–`32` Blocks/RTT), Parallel Header/BAL/Body Pipeline, Cross-Block BAL Compaction & `@ethereumjs/statemanager` `consumeBALBatch`

- **Status:** `READY_FOR_PLANNING`
- **Dependencies:** `WP-04k` (`DONE`), `WP-06d` (`DONE`), `WP-07d` (`DONE`)
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Holistic Scope & Architectural Requirements

### Goal
Accelerate `BAL_CATCHUP`, `bridge-pivot` (`WP-06d`), and `SNAP_SYNCING` parallel BAL streaming from **~1.5–2 blocks/sec** to **30–80+ blocks/sec (20×–50× speedup)** — turning a 5,268-block (~17.5 hour) catch-up gap from a 45-minute wait into **~1–2 minutes** — by eliminating per-block network round-trips, redundant intermediate disk I/O, and un-compacted per-block cold account lookups.

---

## 2. Root-Cause Forensic Analysis (From Live Screenshot at `#12,098,097 → +5,105 blk`)

Why is `BAL Catch-Up` currently progressing at only **~1.5–2 BALs/sec** (`163 / 5,268 BALs applied` at `125 ms` peer latency)?

### Bottleneck 1: 4 Sequential Network RTTs for Every Single Block (`1` Block in Flight!)
Look at `startBlockBundleByNumber` + `advanceBlockBundleEthMessage` in `packages/ethy/src/sync/blockBundle.ts` (`lines 157–265`):
- For **each individual block `N`**, `BalChainStreamer` executes **4 strictly sequential P2P round-trips** before even requesting block `N + 1`:
  1. `GET_BLOCK_HEADERS(block = N, max = 1)` → wait 1 RTT (`~125ms`)
  2. `GET_BLOCK_BODIES([hash_N])` → wait 1 RTT (`~125ms`)
  3. `GET_RECEIPTS([hash_N])` → wait 1 RTT (`~125ms`)
  4. `GET_BLOCK_ACCESS_LISTS([hash_N])` → wait 1 RTT (`~125ms`)
- At `125 ms` RTT, `4 × 125 ms = 500 ms` of pure network wait time per block, hard-capping throughput at **`<= 2 blocks/sec`** regardless of CPU or bandwidth!
- Yet the `eth/69–71` wire protocol (`GET_BLOCK_HEADERS`, `GET_BLOCK_BODIES`, `GET_RECEIPTS`, `GET_BLOCK_ACCESS_LISTS`) natively accepts **`max = K` headers** and **arrays of `K` block hashes (`[h_1, h_2, ..., h_K]`)** in a single wire message!

### Bottleneck 2: Fetching Full `Bodies` + `Receipts` + Full TX Decode for Thousands of Historical Catch-Up Blocks
Look at what `BAL_CATCHUP` actually needs for blocks that are **older than the 64-block Rolling Serving & Economy Window** (`blockNumber <= targetHead - 64n`):
- `RollingBlockStore` (`packages/devp2p/src/serve/rollingBlockStore.ts:35`) and `ETHEconomyDataManager` (`ECONOMY_WINDOW_BLOCKS = 64`) **only retain the most recent 64 blocks**!
- When catching up across `5,268` blocks (`#12,098,097 .. #12,103,202`), for the first **`5,204` blocks**, we are downloading `GET_BLOCK_BODIES` (`~100–200 KB/block` = **~700 MB** of historical transactions) and `GET_RECEIPTS` (`~80 KB/block` = **~400 MB** of receipts), running `createTxFromBlockBodyData` on **~700,000 transactions**, and inserting them into `RollingBlockStore` and `ETHEconomyDataManager` **only to immediately evict them 64 blocks later**!
- For historical catch-up blocks where `blockNumber <= targetHead - 64n`, state correctness requires **only**:
  1. **`BLOCK_HEADERS`** (verifying parentHash chain continuity, `stateRoot`, and `blockAccessListHash`)
  2. **`BLOCK_ACCESS_LISTS`** (verifying `keccak256(balRlp) === header.blockAccessListHash` and applying state changes)!
  *(Plus updating lightweight header-level economy fee trends if desired, while only fetching full `Bodies` + `Receipts` for the final 64-block tail `blockNumber > targetHead - 64n` and live head following!)*

### Bottleneck 3: Un-Compacted Per-Block `consumeBAL` & Cold Disk Binary-Search Repeats
When applying `K = 32` (or `64`) consecutive BALs during catch-up:
- Hot contracts (`WETH`, `USDC`, `Uniswap Router`, `EntryPoint`, sequencers) and active EOAs are touched in **almost every single block**.
- Applying 32 BALs one by one calls `stateManager.consumeBAL(bal_i)` 32 times, repeating `createAddressFromString`, `keccak256(address)`, `modifyAccountFields`, `putStorage(keccak256(slot))`, and synchronous disk binary-search `coldAccountLookup` for the same accounts/slots over and over!
- Because EIP-7928 BALs record **post-values** (`postBalance`, `postNonce`, `newCode`, `postValue` per storage slot), **merging `K` consecutive verified BALs into a single compacted JSON block access list (or `consumeBALBatch` in `@ethereumjs/statemanager`) is 100% mathematically exact**:
  - For any account `A` touched across blocks `b_1 .. b_K`:
    - The final `postBalance` in the latest block `b_i` that changed `A`'s balance wins.
    - The final `postNonce` in the latest block `b_i` that changed `A`'s nonce wins.
    - The final `newCode` in the latest block `b_i` that changed `A`'s code wins.
    - For each storage slot `S`, the final `postValue` in the latest block `b_i` that wrote `S` wins!
    -*(Edge case preserved: if an account is EIP-161 deleted in an intermediate block `b_d` — `postBalance === 0 && postNonce === 0 && no code && no storage writes` — any storage slots from earlier blocks `< b_d` are cleared before applying blocks `> b_d`.)*

### Bottleneck 4: Per-Block Synchronous `writeFileSync` + `renameSync` in `BAL_CATCHUP`
During `BAL_CATCHUP`, `finishCatchUpBlock` (`balSync.ts:345`, `377`) calls:
- `appendHealBal` → `fs.writeFileSync("${blockNumber}.bal", balRlp)` on every block (even though `BAL_CATCHUP` already applies the BAL immediately to `stateManager` and base sync is already complete!), and
- `noteVerifiedBlock` → `writeAtomicDoc('active.json')` (`writeFileSync` + `renameSync`) on **every single block** (`5,268` atomic file renames in a row!).

---

## 3. Architectural Design (`@ethereumjs/statemanager` + `@ethereumjs/devp2p` + `@ethereumjs/ethy`)

### A. Upstream Enhancement in `@ethereumjs/statemanager`: `mergeBALs` & `consumeBALBatch`
In `packages/statemanager/src/consumeBAL.ts` (and exported from `@ethereumjs/statemanager`):
1. **`mergeBALs(accessLists)`:**
   - Pure, deterministic helper that compacts an ordered sequence of JSON block access lists `[B_1, B_2, ..., B_K]` into a single JSON block access list:
     - Tracks per-address `{ latestBalance, latestNonce, latestCode, storageSlots: Map<slotHex, postValue>, storageReads: Set<slotHex> }`.
     - Handles EIP-161 intermediate account deletion cleanly (if at block `B_i` the account becomes empty with zero balance, zero nonce, empty code, and no storage changes, clears `storageSlots` accumulated from `B_1 .. B_{i-1}`).
     - Emits a single compacted JSON block access list where each touched address and storage slot appears **at most once**.
2. **`consumeBALBatch(stateManager, accessLists, opts?: ConsumeBALOptions): Promise<void>`** (and `FlatStateManager.consumeBALBatch`):
   - Compacts `accessLists` via `mergeBALs(accessLists)` and applies the merged state diff in a single pass, checking `opts.expectedStateRoot` once at the end if provided.
   - Cuts `keccak256` address/slot hashing, `FlatStateManager` arena writes, and cold-account disk lookups by **5×–15×** across a 32-block batch!

### B. Multi-Block `eth/71` Wire Batch Builders & Parsers (`packages/ethy/src/net/pivotHeader.ts`)
Add clean, backwards-compatible batch wire helpers alongside the existing single-block functions:
1. **`encodeGetBlockHeadersRangePayload(ethVersion, startBlock: bigint, maxHeaders: number, requestId): Uint8Array`**
   - Encodes `GET_BLOCK_HEADERS` with `block = startBlock`, `max = maxHeaders` (e.g. `32`), `skip = 0`, `reverse = false`.
2. **`parseBlockHeadersBatchPayload(ethVersion, payload, startBlock, chain): Array<{ number: bigint; hash: Uint8Array; stateRoot: Uint8Array; balHash?: Uint8Array; headerRlp: Uint8Array }> | null`**
   - Decodes contiguous headers `[startBlock, startBlock + 1, ...]`, verifying that each header's `number` increments by `1` and `header[i].parentHash === header[i - 1].hash`!
3. **`encodeGetBlockAccessListsBatchPayload(ethVersion, blockHashes: Uint8Array[], requestId): Uint8Array`** & **`parseBlockAccessListsBatchPayload(payload): Uint8Array[] | null`**
   - Requests up to `32` BALs in a single `GET_BLOCK_ACCESS_LISTS` message (`[reqId, [hash_1, ..., hash_K]]`) and parses the returned list of RLP-encoded BALs (`lists[0 .. m-1]`).
   - Handles partial peer responses gracefully (if a peer caps its reply at 2 MiB and returns `m < K` BALs, verifies those `m` BALs against `headers[0 .. m-1].blockAccessListHash` and advances from `startBlock + m`!).
4. **`encodeGetBlockBodiesBatchPayload` / `parseBlockBodiesBatchPayload`** and **`encodeGetReceiptsBatchPayload` / `parseReceiptsBatchPayload`**
   - Requests bodies and receipts in batches for the final 64-block serving/economy window (`blockNumber > targetHead - 64n`) or when `SNAP_SYNCING` / `HEAD_FOLLOWING` gap is small.

### C. High-Throughput Batch Pipeline in `BalChainStreamer` (`packages/ethy/src/sync/balSync.ts`)
1. **Batch Size & Mode Selection:**
   - When the gap `targetHead - tip >= 4n`, `BalChainStreamer` switches from 1-by-1 `InFlightBlockBundle` to **Batch Catch-Up Mode (`BAL_BATCH_SIZE = 32` blocks per batch)**:
     - **Fast Historical Catch-Up (`blockNumber <= targetHead - 64n`):**
       - **2 RTTs per 32 blocks (instead of 128 RTTs!):**
         1. `GET_BLOCK_HEADERS(start = tip + 1, max = 32)` → 1 RTT
         2. `GET_BLOCK_ACCESS_LISTS([hash_1 .. hash_32])` → 1 RTT
       - Verifies each `balRlp[i]` against `header[i].blockAccessListHash`.
       - Calls `stateManager.consumeBALBatch(accessLists)` once for the entire batch!
       - Feeds header- + BAL-level telemetry (`headerRlp` + `balJson`) into `ETHEconomyDataManager` for the tail of the catch-up so `State / BAL` and `Hot Contract` in the `Economy` cockpit box are immediately populated even before the final 64 blocks!
     - **Full Bundle Tail (`blockNumber > targetHead - 64n`, or small gaps `< 4` blocks):**
       - Fetches full 4-part bundles (in batches up to `8–16` blocks or pipelined) so `RollingBlockStore` (`Served`) and `ETHEconomyDataManager` (`Activity` TPS / ETH volume + `Recent blocks`) are 100% populated as the node hits `HEAD_FOLLOWING`.
2. **Multi-Peer Selection & Failover:**
   - Instead of pinning `this.catchUp` to a single peer that might be slow or rate-limiting, `pickEthPeers()` ranks connected `eth/71` peers by lowest `avgLatencyMs` and rotates/fails over immediately on timeout or empty reply.
3. **Batched Disk Metadata Checkpointing:**
   - During `BAL_CATCHUP`, `noteVerifiedBlock` flushes `active.json` once per batch (every `32` blocks, and on completion of catch-up) instead of on every single block, and skips redundant `.bal` file writes when `baseSyncComplete` is already true.
4. **Live Rate & ETA in `Node Pulse` (`cockpit.ts`):**
   - During `BAL_CATCHUP` (and `Snap Resume · Bridging`), `Node Pulse` displays the live catch-up velocity (`blk/s`) and ETA (`~1m`) on the `Progress` / `State` rows (`1,840 / 5,268 BALs · 48/s`).

---

## 4. Expected Throughput Impact

| Metric | Before (`WP-07d`) | After (`WP-07e`) | Improvement |
| --- | --- | --- | --- |
| **Network RTTs per 32 Catch-Up Blocks** | `128 RTTs` (`4 × 32`) | **`2 RTTs`** (`Headers` + `BALs`) | **64× fewer RTTs** |
| **Bandwidth for 5,000 Catch-Up Blocks** | `~1.1 GB` (all bodies + receipts + BALs) | **`~75 MB`** (headers + BALs + last 64 full bundles) | **~15× less data** |
| **`FlatStateManager` / Cold Disk Lookups** | 32 separate passes per 32 blocks | **1 compacted `consumeBALBatch` pass** | **5×–15× fewer lookups** |
| **Wall Time for 5,268-Block Catch-Up (`125ms` RTT)** | **~45–55 minutes** (`~1.6 blk/s`) | **~60–90 seconds** (`~60–80 blk/s`) | **30×–45× faster** |

---

## 5. Acceptance Criteria (`WP-07e`)

- [ ] `@ethereumjs/statemanager` exports `mergeBALs` and `consumeBALBatch` (and `FlatStateManager.consumeBALBatch`), with unit tests in `packages/statemanager/test/consumeBAL.spec.ts` verifying multi-block balance/nonce/code/storage compaction and intermediate EIP-161 account deletion semantics.
- [ ] `packages/ethy/src/net/pivotHeader.ts` adds batch wire encoders and parsers for `GET_BLOCK_HEADERS` (`max <= 32`), `GET_BLOCK_ACCESS_LISTS` (`<= 32` hashes, handling partial peer replies `< K`), `GET_BLOCK_BODIES`, and `GET_RECEIPTS`.
- [ ] `BalChainStreamer` (`packages/ethy/src/sync/balSync.ts`) uses 32-block batched `HEADERS + BAL` catch-up for historical blocks (`<= targetHead - 64n`) and full-bundle batching for the 64-block tail, applying state via `consumeBALBatch` and throttling `noteVerifiedBlock` disk writes to once per batch.
- [ ] `ETHEconomyDataManager` populates `State / BAL` and `Hot Contr.` whenever `balJson` is present (including during batched BAL catch-up), and `Node Pulse` displays live `BALs/s` rate and ETA during `BAL_CATCHUP`.
- [ ] Unit tests in `packages/ethy/test/balCatchUp.spec.ts` verify 32-block batched catch-up, partial peer BAL replies (`m < K`), parentHash chain verification, and transition into the 64-block full-bundle tail.
- [ ] `npm run tsc`, `npm test`, and `npm run spellcheck` pass in both `@ethereumjs/statemanager` and `@ethereumjs/ethy`.

---

## 6. Concrete Implementation Plan (Planner — Grok 4.7)

*(To be filled by Grok 4.7 during planning)*

---

## 7. Implementation Notes & Deviations (Implementer — Composer 2.5)

*(To be filled by Composer 2.5 during implementation)*
