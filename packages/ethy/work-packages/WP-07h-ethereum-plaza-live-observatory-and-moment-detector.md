# WP-07h: The Ethereum Plaza (`LiveHeadPlazaUIComponent`), Block Moment Detector ("Street Encounters"), 16-District State Lights & Empty-`Enter` Plaza Return

- **Status:** `DONE`
- **Dependencies:** `WP-07a`..`WP-07g` (`DONE`)
- **Primary Goal:** Transform reaching the Ethereum chain head from a static 5-line counter card into **"stepping out of the subway into a living, breathing plaza"** (`LiveHeadPlazaUIComponent`), powered by a zero-EVM **Block Moment Detector (`momentDetector.ts`)**, a **36-block Dual Skyline + Proposer Graffiti + 12s Slot Pulse**, **16-District State Neighborhood Lights (`0x0..0xf`)**, and **Empty-Draft `Enter` to "Go Back to the Plaza"** from any view.

---

## 1. Holistic Scope & Architectural Requirements (Coordinator — Gemini 4 Argon)

### 1.1 Vision & User Experience

During initial sync, the user is in the "subway tunnel" watching progress bars, buckets, and BAL catch-up. Once Ethy reaches the head (or as blocks stream in), the user steps out into the **Ethereum Plaza** — a living, ever-moving observation deck where you can sit for hours and watch the economic and human pulse of the network unfold every 12 seconds:

1. **Automatic Arrival ("The Big Flip") & `/live` (`/plaza`, `/head`) Command:**
   - When Ethy transitions into `HEAD_FOLLOWING` (`populateHeadFlipSummary`), instead of setting a static 5-row `key_value` stub (`★ Synced to Live Head`), it opens the live **`LiveHeadPlazaUIComponent`** (`kind: 'live_plaza'`).
   - Users can also open the Plaza at any time via **`/live`** (with aliases **`/plaza`** and **`/head`**).
   - Pressing **`Ctrl+D`** on the Plaza toggles to its `Debug` page (`Live | Debug (Ctrl+D)` in the header via `HeaderPageSwitchUIComponent`), which houses the structural sync & consensus provenance (`Accounts synced`, `Contracts`, `Storage slots`, `Pivot steps`, `BALs applied`, `CL BLS participation`, `Latest Block Hash`, and raw `extraData` hex).

2. **Empty-Draft `Enter` = "Return to the Plaza" (`src/tui/prompt.ts`, `src/tui/session.ts`, `src/tui/renderFrame.ts`):**
   - Pressing **`Enter` when the prompt draft is empty (`promptDraft === ''`)** is reserved as the universal **"go back to the plaza and watch"** key!
   - Specifically:
     - When `spine.economy?.hasBlocks === true` or `spine.phase === 'HEAD_FOLLOWING'` (or in `--demo` once blocks are present), pressing `Enter` on an empty prompt opens the **Live Head Plaza (`/live`)** (and pushes `/live` to `viewHistory` if not already the current view).
     - Before the first block is available (e.g. early `BOOTING` / `P2P_WARMUP` / early `SNAP_SYNCING` with no blocks yet), pressing `Enter` on an empty prompt returns to the `Welcome` start page (`start_page`) so the user can always return to the calm central observation screen after running `/peers`, `/buckets`, or `Tab` help!
   - Update the footer hint bar (`src/tui/renderFrame.ts`) to include `Enter plaza` (e.g. `Tab domain help · Enter plaza · ←/→ history · / command · Esc exit`).

---

### 1.2 Visual Layout of the Ethereum Plaza (`src/tui/components/LiveHeadPlazaUIComponent.ts`)

Inside the Interaction View box (`╭─ ● /live · Ethereum Plaza #12,111,702 · Live | Debug (Ctrl+D) ─── ← → ╮`), `LiveHeadPlazaUIComponent` renders three cohesive bands that align horizontally with the upper cockpit columns (`leftBoxOuterW` and `middleBoxOuterW`, using the same `gutter = COCKPIT_COLUMN_GAP + 4` two-column geometry as `DomainHelpUIComponent`):

