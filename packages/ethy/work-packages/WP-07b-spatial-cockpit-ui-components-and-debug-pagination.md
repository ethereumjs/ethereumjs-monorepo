# WP-07b: Spatial Cockpit Redesign (Sketch Layout), `TableUIComponent`, `DebugPageUIComponent` (`Ctrl+D` Toggle) & Vertically-Centered `AI Prose Overview`

- **Status:** `DONE`
- **Dependencies:** `WP-07a`
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Holistic Scope & Architectural Requirements

### Goal
Implement the **new spatial 2-Zone / 3-Column TUI architecture** (from your handwritten layout sketch) together with a clean, data-less **`UIComponent` library** (`TableUIComponent`, `KeyValueUIComponent`, `DebugPageUIComponent`), view-page toggling (core table vs. structured debug page), and the **spacious, vertically-centered `AI Prose Overview` box** (driven initially by a smart deterministic Stage/Economy Narrator in `WP-07b`, and seamlessly upgraded to the 30–60s Local LLM Pulse in `WP-07c`).

---

## 2. Exact Spatial Geometry (Matching Your Sketch)

Look at how the three horizontal column weights (`[w0, w1, w2] = cockpitColumnWidths(contentWidth)`) map onto both rows of the main screen:

```text
 Ethy v10.1.3 | SEPOLIA                        Slot 11,518,729        ● P2P  ● SNAP  ◐ HEAD  ◐ AI
──────────────────────────────────────────────────────────────────────────────────────────────────
 ╭─ Node Pulse ───────────────╮  ╭─ Economy ──────────────────╮  ╭─ ● P2P Metrics ──────────────╮
 │                            │  │                            │  │                              │
 │ Stage     Snap · Storage   │  │ Gas / Base  2.4 Gwei ↑     │  │ Peers     7 connected        │
 │ Target    #12.09M → #12.09M│  │ Activity    118 tx · 9.8/s │  │ Served    14 replies · 2.1MB │
 │ Progress  ██████████████░░ │  │ Volume      42.1 ETH / blk │  │ Latency   65 ms avg          │
 │ State     code 713k/751k   │  │ Hot Contr.  0x7a25… (38w)  │  │ Clients   5 Neth · 2 Geth    │
 │                            │  │                            │  │                              │
 ╰────────────────────────────╯  ╰────────────────────────────╯  ╰──────────────────────────────╯

 ╭─ /peers · Peer health [1/2 Table · Ctrl+D Debug] ──────────╮  ╭─ ◐ AI Overview ──────────────╮
 │                                                            │  │                              │
 │  Peer          Client        Caps          Ethy   Avg ms   │  │                              │
 │  ────────────  ────────────  ────────────  ─────  ──────   │  │    Resumed Sepolia state     │
 │  2671639e2c4b  Nethermind    eth/71,snap   —      65       │  │    at #12,096,957 (95%).     │
 │  02b9e31f8f41  Geth/v1.17    eth/71,snap   —      164      │  │    Bytecode is 95% done;     │
 │  34da37590bf0  Nethermind    eth/71,snap   —      82       │  │    118 txs landed in the     │
 │                                                            │  │    latest BAL. Tip: press    │
 │                                                            │  │    Ctrl+D on /peers to       │
 │                                                            │  │    inspect RLPx & serving.   │
 │                                                            │  │                              │
 │                                                            │  ╰──────────────────────────────╯
 │                                                            │  ╭─ ● P2P Commands ─────────────╮
 │                                                            │  │                              │
 │                                                            │  │ /peers     client table      │
 │                                                            │  │ /ethy      swarm status      │
 │                                                            │  │ /diag      anomalies         │
 │                                                            │  │ /drop      disconnect        │
 │                                                            │  │                              │
 ╰────────────────────────────────────────────────────────────╯  ╰──────────────────────────────╯
──────────────────────────────────────────────────────────────────────────────────────────────────
 ● ethy > █
 Enter open P2P view · Tab switch domain · Ctrl+D debug page · / command · Esc exit
```

### Geometry Invariants
1. **Top Row (Fixed 8 Lines High):**
   - **Left (`w0`):** `╭─ Node Pulse ─╮` — Node health overview & sync progress.
   - **Middle (`w1`):** `╭─ Economy ─╮` — Live Ethereum economy (`ETHEconomyDataManager` from `WP-07a`: gas/baseFee trend, tx rate & ETH volume, BAL state activity, hottest contract).
   - **Right (`w2`):** `╭─ <Mark> <Domain> Metrics ─╮` — Domain-specific metrics for `activeDomain`.
