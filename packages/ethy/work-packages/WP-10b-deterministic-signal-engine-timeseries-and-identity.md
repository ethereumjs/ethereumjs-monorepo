# WP-10b: Layer 1 Deterministic Ethereum Signal Engine — Multi-Horizon Time Series, EIP-7702/L2-Blob/BAL-Slot Analytics, Anomaly Detection & Local Identity Resolution (`name()` / ENS)

- **Status:** `DONE`
- **Series:** `WP-10` — Next-Generation LLM Integration, Capabilities & Model Strategy
  - **`WP-10a`:** Modular AI runtime modes (`default` / `off` / `local`), first-open TUI onboarding, full-width `No AI` cockpit, `<dataDir>/config.json`, and `Ollama`/loopback auto-discovery.
  - **`WP-10b` (this package — Layer 1):** Deterministic on-chain data analysis, multi-horizon time series, zero-EVM anomaly detection (`SignalCandidate[]`), and trustless local identity resolution (`name()`/`symbol()` + ENS reverse lookup) — valuable standalone in `No AI` mode and serving as the grounded foundation for Layer 2 (`WP-10c`).
  - **`WP-10c` (Layer 2):** Autonomous Chain-Detective LLM replacing the 3-domain split, bounded read-only Investigation Toolbelt, AI Dispatch Feed UI, self-history journal, and opt-in prompt-history sharing.
  - **`WP-10d` (follow-up):** Default model benchmarking against `WP-10b`/`WP-10c` fixtures, optional QLoRA post-training, and embedded model runner.
- **Dependencies:** `WP-07d`, `WP-07h`, `WP-07i`, `WP-08a`, `WP-08b` (`DONE`)
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Holistic Scope & Architectural Requirements (Coordinator — Gemini 4 Carbon)

### 1.1 Architectural Motivation: Illuminating the On-Chain Black Box Deterministically First

Ethereum's live network and economic activity is largely a black box to node operators. Before asking a small local LLM to spot *"what is interesting, important, or unusual right now"*, Layer 1 must extract the rich deterministic signals that **already arrive in every verified block bundle** (headers, transactions, receipts, and EIP-7928 BALs) and compare them against a **multi-hour rolling baseline**.

Doing this systematically in TypeScript accomplishes two goals at once:
1. **Immediate Standalone Value (Including `No AI` Mode):** Upgrades `/live` Plaza, `/economy`, `/contract`, and a new `/signals` view with human-readable contract/ENS names, L2 blob economics, EIP-7702 delegation telemetry, and mathematically grounded anomaly alerts.
2. **High-Leverage Grounding for Layer 2 (`WP-10c`):** Prevents small local LLMs from burning context on raw transactions or hallucinating arithmetic, giving them compact, ranked `SignalCandidate` leads to investigate on demand.

### 1.2 Signal Gaps in the Current Pipeline (`decodeBundle.ts` & `ETHEconomyDataManager`)

Auditing `src/economy/decodeBundle.ts` and `src/economy/economyDataManager.ts` reveals five high-value signals already present in our wire data that are currently discarded or collapsed:

| Raw Data Already Available | Currently Extracted | Missing High-Signal Extraction (`WP-10b`) |
| --- | --- | --- |
| **Header (`headerRlp`)** | `baseFeePerGas`, `gasFullPct`, `blobGasUsed` | `excessBlobGas` → exact **EIP-4844 blob base fee** (`header.getBlobGasPrice()`) + block gas burned |
| **Transactions (`bodyRlp`)** | `txCount`, `txTypeSplit`, `value`, `to`, 4-byte `selector` | **EIP-7702 `authorizationList` delegate targets** (who EOAs are delegating to!), **EIP-4844 blob count & L2 batch inbox `to`**, **priority tips (`maxPriorityFeePerGas`)**, **repeat-sender bursts** |
| **Receipts (`receiptsEth69Rlp`)** | Total `success`/`reverts`, `firstRevertTo`, capped `logs` | **Per-tx `gasUsed`** (via `cumulativeGasUsed` delta → true top gas-burning contracts!), **per-contract revert counts & rates**, **NFT (`ERC-721`/`ERC-1155`) transfer & marketplace event counts** |
| **EIP-7928 BAL (`balJson`)** | Per-account total write/read counts, `codeChanges` | **Hot storage-slot value series** (`(address, slot) → postValues[]` across blocks: monotonic climb vs oscillating vs step-jump!), **per-account net ETH flow**, **exact `0xef0100<delegate>` EIP-7702 code writes** |
| **Time Horizon** | `64` blocks (~13 min) only | **Macro baseline ring** (`96` × 8-block rollups ≈ **2.5 hours**, `< 200 KB` RAM) + EMA/mean/stddev baselines so *"unusual"* has real statistical grounding |

