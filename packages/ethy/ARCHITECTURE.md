# Ethy (`@ethereumjs/ethy`) — Architecture & Blueprint

**Ethy** (pronounced *"Easy"*) is an experimental, next-generation **Execution-Free State & Intelligence Node** built on the EthereumJS v10 stack.

Instead of competing with Geth, Reth, or Nethermind as a heavy validator or high-throughput archive RPC node, Ethy occupies a distinct niche enabled by the **Amsterdam / Glamsterdam hardfork**: combining **healing-free `snap/1` flat-state sync**, **zero-execution head tracking via EIP-7928 Block-Level Access Lists (`eth/71`)**, a **Zero-Log 4-Zone Terminal UI (TUI)**, and an **embedded local AI / developer microscope** (`IntentEngine`).

---

## 1. Philosophy & Core Goals

1. **Zero-Config Simplicity (`npx @ethereumjs/ethy` / `ethy sepolia`):**
   - Starting an Ethereum observer node should take one command with zero flags required in the normal case.
   - Default network starts with `sepolia` (where Amsterdam features can be tested live) while supporting every chain configured in `@ethereumjs/common` (`mainnet`, `sepolia`, `hoodi`, `holesky`, etc.).
   - Package name is `@ethereumjs/ethy` (with CLI bin `ethy`), ready to transition to unscoped `ethy` on npm if transferred.

2. **Radical Clarity & Zero-Log TUI:**
   - No scrolling walls of log spam. Ethy runs in the terminal's alternate screen buffer (`\x1b[?1049h`) with flicker-free synchronized output (`\x1b[?2026h`).
   - At any second, the user sees 3–4 hero metrics (current slot, 16-bucket snap progress `0x0..0xf`, account throughput), a dynamic inspection workspace, a 1-line traffic-light capability bar, and an interactive prompt at the bottom.
   - Protocol warnings, peer drops, and Merkle proof anomalies go silently into a bounded `diagnosticRingBuffer` on `EthySpine` — invisible to the casual eye, but immediately queryable via the prompt.

3. **Zero-Boredom & Live Self-Testing from Second 0:**
   - A user (and the developers building Ethy!) can interact with the node immediately after launch, before sync finishes and even before a local LLM finishes loading.
   - During development, the TUI + prompt acts as an **interactive X-ray microscope** for debugging `devp2p` peers, `snap/1` bucket stalls, and BAL state diffs live.

4. **Amsterdam-First Execution-Free Sync (No Trie-Healing):**
   - Classic clients spend hours in `GetNodeData` / `GetTrieNodes` "trie healing" because the state root moves while downloading flat accounts.
   - Ethy targets **Amsterdam**: it pulls flat accounts, storage, and bytecode at a fresh pivot block via `snap/1`, and bridges forward to the chain head by applying deterministic **EIP-7928 Block-Level Access Lists (BALs)** over `eth/71` (`GET_BLOCK_ACCESS_LISTS`) **without executing transactions in the EVM**.
   - `@ethereumjs/evm` and `@ethereumjs/vm` are invoked **only on demand** when the user (or a connected AI agent) asks for a local `eth_call` simulation, trace, or "what-if" state mutation against the live head.

5. **Headless Core & Feel Your Protocol (MCP) Synergy:**
   - `EthyCore` (state store, sync engine, `EthySpine` telemetry, and structured inspection/simulation tools) is strictly separated from `EthyTUI`.
   - Running `createEthyNode({ headless: true })` exposes the exact same live-state and simulation tools programmatically, enabling Ethy to serve as a stateful live-chain sandbox backend for MCP servers such as *Feel Your Protocol*.