2. **Lower Area (`fillRows` Between Top Cockpit and Bottom Prompt Rule):**
   - **Left 2/3 (`leftW = w0 + COCKPIT_COLUMN_GAP + w1`, Full `fillRows` Height):**
     - **`╭─ <Dynamic Title> ─╮` (The Interaction View Box):**
       - Enclosed in the same fine-line rounded box (`╭─╮ │ ╰─╯`) with 1 blank inner padding row top/bottom and 2-column horizontal inner air.
       - **Dynamic Synchronized Title:** Always reflects what triggered the view:
         - Slash command: `/peers` (or `/peers · Peer health`), `/buckets`, `/economy`, `/bal`, `/cl`, `/account 0x…`.
         - Natural-language AI prompt: compact 2–5 word title derived from the user's question (e.g. `"Can you give me the most used peers?"` → `"Most used peers"`).
         - When a secondary Debug page is available on the active view, shows a subtle dim indicator in the title bar (`· [Ctrl+D debug]` or `[Debug page · Ctrl+D table]`).
   - **Right 1/3 (`rightW = w2`, Split Vertically into Top `AI Overview` + Bottom `<Domain> Commands`):**
     - **Bottom Right Box (`╭─ <Mark> <Domain> Commands ─╮`, Fixed 8 Lines High):**
       - Anchored directly above the bottom prompt delimiter line! Lists the slash commands for `view.activeDomain`.
     - **Middle Right Box (`╭─ <Mark> AI Overview ─╮`, Dynamic Height = `fillRows - 8`):**
       - Stretches from below `<Domain> Metrics` to just above `<Domain> Commands`, growing/shrinking automatically on terminal resize!
       - **Spacious All-Sides Padding & Vertical Centering:**
         - Uses generous horizontal padding (`3` columns left/right inside `│ ... │`) and word-wraps prose cleanly.
         - Capped at **`280` characters** (`MAX_AI_OVERVIEW_CHARS = 280`).
         - **Always vertically centered** inside the box (`topPad = Math.floor((innerHeight - wrappedLines.length) / 2)`), so whether the terminal is 28 rows or 60 rows tall, the prose floats calmly in the vertical center of the panel!

---

## 3. Data-Less UI Component System (`src/tui/components/`) & Debug Page Toggle

Instead of ad-hoc `renderTable` ASCII boxes with `┌─┬─┐` inside the main area (which created double-borders and cramped columns), we introduce a clean, data-less **`UIComponent` architecture** rendered *inside* the rounded Interaction View box:

1. **`TableUIComponent` (`src/tui/components/TableUIComponent.ts`):**
   - Pure, data-less layout component accepting `{ columns: TableColumnSpec[], rows: string[][], emptyMessage?: string }`.
   - Since the outer Interaction View already provides the `╭─ ... ─╯` rounded frame, `TableUIComponent` uses a **clean typographic table without inner borders** inside the box:
     - **Bold** column headers (`Peer`, `Client`, `Caps`, `Ethy`, `Avg ms`, `Last issue`).
     - A thin dimmed underline (`────  ────  ────`) under each column header (no vertical `│` bars cluttering every row!).
     - Smart column alignment (`left` vs `right` for numbers like `Avg ms`, `Accounts`, `Balance`) and proportional flex truncation.
     - Automatically clips rows to the available inner height of the Interaction View box and shows a dim `+N more rows` indicator when needed.