```text
╭─ ● Ethereum Plaza · #12,111,702 · Live | Debug (Ctrl+D) ────────────────────── ← → ╮
│                                                                                     │
│  ▁▂▃▅▇█▆▄▃▂▁▂▄▆█▇▅▃▂▃▅▆▇▄▂▁▂▃▄▅▆▇█▆▅▃   Block #12,111,702 · "Titan Builder"         │
│  ░░░░▒▒▓▓██▓▓▒░░░░▒▓▓███▓▒░░▒▓████▓▒░   59 txs · 0 Gwei ↑ · 201 writes · 99.8% BLS  │
│  ───┬───────────┬───────────┬────────   ◊──●──◊──●──◊──●──◊──○──○  next block ~4s   │
│                                                                                     │
│  ● BLOCK ANATOMY (#12,111,702)          ● STREET ENCOUNTERS (Live Network Moments)  │
│                                                                                     │
│  ███▒▒▒░░░░  EIP-1559   48 txs (81%)    14:02:12  [NEW]  18.4 KB contract deployed  │
│  ██░░░░░░░░  EIP-4844    4 blobs (L2)             at 0x7a25…488D (EIP-1967, 12w)    │
│  █░░░░░░░░░  EIP-7702    2 delegations  14:02:12  [FLOW] 1 tx orchestrated 14       │
│  ███░░░░░░░  Contracts  38 touched                contracts · Swap + 6 Transfers    │
│                                         14:02:00  [1ST]  Wallet 0x91c0…3b2a signed  │
│  ● NEIGHBORHOOD LIGHTS (16 State Hexes)           its very first Ethereum tx        │
│                                         14:01:48  [NOTE] 0x4b12…99a1 inscribed:     │
│  0x0 ░▒▓█  0x4 ·░▒▓  0x8 ░▒▓█  0xc ▒▓██           "gm from sepolia!"                │
│  0x1 ·░▒░  0x5 ··░▒  0x9 ·░▒▓  0xd ·░▒░ 14:01:36  [REV]  Call to execute(bytes) on  │
│  0x2 ░▒▓▓  0x6 ░▒▓░  0xa ░▒▒░  0xe ░▒▓█           0x3fC9…72A1 reverted (6 touched)  │
│  0x3 ▒▓██  0x7 ··░░  0xb ·░▒░  0xf ··░▒                                             │
╰─────────────────────────────────────────────────────────────────────────────────────╯
```

*(Note: Use clean, terminal-safe Unicode badges/glyphs such as `★`, `◆`, `◈`, `✦`, `⚡`, `✉`, `✕` or bold bracketed tags `[NEW]`, `[FLOW]`, `[1ST]`, `[VET]`, `[WHALE]`, `[7702]`, `[NOTE]`, `[L2]`, `[REV]`, `[CALM]` so every terminal font renders the column widths with zero emoji width drift!)*

---

### 1.3 Detailed Component & Data Specifications

#### Part A: Enriched Block Metadata & `BlockMomentDetector` (`src/economy/momentDetector.ts`, `src/economy/types.ts`, `src/economy/decodeBundle.ts`)

