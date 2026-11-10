# WP-07c: Local LLM Dual-Mode Engine — 30–60s Read-Only Situational Pulse, Interactive `IntentEngine`, Privacy-Scoped Prompt Memory & Dynamic UI Composition

- **Status:** `DONE`
- **Dependencies:** `WP-07a`, `WP-07b`
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Holistic Scope & Architectural Requirements

### Goal
Connect a local ~1 GB instruct LLM (`llama-server` or any local OpenAI-compatible HTTP endpoint on `127.0.0.1`, zero npm dependencies) to the domain & UI foundation built in `WP-07a` and `WP-07b`, operating in **two distinct, permission-isolated modes**:
1. **Mode 1 — Autonomous Read-Only Situational Pulse (`AiPulseNarrator`, every 30–60s + lifecycle transitions):**
   - Feeds `Readonly<EthyDomainSnapshots>` (`pulse`, `economy`, `p2p`, `snap`, `head`) + `SystemUsageGuide` into the local LLM in the background (`permission: 'read'` only — zero write/action tools).
   - Generates a fresh, high-signal **`<= 280`-character prose briefing** for the vertically-centered **`AI Overview`** box (`WP-07b`), guiding the user from startup/resume → sync progress & troubleshooting hints → live Ethereum economic commentary once synced.
2. **Mode 2 — Interactive User `IntentEngine` & Dynamic `UIComponent` Composer (on user `Enter`):**
   - Routes natural-language questions and commands (`"Can you give me the most used peers?"`, `"Which contracts are burning the most gas?"`) using `<ethy_state>` + `EthyDomainSnapshots` + grammar-constrained JSON schema output:
     - Returns a concise **`viewTitle`** (`"Most used peers"`) synchronized with the Interaction View box header,
     - Invokes a registered tool **or** composes a custom `TableUIComponent` / `KeyValueUIComponent` view on the fly from the domain snapshots, and
     - Updates the `AI Overview` box with a direct answer or follow-up hint.

---

## 2. Deep Architectural Design

### 2.1 Dual-Mode Permission Boundary (`read` Pulse vs `read/write` User Prompt)
| Mode | Trigger | Context Provided to LLM | Allowed Output / Permissions | Target UI Zone |
| --- | --- | --- | --- | --- |
| **1. Background Situational Pulse** | Startup (`welcome`), phase change, or 45s timer (`AI_PULSE_INTERVAL_MS = 45_000`) | `Readonly<EthyDomainSnapshots>` + `SystemUsageGuide` (slash commands, `Tab`, `Ctrl+D`) + `previousOverview` (to avoid repeating the exact same sentence) | **`read`-only**: JSON `{ overviewText: string }` strictly capped at **`<= 280` chars**. Cannot call any mutating tool (`dropPeer`, `pauseSnapSync`, etc.). | Vertically-centered **`AI Overview`** box (middle-right) |
| **2. Interactive User Query** | User submits natural language at `● ethy >` | `<ethy_state>` + `Readonly<EthyDomainSnapshots>` + unlocked tool schemas (`read` + guarded `write`) + **Privacy-Scoped Ephemeral Turn Context** | JSON `{ viewTitle: string, action: ToolCall \| ComposedUIComponent, overviewNote?: string }` | **Interaction View** box (left 2/3, with title = `viewTitle`) + optional note in **`AI Overview`** |

### 2.2 What the Background Pulse Knows & Prioritizes Across Node Stages
The system prompt for `AiPulseNarrator` gives the model a clear situational playbook + a compact `SystemUsageGuide` cheat sheet so its 250–280 char updates feel like a sharp protocol copilot:
1. **At Startup / Warmup (`BOOTING` / `P2P_WARMUP`):**
   - Welcomes the user, states whether we are starting fresh or resuming a saved snapshot (`#P`, `%` done, or bridging `N` BALs), and gives a relevant tip (`"Tip: press Enter to open /peers or Ctrl+D for RLPx discovery stats"`).
2. **During `SNAP_SYNCING` (Accounts → Bytecode → Storage):**
   - Reports sync velocity and ETA (`"Syncing Sepolia accounts at 62k/s (~11m left)"` or `"Bytecode 713k/751k, storage 36k/57k"`).
   - If `economy.blocksObserved > 0` (from parallel `eth/71` BAL streaming!), blends in a live peek at the network (`"Meanwhile, 21 BALs streamed — base fee is 2.4 Gwei ↑ with 118 tx/blk"`).
   - If a bucket is stalled or peer count is low (`<= 1`), proactively suggests how to diagnose (`"Only 1 snap peer active — try /peers or Ctrl+D to inspect dial holds"`).
