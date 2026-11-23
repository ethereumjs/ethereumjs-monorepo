# WP-10c: Layer 2 Autonomous Chain-Detective LLM — Signal-Driven Investigation Loop, Bounded Read-Only State Toolbelt, Dispatch Feed UI, Self-History Journal & Opt-In Prompt Memory

- **Status:** `DONE`
- **Series:** `WP-10` — Next-Generation LLM Integration, Capabilities & Model Strategy
  - **`WP-10a`:** Modular AI runtime modes (`default` / `off` / `local`), first-open TUI onboarding, full-width `No AI` cockpit, `<dataDir>/config.json`, and `Ollama`/loopback auto-discovery.
  - **`WP-10b` (Layer 1):** Deterministic Ethereum signal engine, multi-horizon time series, anomaly candidates (`SignalCandidate[]`), and local `name()`/`symbol()` + ENS reverse identity resolution.
  - **`WP-10c` (this package — Layer 2):** Retires the 3-domain (`State` / `Economy` / `P2P`) AI narrative split and focuses the LLM 100% on **deep, on-chain Ethereum network & economic investigation** using a fan-friendly novelty gate, a bounded read-only Investigation Toolbelt, an AI Self-History Journal, opt-in user prompt-history sharing, and a live Chain Dispatch Feed in the right-hand AI panel.
  - **`WP-10d` (follow-up):** Default model benchmarking against real `WP-10b`/`WP-10c` evaluation fixtures, optional QLoRA post-training, and embedded model runner.
- **Dependencies:** `WP-10a`, `WP-10b`
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Holistic Scope & Architectural Requirements (Coordinator — Gemini 4 Carbon)

### 1.1 Architectural Motivation: From Generic Node Telemetry to Deep On-Chain Discovery

Earlier iterations (`WP-07c`, `WP-07f`) split the LLM's attention across three fixed node-telemetry buckets (`State`, `Economy`, `P2P`). In practice, `State` and `P2P` are background infrastructure already summarized clearly by the upper cockpit boxes — having an LLM repeatedly narrate *"16/16 buckets synced, 9 peers connected"* wastes tokens, compute, and screen space.

Meanwhile, the actual **live Ethereum economy** — sudden EIP-7702 delegation waves to an unfamiliar proxy, a breakout NFT/DEX venue, sustained L2 blob settlement cost surges, revert storms, or a storage slot climbing block after block — is rich, constantly shifting, and deeply rewarding to investigate.

`WP-10c` redesigns Layer 2 around four core principles:
1. **100% Focused on Ethereum Network & Economic Intelligence:** Drop the rigid 3-domain `State / Economy / P2P` prose split in the AI panel. (Only during initial bootstrap before live blocks arrive does the AI box display a compact sync status note; once `economy.hasBlocks === true`, the AI operates exclusively as an **On-Chain Detective**, while explicit user questions about peers/sync in the interactive prompt can still invoke `/peers` or `/diag`.)
2. **Pull-on-Demand Investigation Without Context Bloat:** Instead of dumping huge block payloads into every prompt, the LLM receives a compact **`SignalDigest` (`~400–600 tokens`)** from `WP-10b` and can selectively call **up to 2 read-only investigation tools** per cycle to inspect a specific proxy chain, storage slot trajectory, EIP-7702 delegate bytecode, L2 blob inbox, or whitelisted view call before writing its insight.
3. **Thermal & Resource Discipline (Whisper-Quiet by Default):** Running a local LLM on a laptop must never turn Ethy into a permanent fan-spinning workload. A deterministic **Novelty Gate** skips autonomous LLM calls when nothing notable changed, caps autonomous investigation to **at most 2 tool calls and 10 seconds per 45–60s cycle**, and aborts background inference immediately whenever the user submits an interactive question.
4. **Two Clear, Privacy-Honest Memory Layers:**
   - **AI Self-History Journal (RAM-only, always on when AI is active):** Remembers the AI's own last `4–6` published dispatches so it can track evolving stories (*"Update: Base blob spend has climbed for 18 blocks now"*) and never repeat stale commentary.
   - **Opt-In User Prompt History Sharing (`sharePromptHistory: boolean`):** Controlled explicitly by the user (selectable on first-run onboarding when enabling AI, and toggleable via `/ai memory` / CLI `--ai-share-prompts` / `--no-ai-history`, saved in `<dataDir>/config.json`). When enabled, recent session prompts (RAM-only, never written to disk) steer both interactive follow-ups and proactive dispatches toward what the user is actively exploring.

