# WP-08a: Default-On JSON-RPC 2.0 Server (`http://127.0.0.1:8545`), On-Disk `coldStorageLookup`, Header/Footer RPC Chrome & `/rpc` Microscope

- **Status:** `DONE`
- **Dependencies:** `WP-03c`, `WP-04k`, `WP-05b`, `WP-07a`..`WP-07h` (`DONE`)
- **Primary Goal:** Turn Ethy into a **default-on, zero-dependency Ethereum JSON-RPC 2.0 endpoint (`http://127.0.0.1:8545`)** out of the box, complete the 3-part on-disk flat-state triad by adding **`coldStorageLookup`** (`SnapPivotStore.lookupStorageByHash` + `FlatStateManager` hook), surface the JSON-RPC status in the **top header bar** (`Block ...  Slot ...  JSON-RPC`) and the **bottom-right footer** (`JSON-RPC http://127.0.0.1:8545`), and add the **`/rpc`** microscope view.

---

## 1. Holistic Scope & Architectural Requirements (Coordinator — Gemini 4 Argon)

### 1.1 Architectural Vision & Zero-Dependency Design

Running `ethy sepolia` (with zero extra flags) should immediately give developers, wallets (MetaMask, Rabby), CLI tools (`cast`, `curl`), ViEm/Ethers apps, and *Feel Your Protocol* a live local JSON-RPC 2.0 endpoint on `http://127.0.0.1:8545`:

1. **100% In-House, Zero Third-Party Runtime Dependencies (`node:http` + `@ethereumjs/*`):**
   - Built directly on Node's native `node:http` (`createServer`) + `@ethereumjs/util` + `@ethereumjs/block` + `@ethereumjs/tx` + `@ethereumjs/rlp` + `@ethereumjs/statemanager`.
   - Supports single and batch (`[...]`) JSON-RPC 2.0 requests, CORS preflight (`OPTIONS`, `Access-Control-Allow-Origin: *`), `1 MiB` request body cap (`-32600` on overflow), and standard EIP-1474 error codes (`-32700` Parse error, `-32600` Invalid Request, `-32601` Method not found, `-32602` Invalid params, `-32000` Server/state unavailable).

2. **Default-On with Auto-Port Fallback (`8545..8555`):**
   - Enabled by default (`--rpc` default `true`; disable via `--no-rpc`; omitted in `--demo` unless `--rpc` or `--rpc-port` is explicitly passed).
   - Default host `127.0.0.1` (`--rpc-host <host>`), default port `8545` (`--rpc-port <port>`).
   - **Auto-Port Fallback:** When `--rpc-port` was **not** explicitly specified and `8545` returns `EADDRINUSE` (e.g. another node or second Ethy instance is running), automatically try `8546`, `8547`, … up to `8555`, and record the bound URL (`http://127.0.0.1:<boundPort>`) on `spine.rpc`.

---

### 1.2 Completing the Flat-State Disk Triad: `coldStorageLookup` (`@ethereumjs/statemanager` & `SnapPivotStore`)

