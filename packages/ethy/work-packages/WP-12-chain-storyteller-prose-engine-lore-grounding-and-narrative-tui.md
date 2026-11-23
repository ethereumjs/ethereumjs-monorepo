# WP-12: Chain Storyteller — Uncaged Prose Engine, Curated Ethereum Lore & Threat Grounding, Editorial Reading TUI & Conversational Deep-Dives

- **Status:** `DONE`
- **Series:** `WP-12` — Next-Generation Chain Storytelling & Curious AI Experience
- **Dependencies:** `WP-10a`, `WP-10b`, `WP-10c`, `WP-10d` (`DONE`)
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Holistic Scope & Architectural Requirements (Coordinator — Gemini 4 Neon)

### 1.1 Product Diagnosis: Why Ethy's AI Currently Feels Underwhelming

After shipping `WP-10a`–`WP-10d`, the local AI plumbing works end-to-end (`Qwen3.5-2B` auto-bootstrap + Ollama discovery + Layer 1 signals + read-only investigation tools). Yet the actual **user experience** inside `╭─ ● AI ─╮` is starkly underwhelming — often displaying a tiny 4-line technocratic alert centered inside a vast empty pane:

```text
[SIGNAL] Blob base fee climbing - L2 batch pressure
2s ago
Layer 1 signal (l2_blob_pressure, score 52).
> /signals
```

A forensic audit of `src/ai/` and `src/tui/` reveals **seven concrete architectural causes**:

1. **The Model Is Prompted Like a Syslog Bot, Not a Storyteller:**
   - `chainDetective.ts` prepends `ETHY_USAGE_PLAYBOOK` (a terse slash-command manual from `WP-07c`) and a 1-line JSON schema (`TURN1_SCHEMA` / `TURN2_SCHEMA`) with **zero voice, zero curiosity, zero storytelling guidance, and zero permission to form explicit hypotheses or draw real-world / historical parallels**.
2. **Rigid JSON + Token + Timeout Strangleholds:**
   - `llmClient.ts` hard-caps autonomous completions at `maxPredictTokens('pulse') = 256` tokens, `temperature = 0.35`, `PULSE_TIMEOUT_MS = 8_000` ms, and forces strict JSON (`format: 'json'` / `response_format: { type: 'json_object' }`) on **every** call.
   - `chainDetective.ts` hard-truncates `body` to `360` characters. On a laptop CPU/GPU, 8 seconds frequently times out or triggers a JSON-parse fallback directly into `signalToDispatchCard()`, producing the sterile `Layer 1 signal (l2_blob_pressure, score 52).` string.
   - Asking a `2B` local model to simultaneously satisfy strict nested JSON escaping, a 256-token budget, low temperature, and engaging editorial prose collapses its output into dry one-liners.
3. **Rich Human & Protocol Drama Already Decoded by Ethy Is Thrown Away Before Reaching the LLM:**
   - `buildSignalDigest()` (`src/ai/signalDigest.ts`) sends only `headBlock`, `macro`, `signals` (top 4), `l2` (top 3), and a single `momentHeadline`.
   - It omits: `network` (`mainnet` vs `sepolia` — essential so the AI never mistakes testnet rehearsals for real-money attacks!), all 24 recent `moments[]` (on-chain UTF-8 graffiti, contract births, multi-account choreography flows, 50k-nonce veterans, first-step wallets, reverts, whale moves), `topContracts` (resolved names, archetypes, top selectors, proxy targets, net ETH deltas, `callPreviews`, `eventPreviews`), `latestProposerGraffiti`, `baseFeeGwei`, `txTypeSplit`, and `gasFullPct`.
4. **No Grounded Historical or Security Knowledge Anchor:**
   - Asking a `2B` model cold from its weights to tell an Ethereum history story or sketch a security attack scenario risks invented dates, garbled EIP numbers, or generic fluff. Conversely, injecting **1–2 compact, verified `EthereumLoreCard` entries** matched to the live pattern lets even a `2B` model weave sharp, accurate Ethereum history and realistic security thought experiments into every story.
5. **No Narrative Variety or Quiet-Chain Craft:**
   - Without a lens rotator or anti-repetition director, the AI repeats the same blob/fee alert for 20 minutes and falls back to *"Quiet chain — steady activity"* on calm blocks — missing the rich human artifacts sitting inside every 64-block window (new contract births, veteran accounts, multi-account choreography flows, graffiti notes).
