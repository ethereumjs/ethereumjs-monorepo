# WP-15: Deep Contract Forensics, Guided-Randomness Storytelling, Persistent Contract Dossiers & Grounded AI Observability

- **Status:** `READY_FOR_PLANNING`
- **Dependencies:** `WP-07d` (`DONE`), `WP-10b` (`DONE`), `WP-10c` (`DONE`), `WP-10d` (`DONE`), `WP-12` (`DONE`)
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Holistic Scope & Architectural Requirements

### Goal
Transform Ethy's AI mode from repetitive, opaque template notes into a **curious, grounded, human-sounding on-chain field investigator** that:
1. **Stumbles upon one concrete thread at a time** via guided randomness ("weighted dice") instead of always picking the deterministic top signal or trying to summarize the entire chain.
2. **Digs genuinely deep** — reverse-engineering contract bytecode (selectors, embedded strings, embedded addresses, proxy implementations, compiler metadata, opcode profile), live 64-block call/caller/revert patterns, and safe local EVM view probes — and **remembers what it learned** in a persistent local Contract Dossier database across sessions.
3. **Writes stories that go beyond the obvious** — connecting bytecode clues + live call patterns into concrete, honest hypotheses with actionable lookup pointers (addresses, decoded functions, token/NFT hints, slash commands) that give users genuine *"wait, THIS is happening on-chain right now? Let me look this up!"* moments.
4. **Fixes the live silent-fallback failure, `/story new` freeze bug, and awkward `/story` UX** — making the right-hand AI column the natural home for live story refreshes and keeping the left interactive pane for full reading/dossiers.
5. **Grounds every AI evaluation in reality** — full structured run telemetry (`ai-runs.jsonl`), `llama-server` stderr capture, `[ai]` diagnostic log lines, `/ai log` in TUI, and a CLI analyzer (`npm run ai:inspect`) so humans and agents never have to guess what the local LLM actually received, generated, or why it fell back.

---

### 1.1 Empirical Forensic Baseline (Live Sepolia `node1` Run — Nov 24, 2026)

Direct inspection of a live Sepolia `HEAD_FOLLOWING` run (`#12,201,561`, `config.json` = `mode: "default"`, `Qwen3.5-2B-Q4_K_M.gguf` + `llama-b12535` present on disk) uncovered **six concrete root causes** behind the unconvincing live AI experience:

1. **Every card shown in the live AI column was `storyFallback.ts`, never the LLM:**
   - The card header `[LIVE NOTE] SEPOLIA · #12201560 · 9s ago (1/6)` and body `"On SEPOLIA, base fee sits near <0.001 with blocks about 41% full. Right now: New 0.1 KB [EIP-1967 Proxy] deployed at 0x4b08..a2a5 (2 slot writes)..."` matched `buildDeterministicFieldNote()` (`src/ai/storyFallback.ts:25–42`) verbatim — including duplicating `loreCard.historicalEcho` both inside `body` and again in the `Echo` callout, and emitting the hardcoded Sepolia curiosity prompt.
   - Worse, `[LIVE NOTE]` disguised deterministic fallback as live AI output, giving the user no indication that the local model had failed.
2. **Zero AI observability anywhere on disk:**
   - Searching all files under `tmp/node1/networks/sepolia/logs/` (`ethy.log`, `events.jsonl`, `errors.log`, `pickup.jsonl`) yielded **zero** AI lines.
   - `ChainDetectiveNarrator.runCycle()` (`src/ai/chainDetective.ts:415`) uses a bare `catch {` that drops the error object completely — never logging timeouts, HTTP errors, empty/reasoning-only `content` from Qwen 3.5, JSON parse errors, or prose parse failures.
   - `managedRunner.ts:188` spawns `llama-server` with `{ stdio: 'ignore' }`, discarding startup errors, CLI flag rejections (e.g. `--reasoning-budget 0`), Metal/OOM warnings, and token latency stats.