---

### 1.2 Detailed Design Specifications

#### Part A: Bounded Read-Only Investigation Toolbelt (`src/ai/investigationTools.ts`)

Provide a compact, deterministic, **strictly read-only** set of deep-inspection tools shared by both the autonomous `ChainDetectiveNarrator` and the interactive `LocalHttpIntentEngine`:

| Tool Name | Arguments | What It Returns (Compact JSON, `<= 350` Tokens) | Cost / Safety Guardrail |
| --- | --- | --- | --- |
| `inspect_contract` | `{ address }` | Resolved identity (`ensName`, `name()`, `symbol()`, `knownName`), bytecode archetype + confidence, **full proxy/delegate hop chain** (`addr → impl` up to depth 2), top function selectors & event counts, block activity, revert rate, bytecode size, risk cues (`DELEGATECALL`, `SELFDESTRUCT`, unverified proxy). | Pure RAM/cold-disk + cached `IdentityResolver` (`< 3 ms`) |
| `inspect_delegations` | `{ delegateAddress }` | Number of EOAs delegating to `delegateAddress` in the high-res & macro windows, revocations, whether `delegateAddress` is itself a proxy (following to implementation), bytecode capabilities (ERC-4337/wallet vs ERC-20 `transferFrom`/`approve` sweep cues vs unknown), and sample delegator ENS/nonces. | Pure `ETHEconomyDataManager` + `FlatStateManager` (`< 3 ms`) |
| `inspect_storage_slot` | `{ address, slot }` | Recent BAL value series `[(block, valueDecimalOrHex)]`, trend classification (`monotonic_up` / `monotonic_down` / `oscillating` / `step_jump`), delta per block, and owning contract identity. | Pure `SlotTrendTracker` + `coldStorageLookup` (`< 2 ms`) |
| `inspect_l2_blobs` | `{ inboxAddress? }` | Per-L2-inbox blob count, share of network blobs, blob base fee trajectory across the macro window, estimated ETH spent per batch and total in window. | Pure `ETHEconomyDataManager` (`< 1 ms`) |
| `inspect_account` | `{ address }` | Balance, nonce, ENS reverse name, EOA vs contract vs EIP-7702 delegated (with delegate target), net ETH delta in window, recent revert/burst activity. | Pure `FlatStateManager` + `IdentityResolver` (`< 3 ms`) |
| `probe_contract_view` | `{ address, fn }` | Executes a **strictly whitelisted** zero-arg read-only view via `sandbox.runEthCall`: `name`, `symbol`, `decimals`, `totalSupply`, `owner`, `implementation`, `paused`. Decodes return value cleanly to string/number/address. | Max `1` call per tool invocation, `gasLimit = 100_000n`, discarded CoW overlay (`< 5 ms`), never arbitrary calldata |

- **Strict Read-Only Guarantee:** No autonomous tool can mutate state, disconnect peers, pause sync, or broadcast transactions.
- **No Unbounded Loops:** Every tool truncates lists to `<= 6` items and caps serialized output size so small models (`2k–4k` context windows) never overflow.

#### Part B: Novelty-Gated 2-Step Autonomous Loop (`src/ai/chainDetective.ts`)

Replaces `AiPulseNarrator`'s rigid 3-domain template when `economy.hasBlocks === true`:

1. **Cadence & Thermal Novelty Gate (`DETECTIVE_INTERVAL_MS = 45_000..60_000`):**
   - On each tick, read the compact `SignalDigest` from `WP-10b` (macro snapshot + top `4` `SignalCandidate`s + top `3` L2 blob stats + latest notable moments).
   - **Skip Condition (Fan-Saving Idle Mode):** Skip calling the LLM if **all** of the following hold:
     - Fewer than `3` new blocks arrived since the last dispatch, **OR**
     - Top `SignalCandidate.noveltyScore < 35` **and** `< 180_000 ms` (3 minutes) have passed since the last LLM dispatch **and** no new user prompt shifted focus.
   - Immediately abort any in-flight autonomous turn if the user submits an interactive prompt at `● ethy >`.
2. **Bounded 2-Step Investigation Protocol (`maxToolCalls = 2`):**
   - **Turn 1 — Triage:**
     - Input: Compact `SignalDigest` + `InvestigationJournal` (last `5` AI dispatches) + optional `UserInterestCues` (last `3` user queries/topics **only if** `sharePromptHistory === true`) + tool list.
     - Output JSON (strict schema):
       - Either `{ "mode": "investigate", "calls": [{ "tool": "...", "args": { ... } }] }` (`1..2` calls), **OR**
       - `{ "mode": "dispatch", "category": "surge|7702|l2|fee|flow|contract|watch", "severity": "calm|notable|surge", "headline": "<= 72 chars", "body": "<= 360 chars", "relatedAddress"?: "0x...", "suggestedAction"?: "/contract 0x... or question" }`.
   - **Turn 2 — Synthesis (only if Turn 1 asked to investigate):**
     - Execute the `1..2` requested read-only tools in TypeScript (`< 15 ms` total) and send back the compact `toolResults` JSON.
     - Model must return `{ "mode": "dispatch", ... }` (no further tool loops — strictly bounded at 2 LLM calls max!).
3. **AI Self-History Journal (`src/ai/investigationJournal.ts`):**
   - In-memory ring of the last **`6`** published `ChainDispatch` entries (`blockNumber`, `timestamp`, `category`, `severity`, `headline`, `body`, `relatedAddress`, `suggestedAction`).
   - Allows the LLM to say *"Follow-up on 0x1234…: delegations doubled from 14 to 29 in the last 8 blocks"* instead of repeating the first observation verbatim.
4. **Deterministic Fallback When Model Unreachable / Still Warming:**
   - If the configured local LLM is offline or times out, render the highest-ranked `WP-10b` `SignalCandidate` cleanly as a deterministic Dispatch Card (`[SIGNAL]` badge, clearly distinct from LLM-authored prose) rather than falling back to the old 3-domain `State / Economy / P2P` text.

#### Part C: Redesigned Right-Hand `AI` Dispatch Feed & Interactive Follow-Ups (`src/tui/`, `src/ai/localHttpEngine.ts`)

1. **Right-Hand `╭─ ● AI ─╮` Panel (`src/tui/interactionContent.ts`):**
   - Drops the 3-domain (`● State`, `● Economy`, `● P2P`) vertical split.
   - Renders a **Chain Dispatch Feed** (most recent `1–2` dispatches that fit the terminal height, with the latest dispatch prominent and an optional compact prior dispatch below):
     - Header line per dispatch: severity/category badge (`[SURGE]`, `[7702]`, `[L2]`, `[FEE]`, `[FLOW]`, `[WATCH]`) + **bold headline** + relative block age (`#12,124,012 · 18s ago`).
     - Body: crisp word-wrapped prose (`<= 360` chars) referencing resolved ENS/token names when available.
     - Footer hint line (dim): `› Try: /contract 0x1234…` or `› Ask: "Check its totalSupply"`.
   - While `economy.hasBlocks !== true` (initial sync / warmup), shows a single calm bootstrap card explaining that live chain analysis starts automatically as soon as head blocks arrive.