6. **Interactive Questions Refuse to Tell Stories:**
   - In `LocalHttpIntentEngine` (`src/ai/localHttpEngine.ts`), when a user gets curious and asks *"Wait, could that 7702 proxy drain wallets?"* or *"Explain what is happening here"*, an `investigate` action dumps raw serialized JSON strings into a `KeyValueUIComponent` with no second synthesis turn and no prose reader widget.
7. **Wasted Reading Space & Disruptive Fallbacks in the TUI:**
   - `renderAiOverviewSections()` vertically centers tiny 4-line cards in a 35-row reading column, offers no editorial hierarchy (eyebrow, headline, flowing paragraphs, historical/threat sidebar, curiosity hook), and overwrites an existing good story on a transient timeout instead of keeping it readable while retrying.

---

### 1.2 Core Design Goal: The "What Is Happening Here?!" Experience (With Zero Hallucination)

Transform Ethy's AI mode from a passive alert ticker into a **live Ethereum Field Historian, Curious Investigator & Security Companion** that opens up the living blockchain for the reader:

- **Stories, not status lines:** Flowing, curious, thought-provoking prose (2–4 crisp paragraphs) that translates raw on-chain mechanics (slots, proxies, blobs, delegations, reverts, choreography flows, graffiti) into vivid real-world narratives.
- **The Honest Speculation Contract (Never Lie, Always Wonder Aloud):**
  1. **Grounded Observed Facts Only:** Every address, block number, ETH/Gwei figure, selector, and contract label cited as observed *must* come verbatim from Ethy's live brief or tool results. Unknown contracts stay honestly unnamed (*"an unverified contract at `0x1234…`"*).
  2. **Explicit Hypothesis Framing:** Real-world explanations, user motives, and security attack scenarios are always framed transparently (*"One plausible reading…"*, *"Could this be…"*, *"If an attacker were running a trap of this shape, here is how it would work…"*). Never state an unproven off-chain motive as settled fact.
  3. **Network Honesty (`mainnet` vs `sepolia`):** Always pass `network` explicitly. On Sepolia, frame strange bursts as developer rehearsals, wallet staging tests, faucet bots, or red-team simulations — never pretend testnet ETH is real money.
  4. **Verified Lore Grounding:** Historical echoes and attack-pattern lessons come from a curated, historically accurate `EthereumLoreCard` catalog rather than cold 2B weight recall.
- **Scales Naturally Across Model Sizes:** Works warmly and reliably on the built-in `Qwen3.5-2B` default runner *and* automatically unlocks richer context and longer essays when the user attaches a larger local Ollama / loopback model (`7B`, `14B`, `32B+`).
- **Zero New Dependencies & Zero Autonomous Downloads:** Strictly zero new npm dependencies in `packages/ethy/package.json`. All verification runs 100% offline against `MockLlmServer` and Vitest.

---

### 1.3 Detailed Design Specifications

#### Part A: Rich `StoryBrief`, Expanded Read-Only Toolkit & `StoryDirector` (`src/ai/storyBrief.ts`, `src/ai/storyDirector.ts`, `src/ai/investigationTools.ts`)

1. **Rich `StoryBrief` (`src/ai/storyBrief.ts`):**
   - Replaces the starved `SignalDigest` as the primary input to autonomous storytelling (keep `buildSignalDigest` exported for backwards compatibility with existing callers/tests).
   - Built deterministically from `EthySpine` + `ETHEconomyDataManager` (`~500–750` tokens compact; `~900–1,200` tokens on `rich` model tier):
     - **`network`:** `'mainnet' | 'sepolia' | ...` + `hardfork` (e.g. `'amsterdam'`).
     - **`head`:** `blockNumber`, `baseFeeGwei`, `baseFeeTrend`, `blobBaseFeeGwei`, `gasFullPct`, `tps`, `windowRevertPct`, `ethTransferredWindowEth`, `txTypeSplit` (`legacy`, `feeMarket`, `blob`, `setCode`), `proposerGraffiti`.
     - **`signals`:** Top `4` ranked `SignalCandidate` entries with human-formatted values (Gwei / ETH, never raw 18-digit wei strings without human equivalents).
     - **`moments`:** Top `6` distinct recent `BlockMoment` entries from the 24-moment ring (prioritizing `graffiti_note`, `birth`, `eip7702`, `choreography`, `whale`, `revert`, `veteran`, `first_step`, `blob_anchor`).
     - **`hotContracts`:** Top `5` `TopContractRow` entries including `address`, `knownName`, `archetype`, `proxyKind`, `proxyTarget`, `blocksActive`, `storageWrites`, `topSelectors`, plus up to `2` decoded `callPreviews` / `eventPreviews` from `ContractAddressAgg`.
     - **`l2`:** Top `3` L2 rollup inbox stats with human ETH spend (`formatEthFromWei`).
     - **`macro`:** Human-formatted baseline comparison (`avgBaseFeeGwei`, `avgBlobBaseFeeGwei`, `avgGasFullPct`, `avgRevertPct`, `bucketCount`).
