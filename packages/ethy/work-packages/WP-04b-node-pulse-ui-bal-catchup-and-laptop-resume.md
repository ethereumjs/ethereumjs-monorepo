# WP-04b: Phase-Adaptive 4-Row `Node Pulse` UI, Post-SNAP `eth/71` BAL Catch-Up & "Close-the-Laptop" Resume

- **Status:** `DONE`
- **Dependencies:** `WP-04a`
- **Branch:** `ethy-wp04-continuation` (or `ethy-wp04b`)
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Holistic Scope & Architectural Requirements

### Goal
Building on the rock-solid single-pivot `snap/1` and VIP peer foundation from `WP-04a`:
1. **Redesign the `Node Pulse` Cockpit Box (`src/tui/cockpit.ts`)** back to a strict, calm **4-row layout** (8 visible box lines including borders and padding, matching `Commands` and `Metrics` 100%) that adapts cleanly to the 4 lifecycle stages (`Connecting P2P` → `Snap Sync` → `BAL Catch-Up` → `Head Following`) with a **continuous cursor-based progress bar (`0%–100%`)** and **single-width characters only** (zero line wrapping, zero cryptic `kept`/`previous` strings).
2. **Implement Post-SNAP `eth/71` BAL Catch-Up (`#P → #Head`):** Once `snap/1` finishes downloading accounts, bytecode, and storage at fixed pivot `#P`, automatically transition to `BAL_CATCHUP`, fetch and apply the `eth/71` Block-Level Access Lists from `#P + 1` to the current network head `#Head` (`consumeBAL`), and enter `HEAD_FOLLOWING`.
3. **Implement "Close-the-Laptop" Sync Resume:** Whether the user closes their laptop lid for 3 hours while Ethy is running in `HEAD_FOLLOWING`, or quits Ethy after base sync is complete and reopens it 2 days later, Ethy automatically detects the gap (`#LastVerifiedState → #CurrentNetworkHead`), switches `Node Pulse` to `BAL Catch-Up`, fast-forwards state via `eth/71` BALs without re-running `snap/1`, and resumes `Head Following`!

---

## 2. The 4-Row Phase-Adaptive `Node Pulse` UI Specification

### Strict Geometry Invariants (`ethy-tui.mdc`)
- **Exactly 4 content rows** inside `Node Pulse` (`COCKPIT_CONTENT_ROWS = 4` → 8 total box lines: top border, 1 blank pad, 4 data rows, 1 blank pad, bottom border). Never 5 rows!
- **Single-width characters only** in progress bars (`█` `U+2588` full block and `░` `U+2591` light shade, 16 chars wide + ` XX%`). Never use `!` or ambiguous-width symbols inside the progress bar.
- **Continuous Cursor Percentage (`computeSnapProgressPct`):**
  - Instead of counting only finished buckets (`0/16` = `0%` for the first 10 minutes!), compute each bucket `i`'s fractional progress from its 32-byte `currentLastHash` relative to `[bucket.startHash .. bucket.limitHash]` (using the top 4 bytes after the bucket nibble prefix).
  - Average across the 16 buckets (weighting Accounts at 85% and Code/Storage completion at 15% of `Snap Sync`) so the user sees smooth `1% → 2% → 3% ... → 100%` progress from the very first downloaded range!

### The 4 Adaptive Views of `Node Pulse`

| Lifecycle Stage | Row 1 (`Stage`) | Row 2 (`Target` / `Pivot` / `Head`) | Row 3 (`Progress`) | Row 4 (`State`) |
| --- | --- | --- | --- | --- |
| **1. `P2P_WARMUP`** | `Connecting P2P` | `Awaiting peer head…` (or `Peers: N RLPx`) | `░░░░░░░░░░░░░░░░   0%` | `Warming peer book` |
| **2a. `SNAP_SYNCING` (Accounts)** | `Snap Sync · Accounts` | `#12,020,039 (+14 blk)` *(shows drift from live head)* | `████████░░░░░░░░  52%` | `3.48M acc · 5,950/s` |
| **2b. `SNAP_SYNCING` (Code/Storage)** | `Snap Sync · Storage` | `#12,020,039 (+42 blk)` | `██████████████░░  91%` | `4.1k code · 82k slots` |
| **3. `BAL_CATCHUP` (Post-SNAP or Laptop Wake)** | `BAL Catch-Up` | `#12,020,039 → +62 blk` | `████████████░░░░  74%` | `46 / 62 BALs applied` |
| **4. `HEAD_FOLLOWING`** | `Head Following` | `#12,020,101 (live)` | `████████████████ 100%` | `34.2M acc · 64 BALs` |

