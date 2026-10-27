# WP-01: Foundation — Package Scaffolding, `EthySpine`, 4-Zone TUI & Deterministic Prompt Loop

- **Status:** `READY_FOR_PLANNING`
- **Dependencies:** None (First vertical slice)
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Holistic Scope & Architectural Requirements

### Goal
Bootstrap `@ethereumjs/ethy` as a first-class monorepo package (`bin/ethy.cjs` → `ethy [network]`) with **zero new external dependencies**, establishing the core 4-layer spine (`EthySpine`), the pure 4-zone Zero-Log TUI renderer (`renderFrame`), the `IntentEngine` abstraction with Day-1 deterministic slash/keyword tools, ghost-text `[Tab]` completion, the onboarding prompt carousel, and a synthetic simulation ticker (`--demo` or automatic when offline) so the entire TUI + prompt loop can be experienced immediately and verified in unit tests in `<2 seconds`.

### Why This Slice Comes First
Before opening real P2P sockets (`WP-02`) or debugging `snap/1` range proofs (`WP-03`), we want the **interactive X-ray microscope** already running. By building `EthySpine` + the 4-Zone TUI + the deterministic `IntentEngine` + virtual framebuffer tests first, every subsequent networking and sync feature automatically renders in the cockpit and is queryable from the prompt on Day 1.

### Key Deliverables

1. **Monorepo Package Scaffolding (`packages/ethy/`):**
   - `package.json`: `"name": "@ethereumjs/ethy"`, `"version": "10.1.3"` (matching workspace), `"bin": { "ethy": "bin/ethy.cjs" }`, dual ESM/CJS exports with `"typescript": "./src/index.ts"`, standard workspace scripts (`build`, `tsc`, `test`, `lint`, `spellcheck`).
   - Workspace dependencies only: `@ethereumjs/common`, `@ethereumjs/rlp`, `@ethereumjs/util`, `@ethereumjs/devp2p`, `@ethereumjs/mpt`, `@ethereumjs/statemanager`, `@ethereumjs/block`, `@ethereumjs/tx`, `@ethereumjs/evm`, `@ethereumjs/vm`, plus standard root-aligned `@noble/hashes` / `eventemitter3` if needed. **Zero new third-party dependencies.**
   - `tsconfig.json`, `tsconfig.prod.esm.json`, `tsconfig.prod.cjs.json`, `eslint.config.mjs`, `bin/ethy.cjs`, `README.md`.

2. **CLI Entrypoint & Chain Resolution (`src/cli/`):**
   - Zero-config invocation: `ethy` (defaults to `sepolia`) or `ethy <network>` (`sepolia`, `mainnet`, `hoodi`, `holesky` resolved via `@ethereumjs/common`).
   - Optional flags: `--demo` (drives `EthySpine` with a realistic synthetic progression from `P2P_WARMUP` → `SNAP_SYNCING` → `HEAD_FOLLOWING` including a simulated stalled bucket `0x3` so the UI and tools can be tested offline), `--headless` (starts `EthyCore` without TUI).

3. **`EthySpine` & `EthyCore` (`src/spine/`, `src/core/`):**
   - Full TypeScript definitions and in-memory store for `EthySpine`:
     - `network`, `chainId`, `phase` (`BOOTING` | `P2P_WARMUP` | `SNAP_SYNCING` | `HEAD_FOLLOWING`), `currentSlot`, `pivotBlockNumber`, `pivotStateRoot`, `headBlockNumber`, `headStateRoot`.
     - `capabilities` (`p2p`, `snap`, `head`, `ai` with `locked` | `partial` | `ready` status and concise label).
     - `peers: Map<string, PeerTelemetry>` and `snapBuckets: SnapBucket[]` (16 hex buckets `0x0`..`0xf` with `pending` | `syncing` | `verifying_proof` | `done` | `stalled`).
     - `diagnosticRingBuffer: DiagnosticEvent[]` (bounded ring buffer, default capacity 100, helper `recordDiagnostic(...)`).
   - `createEthyNode(opts)` factory that initializes `EthySpine` and the tool registry without touching `process.stdout`.