6. **Hardening the `@ethereumjs/*` Library Ecosystem (Core Project Mission):**
   - Just like the original EthereumJS client, a primary strategic goal of Ethy is to **exercise, harden, and modernize our monorepo packages** under real-world P2P, state, and concurrency load.
   - `@ethereumjs/devp2p` runs in its own dedicated Node.js `worker_threads` Worker from Day 1 (`WP-00`: `createThreadedNetwork`, discovery flow control, and zero-copy buffer framing), evolving radically where needed while keeping a clean, attractive API for external research and production users.
   - Other active libraries (`@ethereumjs/common`, `@ethereumjs/mpt`, `@ethereumjs/statemanager`, `@ethereumjs/util`, `@ethereumjs/block`, `@ethereumjs/evm`, `@ethereumjs/vm`, `@ethereumjs/rlp`) are actively improved with backwards-compatible enhancements committed atomically so they can flow into `master` via standalone PRs.

---

## 2. System Architecture: The 4-Layer `EthySpine` Model

All subsystems communicate through a single typed in-memory telemetry and state bus (`EthySpine`). Neither `devp2p` nor `snap/1` knows anything about ANSI rendering or LLMs.

```text
  [@ethereumjs/devp2p + SnapSync + BAL Applier]
                 │ (writes metrics, bucket state & ring-buffer anomalies)
                 ▼
       ┌───────────────────┐
       │     EthySpine     │ ◄─── (Central typed in-memory state & telemetry store)
       └───────────────────┘
          │              │
   (Pure  │              │ (Reads <ethy_state> header &
   Render)│              │  executes gated diagnostic/state tools)
          ▼              ▼
    [Zero-Log TUI] ◄── [IntentEngine (Slash / Rules / Local LLM)]
                   (mounts declarative WidgetSpec in Zone 2)
```

### Core `EthySpine` Data Contracts

```ts
export type EthyPhase = 'BOOTING' | 'P2P_WARMUP' | 'SNAP_SYNCING' | 'HEAD_FOLLOWING'

export type CapabilityReadiness = 'locked' | 'partial' | 'ready'

export interface PeerTelemetry {
  id: string
  clientName: string // e.g. "Geth/v1.15..." or "Reth/v1.2..."
  caps: string[] // ["eth/70", "eth/71", "snap/1"]
  snapRequestsSent: number
  snapResponsesOk: number
  snapTimeouts: number
  avgLatencyMs: number
  lastError?: string
}

export interface SnapBucket {
  index: number // 0..15
  prefix: string // "0x0" .. "0xf"
  status: 'pending' | 'syncing' | 'verifying_proof' | 'done' | 'stalled'
  accountsLoaded: number
  startHash: Uint8Array // 32-byte range start
  currentLastHash: Uint8Array // 32-byte cursor
  limitHash: Uint8Array // 32-byte bucket ceiling
  assignedPeerId?: string
  lastStallReason?: string
}

export interface DiagnosticEvent {
  timestamp: number
  subsystem: 'devp2p' | 'snap' | 'bal' | 'mpt' | 'cl' | 'ai'
  severity: 'info' | 'warn' | 'error' | 'anomaly'
  peerId?: string
  bucketIndex?: number
  message: string
  rawPayloadHex?: string
}

export interface EthySpine {
  network: string // e.g. "sepolia"
  chainId: bigint
  phase: EthyPhase
  currentSlot: number
  pivotBlockNumber?: bigint
  pivotStateRoot?: Uint8Array
  headBlockNumber?: bigint
  headStateRoot?: Uint8Array

  capabilities: {
    p2p: { status: CapabilityReadiness; label: string }
    snap: { status: CapabilityReadiness; label: string }
    head: { status: CapabilityReadiness; label: string }
    ai: { status: CapabilityReadiness; label: string; progressPct?: number }
  }

  peers: Map<string, PeerTelemetry>
  snapBuckets: SnapBucket[] // 16 segments (0x0..0xf)
  totalAccountsSynced: number
  accountsPerSec: number

  // Bounded ring buffer (e.g. last 100 events) replacing console.log
  diagnosticRingBuffer: DiagnosticEvent[]
}
```

