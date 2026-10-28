# WP-02: 3-Box Domain-Lens Cockpit, Live Threaded `devp2p` Harness & Fresh Pivot Header Acquisition

- **Status:** `READY_FOR_PLANNING`
- **Dependencies:** `WP-00` (`DONE`), `WP-01` (`DONE`)
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Holistic Scope & Architectural Requirements

### Goal
Deliver the **3-Box Domain-Lens Cockpit UI** (`ethy-tui.mdc`) together with **live Worker-Threaded P2P networking (`createThreadedNetwork`) and fresh pivot block header acquisition (`stateRoot` + `blockNumber`)** on Sepolia (`ethy sepolia`).

When `WP-02` is done, launching `ethy sepolia` (or `ethy sepolia --demo`) shows the ultra-minimal header, the 3 fine-line rounded boxes (`Node Pulse` | `<Mark> <Domain> Commands` | `<Mark> <Domain> Metrics [Enter]`), the broad Main Interaction Area, and the `● ethy >` domain-lens prompt — while in live mode the `@ethereumjs/devp2p` worker thread discovers Sepolia peers, populates live P2P metrics, and locks onto a fresh pivot `stateRoot` within the 128-block `snap/1` availability window.

---

### Key Deliverables

#### Part A — The 3-Box Domain-Lens Cockpit & 1-Key Ergonomics (`src/tui/`, `src/spine/types.ts`)

Follow all layout and interaction invariants in [`packages/ethy/.cursor/rules/ethy-tui.mdc`](../.cursor/rules/ethy-tui.mdc):

1. **Active Domain Lens State (`TuiViewState.activeDomain`):**
   - Add `activeDomain: CapabilityId` (`'p2p' | 'snap' | 'head' | 'ai'`, defaulting to `'p2p'`) to `TuiViewState` in `src/spine/types.ts`.
   - Remove the bottom dotted `onboarding_carousel` band between two horizontal rules; replace that guidance mechanism with the **3-Box Cockpit Row** directly below the top header rule.

2. **Band 2 — The 3-Box Cockpit Row (Rounded Fine-Line Boxes `╭─╮ │ ╰─╯`):**
   - Render three side-by-side rounded boxes across `page.contentWidth` using stable column weights (`widthsFromWeights(cols, [1, 1, 1], 2)`), fixed height of **6 rows** (top border with title + 4 inner lines + bottom border), with dimmed borders (`DIM`) and crisp inner values:
     - **Left Box (`╭─ Node Pulse ───...─╮`):** Always-anchored node overview regardless of `activeDomain`:
       1. `Phase` (`Booting` / `P2P Warmup` / `Snap Syncing` / `Head Following`)
       2. `Pivot` (`#<pivotBlockNumber>` or `Waiting for peer...`)
       3. `Buckets` (16-char mini bar `████▓▓!░░░░░░░░░` + done/16 count)
       4. `Accounts` (`<totalAccountsSynced>` + `~<accountsPerSec>/s`)
     - **Middle Box (`╭─ <Mark> <DOMAIN> Commands ───...─╮`):** Lists 4 concise commands / prompts for `view.activeDomain` (`p2p`: `/peers`, `/diag`, `/drop <id>`, `/help`; `snap`: `/buckets`, `/snap`, `/reassign <hex>`, `/diag`; `head`: `/account <0x..>`, `/bal`, `/simulate`, `/help`; `ai`: example natural-language prompts for the current phase).
     - **Right Box (`╭─ <Mark> <DOMAIN> Metrics ─── [Enter] ╮`):** Shows 4 key live stats for `view.activeDomain`:
       - When `activeDomain === 'p2p'`: `Peers` (`N connected`), `Caps` (`X snap/1 · Y eth/71`), `Latency` (`avg ms`), `Clients` (top 2 client families e.g. `Geth · Reth` or `none`).
       - When `activeDomain === 'snap'`: `Progress` (`%` / buckets done), `Active` (`N syncing · M stalled`), `Pivot Root` (short hex `0x1234…abcd` or `—`), `Speed` (`acc/s`).
       - When `activeDomain === 'head'`: `Status` (`Locked` / `Following`), `Head Block` (`#` or `—`), `State Root` (short hex or `—`), `Pivot` (`#` or `—`).
       - When `activeDomain === 'ai'`: `Engine` (`Slash / Rule Mode`), `Unlocked` (`P2P, SNAP, ...`), `Slot` (`currentSlot`), `Anomalies` (`diagnosticRingBuffer.length` recorded).

3. **Band 4 — Domain-Lens Prompt (`● ethy > `) & Keyboard Ergonomics (`src/tui/prompt.ts`, `renderFrame.ts`):**
   - Prefix the prompt line with the active domain's colored mark: `${capabilityMark(view.activeDomain, domainStatus)} ${BOLD}ethy > ${RESET}` (`PROMPT_PREFIX_WIDTH = 9`: 1 char mark + 1 space + 7 chars `ethy > `). Update `promptCaretPosition` to match (`col: 1 + page.padding.left + 9 + shown`).
   - **1-Key Domain Switch (`Tab`):**
     - When `promptDraft` is empty, pressing `Tab` cycles `view.activeDomain` (`p2p` → `snap` → `head` → `ai` → `p2p`).
     - Cycling `Tab` updates the prompt mark and the Middle + Right rounded boxes immediately, and **never** clears or overwrites `view.activeWidget` in the Main Interaction Area.
   - **Slash Prefix Autocomplete (`Tab` or `Enter` when `promptDraft.startsWith('/')`):**
     - When `promptDraft` is a slash prefix like `/p`, `/b`, `/d`, `/r`, `/a`, `/s`, `/h`, pressing `Tab` completes it to the canonical command (`/peers`, `/buckets`, `/diag`, `/reassign `, `/account `, `/simulate`, `/help`).
     - In `DeterministicIntentEngine`, also accept unambiguous short slash prefixes (`/p` → `/peers`, `/b` → `/buckets`, `/d` → `/diag`) directly on `Enter`!
   - **2-Key Deep Domain View (`Enter` when `promptDraft` is empty):**
     - When `promptDraft.trim().length === 0`, pressing `Enter` triggers the default deep view for `view.activeDomain` (`p2p` → `/peers`, `snap` → `/buckets`, `head` → `/bal`, `ai` → `/help`) and mounts the resulting `WidgetSpec` in the Broad Main Interaction Area (Band 3).

