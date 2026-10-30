# WP-04b: Phase-Adaptive 4-Row `Node Pulse` UI, Post-SNAP `eth/71` BAL Catch-Up & "Close-the-Laptop" Resume

- **Status:** `READY_FOR_PLANNING`
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
- [ ] `Node Pulse` is strictly 4 content rows (8 total lines) across all phases, uses only `█` and `░` in its 16-cell progress bar, and displays continuous cursor-based `0%–100%` progress during `Snap Sync`.
- [ ] Completing `Snap Sync` automatically transitions to `BAL Catch-Up` (`#P → #Head`), applies intermediate `eth/71` BALs via `consumeBAL`, and transitions to `Head Following`.
- [ ] Simulating a laptop sleep / restart after base sync completion (`lastVerifiedBlockNumber = #100`, peer head = `#125`) triggers `BAL Catch-Up` for the 25 missed blocks without re-running `snap/1`, and lands in `Head Following` at `#125` with `FlatStateManager` matching `MerkleStateManager`.
- [ ] `npm run tsc`, `npm test`, and `npm run spellcheck` pass with 0 errors.

---

## 5. Concrete Implementation Plan (Planner — Grok 4.7)

*(To be filled out by Grok 4.7 during the Planning pass.)*

---

## 6. Implementation Notes & Deviations (Implementer — Composer 2.5)

*(To be filled out by Composer 2.5 after implementation and verification.)*
