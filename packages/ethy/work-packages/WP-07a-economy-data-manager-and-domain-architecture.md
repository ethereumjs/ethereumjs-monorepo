# WP-07a: `ETHEconomyDataManager`, Structured Domain Data Managers & Live Economic / Transactional Telemetry

- **Status:** `DONE`
- **Dependencies:** `WP-04k` (`DONE`), `WP-06f` (`DONE`)
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Holistic Scope & Architectural Requirements

### Goal
Transform Ethy from a pure sync/state node into a **live Ethereum economic and network intelligence lens** by introducing:
1. **`ETHEconomyDataManager` (`src/economy/economyDataManager.ts`)** — continuously ingests block headers, bodies (transactions), receipts, and EIP-7928 Block Access Lists (`BALs`) as they arrive during `SNAP_SYNCING` (parallel BAL stream), `BAL_CATCHUP`, and `HEAD_FOLLOWING`, maintaining a bounded rolling history (`64–128` blocks) of Ethereum's real-time economic activity.
2. **Structured Domain Data Managers (`src/domains/`)** — clean, permission-typed (`read` vs `write`) facade managers for `NodePulse`, `P2P`, `Snap`, `Head`, and `Economy` so both the **2-Column TUI** (`WP-07b`) and the **Local LLM `IntentEngine` & Pulse** (`WP-07c`) consume identical, hallucinations-proof structured snapshots.
3. **`/economy` (`e`) Slash Tool & Deep View** — lets the user inspect the live Ethereum economy (gas prices, ETH volume, hottest contracts, storage/state churn) at any time.

---

## 2. What Makes an Exciting & Genuinely Useful "Ethereum Economy" Dataset?

Why is a user running an Ethereum node curious about the chain right now? Because raw block numbers (`#12,096,957`) don't tell you **what is happening on Ethereum**.

Fortunately, Ethy *already* downloads the complete 4-part block bundle (`headerRlp`, `bodyRlp`, `receiptsEth69Rlp`, and `balRlp`) in `finalizeBlockBundle` (`src/sync/blockBundle.ts`)! By decoding those four artifacts once when a block bundle lands, `ETHEconomyDataManager` can extract four rich dimensions of live network activity with **zero EVM execution**:

### Dimension 1: Fee Market & Block Space Demand (from `headerRlp`)
- **`baseFeePerGasGwei` & Trend (`↑` / `↓` / `→`):** Current EIP-1559 base fee in Gwei (`header.baseFeePerGas`), plus 15-block moving average and direction indicator (`e.g. 2.4 Gwei ↑ +12%`).
- **`gasTargetPct` (Block Fullness):** `Number(header.gasUsed * 100n / header.gasLimit)` (`e.g. 54% full`) and EIP-4844 `blobGasUsed` when present.

### Dimension 2: Transactional Velocity & ETH Value Flow (from `bodyRlp` + `receiptsEth69Rlp`)
- **`txCount` & `tps`:** Transactions in the latest block (`txs.length`) and rolling 10-block transactions per second (`txs / 12s`).
- **`ethTransferred` (ETH Volume):** Sum of `tx.value` across all transactions in the block (and rolling 64-block window), formatted in `ETH` (`e.g. 142.8 ETH/blk`).
- **`txTypeSplit`:** Breakdown of Type-2 (EIP-1559), Type-3 (EIP-4844 Blob), and Type-4 (EIP-7702 SetCode) transactions.

### Dimension 3: State & Contract Activity Heatmap (from `balRlp` — Ethy's Unique Superpower!)
Because Ethy verifies EIP-7928 Block Access Lists (`BALs`), we can see **every account and storage slot touched inside internal calls** without running an EVM trace!
- **`activeAccounts` & `storageWrites` / `storageReads`:** Total unique accounts touched, storage slots mutated (`storageChanges`), and slots read (`storageReads`) per block.
- **`topContracts` (Rolling 64-Block Leaderboard):**
  - Tracks a bounded frequency map of addresses in `balJson` that have `storageChanges.length > 0 || storageReads.length > 0` (or `codeHash !== KECCAK256_NULL` in `FlatStateManager`).
  - Ranks the **Top 10 Most Active Contracts** over the rolling window by:
    1. `blocksActive` (appeared in `N` of the last 64 blocks)
    2. `storageSlotTouches` (`writes + reads`)
    3. `netEthDeltaWei` (net balance change across the window — spotting DEX pools, bridges, or fee burn/collectors!)
- **`newDeployments`:** Count of accounts with `codeChanges.length > 0` in the rolling window (new contracts deployed or EIP-7702 delegations updated!).

---

## 3. Permission-Structured Domain Data Managers (`src/domains/`)

To prepare cleanly for the Local LLM (`WP-07c`) and the new TUI (`WP-07b`), we formalize access to Ethy's state into **Read-Only Snapshots (`DomainReadAccess`)** vs **Explicit Guarded Actions (`DomainWriteAccess`)**:

```ts
export type DomainPermission = 'read' | 'write'

/** Read-only snapshot consumed by the 30-60s LLM Pulse, <ethy_state>, and TUI Cockpit. */
export interface EthyDomainSnapshots {
  pulse: NodePulseSnapshot       // Stage, target, progressPct, etaMin, health status
  economy: EconomySnapshot       // BaseFee + trend, TPS, ETH volume, top active contracts, BAL churn
  p2p: P2pDomainSnapshot         // Connected/snap/ethy peers, client split, avg RTT, serving stats
  snap: SnapDomainSnapshot       // Buckets 0x0..0xf, account/code/storage totals, rates
  head: HeadDomainSnapshot       // Head/pivot blocks, CL witness status, BAL window summary
}
```
- **Strict Read-Only Guarantee for Background AI Pulse:** The periodic AI Overview generator (`WP-07b`/`WP-07c`) receives **only** `Readonly<EthyDomainSnapshots>` + `SystemUsageGuide` (how to use Ethy's slash commands and keyboard shortcuts). It has **zero** access to write/action handles (`dropPeer`, `pauseSnapSync`, `reassignBucket`).
- **Guarded Write Actions for User-Initiated Tool Calls:** Mutating tools (`dropPeer`, `reassignBucket`, `pauseSnapSync`, `resumeSnapSync`) are tagged `permission: 'write'` in the tool registry and can only be invoked by an explicit user command/prompt, never by a background pulse.

---

## 4. Upper-Middle `Economy` Cockpit Box (`cockpit.ts` Preview for `WP-07b`)

`ETHEconomyDataManager.cockpitPairs()` returns the 4 two-column rows for the new **`Economy`** box in the top cockpit row:
- **Before first block bundle / BAL arrives (`BOOTING` / early `P2P_WARMUP`):**
  - `Status`: `Awaiting first block…`
  - `Gas / Base`: `—`
  - `Activity`: `—`
  - `Contracts`: `—`
- **As soon as blocks/BALs stream in (during `SNAP_SYNCING` AND `HEAD_FOLLOWING`!):**
  - `Gas / Base`: `2.4 Gwei ↑ · 54% full`
  - `Activity`: `118 txs (9.8/s) · 42.1 ETH`
  - `State / BAL`: `94 acc · 186 writes · 2 new`
  - `Hot Contract`: `0x7a25…488d (38 slots/blk)`

And running **`/economy`** (or pressing `e` / asking about network activity) opens the **Economy Deep View** in the Interaction View (`WP-07b`), displaying the **Top Active Contracts Leaderboard** table (`Contract | Blocks (64w) | S-Writes | S-Reads | Net ETH Δ`) + recent block fee/volume table!

---

## 5. Acceptance Criteria (`WP-07a`)

- [x] `ETHEconomyDataManager` (`src/economy/economyDataManager.ts`) decodes `headerRlp`, `bodyRlp`, `receiptsEth69Rlp`, and `balJson` on every verified block bundle (both during `SNAP_SYNCING` parallel BAL streaming and `HEAD_FOLLOWING`) and maintains a bounded 64-block rolling window + Top Contracts leaderboard in `O(1)` memory.
- [x] `src/domains/domainManagers.ts` exposes `EthyDomainSnapshots` (`read`-only) and separates `permission: 'read' | 'write'` tool descriptors.
- [x] `/economy` slash tool (`src/tools/economyTools.ts`) and `/e` slash autocomplete are wired into `DeterministicIntentEngine` and return structured table data for the Interaction View.
- [x] Unit tests (`test/economyDataManager.spec.ts`) verify fee trend calculation, ETH transfer volume aggregation, BAL hot-contract ranking, and read/write permission boundaries.
- [x] `npm run tsc`, `npm test`, and `npm run spellcheck` pass in `@ethereumjs/ethy`.

---

## 6. Concrete Implementation Plan (Planner — Grok 4.7)

See attached plan (2026-11-09): **D-097** rolling 64-block economy lens on `finalizeBlockBundle` / ETHY BAL tail; BAL-only contract leaderboard (no `FlatStateManager` cold lookup); `readDomainSnapshots` + `SLASH_TOOL_REGISTRY`; `/economy` deep view with `preface` / `secondaryTable` widget fields; runtime dep `@ethereumjs/tx` for body decode. Cockpit spatial layout unchanged (WP-07b).

---

## 7. Implementation Notes & Deviations (Implementer — Composer 2.5)

- **Ingest wiring:** single `ETHEconomyDataManager` on `EthyNode`, passed into `startPeerCoordinator`, `BalChainStreamer`, `EthySwarmSynchronizer`, and `finalizeBlockBundle` (`economy` optional hook).
- **Deferred snap BAL:** economy ingest still runs when `deferStateApply` is true (header/body/receipts + `balRlp` verify); state apply unchanged.
- **ETHY tail:** `noteBundle` without body sets `hasTxBody: false` so cockpit Activity stays `—` until a full bundle is tip.
- **Widget:** extended `WidgetSpec` `table` with `preface` and `secondaryTable`; rendered in `widgets.ts`.
- **Gates (2026-11-09):** `npm run tsc`, `npm test` (221), `npm run spellcheck:ts` green in `@ethereumjs/ethy`.