---

#### Part B — Upstream `@ethereumjs/common` & `@ethereumjs/devp2p` Worker Polish

1. **`@ethereumjs/common` (`packages/common/src/chains.ts`):**
   - Audit `Sepolia` (and `Hoodi` if relevant) hardfork schedule and `bootstrapNodes` / `dnsNetworks` so `devp2p` `forkId` handshakes match live peers. Record any change in `PROGRESS.md` (*Upstream Library Touch Queue*) and commit separately from `packages/ethy`.
2. **`@ethereumjs/devp2p` (`packages/devp2p/src/worker/host.ts` & `protocol.ts`):**
   - **Expose peer `STATUS` head info (`bestHash` / `latestBlockHash`, `latestBlock`):** In `Devp2pWorkerHost._wirePeer` (`host.ts:215`), when a peer completes `ETH` `STATUS` (`eth['_peerStatus']`), expose `bestHash` (hex) and `latestBlock` (hex/bigint string) on `WorkerPeerSnapshot` (or emit a `peerStatus` event) so the main thread knows which block hash to request for the pivot header.
   - **Default Bootnodes & DNS Discovery from `Common`:** In `Devp2pWorkerHost._start()`, if `opts.bootnodes` is not explicitly provided and `opts.shouldFindNeighbours !== false`, automatically seed `this._dpt.bootstrap(...)` from `common.bootstrapNodes()` and pass `dnsNetworks: common.dnsNetworks()` / `shouldGetDnsPeers: true` when enabled so live Sepolia discovery works out of the box.

---

#### Part C — Live Threaded P2P Coordinator & Fresh Pivot Header Acquisition (`src/net/`)

1. **`PeerCoordinator` (`src/net/peerCoordinator.ts`):**
   - Adds `@ethereumjs/devp2p`, `@ethereumjs/block`, `@ethereumjs/rlp`, and `@ethereumjs/util` to `packages/ethy/package.json` `dependencies`.
   - Starts `createThreadedNetwork` (in live mode when `--demo` is not set) with `capabilities: ['eth68', 'eth69', 'eth70', 'eth71', 'snap1']` and `goodCitizen: true`.
   - Maps `WorkerTelemetrySnapshot` (`peers`, `diagnostics`) into `EthySpine.peers` and `EthySpine.diagnosticRingBuffer`.
   - Updates `spine.capabilities.p2p.status` (`locked` → `partial` while connecting → `ready` once `>= 1` peer is active).
2. **Fresh Pivot Header Acquisition (Zero-CL Stage 1):**
   - As soon as the first `eth` peer announces its `bestHash` / `latestBlockHash`, sends `GET_BLOCK_HEADERS` (`reqId`, `[bestHash, 1, 0, 0]`) via `workerClient.sendEthMessage`.
   - Decodes the returned `BLOCK_HEADERS` payload using `@ethereumjs/block` (`createBlockHeaderFromValuesArray` / `createBlockHeaderFromRLP`), sets `spine.pivotBlockNumber = header.number`, `spine.pivotStateRoot = header.stateRoot`, and `spine.currentSlot = Number(header.number)`, and logs a `DiagnosticEvent` (`info`: `Pivot anchored at #...`).
   - Provides `refreshPivotHeader()` if the pivot ages past 96 blocks during sync.

---

### Acceptance Criteria
- [ ] `renderFrame` renders the 4 bands (`Minimal Top Header`, `3-Box Cockpit Row` with rounded `╭─╮` borders, `Broad Main Interaction Area`, and `● ethy > ` prompt) with zero horizontal jump across ticks and domain switches (`visibleWidth(line) === cols` for all `rows`).
- [ ] Pressing `Tab` on an empty prompt cycles `activeDomain` (`p2p` → `snap` → `head` → `ai`), updates the `●` prompt dot color and Middle/Right boxes, and preserves any existing `activeWidget` in the Main Area.
- [ ] Pressing `Enter` on an empty prompt mounts the active domain's deep view in the Main Area (`p2p` → peer table, `snap` → bucket table, `head` → BAL/head card, `ai` → help card).
- [ ] `test/net.spec.ts` verifies `PeerCoordinator` + `createThreadedNetwork({ inProcess: true })` performing `STATUS` → `bestHash` discovery → `GET_BLOCK_HEADERS` → setting `spine.pivotBlockNumber` and `spine.pivotStateRoot`.
- [ ] `npm run tsc`, `npm test`, and `npm run spellcheck` pass across both `packages/devp2p` and `packages/ethy`.

---

## 2. Concrete Implementation Plan (Planner — Grok 4.7)

*(To be filled out by Grok 4.7 during the Planning pass.)*

---

## 3. Implementation Notes & Deviations (Implementer — Composer 2.5)

*(To be filled out by Composer 2.5 after implementation and verification.)*