1. **Header Timestamp & Proposer Graffiti Extraction (`decodeBundle.ts`):**
   - Extract `timestamp: number` (unix seconds from `header.timestamp`) and `extraDataAscii?: string` (printable ASCII decoded from `header.extraData` if `>= 3` printable characters in `0x20..0x7e`; plus `extraDataHex: string`) onto `BlockEconomyRecord`.
   - Extract `nibbleTouches: number[]` (length `16`, counting how many accounts in the block's `BAL` fall into each `keccak256(address)[0] >> 4` nibble `0x0..0xf`, or address prefix nibble when fast/cheap).

2. **`BlockMoment` Schema (`src/economy/types.ts`):**
   ```ts
   export type BlockMomentKind =
     | 'birth'        // New contract deployed (BAL codeChanges > 0 or contract-creation tx)
     | 'choreography' // Single tx / BAL access index mutating >= 8 accounts or >= 4 logs
     | 'whale'        // Large ETH transfer (>= 1 ETH on testnet/mainnet)
     | 'first_step'   // Brand-new account signing its 1st tx (BAL postNonce === 1)
     | 'veteran'      // High-nonce power actor (BAL postNonce >= 50,000)
     | 'eip7702'      // EIP-7702 setCode tx or 0xef0100 delegation code change
     | 'graffiti_note'// Printable UTF-8 message in calldata (4..160 bytes, >= 90% printable ASCII, not a catalog selector)
     | 'blob_anchor'  // EIP-4844 blob tx anchoring L2 data
     | 'revert'       // Reverted transaction (receipt status === 0)
     | 'heartbeat'    // Fallback notable activity / block summary so every block yields >= 1 moment

   export type BlockMoment = {
     id: string               // `${blockNumber}:${kind}:${index}`
     blockNumber: string
     timestampSec: number
     kind: BlockMomentKind
     badge: string            // Fixed 6-char badge, e.g. '[NEW] ', '[FLOW]', '[1ETH ]', '[BEAT]'
     headline: string         // 1–2 line human story (<= 96 chars)
     address?: string
   }
   ```

3. **Pure `detectBlockMoments(input)` (`src/economy/momentDetector.ts`):**
   - Inspects the decoded `BlockEconomyRecord`, block access list JSON, `bodyRlp` transactions, and `receiptsEth69Rlp` logs for a single block and returns up to **`3` highest-priority moments** (ranked by rarity/interest: `graffiti_note` > `birth` > `eip7702` > `choreography` > `whale` > `first_step` > `revert` > `veteran` > `blob_anchor` > `heartbeat`):
     - **`graffiti_note` (`✉ NOTE`):** Scans transactions where `data.length >= 5 && data.length <= 160`, the first 4 bytes are **not** in `signatureCatalog`, and `>= 90%` of bytes are printable ASCII (`0x20..0x7e`). Sanitizes control characters and quotes the message: `0x4b12…99a1 wrote on-chain: "gm from sepolia!"`.
     - **`birth` (`✦ NEW `):** Detects accounts in `balJson` with `codeChanges.length > 0` (or txs with `to === undefined`). Formats bytecode size and archetype/proxy hint if available: `New 4.2 KB contract deployed at 0x7a25…488D (12 slot writes)`.
     - **`eip7702` (`⚡ 7702`):** Detects `txTypeSplit.setCode > 0` or `codeChanges` starting with `0xef0100`: `Account 0x55a1…c091 activated EIP-7702 smart-account delegation`.
     - **`choreography` (`◈ FLOW`):** Groups BAL changes by `blockAccessIndex` (`> 0`) or `txSlices` by log count. When one transaction touches `>= 6` accounts or emits `>= 4` events, names the top decoded call/event (e.g. `Swap`, `Transfer`, `execute`): `Tx #2 orchestrated 11 accounts · execute() emitted 5 events`.
     - **`whale` (`[1ETH ]`):** When `largestTransferWei >= 10n ** 18n` (`>= 1 ETH`): `14.5 ETH transferred to 0xd8dA…6045 in a single move`.
     - **`first_step` (`◆ 1ST `):** Detects any account in `balJson` whose `nonceChanges` transitions to `postNonce === '0x1'` or `'0x01'` (`1n`): `New wallet 0x91c0…3b2a signed its very first transaction on Ethereum`.
     - **`veteran` (`★ VET `):** Detects any account in `balJson` whose `nonceChanges` reaches `>= 50_000n`: `Veteran actor 0xbe22…e054 signed its #142,810th lifetime transaction`.
     - **`revert` (`✕ REV `):** When `receiptReverts > 0`: `Transaction to 0x3fC9…72A1 reverted on-chain (${receiptReverts} revert in block)`.
     - **`blob_anchor` (`▲ L2  `):** When `txTypeSplit.blob > 0` or `blobGasUsed > 0`: `L2 rollup batch anchored ${txTypeSplit.blob} blob tx(s) onto Ethereum`.
     - **`heartbeat` (`• BEAT`):** If none of the rare triggers fired on a quiet or header+BAL-only block, emits a clean pulse line: `Block #${blockNumber}: ${activeAccounts} accounts touched across ${storageWrites} storage writes (${gasFullPct}% full)`.

4. **Rolling Moment Feed & Nibble Heat in `EconomySnapshot` (`src/economy/economyDataManager.ts`, `src/economy/types.ts`):**
   - Maintain a rolling ring of the latest **`24` `BlockMoment`s** (`moments: BlockMoment[]` on `EconomySnapshot`, newest first, deduplicated by `id`).
   - Expose `latestProposerGraffiti?: string`, `latestBlockTimestamp?: number`, and `nibbleHeat: number[]` (16-element array aggregating account touches across the recent block window for `0x0..0xf`) on `EconomySnapshot`.
   - Seed realistic demo moments and skyline bars in `advanceDemo.ts` / `seedDemoState.ts` so `ethy --demo` also showcases a vibrant Plaza!

---

#### Part B: `LiveHeadPlazaUIComponent` (`src/tui/components/LiveHeadPlazaUIComponent.ts`)

1. **Top Horizon Band (4 rows across full `innerWidth`):**
   - **Left side (width `leftColW`):**
     - Row 1: **Gas Skyline (`▁▂▃▄▅▆▇█`)** for up to the last `min(36, leftColW - 2)` blocks (oldest on left → newest on right), colored by fullness (`FG.cyan` `<35%`, `FG.yellow` `35–70%`, `FG.magenta` `>70%`).
     - Row 2: **State Mutation Density (`░▒▓█`)** for the same blocks based on `storageWrites + activeAccounts`.
     - Row 3: Time axis ruler (`───┴───────────┴──── now`).
   - **Right side (width `rightColW`, aligned with upper `State` box inner text):**
     - Row 1: `${BOLD}Block #${latestBlock}${RESET} · ${graffiti ? `"${graffiti}"` : 'Proposer verified'}`
     - Row 2: `${txCount} txs · ${baseFeeGwei} Gwei ${trendArrow} · ${storageWrites} writes · ${clPct}% BLS`
     - Row 3: **Live 12s Slot Breathing Bar:** Computes `elapsedSec = clamp(nowSec - latestBlockTimestamp, 0, 12)` (or uses `carouselTick` when timestamp is unavailable) and renders a 12-step visual cadence bar (`●──●──●──○──○  next block ~${12 - elapsedSec}s`) so the Plaza feels alive every second.

2. **Lower Split Columns (aligned with `leftColW` and `rightColW`):**
   - **Left Column:**
     - **Section 1 — `● Block Anatomy`:** 4 compact horizontal bar rows (`█`/`░`) showing the composition of the latest block (or 64-block window): `EIP-1559`, `EIP-4844 (Blobs)`, `EIP-7702 (Smart EOA)`, and `Contracts Touched / New`.
     - **Section 2 — `● Neighborhood Lights (0x0..0xf)`:** A 4×4 grid of the 16 state buckets (`0x0`..`0xf`), each displaying a 4-cell heat spark (`·░▒▓█`) proportional to its `nibbleHeat[i]`, connecting the 161.6M-account flat state directly to live block mutations.
   - **Right Column (`● Street Encounters`):**
     - Renders the rolling `moments` feed (up to as many 2-line entries as fit in `maxBodyLines - 6`).
     - Each moment shows:
       - Line 1: `${DIM}${HH:MM:SS}${RESET} ${badgeColor}${BOLD}${moment.badge}${RESET} ${moment.headlineLine1}`
       - Line 2 (if wrapped): `                ${DIM}${moment.headlineLine2}${RESET}`

3. **`Ctrl+D` Debug Page on `/live`:**
   - Attach `debugPage: livePlazaDebugSections(spine)` to the `live_plaza` `WidgetSpec`, containing:
     - **`Sync & State Summary`:** `Accounts` (`161,610,793`), `Contracts` (`codesSynced`), `Storage slots` (`storageSlotsSynced`), `Pivot steps`, `BALs applied`.
     - **`Head & Consensus Provenance`:** `Head block`, `Head stateRoot`, `CL status` (`verified` / `BLS %`), `Proposer graffiti`.

---

#### Part C: Empty-`Enter` Plaza Return, `/live` Command & Live Tick (`src/tui/prompt.ts`, `src/tui/session.ts`, `src/domains/toolRegistry.ts`, `src/tools/help.ts`)

1. **Prompt Key Reducer (`src/tui/prompt.ts`):**
   - In `reducePromptKey(view, action)`: when `action.type === 'enter'` and `view.promptDraft.trim().length === 0`, return `{ view, openPlaza: true }` (add `openPlaza?: boolean` to `PromptReduceResult`).
2. **Session Handling (`src/tui/session.ts`):**
   - When `r.openPlaza === true`:
     - If `node.spine.economy?.hasBlocks === true || node.spine.phase === 'HEAD_FOLLOWING'`, dispatch `/live` (`livePlazaWidget(node.spine)`), set `interactionLabel = '/live'`, `showingHelp = false`, and push `/live` to `viewHistory` (if not already at the tip of history).
     - Otherwise (early boot before any blocks exist), return to `{ kind: 'start_page' }` (`showingHelp = false`).
   - Also increment `view.carouselTick` on the 1s redraw timer whenever `view.activeWidget?.kind === 'live_plaza'` so the 12-second slot breathing bar updates smoothly between blocks!
   - In `peerCoordinator.ts`: `populateHeadFlipSummary` sets `spine.headFlipSummary = livePlazaWidget(spine)` so when the node finishes `BAL_CATCHUP` while on `Welcome`, it transitions straight into the Ethereum Plaza!
3. **Slash Command & Help Registration (`deterministicEngine.ts`, `toolRegistry.ts`, `slashComplete.ts`, `help.ts`, `commandAvailability.ts`):**
   - Register `/live` (and aliases `/plaza`, `/head`) in `SLASH_COMMANDS`, `SLASH_TOOL_REGISTRY` (`permission: 'read'`), `dispatchSlashWidget`, `getCommandAvailability` (`ready` when `economy?.hasBlocks === true || phase === 'HEAD_FOLLOWING'`, `locked` `'awaiting blocks'` before first block), and as the first command in `Economy Commands` (`help.ts`).

---

### 1.4 Acceptance Criteria

- [ ] `detectBlockMoments` (`src/economy/momentDetector.ts`) extracts structured `BlockMoment`s (`birth`, `choreography`, `whale`, `first_step`, `veteran`, `eip7702`, `graffiti_note`, `blob_anchor`, `revert`, `heartbeat`) from verified blocks and BALs without EVM execution, with unit test coverage for each moment detector.
- [ ] `ETHEconomyDataManager` populates `moments` (rolling 24-entry feed), `nibbleHeat` (16-bucket activity array), `latestProposerGraffiti`, and `latestBlockTimestamp` on `EconomySnapshot`.
- [ ] `LiveHeadPlazaUIComponent` (`src/tui/components/LiveHeadPlazaUIComponent.ts`) renders the 36-block Gas/BAL Skyline, Proposer Graffiti, 12s Slot Breathing Bar, Block Anatomy bars, 16-District Neighborhood Lights, and rolling Street Encounters feed, with column alignment matching the upper cockpit boxes and a `Ctrl+D` `Debug` page containing the 5 sync summary counters + CL provenance.
- [ ] Pressing `Enter` on an empty prompt (`promptDraft === ''`) opens the Ethereum Plaza (`/live`) once blocks are available (or returns to `Welcome` before blocks arrive), and the footer hint displays `Enter plaza`.
- [ ] Reaching `HEAD_FOLLOWING` (`headFlipSummary`) opens the Ethereum Plaza when the user is on the `Welcome` start page, and `/live` (`/plaza`, `/head`) opens and live-refreshes it at any time.
- [ ] `npm run tsc`, `npm test`, and `npm run spellcheck` pass in `@ethereumjs/ethy`.

---

## 2. Concrete Implementation Plan (Planner — Grok 4.7)

**Ethy only.** Decision **D-108** design locks: pure `detectBlockMoments`, optional snapshot fields, `live_plaza` widget with live `spine.economy` reads, `/live` registry + `/plaza` `/head` alias expand, empty-`Enter` via `openPlaza`, head-flip slash history, 1 Hz plaza `carouselTick`, demo `seedDemoPlazaEconomy` in `advanceDemo.ts`.

**Files:** `momentDetector.ts`, `decodeBundle.ts` (timestamp, extraData, nibbleTouches, firstRevertTo), `economyDataManager.ts` (24-moment feed, skyline, heat), `LiveHeadPlazaUIComponent.ts`, `livePlaza.ts`, TUI session/prompt/renderFrame, `peerCoordinator` head flip.

**Order:** types → detector tests → manager publish → plaza UI → slash wiring → demo seed → gates.

---

## 3. Implementation Notes & Deviations (Implementer — Composer 2.5)

- Shipped **D-108**: `live_plaza`, `BlockMomentDetector`, 36-block skyline, 16-district heat, `/live` + aliases, empty-`Enter` plaza return, head-flip opens Plaza on Welcome only.
- Whale moment badge is `[1ETH ]` (6 visible cols) per spellcheck-friendly ASCII badges.
- Gates: `npm run tsc`, **272** tests, `npm run spellcheck` in `@ethereumjs/ethy`.
