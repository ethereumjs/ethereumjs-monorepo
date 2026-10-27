# Ethy (`@ethereumjs/ethy`) — Progress, Decisions & Change Ledger

This file is the **single source of truth** for project progress, architectural decisions, upstream `@ethereumjs/*` library touches, and implementation handoffs between the **Coordinator** (Gemini 4 Argon), **Planner** (Grok 4.7), and **Implementer** (Composer 2.5).

> **Rule for all agents:** Whenever you finish planning a Work Package (Planner) or implementing a Work Package (Implementer), you **must** update this file before finishing your turn.

---

## 1. Current Project Snapshot

- **Current Stage:** Architecture, Rules & Work-Package Blueprint Complete — Ready for **WP-00** (`@ethereumjs/devp2p` Worker-Thread & Hardening) and **WP-01** (`@ethereumjs/ethy` Foundation) Planning & Implementation.
- **Active Target Network:** `sepolia` (Amsterdam hardfork focus; generic `@ethereumjs/common` chain support).
- **Package Identity:** `@ethereumjs/ethy` (CLI binary: `ethy`, zero-config invocation `ethy` or `ethy sepolia`; unscoped `ethy` npm name transfer inquired).

---

## 2. Work Package Status Matrix

| ID | Work Package | Status | Dependencies | Spec File | Notes |
| --- | --- | --- | --- | --- | --- |
| **WP-00** | **`@ethereumjs/devp2p` Worker-Thread Architecture, Discovery Flow Control & Buffer Hardening** | `READY_FOR_PLANNING` | None | [`work-packages/WP-00-devp2p-worker-and-hardening.md`](./work-packages/WP-00-devp2p-worker-and-hardening.md) | Dedicated `worker_threads` runtime (`createThreadedNetwork`), zero-copy `ArrayBuffer` transfers, `DPT` saturation throttling, and `Peer._onSocketData` O(N²) buffer fix in `@ethereumjs/devp2p`. |
| **WP-01** | **Foundation: Scaffolding, `EthySpine`, 4-Zone TUI & Deterministic Prompt Loop** | `READY_FOR_PLANNING` | None (can follow or run alongside WP-00) | [`work-packages/WP-01-foundation-spine-and-tui-loop.md`](./work-packages/WP-01-foundation-spine-and-tui-loop.md) | Zero external deps; runnable `ethy sepolia` TUI + synthetic simulation mode + Day-1 slash/keyword tools + unit test suite. |
| **WP-02** | **Live P2P Harness, Sepolia Config & Fresh Pivot Header Acquisition** | `BLOCKED_BY_WP-00_WP-01` | WP-00, WP-01 | [`work-packages/WP-02-live-p2p-and-fresh-pivot.md`](./work-packages/WP-02-live-p2p-and-fresh-pivot.md) | Connects `createThreadedNetwork` from `@ethereumjs/devp2p` to `EthySpine`, updates Sepolia Amsterdam config, acquires live pivot `stateRoot` from best `eth` peer, implements Good Citizen empty replies. |
| **WP-03** | **16-Bucket `snap/1` Account Sync, Range Proofs & Developer Microscope** | `BLOCKED_BY_WP-02` | WP-01, WP-02 | [`work-packages/WP-03-snap-account-sync-and-microscope.md`](./work-packages/WP-03-snap-account-sync-and-microscope.md) | `InMemoryFlatStore`, `SyntheticSnapPeer` for CI, 16-bucket `GET_ACCOUNT_RANGE` + slim-to-full RLP conversion + `verifyMerkleRangeProof`, live `/buckets` & `/drop` dev actions. |
| **WP-04** | **Bidirectional Local LLM `IntentEngine` (`<ethy_state>` & Tool Gating)** | `BLOCKED_BY_WP-01` | WP-01 (can run in parallel with WP-02/03) | [`work-packages/WP-04-local-llm-intent-engine.md`](./work-packages/WP-04-local-llm-intent-engine.md) | Zero-dep local HTTP JSON-schema LLM engine (`llama-server` 1.7B instruct), `<ethy_state>` header injection, dynamic phase tool gating, `--record-fixture` CI replay. |
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

---

## 4. Upstream Library Touch Queue (`@ethereumjs/*` outside `ethy`)

Track every modification or planned modification to sibling monorepo packages here so they can be reviewed and committed cleanly in separate commits/PRs.

| Package | File(s) | Kind | Status | Description & Reasoning |
| --- | --- | --- | --- | --- |
| `@ethereumjs/devp2p` | `packages/devp2p/src/rlpx/peer.ts`, `src/dpt/dpt.ts`, `src/worker/*` | Performance & Worker Architecture (Target: WP-00) | `IDENTIFIED` | Eliminate O(N²) `concatBytes` in `Peer._onSocketData`, add `DPT` discovery throttling when `RLPx` peer slots are saturated, and export a first-class `worker_threads` runtime (`createThreadedNetwork` / `Devp2pWorkerClient`). |
| `@ethereumjs/common` | `packages/common/src/chains.ts` | Maintenance (Target: WP-02) | `IDENTIFIED` | Verify and update `Sepolia` (and `Hoodi` if applicable) Amsterdam hardfork timestamp / `forkHash` and current working bootstrap/DNS nodes so `devp2p` `forkId` handshakes match live Amsterdam peers. |

---

## 5. Chronological Progress Log

*Agents: Append a new dated subsection at the top of this list after each Planning (Grok 4.7) or Implementation (Composer 2.5) pass.*

### 2026-10-27 — Added `WP-00` (`@ethereumjs/devp2p` Worker-Thread & Hardening) & Ecosystem Hardening Rule (Coordinator — Gemini 4 Argon)
- Conducted feasibility and hot-path analysis of `@ethereumjs/devp2p` (`DPT` UDP `secp256k1` storms, `Peer._onSocketData` O(N²) `concatBytes` reallocations, and `Peer._handleBody` Snappy flow).
- Added **`WP-00-devp2p-worker-and-hardening.md`** as the dedicated first work package (`WP-00`) to introduce a general-purpose `worker_threads` runtime (`createThreadedNetwork`), `DPT` discovery throttling, and `Peer` buffer optimization directly in `@ethereumjs/devp2p`.
- Elevated **hardening and improving the general `@ethereumjs/*` library stack** (with backwards-compatibility and atomic commit isolation) as a primary principle in `.cursor/rules/ethy-workflow.mdc`, `.cursor/rules/ethy-architecture.mdc`, `AGENTS.md`, and `ARCHITECTURE.md`.

### 2026-10-26 — Initial Architecture, Multi-Agent Rules & Work-Package Suite (Coordinator — Gemini 4 Argon)
- Retired the bilingual brainstorming transcript and consolidated all architectural, product, and EthereumJS codebase findings into English documentation (`AGENTS.md`, `ARCHITECTURE.md`, `PROGRESS.md`).
- Created glob-scoped Cursor rules `.cursor/rules/ethy-workflow.mdc` and `.cursor/rules/ethy-architecture.mdc` (`globs: packages/ethy/**`).
- Designed 6 holistic vertical Work Packages (`work-packages/WP-01` through `WP-06`) so every step produces a runnable, live-testable, and CI-verified slice of Ethy.