---

### 1.3 Detailed Design Specifications

#### Part A: Enriched Block Bundle Extraction (`src/economy/decodeBundle.ts`, `src/economy/types.ts`)

Extend `BlockEconomyRecord` (pure, zero-EVM, never throws) with bounded per-block telemetry:

1. **Blob & L2 Settlement Telemetry:**
   - Compute `blobBaseFeeWei?: bigint` from the decoded `BlockHeader` (`header.getBlobGasPrice()` when `excessBlobGas !== undefined`).
   - For every Type-3 (`BlobEIP4844`) transaction, record `{ to, blobCount, blobGasUsed, maxFeePerBlobGas }` (capped at `32` blob txs/block) and aggregate `totalBlobCount` and estimated `blobFeeBurnedWei = blobGasUsed * blobBaseFeeWei`.
2. **EIP-7702 Delegation Targets:**
   - For every Type-4 (`EOACodeEIP7702`) transaction, extract delegate target addresses from `tx.authorizationList` (`auth[1]` / 20-byte target address), plus scan BAL `codeChanges` for `0xef0100<20-byte-target>` (delegation activation) and empty `0x` on previously delegated EOAs (revocation).
   - Emit per-block `delegationTargets: Array<{ target: string; count: number; revocations: number }>`.
3. **Per-Tx Gas Used, Priority Tips & Per-Contract Reverts:**
   - Walk receipt `cumulativeGasUsed` (`txGasUsed[i] = cumGas[i] - (i > 0 ? cumGas[i-1] : 0n)`) to compute exact per-contract `gasUsedByContract` and `revertsByContract` (capped at top `32` contracts per block).
   - Compute block `medianPriorityTipWei` / `p90PriorityTipWei` (effective tip = `min(maxPriorityFeePerGas, maxFeePerGas - baseFee)`) to distinguish true fee-market bidding pressure from quiet blocks.
   - Note on congestion & nonces: on-chain mined blocks never contain duplicate nonces for one sender, so capture real on-chain congestion proxies: **consecutive high-fullness blocks (`>= 90%`)**, **priority tip spikes**, **per-contract revert storms**, and **multi-tx same-sender bursts** (`txsFromSameSender >= 3` via BAL `nonceChanges` length per EOA).
4. **BAL Storage-Slot Value Series (`SlotTrendTracker`):**
   - For hot storage slots written in the block (bounded to top `64` active `(address, slot)` pairs in the rolling window so RAM stays tiny), record `(blockNumber, postValueUint256)`.
   - Classify each tracked slot deterministically over its recent observations:
     - `'monotonic_up'` (strictly non-decreasing with `>= 3` increases — e.g. mint counters, TVL/deposit accumulators, queue indices),
     - `'monotonic_down'` (draining reserve / countdown),
     - `'oscillating'` (alternating up/down — e.g. AMM pool reserves or price oracles),
     - `'step_jump'` (sudden `>= 2x` magnitude jump on a previously steady slot).

#### Part B: Multi-Horizon Rolling Time Series & Anomaly Detector (`src/economy/timeSeries.ts`, `src/economy/signalDetector.ts`)

1. **Two-Horizon Memory Model (`< 250 KB` RAM, `< 0.5 ms` per block):**
   - **High-Res Ring (`64` blocks ≈ 13 min):** Existing `ETHEconomyDataManager` ring enriched with Part A fields.
   - **Macro Rollup Ring (`96` buckets × `8` blocks = `768` blocks ≈ 2.56 hours):**
     - Each rollup bucket stores compact numeric summaries (`fromBlock`, `toBlock`, `avgBaseFeeWei`, `avgBlobBaseFeeWei`, `avgPriorityTipWei`, `avgGasFullPct`, `txCount`, `revertCount`, `blobCount`, `setCodeCount`, `deployments`, `ethVolumeWei`, `topContractGas: Array<[addr, gas]>`).
     - Maintains lightweight rolling mean & variance (or median/MAD for robustness against single-block outliers) across the macro ring.