2. **`DebugPageUIComponent` (`src/tui/components/DebugPageUIComponent.ts`) & `Ctrl+D` Page Toggle:**
   - Previously, `/peers` crammed a dense 140-char `assistantComment` (`> 2 connected peers... Serve h:0 b:1... Local enode: enode://...`) and `/diag` crammed a `discovery` footer underneath the table.
   - Now, every Interaction View `WidgetSpec` can carry an optional structured **`debugPage?: DebugSectionSpec[]`**!
   - **Core Page (`view.interactionPage === 'main'`):** Shows **only** the clean `TableUIComponent` (or `KeyValueUIComponent`) with zero debug clutter underneath!
   - **Debug Page (`view.interactionPage === 'debug'`, toggled with `Ctrl+D`):**
     - Pressing **`Ctrl+D`** (works anytime, even while typing a command, or **`Tab` / `d` when designated**) swaps the Interaction View content between the **Core Table** and the structured **`DebugPageUIComponent`** (and pressing `Ctrl+D` again switches right back!).
     - For `/peers`: the Debug Page renders well-structured, multi-section key-value grids for **Discovery Funnel** (`DPT table`, `RLPx dials / connects / statusOk / slotsReject`), **Serving Telemetry** (`Headers`, `Bodies`, `Receipts`, `BALs`, `ETHY chunks`, `Window #earliest..#latest`), and **Local Node Identity** (full wrapped `enode://...` URL and logs path).
     - For `/buckets`: the Debug Page shows per-bucket cursor sub-ranges, verify worker pool stats, and contract scan offsets.

3. **Re-channel All Existing Commands (`/peers`, `/buckets`, `/ethy`, `/diag`, `/range`, `/sample`, `/bal`, `/account`, `/cl`, `/economy`, `/help`)** through the new Interaction View box + `TableUIComponent` / `KeyValueUIComponent` + `DebugPageUIComponent`.

---

## 4. Deterministic Stage & Economy Narrator (`src/ai/overviewNarrator.ts`)

Even before the Local LLM is connected in `WP-07c` (or whenever the user runs Ethy without an external LLM server), the **`AI Overview`** box is alive and genuinely helpful!
- `buildDeterministicOverview(snapshots: EthyDomainSnapshots, trigger: 'welcome' | 'pulse'): string` produces a crisp `<= 280`-char situational briefing updated every **30 seconds** (and on phase transitions):
  - **On Welcome / Warmup:** Explains whether Ethy is starting fresh or resuming a saved pivot (`#P`, `%` complete), peer discovery status, and a quick usage tip (`Press Tab to cycle domains or Enter to inspect peers`).
  - **During `SNAP_SYNCING`:** Summarizes account or code/storage progress + ETA, notes whether `eth/71` BALs are already streaming in the background (with a peek at live network tx/contract activity!), or suggests `/peers` / `Ctrl+D` if throughput stalls.
  - **During `HEAD_FOLLOWING`:** Shifts focus to the **Ethereum Economy** — reporting baseFee trend, TPS, ETH volume, and the hottest contract on the network right now!

---

## 5. Acceptance Criteria (`WP-07b`)

- [x] Top row displays `Node Pulse` (left), `Economy` (middle), and `<Domain> Metrics` (right), each 8 lines high.
- [x] Lower area splits into the 2/3-width rounded **Interaction View** box (`╭─ <Title> ─╮`) on the left and the 1/3-width right stack: dynamic-height **`AI Overview`** box on top (with spacious padding, `<= 280` chars, vertically centered) and 8-line **`<Domain> Commands`** box anchored at the bottom above the prompt rule.
- [x] `TableUIComponent` renders clean typographic tables without inner borders inside the Interaction View box; all slash commands (`/peers`, `/buckets`, `/economy`, `/bal`, etc.) use it and synchronize the Interaction View box title (`"/peers"`, `"Most used peers"`, etc.).
- [x] `DebugPageUIComponent` and `Ctrl+D` (`toggleDebugPage`) switch the Interaction View between the clean Core Table and the structured Debug Page (removing the old inline `assistantComment` / `footer: 'discovery'` clutter from `/peers` and `/diag`).
- [x] Update `packages/ethy/.cursor/rules/ethy-tui.mdc` to codify the new spatial layout and `UIComponent` laws.
- [x] Virtual framebuffer tests (`test/tui.spec.ts`) lock down exact `(cols, rows)` geometry across resizes (`24..60` rows), vertical centering of `AI Overview`, and `Ctrl+D` page toggling.

---

## 6. Concrete Implementation Plan (Planner — Grok 4.7)

**Baseline (2026-11-09):** Top row is still `Node Pulse | <Domain> Commands | <Domain> Metrics`; fill band is full-width `renderWidgetLines` plus optional `formatDiscoveryLines` footer ([`renderFrame.ts`](../src/tui/renderFrame.ts), [`cockpit.ts`](../src/tui/cockpit.ts)). Economy telemetry from **WP-07a** is on `spine.economy` and `ETHEconomyDataManager.cockpitPairs()`. Today `\u0004` maps to `exit` in [`prompt.ts`](../src/tui/prompt.ts) — this WP remaps it to debug-page toggle.