---

## 3. Post-SNAP `BAL Catch-Up` & "Close-the-Laptop" Lifecycle (`src/sync/balSync.ts`, `src/persist/snapStore.ts`)

1. **Persisting `lastVerifiedBlockNumber` & `baseSyncComplete` in `SnapPivotStore`:**
   - Once all 16 account buckets and the code/storage queues finish for `#P`, mark `baseSyncComplete: true` and `lastVerifiedBlockNumber: #P` in `active.json`.
   - Every time a block's BAL (or block bundle) is applied during `BAL_CATCHUP` or `HEAD_FOLLOWING`, update `lastVerifiedBlockNumber` (and persist the applied BAL/account mutations so a restart resumes from `lastVerifiedBlockNumber`).
2. **`BAL_CATCHUP` Engine (`#LastVerified + 1 .. #NetworkHead`):**
   - Triggered automatically when:
     - `Snap Sync` (Accounts + Code/Storage) reaches 100%, **or**
     - Ethy starts up with `baseSyncComplete: true` and `bestPeerHead > lastVerifiedBlockNumber`, **or**
     - Ethy wakes from laptop sleep during `HEAD_FOLLOWING` and sees `bestPeerHead > headBlockNumber + 2n`!
   - Fetches blocks `(lastVerifiedBlockNumber + 1n) .. bestPeerHead` in sequential/pipelined batches, verifies `bal.hash() === header.blockAccessListHash`, applies `await stateManager.consumeBAL(bal.toJSON())`, registers the latest 64 blocks in `RollingBlockStore` (`putServableBlock`), and updates `Node Pulse` (`46 / 62 BALs applied`).
   - Once `lastVerifiedBlockNumber === bestPeerHead`, transitions to `HEAD_FOLLOWING` (`● HEAD` pill turns ready, `NoticeBoard` posts `Synced to head #...`) and follows new 12-second slots one by one!

---

## 4. Acceptance Criteria
- [x] `Node Pulse` is strictly 4 content rows (8 total lines) across all phases, uses only `█` and `░` in its 16-cell progress bar, and displays continuous cursor-based `0%–100%` progress during `Snap Sync`.
- [x] Completing `Snap Sync` automatically transitions to `BAL Catch-Up` (`#P → #Head`), applies intermediate `eth/71` BALs via `consumeBAL`, and transitions to `Head Following`.
- [x] Simulating a laptop sleep / restart after base sync completion (`lastVerifiedBlockNumber = #100`, peer head = `#125`) triggers `BAL Catch-Up` for the 25 missed blocks without re-running `snap/1`, and lands in `Head Following` at `#125` with `FlatStateManager` matching `MerkleStateManager`.
- [x] `npm run tsc`, `npm test`, and `npm run spellcheck` pass with 0 errors.

---

## 5. Concrete Implementation Plan (Planner — Grok 4.7)

### Design refinements (Decision D-065)

Extends **D-063**. Builds on **WP-04a** (`handoffCatchup`, `markBaseSyncComplete`, unused `HeadBlockFollower`).