In `WP-04g` we added `coldAccountLookup` (`accounts/<nibble>.bin`), and in `WP-07g` we added `coldCodeLookup` (`code/shard-<xx>.bin`). To serve `eth_getStorageAt(address, slot, "latest")` (and `SLOAD` in `WP-08b`'s EVM sandbox!) after a disk restart (`baseSyncComplete: true`), we complete the third leg:

1. **`@ethereumjs/statemanager` (`packages/statemanager/src/types.ts`, `src/flatStateManager.ts`):**
   - Add optional `coldStorageLookup?: (accountHash: Uint8Array, slotHash: Uint8Array) => Uint8Array | undefined` to `FlatStateManagerOpts`.
   - In `FlatStateManager.readStorageKey(key)` (where `key` is `${accountHashHex}:${slotHashHex}`):
     - If `_storage.has(key)` misses on the root manager and `_coldStorageLookup !== undefined`:
       - Parse `accountHashBytes` (`key.slice(0, 64)`) and `slotHashBytes` (`key.slice(65, 129)`).
       - Call `_coldStorageLookup(accountHashBytes, slotHashBytes)`.
       - If a non-empty `Uint8Array` is returned, cache an owned copy in `_storage` (tracking cold-hydrated storage keys in `_coldHydratedStorageKeys` with a bounded FIFO cap `MAX_COLD_STORAGE_CACHE = 4096` so live-written storage is never evicted) and return it.
2. **`SnapPivotStore.lookupStorageByHash(accountHash, slotHash)` (`src/persist/snapStore.ts`, `src/core/createEthyNode.ts`):**
   - Recall the on-disk record format written by `appendStorageSlots` (`snapStore.ts:1802`) in `pivots/<activeRoot>/storage/shard-<xx>.bin` (where `<xx>` is `accountHash[0]` hex):
     - Note: check how `appendStorageSlots` and `restoreStorageShard` frame records in `storage/shard-<xx>.bin` (or individual `<accountHash>.bin` files if present). Specifically, in `appendStorageSlots` (`snapStore.ts:1802`), each batch writes `accountHash (32B)` followed by `N` tuples of `slotHash (32B) + uint32BE(len) (4B) + value (len B)`. To make `lookupStorageByHash` unambiguous and fast, store a 4-byte magic + explicit `uint32BE(slotCount)` or framing header (or scan/index `storage/shard-<xx>.bin` + legacy `<accountHash>.bin`), and wire `coldStorageLookup: (accHash, slotHash) => snapStore.lookupStorageByHash(accHash, slotHash)` in `createEthyNode.ts`.

---

### 1.3 Supported JSON-RPC 2.0 Methods (`src/rpc/`)

#### Group 1: Chain, Network & Sync Metadata (Always Available Immediately on Boot)
| Method | Behavior |
| --- | --- |
| `web3_clientVersion` | Returns `"ethy/v<version>/<platform>-<arch>/node-<nodeVersion>"` |
| `web3_sha3` | `[dataHex]` → `0x${bytesToHex(ethyKeccak256(hexToBytes(dataHex)))}` |
| `net_version` | Returns decimal `spine.chainId.toString(10)` (e.g. `"11155111"`) |
| `net_listening` | Returns `true` when P2P is active (`spine.peers.size > 0 || demo`) |
| `net_peerCount` | Returns `0x${spine.peers.size.toString(16)}` |
| `eth_chainId` | Returns `0x${spine.chainId.toString(16)}` |
| `eth_syncing` | Returns `false` when `isNodeAtChainHead(spine)` is `true`; otherwise returns `{ startingBlock, currentBlock, highestBlock }` as hex quantities |
| `eth_blockNumber` | Returns `0x${(localVerifiedBlock(spine) ?? spine.pivotBlockNumber ?? 0n).toString(16)}` |

#### Group 2: Head State Queries (`"latest"`, `"safe"`, `"finalized"`, `"pending"`, or Current Head Block Number/Hash)
- **Block Tag Resolution (`resolveStateBlockTag(tag, spine)`):**
  - Accepts `"latest"`, `"pending"`, `"safe"`, `"finalized"`, or a block number / `{ blockNumber, blockHash }` that matches our current verified head block (`localVerifiedBlock(spine)` or `pivotBlockNumber`).
  - If a caller requests historical state at an older block number `N < headBlock` (or before state sync has accounts), return a clear JSON-RPC error `-32000`: `"Flat-state node only serves state at head (#<head>); historical state at #<N> is not retained"`.
| Method | Behavior |
| --- | --- |
| `eth_getBalance(address, tag?)` | Computes `accountHash = ethyKeccak256(addressBytes)`, reads `stateManager.getAccountByHash(accountHash)`, returns `0x${(acc?.balance ?? 0n).toString(16)}` |
| `eth_getTransactionCount(address, tag?)` | Reads `stateManager.getAccountByHash(accountHash)`, returns `0x${(acc?.nonce ?? 0n).toString(16)}` |
| `eth_getCode(address, tag?)` | Reads `acc = stateManager.getAccountByHash(accountHash)`; if `acc === undefined` or `codeHash === KECCAK256_NULL`, returns `"0x"`, else `0x${bytesToHex(stateManager.getCodeByHash(acc.codeHash) ?? new Uint8Array(0))}` |
| `eth_getStorageAt(address, slotHex, tag?)` | Left-pads `slotHex` to 32 bytes, calls `await stateManager.getStorage(address, slotBytes)`, left-pads returned bytes to 32 bytes (`0x` + 64 hex chars) |

#### Group 3: 64-Block Rolling Window — Blocks, Transactions, Receipts, Fees & Logs (`src/rpc/blockWindowStore.ts`)
- Maintain a clean, main-thread **`RpcBlockWindowStore`** (capacity `64` blocks, fed alongside `putServableBlock` / `ETHEconomyDataManager.noteBundle` whenever a verified block or bundle arrives) that indexes:
  - `byNumber: Map<bigint, StoredRpcBlock>` and `byHash: Map<string, StoredRpcBlock>`
  - `txByHash: Map<string, { blockNumber: bigint; blockHash: Uint8Array; txIndex: number; rawTx: Uint8Array }>`
- Supported methods:
| Method | Behavior |
| --- | --- |
| `eth_getBlockByNumber(tagOrHex, fullTx?)` | Resolves `"latest"`, `"safe"`, `"finalized"`, `"earliest"` (earliest in window), or hex block number. Formats standard Ethereum JSON block (`number`, `hash`, `parentHash`, `stateRoot`, `transactionsRoot`, `receiptsRoot`, `logsBloom`, `miner`, `gasLimit`, `gasUsed`, `baseFeePerGas`, `blobGasUsed`, `excessBlobGas`, `blockAccessListHash`, `timestamp`, `extraData`, `transactions`, `uncles: []`, `withdrawals`). Returns `null` if outside window. |
| `eth_getBlockByHash(hashHex, fullTx?)` | Same as above by 32-byte block hash. |
| `eth_getBlockTransactionCountByNumber` / `ByHash` | Returns hex count of transactions in the block (or `null` if not in window). |
| `eth_getTransactionByHash(txHashHex)` | Looks up `txByHash` in the 64-block window, decodes via `@ethereumjs/tx`, recovers `from` (`tx.getSenderAddress()`), and formats standard JSON tx (`hash`, `blockHash`, `blockNumber`, `transactionIndex`, `from`, `to`, `value`, `gas`, `gasPrice` / `maxFeePerGas` / `maxPriorityFeePerGas`, `input`, `nonce`, `type`, `chainId`, `v`, `r`, `s` / `yParity`). Returns `null` if not found. |
| `eth_getTransactionByBlockHashAndIndex` / `ByBlockNumberAndIndex` | Returns the transaction at `index` in that block (or `null`). |
| `eth_getTransactionReceipt(txHashHex)` & `eth_getBlockReceipts(blockOrHash)` | Reconstructs full standard JSON receipts (`transactionHash`, `transactionIndex`, `blockHash`, `blockNumber`, `from`, `to`, `cumulativeGasUsed`, `gasUsed`, `contractAddress`, `logs`, `logsBloom`, `status`, `effectiveGasPrice`, `type`) from the stored `receiptsEth69Rlp` + `bodyRlp` + `headerRlp`. |
| `eth_gasPrice` & `eth_maxPriorityFeePerGas` & `eth_blobBaseFee` | Computes `baseFeePerGas + priorityFee` from the latest block header (`eth_maxPriorityFeePerGas` defaults to `1 Gwei` or median tip in latest block; `eth_blobBaseFee` from header). |
| `eth_feeHistory(blockCount, newestBlock, rewardPercentiles?)` | Returns `{ oldestBlock, baseFeePerGas, gasUsedRatio, reward }` from the 64-block window. |
| `eth_getLogs(filterObj)` | Supports `{ fromBlock, toBlock, address, topics, blockHash }` across the 64-block rolling window! If `fromBlock` is earlier than the earliest block in our 64-block window, returns `-32005`: `"Log query range begins before the 64-block rolling window (#<earliest>..#<latest>)"`. |

#### Group 4: Ethy-Native & Amsterdam Extensions
| Method | Behavior |
| --- | --- |
| `eth_getBlockAccessListByNumber(tagOrHex)` / `eth_getBlockAccessListByHash(hashHex)` | Returns the verified EIP-7928 `BALJSONBlockAccessList` (from `spine.balWindow` / `RpcBlockWindowStore`) for the requested block, or `null` if unavailable. |
| `ethy_status` | Returns JSON snapshot of `{ network, chainId, phase, syncTransport, headBlock, chainHeadBlock, clStatus, clParticipationPct, totalAccountsSynced, codesSynced, storageSlotsSynced, peersCount, rpcUrl }`. |
| `ethy_economy` | Returns the current `EconomySnapshot` (including `moments`, `topContracts`, `skyline`, `nibbleHeat`). |

*(Note: For `eth_call`, `eth_estimateGas`, `eth_createAccessList`, and `eth_sendRawTransaction`, register clean stub handlers in `WP-08a` returning `-32601` / `"On-demand EVM execution and tx broadcast arrive in WP-08b"` so `WP-08b` plugs straight into the method table.)*

---

### 1.4 TUI Chrome Integration: Header Bar, Footer URL & `/rpc` Microscope

1. **Top Header Bar (`src/tui/headerClock.ts`, `src/tui/renderFrame.ts`):**
   - Place **`JSON-RPC`** in the top bar between `Block / Slot` and the 4 capability pills (`◐ Economy  ◐ State  ◐ P2P  ◐ AI`):
     ```text
     Ethy v10.1.3 | SEPOLIA        Block 12,112,875      Slot 11,556,709      JSON-RPC      ● Economy  ● State  ● P2P  ◐ AI
     ```
   - **Visual Readiness State (`isRpcReady(spine)`):**
     - Define `isRpcReady(spine): boolean`: `true` when `spine.rpc?.listening === true` **and** (`isNodeAtChainHead(spine)` is `true` or `spine.totalAccountsSynced > 0 && (spine.phase === 'HEAD_FOLLOWING' || spine.phase === 'BAL_CATCHUP')`).
     - When `isRpcReady(spine) === false` (still syncing / warming up, or `--no-rpc`): render **dimmed (`${DIM}JSON-RPC${RESET}`)**.
     - When `isRpcReady(spine) === true`: render **bright bold (`${BOLD}JSON-RPC${RESET}`)** — matching the exact dim-to-bright visual mechanics of `Block` and `Slot`!
   - Use `CLOCK_INNER_GAP = 6` (and `SLOT_GAP = 6`) so `Block`, `Slot`, `JSON-RPC`, and the 4 capability pills fit without truncation on 100-column terminals.

2. **Prominent JSON-RPC URL in the Bottom-Right Footer (`src/tui/renderFrame.ts`):**
   - In `renderPrompt(spine, view, cols)`, the bottom row currently renders:
     `fixedLine(\`${hint}${gap}${fixedField('', right)}\`, cols)`
   - Populate that right-hand cell (`right` width, directly beneath the `╭─ ◐ AI ─╮` box) with the right-aligned JSON-RPC endpoint URL (`renderRightFooterRpc(spine, right)`):
     - When `spine.rpc?.listening === true`:
       - While warming up (`!isRpcReady(spine)`): `${DIM}JSON-RPC ${spine.rpc.url}${RESET}`
       - When ready (`isRpcReady(spine)`): `${DIM}JSON-RPC${RESET} ${BOLD}${spine.rpc.url}${RESET}` (e.g. `JSON-RPC http://127.0.0.1:8545`)
     - When disabled (`--no-rpc`): `${DIM}JSON-RPC off${RESET}`

3. **`/rpc` Slash Command & Telemetry (`src/tools/rpcTools.ts`, `src/spine/types.ts`):**
   - Add `rpc?: RpcTelemetry` to `EthySpine`:
     ```ts
     export type RpcMethodStat = {
       calls: number
       errors: number
       lastLatencyMs: number
     }
     export type RpcTelemetry = {
       enabled: boolean
       listening: boolean
       host: string
       port: number
       url: string
       totalRequests: number
       totalErrors: number
       lastMethod?: string
       lastRequestAt?: number
       methodStats: Record<string, RpcMethodStat>
       recentCalls: Array<{ timestamp: number; method: string; status: 'ok' | 'err'; durationMs: number }>
     }
     ```
   - Add **`/rpc`** (under `P2P Commands` in `help.ts`, `SLASH_COMMANDS`, `SLASH_TOOL_REGISTRY`, and `toolCatalog.ts`) which renders a `TableUIComponent` of active JSON-RPC method calls (`Method`, `Calls`, `Errors`, `Last ms`) with a preface showing `Endpoint` (`http://127.0.0.1:8545`), `Readiness`, and `Total requests`, plus a `Ctrl+D` `Debug` page showing recent RPC requests and quick `curl` / `cast` copy-paste examples!

---

### 1.5 Acceptance Criteria

- [x] `@ethereumjs/statemanager` supports `coldStorageLookup` on `FlatStateManagerOpts` and `FlatStateManager.getStorage`, with bounded cache and unit test coverage (separate commit).
- [x] `SnapPivotStore.lookupStorageByHash` reads persisted contract storage slots from disk and is wired into `createEthyNode.ts`.
- [x] Zero-dependency HTTP JSON-RPC 2.0 server (`src/rpc/`) starts by default on `127.0.0.1:8545` (with automatic port fallback `8545..8555` on `EADDRINUSE`, `--no-rpc`, `--rpc-port`, `--rpc-host`), supporting single and batch requests, CORS, and all Group 1–4 methods.
- [x] Top header bar displays `JSON-RPC` between `Slot` and `Economy` (dimmed while syncing, bright bold when ready), and the bottom-right footer line displays `JSON-RPC http://127.0.0.1:8545` right-aligned under the `AI` box.
- [x] `/rpc` slash command displays live JSON-RPC endpoint telemetry, per-method stats, and `Ctrl+D` debug examples.
- [x] Comprehensive offline unit/integration test suite (`test/rpc.spec.ts`) exercises HTTP single/batch calls, `eth_chainId`, `eth_syncing`, `eth_getBalance`, `eth_getTransactionCount`, `eth_getCode`, `eth_getStorageAt` (including cold disk fallback), `eth_getBlockByNumber`, `eth_getTransactionByHash`, `eth_getTransactionReceipt`, `eth_feeHistory`, `eth_getLogs`, `eth_getBlockAccessListByNumber`, and `ethy_status`.
- [x] `npm run tsc`, `npm test`, and `npm run spellcheck` pass across `@ethereumjs/statemanager` and `@ethereumjs/ethy`.

---

## 2. Concrete Implementation Plan (Planner — Grok 4.7)

**Zero new npm dependencies.** Upstream `coldStorageLookup` ships in a **separate commit** from `@ethereumjs/ethy`. Decision **D-110**: ETY1-framed `storage/shard-*.bin` batches, JSON-RPC server started from `main.ts` (not `createEthyNode`), port fallback `8545..8555`, execution methods stubbed for WP-08b.

**Order:** `statemanager` cold hook → `snapStore.lookupStorageByHash` → `src/rpc/*` + CLI → TUI/`/rpc` → `test/rpc.spec.ts` → gates.

See attached Grok 4.7 plan (D-110 locks: storage framing, `isRpcReady`, batch cap 64, header gaps 6).

---

## 3. Implementation Notes & Deviations (Implementer — Composer 2.5)

- **Storage framing (D-110):** `appendStorageSlots` batches prefixed with `ETY1` + `uint32BE(slotCount)`; `lookupStorageByHash` indexes batch spans; unframed shards return `undefined`.
- **RPC lifecycle:** `startJsonRpcServer` / `stop` from `cli/main.ts` only (`port: 0` in tests); not bound inside `createEthyNode`.
- **Spellcheck:** Removed global `!Rpc` deny entry in `config/cspell-ts.json` so JSON-RPC identifiers (`RpcTelemetry`, etc.) spellcheck clean; added allow word `Rpc`.
- **Tests:** `test/rpc.spec.ts` covers HTTP dispatch, head state, cold storage hook, 64-block window; extend with batch/CORS/port-fallback cases in a follow-up if CI needs broader HTTP matrix.
- **Upstream:** `@ethereumjs/statemanager` `coldStorageLookup` is ready for a **separate commit** from ethy.