### 6.1 Design refinements (**D-099**)

| Topic | Decision |
| --- | --- |
| **Ctrl+D** | Toggle `interactionPage` between `main` and `debug`. `\u0004` no longer exits. Exit: Ctrl+C and Esc only. Works with a non-empty draft (no character inserted). No bare `d` key. No-op when `debugPage` is empty. |
| **Short terminals** | Fixed overhead **16** rows → `fillRows = rows - 16`. Commands box (8 lines) only when `fillRows >= 13`. If `10 <= fillRows < 13`, AI box ≥ 5 lines and commands shrink. Below 10, omit AI box; commands fill `fillRows`. |
| **Economy box** | Four rows from `economyCockpitPairs(snap)` only (Gas / Base, Activity, State / BAL, Hot Contract). No fifth Volume row (Activity already carries ETH volume). |
| **Top-row labels** | Shared `maxLabelWidth` across the three top boxes only. Commands box in lower-right sizes its own labels. P2P commands box: four rows (`/peers`, `/ethy`, `/diag`, `/drop`); `/help` typed, not a fifth row. |
| **Interaction title** | Slash: `` `/peers · Peer health` ``. NL query: `widget.title` or first five words of the question. Page hint: `[1/2 Table · Ctrl+D Debug]` or `[2/2 Debug · Ctrl+D Table]` when `debugPage` present. New widget → `interactionPage: 'main'`. |
| **Main vs debug** | Remove `assistantComment` and `footer: 'discovery'` from main render. Keep `preface` + `secondaryTable` on main (`/economy`). Telemetry prose → `debugPage`. |
| **Narrator** | `buildDeterministicOverview(EthyDomainSnapshots, 'welcome' \| 'pulse')` only; session stores `view.aiOverview`; refresh on first paint, `spine.phase` change, 30s timer — not inside `renderFrame`. `MAX_AI_OVERVIEW_CHARS = 280`; inner horizontal pad `3`; vertical center via `topPad = Math.floor((innerHeight - wrappedLines) / 2)`. |
| **NoticeBoard** | Footer right cell width `w2`, under commands box (unchanged). |
| **Empty interaction** | Rounded box title `Welcome`; body = onboarding carousel. Welcome copy in AI Overview only. |
| **Docs** | [`ethy-tui.mdc`](../.cursor/rules/ethy-tui.mdc) bands 2–3 + key table; [`.cursor/rules/ethy-architecture.mdc`](../../../.cursor/rules/ethy-architecture.mdc) §2 middle box = Economy; fix [`ARCHITECTURE.md`](../ARCHITECTURE.md) if it still says Commands are middle box. |

### 6.2 Target layout (fill band)

```text
leftW = w0 + COCKPIT_COLUMN_GAP + w1   rightW = w2
╭─ <Dynamic Title> ─╮                 ╭─ AI Overview ─╮  (fillRows - 8, or degraded)
│ TableUI / KV /    │                 ╰──────────────────╯
│ DebugPage         │                 ╭─ <Domain> Commands ─╮ (8 lines)
╰───────────────────╯                 ╰────────────────────╯
```

### 6.3 Types & view state

[`src/spine/types.ts`](../src/spine/types.ts):

- `DebugSectionSpec = { title: string; entries: Array<{ key: string; value: string }> }`
- Add optional `debugPage?: DebugSectionSpec[]` to every `WidgetSpec` variant.
- `TuiViewState`: `interactionPage: 'main' | 'debug'`; `aiOverview?: string`.

### 6.4 New / refactored TUI modules