3. **During `BAL_CATCHUP` & `HEAD_FOLLOWING`:**
   - Shifts primary attention to the **Ethereum Economy** (`ETHEconomyDataManager`):
     - Highlights fee trends (`baseFeePerGasGwei` `↑`/`↓`), transaction velocity (`TPS`, `ETH` volume), and the hottest contracts in the 64-block window, suggesting `/economy` or `/account <hotContract>` to drill in!

### 2.3 Privacy-First Prompt Memory Policy (Answering the Past-Prompts Question)
Should the LLM know about the user's past prompts?
- **Privacy & Context Design:**
  1. **Zero Disk Persistence of Prompts to AI:** User prompts are **never** written to disk logs (`ethy.log` / `events.jsonl`) or sent to any remote cloud API (`LocalHttpIntentEngine` strictly enforces loopback/local-host URLs by default unless explicitly overridden).
  2. **Background Pulse is 100% Prompt-Free:** The 30–60s background pulse **never** receives user prompt history — it only sees `EthyDomainSnapshots` and its own `previousOverview`.
  3. **Ephemeral 3-Turn Session Ring for Interactive Follow-Ups (`--ai-memory off|ephemeral`, default `ephemeral`):**
     - When the user types an interactive follow-up like *"What about the second contract?"* or *"Drop the slowest one"*, having the last **2–3 `{ userQuery, viewTitle, toolCalled }` pairs in RAM only** (cleared immediately on exit or `/clear`) makes multi-step exploration natural without accumulating a long profile.
     - Users who want strict zero-memory per turn can pass `--no-ai-history` (or `/ai stateless`).

### 2.4 Dynamic On-The-Fly UI Composition (`ComposedUIComponent`)
In addition to calling pre-built slash tools (`/peers`, `/buckets`, `/economy`, `/bal`, `/account`), the grammar-constrained JSON schema allows the LLM to return a **`composed_view`** specification when the user asks a custom analytical question (e.g. *"Compare Nethermind vs Geth peers"* or *"Show me only contracts with >10 storage writes"*):
- The LLM outputs:
  ```json
  {
    "viewTitle": "Nethermind vs Geth peers",
    "kind": "table",
    "headers": ["Client Family", "Peers", "Avg Latency", "Snap OK"],
    "rows": [
      ["Nethermind", "5", "62 ms", "18,340"],
      ["Geth", "2", "145 ms", "1,950"]
    ]
  }
  ```
- Which renders directly through `TableUIComponent` / `KeyValueUIComponent` inside the rounded Interaction View box with `╭─ Nethermind vs Geth peers ─╮`!

### 2.5 Deterministic CI Fixture Recorder & Replay (`src/ai/fixtureEngine.ts`)
- Supports `--record-fixture <path>` during live local LLM testing and replays recorded fixtures in Vitest (`test/aiEngine.spec.ts`) in `< 5ms` with zero network/model dependencies in CI, falling back cleanly to `DeterministicIntentEngine` + `buildDeterministicOverview` when no local LLM server is running.

---

## 3. Acceptance Criteria (`WP-07c`)

- [x] Zero new runtime dependencies added to `package.json`.
- [x] `AiPulseNarrator` polls the local LLM every 30–60s (and on phase transitions) with **read-only** `EthyDomainSnapshots` + `SystemUsageGuide`, enforcing `<= 280` chars and updating the vertically-centered `AI Overview` box (with seamless fallback to `buildDeterministicOverview` when offline).
- [x] `LocalHttpIntentEngine` routes user natural-language queries, sets the synchronized Interaction View box title (`"Can you give me the most used peers?"` → `"Most used peers"`), supports both tool calls and on-the-fly `TableUIComponent` / `KeyValueUIComponent` composition, and enforces `read` vs `write` tool gating.
- [x] Ephemeral 3-turn RAM-only prompt context works for follow-up questions and respects `--no-ai-history`, while never exposing user prompts to disk logs or the background pulse.
- [x] `npm run tsc`, `npm test`, and `npm run spellcheck` pass in `@ethereumjs/ethy` with 100% offline deterministic CI fixtures.

---

## 4. Concrete Implementation Plan (Planner — Grok 4.7)

**Zero new npm dependencies.** HTTP via `globalThis.fetch` (Node `>=22`). CI never dials a model server.

### 4.1 Baseline (WP-07a / WP-07b shipped)

