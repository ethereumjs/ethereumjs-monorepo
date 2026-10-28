# Ethy (`@ethereumjs/ethy`) — Progress, Decisions & Change Ledger

This file is the **single source of truth** for project progress, architectural decisions, upstream `@ethereumjs/*` library touches, and implementation handoffs between the **Coordinator** (Gemini 4 Argon), **Planner** (Grok 4.7), and **Implementer** (Composer 2.5).

> **Rule for all agents:** Whenever you finish planning a Work Package (Planner) or implementing a Work Package (Implementer), you **must** update this file before finishing your turn.

---

## 1. Current Project Snapshot

- **Current Stage:** **WP-02** & **WP-02b** are **`DONE`** (#4419). Root causes for the live Sepolia `SUBPROTOCOL_ERROR` / `statusOk === 0` drop (`intToBytes(0)` / `bigIntToBytes(0n)` non-canonical RLP `0x00` vs `intToUnpaddedBytes` `0x80`, plus post-merge `{ blockNumber, timestamp }` header decoding) have been pinpointed and baked into **WP-03** (Slice 1 & 2). **WP-03** is **`READY_FOR_PLANNING`** on branch `ethy-wp03`.
- **Active Target Network:** `sepolia` (Amsterdam hardfork focus; generic `@ethereumjs/common` chain support).
- **Package Identity:** `@ethereumjs/ethy` (CLI binary: `ethy`, zero-config invocation `ethy` or `ethy sepolia`; unscoped `ethy` npm name transfer inquired).

---

## 2. Work Package Status Matrix

| ID | Work Package | Status | Dependencies | Spec File | Notes |
| --- | --- | --- | --- | --- | --- |
| **WP-00** | **`@ethereumjs/devp2p` Worker-Thread Architecture, Discovery Flow Control & Buffer Hardening** | `DONE` | None | [`work-packages/WP-00-devp2p-worker-and-hardening.md`](./work-packages/WP-00-devp2p-worker-and-hardening.md) | Shipped (#4417): `createThreadedNetwork`, `SocketByteQueue`, DPT/RLPx throttle, Good Citizen in worker, `inProcess` + real `Worker` ITs + README. |
| **WP-01** | **Foundation: Scaffolding, `EthySpine`, 4-Zone TUI & Deterministic Prompt Loop** | `DONE` | None | [`work-packages/WP-01-foundation-spine-and-tui-loop.md`](./work-packages/WP-01-foundation-spine-and-tui-loop.md) | `@ethereumjs/ethy` package: spine, deterministic prompt, `--demo`. Dedicated `ethy` CI job (#4418). |
| **WP-02** | **3-Box Domain-Lens Cockpit, Live P2P Harness & Fresh Pivot Header Acquisition** | `DONE` | WP-01 (`DONE`), WP-00 (`DONE`) | [`work-packages/WP-02-live-p2p-and-fresh-pivot.md`](./work-packages/WP-02-live-p2p-and-fresh-pivot.md) | PR #4419: devp2p head + bootnodes; ethy 3-box cockpit, `NoticeBoard`, `PeerCoordinator`, pivot header parser. |
| **WP-02b** | **Discovery health: metrics, Sepolia soak, ranked fixes** | `DONE` | WP-02 | [`work-packages/WP-02b-discovery-health.md`](./work-packages/WP-02b-discovery-health.md) | PR #4419: Worker discovery snapshot; endpoint/DNS/resolver fixes; headless JSON soak (`tablePeers: 65`, `connected: 34`). |
| **WP-03** | **Live `ETH` Status / RLP Canonical Zero Fix, `@ethereumjs/statemanager` `FlatStateManager` & 16-Bucket `snap/1` Sync** | `READY_FOR_PLANNING` | WP-01, WP-02, WP-02b (`DONE`) | [`work-packages/WP-03-snap-account-sync-and-microscope.md`](./work-packages/WP-03-snap-account-sync-and-microscope.md) | Fixes `intToBytes(0)` → `intToUnpaddedBytes(0)` (`SUBPROTOCOL_ERROR` root cause) + post-merge header timestamp HF; adds `FlatStateManager` directly to `@ethereumjs/statemanager`; implements `SyntheticSnapPeer`, 16-bucket `GET_ACCOUNT_RANGE` + `verifyMerkleRangeProof`, and `/range` & `/sample` tools. |
| **WP-04** | **Bidirectional Local LLM `IntentEngine` (`<ethy_state>` & Tool Gating)** | `READY_FOR_PLANNING` | WP-01, WP-02 (`DONE`) | [`work-packages/WP-04-local-llm-intent-engine.md`](./work-packages/WP-04-local-llm-intent-engine.md) | Zero-dep local HTTP JSON-schema LLM engine (`llama-server` 1.7B instruct), `<ethy_state>` header injection, dynamic phase tool gating, `--record-fixture` CI replay. |
| **WP-05** | **Contract Storage/Bytecode Sync & Zero-Execution `eth/71` BAL Head Follower** | `BLOCKED_BY_WP-03` | WP-03 | [`work-packages/WP-05-storage-code-and-bal-head-follower.md`](./work-packages/WP-05-storage-code-and-bal-head-follower.md) | `GET_BYTE_CODES` + `GET_STORAGE_RANGES`, healing-free pivot-to-head bridge via `eth/71` `GET_BLOCK_ACCESS_LISTS` (`BlockLevelAccessList` + `consumeBAL`), `inspectLatestBAL` widget. |
| **WP-06** | **On-Demand `@ethereumjs/evm` Sandbox, Light Beacon Pulse & Headless SDK** | `BLOCKED_BY_WP-05` | WP-04, WP-05 | [`work-packages/WP-06-on-demand-evm-and-headless-sdk.md`](./work-packages/WP-06-on-demand-evm-and-headless-sdk.md) | On-demand EVM call/trace against `StateStore` (with cold-account `snap/1` fallback), HTTP Beacon header pulse, `createEthyNode({ headless: true })` SDK for FYP/MCP. |

*Status values: `READY_FOR_PLANNING` → `PLANNED` (Grok 4.7 finished concrete plan) → `IN_PROGRESS` (Composer 2.5 implementing) → `DONE` (tests + tsc + spellcheck green).*

---

## 3. Architectural Decision Log (ADR)

Every structural choice or mid-flight adjustment must be recorded here with its reasoning so future sessions understand *why* the system is shaped this way.

| ID | Date | Decision | Reasoning |
| --- | --- | --- | --- |
| **D-001** | 2026-10-26 | **Package name `@ethereumjs/ethy` with `ethy` CLI bin and zero-config `ethy [network]`** | Unscoped `ethy` on npm is currently held by an older project (transfer requested via email). Using `@ethereumjs/ethy` with `"bin": { "ethy": "bin/ethy.cjs" }` gives immediate `ethy sepolia` ergonomics and allows a 1-line switch if `ethy` is transferred. |
| **D-002** | 2026-10-26 | **Strict Dependency Lock (Zero third-party deps in Phase 1)** | Protects the v10 runtime diet (`dependencies.mdc`) and avoids supply-chain/native-build friction. TUI (ANSI), Spine, Store, and HTTP LLM adapter can all be built with `node:*`, `@ethereumjs/*`, and `@noble/*`. Any external library requires explicit human approval. |
| **D-003** | 2026-10-26 | **Headless `EthyCore` + `EthySpine` decoupled from `EthyTUI`** | Allows the exact same state/sync/tool engine to drive the 4-zone terminal UI *and* act as a headless programmatic/MCP simulation backend (e.g. for *Feel Your Protocol*). |
| **D-004** | 2026-10-26 | **Declarative `WidgetSpec` instead of LLM-drawn ASCII** | Small ~1 GB models miscount character columns in raw ASCII art. Having tools return structured `WidgetSpec` objects (`table`, `key_value`, `bar_chart`, `hex_inspector`) guarantees pixel-accurate terminal layout and zero hallucinated hex/numbers. |
| **D-005** | 2026-10-26 | **No Beacon Node on Day 1; acquire fresh pivot `stateRoot` from best `eth` peer** | Live `snap/1` peers only retain the last 128 state roots (~25 min). A hardcoded root goes stale quickly, while embedding a full CL is too heavy. Fetching the latest block header from our best `eth/68..71` peer after `STATUS` yields a fresh `stateRoot` inside the 128-block window with 0 CL overhead. |
| **D-006** | 2026-10-26 | **Amsterdam-first `snap/1` + `eth/71` BAL sync (No Trie-Healing)** | Classic `GetNodeData` / `GetTrieNodes` trie-healing is complex and slow. With EIP-7928 BALs (`eth/71`), we sync flat state at the pivot via `snap/1` and apply deterministic post-execution BAL diffs forward to the head without EVM execution. |
| **D-007** | 2026-10-26 | **100% Offline & Deterministic CI via `IntentEngine`, `StateStore`, and `SyntheticSnapPeer`** | GitHub CI must never download 1 GB model weights, open external P2P sockets, or require native DBs. `@ethereumjs/mpt` can generate a 100–1,000 account mini-trie with valid Merkle range proofs in <50ms in memory. |
| **D-008** | 2026-10-26 | **Active Upstream `@ethereumjs/*` Hardening & Commit Isolation** | A core reason to build Ethy is to battle-test and improve the general `@ethereumjs/*` library stack. `@ethereumjs/devp2p` can be refactored radically while keeping broad research/production appeal; other active libraries (`common`, `mpt`, `statemanager`, `util`, etc.) receive backwards-compatible improvements committed separately for standalone upstream PRs. |
| **D-009** | 2026-10-27 | **Day-1 Worker-Thread Parallelization & Hardening in `@ethereumjs/devp2p` (`WP-00`)** | `DPT` UDP discovery (`secp256k1` sign/recover on every packet) and `Peer._onSocketData` (`concatBytes` O(N²) buffer reallocation + ECIES + Snappy) starve the main thread. Running `DPT` + `DNS` + `RLPx` 100% inside a dedicated `worker_threads` Worker (`createThreadedNetwork`) with `DPT` saturation throttling and zero-copy `ArrayBuffer` transfers solves this from Day 1 for both Ethy and external `@ethereumjs/devp2p` users. |
| **D-010** | 2026-10-27 | **`SocketByteQueue` replaces `Peer._socketData` concat** | Eliminates O(N²) `concatBytes` on every TCP chunk while preserving Auth/Ack/Header/Body state machine and EIP-8 length peeks without premature consume. |
| **D-011** | 2026-10-27 | **Discovery throttle opt-in; threaded API enables by default** | `RLPxOptions.throttleDiscovery` defaults `false` for library backwards compatibility; `createThreadedNetwork` sets `true` with low-water hysteresis and bounded in-flight DPT pings. |
| **D-012** | 2026-10-27 | **Cloneable chain id + in-process / Worker dual transport** | `Common` stays in-worker; main thread sends chain name + hardfork. Same message protocol over `MessageChannel` or `worker_threads`; worker entry resolved without `import.meta` in CJS builds. |
| **D-013** | 2026-10-27 | **Worker-owned STATUS, Good Citizen, block range** | Avoid 5s status timeout waiting on main thread; `emptyWireReply` extended for eth/71; inbound gets answered in-worker when `goodCitizen` is on. |
| **D-014** | 2026-10-27 | **Snappy tied to base protocol v5; single decompress site** | Live snap tests assume HELLO v5; v4 outbound behavior is unit-tested via stubbed hello only. |
| **D-015** | 2026-10-27 | **WP-01 runtime dep: `@ethereumjs/common` only** | Avoid pulling `ethy` into the static CI job on every sibling-package PR; add workspace deps when each WP first imports them. |
| **D-016** | 2026-10-27 | **Copy devp2p ANSI width helpers; no devp2p dep until WP-02** | `ansi.ts` is internal to devp2p; Ethy duplicates `stripAnsi` / `visibleWidth` / sync output sequences locally. |
| **D-017** | 2026-10-27 | **AI capability pill `partial` (Slash/Rule Mode) on Day 1** | `ready` reserved for reachable local LLM in WP-04; slash tools work immediately. |
| **D-018** | 2026-10-27 | **Pure `renderFrame` + key reducer; Node TTY only in cli/session** | Headless core stays terminal-agnostic; tests use virtual framebuffer without raw stdin. |
| **D-019** | 2026-10-27 | **Ethy tests in existing `static` CI job** | First landing used `SKIPPABLE_JOBS.static` plus a workflow step. Superseded by **D-023**. Not added to npm `ACTIVE_PACKAGES` until publish. |
| **D-020** | 2026-10-27 | **Head tools registered as gated stubs in WP-01** | `/account`, `/bal`, `/simulate` return `key_value` when `head` locked; real BAL/EVM in WP-05/06. |
| **D-021** | 2026-10-27 | **`advanceDemo(spine, elapsedMs)` deterministic** | Stalled bucket always `0x3`; no randomness or network I/O. |
| **D-022** | 2026-10-27 | **Page layout owns insets; capability color is per id** | `pageLayout` insets content by one column; rules stay full width. `CAPABILITY_FG` is the only color source. Readiness changes the glyph, not the color. |
| **D-023** | 2026-10-27 | **Dedicated `ethy` CI job** | Ethy tests run in `.github/workflows/ethy-build.yml`. An Ethy change runs that job. Static-bundle packages stay on the static job. A `common` change still runs Ethy, because Ethy depends on it. |
| **D-024** | 2026-10-28 | **3-Box Domain-Lens Cockpit & 1-Key/2-Key Ergonomics (`ethy-tui.mdc` & `WP-02`)** | Replaces the bottom suggestion carousel with three fine-line rounded boxes (`╭─╮`) below the top rule: Left (`Node Pulse` overview), Middle (`<Mark> <Domain> Commands`), Right (`<Mark> <Domain> Metrics [Enter]`). The prompt prefix `● ethy >` holds the active domain mark; pressing `Tab` (on empty draft) cycles `activeDomain` (`p2p` → `snap` → `head` → `ai`) in 1 key without wiping the Main Interaction Area, and pressing `Enter` (on empty draft) opens that domain's deep view in the Main Area in 2 keys (`Tab` → `Enter`). |
| **D-025** | 2026-10-28 | **WP-02 keyboard: domain cycle vs slash complete vs deep view** | Empty `Tab`/`Shift+Tab` cycle `activeDomain`; `Tab`/Right complete slash drafts; empty `Enter` opens domain default widget; ghost stays on footer; `slashComplete.ts` for prefixes and `/p`-style Enter expansion. |
| **D-026** | 2026-10-28 | **`CapabilityId` on spine types** | `CapabilityId` exported from `spine/types.ts` so core/spine never imports `src/tui/`. |
| **D-027** | 2026-10-28 | **Drop carousel band; keep widget kind** | Default `renderFrame` removes onboarding carousel; `onboarding_carousel` remains in `WidgetSpec` for tests/widgets. |
| **D-028** | 2026-10-28 | **`PeerCoordinator` wired from CLI only** | `createEthyNode` stays sync/socket-free; live P2P starts in `main.ts` when not `--demo` (includes `--headless`). |
| **D-029** | 2026-10-28 | **Worker peer head + opt-in discovery defaults** | `WorkerPeerSnapshot` gains optional head fields via `ETH.peerStatusHead()`; bootnodes/DNS from `Common` only when `shouldFindNeighbours !== false` and `bootnodes` omitted; worker default discovery off. |
| **D-030** | 2026-10-28 | **Live hardfork = timestamp lookup** | Ethy passes `getHardforkBy({ timestamp: now })` to threaded network; Amsterdam left unscheduled in `chains.ts` until published. |
| **D-031** | 2026-10-28 | **Pivot header pick + refresh policy** | One in-flight `GET_BLOCK_HEADERS` to highest `latestBlock` peer with `bestHash`; verify header hash; refresh when best peer > pivot + 96 blocks; phase `P2P_WARMUP` at coordinator start. |
| **D-032** | 2026-10-28 | **CI pivot test on loopback only** | `net.spec.ts` uses two `inProcess` nodes; header server `goodCitizen: false`; default ethy tests no public P2P/DNS. |
| **D-033** | 2026-10-28 | **TUI Craft Laws: Internal Padding, Shared Two-Column Rhythm, Bold/Dim Hierarchy & `NoticeBoard` (`ethy-tui.mdc`)** | Cockpit boxes are 8 rows high (1 blank padded row top/bottom around 4 content rows) sharing a cross-box `maxLabelWidth` (`TWO_COLUMN_MIN_GAP = 2`). Bold is strictly for anchors/keys (`Ethy`, pill names, box titles, `ethy >`, footer key chords); Dim is for borders/rules/prose. Prompt band aligns to `cockpitColumnWidths` (2/3 left for prompt + hints, 1/3 right under Metrics for `NoticeBoard` with 4s minimum dwell). |
| **D-034** | 2026-10-28 | **Canonical RLP Scalar Zero (`intToUnpaddedBytes` / `bigIntToUnpaddedBytes`) & Post-Merge Header Timestamp HF (`WP-03`)** | Root cause of `WP-02b` live Sepolia `SUBPROTOCOL_ERROR` (`statusOk: 0` across 34 connected peers): `intToBytes(0)` / `bigIntToBytes(0n)` emit `Uint8Array([0])` (`0x00`), which Geth/Reth reject as non-canonical RLP integer (`uint64` zero must be `new Uint8Array(0)` = `0x80`). All wire integer encodings (`eth/69` `STATUS` `earliestBlock`/`latestBlock`, `GET_BLOCK_HEADERS` `skip`/`reverse`, `BLOCK_RANGE_UPDATE`, `HELLO` port, `snap/1` `reqId`/`bytes`) must use `intToUnpaddedBytes` / `bigIntToUnpaddedBytes`. In addition, `pivotHeader.ts` must pass `{ blockNumber, timestamp }` to `common.setHardforkBy` so post-Merge timestamp-scheduled headers decode cleanly. |

| **D-035** | 2026-10-28 | **`FlatStateManager` in `@ethereumjs/statemanager` (`WP-03`)** | Instead of a private `InMemoryFlatStore` inside `packages/ethy`, we build and export `FlatStateManager` (`createFlatStateManager`) directly in `@ethereumjs/statemanager`. It keys accounts/storage by 32-byte `keccak256` hashes (with optional 20-byte `Address` / 32-byte slot key preimage tracking), deduplicates bytecode by `codeHash`, uses a delta-only checkpoint stack + O(1) Copy-on-Write `shallowCopy()` (solving `SimpleStateManager`'s O(N) full-map clone on every checkpoint), and implements `StateManagerInterface` + `consumeBAL` + `snap/1` batch ingestion (`putSnapAccountsBatch`, `putSnapStorageBatch`, `putCodeByHash`). |

---

## 4. Upstream Library Touch Queue (`@ethereumjs/*` outside `ethy`)

Track every modification or planned modification to sibling monorepo packages here so they can be reviewed and committed cleanly in separate commits/PRs.

| Package | File(s) | Kind | Status | Description & Reasoning |
| --- | --- | --- | --- | --- |
| `@ethereumjs/devp2p` | `packages/devp2p/src/rlpx/peer.ts`, `socketByteQueue.ts`, `src/dpt/dpt.ts`, `src/rlpx/rlpx.ts`, `src/lab/emptyReply.ts`, `src/worker/*`, tests under `test/rlpx/`, `test/dpt/`, `test/worker/`, `test/protocol/` | Performance & Worker Architecture (WP-00) | `DONE` (#4417) | Merged in #4417: threaded network API, `SocketByteQueue`, discovery throttle, `inProcess` + real `Worker` tests + README § Threaded network. |
| `@ethereumjs/devp2p` | `packages/devp2p/src/protocol/eth.ts`, `src/worker/host.ts`, `protocol.ts`, `bootNodes.ts`, `src/discovery/metrics.ts`, `src/dpt/*`, `src/dns/*` | Enhancement & Discovery Health (WP-02 & WP-02b) | `DONE` (#4419) | `ETH.peerStatusHead()`, `WorkerPeerSnapshot` head fields, `bootNodesFromCommon`, `DiscoveryMetrics` + `WorkerDiscoverySnapshot`, OS DNS resolver default, bound endpoint sync. |
| `@ethereumjs/devp2p` | `packages/devp2p/src/lab/messages/eth.ts`, `src/lab/messages/snap.ts`, `src/protocol/eth.ts`, `src/protocol/eth/codec.ts`, `src/rlpx/peer.ts` | Bugfix: RLP Canonical Zero & `snap/1` Builder (Target: WP-03) | `IDENTIFIED` | Replace `intToBytes` / `bigIntToBytes` with `intToUnpaddedBytes` / `bigIntToUnpaddedBytes` so `0` encodes as canonical `0x80` instead of `0x00` (fixing live Geth/Reth `SUBPROTOCOL_ERROR` on `eth/69` `STATUS` and `GET_BLOCK_HEADERS`); update `messages/snap.ts` `GET_ACCOUNT_RANGE` to 5-element wire tuple; surface caught subprotocol error message from `Peer._handleBody`. |
| `@ethereumjs/statemanager`, `@ethereumjs/evm`, `@ethereumjs/vm` | `packages/statemanager/src/flatStateManager.ts`, `src/index.ts`, `test/flatStateManager.spec.ts`, `test/checkpointing.*.spec.ts`, `test/consumeBAL.spec.ts`, plus `evm` & `vm` API specs | New Feature & Cross-Stack Matrix: `FlatStateManager` (Target: WP-03) | `IDENTIFIED` | Export `FlatStateManager` (`createFlatStateManager`) implementing `StateManagerInterface` + hash-keyed `snap/1` batch ingestion (`putSnapAccountsBatch`, `putSnapStorageBatch`, `putCodeByHash`), delta-only checkpointing, and O(1) Copy-on-Write `shallowCopy()` overlays; wire into `statemanager` checkpoint/BAL matrices plus `evm` (`runCall`) and `vm` (`runTx`) tests. |
| `@ethereumjs/common` | `packages/common/src/chains.ts` | Maintenance (WP-02) | `DONE` (audit only) | Sepolia/Hoodi fork timestamps + Hoodi bootnodes match geth chain specs; DNS discovery URLs match. Sepolia static bootnodes stale vs geth ENR list — DNS discovery sufficient; ENR refresh deferred. |

---

## 5. Chronological Progress Log

*Agents: Append a new dated subsection at the top of this list after each Planning (Grok 4.7) or Implementation (Composer 2.5) pass.*

### 2026-10-28 — Post-`WP-02`/`WP-02b` Review, TUI Craft Rules & `SUBPROTOCOL_ERROR` Root-Cause Diagnosis for `WP-03` (Coordinator — Gemini 4 Argon)
- Distilled the `WP-02` UI refinements into [`packages/ethy/.cursor/rules/ethy-tui.mdc`](./.cursor/rules/ethy-tui.mdc) (Decision **D-033**): 8-row boxes with vertical internal padding, shared cross-box `maxLabelWidth`, Bold-for-anchors/keys vs. Dim-for-borders/prose, and column-aligned footer grid with 4s-dwell `NoticeBoard`.
- Investigated the `WP-02b` live Sepolia soak blocker (`rlpx.connected: 34`, `statusOk: 0`, `SUBPROTOCOL_ERROR: 6`) and identified three concrete wire bugs (Decision **D-034**):
  1. `intToBytes(0)` / `bigIntToBytes(0n)` emitting non-canonical RLP `0x00` instead of `0x80` (`intToUnpaddedBytes(0)`) in `eth/69` `STATUS` (`earliestBlock: 0`), `GET_BLOCK_HEADERS` (`skip: 0, reverse: 0`), `BLOCK_RANGE_UPDATE`, and `HELLO` port `0`.
  2. Odd-length hex normalization in `ethStatusFromFields` / `genesisStatus.ts`.
  3. Missing `timestamp` (`fields[11]`) in `pivotHeader.ts`'s `common.setHardforkBy({ blockNumber, timestamp })` for post-Merge headers.
- Updated [`.cursor/rules/ethy-architecture.mdc`](../../.cursor/rules/ethy-architecture.mdc) and [`work-packages/WP-03-snap-account-sync-and-microscope.md`](./work-packages/WP-03-snap-account-sync-and-microscope.md) (`READY_FOR_PLANNING`) with these exact fixes plus `@ethereumjs/util`'s `accountBodyFromSlim` / `accountBodyToRLP` helpers.

### 2026-10-28 — WP-02 `DONE` + common audit (Implementer — Composer 2.5)
- WP-02 §3 filled; acceptance criteria checked; status **`DONE`**. PR [#4419](https://github.com/ethereumjs/ethereumjs-monorepo/pull/4419).
- Common Slice 2: verified Sepolia/Hoodi against geth chain specs + bootnodes (no edit); noted Sepolia static bootstrap drift.
- WP-03 matrix row **`BLOCKED_BY_WP-02` → `READY_FOR_PLANNING`**.

### 2026-10-28 — WP-02 implementation start (Implementer — Composer 2.5)
- Commits on `ethy-wp02`: devp2p worker head + bootnodes; `WorkerPeerSnapshot` export; ethy 3-box cockpit, domain-lens prompt, `PeerCoordinator` + pivot header parse, loopback `net.spec.ts`.
- Ethy `tsconfig` uses `customConditions: []` so `@ethereumjs/devp2p` resolves to built `dist` (avoids cross-package `rootDir` tsc errors).
- Gates: `packages/devp2p` + `packages/ethy` tsc, tests, spellcheck green locally.

### 2026-10-28 — WP-02 concrete implementation plan (`PLANNED`) (Planner — Grok 4.7)
- Filled [`work-packages/WP-02-live-p2p-and-fresh-pivot.md`](./work-packages/WP-02-live-p2p-and-fresh-pivot.md) §2: three-slice implementer plan (devp2p, common audit, ethy cockpit + `PeerCoordinator` + tests), file tree, and gates.
- Recorded planning refinements **D-025** through **D-032** (keyboard ergonomics, spine `CapabilityId`, CLI coordinator wiring, worker head telemetry, pivot policy, loopback CI).
- Upstream touch queue: `@ethereumjs/devp2p` and `@ethereumjs/common` WP-02 rows **`IDENTIFIED` → `PLANNED`**. WP-02 matrix status **`PLANNED`**.

### 2026-10-28 — 3-Box Domain-Lens Cockpit Rules (`ethy-tui.mdc`) & `WP-02` Scope Update (Coordinator — Gemini 4 Argon)
- Codified the **3-Box Domain-Lens Cockpit** and **1-Key/2-Key Keyboard Ergonomics** in [`packages/ethy/.cursor/rules/ethy-tui.mdc`](./.cursor/rules/ethy-tui.mdc), [`.cursor/rules/ethy-architecture.mdc`](../../.cursor/rules/ethy-architecture.mdc), and [`ARCHITECTURE.md`](./ARCHITECTURE.md) (Decision **D-024**).
- Baked the 3-Box Cockpit + `● ethy >` `Tab`/`Enter` domain-lens workflow directly into [`work-packages/WP-02-live-p2p-and-fresh-pivot.md`](./work-packages/WP-02-live-p2p-and-fresh-pivot.md) (Part A) alongside the live threaded `devp2p` harness and pivot header acquisition (Parts B & C), and aligned follow-up references in `WP-03`–`WP-05`.

### 2026-10-27 — Dedicated Ethy CI job (Implementer — Grok 4.7)
- Ethy tests moved out of the static bundle into `ethy-build.yml`, gated by `SKIPPABLE_JOBS.ethy`. Decision **D-023**.

### 2026-10-27 — WP-01 TUI chrome (Implementer — Grok 4.7)
- Title row shows client, network, and slot beside fixed-color capability marks.
- Suggestions sit above the prompt: commands on the left, prose on the right, rotating on a slow interval.
- The prompt has a terminal cursor. Tab fill shares the hint row with "Enter submit", right-aligned.
- WP-01 stays `DONE`. Next package work is WP-02.

### 2026-10-27 — WP-01 foundation implementation (`DONE`) (Implementer — Composer 2.5)
- Added `@ethereumjs/ethy` package: `EthySpine`, `createEthyNode`, four-zone `renderFrame`, `DeterministicIntentEngine`, `--demo` / `--headless`, CLI `ethy`.
- Tests: 28 vitest cases (`spine`, `tui`, `intent`, `demo`, `args`); CI wired via `static` job. Decisions **D-015**–**D-021** recorded.
- WP-02 unblocked on Ethy side (still needs devp2p worker polish from touch queue).

### 2026-10-27 — WP-01 concrete implementation plan (`PLANNED`) (Planner — Grok 4.7)
- Filled [`work-packages/WP-01-foundation-spine-and-tui-loop.md`](./work-packages/WP-01-foundation-spine-and-tui-loop.md) §2 (file tree, interfaces, CI, tests) and refinements D-015–D-021.

### 2026-10-27 — WP-00 implementation complete (`DONE`) (Implementer — Composer 2.5)
- Landed `@ethereumjs/devp2p` WP-00 on `new-client-devp2p-wp0`: `SocketByteQueue`, DPT pause / in-flight ping cap, RLPx discovery throttle, `createThreadedNetwork` + worker host/client, Good Citizen in worker, exports + README.
- Tests: `socketByteQueue`, `peer-buffer`, `dpt-throttling`, `snap-snappy`, `worker-network` (in-process), extended `emptyReply` eth/71. `npm run tsc` + full `npm test` green in `packages/devp2p`.
- WP-00 §3 notes + matrix/touch queue updated; WP-02 unblocked on devp2p side (still waits on WP-01).

### 2026-10-27 — WP-00 concrete implementation plan (`PLANNED`) (Planner — Grok 4.7)
- Filled [`work-packages/WP-00-devp2p-worker-and-hardening.md`](./work-packages/WP-00-devp2p-worker-and-hardening.md) §2: file tree, worker API, test matrix, implementer gates.
- Recorded planning refinements **D-010** through **D-014** (SocketByteQueue, opt-in DPT throttle, cloneable worker config, Good Citizen in worker, snappy/v5 policy).
- Updated touch queue for `@ethereumjs/devp2p` from `IDENTIFIED` → `PLANNED`. WP-00 status **`PLANNED`**; WP-01 unchanged **`READY_FOR_PLANNING`**.

### 2026-10-27 — Added `WP-00` (`@ethereumjs/devp2p` Worker-Thread & Hardening) & Ecosystem Hardening Rule (Coordinator — Gemini 4 Argon)
- Conducted feasibility and hot-path analysis of `@ethereumjs/devp2p` (`DPT` UDP `secp256k1` storms, `Peer._onSocketData` O(N²) `concatBytes` reallocations, and `Peer._handleBody` Snappy flow).
- Added **`WP-00-devp2p-worker-and-hardening.md`** as the dedicated first work package (`WP-00`) to introduce a general-purpose `worker_threads` runtime (`createThreadedNetwork`), `DPT` discovery throttling, and `Peer` buffer optimization directly in `@ethereumjs/devp2p`.
- Elevated **hardening and improving the general `@ethereumjs/*` library stack** (with backwards-compatibility and atomic commit isolation) as a primary principle in `.cursor/rules/ethy-workflow.mdc`, `.cursor/rules/ethy-architecture.mdc`, `AGENTS.md`, and `ARCHITECTURE.md`.

### 2026-10-26 — Initial Architecture, Multi-Agent Rules & Work-Package Suite (Coordinator — Gemini 4 Argon)
- Retired the bilingual brainstorming transcript and consolidated all architectural, product, and EthereumJS codebase findings into English documentation (`AGENTS.md`, `ARCHITECTURE.md`, `PROGRESS.md`).
- Created glob-scoped Cursor rules `.cursor/rules/ethy-workflow.mdc` and `.cursor/rules/ethy-architecture.mdc` (`globs: packages/ethy/**`).
- Designed 6 holistic vertical Work Packages (`work-packages/WP-01` through `WP-06`) so every step produces a runnable, live-testable, and CI-verified slice of Ethy.
