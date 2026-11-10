# WP-07f: 3-Domain Cockpit Streamline (`State · Economy · P2P`), Full-Height 3-Part `AI` Overview, `Tab` Domain Help & `←`/`→` Interaction View History

- **Status:** `DONE`
- **Dependencies:** `WP-07a`–`WP-07e` (`DONE`)
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Holistic Scope & Architectural Requirements

### Goal
Streamline Ethy's TUI and domain model into a **100% unified 3-Domain Architecture (`State`, `Economy`, `P2P`)** with:
1. **Three Orthogonal Domains (`State`, `Economy`, `P2P`) in Reading Order Everywhere:**
   - Top-right capability bar (`● STATE  ● ECONOMY  ● P2P`), top-row boxes (`╭─ ● State • ─╮`, `╭─ ● Economy ─╮`, `╭─ ● P2P ─╮`), and the 3-section `AI` overview all share the exact same three domains and colors (**Option B palette:** `State` = Yellow, `Economy` = Violet/Magenta, `P2P` = Green).
   - Removes the old `SNAP` / `HEAD` rotating metrics views, removes the `AI` dot from the top-right capability bar, and removes the lower-right `Commands` box.
2. **Full-Height Right `╭─ AI ─╮` Box with 3 Domain-Marked Overviews (`<= 600` Chars Total):**
   - Expands the right `AI` box all the way down to the bottom prompt delimiter rule.
   - Displays up to three distinct, graciously spaced prose blocks — one for **`● State`**, one for **`● Economy`**, and one for **`● P2P`** — each prefixed on the left by its colored domain dot (`●` / `◐` / `○`) with hanging-indented left-aligned text to the right, dynamically allocating a `~600`-character total budget (and omitting any domain where nothing noteworthy is happening).
3. **`Tab` Domain Help (`╭─ ● /help · <Domain> ─╮`) & Non-Jumping Box Focus Indicator (`•`):**
   - Starts on the **`State`** help view at boot (replacing the old onboarding carousel) and removes `"Enter open X view"`.
   - Pressing `Tab` (on an empty prompt) cycles `activeDomain` (`state` → `economy` → `p2p`), moves a zero-jitter focus indicator (`•`) across the top box titles (`State •` → `Economy •` → `P2P •`), and opens a visually structured, multi-section **Domain Help View** in the Interaction View box.
4. **Interaction View History (`←` / `→` Arrow Keys, Capped at 12 Views):**
   - Pressing `Left` (`←`) and `Right` (`→`) (when `promptDraft` is empty) navigates back and forth through the user's Interaction View history (**excluding** `/help` pages, so pressing `Tab` to check domain help never destroys an important AI or command view — pressing `←` from help returns straight to the last view!).
   - **Live Slash Views vs. Historic AI Snapshots:** Slash command entries (`/peers`, `/buckets`, `/economy`, `/contract`, `/bal`, etc.) re-evaluate live against `EthySpine` when revisited, whereas natural-language AI query views (`"Can you give me the most used peers?"`) preserve their exact historic `WidgetSpec` and `viewTitle` snapshot.

---

## 2. Visual & Spatial Architecture

```text
 Ethy v10.1.3 | SEPOLIA                     Slot 11,518,729        ● STATE  ● ECONOMY  ● P2P
───────────────────────────────────────────────────────────────────────────────────────────────
 ╭─ ● State • ───────────────╮  ╭─ ● Economy ───────────────╮  ╭─ ● P2P ──────────────────────╮
 │                           │  │                           │  │                              │
 │ Stage     BAL Catch-Up    │  │ Gas / Base  0.8 Gwei ↑    │  │ Peers     7 connected        │
 │ Target    #12.09M → +5.1k │  │ Activity    140 txs · 11/s│  │ Served    14 replies · 2.1MB │
 │ Progress  ████░░░░░░  38% │  │ State / BAL 94 acc · 186w │  │ Latency   65 ms avg          │
 │ State     1,980 / 5,268   │  │ Hot Contr.  WETH (38w)    │  │ Clients   5 Neth · 2 Geth    │
 │                           │  │                           │  │                              │
 ╰───────────────────────────╯  ╰───────────────────────────╯  ╰──────────────────────────────╯

 ╭─ ● /help · State [← back to Most used peers] ─────────────╮  ╭─ AI ─────────────────────────╮
 │                                                           │  │                              │
 │  State & Sync Inspection                                  │  │  ●  Base state (161.6M acc)  │
 │  ───────────────────────                                  │  │     is complete; catching    │
 │  /buckets         16-bucket progress, cursors & speeds    │  │     up 5,105 BAL blocks at   │
 │  /range [prefix]  Browse synced accounts by hash prefix   │  │     58 blk/s (~1m left).     │
 │  /sample          Top synced accounts ranked by balance   │  │                              │
 │  /account <0x..>  Inspect balance, nonce, code & BAL hits │  │  ●  Sepolia blocks are 65%   │
 │  /bal             Latest block access list diff table     │  │     full (0.8 Gwei ↑).       │
 │  /cl              Beacon light client finality & BLS %    │  │     WETH and 0x3fC9… [DEX    │
 │                                                           │  │     Router] lead BAL writes. │
 │  State Control                                            │  │                              │
 │  ─────────────                                            │  │  ●  7 peers active (5 Neth,  │
 │  /pause · /resume Pause or resume range synchronization   │  │     2 Geth) at 65 ms avg     │
 │  /reassign <0x>   Reassign a stalled bucket               │  │     latency.                 │
 │                                                           │  │                              │
 │  Ask in Plain English                                     │  │                              │
 │  ────────────────────                                     │  │                              │
 │  "Why is bucket 0x3 slower?" · "What changed at head?"    │  │                              │
 │                                                           │  │                              │
 ╰───────────────────────────────────────────────────────────╯  ╰──────────────────────────────╯
───────────────────────────────────────────────────────────────────────────────────────────────
 ● ethy > █
 Tab show domain help · ←/→ view history · Ctrl+D debug page · / command · Esc exit
```

