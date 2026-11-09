# WP-07b: Spatial Cockpit Redesign (Sketch Layout), `TableUIComponent`, `DebugPageUIComponent` (`Ctrl+D` Toggle) & Vertically-Centered `AI Prose Overview`

- **Status:** `READY_FOR_PLANNING`
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

- [ ] Top row displays `Node Pulse` (left), `Economy` (middle), and `<Domain> Metrics` (right), each 8 lines high.
- [ ] Lower area splits into the 2/3-width rounded **Interaction View** box (`╭─ <Title> ─╮`) on the left and the 1/3-width right stack: dynamic-height **`AI Overview`** box on top (with spacious padding, `<= 280` chars, vertically centered) and 8-line **`<Domain> Commands`** box anchored at the bottom above the prompt rule.
- [ ] `TableUIComponent` renders clean typographic tables without inner borders inside the Interaction View box; all slash commands (`/peers`, `/buckets`, `/economy`, `/bal`, etc.) use it and synchronize the Interaction View box title (`"/peers"`, `"Most used peers"`, etc.).
- [ ] `DebugPageUIComponent` and `Ctrl+D` (`toggleDebugPage`) switch the Interaction View between the clean Core Table and the structured Debug Page (removing the old inline `assistantComment` / `footer: 'discovery'` clutter from `/peers` and `/diag`).
- [ ] Update `packages/ethy/.cursor/rules/ethy-tui.mdc` to codify the new spatial layout and `UIComponent` laws.
- [ ] Virtual framebuffer tests (`test/tui.spec.ts`) lock down exact `(cols, rows)` geometry across resizes (`24..60` rows), vertical centering of `AI Overview`, and `Ctrl+D` page toggling.

---

## 6. Concrete Implementation Plan (Planner — Grok 4.7)

*(To be filled by Grok 4.7 during planning)*

---

## 7. Implementation Notes & Deviations (Implementer — Composer 2.5)

*(To be filled by Composer 2.5 during implementation)*