3. **`/story new` freezes permanently on `"Status  Writing a fresh story…"`:**
   - `session.ts:352` starts `detectiveNarrator.triggerNow()` while `applyIntentResult` pushes `{ kind: 'slash', command: '/story new', frozenWidget: undefined }` onto `viewHistory` with `storyWritingPlaceholderWidget()`.
   - Every `400 ms`, `draw()` calls `applyLiveSlashRefresh()` (`src/tui/viewHistory.ts:235–252`), which re-dispatches `"/story new"` through `dispatchSlashWidget()` → `dispatchStorySlash()` → `storyWritingPlaceholderWidget()`, **overwriting `view.activeWidget` back to `"Writing a fresh story…"` forever** even after `triggerNow()` finishes!
   - UX mismatch: requesting a fresh story should refresh the **right-side AI column** directly (with an in-column generating state), leaving the left interactive pane untouched for reading/inspection.
4. **Hardcoded `"Sepolia rehearsals"` lock-in (`src/ai/ethereumLore.ts:199`):**
   - `selectLoreCards()` grants `sepolia_testnet_rehearsal` a permanent **`+5` bonus** on Sepolia (`+2` tag + `+5` bonus = `7`; even with `-4` recent penalty it still scores `+3` and keeps winning).
   - Its `historicalEcho` explicitly mentions `"EIP-7702 wallet pilots"`, causing repetitive Sepolia/7702 copy even when the live artifact is unrelated (e.g. an EIP-1967 proxy deployment).
5. **EIP-7702 bias (`src/ai/storyBrief.ts:10`, `src/economy/signalDetector.ts:138`):**
   - `MOMENT_PRIORITY` ranks `'eip7702'` #3 globally (ahead of `choreography`, `whale`, `revert`, `veteran`, `blob_anchor`), and `detectEconomySignals()` assigns `delegation_surge` a high score (`55–80`) for just `3–5` auths in 16 blocks.
   - `storyDirector.ts` deterministically selects `brief.signals[0]` or `brief.moments[0]` with **zero randomness**, repeatedly picking the same top signal or quiet moment.
6. **Shallow investigation before writing ("big picture" dump instead of deep single-thread forensics):**
   - Compact `2B` models receive a wide macro JSON brief and must first run a separate JSON scout turn (`max_tokens: 256`) to guess 1–2 truncated (`1,400`-char) tools.
   - Existing contract intelligence (`src/contracts/bytecodeFingerprint.ts`, `contractIntelligence.ts`, `identityResolver.ts`) already extracts basic selectors, proxy kinds, and 7 view probes, but does **not** extract embedded `PUSH20` addresses, printable bytecode/revert strings, compiler metadata, proxy implementation bytecode fingerprints, per-caller fan-out/bot ratios, or persist learned contract dossiers across restarts.

---

### 1.2 Architectural Pillars

#### Pillar 1: Grounded AI Observability & Live Run Forensics ("No More Guessing")
Make every live AI cycle, `/story new`, interactive NL turn, and managed `llama-server` lifecycle event easy to inspect from disk and inside the TUI:

1. **Structured AI Run Trace (`<networkDir>/logs/ai-runs.jsonl`):**
   - Append one compact JSON line per autonomous story cycle, `/story new`, and interactive NL intent turn (bounded rotation, e.g. rotate at `5 MiB` keeping 1 backup file so disk stays small).
   - Required fields on every `AiRunTraceRecord`:
     - Identity & context: `runId`, `ts`, `trigger` (`welcome` | `pulse` | `manual` | `interactive`), `network`, `blockNumber`, `aiMode`, `modelLabel`, `modelTier`, `baseUrl`.
     - **Director & dice roll:** `director` object containing candidate pool summary (beat kind, subject key, address, raw score, novelty/cooldown weight, final probability), RNG roll value, selected beat/lens, and whether a dossier cache entry existed.
     - **Pre-investigation & tools:** `dossier` / `toolCalls` array (`name`, `args`, `durationMs`, `bytes`, `cacheHit`, `ok`, `error`).
     - **Per-LLM-call wire trace:** `llmCalls` array (`stage`: `'scout' | 'story' | 'intent'`, `promptChars`, `maxTokens`, `temperature`, `responseMode`, `timeoutMs`, `httpStatus`, `durationMs`, `rawOutputChars`, `rawOutputPreview` capped at e.g. `4096` chars, `reasoningChars` if model emitted `reasoning_content`, `parsedOk`, `errorKind`: `'timeout' | 'http_error' | 'empty_content' | 'reasoning_only' | 'json_parse' | 'prose_parse' | 'aborted' | 'network'`, `errorMessage`).
     - **Final outcome:** `source` (`'llm' | 'fallback'`), `fallbackReason`, `headline`, `bodyChars`, `pointersCount`, `totalLatencyMs`.