---

## 3. Detailed Design Specifications

### 3.1 The 3-Domain Taxonomy & Option B Color Palette (`src/spine/types.ts` & `src/tui/capabilityMark.ts`)

1. **Domain Identifiers (`CapabilityId`):**
   - Replace `type CapabilityId = 'p2p' | 'snap' | 'head' | 'ai'` with:
     ```ts
     export type CapabilityId = 'state' | 'economy' | 'p2p'
     export const DOMAIN_ORDER: readonly CapabilityId[] = ['state', 'economy', 'p2p']
     ```
2. **Option B Color Attribution (`CAPABILITY_FG` in `src/tui/capabilityMark.ts`):**
   - **`state`:** `FG.yellow` (`\x1b[33m`) — warm gold/yellow for state sync, BAL catch-up, and head state.
   - **`economy`:** `FG.magenta` (`\x1b[35m`) — violet/purple (freed from AI) for gas market, ETH volume, and contract intelligence.
   - **`p2p`:** `FG.green` (`\x1b[32m`) — emerald green for peer swarm, discovery, and serving health.
3. **Readiness Derivation (`deriveCapabilities(spine)` in `src/spine/createSpine.ts`):**
   - **`state`:**
     - `'locked'` (`○`): `BOOTING` or `P2P_WARMUP` with `0` synced accounts and no pivot.
     - `'partial'` (`◐`): `SNAP_SYNCING` (accounts, bytecode, storage, ETHY/0, or `bridge-pivot`) or `BAL_CATCHUP`.
     - `'ready'` (`●`): `HEAD_FOLLOWING` (technically at the head with full verified state!).
   - **`economy`:**
     - `'locked'` (`○`): `spine.economy?.hasBlocks !== true`.
     - `'partial'` (`◐`): `hasBlocks === true`, but `hasTxBody !== true` or `< 4` blocks observed so far.
     - `'ready'` (`●`): `hasBlocks === true && hasTxBody === true` with live block/BAL telemetry.
   - **`p2p`:**
     - `'locked'` (`○`): `spine.peers.size === 0`.
     - `'partial'` (`◐`): `spine.peers.size === 1`.
     - `'ready'` (`●`): `spine.peers.size >= 2`.
4. **Top-Right Capability Bar (`renderCapabilityBar` in `src/tui/renderFrame.ts`):**
   - Renders the 3 pills in exact left-to-right box reading order:
     `● STATE   ● ECONOMY   ● P2P`
   - `AI` is no longer a capability pill on the top right.

---

### 3.2 Static Top Row Boxes & Zero-Jitter Active Domain Indicator (`src/tui/cockpit.ts`)

1. **Three Permanent Top Boxes (Never Swapped on `Tab`):**
   - **Left (`w0`):** `State` (formerly `Node Pulse`) — displays `Stage`, `Target`, `Progress`, `State`.
   - **Middle (`w1`):** `Economy` — displays `Gas / Base`, `Activity`, `State / BAL`, `Hot Contr.`.
   - **Right (`w2`):** `P2P` (formerly `<Domain> Metrics`, now simply `P2P`) — permanently displays `Peers`, `Served`, `Latency`, `Clients`.
   - The old `SNAP Metrics`, `HEAD Metrics`, and `AI Metrics` switch branches in `cockpit.ts` are removed.