| File | Responsibility |
| --- | --- |
| `src/tui/roundedBox.ts` | Extract `boxTop` / `boxRow` / `boxBottom` / `renderBox` from cockpit (shared by interaction, AI, commands). |
| `src/tui/components/TableUIComponent.ts` | Bold headers, dim column underlines, 2-space gaps, no `┌┐│`; numeric columns right-aligned; clip rows + `+N more`; reuse `layoutTableColumns` without border width fudge. |
| `src/tui/components/KeyValueUIComponent.ts` | Inner two-column rows, no nested box. |
| `src/tui/components/DebugPageUIComponent.ts` | Section titles + KV grids, height-clipped. |
| `src/economy/cockpitPairs.ts` | Pure `economyCockpitPairs(snap)`; `ETHEconomyDataManager.cockpitPairs()` delegates. |
| `src/tui/cockpit.ts` | Top row: Pulse \| Economy \| domain Metrics; remove commands from this band. |
| `src/tui/lowerArea.ts` | `renderLowerArea(spine, view, contentWidth, fillRows)` — interaction left, AI + commands right. |
| `src/tui/renderFrame.ts` | Fill = `renderLowerArea`; drop discovery footer band; footer hints include **Ctrl+D debug page**. |
| `src/tui/widgets.ts` | Dispatch inner bodies only; delete bordered `renderTable` + `assistantComment` tail (keep `layoutTableColumns`, carousel). |
| `src/ai/overviewNarrator.ts` | Deterministic overview strings (welcome, snap, head phases). |

### 6.5 Input & session

- [`prompt.ts`](../src/tui/prompt.ts): `KeyAction` `toggleDebug`; `\u0004` → that action; `createInitialViewState()` sets `interactionPage: 'main'`.
- [`session.ts`](../src/tui/session.ts): handle `toggleDebug`; new widget resets `main`; narrator refresh on phase + 30s interval.

### 6.6 Tool / widget migrations

| Tool | Main page | `debugPage` |
| --- | --- | --- |
| `peersTableWidget` | Peer table | Discovery funnel, serving telemetry, enode + logs |
| `diagnosticsTableWidget` | Ring table | Discovery lines + flight recorder path (remove `footer: 'discovery'`) |
| `bucketsTableWidget` | 16-bucket table | Cursor stats per prefix; code/storage spine totals |
| `economyDeepViewWidget` | Preface + both tables | Net-ETH methodology (from `assistantComment`) |
| Others (`/ethy`, `/range`, `/sample`, `/bal`, `/account`, `/cl`, `/help`, write actions) | Interaction box render | Only when a real second telemetry block exists today |

### 6.7 Tests

- [`test/tui.spec.ts`](../test/tui.spec.ts): geometry at 100×40 / 100×60 / 80×24; Economy in top middle; commands lower-right; AI vertical center; Tab preserves `activeWidget`; peers/diag main lacks enode/discovery; debug page has them; Ctrl+D toggling.
- [`test/tui.spec.ts`](../test/tui.spec.ts) prompt: Ctrl+C exit; Ctrl+D `toggleDebug` without mutating draft.
- New `test/overviewNarrator.spec.ts`: length ≤ 280; phase-appropriate nouns.

### 6.8 Gates & out of scope

- **Gates:** `npm run tsc`, `npm test`, `npm run spellcheck` in `packages/ethy`.
- **Out of scope:** new npm deps; LLM client / `IntentEngine` composer (**WP-07c**); `/contract` microscope (**WP-07d**); economy ingest math changes.

### 6.9 Implementation order (suggested)

1. Types + `roundedBox` + components (unit-test layout helpers).
2. `cockpit.ts` + `economy/cockpitPairs.ts` + `lowerArea.ts` + `renderFrame` wiring.
3. `prompt` / `session` + `overviewNarrator`.
4. Tool `debugPage` migrations (peers, diag, buckets, economy first).
5. Rules/docs + framebuffer tests.

---

## 7. Implementation Notes & Deviations (Implementer — Composer 2.5)

**Status:** Shipped 2026-11-09. Gates: `npm run tsc`, `npm test` (227), `npm run spellcheck:ts`.

**Delivered modules:** `roundedBox.ts`, `lowerArea.ts`, `interactionContent.ts`, `tui/components/{Table,KeyValue,DebugPage}UIComponent.ts`, `economy/cockpitPairs.ts`, `ai/overviewNarrator.ts`; `cockpit.ts` top row Economy; `prompt.ts` `toggleDebug` on `\u0004`; `session.ts` narrator refresh + debug toggle; tool `debugPage` on peers, diag, buckets, economy.

**Deviations / notes:**

- `layoutTableColumns` keeps optional `borderPadding` for legacy callers; typographic tables use `borderPadding: 0` via `TableUIComponent`.
- Short-terminal degrade matches §6.1 (`fillRows < 13` shrinks AI box; `< 10` drops AI box).
- `ARCHITECTURE.md` ASCII sketch updated to match **D-099**; no runtime behavior change from doc-only drift.