2. **`llama-server` Process Log Capture (`<networkDir>/logs/llama-server.log` + in-memory tail):**
   - Stop spawning `llama-server` with `{ stdio: 'ignore' }` (`src/ai/managedRunner.ts`). Pipe `stderr`/`stdout` into a bounded rotating log file (e.g. `1 MiB` cap) plus a 40-line in-memory ring buffer exposed on runner status/diagnostics.
   - Log exact spawn command/args, port, startup duration, health-check result, and any unexpected child exit code/signal.
3. **`[ai]` Events in `ethy.log` / `events.jsonl`:**
   - Wire `ChainDetectiveNarrator`, `AiRuntimeController`, `ManagedModelRunner`, and `LocalHttpIntentEngine` to emit concise `DiagnosticEvent` records with `subsystem: 'ai'` (already defined in `DiagnosticSubsystem`):
     - Runner phase transitions (`probing`, `ready`, `needs-runner`, unexpected exit).
     - Every completed story run: `[ai] story #12201560 source=llm beat=contract_deep_dive addr=0x5263..e148 3.8s "One bot hammers..."` or `[ai] story #12201560 source=fallback reason=empty_content (err: ...)`.
4. **Live Inspection Surfaces (TUI + CLI):**
   - **TUI `/ai log` (and `/ai log <n>` / `/ai diag`):** table/key-value widget showing recent AI runs (time, trigger, `LLM`/`FB`, beat, latency, model, and exact failure reason on red rows) plus last `llama-server` tail lines if errors occurred.
   - **CLI Analyzer (`npm run ai:inspect -- <dataDir>` / `scripts/inspect-ai-runs.ts`):** zero-dep Node script reading `ai-runs.jsonl` and `llama-server.log` to print:
     - Total runs, LLM success rate vs fallback breakdown by `errorKind`, p50/p95 latency.
     - Beat-kind distribution, unique subjects/addresses ratio, lore reuse rate, opener repetition check.
     - Last 5 generated stories (headline, beat, source, tools/dossier used, body excerpt) + recent `llama-server` errors.

---

#### Pillar 2: Fix Silent LLM Failures, Honest UI Provenance & `/story` UX Overhaul
Ensure real local LLM output actually reaches the screen reliably, failures are visible and actionable, and `/story` commands feel natural:

1. **Harden `llama-server` + Qwen 3.5 / OpenAI-Compatible Wire Handling:**
   - Capture the exact error in `ChainDetectiveNarrator` and `LocalHttpIntentEngine` (no bare `catch {`).
   - In `postChatCompletion()` (`src/ai/llmClient.ts`), inspect both `message.content` and `message.reasoning_content` (and Ollama `message.thinking`):
     - If `content` is empty while `reasoning_content` is populated, classify as `reasoning_only` in trace logs and attempt safe salvage if `reasoning_content` contains sectioned story output or JSON, or retry once with thinking disabled in chat template parameters or an explicit `/no_think` hint where applicable.
   - Verify `llama-server` CLI compatibility (`--reasoning-budget 0` — if child exits immediately with unknown-flag error in stderr, automatically retry spawn without `--reasoning-budget 0` and log the fallback once!).
   - Use realistic timeouts for local CPU/Apple-Silicon `2B`–`8B` inference (e.g. story timeout `45_000 ms`, configurable via env `ETHY_LLM_TIMEOUT_MS`) and avoid double-paying two sequential LLM round-trips when the deterministic Forensic Dossier already gathered the evidence!