2. **Colored Dots + Non-Jumping Focus Indicator (`•`) on Top Box Titles:**
   - Each top box title starts with its colored readiness mark (`capabilityMark(id, status)`):
     - `● State`, `● Economy`, `● P2P`
   - When `view.activeDomain === id`, a subtle colored indicator (` •` in `CAPABILITY_FG[id]`) appears right after the title:
     - Active: `╭─ ● Economy • ──────────────╮`
     - Inactive: `╭─ ● Economy ────────────────╮`
   - Because `boxTop(boxW, title)` fills the remaining width up to `boxW - 1` with `─` dashes (`dashes = Math.max(1, boxW - visibleWidth(prefix) - 1)`), adding ` •` replaces exactly two `─` border dashes — **zero width change, zero text shifting, and zero layout jumping** when pressing `Tab`!

---

### 3.3 Full-Height `╭─ AI ─╮` Box with 3 Domain-Marked Overviews (`src/tui/lowerArea.ts`, `src/ai/overviewNarrator.ts`, `src/ai/pulseNarrator.ts`)

1. **Full Vertical Height (`fillRows`):**
   - Remove the lower-right `<Domain> Commands` box completely.
   - The right 1/3 column is now a single full-height box (`fillRows` rows tall, matching the left `Interaction View` box top-to-bottom) titled simply **`╭─ AI ───...─╮`** (bold `AI`, no purple dot).
2. **Structured 3-Domain AI Overview Model (`AiOverviewSections`):**
   ```ts
   export interface AiOverviewSections {
     state?: string
     economy?: string
     p2p?: string
     /** Optional single-note override when an interactive tool/query returns a specific comment. */
     focusNote?: { domain: CapabilityId; text: string }
   }
   ```
   - **Total Character Budget (`MAX_AI_TOTAL_CHARS = 600`):**
     - Across `state`, `economy`, and `p2p`, the total prose is capped at **`600` characters** (typically `~150–220` chars per active domain).
     - Both the deterministic narrator (`buildDeterministicOverviewSections(snapshots, trigger)`) and the Local LLM background pulse (`AiPulseNarrator` with JSON schema `{ "state"?: string, "economy"?: string, "p2p"?: string }`) can **omit** any domain where nothing notable is happening (for example, omitting `economy` during early `P2P_WARMUP` before the first block arrives) and allocate more characters to the active domains.
3. **Hanging-Indent Domain-Dot Layout (`renderAiOverviewSections` in `src/tui/interactionContent.ts`):**
   - For each non-empty domain section in reading order (`state`, `economy`, `p2p`):
     - Left margin padding: `2` spaces.
     - First wrapped line of the section: `${'  '}${capabilityMark(domain, status)}  ${line0}` (colored `●`/`◐`/`○` dot on the left, `2` spaces, then left-aligned text!).
     - Subsequent wrapped lines of the same section: `${'     '}${lineK}` (`5`-space hanging indent so every line of prose aligns cleanly along the left edge!).
   - Sections are separated by **1 blank row** (or **2 blank rows** when `innerLines >= 18` and all blocks fit with room to spare).
   - The combined block of sections is **vertically centered** inside `╭─ AI ─╮` (`topPad = Math.max(0, Math.floor((innerLines - totalRenderedLines) / 2))`).

---

### 3.4 `Tab` Domain Help (`DomainHelpUIComponent`) & Startup Default

1. **Startup & `Tab` Behavior:**
   - `createInitialViewState()` starts with `activeDomain: 'state'` and renders the **`State` Domain Help** in the Interaction View (`activeWidget = buildDomainHelpWidget(spine, 'state')`).
   - Pressing `Tab` (or `Shift+Tab`) when `promptDraft` is empty cycles `activeDomain` (`state` → `economy` → `p2p`) and sets the displayed view to that domain's structured Help page (`╭─ ● /help · State ─╮`, `╭─ ● /help · Economy ─╮`, `╭─ ● /help · P2P ─╮`).
   - Typing `/help` (or `/h`) at the prompt also opens the structured Help page for `view.activeDomain` (or `/help state`, `/help economy`, `/help p2p`).
   - Remove `openDeepView` on empty `Enter` (pressing `Enter` on an empty prompt is a no-op).
