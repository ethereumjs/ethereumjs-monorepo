# WP-07i: Adaptive Sub-Gwei Fee Formatting, 64-Block Macro Statistical `Economy` Cockpit & Plaza Contract Introspection (`● CONTRACT PULSE`)

- **Status:** `DONE`
- **Dependencies:** `WP-07d`, `WP-07h`, `WP-08a`, `WP-08b` (`DONE`)
- **Primary Goal:** Polish the live economic and contract intelligence experience at the chain head by (1) introducing **adaptive sub-Gwei base-fee formatting** + a trend noise floor so Sepolia/quiet-Mainnet blocks never render `0 Gwei ↑`, (2) redesigning the top-left **`Economy` cockpit box** into a **64-block macro statistical lens** (complementing the Plaza's per-block view without duplication), and (3) fixing contract archetype classification on live traffic while surfacing **contract introspection directly inside the Ethereum Plaza** (inline in `STREET ENCOUNTERS` and in a new lower-left **`● CONTRACT PULSE (64B)`** ecosystem section).

---

## 1. Holistic Scope & Architectural Requirements (Coordinator — Gemini 4 Argon)

### 1.1 Why `WP-07i` Matters

Live testing of the Ethereum Plaza (`WP-07h`) on Sepolia at `#12,117,924` revealed three concrete high-leverage improvements:

1. **The `0 Gwei ↑` / `0 Gwei ↓` Precision Mismatch (`src/economy/format.ts` & `economyDataManager.ts`):**
   - `computeTrend` in `economyDataManager.ts` calculates the 15-block moving average in raw `wei`, while `formatGwei` truncates anything under `0.1 Gwei` (`100,000,000 wei`) to `"0 Gwei"`.
   - On Sepolia (and quiet Mainnet periods), `baseFeePerGas` is typically `0.001–0.05 Gwei` (`1–50 Mwei`) or near the `7 wei` minimum. A move from `1.2 Mwei` to `1.5 Mwei` triggers `trend = 'up'` (`↑`) while `formatGwei` prints `0 Gwei`, resulting in the confusing `0 Gwei ↑` display.
2. **Contract Introspection (`[ERC-20]`, `[DEX Pool]`, `[DEX Router]`, `[Proxy]`) Staying Hidden on Live Traffic (`src/contracts/contractIntelligence.ts`):**
   - Even with `713.7k` synced contract bytecode entries on disk, `Hot Contr.` (`0xbe22..e054 (41w)`) and the Plaza did not display contract archetypes because:
     - **Proxy & Implementation Resolution:** When a hot contract is an `EIP-1967` or `EIP-1167` proxy, its own bytecode is a tiny delegate-call shell; if `proxyTarget` bytecode is in `FlatStateManager` (or `coldCodeLookup`), `pass1FromFingerprint` was only run on the proxy shell rather than also inspecting `proxyTarget`'s bytecode, and when `code` was absent `pass2Behavior` returned generic `'Contract'` even when `proxyKind === 'EIP-1967'` was known!
     - **Over-Strict `ERC-20` Write-Rate Filter (`contractIntelligence.ts:215`):** `pass2Behavior` required `writesPerBlock >= 1 && writesPerBlock <= 4` even when an address emitted canonical `Transfer(address,address,uint256)` logs (`TOPIC.transferErc20`) or handled `transfer` / `approve` selectors, causing busy tokens (`>4 writes/blk`) to fall back to generic `'Contract'`.
3. **Top-Left `Economy` Cockpit Redundancy vs the Plaza (`src/economy/cockpitPairs.ts`):**
   - Currently, the top-left `Economy` box displays single-block metrics (`40% full`, `159 txs · 0.4 ETH`, `502 acc · 740 writes · 4 new`) that duplicate the exact single-block numbers shown right below in the Plaza's header and `BLOCK ANATOMY`.
   - By turning the **top-left `Economy` box** into a **64-block (~13 minute) macro statistical regime view** and keeping the **Plaza** focused on live block-by-block life + a new lower-left **`● CONTRACT PULSE (64B)`** ecosystem summary, both panels gain a distinct, non-overlapping purpose.

---

### 1.2 Deliverable 1: Adaptive Sub-Gwei Formatting & Trend Noise Floor (`src/economy/format.ts`, `src/economy/economyDataManager.ts`)

1. **Adaptive Precision in `formatGwei(wei)` (`src/economy/format.ts`):**
   - Preserve human-friendly `Gwei` units while scaling decimal precision to the fee regime:
     - `wei === 0n` $\rightarrow$ `'0 Gwei'`
     - `wei >= 10_000_000_000n` ($\ge 10\text{ Gwei}$) $\rightarrow$ 1 decimal if non-zero tenths, e.g. `'14.2 Gwei'` or `'14 Gwei'`
     - `wei >= 100_000_000n` ($0.1\text{ – }9.99\text{ Gwei}$) $\rightarrow$ up to 2 decimals (trimming trailing zeros), e.g. `'0.42 Gwei'`, `'1.5 Gwei'`
     - `wei >= 1_000_000n` ($0.001\text{ – }0.099\text{ Gwei}$) $\rightarrow$ up to 3 decimals (trimming trailing zeros), e.g. `'0.004 Gwei'`, `'0.025 Gwei'`
     - `0n < wei < 1_000_000n` ($< 0.001\text{ Gwei}$) $\rightarrow$ `'<0.001 Gwei'`
   - Add a companion helper `formatBaseFeeNumber(wei: bigint | undefined): string` (or continue stripping `' Gwei'` cleanly where needed) so `baseFeeGwei` in `EconomySnapshot` carries `'14.2'`, `'0.42'`, `'0.004'`, or `'<0.001'` without ever collapsing a positive sub-Gwei fee to `'0'` unless `wei === 0n`.
2. **Trend Noise Floor in `computeTrend` (`src/economy/economyDataManager.ts`):**
   - When `currentBase` and `mean` are both in the ultra-low sub-Mwei regime (`< 100_000n` wei, i.e. `< 0.0001 Gwei`) or the absolute delta `|currentBase - mean| < 10_000n` wei, return `{ trend: 'flat' }` so microscopic 2-wei base-fee ticks at the EIP-1559 floor do not flash `↑` / `↓` arrows.

---

### 1.3 Deliverable 2: 64-Block Macro Statistical `Economy` Cockpit Box (`src/economy/types.ts`, `economyDataManager.ts`, `cockpitPairs.ts`, `overviewNarrator.ts`)

1. **Rolling 64-Block Macro Aggregates on `EconomySnapshot` (`src/economy/types.ts`, `economyDataManager.ts`):**
   - Extend `EconomySnapshot` with rolling window statistics computed across `this.ring` (up to `64` blocks):
     - `windowBlockCount?: number` — number of blocks currently in the rolling window (`1..64`).
     - `avgGasFullPct?: number` — mean gas utilization percentage across the window (`0..100`).
     - `windowTxCount?: number` — total transactions across decoded bodies in the window.
     - `windowRevertPct?: number` — percentage of reverted transactions across blocks with receipts in the window (e.g. `1.8`).
     - `windowPeakTransferEth?: string` — largest single ETH transfer observed across the entire 64-block window (not just the latest block).
     - `archetypeMix?: Array<{ archetype: string; count: number; sharePct: number }>` — distribution of classified active contracts in the window across canonical categories (`ERC-20`, `DEX`, `Proxy`, `AA/7702`, `L2/Blob`, `Custom`).
2. **4-Row Macro Statistical Layout in `economyCockpitPairs` (`src/economy/cockpitPairs.ts`):**
   - Replace the single-block duplicate rows in the top-left `Economy` cockpit box with 4 high-signal macro rows over the rolling window:
     ```text
     ╭─ ● Economy ·───────────────────────────────────────────╮
     │ Fee (64b)   <0.001 Gwei · 44% avg load                 │
     │ Throughput  12.1 tx/s · 9,140 txs · 1.4% rev           │
     │ Volume      41.4 ETH (64b) · peak 12.0 ETH             │
     │ Top Venue   0xbe22…e054 [Proxy] · 41w/blk              │
     ╰────────────────────────────────────────────────────────╯
     ```
     - **Row 1 — `Fee (64b)`:** `${baseFeeGwei} Gwei${trendArrow}${pctClause} · ${avgGasFullPct}% avg load` (where `pctClause` is e.g. ` (+18%)` when `trend !== 'flat'` and `trendPercent !== undefined`).
     - **Row 2 — `Throughput`:** When bodies are present: `${tps.toFixed(1)} tx/s · ${windowTxCount.toLocaleString('en-US')} txs${revertClause}` (where `revertClause` is ` · ${windowRevertPct.toFixed(1)}% rev` when receipt counts exist); during headers+BAL fast catch-up: `BAL stream · ${activeAccounts} acc/blk`.
     - **Row 3 — `Volume`:** `${ethTransferredWindowEth} (${windowBlockCount}b) · peak ${windowPeakTransferEth ?? '0 ETH'}`.
     - **Row 4 — `Top Venue`:** Dominant contract across the 64-block window (`snap.topContracts[0]`): `${label} [${badge}] · ${slots}w/blk` (always showing a meaningful badge — `knownName`, specific `archetype`, `proxyKind`, or `[Contract]` — plus its top decoded selector if space permits).
3. **AI Overview Narrator Alignment (`src/ai/overviewNarrator.ts`):**
   - Note Notice: In the user's screenshot, the AI box said `Head following live — 76% sync complete.` because `713.7k` codes out of total contracts was still at 76% background code/storage crawl even though `State` showed `100% (synced)` for the 16 account buckets and live head following!
   - Update `overviewNarrator.ts` so:
     - When `spine.phase === 'HEAD_FOLLOWING'` and all 16 account buckets are done, the `State` bullet reports `Head following live at #<block> (16/16 buckets synced).` (or mentions background code/storage indexing clearly without saying `76% sync complete` as if the node isn't synced).
     - The `Economy` bullet includes the top contract's archetype/knownName (`Hottest: 0xbe22…e054 [EIP-1967 Proxy]`) and uses the adaptive `baseFeeGwei`.

---

### 1.4 Deliverable 3: Contract Introspection Hardening & Plaza `● CONTRACT PULSE` (`src/contracts/contractIntelligence.ts`, `src/economy/momentDetector.ts`, `src/tui/components/LiveHeadPlazaUIComponent.ts`)

1. **Harden `classifyAddress` & `pass2Behavior` on Real Network Traffic (`src/contracts/contractIntelligence.ts`):**
   - **Follow Proxy Implementation Bytecode:** When `fp.proxyTarget` or `extractImplFromBal(agg.implSlotValue)` yields an implementation address `implAddr`, also look up `lookup.getCodeForAddress(implAddr)`! If the implementation bytecode is available on disk/memory, fingerprint it to extract the underlying interface (`ERC-20`, `DEX Router`, `DEX Pool`, `AA`, `ERC-721`) while preserving `proxyKind` and `proxyTarget`!
   - **Relax `ERC-20` & `DEX` Behavioral Rules in `pass2Behavior`:**
     - If an address emits `TOPIC.transferErc20` (and is not `ERC-721`) or receives calls to `SELECTOR.transfer` / `SELECTOR.transferFrom` / `SELECTOR.approve`, classify it as `'ERC-20'` (`confidence: 'medium'`) regardless of whether `writesPerBlock` is `< 1` or `> 4`!
     - If an address emits `TOPIC.swapV2` or `TOPIC.swapV3`, classify it as `'DEX Pool'` (`confidence: 'medium'`) even if `TOPIC.sync` was not emitted in the same block (Uniswap V3 pools emit `Swap` without `Sync`!).
     - If `pass1` is `undefined` and behavioral rules do not match a specific token/DEX, but `proxyKind !== undefined`, return `{ archetype: proxyOnlyLabel({ proxyKind } as BytecodeFingerprint) ?? 'Proxy', confidence: 'medium', proxyKind, proxyTarget }` instead of falling through to generic `'Contract'`.
   - **Expand `enrichTopContracts` Pool:** Classify up to the top `24` active contracts in `addressAgg` to compute the 64-block `archetypeMix` (while still returning the top `10` for `topContracts`).

2. **Contract Introspection Inline in `STREET ENCOUNTERS` (`src/economy/momentDetector.ts`):**
   - Pass an optional `classifyCode?: (code: Uint8Array) => string | undefined` and `addressArchetypes?: ReadonlyMap<string, string>` into `detectBlockMoments`:
     - **`[NEW]` Contract Births:** When `acct.codeChanges` has `newCode` bytes, run `fingerprintBytecode(newCodeBytes)` right there! If it identifies an archetype (`ERC-20`, `DEX Pool`, `EIP-1167 Proxy`, `EIP-1967 Proxy`, `ERC-721`, etc.), include it in the headline:
       `New 17.1 KB [ERC-20] deployed at 0x19ea…63d5 (2 slot writes)`
     - **`[FLOW]` Multi-Account Choreography:** When `slice.to` has a known archetype or selector name, include it in the headline:
       `Tx #27 orchestrated 19 accounts · execute() on 0x3bFA…19e2 [DEX Router]` (or when `selector` is unknown on a custom contract: `Tx #27 orchestrated 19 accounts via 0xbe22…e054 [Proxy]`).
     - **`[REV]` Reverts:** Include the reverted target contract's archetype badge (`Transaction to 0xbe22…e054 [DEX Router] reverted on-chain`).

3. **Lower-Left Plaza `● CONTRACT PULSE (64B)` Section (`src/tui/components/LiveHeadPlazaUIComponent.ts`):**
   - In `buildLeftColumn(econ, colW)` of `LiveHeadPlazaUIComponent.ts`, right beneath `● NEIGHBORHOOD LIGHTS (0x0..0xf)` (which currently ends around row 11 of the left column, leaving 6–8 blank lines in the lower-left of the Plaza!), render **`● CONTRACT PULSE (64B)`**:
     ```text
     ● CONTRACT PULSE (64B)
     [ERC-20 42%] [DEX 21%] [Proxy 18%] [Custom 19%]
     0xbe22…e054  [EIP-1967]   41w/blk · execute()
     0x7b79…0008  [WETH]       18w/blk · deposit()
     0x1f98…f984  [ERC-20]     12w/blk · transfer()
     ```
   - **Line 1 (Header):** `● CONTRACT PULSE (64B)`
   - **Line 2 (Ecosystem Tag Cloud / Pill Strip):** Up to 4 compact colored `[Archetype XX%]` tags summarizing `econ.archetypeMix` across the 64-block window (fitting within `colW`).
   - **Lines 3–5 (Top 3 Live Venues):** The top 3 contracts from `econ.topContracts`, showing `shortAddress`, `[archetype]` badge, writes-per-block (`41w/blk`), and top decoded call selector (`topSelectors[0]`) if available.

---

### 1.5 Acceptance Criteria

- [x] `formatGwei` formats sub-Gwei base fees with adaptive precision (`0.42 Gwei`, `0.004 Gwei`, `<0.001 Gwei`) and `computeTrend` applies a minimum wei noise floor so `0 Gwei ↑` / `0 Gwei ↓` never appears.
- [x] `EconomySnapshot` computes 64-block statistical aggregates (`windowBlockCount`, `avgGasFullPct`, `windowTxCount`, `windowRevertPct`, `windowPeakTransferEth`, `archetypeMix`) and `economyCockpitPairs` renders the 4 macro rows (`Fee (64b)`, `Throughput`, `Volume`, `Top Venue`).
- [x] `contractIntelligence.ts` resolves proxy implementation bytecode when available, classifies Uniswap V3 `Swap` pools (`DEX Pool`), classifies `Transfer`-emitting tokens (`ERC-20`) without the `1..4` writes/block cliff, and preserves `[EIP-1967 Proxy]` / `[EIP-1167 Proxy]` badges when implementation code is cold.
- [x] `momentDetector.ts` enriches `[NEW]`, `[FLOW]`, and `[REV]` Street Encounters with bytecode/contract archetypes, and `LiveHeadPlazaUIComponent.ts` renders `● CONTRACT PULSE (64B)` (ecosystem tag cloud + top 3 classified venues) in the lower-left column below `● NEIGHBORHOOD LIGHTS`.
- [x] `overviewNarrator.ts` reports `Head following live at #<block>` without confusing background code-crawl % with primary sync completion, and includes contract archetype badges.
- [x] Unit tests in `test/economyDataManager.spec.ts`, `test/contractIntelligence.spec.ts`, `test/momentDetector.spec.ts`, and `test/tui.spec.ts` lock all new behaviors; `npm run tsc`, `npm test`, and `npm run spellcheck` pass with 0 errors.

---

## 2. Concrete Implementation Plan (Planner — Grok 4.7)

**Ethy only.** Decision **D-112**. Order: `format.ts` + trend floor → `types.ts` window fields → `economyDataManager.ts` publish + `cockpitPairs.ts` macro rows → `contractIntelligence.ts` proxy follow + `pass2Behavior` → `momentDetector.ts` + manager callbacks → `LiveHeadPlazaUIComponent.ts` CONTRACT PULSE → `overviewNarrator.ts` → tests + gates.

**Files touched:** `src/economy/format.ts`, `types.ts`, `economyDataManager.ts`, `cockpitPairs.ts`, `src/contracts/contractIntelligence.ts`, `src/economy/momentDetector.ts`, `src/tui/components/LiveHeadPlazaUIComponent.ts`, `src/ai/overviewNarrator.ts`, tests under `test/economyDataManager.spec.ts`, `contractIntelligence.spec.ts`, `momentDetector.spec.ts`, `tui.spec.ts`, `overviewNarrator.spec.ts`.

**Design locks:** TPS stays on 10 blocks; classify pool 24 / leaderboard 10; `macroArchetypeBucket` for plaza pills; optional moment callbacks preserve legacy headlines when omitted; HEAD_FOLLOWING narrator only for sync-complete wording fix.

---

## 3. Implementation Notes & Deviations (Implementer — Composer 2.5)

- Shipped **D-112**: adaptive `formatGwei` / `formatBaseFeeNumber`, trend wei noise floor, 64-block `EconomySnapshot` aggregates + macro cockpit rows, proxy impl fingerprint follow, relaxed ERC-20 / V3 DEX pool rules, Plaza `● CONTRACT PULSE (64B)`, enriched Street Encounters, head-following AI state copy.
- `formatTrendSuffix` uses explicit `(-N%)` on downward trends (matches cockpit macro row spec).
- Gates: `npm run tsc`, **299** tests, `npm run spellcheck` in `@ethereumjs/ethy`.