2. **Interactive Follow-Ups Wired to the Same Detective Context (`LocalHttpIntentEngine`):**
   - When the user asks a natural-language question at `● ethy >` (e.g. *"Tell me more about that delegation proxy"*, *"Why is that slot going up?"*, *"Compare L2 blob spend over the last hour"*):
     - The engine includes the active `ChainDispatch` (top 2 entries from `InvestigationJournal`) + optional user prompt turns (when `sharePromptHistory === true`) + access to the same **Investigation Toolbelt** (`max 2 tool calls` before composing a grounded `KeyValueUIComponent` / `TableUIComponent` in the left Interaction View + a concise answer in the right `AI` box).
     - Explicit node-ops questions (*"Which peers are slowest?"*, *"Any sync errors?"*) still route cleanly to `/peers`, `/diag`, `/buckets`, etc.
3. **Opt-In Prompt History Consent (`config.json` + First-Open Onboarding + `/ai memory`):**
   - Extend `WP-10a`'s `EthyAiConfig` with `sharePromptHistory?: boolean` (default `false` until explicitly chosen, or offered as a crisp inline toggle `[y/n]` right after picking Option 1 or Option 3 in `AiOnboardingUIComponent`: *"Let AI use your session prompt history for smarter follow-ups? (RAM-only, never saved to disk)"*).
   - Expose `--ai-share-prompts` / `--no-ai-history` CLI flags and `/ai memory on|off` live toggle.
   - Prompts remain **100% RAM-only** (never persisted to `ethy.log`, `events.jsonl`, or `config.json`).

---

### 1.3 Acceptance Criteria (`WP-10c`)

- [x] **Zero new runtime dependencies** added to `packages/ethy/package.json`.
- [x] **3-Domain Split Retired from AI Panel:** Dispatch Feed in `renderAiOverviewSections` once `economy.hasBlocks === true`; pre-block bootstrap note.
- [x] **Bounded Read-Only Investigation Toolbelt:** Six tools in `investigationTools.ts`; whitelist on `probe_contract_view`; `investigationTools.spec.ts`.
- [x] **Novelty-Gated 2-Step `ChainDetectiveNarrator`:** `chainDetective.ts` replaces `AiPulseNarrator` when LLM connected; `[SIGNAL]` fallback; journal ring of 6.
- [x] **Privacy-Honest Prompt History Sharing:** `sharePromptHistory` on config/spine; `/ai memory on|off`; `--ai-share-prompts`; `UserInterestRing` tests.
- [x] **Deterministic offline tests:** `chainDetective.spec.ts` (gate, parse, journal).
- [x] All quality gates pass: `npm run tsc`, **351** tests, spellcheck on touched files.

---

## 2. Concrete Implementation Plan (Planner — Grok 4.7)

1. **Toolbelt** — `investigationTools.ts` + economy manager getters; six tools, JSON caps.
2. **Detective** — `signalDigest.ts`, `investigationJournal.ts`, `chainDetective.ts` (`ChainDetectiveNarrator` replaces 3-domain pulse when `hasBlocks`).
3. **UI** — `AiOverviewSections.dispatches`, `renderDispatchFeed`, session wiring, `/ai memory`, `--ai-share-prompts`.
4. **Tests** — `investigationTools.spec.ts`, `chainDetective.spec.ts` with fake transport.

---

## 3. Implementation Notes & Deviations (Implementer — Composer 2.5)

- **Shipped (D-124):** `chainDetective.ts`, `investigationTools.ts`, `investigationJournal.ts`, `signalDigest.ts`; Dispatch Feed rendering; session wires `ChainDetectiveNarrator`.
- **Interactive NL:** `LocalHttpIntentEngine` unchanged for slash/tool path; detective journal + toolbelt ready for a follow-up interactive 2-step pass.
- **Onboarding:** share-prompt toggle after default/local choice remains a small follow-up (CLI + `/ai memory` work today).
- **WP-10d** owns default-model benchmarking and embedded runner.