---

## 3. The 4-Zone Zero-Log TUI & Progressive Capability Unlocking

The TUI layout is a pure function:

```ts
renderFrame(spine: EthySpine, viewState: TuiViewState, cols: number, rows: number): string[]
```

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ ZONE 1: HERO METRICS (4 rows)                                                │
│   SEPOLIA · SLOT 11,482,910   SNAP SYNC 31.4%              ACCOUNTS 84.2k    │
│   Pivot #7,812,400            0x0 [████▓▓!░░░░░░░░░] 0xf   ~4,210 acc/sec    │
├──────────────────────────────────────────────────────────────────────────────┤
│ ZONE 2: DYNAMIC WORKSPACE (Variable height — renders active WidgetSpec)      │
│   ┌─ [Inspector: Stalled Snap Buckets & Peer Health] ────────────────────┐   │
│   │ Bucket │ Status  │ Peer             │ Avg ms │ Last Issue            │   │
│   │────────┼─────────┼──────────────────┼────────┼───────────────────────│   │
│   │ 0x3..  │ STALLED │ Reth/v1.2 (a8f1) │ 1,420  │ Timeout on GetAccRng  │   │
│   │ 0x4..  │ SYNCING │ Geth/v1.15 (c31) │    84  │ OK (14,200 accounts)  │   │
│   └──────────────────────────────────────────────────────────────────────┘   │
│   > Bucket 0x3 stalled due to timeout on peer a8f1. Geth peers avg 84ms.     │
├──────────────────────────────────────────────────────────────────────────────┤
│ ZONE 3: CAPABILITY BAR (1 row — Traffic-Light Pills)                         │
│   ● P2P [19 Peers]   ◐ SNAP [Bucket 0x0-0x5]   ○ HEAD [Locked]   ● AI [Ready]│
├──────────────────────────────────────────────────────────────────────────────┤
│ ZONE 4: STICKY PROMPT (2 rows — Non-blocking Input + Ghost-Text Hint)        │
│   ethy > Ask e.g.: "Why is bucket 0x3 stalled?" [Tab to fill]                │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Key UX Mechanics

1. **Capability Pills (`●` Ready / `◐` Partial / `○` Locked):**
   - Immediately communicate what the node can answer right now without cluttering the screen.
2. **Phase-Aware Ghost-Text (`[Tab]` completion):**
   - When the prompt input is empty, dimmed ghost text suggests a query matching the currently active pills (`P2P_WARMUP` → peer latency questions; `SNAP_SYNCING` → bucket diagnostics & account sampling; `HEAD_FOLLOWING` → BAL diffs & EVM simulation). Pressing `Tab` populates the prompt.
3. **Onboarding Inspiration Carousel:**
   - Before the user runs their first command (or while an optional local LLM is initializing), Zone 2 rotates curated example prompts grouped by capability stage (`● P2P`, `◐ SNAP`, `● HEAD`).
4. **Declarative Micro-Widgets (No LLM ASCII Art):**
   - Small models miscount character widths when drawing raw ASCII tables. Instead, tools return a structured `WidgetSpec` (`table`, `key_value`, `bar_chart`, `hex_inspector`, or `onboarding_carousel`) plus an `assistantComment` string, and Zone 2 renders it deterministically.

---

## 4. Bidirectional State Awareness & `IntentEngine`

Both the user and the AI / command router share real-time awareness of node state:

### 1. Ephemeral `<ethy_state>` Prompt Header

Whenever a natural-language query is sent to the `IntentEngine`, Ethy prepends a compact telemetry block:

```xml
<ethy_state network="sepolia" slot="11482910" slot_delta="+2 since last query" phase="SNAP_SYNCING">
  capabilities: p2p=READY(19 peers), snap=PARTIAL(buckets_done: 0x0..0x2, stalled: 0x3), head=LOCKED
</ethy_state>
```