- Add spine phase **`BAL_CATCHUP`** between `SNAP_SYNCING` and `HEAD_FOLLOWING`. **`deriveCapabilities`:** snap `ready`, head `partial` (`Catch-up`); head pill `ready` only in `HEAD_FOLLOWING`.
- **Node Pulse:** exactly four rows — `Stage`, `Target`, `Progress`, `State`. One **16-cell** bar (`█` / `░` only) + percent. No `pivotCarry` (`kept` / `previous`), no heal fraction in pulse. Snap domain deep view may keep bucket glyphs; pulse bar does not use `!` or `▒`.
- **`computeSnapProgressPct`:** per-bucket fraction from bytes 1–4 of `currentLastHash` vs `[startHash, limitHash]` (byte 0 = nibble); `done` → 1.0; average 16 buckets. While any bucket unfinished: `0.85 * accountFraction`. After all buckets `done`: `0.85 + 0.15 * codeStorageFraction` (mean of code + storage queue completion; 1 when queue empty).
- **Reuse `HeadBlockFollower`** for catch-up and live follow: walk `#lastVerified + 1 .. bestPeerHead` via existing bundle pipeline (`advanceBlockBundleEthMessage`, `finalizeBlockBundle`, `consumeBAL`, `putServableBlock`). No snap schedulers; no pivot root switch.
- **Laptop wake:** telemetry only — in `HEAD_FOLLOWING`, if `bestPeerHead > headBlockNumber + 2n`, set `BAL_CATCHUP` and walk BALs.
- **`active.json`:** `lastVerifiedBlockNumber` (string). Set at `markBaseSyncComplete(pivot)`; update on each applied block. Schema stays **2**.

### File tree (implementation order)

| Slice | Files |
| --- | --- |
| A — Pulse geometry | `src/spine/types.ts`, `src/spine/buckets.ts`, `src/tui/cockpit.ts`, `src/spine/createSpine.ts`, `test/tui.spec.ts`, `src/demo/advanceDemo.ts` |
| B — Persist last verified | `src/persist/snapStore.ts`, `src/sync/resumePolicy.ts` |
| C — BAL catch-up + wake | `src/sync/balSync.ts`, `src/net/peerCoordinator.ts` |
| D — Offline oracle | `test/balCatchUp.spec.ts` (new) |

### Slice A — Pulse geometry

1. **`types.ts`:** `EthyPhase` += `BAL_CATCHUP`. Add `balCatchUp?: { fromBlock: bigint; applied: number; total: number }`, `lastVerifiedBlockNumber?: bigint`, `bestPeerHead?: bigint`.
2. **`buckets.ts`:** `bucketCursorFraction(bucket)`, `computeSnapProgressPct(spine)`, `formatProgressBar(pct)` → `"████████░░░░░░░░  52%"` (16 cells + space + 3-char percent).
3. **`cockpit.ts`:** `COCKPIT_CONTENT_ROWS = 4`. Replace `nodePulsePairs` (drop 5-row Phase/Pivot/Accounts/Bytecode/Storage layout):
   - **BOOTING / P2P_WARMUP:** stage `Connecting P2P`; target `Awaiting peer head…` or `Peers: N RLPx`; progress `0%`; state `Warming peer book`.
   - **SNAP_SYNCING (accounts):** `Snap Sync · Accounts`; `#P (+N blk)` using `bestPeerHead - pivot`; `formatProgressBar(computeSnapProgressPct)`; `{totalAccounts} acc · {rate}/s`.
   - **SNAP_SYNCING (storage):** when all buckets `done`, stage `Snap Sync · Storage`; same target row; state `{codesSynced} code · {storageSlotsSynced} slots`.
   - **BAL_CATCHUP:** `BAL Catch-Up`; `#from → +remaining blk`; bar from `applied/total`; `{applied} / {total} BALs applied`.
   - **HEAD_FOLLOWING:** `Head Following`; `#head (live)`; bar `100%`; `{accounts} acc · {balWindow.length} BALs`.
4. **`createSpine.ts`:** `case 'BAL_CATCHUP'` — p2p ready, snap ready, head partial.
5. **Tests/demo:** remove `Healing 120/959` expectation in `tui.spec.ts`; `advanceDemo` inserts `BAL_CATCHUP` before `HEAD_FOLLOWING`.

### Slice B — Persist last verified

1. **`snapStore.ts`:** extend `ActiveMeta` with `lastVerifiedBlockNumber?: string`.
2. **`markBaseSyncComplete(pivotBlock: bigint)`** — set `baseSyncComplete: true` and `lastVerifiedBlockNumber = pivotBlock.toString()`.
3. **`noteVerifiedBlock(n: bigint)`** — update `active.json` (atomic write).
4. **`peekActive()`** — return `lastVerifiedBlockNumber` as bigint (default pivot when `baseSyncComplete` and field missing).
5. **`resumePolicy.ts`:** extend `SnapResumeSaved` with `lastVerifiedBlockNumber`; handoff path unchanged (`handoff-catchup`).