| Area | Current code |
| --- | --- |
| Read-only snapshots | [`readDomainSnapshots`](../src/domains/domainManagers.ts) → `EthyDomainSnapshots` (no write handles) |
| AI Overview | [`session.ts`](../src/tui/session.ts) → [`buildDeterministicOverview`](../src/ai/overviewNarrator.ts) (`MAX_AI_OVERVIEW_CHARS = 280`); refresh on welcome, phase change, **30s** timer — not inside `renderFrame` |
| Intent routing | Synchronous [`IntentEngine.handle`](../src/ai/intentEngine.ts); [`DeterministicIntentEngine`](../src/ai/deterministicEngine.ts) slash + keywords |
| Interaction title | [`interactionViewTitle`](../src/tui/interactionContent.ts): slash cmd or first five words of NL query — no LLM `viewTitle` yet |
| AI pill | `partial` / `Slash/Rule Mode` in [`createSpine`](../src/spine/createSpine.ts) |
| Logging | [`EthyFlightRecorder`](../src/persist/flightRecorder.ts): diagnostics only — prompts must not appear in `ethy.log` / `events.jsonl` |

### 4.2 Design refinements (Decision **D-100**)

1. **Two clocks:** Without `--llm-url`, keep the **30s** deterministic narrator (offline box never blank). With URL: first paint stays deterministic, then `AiPulseNarrator` updates on phase change and every `AI_PULSE_INTERVAL_MS = 45_000`. Failed/slow model → keep or restore deterministic prose.
2. **Grounded compose (default grammar):** Per **D-004**, small models miscount columns. Intent JSON prefers `{ type: "tool", name: "peers" }` or `{ type: "compose", dataset: "peersByClient", … }`; TypeScript builds every cell from `EthySpine` / snapshots. **`literal`** table/KV is a clamped fallback only (≤8 cols, ≤16 rows, ≤48 chars/cell, strip control chars + ANSI). WP §2.4 “Nethermind vs Geth” → dataset `peersByClient`, not invented numbers.
3. **Slash never hits the model:** `/…`, deep-view `Enter`, keyword fallback stay on `DeterministicIntentEngine`. Natural language uses HTTP only when the endpoint is healthy.
4. **Async `handle`:** `IntentEngine.handle(): Promise<IntentResult>`. Deterministic path returns `Promise.resolve`. TUI uses a generation counter: fire promise, ignore stale replies; do not block the raw key loop on `await`.
5. **Privacy:** Prompts RAM-only except developer `--record-fixture <path>`. Up-arrow `view.history` is local editor recall, not sent to the model. `/clear` clears the 3-turn AI ring only. Pulse never sees turn memory.

### 4.3 CLI (`src/cli/args.ts`, `printEthyUsage`)

| Flag | Behavior |
| --- | --- |
| `--llm-url <base>` | OpenAI-compatible base (e.g. `http://127.0.0.1:8080`). Absent → deterministic-only overview + NL keyword router. |
| `--llm-allow-remote` | Required for non-loopback hosts; else only `127.0.0.1`, `localhost`, `::1`. |
| `--ai-memory ephemeral\|off` | Default `ephemeral`. `--no-ai-history` aliases `off`. |
| `--record-fixture <path>` | Append JSONL pulse/intent exchanges (opt-in; not flight recorder). |

Wire through [`createEthyNode`](../src/core/createEthyNode.ts). **Do not** start pulse on `--headless` or `--demo`.

### 4.4 New / changed modules (`src/ai/`)

| File | Responsibility |
| --- | --- |
| `llmClient.ts` | `assertLoopbackUrl`; `POST {base}/v1/chat/completions` (`response_format: { type: "json_object" }`); timeouts pulse 8s / intent 12s; health `GET {base}/v1/models` 1.5s. |
| `fixtureEngine.ts` | `LlmTransport.complete(kind, body) → string`. `FetchLlmTransport`, `RecordingTransport`, `FixtureReplayTransport` (CI, no `fetch`). |
| `usagePlaybook.ts` | `ETHY_USAGE_PLAYBOOK`: slashes from [`SLASH_COMMANDS`](../src/ai/slashComplete.ts), Tab / Enter / Ctrl+D; stage priorities from WP §2.2. |
| `compactContext.ts` | Compact JSON for prompts: cap peers 16, top contracts 5, recent blocks 4; no enodes / raw logs. |
| `composeView.ts` | Datasets: `peers`, `peersByClient`, `buckets`, `economy`, `topContracts` (+ optional `minWrites`), `diag`, `literal` (clamped) → `WidgetSpec` + `viewTitle`. |
| `toolCatalog.ts` | Gated tool names from [`SLASH_TOOL_REGISTRY`](../src/domains/toolRegistry.ts); locked `head` omits `bal` / `account` / `simulate`; write tools only on interactive prompt, never pulse. |
| `turnMemory.ts` | Ring of 3 `{ userQuery, viewTitle, toolCalled }`; `clear()`, `snapshot()`. |
| `pulseNarrator.ts` | `AiPulseNarrator`: read-only JSON `{ overviewText }`; no turn ring; abort in-flight on user submit; unhealthy → deterministic; AI pill `ready` / `Local LLM` when healthy. |
| `localHttpEngine.ts` | `LocalHttpIntentEngine`: schema + catalog; user blob = `<ethy_state>` + snapshots + optional turns + query; dispatch via shared `dispatchSlash` + `composeView`; invalid → deterministic fallback. |
| `hybridEngine.ts` | `HybridIntentEngine` on the node: `/` → deterministic; `/clear`, `/ai stateless\|ephemeral`; NL when healthy; `setDisconnectPeer` forwarded. |