This allows the assistant to naturally acknowledge slot progression (`+2 slots since your last question`), explain why an unsynced address prefix (`0xd8dA...`) is not in the local DB yet (and offer an on-demand peer fetch), or inspect stalled buckets.

### 2. Dynamic Tool Gating

Only tools whose capability stage is active (`ready` or `partial`) are registered for the current turn:

| Phase | Unlocked Tools | What They Do |
| --- | --- | --- |
| **Stage 1: `P2P_WARMUP`** | `diagnoseSnapAndPeers`, `inspectNetworkTraffic`, `triggerDevAction` | Peer client breakdown (Geth/Reth/Nethermind), latency table, drop/reassign slow peers, inspect `diagnosticRingBuffer`. |
| **Stage 2: `SNAP_SYNCING`** | + `inspectRawAccountRange`, `sampleSyncedAccounts` | Inspect accounts already loaded in `StateStore` by prefix/balance, or fire a live `snap/1` `GET_ACCOUNT_RANGE` test request. |
| **Stage 3: `HEAD_FOLLOWING`** | + `inspectLatestBAL`, `inspectAccount`, `simulateTxOnHead` | Inspect EIP-7928 BAL account/storage mutations at head, query any account/contract slot, or run an on-demand `@ethereumjs/evm` call. |

### 3. Pluggable `IntentEngine` (Zero-Dep Default + Local LLM)

- **`DeterministicIntentEngine` (Built-in, 0 deps):**
  - Parses slash commands (`/peers`, `/buckets`, `/diag`, `/sample`, `/account <addr>`, `/drop <peerId>`, `/help`) and natural-language keyword patterns from second 0. Used in all CI runs and when no local LLM is configured.
- **`LocalHttpLlmEngine` (Built-in `fetch`, 0 deps):**
  - Speaks to any local OpenAI / `llama-server` compatible endpoint (`http://127.0.0.1:11434` or `127.0.0.1:8080`) with strict JSON schema output (`response_format` / `tools`) for ~1 GB local instruct models (1.5B–2B parameters).
- **Optional Embedded Local Model Adapter (`node-llama-cpp`):**
  - Can be added later (only with explicit human dependency approval) behind the exact same `IntentEngine` interface.

---

## 5. Sync, Consensus & Storage Strategy

### 1. Why No Beacon Node is Needed on Day 1 (3-Stage CL Evolution)

A full Beacon Node (like Lodestar) is too heavy to embed for our goals, and **on Day 1 we need zero consensus-layer code**:

- **The 128-Block `snap/1` Window Rule:** Execution peers (Geth, Reth) only keep the last **128 block state roots** (~25 minutes) available for `snap/1` queries (`snapAvailabilityDepth`). A hardcoded old state root will receive empty `[]` replies from live peers.
- **Stage 1 (Day-1 Pivot from `eth` Peer Header):** As soon as the first `eth/68..71` peer completes its `STATUS` handshake, Ethy requests the peer's latest block header via `GET_BLOCK_HEADERS` (using `bestHash` / `latestBlockHash` from `STATUS` or `BLOCK_RANGE_UPDATE`). That header provides a live, cryptographically linked `stateRoot` and `blockNumber` guaranteed to be inside the 128-block `snap/1` window — requiring **zero Beacon Node and zero external RPC**.
- **Stage 2 (Lightweight Beacon HTTP Pulse):** A ~50-line `fetch()` poller against `/eth/v1/beacon/states/head/header` to track slot ticks and canonical head roots during `HEAD_FOLLOWING`.
- **Stage 3 (Optional Embedded Sync-Committee Verifier):** Cryptographic sync-committee verification if trustless light-CL verification is desired later.

### 2. Amsterdam `snap/1` Sync Without Trie-Healing