2. **Honest AI Column Provenance Badges (No Fake AI):**
   - Real LLM story badge: `[STORY · <modelShort>]` (e.g. `[STORY · Qwen3.5]` or `[STORY · llama3.1]`) + beat/lens tag.
   - Deterministic fallback badge: `[FALLBACK · <short reason>]` (e.g. `[FALLBACK · timeout]`, `[FALLBACK · runner offline]`, `[FALLBACK · parse error]`) so the user and developer immediately know when fallback fired and can run `/ai log` to inspect why.
   - Keep `spine.capabilities.ai` honest when `consecutiveFailures >= 2` (do not keep showing a green ready dot if the LLM has failed repeatedly; recover to green on next successful LLM completion).
3. **Fix `/story new` Freeze & Redesign `/story` UX (Right-Column-First):**
   - **Root bug fix:** `applyLiveSlashRefresh()` (`src/tui/viewHistory.ts`) must **never** re-dispatch action/mutation slash commands (`/story new`, `/story next`, `/story <lens>`).
   - **Clean split between right AI column vs left interactive box:**
     - **`/story new` (and `/story <beat|lens>`, `/story next`):** triggers a fresh story **directly in the right-side AI column** — immediately displaying a subtle in-column status banner (`Writing a fresh story… · digging into 0x5263..e148` or `Rolling the dice for a fresh story…`) while keeping the left interactive box on whatever the user was viewing (Plaza, `/contract`, `/peers`, or an earlier story!). Once the new card lands, the right AI column updates in place.
     - **`/story` (or `/story full`, `/story <1..6>`):** opens the **full Story & Forensic Dossier view** in the left interactive box — full prose, decoded contract/tx evidence summary, concrete lookup pointers (full `0x` address, selectors, token/NFT hints), and `Ctrl+D` showing the exact dice roll, forensic dossier JSON, and LLM latency/trace metadata.
     - **`/story list`:** lists session stories in the left interactive box with `#`, `Src` (`LLM`/`FB`), `Beat`, `Headline`, and `Age`.
   - Keep the AI column footer crisp: `> /story (full dossier) · /story new (fresh angle)` (plus the story's concrete lookup command when present).

---

#### Pillar 3: Guided Randomness ("Weighted Dice" Story Director) & De-Biased Signal Selection
Stop repeating the same top item or macro boilerplate — let Ethy genuinely *wander and stumble upon* varied, surprising corners of the chain:

1. **Candidate Pool of Distinct Story Beats (`src/ai/storyBeats.ts` + `src/ai/storyDirector.ts`):**
   - Replace `pickQuietLead()` / `pickSignalLead()` single-winner determinism with a **multi-beat candidate generator** drawing from the live 64-block window, recent blocks, hot/rising/newly-deployed contracts, and slot trends:
     - `contract_deep_dive` — pick from the **top ~12 active contracts** (not just #1!), giving extra weight to contracts with **custom/unknown selectors**, freshly seen proxies with resolved implementations, high gas/write intensity, or high caller concentration.
     - `newborn_contract` — recently deployed contract (`birth` moment or BAL code creation), paired with immediate bytecode reverse-engineering and first-caller context.
     - `call_pattern_mystery` — notable call/event choreography, high revert rate / bot skirmish (`revert`), multi-contract touch chains, or unusual selector concentration (e.g., repeated `mint`, `claim`, `swap`, batch calls, or unknown selector bursts).
     - `storage_slot_pulse` — hot storage slot showing `monotonic_up`, `monotonic_down`, `oscillating`, or `step_jump` trend, paired with its owning contract's bytecode/ABI clues.
     - `tx_or_address_oddity` — standout value transfer (`whale`), UTF-8 calldata memo / proposer graffiti (`graffiti_note`), dormant veteran awakening (`veteran`), or unusual tx-type mix.
     - `protocol_feature_spot` — EIP-7702 delegations, EIP-1967/1167 proxies, L2 blob batches, ERC-4337 `handleOps` — **capped as one equal category** among the 6 beats, never dominating the stream.
2. **Weighted Stochastic Selection ("Weighted Dice"):**
   - Compute `effectiveWeight(candidate) = baseScore * noveltyBoost * addressCooldown * beatCooldown * archetypeCooldown`:
     - Strong suppression (`0.05×` or exclude) for any `address` or `subjectKey` featured in the last `5` stories (unless a genuine major escalation happened).
     - Moderate diversity decay (`0.25×`–`0.5×`) for repeating the same `beatKind` or `archetype` back-to-back.
     - Mild novelty bonus (`1.3×`–`1.6×`) for contracts never seen before in the persistent Contract Dossier DB or contracts whose call pattern shifted since last seen.
   - Sample from the top-`K` (`K = 6..8`) candidates using temperature-scaled weighted random selection (`roll ∈ [0, 1)`) with an **injectable RNG** (`rng?: () => number`, defaulting to `Math.random`) so unit tests remain 100% deterministic while live runs feel genuinely exploratory and unpredictable!
   - Record the full candidate table + weights + roll into `ai-runs.jsonl` so every story choice is auditable.
3. **Eliminate the Two Live Biases & Kill the Macro-Stats Opener:**
   - **Remove Sepolia `+5` lore lock-in (`src/ai/ethereumLore.ts:199`):** delete the unconditional `score += 5` for `sepolia_testnet_rehearsal`. Keep `sepolia_testnet_rehearsal` as an ordinary low-weight card only when genuinely relevant (and respect recent repeat cooldown strictly — never pick a lore card used in the last `3` stories). Pass Sepolia testnet context as a 1-line framing reminder in the system prompt instead of a headline-stealing lore card.
   - **Demote EIP-7702 bias:**
     - Reorder `MOMENT_PRIORITY` (`src/ai/storyBrief.ts`) so `eip7702` sits **below** `birth`, `choreography`, `revert`, `whale`, `veteran`, and `graffiti_note`.
     - Raise `delegation_surge` thresholds in `src/economy/signalDetector.ts` (e.g. require a genuine burst well above window baseline, not just 3–5 routine Sepolia auths) and cap its base score so routine EIP-7702 activity does not crowd out contract/tx discoveries.
   - **Ban the robotic `"On SEPOLIA, base fee sits near..."` opener:**
     - Remove it from `storyFallback.ts` **and** explicitly instruct the LLM never to open by reciting base fee, block fullness, or TPS (the Economy cockpit box already displays those).
     - Fix `storyFallback.ts` so fallback notes open directly on the selected beat's specific artifact/contract clues, never duplicate `historicalEcho` in both `body` and `Echo`, and clearly surface the beat's concrete address/selector clues.

---

#### Pillar 4: Deep Contract Forensics Engine & Persistent Local Contract Dossier DB
Give Ethy real reverse-engineering depth — 100% local, zero third-party network calls, zero new runtime npm dependencies — and let that knowledge compound across sessions:

1. **Deep Static Bytecode Forensics (`src/contracts/contractForensics.ts`):**
   Extend existing `fingerprintBytecode()` (`src/contracts/bytecodeFingerprint.ts`) + `signatureCatalog.ts` with:
   - **Expanded local signature & event catalog (`signatureCatalog.ts`):** broaden zero-dep built-in 4-byte selectors, event topics, and common custom errors across:
     - ERC-20 / ERC-4626 vaults / Permit2 / WETH
     - ERC-721 / ERC-1155 NFTs (`mint`, `safeMint`, `tokenURI`, `uri`, `royaltyInfo`, Seaport/marketplace `fulfill*`)
     - DEX / AMM / Routers / Lending (`swap`, `exactInput*`, `addLiquidity`, `supply`, `borrow`, `repay`, `liquidateCall`, `flashLoan`)
     - Account Abstraction / Smart Wallets / Multisig (`handleOps`, `validateUserOp`, `execTransaction`, `executeBatch`, `isValidSignature`)
     - Governance / Bridges / Relayers / Oracles / VRF (`propose`, `castVote`, `relayMessage`, `sendMessage`, `latestRoundData`, `fulfillRandomWords`, `claim`, `drip`, `faucet`)
     - Admin / Upgradeability (`upgradeTo`, `upgradeToAndCall`, `owner`, `transferOwnership`, `pause`, `unpause`, `grantRole`, batch callers).
   - **Dispatcher selector split:** separate `knownSelectors` (human names + signatures) from `unknownSelectors` (raw `0x????????` selectors present in the dispatcher — signals custom app logic).
   - **Embedded `PUSH20` address extraction:** scan runtime bytecode for non-trivial 20-byte address literals (filtering out bitmasks like `0x00..00`, `0xff..ff`, precompile addresses `<= 0xff`, and `0xdead`), annotating any that match `knownContracts` or active contracts in the window (reveals hardcoded routers, tokens, treasuries, factories, or libraries!).
   - **Embedded printable ASCII/UTF-8 string & compiler metadata extraction:** extract meaningful ASCII strings (`>= 5` chars, e.g. Solidity `require` error messages, EIP-712 domain/contract names, URLs, role strings) and detect Solidity/Vyper metadata tail bytes (e.g., `solc 0.8.28`, content-hash marker) to help identify what kind of contract it is.
   - **Automatic proxy implementation resolution:** when a contract is `EIP-1967`, `EIP-1967-Beacon`, `EIP-1167`, or `EIP-7702`, automatically resolve the implementation/target address from `FlatStateManager` / cold storage and run the same forensic pass on the **implementation bytecode** — never stopping at *"0.1 KB EIP-1967 Proxy"*!
   - **Opcode & structural capability summary:** detect factory capability (`CREATE`/`CREATE2`), external calls (`CALL`/`STATICCALL`/`DELEGATECALL`), transient storage (`TSTORE`/`TLOAD`), blob awareness (`BLOBHASH`), `SELFDESTRUCT`, and precompile calls (`ecrecover`, `sha256`, `modexp`, `bn256`, `p256`).

2. **Live 64-Block Call-Pattern & Behavioral Synthesis (`src/economy/economyDataManager.ts` + `contractForensics.ts`):**
   - Track lightweight per-contract behavioral aggregates over the rolling 64-block window (strictly bounded memory caps, matching existing `ECONOMY_ADDRESS_MAP_CAP`):
     - `uniqueCallers` count + top caller share (distinguishes *"1 bot/keeper firing 94% of calls"* from *"29 distinct wallets interacting"*).
     - Per-selector call count + **revert count** (reveals failing loops, access-control probes, or racing bots).
     - ETH value moved (`totalValueWei`, `nonzeroValueTxCount`) and gas profile (`avgGasUsed`, `maxGasUsed`).
     - Co-touched downstream/upstream contracts (who calls it and what it touches in the same tx/BAL) + top emitted event names + up to 3 decoded call/event previews.
     - Hot storage slots written on this contract + any `SlotTrendTracker` classification (`monotonic_up`, `oscillating`, `step_jump`).

3. **Targeted Local EVM View Probes (`EthySandbox`):**
   - Based on the contract's detected selectors/interfaces, run a bounded set (max `4` probes, `<= 100 ms` total budget) of read-only `eth_call` probes locally:
     - Token / NFT: `name()`, `symbol()`, `decimals()`, `totalSupply()`, `tokenURI(1)` / `baseURI()`.
     - Governance / Admin / Proxy: `owner()`, `paused()`, `version()`, `implementation()`.
     - DEX / Oracle / AA: `token0()`, `token1()`, `getReserves()`, `latestRoundData()`, `entryPoint()`.
   - Cache probe results (including negative misses) in the persistent dossier so Ethy never re-probes the same unchanged contract repeatedly.

4. **Persistent Local Contract Dossier Store (`src/contracts/contractDossierStore.ts`):**
   - Stored per network at `<networkDir>/contract-dossiers.json` (atomic temp-file + rename, debounced async flush, zero new npm dependencies, strict LRU cap e.g. `2,000` entries).
   - Keyed by lowercase `address`, storing `codeHash` (and `implAddress` + `implCodeHash` for proxies) so bytecode upgrades automatically trigger a fresh static + probe refresh while preserving `previousHypotheses` history!
   - Fields persisted per contract:
     - `address`, `codeHash`, `bytecodeSize`, `compilerHint`, `proxyKind`, `implAddress`, `implCodeHash`
     - `archetype`, `confidence`, `knownSelectors`, `unknownSelectorCount`, `embeddedStrings` (capped, e.g. top 8), `embeddedAddresses` (capped, e.g. top 6), `opcodeFlags`
     - `probes`: `{ name?, symbol?, decimals?, totalSupply?, owner?, paused?, version?, tokenUriSample?, token0?, token1?, probedAtBlock }`
     - `aiNotes`: `{ summary?, hypothesis?, tags?: string[], updatedAtMs, modelLabel? }` (compact one-line hypothesis written back after an LLM deep-dive story!)
     - `firstSeenBlock`, `lastSeenBlock`, `timesFeatured`, `lastFeaturedAtMs`
   - Expose dossier data to both the Storyteller **and** `/contract <addr>` (so users who run `/contract 0x…` after reading a story also see the rich reverse-engineered dossier!).

---

#### Pillar 5: "Beyond the Obvious" Focused Investigator → Storyteller Pipeline
Redesign the prompt and execution pipeline so even a compact `Qwen3.5-2B` model (and larger local Ollama models) produces vivid, specific, deeply grounded stories:

1. **Deterministic Pre-Investigation Before the LLM Speaks (1-Turn Fast Path for Compact Models, Optional Tool Hop for Rich Models):**
   - Instead of forcing `Qwen3.5-2B` to parse a sprawling macro JSON dump and guess tool calls in a 256-token JSON scout turn (which frequently failed or skipped tools):
     1. **Weighted Dice Director** picks **one concrete beat** + primary target (`address` / `tx` / `slot` / `moment`).
     2. **Forensic Dossier Builder** deterministically gathers deep local evidence for *that one subject* (checking/updating `ContractDossierStore`, resolving proxy implementation, decoding selectors/strings/embedded addresses, summarizing 64-block caller/calldata/revert patterns, running budgeted sandbox view probes) in `<150 ms`.
     3. **Storyteller LLM turn** receives a **laser-focused, compact dossier** for that single subject (plus optional 1-line prior dossier memory if Ethy investigated this contract earlier, and at most 1 *truly relevant* lore card — `0` lore cards if none fits cleanly!).
     4. For `rich` models (`7B+`), keep the optional 1-hop scout/extra-tool capability (e.g. `inspect_storage_slot` or `inspect_account` on a top caller) when the dossier highlights an open clue.
2. **Human Storyteller Voice & "Let Me Look This Up!" Output Contract:**
   - **Voice rules:**
     - **Open in media res** on the concrete thing stumbled upon — NEVER open with base fee, block fullness, TPS, or `"On SEPOLIA..."` summaries.
     - **Explain what the clues point to:** weave bytecode selectors, revert/embedded strings, proxy impl, caller concentration (single bot vs crowd), and revert rate into a clear, honest hypothesis (*"One plausible reading is…"*).
     - **Stay honest:** never invent protocol names not present in `knownContracts`, `probes.name/symbol`, or `embeddedStrings`; never fabricate facts.
     - **Give concrete lookup handles (`POINTER` / `COMMAND`):** include 1–2 concrete things the user can inspect right now (e.g. `/contract 0x5263..e148`, decoded selector / token name / embedded string / implementation address) so the user feels rewarded with a real lead.
   - **Dossier write-back:** after a successful LLM story on a contract beat, persist a concise `aiNotes` summary/hypothesis + `timesFeatured += 1` back into `ContractDossierStore` so future stories build cumulative memory rather than repeating the same introduction.
3. **Structured Output Resilience (`parseStoryOutput.ts`):**
   - Support clean sectioned sections (`HEADLINE`, `STORY`, `HYPOTHESIS` / `ANGLE`, `POINTER` / `CURIOSITY`, `COMMAND`) with generous tolerance for markdown formatting, bold headings, and minor model variations, while logging raw output on any parse miss into `ai-runs.jsonl`.

---

### 1.3 Acceptance Criteria & Verification Gates

1. **Zero Silent AI Failures & Grounded Logs:**
   - Every live/mock autonomous cycle, `/story new`, and interactive NL turn appends a valid JSON line to `<networkDir>/logs/ai-runs.jsonl` containing director candidate weights + dice roll, dossier/tool timings, LLM request/response stats, exact `errorKind`/`errorMessage` on failure, and `source: 'llm' | 'fallback'`.
   - `llama-server` stderr is captured to `<networkDir>/logs/llama-server.log` (bounded) and never silently discarded.
   - `ethy.log` emits `[ai]` events for runner lifecycle and every story/fallback outcome.
   - `/ai log` renders recent run rows in TUI; `npm run ai:inspect -- <dataDir>` outputs a clear diagnostic summary from real or synthetic `ai-runs.jsonl`.
2. **No More `/story new` Freeze & Clean Right-Column UX:**
   - Automated TUI session test verifies `/story new` does **not** overwrite the left interactive box with a stuck `"Writing a fresh story…"` placeholder across repeated `draw()` / `applyLiveSlashRefresh()` ticks; instead, the right AI column shows a live generating status and swaps in the new story when ready.
   - `/story` / `/story full` / `/story <n>` opens the complete story + forensic dossier in the left box with `Ctrl+D` debug trace.
   - AI column header clearly distinguishes `[STORY · <model>]` from `[FALLBACK · <reason>]`.
3. **Guided Randomness & De-Biased Selection:**
   - Unit tests with seeded RNG prove `directStory()` / `pickStoryBeat()` explores multiple contracts and beat kinds across consecutive cycles rather than repeating #1, strongly suppresses recently featured addresses/beats, and never locks onto `sepolia_testnet_rehearsal` or routine EIP-7702 traffic.
   - Neither LLM prompts nor `storyFallback.ts` emit the robotic `"On SEPOLIA, base fee sits near..."` opener or duplicate `Echo` text inside `body`.
4. **Deep Contract Forensics & Persistent Dossier DB:**
   - Unit tests verify static extraction of known vs unknown selectors, embedded `PUSH20` addresses, printable ASCII/revert strings, compiler metadata hints, proxy implementation resolution (EIP-1967 / EIP-1167 / EIP-7702), 64-block caller-concentration/revert synthesis, and budgeted sandbox view probes.
   - Persistence tests verify `ContractDossierStore` saves atomically, reloads across restarts, invalidates static/probe fields on `codeHash` change while preserving history, enforces LRU cap, and feeds both the Storyteller and `/contract`.
5. **Real-World Live Smoke Verification (`ai:smoke` + `node1` check):**
   - `npm run tsc`, `npm test`, `npm run spellcheck`, and `npm run build` in `packages/ethy` are 100% green with zero new runtime dependencies (`dependencies.mdc` compliant).
   - Updated `ai:smoke` (offline mock + optional live managed `Qwen3.5-2B` run) verifies at least 3 consecutive varied LLM stories with real forensic dossiers and prints the `ai:inspect` report confirming `source=llm`, distinct subjects/beats, and zero `"Sepolia rehearsals"` loops.

---

## 2. Concrete Implementation Plan (Planner — Grok 4.7)

*To be filled in by Grok 4.7 after inspecting the repository.*

---

## 3. Implementation Notes & Deviations (Implementer — Composer 2.5)

*To be filled in by Composer 2.5 upon implementation.*