Refactor [`deterministicEngine.ts`](../src/ai/deterministicEngine.ts): export package-visible `dispatchSlash` (or `routeSlashWidget`) for tool dispatch without duplicating switches.

Add `/clear`, `/ai ` to `SLASH_COMMANDS` + read-only registry entries (session controls, not write actions).

### 4.5 Types & TUI wiring

- [`intentEngine.ts`](../src/ai/intentEngine.ts): `IntentResult` adds optional `viewTitle`, `overviewNote` (clamp 280).
- [`spine/types.ts`](../src/spine/types.ts): `TuiViewState.interactionTitle?: string`.
- [`interactionContent.ts`](../src/tui/interactionContent.ts): prefer `interactionTitle` when set (NL); slash keeps `` `/cmd · title` `` (`interactionTitle` unset).
- [`session.ts`](../src/tui/session.ts): start/stop `AiPulseNarrator` with session; `notePhase` schedules pulse without blocking `draw`; submit uses generation-guarded `void engine.handle(…).then(…)`; in-flight NL → overview `Asking the local model…`; cleanup aborts controllers + drops ring.
- [`main.ts`](../src/cli/main.ts): stop casting to `DeterministicIntentEngine` — use `HybridIntentEngine.setDisconnectPeer` or small interface.

### 4.6 Data flow

```text
draw() ──► buildDeterministicOverview (always when no LLM or unhealthy)
         └► AiPulseNarrator ── readDomainSnapshots ── loopback HTTP ── view.aiOverview

Enter ──► HybridIntentEngine ── slash ── DeterministicIntentEngine
                              └─ NL ── LocalHttpIntentEngine ── tool | composeView ── WidgetSpec + interactionTitle
```

### 4.7 Tests

| File | Coverage |
| --- | --- |
| **New** `test/aiEngine.spec.ts` | `FixtureReplayTransport` + stub `fetch` throw; loopback guard; pulse payload (no user history); clamp 280; intent `viewTitle` + grounded rows; `peersByClient`; literal clip/sanitize; capability gating; turn memory on/off; replay &lt;5ms; no prompts in flight-recorder diagnostics |
| `test/intent.spec.ts`, `test/balSync.spec.ts` | `await engine.handle(…)` |
| `test/args.spec.ts` | New CLI flags |

### 4.8 Docs (implementer)

- [`ARCHITECTURE.md`](../ARCHITECTURE.md) §4: `HybridIntentEngine`, `LocalHttpIntentEngine`, 45s pulse, loopback default.
- [`.cursor/rules/ethy-architecture.mdc`](../../../.cursor/rules/ethy-architecture.mdc) §2: deterministic overview until `--llm-url` + healthy pulse.

### 4.9 Out of scope

WP-07d contract lens, new dependencies, embedded GGUF, real EVM `/simulate`, economy ingest changes, prompt text in `ethy.log` / `events.jsonl`.

### 4.10 Gates

`npm run tsc`, `npm test`, `npm run spellcheck` in `packages/ethy`. Prefer rewording over cspell dictionary adds for product names.

### 4.11 Suggested implementation order

1. `llmClient` + `fixtureEngine` + unit tests (offline).
2. `IntentEngine` async + `dispatchSlash` refactor; update existing intent tests.
3. `toolCatalog`, `compactContext`, `composeView`, `usagePlaybook`.
4. `turnMemory`, `localHttpEngine`, `hybridEngine`; wire `createEthyNode` + CLI args.
5. `pulseNarrator` + session/title types; AI pill transitions.
6. `test/aiEngine.spec.ts`; ARCHITECTURE + ethy-architecture rule touch-up.

---

## 5. Implementation Notes & Deviations (Implementer — Composer 2.5)

**Status:** Shipped 2026-11-09. Gates: `npm run tsc`, `npm test` (238), `npm run spellcheck:ts`.

- `HybridIntentEngine` is always the node `intentEngine` (deterministic path when no URL or unhealthy probe).
- Grounded compose datasets live in `composeView.ts`; model literal tables are clamped.
- `spine.llmPulseReady` preserves AI pill `ready` / `Local LLM` across `deriveCapabilities`.
- Pulse interval `AI_PULSE_INTERVAL_MS = 45_000`; offline overview refresh stays 30s when `--llm-url` absent.