### Slice C — BAL catch-up and wake

1. **`balSync.ts`:**
   - Rename/replace **`tryEnterHeadFollowing`** → **`tryEnterBalCatchUp(spine, accountSync, codeSync, bestPeerHead)`**: when buckets + code/storage done and phase `SNAP_SYNCING`, set `lastVerifiedBlockNumber = pivot`, initialize `balCatchUp` (`fromBlock = pivot+1`, `total = max(0, bestHead - pivot)`, `applied = 0`). If `total === 0`, jump to `HEAD_FOLLOWING`; else `BAL_CATCHUP`.
   - **`HeadBlockFollower`:** tick when phase is `BAL_CATCHUP` or `HEAD_FOLLOWING`. Cursor = `lastVerifiedBlockNumber + 1` (not only `headBlockNumber + 1` during catch-up). On `finalizeBlockBundle`: update `lastVerifiedBlockNumber`, `headBlockNumber`/`headStateRoot`, call `noteVerifiedBlock`, increment `balCatchUp.applied`; when `lastVerified >= targetHead`, `setPhase(HEAD_FOLLOWING)`, clear `balCatchUp`, optional notice callback.
   - Bundle **`failed`:** clear in-flight only; retry same block number next tick.
   - Export **`LAPTOP_WAKE_BLOCK_GAP = 2n`** for coordinator.
2. **`peerCoordinator.ts`:**
   - **`handoffCatchup`:** after `loadInto`, read `lastVerified` + `bestHead`; if gap > 0 → `BAL_CATCHUP` + start follower; else `HEAD_FOLLOWING`. Do not `ensureSnapSync`.
   - **`maybeMarkBaseSyncComplete`:** call `markBaseSyncComplete(pivotBlock)` then `tryEnterBalCatchUp` with current best head; start follower when entering catch-up/follow.
   - **Always construct and `headFollower.start()`** once snap pivot exists (or on handoff); wire `noteVerifiedBlock` + notice on sync complete.
   - **Telemetry:** set `spine.bestPeerHead` from `pickBestPeer`; if `HEAD_FOLLOWING` and `bestPeerHead > headBlockNumber + 2n`, transition to `BAL_CATCHUP` and re-seed `balCatchUp`.

### Slice D — Offline oracle (`test/balCatchUp.spec.ts`)

- **`computeSnapProgressPct`:** cursor advance within one bucket increases pct; stays ≤ 85 until all buckets `done`.
- **`renderCockpit`:** 8 lines per pulse box; progress row has `%` and `█`/`░`; no `!`, `kept`, `previous`.
- **25-block catch-up (#100 → #125):** synthetic headers + BALs with matching `blockAccessListHash`; `FlatStateManager` vs `MerkleStateManager` field parity after `consumeBAL`.
- **Restart:** `noteVerifiedBlock(110)`, peer head 125 → catch-up from 111 (no new snap pivot).

### Out of scope

- WP-05 / WP-06 (LLM, EVM sandbox, beacon).
- Re-snap or pivot heal after `baseSyncComplete`.
- New dependencies.

### Finish gates

- `npm run tsc`, `npm test`, `npm run spellcheck` in `packages/ethy`.
- Update §4 checkboxes, §6 notes, `PROGRESS.md` on implement pass.
- Extend PR **#4425** title/body when shipping on `ethy-wp04-continuation`.

---

## 6. Implementation Notes & Deviations (Implementer — Composer 2.5)

- **`BAL_CATCHUP`** phase + head pill `Catch-up`; `HeadBlockFollower` ticks in catch-up and follow; laptop wake via `LAPTOP_WAKE_BLOCK_GAP` (2 blocks).
- **`active.json`** `lastVerifiedBlockNumber`; handoff and post-base-sync enter catch-up without restarting snap schedulers.
- **`test/balCatchUp.spec.ts`** covers progress bar, 25× `applyBlockBal` flat/merkle parity, and resume from `#110`.
- **`tryEnterHeadFollowing`** kept as thin alias for existing tests calling zero-gap transition.