2. **Visually Appealing Multi-Section `DomainHelpUIComponent` (`src/tui/components/DomainHelpUIComponent.ts` & `src/tools/help.ts`):**
   - Framed inside the Interaction View box with title **`● /help · <Domain Name>`** (where `●` is the colored `capabilityMark(domain, status)`!).
   - Structured into **2–3 clean typographic sections** per domain (using bold section headers, dim underline rules, aligned command columns, and an **"Ask in Plain English"** prompt inspiration section at the bottom):
     - **`State` Help (`● /help · State`):**
       - *State & Sync Inspection:* `/buckets` (`16-bucket progress, cursors & speeds`), `/range [hex]` (`Browse synced accounts by hash prefix`), `/sample` (`Top synced accounts ranked by ETH balance`), `/account <0x>` (`Inspect account balance, nonce, code & BAL hits`), `/bal` (`Latest block access list diff table`), `/cl` (`Beacon light client finality & BLS %`).
       - *State Control:* `/pause` / `/resume` (`Pause or resume range synchronization`), `/reassign <0x>` (`Reassign a stalled bucket`).
       - *Ask in Plain English:* `"Why is bucket 0x3 slower?"` · `"What changed in the latest BAL?"` · `"Show top ETH holders"`
     - **`Economy` Help (`● /help · Economy`):**
       - *Chain & Contract Intelligence:* `/economy` (`64-block fee market, TPS, ETH volume & top contracts`), `/contract [addr|1..10]` (`Deep contract microscope: bytecode, proxy, ABI calls & events`).
       - *Ask in Plain English:* `"Which contracts write the most storage?"` · `"Explain the hottest contract"` · `"How is base fee trending?"`
     - **`P2P` Help (`● /help · P2P`):**
       - *Swarm & Diagnostics:* `/peers` (`Connected client table, caps, ETHY seed & latency`), `/ethy` (`ETHY/0 swarm status & served chunks`), `/diag` (`Flight-recorder diagnostic ring buffer`), `/drop <peerId>` (`Disconnect a peer session`).
       - *Ask in Plain English:* `"Compare Nethermind vs Geth peers"` · `"Who is the fastest peer?"` · `"Any handshake anomalies?"`

---

### 3.5 Interaction View History (`←` / `→` Arrow Keys, Capped at 12)

1. **History Ring (`viewHistory` on `TuiViewState`, `MAX_VIEW_HISTORY = 12`):**
   ```ts
   export type InteractionHistoryEntry =
     | {
         kind: 'slash'
         command: string        // e.g. '/peers', '/economy', '/contract 1'
         label: string          // e.g. '/peers'
         page: InteractionPage  // 'main' | 'debug'
       }
     | {
         kind: 'ai'
         prompt: string         // e.g. 'Can you give me the most used peers?'
         viewTitle: string      // e.g. 'Most used peers'
         widget: WidgetSpec     // preserved historic snapshot!
         overviewNote?: string
         page: InteractionPage
       }
   ```
   - **Help Pages Excluded:** Opening `/help` (via `Tab`, `Shift+Tab`, or typing `/help`) sets `view.showingHelp = true` (and `activeWidget = buildDomainHelpWidget(spine, activeDomain)`) **without** pushing to `viewHistory` or losing `view.viewHistoryIndex`!
   - **Deduplicating Slash Commands & Cap:**
     - When a user executes a slash command (e.g. `/peers`), if the current top of `viewHistory` is already the exact same slash command, it updates in place; otherwise it appends to `viewHistory` (truncating any forward history if the user had stepped back, or simply pushing to the end and capping at `12` entries).
     - When a user submits a natural-language AI query, once the result arrives, it pushes a `{ kind: 'ai', prompt, viewTitle, widget, overviewNote, page: 'main' }` snapshot to `viewHistory` (capped at `12`) and sets `showingHelp = false`.
2. **`Left` (`←`) and `Right` (`→`) Navigation Ergonomics (`src/tui/prompt.ts` & `src/tui/session.ts`):**
   - Decode `\u001b[D` / `\u001bOD` as `{ type: 'left' }`.
   - When **`promptDraft.length === 0`**:
     - Pressing **`Left` (`←`)**:
       - If currently viewing a Help page (`showingHelp === true`) and `viewHistory.length > 0`: immediately exits Help (`showingHelp = false`) and restores `viewHistory[viewHistoryIndex]`! *(So if you had an AI query open, pressed `Tab` to read domain help, and press `←`, your AI query is right back on screen!)*
       - Otherwise, if `viewHistoryIndex > 0`: decrements `viewHistoryIndex` and activates `viewHistory[viewHistoryIndex]`.
     - Pressing **`Right` (`→`)**:
       - If `showingHelp === false` and `viewHistoryIndex < viewHistory.length - 1`: increments `viewHistoryIndex` and activates `viewHistory[viewHistoryIndex]`.
   - When **`promptDraft.startsWith('/')`** (non-empty slash draft):
     - Pressing **`Right` (`→`)** continues to autocomplete the slash command as before!