4. **Pure 4-Zone Zero-Log TUI (`src/tui/`):**
   - Reuse/adapt the clean zero-dep ANSI patterns from `packages/devp2p/src/tui/ansi.ts` (`stripAnsi`, `visibleWidth`, `padVisible`, `truncateVisible`, synchronized output `\x1b[?2026h...\x1b[?2026l`, alternate screen `\x1b[?1049h...\x1b[?1049l`).
   - Pure layout function `renderFrame(spine: EthySpine, view: TuiViewState, cols: number, rows: number): string[]`:
     - **Zone 1 (Hero Metrics):** Network + Slot, 16-segment Snap Sync bar (`0x0 [████▓▓!░░░░░░░░░] 0xf` where `!` highlights a stalled bucket), total synced accounts & throughput (`acc/sec`).
     - **Zone 2 (Dynamic Workspace):** Renders declarative `WidgetSpec` payloads:
       - `onboarding_carousel`: Rotating 3-line inspiration cards grouped by `● P2P`, `◐ SNAP`, `● HEAD`.
       - `table`: Auto-sized/truncated ASCII/Unicode box table with headers, rows, and assistant comment underneath.
       - `key_value`: Clean key-value inspector card with assistant comment.
     - **Zone 3 (Capability Bar):** `● P2P [...]  ◐ SNAP [...]  ○ HEAD [...]  ● AI [...]` using colored/dimmed traffic-light dots.
     - **Zone 4 (Sticky Prompt):** Non-blocking input line `ethy > ` with phase-aware dimmed ghost-text suggestion (`[Tab]` copies suggestion into input draft; `Up/Down` history; `Ctrl+C` / `Esc` clean exit).

5. **`IntentEngine` Interface, `<ethy_state>` Formatter & Day-1 Tools (`src/ai/`, `src/tools/`):**
   - `formatEthyStateHeader(spine, lastQuerySlot)`: Generates the `<ethy_state ...>` telemetry block including `slot_delta`.
   - `IntentEngine` interface + `DeterministicIntentEngine` supporting both slash commands and natural-language keyword matching:
     - `/peers` or *"peers" / "clients" / "latency"* → runs `diagnoseSnapAndPeers` (peer table).
     - `/buckets` or `/snap` or *"bucket" / "stalled" / "why"* → runs `diagnoseSnapAndPeers` (16-bucket table + stalled bucket root cause from `diagnosticRingBuffer`).
     - `/diag` or *"errors" / "anomalies" / "logs"* → renders latest `diagnosticRingBuffer` entries as a table.
     - `/drop <peerId>` or `/reassign <bucket>` → runs `triggerDevAction`.
     - `/help` → shows available commands for the current capability stage.
   - Dynamic tool gating: verify that calling a `HEAD_FOLLOWING`-only tool while `head.status === 'locked'` returns a clean capability-locked `WidgetSpec` explanation instead of throwing an unhandled error.

6. **Tier-1 Unit Test Suite (`test/`):**
   - `test/spine.spec.ts`: Bucket initialization (`0x0..0xf`), ring-buffer bounding, `<ethy_state>` header generation (`slot_delta` calculation).
   - `test/tui.spec.ts`: Virtual framebuffer tests (`renderFrame` at `100x30` and `80x24`), asserting every line `visibleWidth(line) <= cols`, traffic-light pills, stalled bucket indicator `!`, and `table` / `key_value` / `onboarding_carousel` rendering.
   - `test/intent.spec.ts`: `DeterministicIntentEngine` routing, capability gating on locked tools, and `triggerDevAction` mutating `EthySpine`.

### Acceptance Criteria
- [ ] `cd packages/ethy && npm run tsc` passes with 0 errors.
- [ ] `cd packages/ethy && npm test` passes in `<3s` with 0 network/LLM dependencies.
- [ ] `npm run spellcheck` passes across all new files.
- [ ] Running `npx tsx packages/ethy/src/cli/main.ts sepolia --demo` opens the flicker-free 4-zone TUI, animates synthetic P2P/Snap telemetry, supports `[Tab]` ghost-text completion, and renders tables in Zone 2 when queried.

---

## 2. Concrete Implementation Plan (Planner — Grok 4.7)

*(To be filled out by Grok 4.7 during the Planning pass. Include exact file tree, module responsibilities, interface signatures, and test breakdown.)*

---

## 3. Implementation Notes & Deviations (Implementer — Composer 2.5)

*(To be filled out by Composer 2.5 after implementation and verification. Also append summary to `packages/ethy/PROGRESS.md`.)*
