# WP-03c: Honest Block-Range Advertising (`earliestBlock` Fix) & Full Rolling-Window `eth/69–71` Server

- **Status:** `READY_FOR_PLANNING`
- **Dependencies:** `WP-00` (`DONE`), `WP-01` (`DONE`), `WP-02` (`DONE`), `WP-03` (`DONE`), `WP-03b` (`DONE`)
- **Branch:** `ethy-new-wp` (or dedicated continuation branch)
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Strategic Context & Protocol Forensics

### Why This Is Critical for Both Peer Stability AND Community Ethos
In `eth/69` ([EIP-7642](https://eips.ethereum.org/EIPS/eip-7642)), `eth/70` ([EIP-7975](https://eips.ethereum.org/EIPS/eip-7975)), and `eth/71` ([EIP-8159](https://eips.ethereum.org/EIPS/eip-8159)), protocol versions are **cumulative ("old version encompassing")**:
- Any node announcing `[earliestBlock, latestBlock, latestBlockHash]` in `Status (0x00)` or `BlockRangeUpdate (0x11)` is making a **binding protocol promise** that for **every block `N` in `[earliestBlock .. latestBlock]`**, it holds and will serve the full `eth` historical data set:
  1. `GetBlockHeaders (0x03)` → `BlockHeaders (0x04)` (by block hash or block number, with `limit`, `skip`, and `reverse`)
  2. `GetBlockBodies (0x05)` → `BlockBodies (0x06)`
  3. `GetReceipts (0x0f)` → `Receipts (0x10)` (`eth/69` bloom-free receipts and `eth/70` paginated receipts with `firstBlockReceiptIndex` / `lastBlockIncomplete`)
  4. `GetBlockAccessLists (0x12)` → `BlockAccessLists (0x13)` (`eth/71` EIP-7928 BALs, or `0x80` when pre-Amsterdam / unavailable)
- Conversely, on **`snap/1`**, a flat-state client (`FlatStateManager`) does not hold the 128-root intermediate Merkle Patricia Trie node database required to generate arbitrary dynamic range proofs (`GetAccountRange`, `GetStorageRanges`) or heal tries (`GetTrieNodes`). Therefore, Ethy acts strictly as a **client** on `snap/1` (answering inbound `snap/1` `GET_*` with fast `<1ms` empty replies) and acts as a **100% honest, spec-compliant Rolling-Window Server on `eth/69–71`**.

### The "Smoking Gun" Causing `snap peer left` Disconnects During Sync
Audit of our current `STATUS` and `setBlockRange` calls revealed a major protocol violation:
1. **In `packages/devp2p/src/lab/messages/eth.ts:27`:**
   `ethStatusFromFields` sets `earliestBlock: intToUnpaddedBytes(0)` whenever `fields.earliestBlock` is omitted, while `latestBlock` is set to `#12,012,897` (in `genesisStatus.ts`).
2. **In `packages/ethy/src/net/peerCoordinator.ts:227` (when the pivot header is anchored):**
   ```ts
   client.setBlockRange(intToUnpaddedBytes(0), bigIntToUnpaddedBytes(parsed.number), parsed.hash)
   ```
   **What this did on the live network:** It broadcast `BLOCK_RANGE_UPDATE: [earliest = 0, latest = 12,020,039]` to every connected Geth, Reth, and Nethermind peer — claiming that Ethy is a **full archive history node holding all 12 million blocks from Genesis (`#0`) to `#12,020,039`!**
   Seconds later, when those peers requested `GetBlockHeaders`, `GetBlockBodies`, or `GetReceipts` for historical blocks in `0 .. 12,020,039`, our worker replied with an empty list `[]`. Geth and Reth immediately scored us as a lying/faulty peer and disconnected (`Bucket 0x0: snap peer left`!).

---

## 2. Key Architectural Design: Honest Range + Full Rolling-Window `eth/69–71` Server

### 1. Honest `earliestBlock` Contract
- **Before we have a complete servable block bundle (Header + Body + Receipts):**
  - In outbound `eth/69+` `STATUS` (`genesisStatus.ts` / `ethStatusFromFields`), set `earliestBlock = latestBlock` (and once we fetch the complete single pivot block bundle `#P` — its Header, Body, and Receipts — we advertise `earliestBlock = #P, latestBlock = #P, latestBlockHash = hash(#P)`!).
  - Never advertise `earliestBlock = 0` unless block `#0` through `latestBlock` are actually stored and servable!
- **As our Rolling Window grows (`[W_earliest .. W_latest]`):**
  - Whenever a contiguous block is added to (or pruned from) our `RollingBlockStore`, we update `setBlockRange(W_earliest, W_latest, W_latestHash)` (throttled per EIP-7642 guidance or on initial pivot readiness) so our advertised `[earliestBlock .. latestBlock]` is **100% backed by real, servable data**.

### 2. Natural Library Split: `@ethereumjs/devp2p` vs. `@ethereumjs/ethy`

#### A. What Belongs in `@ethereumjs/devp2p` (`packages/devp2p/src/serve/` & `src/worker/`)
`@ethereumjs/devp2p` should provide a first-class, reusable **Rolling-Window `ETH` Content Server & Resource Governor** so any user of `@ethereumjs/devp2p` (or `createThreadedNetwork`) can serve `eth/68–72` blocks cleanly inside the worker thread:

1. **`RollingBlockStore` (`packages/devp2p/src/serve/rollingBlockStore.ts`):**
   - Stores a bounded window of complete blocks (default capacity `maxBlocks = 64`, ~5–15 MB RAM):
     ```ts
     export interface ServableBlockBundle {
       number: bigint
       hash: Uint8Array // 32 bytes
       headerRlp: Uint8Array // Raw RLP-encoded BlockHeader
       bodyRlp: Uint8Array // Raw RLP-encoded BlockBody ([txsRlp, unclesRlp, withdrawalsRlp?])
       receiptsEth69Rlp: Uint8Array // RLP list of bloom-free receipts [txType, postStateOrStatus, cumulativeGas, logs]
       balRlp?: Uint8Array // Optional RLP-encoded EIP-7928 BlockAccessList (for eth/71)
     }
     ```
   - Indexes blocks by both **`blockHashHex`** and **`blockNumber`** (`bigint`).
   - Computes the exact contiguous servable range `{ earliestBlock: bigint, latestBlock: bigint, latestBlockHash: Uint8Array } | null`.
2. **Spec-Compliant `ETH` Request Handlers (`packages/devp2p/src/serve/ethServer.ts`):**
   - **`handleGetBlockHeaders` (`0x03` → `0x04`):**
     - Supports lookup by **32-byte `startBlock` hash** *or* **integer `startBlock` number**, respecting `limit` (capped at e.g. 64 and 2 MiB soft response cap), `skip`, and `reverse` (`0` = ascending, `1` = descending)!
   - **`handleGetBlockBodies` (`0x05` → `0x06`):**
     - Looks up each requested `blockHash` in `RollingBlockStore`, appends raw `bodyRlp` items up to the 2 MiB soft response cap, and returns `[reqId, bodiesList]`.
   - **`handleGetReceipts` (`0x0f` → `0x10`, supporting both `eth/69` and `eth/70`!):**
     - For `eth/69` ([EIP-7642](https://eips.ethereum.org/EIPS/eip-7642)): decodes `[reqId, [blockHashes]]` and returns `[reqId, [receiptsForBlock1, ...]]`.
     - For `eth/70` ([EIP-7975](https://eips.ethereum.org/EIPS/eip-7975)): decodes `[reqId, firstBlockReceiptIndex, [blockHashes]]`, slices receipts of the first block starting at `firstBlockReceiptIndex`, enforces the soft byte budget (setting `lastBlockIncomplete = 1` if truncated, `0` otherwise), and returns `[reqId, lastBlockIncomplete, [receiptsForBlock1, ...]]`.
   - **`handleGetBlockAccessLists` (`0x12` → `0x13`, `eth/71` [EIP-8159](https://eips.ethereum.org/EIPS/eip-8159)):**
     - Decodes `[reqId, [blockHashes]]` and returns `[reqId, [bal1OrEmptyBytes, ...]]` (using `new Uint8Array(0)` / `0x80` for blocks in the request that have no BAL, or `[]` if none of the requested blocks are held), respecting the 2 MiB soft response limit.
3. **Resource Governor & Serving Metrics in `Devp2pWorkerHost` (`src/worker/`):**
   - New worker command `{ type: 'putServableBlock'; block: ServableBlockBundle }` (with transferable `ArrayBuffer`s).
   - **Rate & Bandwidth Governor:** Bounds outbound serving per peer and globally (e.g. max 2 MiB per response, max 8 MB/s serve rate) so serving peers never degrades Ethy's own sync throughput or TUI responsiveness.
   - **Inbound vs. Outbound Peer Slot Balance:** Reserves a configurable minimum of `maxPeers` (e.g. 18 of 25 slots) for outbound sync peers while allowing up to 7 inbound peer connections so other nodes can connect to us.
   - **Serving Telemetry (`WorkerServingMetrics` on `WorkerTelemetrySnapshot`):**
     ```ts
     export interface WorkerServingSnapshot {
       earliestBlock?: string
       latestBlock?: string
       blocksStored: number
       headersServed: number
       bodiesServed: number
       receiptsServed: number
       accessListsServed: number
       totalRequestsServed: number
       totalBytesServed: number
     }
     ```
   - When an inbound `ETH` `GET_*` request arrives in `Devp2pWorkerHost`:
     1. First try `ethServer` against `RollingBlockStore`. If it matches our stored blocks, send the real response and increment `WorkerServingMetrics` (`headersServed` / `bodiesServed` / `receiptsServed` / `accessListsServed` + `totalBytesServed`)!
     2. If the requested block is not in `RollingBlockStore` (or if it is a `SNAP` `GET_*` request), fall back to the fast `<1ms` `emptyWireReply`.

#### B. What Belongs in `@ethereumjs/ethy` (`packages/ethy/src/net/` & `src/tui/`)
1. **Complete Pivot Block Bundle Fetch & Registration (`src/net/peerCoordinator.ts`):**
   - Stop setting `earliestBlock = 0` in `genesisStatus.ts` (`earliestBlock` must match `latestBlock` on initial status) and remove `client.setBlockRange(intToUnpaddedBytes(0), ...)`!
   - When the pivot `BlockHeader` (`#P`, `hashP`) is anchored from the best peer:
     - Also fetch its `BlockBody` (`GET_BLOCK_BODIES` for `[hashP]`) and `Receipts` (`GET_RECEIPTS` for `[hashP]`) from that peer (and `GET_BLOCK_ACCESS_LISTS` if on `eth/71` post-Amsterdam).
     - Push the complete `ServableBlockBundle` for `#P` into the worker via `client.putServableBlock(bundle)` and advertise the **honest** range `setBlockRange(#P, #P, hashP)`!
2. **Surface Active Serving in the **`● P2P Metrics`** Cockpit Box & `/peers` (`src/tui/cockpit.ts`):**
   - In the Right Box (`╭─ ● P2P Metrics ──────────────╮`) when `activeDomain === 'p2p'`, display our live serving contribution clearly on the 4th row (or alongside `Peers`, `Latency`, `Clients`):
     - `Peers`: `<N> connected (<M> snap)`
     - `Served`: `<totalRequestsServed> replies · <formattedKB/MB>` (e.g. `14 replies · 48.2 KB` or `0 replies (ready)` once pivot bundle is loaded)
     - `Latency`: `<avg> ms avg`
     - `Clients`: `<top client families>`
   - Also include the serving breakdown (`headers`, `bodies`, `receipts`, `accessLists`, `window #earliest..#latest`) in `/peers` or `/diag`!

---

## 3. Deliverables & Test Matrix

1. **Slice 1 — `@ethereumjs/devp2p`: `RollingBlockStore`, `ethServer` (`eth/68–71`), Worker Integration & Fix `earliestBlock` Default:**
   - Implement `RollingBlockStore` and `ethServer` (`GET_BLOCK_HEADERS` by hash & number/reverse/skip, `GET_BLOCK_BODIES`, `GET_RECEIPTS` for `eth/69` & `eth/70` pagination, `GET_BLOCK_ACCESS_LISTS` for `eth/71`).
   - Fix `ethStatusFromFields` in `packages/devp2p/src/lab/messages/eth.ts` so `earliestBlock` defaults to `latestBlock` (or `fields.earliestBlock` when explicitly passed), never `0` when `latestBlock > 0`!
   - Wire `putServableBlock` and `WorkerServingSnapshot` into `Devp2pWorkerHost` and `Devp2pWorkerClient`.
   - Unit & integration tests (`packages/devp2p/test/worker/eth-serving.spec.ts`):
     - Two `createThreadedNetwork({ inProcess: true })` nodes connect; Node B registers 3 contiguous `ServableBlockBundle`s (`#100, #101, #102`); Node A queries `GET_BLOCK_HEADERS` (by hash, by number, ascending, descending, with skip), `GET_BLOCK_BODIES`, `GET_RECEIPTS` (`eth/69` and `eth/70` with `firstBlockReceiptIndex = 1`), and `GET_BLOCK_ACCESS_LISTS` (`eth/71`) from Node B and verifies 100% valid responses and `WorkerServingSnapshot` counters!
2. **Slice 2 — `@ethereumjs/ethy`: Honest Block Range, Pivot Bundle Registration & `P2P Metrics` `Served` Row:**
   - Update `genesisStatus.ts` and `peerCoordinator.ts` so Ethy never advertises `earliestBlock = 0` for a non-zero `latestBlock`, fetches the pivot block's body/receipts to register the complete `ServableBlockBundle` in the worker, and only advertises the block range actually present in `RollingBlockStore`.
   - Update `cockpit.ts` (`metricsPairs` for `p2p`) to display the `Served` metric line (`<N> replies · <size>`) and update `test/tui.spec.ts` & `test/net.spec.ts`.

### Acceptance Criteria
- [ ] Outbound `eth/69+` `STATUS` and `BLOCK_RANGE_UPDATE` never advertise `earliestBlock = 0` unless block `0` is actually held; advertised `[earliestBlock .. latestBlock]` matches `RollingBlockStore` 100%.
- [ ] `Devp2pWorkerHost` serves valid `BLOCK_HEADERS`, `BLOCK_BODIES`, `RECEIPTS` (`eth/69` & `eth/70`), and `BLOCK_ACCESS_LISTS` (`eth/71`) for all blocks in `RollingBlockStore`, and increments `WorkerServingSnapshot` counters.
- [ ] The `● P2P Metrics` box in the Ethy TUI displays the live `Served` metric (`replies` + bytes) without breaking fixed column widths.
- [ ] `npm run tsc`, `npm test`, and `npm run spellcheck` pass with 0 errors across `packages/devp2p` and `packages/ethy`.

---

## 4. Concrete Implementation Plan (Planner — Grok 4.7)

*(To be filled out by Grok 4.7 during the Planning pass.)*

---

## 5. Implementation Notes & Deviations (Implementer — Composer 2.5)

*(To be filled out by Composer 2.5 after implementation and verification.)*