2. **Deterministic Anomaly & Shift Engine (`detectEconomySignals` → `SignalCandidate[]`):**
   - Pure function producing up to `8` ranked, deduplicated `SignalCandidate` objects (`noveltyScore: 0..100`, `severity: 'calm' | 'notable' | 'surge'`, `kind`, `headline`, `address?`, `secondaryAddress?`, `metrics: Record<string, string | number>`, `windowBlocks: number`):
     1. **`delegation_surge`:** Unusual cluster of EIP-7702 delegations targeting one delegate address (`>= 3` in 16 blocks or `>= 3x` macro baseline), attaching proxy/target chain info when known.
     2. **`contract_surge`:** A contract's gas share, storage writes, tx count, or ETH flow spikes `>= 3x` over its macro baseline (or a newly active venue jumps straight into Top 3), tagging NFT/ERC-721, DEX, ERC-20, or Proxy archetype.
     3. **`l2_blob_pressure`:** Blob base fee rising across `>= 4` consecutive blocks or `>= 2.5x` macro baseline, identifying which L2 batch inbox(es) account for the largest blob share & ETH spend.
     4. **`congestion_pressure`:** Sustained gas saturation (`>= 88%` across `>= 4` blocks), priority tip spike (`>= 2.5x` baseline), or elevated revert rate (`>= 15%` network-wide or `>= 35%` on a hot contract with `>= 5` txs).
     5. **`slot_trend`:** A tracked BAL storage slot climbing monotonically (`>= 5` consecutive increases) or jumping sharply (`>= 2x`), pointing to the owning contract and slot key.
     6. **`deployment_or_upgrade`:** Notable new contract birth (`>= 8 KB` or immediately active in `>= 2` blocks) or EIP-1967 proxy `Upgraded` event.
     7. **`whale_or_flow`:** Outlier single ETH transfer or cumulative net ETH flow into/out of a contract or EOA over the high-res window.
     8. **`sender_burst`:** Same EOA firing `>= 5` sequential transactions within a short span (bot, liquidator, or spam burst).
   - Expose `signals?: SignalCandidate[]` and `l2RollupStats?: L2RollupWindowStat[]` on `EconomySnapshot` so both TUI views and `WP-10c`'s LLM consume the exact same source of truth!

#### Part C: Trustless Local Identity Resolution (`src/contracts/identityResolver.ts`, `src/contracts/knownContracts.ts`)

Give human-readable names to on-chain addresses **100% locally via our existing EVM sandbox (`FlatStateManager` + `sandbox.runEthCall`), with zero external APIs or privacy leaks**:

1. **Curated Protocol & L2 Inbox Hints (`knownContracts.ts`):**
   - Expand the compact static table on Mainnet (`1n`) and Sepolia (`11155111n`) with well-known **L2 batch inboxes** (Base, Arbitrum, Optimism, Scroll, Linea, zkSync, Taiko, Starknet), **ENS Registry (`0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e`)**, and core infrastructure contracts (Seaport, Uniswap Universal Router, Permit2, Safe Singleton Factory).
2. **Local On-Chain Contract Metadata (`name()` / `symbol()` / `decimals()`):**
   - When `spine.phase === 'HEAD_FOLLOWING'` and a hot contract has no cached identity yet, enqueue a **rate-limited, low-priority** read-only local `eth_call` (`gasLimit = 80_000n` per call, max `2` lookups per block, LRU cache of `512` addresses) for:
     - `0x06fdde03` (`name()`)
     - `0x95d89b41` (`symbol()`)
   - Decode standard ABI `string` **and** legacy `bytes32` return values (like MKR/SAI!), sanitize to printable ASCII (`<= 32` chars), and cache both hits and misses (negative TTL = `256` blocks) so we never re-probe unresponsive contracts!
3. **Local Trustless ENS Reverse Resolution (`address → name.eth`):**
   - On chains with an ENS Registry (`Mainnet` & `Sepolia`), perform standard **ENS reverse lookup + forward verification** completely locally against synced state:
     1. Compute `reverseNode = namehash("<lowercase-addr-no-0x>.addr.reverse")` (pure `ethyKeccak256`).
     2. `eth_call` `ENSRegistry.resolver(reverseNode)` (`0x0178b8bf`) → if zero address, cache miss.
     3. `eth_call` `Resolver.name(reverseNode)` (`0x691f3431`) → decode UTF-8 name; if it reverts (including EIP-3668 `OffchainLookup` / CCIP-Read), gracefully cache miss without making any network request!
     4. **Forward verification (anti-spoofing):** compute `forwardNode = namehash(name)` → `ENSRegistry.resolver(forwardNode)` → `Resolver.addr(forwardNode)` (`0x3b3b57de`) and accept `name` **only if** the returned address matches `address` case-insensitively!
   - Display priority across Plaza, `/economy`, `/contract`, `/signals`, and `WP-10c` LLM digests: `ensName ?? tokenNameAndSymbol ?? knownName ?? shortAddress`.

#### Part D: Standalone TUI & Slash Tool Visibility (`/signals`, Plaza & `/economy` Upgrades)

