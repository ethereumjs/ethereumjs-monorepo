# WP-07c: Local LLM Dual-Mode Engine — 30–60s Read-Only Situational Pulse, Interactive `IntentEngine`, Privacy-Scoped Prompt Memory & Dynamic UI Composition

- **Status:** `BLOCKED_BY_WP-07b`
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

- [ ] Zero new runtime dependencies added to `package.json`.
- [ ] `AiPulseNarrator` polls the local LLM every 30–60s (and on phase transitions) with **read-only** `EthyDomainSnapshots` + `SystemUsageGuide`, enforcing `<= 280` chars and updating the vertically-centered `AI Overview` box (with seamless fallback to `buildDeterministicOverview` when offline).
- [ ] `LocalHttpIntentEngine` routes user natural-language queries, sets the synchronized Interaction View box title (`"Can you give me the most used peers?"` → `"Most used peers"`), supports both tool calls and on-the-fly `TableUIComponent` / `KeyValueUIComponent` composition, and enforces `read` vs `write` tool gating.
- [ ] Ephemeral 3-turn RAM-only prompt context works for follow-up questions and respects `--no-ai-history`, while never exposing user prompts to disk logs or the background pulse.
- [ ] `npm run tsc`, `npm test`, and `npm run spellcheck` pass in `@ethereumjs/ethy` with 100% offline deterministic CI fixtures.

---

## 4. Concrete Implementation Plan (Planner — Grok 4.7)

*(To be filled by Grok 4.7 during planning)*

---

## 5. Implementation Notes & Deviations (Implementer — Composer 2.5)

*(To be filled by Composer 2.5 during implementation)*
