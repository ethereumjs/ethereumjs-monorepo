# WP-03: Live `ETH` Status / RLP Canonical Zero Fix, `@ethereumjs/statemanager` `FlatStateManager` & 16-Bucket `snap/1` Sync

- **Status:** `READY_FOR_PLANNING`
- **Dependencies:** `WP-01` (`DONE`), `WP-02` (`DONE`), `WP-02b` (`DONE`)
- **Branch:** `ethy-wp03`
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Holistic Scope & Architectural Requirements

### Goal
1. **Unblock sustained live `ETH` `STATUS` (`statusOk > 0`) and live Pivot Header acquisition on Sepolia** by fixing the RLP non-canonical zero (`intToBytes(0)` → `intToUnpaddedBytes(0)`) and post-merge header hardfork bugs identified from the `WP-02b` soak telemetry.
2. **Build and export a first-class `FlatStateManager` directly in `@ethereumjs/statemanager`** (`packages/statemanager/src/flatStateManager.ts`): a hash-keyed (`keccak256(address)`), Copy-on-Write flat state manager that natively ingests `snap/1` account/storage/bytecode batches, supports O(1) checkpoint/sandbox forks (replacing `SimpleStateManager`'s O(N) full-map clone on every checkpoint), and implements `StateManagerInterface` (including `consumeBAL`) from Day 1.
3. **Implement the 16-bucket (`0x0..0xf`) `snap/1` Account Range Synchronizer** in `@ethereumjs/ethy` backed by `FlatStateManager`, verifying every downloaded chunk with `@ethereumjs/mpt`'s `verifyMerkleRangeProof` and `@ethereumjs/util`'s `accountBodyFromSlim` / `accountBodyToRLP`.
4. **Wire the Stage-2 Developer Microscope tools** (`inspectRawAccountRange`, `sampleSyncedAccounts`, `triggerDevAction`) into the 3-Box Cockpit (`SNAP` domain lens) and Main Interaction Area.

---

### Root-Cause Analysis from `WP-02b` Soak (Why `statusOk` was 0 and `SUBPROTOCOL_ERROR` clustered)

In `WP-02b`, discovery and TCP RLPx handshakes succeeded (`tablePeers: 65`, `dns.peersAdded: 84`, `rlpx.connected: 34`), but `statusOk` stayed `0` and peers disconnected with `SUBPROTOCOL_ERROR`. Codebase audit of `packages/devp2p` and `packages/ethy` against Go-Ethereum's `rlp/decode.go` revealed **three concrete wire bugs**:

1. **Non-Canonical RLP Zero (`intToBytes(0)` / `bigIntToBytes(0n)` sends `0x00` instead of `0x80`):**
   - In `@ethereumjs/util`, `intToBytes(0)` and `bigIntToBytes(0n)` return a 1-byte `Uint8Array([0])` (`0x00`). Go-Ethereum and Reth reject `0x00` when decoding `uint64` / `big.Int` RLP scalars with `rlp: non-canonical integer (leading zero bytes)` and immediately drop the peer with `DISCONNECT_REASON.SUBPROTOCOL_ERROR`!
   - `@ethereumjs/util` provides **`intToUnpaddedBytes(n)`** and **`bigIntToUnpaddedBytes(n)`** (which return `new Uint8Array(0)` → `0x80` for `0` / `0n`).
   - **Exact sites to fix in `@ethereumjs/devp2p` and `@ethereumjs/ethy`:**
     - `packages/devp2p/src/lab/messages/eth.ts:27`: `earliestBlock: intToBytes(0)` → use `intToUnpaddedBytes(0)` (and parse `fields.latestBlock` / `fields.td` via `bigIntToUnpaddedBytes(BigInt(...))`, which also fixes odd-length hex strings like `'0x1912a62'` in `genesisStatus.ts`!).
     - `packages/devp2p/src/protocol/eth.ts:393-398`: `bigIntToBytes(latestNum)` → `bigIntToUnpaddedBytes(latestNum)` (when `latestNum === 0n`, `bigIntToBytes(0n)` sent `0x00`!).
     - `packages/devp2p/src/protocol/eth/codec.ts:60-75`: `intToBytes` on `requestId`, `limit`, `skip` (`0`!), `reverse` (`0`!), and `block` (`0`!) → replace with `intToUnpaddedBytes`.
     - `packages/devp2p/src/rlpx/peer.ts:263`: `this._port === null ? new Uint8Array(0) : intToBytes(this._port)` → when `this._port === 0` (ephemeral listen port `0`), `intToBytes(0)` sent `0x00` in `HELLO`! Use `!this._port ? new Uint8Array(0) : intToUnpaddedBytes(this._port)`.
     - `packages/ethy/src/net/peerCoordinator.ts:227`: `client.setBlockRange(intToBytes(0), ...)` → use `intToUnpaddedBytes(0)` and `bigIntToUnpaddedBytes(parsed.number)`.
2. **Fork-ID Validation Tolerance on Live Testnets (`packages/devp2p/src/protocol/eth.ts:171-214`):**
   - Surface the exact caught subprotocol error message in `DiscoveryMetrics` / `WorkerDiagnosticEntry` when `Peer._handleBody` catches an error (`peer.ts:660`), and ensure `ETH._validateForkId` does not mistakenly compare a block number (`this._latestBlock`) against a post-Merge timestamp (`peerNextFork`).
3. **Post-Merge `BlockHeader` Hardfork Selection in `pivotHeader.ts` (`packages/ethy/src/net/pivotHeader.ts:48-54`):**
   - `headerFromRaw` currently calls `common.setHardforkBy({ blockNumber })` without `timestamp`. Because post-Merge forks in `@ethereumjs/common` (`shanghai` → `bpo2`) are scheduled by `timestamp` (`block: null`), `setHardforkBy({ blockNumber })` alone resets `common` to `paris`, causing `createBlockHeaderFromRLP` to fail on 20-field post-Merge headers!
   - Fix: extract both `blockNumber` (`fields[8]`) and `timestamp` (`fields[11]`) from the RLP header tuple and call `common.setHardforkBy({ blockNumber, timestamp })`.

---

### Why `FlatStateManager` Belongs Directly in `@ethereumjs/statemanager`

1. **`snap/1` Delivers 32-Byte Account & Slot Hashes (`keccak256(address)`), Not 20-Byte Addresses:**
   - `SimpleStateManager` in `@ethereumjs/statemanager` keys its `Map` by `address.toString()` (20-byte hex), so it cannot store `snap/1` `AccountRange` data (`[accountHash32, slimAccountBody]`) where the 20-byte address preimage is unknown.
   - `FlatStateManager` keys accounts by their **32-byte `accountHash`** (`keccak256(address.bytes)` when accessed via `StateManagerInterface.getAccount(address)` or `consumeBAL`, and directly by `accountHash` when ingested from `snap/1`), while maintaining an optional `accountHash -> Address` preimage map whenever an address is known!
2. **O(1) Copy-on-Write Checkpointing & Sandbox Overlays (Fixing `SimpleStateManager`'s O(N) Clone):**
   - `SimpleStateManager.checkpoint()` clones the entire `accountStack` `Map` on every call (`new Map(this.topAccountStack())`), which freezes when holding 100k–10M snap-synced accounts.
   - `FlatStateManager` uses a **delta-only checkpoint stack** (storing only the prior value of keys mutated during the current frame) and supports `forkOverlay()` / `shallowCopy()` as an O(1) Copy-on-Write view over the base flat state — making `WP-06`'s EVM sandbox and FYP/MCP integration effortless!
3. **Code Deduplication by `codeHash`:**
   - Stores contract bytecode blobs by `codeHashHex -> Uint8Array` (matching `snap/1` `GET_BYTE_CODES`), avoiding duplicate bytecode copies across proxy/clone contracts.

---

### Key Technical Nuances for `snap/1` (`GET_ACCOUNT_RANGE` & `verifyMerkleRangeProof`)

1. **Exact `snap/1` Wire Encoding (`[reqId, rootHash, startingHash, limitHash, responseBytes]`):**
   - Per the `snap/1` spec (and the archived client's snap protocol under `archive/client/src/net/protocol/`), `GET_ACCOUNT_RANGE` (`0x00`) is a **5-element flat RLP list**:
     ```ts
     [
       bigIntToUnpaddedBytes(reqId),
       setLengthLeft(rootHash, 32),
       setLengthLeft(startingHash, 32),
       setLengthLeft(limitHash, 32),
       bigIntToUnpaddedBytes(responseBytes),
     ]
     ```
   - `ACCOUNT_RANGE` (`0x01`) decodes as `[reqIdBytes, accountsList, proofNodes]` where each entry in `accountsList` is `[accountHash32, slimAccountBody]`.
2. **Slim RLP vs. Full RLP via `@ethereumjs/util`:**
   - `@ethereumjs/util` already ships **`accountBodyFromSlim(slimBody)`**, **`accountBodyToSlim(body)`**, and **`accountBodyToRLP(body)`**!
   - Before calling `verifyMerkleRangeProof(rootHash, originHash, lastKeyHash, keys, values, proof, (k) => k)`, convert each `slimAccountBody` in `ACCOUNT_RANGE` to full RLP via `accountBodyToRLP(accountBodyFromSlim(slimBody), false)`.
3. **Identity Key Hashing & Continuation (`hasRightElement`):**
   - Call `verifyMerkleRangeProof` with `useKeyHashingFunction = (key: Uint8Array) => key` (identity function, since `accountHash` keys in `snap/1` are already 32-byte keccak256 hashes).
   - Use the boolean return value (`hasRightElement`) and comparison against `bucket.limitHash` (`0x0fff...`, `0x1fff...`, ..., `0xffff...`) to advance `bucket.currentLastHash` (incremented by 1) or mark the bucket `done`.

---

### Key Deliverables (4 Atomic Slices)

1. **Slice 1 — `@ethereumjs/devp2p`: RLP Canonical Zero & Subprotocol Error Diagnostics:**
   - Fix `intToBytes(0)` / `bigIntToBytes(0n)` → `intToUnpaddedBytes` / `bigIntToUnpaddedBytes` in `messages/eth.ts`, `protocol/eth.ts`, `protocol/eth/codec.ts`, and `rlpx/peer.ts`.
   - Fix `messages/snap.ts` `GET_ACCOUNT_RANGE` builder to match the 5-element `snap/1` wire tuple.
   - Surface the caught error message in `Peer._handleBody` (`peer.ts:660`) into `DiscoveryMetrics` / worker diagnostics.
   - Add unit tests verifying that `eth/69` `STATUS` with `earliestBlock = 0`, `GET_BLOCK_HEADERS` with `skip = 0, reverse = 0`, and `HELLO` with `port = 0` encode `0` as `new Uint8Array(0)` (`0x80`).

2. **Slice 2 — `@ethereumjs/statemanager`: `FlatStateManager` (`packages/statemanager/src/flatStateManager.ts`):**
   - Implement and export `FlatStateManager` (and `createFlatStateManager` factory) implementing `StateManagerInterface`:
     - Standard `StateManagerInterface`: `getAccount`, `putAccount`, `deleteAccount`, `modifyAccountFields`, `getCode`, `putCode`, `getCodeSize`, `getStorage`, `putStorage`, `clearStorage`, `checkpoint`, `commit`, `revert`, `flush`, `shallowCopy` (O(1) Copy-on-Write view), `consumeBAL`.
     - Direct hash-keyed `snap/1` & inspection API:
       - `putSnapAccountsBatch(entries: Array<{ accountHash: Uint8Array; account: Account; address?: Address }>): void`
       - `getAccountByHash(accountHash: Uint8Array): Account | undefined`
       - `putSnapStorageBatch(accountHash: Uint8Array, slots: Array<{ slotHash: Uint8Array; value: Uint8Array }>): void`
       - `putCodeByHash(codeHash: Uint8Array, code: Uint8Array): void`
       - `sampleAccounts(opts?: { prefixHex?: string; limit?: number; sortByBalanceDesc?: boolean }): FlatAccountSample[]`
       - `accountCount(): number`
   - Unit tests in `packages/statemanager/test/flatStateManager.spec.ts`: test `StateManagerInterface` methods, O(1) delta checkpoint/revert without cloning the base map, `putSnapAccountsBatch` + `getAccount(address)` lookup via `keccak_256(address)`, `consumeBAL` equivalence with `MerkleStateManager`, and `shallowCopy()` Copy-on-Write isolation.

3. **Slice 3 — `@ethereumjs/ethy`: Post-Merge Pivot Fix, `SyntheticSnapPeer` & 16-Bucket `SnapAccountSynchronizer` (`src/net/`, `src/sync/`):**
   - Add `@ethereumjs/statemanager` and `@ethereumjs/mpt` to `packages/ethy/package.json` `dependencies`.
   - Update `headerFromRaw` in `src/net/pivotHeader.ts` to pass `{ blockNumber, timestamp }` to `common.setHardforkBy(...)`, and normalize `genesisStatus.ts` hex quantities.
   - `SyntheticSnapPeer` (`src/sync/syntheticPeer.ts`): Builds a deterministic 160-account `@ethereumjs/mpt` `MerklePatriciaTrie` across all 16 hex buckets (`0x0..0xf`) in `<50ms` for offline CI tests, serving `ACCOUNT_RANGE` packets with `accountBodyToSlim` bodies and real Merkle edge proofs (`createMerkleProof`), plus fault injection on bucket `0x3`.
   - `SnapAccountSynchronizer` (`src/sync/accountSync.ts`):
     - Triggered automatically once `spine.pivotStateRoot` is anchored.
     - Schedules `GET_ACCOUNT_RANGE` across connected `snap/1` peers for the 16 `spine.snapBuckets` (`0x0..0xf`), verifies range proofs via `verifyMerkleRangeProof`, writes verified accounts to `node.stateManager` (`FlatStateManager.putSnapAccountsBatch`), and updates `spine.snapBuckets`, `totalAccountsSynced`, `accountsPerSec`, and `NoticeBoard`.

4. **Slice 4 — `@ethereumjs/ethy`: Stage-2 Microscope Tools & `SNAP` Domain Lens (`src/tools/`, `src/tui/`):**
   - `inspectRawAccountRange` (`/range [prefix]`): Queries `FlatStateManager.sampleAccounts({ prefixHex })` and returns a `table` `WidgetSpec` showing Account Hash (or Address if preimage known), Balance (ETH), Nonce, Contract (`yes`/`no`), and Storage Root.
   - `sampleSyncedAccounts` (`/sample`): Shows top synced accounts by ETH balance or nonce.
   - `triggerDevAction`: Supports `/drop <peerId>`, `/reassign <bucketHex>`, `/pause`, `/resume`.
   - Wire `/range` and `/sample` into the Middle Box (`◐ SNAP Commands`) and `slashComplete.ts`.

### Acceptance Criteria
- [ ] All RLP scalar zeros in `HELLO`, `eth/69` `STATUS`, `GET_BLOCK_HEADERS`, `BLOCK_RANGE_UPDATE`, and `GET_ACCOUNT_RANGE` encode as `new Uint8Array(0)` (`0x80`).
- [ ] `FlatStateManager` is exported from `@ethereumjs/statemanager` with full TypeDoc JSDoc comments (`api-docs.mdc`) and passes `packages/statemanager/test/flatStateManager.spec.ts`.
- [ ] `pivotHeader.spec.ts` decodes both pre-Merge and post-Merge (timestamp-forked) headers accurately.
- [ ] Full 16-bucket `snap/1` account sync + `verifyMerkleRangeProof` into `FlatStateManager` passes against `SyntheticSnapPeer` (including fault-injection recovery on bucket `0x3`) in `<150ms` in unit tests.
- [ ] Live soak (`node --import tsx src/cli/main.ts sepolia --headless` or TUI `ethy sepolia`) achieves `statusOk > 0`, anchors a live Sepolia `pivotBlockNumber` + `pivotStateRoot`, and begins pulling live `snap/1` account ranges into `FlatStateManager`.
- [ ] `npm run tsc`, `npm test`, and `npm run spellcheck` pass with 0 errors across `packages/devp2p`, `packages/statemanager`, and `packages/ethy`.

---

## 2. Concrete Implementation Plan (Planner — Grok 4.7)

*(To be filled out by Grok 4.7 during the Planning pass.)*

---

## 3. Implementation Notes & Deviations (Implementer — Composer 2.5)

*(To be filled out by Composer 2.5 after implementation and verification.)*