- Add **`/signals`** (alias **`/si`**) slash tool displaying the live ranked `SignalCandidate[]` table (`Severity`, `Kind`, `Headline`, `Target / Name`, `Window`) plus a `Ctrl+D` debug page showing the Macro Rollup Baseline stats (current vs 2.5h baseline for base fee, blob base fee, gas fullness, revert %, 7702 count, L2 blob spend).
- Wire resolved local identities (`ensName` / `tokenName` / `L2 inbox name`) into `TopContractRow.knownName` / `displayName`, `/economy`, `/contract`, and `/live` Plaza (`CONTRACT PULSE` & `Street Encounters`).

---

### 1.4 Resource & Thermal Guardrails

- **Zero extra P2P bandwidth:** All Part A & Part B signals derive exclusively from blocks already fetched by `BalChainStreamer`.
- **Bounded CPU & RAM:**
  - Macro Rollup Ring (`96` buckets) + `SlotTrendTracker` (`64` slots) + `IdentityResolver` LRU (`512` entries) stay strictly under **`< 1 MB` RAM**.
  - Local `eth_call` identity probes run asynchronously off the sync hot path, capped at **max `2` addresses per block (`<= 6 ms` per 12s slot)** and strictly `80,000` gas per call.
- **Zero new runtime dependencies.**

---

### 1.5 Acceptance Criteria (`WP-10b`)

- [x] **Zero new runtime dependencies** added to `packages/ethy/package.json`.
- [x] **Enriched Bundle Extraction:** `decodeBundle` extracts `blobBaseFeeWei`, per-L2-inbox blob counts/costs, EIP-7702 `authorizationList` & BAL `0xef0100` delegate targets, per-tx `gasUsed`, priority tips, per-contract revert counts, and BAL storage-slot value series without throwing on malformed blocks.
- [x] **Multi-Horizon Time Series & Anomaly Engine:** `MacroRollupRing` (`96` × 8-block rollups) + `detectEconomySignals` deterministically detects and ranks `delegation_surge`, `contract_surge`, `l2_blob_pressure`, `congestion_pressure`, `slot_trend`, `deployment_or_upgrade`, `whale_or_flow`, and `sender_burst` in pure offline unit tests.
- [x] **Local Identity Resolver (`name()` / `symbol()` / ENS Reverse):** `IdentityResolver` + `ensNameHash`; live probes via `runEthCall` on `HEAD_FOLLOWING` with LRU/negative TTL; unit tests for namehash and known-contract hints (full sandbox ENS fixtures follow in hardening).
- [x] **`/signals` Tool & UI Integration:** `/signals` / `/si` renders ranked live signals + `Ctrl+D` macro baseline secondary table; economy blob base fee preface; identity names on leaderboard rows when cached.
- [x] All quality gates pass: `npm run tsc`, **344** tests, spellcheck in `@ethereumjs/ethy`.

---

## 2. Concrete Implementation Plan (Planner — Grok 4.7)

1. **Part A — Types + `decodeBundle`:** extend `BlockEconomyRecord` (`blobBaseFeeWei`, blob txs, delegation targets, per-contract gas/reverts, priority tips, BAL slot writes); never-throw extraction.
2. **Part B — `timeSeries.ts` + `signalDetector.ts`:** `MacroRollupRing` (96×8-block), `SlotTrendTracker` (64 slots), `detectEconomySignals` (8 kinds, max 8 ranked); wire in `ETHEconomyDataManager.noteBundle` → `EconomySnapshot.signals` + `l2RollupStats` + `macroBaseline`.
3. **Part C — Identity:** expand `knownContracts.ts`; `identityResolver.ts` (LRU 512, 2 probes/block, `name()`/`symbol()`/`ENS` via `runEthCall`); integrate with `enrichTopContracts` / async queue on HEAD_FOLLOWING.
4. **Part D — TUI:** `/signals` + `/si`, `signalTools.ts` widget + Ctrl+D macro debug; help/registry/viewHistory; economy preface blob base fee; display names on Plaza/economy/contract.
5. **Tests:** `decodeBundle.spec.ts`, `signalDetector.spec.ts`, `identityResolver.spec.ts`; gates `tsc`, `npm test`, spellcheck.

---

## 3. Implementation Notes & Deviations (Implementer — Composer 2.5)

- **Shipped (D-122):** `timeSeries.ts`, `signalDetector.ts`, `identityResolver.ts`, `signalTools.ts`; `EconomySnapshot.signals` / `macroBaseline` / `l2RollupStats`; sandbox wired into `ETHEconomyDataManager` for async identity probes (max 2/block).
- **Macro ring:** bucket flush when 8 blocks pending; coarse bucket drop on block replace (live head reorg path).
- **ENS / ERC-20 live probes:** depend on synced state at head; CCIP-Read / OffchainLookup revert → cache miss without HTTP (by construction).
- **Follow-up:** richer offline ENS/ERC-20 sandbox fixtures; WP-10c consumes `SignalCandidate[]` as `SignalDigest`.