3. **Live Command Refresh vs. Historic AI Snapshot:**
   - Whenever the active view is `showingHelp === false` and points to `entry = viewHistory[viewHistoryIndex]`:
     - If `entry.kind === 'slash'`: `session.ts` re-evaluates `dispatchSlashWidget(entry.command, ...)` on each draw/navigation so `/peers`, `/buckets`, `/economy`, `/contract`, `/bal` always show **live, up-to-date telemetry**!
     - If `entry.kind === 'ai'`: `session.ts` displays the stored `entry.widget` and `entry.viewTitle` **historically** without re-running the LLM!
   - **Title Bar Indicator:**
     - When viewing a history entry (`showingHelp === false` and `viewHistory.length > 0`), `interactionViewTitle` appends a subtle dim history badge such as `· [2/3 ← →]` (when `viewHistory.length > 1`).
     - When viewing a Help page (`showingHelp === true`) while `viewHistory.length > 0`, `interactionViewTitle` appends a subtle dim hint `· [← back to <lastTitle>]` so the user always sees that their previous view is safe and 1 key away!

---

## 4. Acceptance Criteria (`WP-07f`)

- [x] `CapabilityId` is streamlined to `'state' | 'economy' | 'p2p'` in reading order (`STATE`, `ECONOMY`, `P2P`) with Option B colors (`state` = yellow, `economy` = magenta/violet, `p2p` = green); `AI` is removed from the top-right capability bar.
- [x] Top cockpit row permanently displays `╭─ ● State ─╮`, `╭─ ● Economy ─╮`, and `╭─ ● P2P ─╮` (no `"Metrics"` suffix, no `Tab` rotation of the right box), with a zero-jitter active domain indicator (`•`) that replaces 2 border dashes without shifting box widths.
- [x] Lower-right `<Domain> Commands` box is removed; `╭─ AI ─╮` (neutral title, no purple dot) expands to full `fillRows` height and renders up to 3 domain-marked prose sections (`● State`, `● Economy`, `● P2P`) with hanging indents, `<= 600` total chars, and vertical centering.
- [x] Empty-draft `Enter` deep-view shortcut is removed; `Tab` / `Shift+Tab` cycles `activeDomain` (`state` → `economy` → `p2p`) and displays the structured multi-section `DomainHelpUIComponent` (`╭─ ● /help · <Domain> ─╮`), starting on `State` help at boot.
- [x] `Left` (`←`) and `Right` (`→`) arrow keys (on empty draft) navigate a 12-entry `viewHistory` (excluding `/help` pages), refreshing `kind: 'slash'` views live while preserving `kind: 'ai'` views as historic snapshots, and allowing `←` from any `/help` page to return to the last active view.
- [x] Update `packages/ethy/.cursor/rules/ethy-tui.mdc` and `packages/ethy/ARCHITECTURE.md` to reflect the 3-domain model, full-height `AI` box, `Tab` domain help, and `←`/`→` view history.
- [x] `npm run tsc`, `npm test`, and `npm run spellcheck` pass in `@ethereumjs/ethy`.

---

## 5. Concrete Implementation Plan (Planner — Grok 4.7)

Shipped per **D-104** / **D-105** blueprint: `CapabilityId` + `DOMAIN_ORDER` in `src/spine/types.ts`; `deriveCapabilities` + `headInspectUnlocked` in `src/spine/`; static three-box `src/tui/cockpit.ts`; full-height AI in `src/tui/lowerArea.ts` + `renderAiOverviewSections`; `DomainHelpUIComponent` + `buildDomainHelpWidget`; `viewHistory.ts` + session navigation; pulse/overview JSON sections (`≤600` chars). Tests: `tui.spec.ts`, `overviewNarrator.spec.ts`, `balSync.spec.ts`, `aiEngine.spec.ts`, `intent.spec.ts`.

---

## 6. Implementation Notes & Deviations (Implementer — Composer 2.5)

- Boot mounts State domain help via `createInitialViewState(spine)`; head-flip summary still pushes an `ai` history snapshot when `headFlipSummary` is set (no `activeWidget === null` boot).
- `/bal`, `/account`, `/simulate` gating uses `headInspectUnlocked(spine)`, not `capabilities.state === 'ready'`. Domain help always lists those slash commands.
- `p2p` readiness: exactly one peer is `partial`; two or more is `ready`.
