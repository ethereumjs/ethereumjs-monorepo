# Ethy (`@ethereumjs/ethy`) — Progress, Decisions & Change Ledger

This file is the **single source of truth** for project progress, architectural decisions, upstream `@ethereumjs/*` library touches, and implementation handoffs between the **Coordinator** (Gemini 4 Argon), **Planner** (Grok 4.7), and **Implementer** (Composer 2.5).

> **Rule for all agents:** Whenever you finish planning a Work Package (Planner) or implementing a Work Package (Implementer), you **must** update this file before finishing your turn.

---

## 1. Current Project Snapshot

- **Current Stage:** **WP-03b** is **`DONE`** (#4421) — live Sepolia `snap/1` sync is now verified past **3.48M+ accounts at ~6,000 acc/sec** with persistent journal recovery (`SnapPivotStore`) and `PeerBookStore` startup redial! Audit of the remaining `snap peer left` drops and `eth/69–71` serving requirements revealed that `ethStatusFromFields` and `peerCoordinator.ts` were advertising `earliestBlock = 0 .. 12,020,039` (claiming full archive history from Genesis) while replying `[]` to historical block queries. **WP-03c** (*Honest Block-Range Advertising (`earliestBlock` Fix) & Full Rolling-Window `eth/69–71` Server*) is now **`READY_FOR_PLANNING`** as the immediate next work package.
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
| **WP-03** | **Live `ETH` Status / RLP Canonical Zero Fix, `@ethereumjs/statemanager` `FlatStateManager` & 16-Bucket `snap/1` Sync** | `DONE` | WP-01, WP-02, WP-02b (`DONE`) | [`work-packages/WP-03-snap-account-sync-and-microscope.md`](./work-packages/WP-03-snap-account-sync-and-microscope.md) | Shipped (#4420): canonical RLP zeros, `FlatStateManager`, snap sync, microscope tools. |
| **WP-03b** | **P2P Master Plan: Surgical 4-Stage Probe, Direct DNS/EIP-868 ENR Pipeline & Live `snap/1` Verification** | `DONE` | WP-03 (`DONE`) | [`work-packages/WP-03b-p2p-probe-and-enr-pipeline.md`](./work-packages/WP-03b-p2p-probe-and-enr-pipeline.md) | Shipped (#4421): ENR `id` + `ethForkId`, DNS→`peer:new`, `SnapPivotStore` + `PeerBookStore`, verified >3.48M Sepolia accounts synced live at ~6k acc/s! |
| **WP-03c** | **Honest Block-Range Advertising (`earliestBlock` Fix) & Full Rolling-Window `eth/69–71` Server** | `READY_FOR_PLANNING` | WP-03b (`DONE`) | [`work-packages/WP-03c-honest-range-and-eth-rolling-server.md`](./work-packages/WP-03c-honest-range-and-eth-rolling-server.md) | Stops false `earliestBlock = 0` advertisement; adds `RollingBlockStore` + `ethServer` (`Headers`, `Bodies`, `Receipts` `eth/69–70`, `BALs` `eth/71`) in `@ethereumjs/devp2p` worker; surfaces `Served` metric in `P2P Metrics` box. |
| **WP-04** | **Bidirectional Local LLM `IntentEngine` (`<ethy_state>` & Tool Gating)** | `READY_FOR_PLANNING` | WP-01, WP-02, WP-03b | [`work-packages/WP-04-local-llm-intent-engine.md`](./work-packages/WP-04-local-llm-intent-engine.md) | Zero-dep local HTTP JSON-schema LLM engine (`llama-server` 1.7B instruct), `<ethy_state>` header injection, dynamic phase tool gating, `--record-fixture` CI replay. |
| **WP-05** | **Contract Storage/Bytecode Sync & Zero-Execution `eth/71` BAL Head Follower** | `BLOCKED_BY_WP-03c` | WP-03, WP-03b, WP-03c | [`work-packages/WP-05-storage-code-and-bal-head-follower.md`](./work-packages/WP-05-storage-code-and-bal-head-follower.md) | `GET_BYTE_CODES` + `GET_STORAGE_RANGES`, healing-free pivot-to-head bridge via `eth/71` `GET_BLOCK_ACCESS_LISTS` (`BlockLevelAccessList` + `consumeBAL`), feeds rolling blocks into `RollingBlockStore`. |
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
| **D-036** | 2026-10-28 | **EIP-2124 fork-check head + subprotocol error telemetry (`WP-03`)** | Post-Merge `peerNextFork` is a unix timestamp; compare via `forkValidationHead(common, latestBlock, nowSec)` instead of raw block number. Surface last subprotocol handler error on `DiscoveryMetrics.rlpx.lastSubprotocolError` and worker diagnostics (200-char truncate). |
| **D-037** | 2026-10-28 | **Flat storage keys + live `shallowCopy` overlay (`WP-03`)** | Address API storage uses `keccak256(slot)`; snap batches use slot hashes. Child overlay reads through parent; delta-only checkpoints; no state-root APIs; `consumeBAL` without expected root. |
| **D-038** | 2026-10-28 | **Snap range proof boundary (`WP-03`)** | CI synthetic trie: `useKeyHashing: false`; slim bodies expanded before verify; use default `verifyMerkleRangeProof` hasher (identity callback breaks proof trie roots). |
| **D-039** | 2026-10-28 | **Snap scheduler policy (`WP-03`)** | One in-flight `GET_ACCOUNT_RANGE` per snap peer; 512 KiB response budget; synthetic bucket `0x3` first-proof fault injection. |
| **D-040** | 2026-10-28 | **`EthyNode.stateManager` ownership (`WP-03`)** | Flat manager on node; spine counters only; intent engine wired with `disconnectPeer` from coordinator. |
| **D-041** | 2026-10-28 | **`snapPaused` + slash prefixes (`WP-03`)** | `/pause` and `/resume`; `/ra` → `/range `, `/sa` → `/sample`; `/r` stays reassign. |
| **D-042** | 2026-10-28 | **Ethy tsc vs built workspace dist (`WP-03`)** | `customConditions: []` on ethy tsconfig; build `@ethereumjs/statemanager` before ethy typecheck when flat types are new. |
| **D-043** | 2026-10-29 | **Close WP-03 without a sustained live STATUS (`WP-03`)** | Peer rows in the cockpit are RLPx sessions after HELLO. Validated ETH STATUS is the footer `status` count. The ETH subprotocol disconnects with `TIMEOUT` after 5 seconds if that handshake does not finish, which matches soaks where a peer stays up for about 5–8 seconds and then leaves. Snap account sync sends `GET_ACCOUNT_RANGE` only after a pivot header, and that header is requested only from a validated head. `status` stayed 0 on the closing soaks, so snap correctly stayed idle. ethy offers eth/69–72. Bootnodes and DNS peers dial before discovery-v4 neighbors. Further live STATUS work is out of this package. |
| **D-044** | 2026-10-29 | **P2P Master Plan (`WP-03b`): Direct DNS-to-RLPx, EIP-868 `eth` ENR Filtering, Fork-ID Reality Alignment & 4-Stage Surgical Probe** | Root-cause forensics on the `WP-03` screenshot revealed: (1) `ENR.parseAndVerifyRecord` (`dns/enr.ts`) never set `id: pk2id(obj.secp256k1)`, forcing DNS peers through UDP `DPT.addPeer()` where 90% were banned by `k-bucket full` (filled by unsolicited UDP pings from Polygon/BSC nodes); (2) neither `enr.ts` nor the discovery v4 ENR handler parsed EIP-868 `eth` (`[[forkHash, nextFork]]`) to filter alien chains before TCP dial; (3) adding `timestamp: '1791294816'` (Oct 6, 2026) to Sepolia `amsterdam` in `chains.ts` caused our Oct 2026 environment clock to advertise `0x6c1d9423` while live Sepolia `Geth/v1.17.0` nodes advertise `bpo2` (`0x268956b6`). Rather than switching to discovery v5 (which is mainly CL/libp2p), `WP-03b` fixes these 3 EL root causes and adds a deterministic 4-stage `p2p:probe` CLI so agents can test DNS ENRs, 1-peer `STATUS`, and 1-peer `snap/1` in 3 seconds. |
| **D-045** | 2026-10-29 | **Pinned `forkHash` before unscheduled-fork throw (`WP-03b`)** | `Common.forkHash()` returns explicit `forkHash` on chain rows with `block: null` and no `timestamp` (e.g. Mainnet Amsterdam). Sepolia `amsterdam` documents `1791294816` per [EIP-7773](https://eips.ethereum.org/EIPS/eip-7773). |
| **D-046** | 2026-10-29 | **DNS directory `peer:new` fast path + gated inbound ping (`WP-03b`)** | Verified DNS ENRs with `{ id, address, tcpPort }` skip UDP `addPeer` and emit `peer:new` for RLPx. Inbound ping auto-bonding disabled when `DPTServer` has `common` (Ethy); legacy tests without `common` keep prior ping behavior. |
| **D-047** | 2026-10-29 | **`p2p:probe` CLI outside CI (`WP-03b`)** | `npm run p2p:probe` in `@ethereumjs/devp2p` for live 4-stage funnel diagnostics; vitest covers parsers and dial split only. |
| **D-048** | 2026-10-29 | **No Partial `snap/1` Serving; Full Rolling-Window `eth/69–71` Server & Honest `earliestBlock` (`WP-03c`)** | Serving partial `snap/1` without a 128-root MPT node database violates `snap/1` expectations (peers penalize empty `GetAccountRange` / `GetTrieNodes` replies). Conversely, `eth/69–71` (EIP-7642, EIP-7975, EIP-8159) explicitly supports rolling-window serving via `STATUS` / `BLOCK_RANGE_UPDATE` (`[earliestBlock, latestBlock, latestBlockHash]`), provided the node holds 100% of the encompassed `eth` data (`BlockHeaders`, `BlockBodies`, `Receipts`, and `BlockAccessLists`) for every block in `[earliestBlock .. latestBlock]`. Fixing our false `earliestBlock = 0` advertisement and adding `RollingBlockStore` + `ethServer` in `@ethereumjs/devp2p` both stops peers from disconnecting us during `snap/1` sync and makes Ethy a true serving citizen with a live `Served` metric in `P2P Metrics`. |

---

## 4. Upstream Library Touch Queue (`@ethereumjs/*` outside `ethy`)

Track every modification or planned modification to sibling monorepo packages here so they can be reviewed and committed cleanly in separate commits/PRs.

| Package | File(s) | Kind | Status | Description & Reasoning |
| --- | --- | --- | --- | --- |
| `@ethereumjs/devp2p` | `packages/devp2p/src/rlpx/peer.ts`, `socketByteQueue.ts`, `src/dpt/dpt.ts`, `src/rlpx/rlpx.ts`, `src/lab/emptyReply.ts`, `src/worker/*`, tests under `test/rlpx/`, `test/dpt/`, `test/worker/`, `test/protocol/` | Performance & Worker Architecture (WP-00) | `DONE` (#4417) | Merged in #4417: threaded network API, `SocketByteQueue`, discovery throttle, `inProcess` + real `Worker` tests + README § Threaded network. |
| `@ethereumjs/devp2p` | `packages/devp2p/src/protocol/eth.ts`, `src/worker/host.ts`, `protocol.ts`, `bootNodes.ts`, `src/discovery/metrics.ts`, `src/dpt/*`, `src/dns/*` | Enhancement & Discovery Health (WP-02 & WP-02b) | `DONE` (#4419) | `ETH.peerStatusHead()`, `WorkerPeerSnapshot` head fields, `bootNodesFromCommon`, `DiscoveryMetrics` + `WorkerDiscoverySnapshot`, OS DNS resolver default, bound endpoint sync. |
| `@ethereumjs/devp2p` | `packages/devp2p/src/lab/messages/eth.ts`, `src/lab/messages/snap.ts`, `src/protocol/eth.ts`, `src/protocol/eth/codec.ts`, `src/rlpx/peer.ts`, `src/discovery/metrics.ts`, `src/worker/host.ts` | Bugfix: RLP Canonical Zero & `snap/1` Builder (WP-03) | `DONE` (#4420) | Canonical unpadded scalars; 5-tuple `GET_ACCOUNT_RANGE`; `forkValidationHead` + `lastSubprotocolError` telemetry. |
| `@ethereumjs/statemanager`, `@ethereumjs/evm`, `@ethereumjs/vm` | `packages/statemanager/src/flatStateManager.ts`, matrices + `evm`/`vm` specs | New Feature: `FlatStateManager` (WP-03) | `DONE` (#4420) | Hash-keyed snap ingestion, delta checkpoints, `shallowCopy`, cross-stack tests. |
| `@ethereumjs/common` | `packages/common/src/chains.ts` | Maintenance (WP-02) | `DONE` (audit only) | Sepolia/Hoodi fork timestamps + Hoodi bootnodes match geth chain specs; DNS discovery URLs match. Sepolia static bootnodes stale vs geth ENR list — DNS discovery sufficient; ENR refresh deferred. |
| `@ethereumjs/common`, `@ethereumjs/devp2p`, `@ethereumjs/ethy` | `packages/common/src/chains.ts`, `packages/devp2p/src/rlpx/rlpx.ts`, `src/discovery/directoryPeer.ts`, `src/protocol/eth.ts`, `packages/ethy/src/net/peerCoordinator.ts`, `genesisStatus.ts`, `discoverySummary.ts` | Sepolia handshake follow-up (WP-03 close) | `DONE` (#4420) | Amsterdam fork id and Sepolia/Hoodi/Holesky genesis hashes. Directory peers dial first. eth/69–72 only. Empty eth/70 receipt replies include the complete-range flag. STATUS timeout is logged with the client name. |
| `@ethereumjs/devp2p`, `@ethereumjs/common` | `packages/devp2p/src/dns/enr.ts`, `enrPeerFields.ts`, `src/dpt/dpt.ts`, `src/dpt/server.ts`, `src/cli/probe.ts`, `src/discovery/metrics.ts`, `packages/common/src/chains.ts`, `common.ts` | P2P Master Plan: ENR `id` + EIP-868 `eth` Filter, Direct DNS-to-RLPx & Surgical Probe (WP-03b) | `DONE` (#4421) | ENR fields + DNS `peer:new`; fork filter on discovery v4 ENR; Sepolia Amsterdam EIP-7773 timestamp; `p2p:probe` script. |
| `@ethereumjs/devp2p` | `packages/devp2p/src/serve/rollingBlockStore.ts`, `src/serve/ethServer.ts`, `src/lab/messages/eth.ts`, `src/worker/host.ts`, `src/worker/client.ts`, `src/worker/protocol.ts` | Rolling-Window `eth/69–71` Server, Honest `earliestBlock` & Serving Metrics (Target: WP-03c) | `IDENTIFIED` | Fix `earliestBlock` default in `ethStatusFromFields` (never `0` when `latestBlock > 0`); add `RollingBlockStore` + `ethServer` (`Headers`, `Bodies`, `Receipts` `eth/69–70`, `BALs` `eth/71`), `putServableBlock`, and `WorkerServingSnapshot`. |

---

## 5. Chronological Progress Log

*Agents: Append a new dated subsection at the top of this list after each Planning (Grok 4.7) or Implementation (Composer 2.5) pass.*

### 2026-10-29 — `WP-03c` Conceptualized: Honest `earliestBlock` & Full Rolling-Window `eth/69–71` Server (Coordinator — Gemini 4 Argon)
- Verified `WP-03b` live Sepolia breakthrough (#4421): >3.48M accounts synced at ~6,000 acc/sec with `SnapPivotStore` + `PeerBookStore`.
- Audited `snap/1` vs. `eth/69–71` (EIP-7642, EIP-7975, EIP-8159) serving rules (Decision **D-048**):
  1. Confirmed `snap/1` must remain client-only on a flat-state node (partial `snap/1` serving without a 128-root MPT node database causes requesting peers to fail tasks and penalize us).
  2. Found that `ethStatusFromFields` (`messages/eth.ts:27`) and `peerCoordinator.ts:227` were advertising `earliestBlock = 0 .. 12,020,039`, falsely claiming full archive history from Genesis and causing peers to drop us (`snap peer left`) when historical `GetBlockHeaders`/`GetBlockBodies`/`GetReceipts` returned `[]`.
- Created [`work-packages/WP-03c-honest-range-and-eth-rolling-server.md`](./work-packages/WP-03c-honest-range-and-eth-rolling-server.md) (`READY_FOR_PLANNING`) to fix `earliestBlock`, build `RollingBlockStore` + `ethServer` (`Headers`, `Bodies`, `Receipts` `eth/69–70`, `BALs` `eth/71`) inside `@ethereumjs/devp2p`, and expose the `Served` metric in the `● P2P Metrics` cockpit box.

### 2026-10-29 — WP-03b implementation (`DONE` offline) (Implementer — Composer 2.5)
- Landed ENR `id` + EIP-868 `ethForkId` (`enrPeerFields.ts`), DNS `_feedDnsDirectoryPeers` → `peer:new`, discovery v4 ENR fork ban, gated inbound ping when `common` is set, `forkHash()` pin order in `common`, `npm run p2p:probe`, vitest for ENR/DPT/metrics. `common` + `devp2p` tsc/tests green.
- WP-03b matrix **`PLANNED` → `DONE` (offline)**; WP-04/WP-05 **`READY_FOR_PLANNING`**. Live Sepolia probe + ethy snap soak checklist open in WP-03b §3.

### 2026-10-29 — `WP-03b` P2P Master Plan: Forensics on `WP-03` Live Soak & Surgical Probe Strategy (Coordinator — Gemini 4 Argon)
- Analyzed the `WP-03` live diagnostic screenshot (`DNS: 3684/307`, `Ban: new 22350`, `Cause: k-bucket full`, `Fork: amsterdam 0x6c1d9423`, alien chains `bor`/`reth-bsc`) and identified the 3 exact root causes (Decision **D-044**):
  1. `ENR.parseAndVerifyRecord` in `packages/devp2p/src/dns/enr.ts` never extracted `id: pk2id(obj.secp256k1)` from the verified 33-byte public key, forcing DNS peers through UDP `DPT.addPeer()` where they got banned by a k-bucket already filled by unsolicited UDP pings.
  2. Missing EIP-868 (`eth` ENR entry `[[forkHash, nextFork]]`) filtering in `enr.ts` and the discovery v4 ENR handler.
  3. Simulated local clock (Oct 2026) + `chains.ts` `amsterdam` `timestamp: '1791294816'` caused Ethy to advertise `0x6c1d9423` while real public Sepolia `Geth/v1.17.0` peers are on `bpo2` (`0x268956b6`).
- Evaluated discovery v4 vs. discovery v5: confirmed EL clients (Geth/Reth) rely on EIP-1459 DNS ENR trees + discovery v4 with EIP-868 `eth` forkId filtering, so fixing `enr.ts` + direct DNS-to-RLPx + EIP-868 filtering solves the multi-chain pool problem immediately with zero new dependencies.
- Created [`work-packages/WP-03b-p2p-probe-and-enr-pipeline.md`](./work-packages/WP-03b-p2p-probe-and-enr-pipeline.md) (`READY_FOR_PLANNING`) including the 4-stage surgical `p2p:probe` CLI (`dns-enr` → `single-status` → `single-snap` → `funnel-soak`).

### 2026-10-29 — WP-03 close (Implementer — Grok 4.7)
- Closed WP-03 on `ethy-wp03` ([#4420](https://github.com/ethereumjs/ethereumjs-monorepo/pull/4420)). Library and offline snap work from 2026-10-28 stays `DONE`.
- Sepolia follow-up on the same branch: Amsterdam fork id `0x6c1d9423` (next 0), corrected genesis hashes, numeric network-id compare, discovery footer, directory-first dial (bootnodes and DNS ahead of discovery v4), eth/69–72 only, eth/70 receipt reply shape, no empty snap proofs, a later decode error keeps the session, STATUS timeout logged with the client name.
- Live soak did not reach snap. Cockpit peer count is post-HELLO. Footer `status` stayed 0. Peers that sit for about 5–8 seconds are inside the 5 second STATUS timer, then we disconnect `TIMEOUT`. `GET_ACCOUNT_RANGE` runs only after a pivot header from a validated head, so snap stayed at 0 accounts. Decision **D-043**.
- WP-04 remains `READY_FOR_PLANNING`. Sustained live STATUS is not a WP-03 exit criterion anymore.

### 2026-10-28 — WP-03 implementation (`DONE`) (Implementer — Composer 2.5)
- Landed four-slice WP-03 on `ethy-wp03`: devp2p canonical zeros + fork head + snap wire shape; `FlatStateManager` in `@ethereumjs/statemanager`; evm/vm flat-manager specs; ethy snap sync, synthetic peer, pivot `{ blockNumber, timestamp }`, microscope tools (`/range`, `/sample`, pause/resume).
- Fixed offline snap proof verification (default MPT range verifier with `useKeyHashing: false` trie); `accountSync.spec.ts` advances range origin when `hasRight`.
- WP-03 matrix **`PLANNED` → `DONE`**; upstream touch-queue WP-03 rows **`PLANNED` → `DONE`**; WP-05 unblocked (`READY_FOR_PLANNING`).

### 2026-10-28 — WP-03 concrete implementation plan (`PLANNED`) (Planner — Grok 4.7)
- Filled [`work-packages/WP-03-snap-account-sync-and-microscope.md`](./work-packages/WP-03-snap-account-sync-and-microscope.md) §2: four-slice implementer plan (devp2p, statemanager, evm/vm, ethy), file tree, and gates.
- Recorded planning refinements **D-036** through **D-042** (fork-check head, flat overlay, snap proof boundary, scheduler, node state ownership, pause/slash, ethy tsc).
- Upstream touch queue WP-03 rows **`IDENTIFIED` → `PLANNED`**. WP-03 matrix status **`PLANNED`**.

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