1. **Account Range Sync (16 Hex Buckets `0x0..0xf`):**
   - Partition the 32-byte account-hash space (`0x0000...` to `0xffff...`) into 16 buckets (`0x0..0xf`).
   - Dispatch `GET_ACCOUNT_RANGE` (`SnapMessageCodes.GET_ACCOUNT_RANGE`) across connected `snap/1` peers.
   - Verify every response using `@ethereumjs/mpt`'s `verifyMerkleRangeProof`.
2. **Bytecode & Storage Range Sync:**
   - For accounts where `codeHash !== KECCAK256_NULL`, batch `GET_BYTE_CODES`.
   - For accounts where `storageRoot !== KECCAK256_RLP`, batch `GET_STORAGE_RANGES` and verify storage range proofs against the account's `storageRoot`.
3. **Transition to Head via `eth/71` BALs (No Trie-Healing!):**
   - Instead of healing missing intermediate MPT nodes caused by pivot drift, Ethy fetches the EIP-7928 Block-Level Access Lists (`GET_BLOCK_ACCESS_LISTS` in `eth/71`) from the pivot block up to the current head and applies the post-execution account/nonce/balance/code/storage values directly to the `FlatStateStore`.

### 3. Storage Layer (`StateStore` Interface)

- **Phase 1 (`InMemoryFlatStore`):** Pure TypeScript in-memory flat store (`Map` / typed byte buffers) for accounts, storage slots, and contract code blobs, plus an optional lightweight binary snapshot dump to disk. Keeps CI dependency-free and supports the **Rolling-Window Client (Model A)** immediately.
- **Phase 2 (Persistent Flat-First / Nibble-Path Store):** Pluggable persistent backend (custom memory-mapped flat file or approved native KV store) implementing the same `StateStore` contract.

---

## 6. EthereumJS Codebase Integration Map

Ethy builds directly on existing primitives in this monorepo. Implementation agents must be aware of these exact entry points and nuances:

| Package & File | What Exists Today | Ethy Integration & Nuances |
| --- | --- | --- |
| **`@ethereumjs/devp2p`**<br>`packages/devp2p/src/tui/` | `ansi.ts`, `render.ts`, `keys.ts`, `run.ts` — zero-dep ANSI helpers (`stripAnsi`, `visibleWidth`, `padVisible`), alternate screen (`\x1b[?1049h`), synchronized output (`\x1b[?2026h`). | Reuse/adapt these battle-tested ANSI and raw-mode key primitives directly for Ethy's 4-zone TUI. |
| **`@ethereumjs/devp2p`**<br>`packages/devp2p/src/worker/`<br>`packages/devp2p/src/protocol/` | `DPT`, `DNS`, `RLPx`, `Peer`, `SNAP` (`snap/1`), `ETH` (`eth/68`–`eth/72`), `lab/emptyReply.ts`. | **Worker-Threaded from Day 1 (`WP-00`):** `DPT` + `DNS` + `RLPx` run inside a dedicated `worker_threads` Worker (`createThreadedNetwork`), eliminating UDP `secp256k1` discovery storms and `Peer._onSocketData` O(N²) `concatBytes` copies from the main thread, and transferring subprotocol frames via zero-copy `ArrayBuffer`s. Note: `Peer._handleBody` (`peer.ts:600`) already decompresses Snappy before calling `SNAP._handleMessage`. |
| **`@ethereumjs/mpt`**<br>`packages/mpt/src/proof/range.ts` | `verifyMerkleRangeProof(rootHash, firstKeyRaw, lastKeyRaw, keysRaw, values, proof, useKeyHashingFunction)` | **Critical nuance:** `snap/1` `AccountRange` packets already contain **32-byte keccak256 account hashes** as keys, and **slim RLP** account bodies (`[nonce, balance, storageRoot, codeHash]`) that must be converted to **full RLP** (`KECCAK256_RLP` for empty `storageRoot`, `KECCAK256_NULL` for empty `codeHash`) before calling `verifyMerkleRangeProof` with `useKeyHashingFunction = (k) => k` (identity function). See the archived client account fetcher under `archive/client/src/sync/fetcher/` for reference. |
| **`@ethereumjs/util`**<br>`packages/util/src/bal/index.ts` | `BlockLevelAccessList`, `createBlockLevelAccessListFromRLP`, `createBlockLevelAccessListFromJSON`. | Use `createBlockLevelAccessListFromRLP` to decode `eth/71` `BLOCK_ACCESS_LISTS` payloads and verify `bal.hash()` against the block header's `blockAccessListHash`. |
| **`@ethereumjs/statemanager`**<br>`packages/statemanager/src/consumeBAL.ts` | `consumeBAL(stateManager, bal, expectedStateRoot)` | Applies EIP-7928 BAL post-values (including EIP-161 empty account deletion) without EVM execution. Use directly with `StateManagerInterface` or as the reference oracle for `FlatStateStore.applyBAL()`. |
| **`@ethereumjs/common`**<br>`packages/common/src/chains.ts` | Chain configs (`Mainnet`, `Sepolia`, `Holesky`, `Hoodi`), hardforks, `bootstrapNodes`, `dnsNetworks`. | **Note:** `Sepolia` in `chains.ts` currently lists `{ name: 'amsterdam', block: null }` without activation timestamp/forkHash. Auditing and updating `Sepolia` / testnet bootnodes and fork timestamps in `common` is tracked in `WP-02` (as a separate upstream library commit). |