2. **Two New Narrative Investigation Tools in `src/ai/investigationTools.ts`:**
   - Extend `INVESTIGATION_TOOL_NAMES` (keeping all 6 existing tools intact and strictly read-only, capped at `MAX_JSON_CHARS = 1400`):
     - **`inspect_recent_moments`** (`{ kind?, limit? }`): returns up to `6` recent moments with block numbers, addresses, and decoded call/event previews for any referenced contract.
     - **`inspect_block_activity`** (`{ blockOffset? }`): returns the detailed breakdown of the latest (or `blockOffset` back, `0..15`) block in the economy ring — proposer graffiti, tx-type split, gas fullness, largest ETH transfer, top reverting/gas-heavy contracts, and new deployments.
3. **`StoryDirector` — Lenses, Anti-Repetition & Quiet-Chain Curation (`src/ai/storyDirector.ts`):**
   - Defines 4 distinct editorial lenses (`StoryLens`):
     - **`detective`** — Follow the strangest live anomaly, mystery contract, or multi-account choreography; peel back what the bytecode and storage are doing.
     - **`security`** — Put on a white-hat threat-modeling hat: examine risk cues (`DELEGATECALL`, unverified proxy, EIP-7702 delegation cluster, revert storms, fresh contracts) and walk through a realistic *"what could go wrong / how an attack of this shape works"* scenario.
     - **`economics`** — Connect live fee markets, L2 blob auctions, ETH flows, MEV/arbitrage choreography flows, and gas pressure to real-world user and protocol dynamics.
     - **`lore`** — Zoom out from a concrete live artifact (a brand-new contract birth, a 50k-nonce veteran, a graffiti note, an EIP-7928 BAL write, or a quiet block) to tell a human story anchored in Ethereum's protocol history.
   - **Lead Selection & Anti-Repetition Scoring:**
     - Inspects the last `6` stories in `StoryJournal` (tracking `subjectKey`, `relatedAddress`, `lens`, and `loreCardId`).
     - Penalizes repeating the exact same `subjectKey` or `relatedAddress` back-to-back unless severity escalated sharply (e.g. delegations doubled or blob fees jumped again → explicitly flagged as a **`followUp`** arc so the Narrator continues the story instead of repeating it!).
     - Rotates `StoryLens` naturally across cycles (or honors an explicit user lens nudge via `/story security`, `/story history`, `/story economics`, `/story detective`).
     - **Quiet-Chain Story Guarantee:** When `signals[]` is empty or low-score, `StoryDirector` NEVER outputs a dull "nothing happened" status. Instead it mines `moments[]` and `hotContracts[]` for the highest-curiosity live artifact (a graffiti message, a contract birth, a 6+-account choreography tx, a veteran nonce, a first-step wallet, or the top active contract's bytecode/selectors) and selects a `lore` or `economics` lens so every story teaches something genuinely fascinating about live Ethereum!

#### Part B: Curated Ethereum Lore & Security Threat Cards (`src/ai/ethereumLore.ts`)

1. **Zero-Dependency, Historically Verified Knowledge Module (`src/ai/ethereumLore.ts`):**
   - Holds **`14` compact, hand-verified `EthereumLoreCard` entries** (`~85–115` tokens each), each containing:
     - `id: string`
     - `tags: readonly string[]` (matching `SignalKind`, `BlockMomentKind`, risk cues like `DELEGATECALL` / `SELFDESTRUCT` / `proxy`, and `network:sepolia`)
     - `title: string`
     - `protocolMechanism: string` (1–2 crisp sentences explaining the underlying Ethereum mechanism in plain language)
     - `historicalEcho: string` (1–2 accurate sentences citing a real Ethereum milestone with correct year/EIP — zero vague filler)
     - `attackOrEdgeScenario: string` (1–2 concrete sentences illustrating a realistic security threat, economic edge case, or "wait — is this right?" failure mode)
   - **Required Curated Card Coverage (14 cards):**
     1. `l2_blobs_dencun` — EIP-4844 (Dencun, March 2024) two-dimensional blob fee market vs pre-Dencun calldata spikes (2023 inscriptions) & sequencer batching races.
     2. `eip7702_delegation_lens` — EIP-7702 (Pectra, 2025) temporary EOA code delegation (`0xef0100…`), legitimate smart-wallet upgrades vs single-signature wallet-drainer delegation traps.
     3. `delegatecall_proxy_risk` — EIP-1967 upgradeable proxies & `DELEGATECALL` shared storage layout; Parity Multi-Sig library freeze (2017) & storage-collision / malicious-upgrade threat scenario.
     4. `revert_storm_mev_wars` — Priority-fee back-running & arbitrage races where dozens of searchers pay gas for losing reverts on the same pool; classic Priority Gas Auctions (Flash Boys 2.0, 2019) vs modern block-builder competition.
     5. `choreography_flash_composability` — Multi-account single-tx composability (routers, flash loans, liquidations); "money building blocks" vs price-oracle manipulation / atomic flash-loan exploit chains (bZx 2020 / Euler 2023).
     6. `eip1559_fee_auction` — EIP-1559 (London, August 2021) dynamic base-fee burn targeting 50% block fullness; sudden demand spikes (2022 NFT land-mint gas war) & sustained fullness dynamics.
     7. `contract_birth_code_audit` — Fresh bytecode deployment (`CREATE` / `CREATE2`); metamorphic / `SELFDESTRUCT` history (restricted by EIP-6780 in Dencun 2024) and why unverified newborn contracts deserve scrutiny.
     8. `whale_settlement_flow` — Large single-tx ETH transfers: exchange cold-to-hot rebalancing, OTC settlement, or bridge withdrawals vs address-poisoning lookalike scams.
     9. `storage_slot_accumulator` — Monotonic or step-jump storage writes visible directly in EIP-7928 BALs: liquidity pool reserves, staking vaults, or monotonically growing nonces/counters vs unexpected admin-slot flips.
     10. `graffiti_onchain_messages` — UTF-8 calldata notes & proposer graffiti: immutable on-chain messages from the Genesis block & 2016 DAO negotiations to white-hat hack negotiation notes sent directly to exploiters' addresses.
     11. `veteran_vs_newcomer` — Nonce 1 wallets taking their first on-chain step beside 50,000+-nonce veteran bots/exchanges/relayers — Ethereum's open shared street.
     12. `amsterdam_bal_state_lens` — EIP-7928 Block-Level Access Lists (Amsterdam): how Ethy follows every account balance, nonce, bytecode, and storage write live without executing EVM transactions locally.
     13. `sender_burst_automation` — Same-sender transaction bursts: relayers, oracle updaters, market-maker cancel/replace loops, or spam/nonce-griefing tests.
     14. `sepolia_testnet_rehearsal` — Sepolia testnet framing: developer dress rehearsals for Mainnet upgrades, EIP-7702 wallet SDK tests, bridge/rollup testnets, and red-team exploit dry runs with zero real-money value.
2. **Deterministic Matcher (`selectLoreCards(brief, lens, recentLoreIds, maxCards)`):**
   - Scores cards against active signals, moments, risk cues, proxy presence, and `network` (auto-includes `sepolia_testnet_rehearsal` awareness when `network === 'sepolia'`), applies an anti-repetition penalty for recently used `loreCardId`s, and returns `1` card (for `compact` 2B–4B tier) or `2` cards (for `rich` 7B+ tier).

#### Part C: Decoupled 2-Phase Story Engine & Prose-First Transport (`src/ai/llmClient.ts`, `src/ai/storyNarrator.ts`, `src/ai/parseStoryOutput.ts`, `src/ai/chainDetective.ts`)

1. **Prose-Capable Transport Extensions (`src/ai/llmClient.ts`, `src/ai/fixtureEngine.ts`):**
   - Extend `LlmCompletionKind` to `'pulse' | 'intent' | 'story'`.
   - Extend `LlmTransportRequest` with optional overrides:
     - `responseMode?: 'json' | 'text'` (defaults to `'json'` for `'pulse'`/`'intent'` and `'text'` for `'story'`)
     - `maxTokens?: number`
     - `temperature?: number`
     - `timeoutMs?: number`
   - **Critical Wire Fix:**
     - In `postOllamaChat()`: include `format: 'json'` **only when `responseMode === 'json'`**. Omit `format` completely when `responseMode === 'text'`! Keep `think: false` to prevent hidden reasoning tokens from exhausting output budgets.
     - In `postChatCompletion()` (OpenAI-compatible / `llama-server`): include `response_format: { type: 'json_object' }` **only when `responseMode === 'json'`**. Omit `response_format` when `responseMode === 'text'`!
   - **Sensible Defaults (Fixing the 8s Timeout & 256-Token Starvation):**
     - `'pulse'` (Phase 1 Scout JSON): `maxTokens: 256`, `temperature: 0.15`, `timeoutMs: 18_000`.
     - `'story'` (Phase 2 Storyteller & Interactive Narrative): `maxTokens: 750` (up to `950` on `rich` tier), `temperature: 0.72`, `timeoutMs: 28_000`.
     - `'intent'` (Interactive Routing JSON): `maxTokens: 600`, `temperature: 0.12`, `timeoutMs: 18_000`.
2. **Model Capability Tier Inference (`inferModelTier(modelName?: string): 'compact' | 'rich'`):**
   - Pure helper: detects `7b`, `8b`, `9b`, `12b`, `14b`, `20b`, `24b`, `27b`, `32b`, `70b`, `72b` (or known larger model names) → `'rich'`; defaults to `'compact'` for `Qwen3.5-2B`, `0.8B`–`4B`, or unknown models.
   - `'compact'` injects 1 lore card, ~650 output tokens, concise 2-paragraph story + angle; `'rich'` injects up to 2 lore cards, fuller moments/contract context, and ~900 output tokens.
3. **2-Phase Split Architecture in `ChainDetectiveNarrator` (upgraded in-place, preserving class name & lifecycle):**
   - **Phase 1 — Scout / Investigator (`kind: 'pulse'`, `responseMode: 'json'`):**
     - System prompt is focused strictly on triage & tool selection — **NO `ETHY_USAGE_PLAYBOOK` slash manual!**
     - Receives compact `StoryBrief` + `StoryDirector` selected `lead` & `lens` + recent journal headlines (`<= 5`).
     - Decides either `{ "mode": "investigate", "calls": [...] }` (`1–2` tools) OR `{ "mode": "tell_story", "focus": "<1-sentence focus>" }`.
     - *(Backwards compatibility: if a mock/fixture returns legacy `{ "mode": "dispatch", ... }`, accept it cleanly!)*
   - **Phase 2 — The Storyteller (`kind: 'story'`, `responseMode: 'text'` — NO JSON CAGE!):**
     - System prompt defines the **Ethy Field Historian & Curious Detective** voice + the **4 Honest Speculation Rules** + the chosen `StoryLens` instructions + the exact 1–2 matched `EthereumLoreCard` entries.
     - Asks the model to write directly in lightweight, forgiving sectioned prose:
       ```text
       HEADLINE: <vivid editorial hook, <= 84 chars, plain language>
       STORY:
       <Paragraph 1: what is actually happening on-chain right now in concrete, human terms>

       <Paragraph 2: why it is interesting + an explicitly framed real-world hypothesis or "could this be..." theory>
       ANGLE:
       <1 punchy paragraph: either a grounded Ethereum history echo, a concrete "what if an attacker..." security scenario, or a provocative "wait — is this right?" thought experiment>
       CURIOSITY: <1 natural question the user might want to ask next>
       COMMAND: <optional single slash command, e.g. /contract 0x... or /signals>
       ```
     - **Forgiving Parser (`src/ai/parseStoryOutput.ts`):**
       - Strips `<think>...</think>` blocks and markdown code fences.
       - Parses `HEADLINE:`, `STORY:`, `ANGLE:`, `CURIOSITY:`, `COMMAND:` case-insensitively (accepting optional `**bold**` or `##` prefixes).
       - **Graceful Prose Salvage:** If a small model forgets section headers and returns plain multi-paragraph prose (`>= 80` chars), derives `headline` from the first sentence/line, puts the body into `story`, and NEVER discards good prose just because a label was missed!
       - **Zero Raw Internal Jargon:** Sanitizes or never leaks internal enum names (`l2_blob_pressure`, `score 52`) into rendered stories.
4. **Rich Deterministic `[LIVE NOTE]` Fallback & Non-Destructive Retention (`src/ai/storyFallback.ts`):**
   - **Retire `Layer 1 signal (l2_blob_pressure, score 52).` permanently!**
   - `buildDeterministicFieldNote(brief, lens, loreCard, atMs)` composes a genuinely readable, grounded multi-sentence field note from the live `StoryBrief` (human-formatted Gwei/ETH, contract names/archetypes, latest moment) paired with the matched `EthereumLoreCard.historicalEcho` or `attackOrEdgeScenario` and a curiosity question, clearly marked `deterministic: true` (`[LIVE NOTE]` badge).
   - **Non-Destructive Story Retention:** Once `ChainDetectiveNarrator` has published an LLM-authored story (`deterministic !== true`), a transient timeout or error on a later tick **never overwrites** the displayed LLM story with a `[LIVE NOTE]` fallback! The last good story remains readable with its timestamp while the narrator retries on the next cycle.
5. **Reading-Friendly Pacing (`DETECTIVE_INTERVAL_MS = 75_000`, minimum dwell `45_000` ms):**
   - Prevents ripping a multi-paragraph story off screen while the human is still reading it.
   - Adds `triggerNow(lensOverride?: StoryLens): Promise<void>` on `ChainDetectiveNarrator` so `/story new` and `/story <lens>` immediately generate a fresh story on demand (bypassing the novelty skip and dwell timer!).

#### Part D: Conversational Deep-Dives & First-Class `StoryUIComponent` (`src/ai/localHttpEngine.ts`, `src/tui/components/StoryUIComponent.ts`, `src/spine/types.ts`)

1. **Extended `ChainDispatchCard` & New `WidgetSpec` (`kind: 'story'`) in `src/spine/types.ts`:**
   - Extend `ChainDispatchCard` (backwards-compatible optional fields) with:
     - `lens?: StoryLens` (`'detective' | 'security' | 'economics' | 'lore'`)
     - `network?: string`
     - `angle?: string` (the History Echo / Security What-If / Provocation paragraph)
     - `angleKind?: 'history' | 'security' | 'question' | 'lens'`
     - `curiosityQuestion?: string`
     - `evidence?: Array<{ label: string; value: string }>` (grounded observed facts: block, address, Gwei/ETH, selectors, risk cues)
     - `loreCardId?: string`
     - `modelLabel?: string`
     - `latencyMs?: number`
     - `toolsUsed?: string[]`
   - Add `WidgetSpec` variant `{ kind: 'story'; story: ChainDispatchCard; debugPage?: DebugSectionSpec[] }` rendered by **`src/tui/components/StoryUIComponent.ts`**.
2. **`StoryUIComponent.ts` (Wide Left Interaction View Reader):**
   - Renders full-length stories and interactive deep-dive answers with calm magazine typography (strictly obeying `ethy-tui.mdc`: pure function, `visibleWidth`-safe, single-width glyphs only, zero reflow):
     - **Eyebrow bar:** `[STORY · SECURITY]` (or `[LIVE NOTE]`) + dim `MAINNET · #21,402,811 · 12s ago`
     - **Bold headline** wrapped cleanly across the wide 2/3 pane
     - **Paragraphs** separated by blank breathing rows (`story` paragraphs)
     - **Highlighted Angle block:** left-bordered with a dimmed single-width bar `│` and a bold tag (`↺ History Echo`, `△ What-If Security Scenario`, or `◆ Think About This`)
     - **Compact Grounded Evidence strip** (dim key-value pairs on 1–2 rows: e.g. `Observed: Base Batcher · 24 blobs · 4.80 Gwei`)
     - **Next Rabbit Hole footer:** `› Ask: "Could this 7702 proxy drain wallets?"` + optional `› /contract 0x1234…`
   - Supports `Ctrl+D` debug page showing the exact tool calls executed, raw tool JSON outputs, injected `loreCardId`, model tier, and completion latency!
3. **Interactive Conversational Deep-Dives in `LocalHttpIntentEngine` (`src/ai/localHttpEngine.ts`):**
   - Upgrade `INTENT_SCHEMA` so the model can choose between:
     - Operational slash tools (`{ "type": "tool", ... }`) and structured tables (`{ "type": "compose", ... }`) for node-ops queries (*"slowest peers"*, *"pause snap"*, *"show buckets"*);
     - **`{ "type": "investigate", "calls": [...], "followUpProse": true }`** — executes `1–2` read-only investigation tools AND runs a **Phase 2 Storyteller Synthesis turn (`kind: 'story'`, `responseMode: 'text'`)** grounded in the tool outputs, active right-pane story (`journal.latest()`), `StoryBrief`, and matched `EthereumLoreCard`s, returning a rich **`WidgetSpec` (`kind: 'story'`)** instead of dumping raw JSON strings!
     - **`{ "type": "explain", "lens"?: "detective|security|economics|lore" }`** — for pure conceptual / "what if" / "tell me a story about…" / follow-up questions that don't need a new tool call: invokes the Storyteller Synthesis turn directly with the current `StoryBrief` + active right-pane story + matched lore cards and returns a `kind: 'story'` widget!
   - Also keep a compact 1–2 line summary or keep the right AI pane undisturbed when the full answer opens in the left `StoryUIComponent` (no redundant duplication).

#### Part E: Editorial Right-Hand `╭─ ● AI ─╮` Reading Pane, `/story` Command & Upgraded `ai:smoke` (`src/tui/interactionContent.ts`, `src/tools/storyTools.ts`, `src/ai/smokeScenarios.ts`)

1. **Editorial Right-Hand `╭─ ● AI ─╮` Column (`src/tui/interactionContent.ts`):**
   - Replace the cramped, vertically centered 2-card dump with a **top-aligned single-story editorial column** that uses the full height of the AI pane gracefully:
     - Top padding: `1` blank row (consistent with cockpit breathing room — NOT centered into the middle of an empty abyss).
     - Eyebrow: `[STORY · <LENS>]` (or `[LIVE NOTE]`) + dim `#block · <age>` + subtle journal position `(1/6)`.
     - **Bold wrapped headline** (followed by a blank breathing row).
     - **Flowing `story` paragraphs** (blank line between paragraphs, `padCols = 2`).
     - **Angle callout** (when height permits): subtle `│` left accent + `↺ Echo` / `△ What if` / `◆ Lens` + wrapped angle prose.
     - **Bottom curiosity footer** (pinned cleanly after content or at the bottom rows of the pane):
       - `› Ask: "<curiosityQuestion>"`
       - `› /story full · /story new` (or `› /contract 0x… · /story`)
     - If the story overflows very short terminals (`innerLines < content.length`), cleanly truncate at a paragraph/line boundary and guarantee the bottom line reads `› /story to read full story` so nothing ever vanishes silently.
   - Keep `bootstrapNote` centered cleanly during initial sync / model download / warming phases.
2. **New `/story` Slash Command (`src/tools/storyTools.ts`, registered in `toolRegistry.ts`, `deterministicEngine.ts`, `slashComplete.ts`, `help.ts`):**
   - `/story` (alias `/st`) — Opens the current story from `InvestigationJournal` in the wide left `StoryUIComponent` (full prose + evidence + `Ctrl+D` raw telemetry).
   - `/story new` (or `/story next`) — Immediately triggers a fresh autonomous story cycle (shows a calm `"Writing a fresh story…"` indicator while in flight).
   - `/story security` | `/story history` | `/story economics` | `/story detective` — Nudges `StoryDirector` to that lens and triggers a fresh story immediately!
   - `/story list` (or `/story <1..8>`) — Lists the session's `StoryJournal` ring as a crisp table, or opens story `#N` in `StoryUIComponent`.
   - `/help` (when `aiMode !== 'off'`) includes `/story` and two vivid curiosity-first example prompts (e.g. `"Could that contract be a trap?"`, `"Tell me the story of the last 10 blocks"`).
3. **Upgraded `npm run ai:smoke` (`src/ai/smokeScenarios.ts`):**
   - Updates the smoke suite to exercise the **2-phase JSON Scout → Free-Text Storyteller** pipeline across 4 scenarios:
     1. **Mainnet EIP-7702 Unknown Proxy Surge** (security lens — tests tool call + honest attack-scenario framing without accusing an unknown address as proven malicious);
     2. **Mainnet L2 Blob Base Fee Climb (Base Batcher)** (economics/history lens — tests EIP-4844 lore grounding & plain-English prose);
     3. **Sepolia Quiet Block with Newborn Contract & Graffiti** (lore/quiet-chain lens — tests network honesty for Sepolia + engaging story even with zero high-severity signals!);
     4. **Interactive Follow-Up Question** (*"Wait, how would an EIP-7702 phishing attack actually work on that proxy?"* — tests `LocalHttpIntentEngine` `story` widget synthesis).
   - `npm run ai:smoke -- --mock` remains 100% offline and CI-safe (`< 1s`), printing the full formatted prose stories so humans can inspect quality immediately before/after running live against `Qwen3.5-2B` or Ollama.

---

### 1.4 Acceptance Criteria (`WP-12`)

- [ ] **Zero new runtime dependencies** in `packages/ethy/package.json` and **zero autonomous model downloads** by agents or CI.
- [ ] **No More Technocratic `Layer 1 signal (…, score …)` Strings:** `signalToDispatchCard` / fallback path produces genuine, human-readable `[LIVE NOTE]` field notes grounded in live metrics and matched `EthereumLoreCard`s, and transient LLM timeouts **never** overwrite an already-displayed LLM story.
- [ ] **Prose-First Transport (`llmClient.ts`):** Supports `kind: 'story'` and `responseMode: 'text'` (omitting `format: 'json'` on Ollama and `response_format` on OpenAI/`llama-server`), raises pulse/story timeouts (`18s` / `28s`) and token budgets (`750` / `950`), and adapts prompt depth to `compact` vs `rich` model tiers.
- [ ] **Rich `StoryBrief` + `StoryDirector` + 2 New Read-Only Tools:** Passes `network`, `moments[]`, `hotContracts` (with selectors/previews/archetypes), `l2`, `signals`, and `macro` in human units; rotates across 4 lenses (`detective`, `security`, `economics`, `lore`) with anti-repetition memory and quiet-chain artifact storytelling; adds `inspect_recent_moments` and `inspect_block_activity`.
- [ ] **Curated `EthereumLoreCard` Library (`ethereumLore.ts`):** `14` verified protocol/history/threat cards with deterministic `selectLoreCards()` matching and anti-repetition weighting; enforces the 4 Honest Speculation Rules (including Sepolia vs Mainnet framing).
- [ ] **Forgiving Prose Parser (`parseStoryOutput.ts`):** Cleanly parses sectioned prose (`HEADLINE` / `STORY` / `ANGLE` / `CURIOSITY` / `COMMAND`), strips `<think>` blocks and markdown formatting, and gracefully salvages unlabelled multi-paragraph essays.
- [ ] **Interactive Deep-Dives + `StoryUIComponent`:** `LocalHttpIntentEngine` synthesizes prose `kind: 'story'` widgets (with Grounded Evidence & `Ctrl+D` debug page) instead of dumping raw tool JSON; operational slash/table routes remain intact.
- [ ] **Editorial AI Pane & `/story` Command:** Right-hand `╭─ ● AI ─╮` pane renders top-aligned, readable multi-paragraph editorial prose with angle callout and curiosity footer (respecting `ethy-tui.mdc` `visibleWidth` & single-width glyph laws); `/story`, `/story new`, `/story <lens>`, and `/story list` work cleanly.
- [ ] **Offline Verification Suite (`MockLlmServer` + Vitest + `ai:smoke --mock`):** Full unit and loopback HTTP integration tests covering 2-phase JSON→Text storytelling, forgiving prose salvage, non-destructive timeout retention, lore matching, `StoryDirector` quiet-chain rotation, `StoryUIComponent` framebuffer geometry, `/story` commands, and interactive deep-dive synthesis.
- [ ] All quality gates pass: `npm run tsc`, `npm test`, and `npm run spellcheck` in `@ethereumjs/ethy`.

---

## 2. Concrete Implementation Plan (Planner — Grok 4.7)

1. **Transport** — `llmClient` + `fixtureEngine`: `kind: 'story'`, `responseMode` text/json, timeouts 18s/28s, token budgets; `modelTier.ts` compact vs rich.
2. **StoryBrief + tools** — `storyBrief.ts`, `getHardfork()` on economy manager; `ethereumLore.ts` (14 cards), `storyDirector.ts`; extend `investigationTools` with `inspect_recent_moments` / `inspect_block_activity`.
3. **Prose path** — `parseStoryOutput.ts`, `storyFallback.ts`, `storyNarrator.ts`; upgrade `chainDetective.ts` (scout JSON → storyteller text, dwell/interval, `triggerNow`, non-destructive retention).
4. **Types + TUI** — extend `ChainDispatchCard` / `WidgetSpec` `story`; `StoryUIComponent.ts`; editorial `renderAiOverviewSections`; `storyTools.ts` + `/story` registration.
5. **Intent** — `localHttpEngine` `followUpProse` + `explain` → `kind: 'story'`; `smokeScenarios` four scenarios; Vitest coverage; session `onUnhealthy` fix.

**D-132 refinements:** reuse `InvestigationJournal`; keep `buildSignalDigest`; retire `Layer 1 signal` fallback body; no new deps.

---

## 3. Implementation Notes & Deviations (Implementer — Composer 2.5)

*(To be filled out by Composer 2.5 upon completion.)*