### The "Good Citizen" `devp2p` Contract

Even as a lean/rolling-window client, Ethy is a net-positive peer on the network by following three rules:
1. **Honest `BLOCK_RANGE_UPDATE` (`eth/69+`):** Always advertise the actual block range held in memory/store; never claim blocks we cannot serve.
2. **Sub-millisecond Empty Replies (`<1ms`):** Whenever a peer requests headers, bodies, receipts, or BALs we do not have, immediately respond with a valid empty RLP reply (`[reqId, []]`) so we never stall a peer's request timeout timer.
3. **Polite Request Pacing:** Spread `snap/1` range requests across available peers, track per-peer latency/timeouts in `EthySpine`, and cache fetched accounts locally.

---

## 7. Three-Tier CI & Testing Strategy

CI runs must remain fast (<15s for unit tests), deterministic, and 100% independent of external networks, LLM weights, or external DBs:

1. **Tier 1 — Fast Unit, State-Machine & Virtual TUI Tests (Every Push / `npm test`):**
   - **`SyntheticSnapPeer`:** Generates 100–1,000 deterministic accounts in memory using `@ethereumjs/mpt`, slices them into the 16 hex buckets (`0x0..0xf`), encodes valid `snap/1` slim-account payloads + Merkle edge proofs, and tests the full `SnapSync` + `verifyMerkleRangeProof` + `diagnosticRingBuffer` pipeline (including injected corrupted proofs and peer timeouts).
   - **Virtual Framebuffer Assertions:** Calls `renderFrame(spine, viewState, 100, 30)`, strips ANSI via `stripAnsi`, and verifies that every line respects `<= 100` visible columns and renders the expected Hero Metrics, Zone 2 tables, Capability Pills, and Ghost-Text prompt.
   - **`DeterministicIntentEngine`:** Tests capability gating (`head=LOCKED` rejects head tools cleanly), `<ethy_state>` header formatting, and all tool handlers against `InMemoryFlatStore`.
2. **Tier 2 — Recorded Wire-Protocol Replay Fixtures:**
   - Replays captured Sepolia `devp2p` / `snap/1` / `eth/71` RLP wire frames through the decoder and sync state machine.
3. **Tier 3 — Local Live / LLM Smoke (`accept:live`):**
   - Local developer scripts connecting to live Sepolia peers and local LLM endpoints, with `--record-fixture` to save interesting prompt-to-widget interactions as deterministic Tier-1 JSON fixtures.
