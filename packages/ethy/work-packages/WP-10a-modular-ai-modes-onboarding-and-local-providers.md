# WP-10a: Modular AI Runtime Modes (`default` · `off` · `local`), First-Run TUI Onboarding, Full-Width `No AI` Cockpit, Persistent User Config & Zero-Friction Local Providers (`Ollama` / OpenAI Loopback)

- **Status:** `DONE`
- **Series:** `WP-10` — Next-Generation LLM Integration, Capabilities & Model Strategy
  - **`WP-10a` (this package):** Modular AI runtime modes (`default` / `off` / `local`), first-open TUI choice & `/ai` live switcher, persistent `<dataDir>/config.json` with session-override CLI semantics, full-width `No AI` TUI layout, hardware feasibility probe, and zero-friction local model connectors (`Ollama` auto-discovery + OpenAI-compatible loopback fixes).
  - **`WP-10b` (Layer 1):** Deterministic Ethereum signal engine, multi-horizon time series, EIP-7702/L2-blob/BAL-slot analytics, anomaly detection, and local `name()`/`symbol()` + ENS reverse identity resolution.
  - **`WP-10c` (Layer 2):** Autonomous Chain-Detective LLM replacing the 3-domain split, novelty-gated 2-step read-only Investigation Toolbelt, AI Dispatch Feed UI, self-history journal, and opt-in prompt-history sharing.
  - **`WP-10d` (follow-up):** Default model benchmarking against `WP-10b`/`WP-10c` fixtures (`~400 MB – 1 GB`), grammar / optional QLoRA post-training pipeline, and managed built-in model runner.
- **Dependencies:** `WP-07c`, `WP-07f`, `WP-07h`, `WP-07j`, `WP-08a`, `WP-08b` (`DONE`)
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Holistic Scope & Architectural Requirements (Coordinator — Gemini 4 Carbon)

### 1.1 Architectural Motivation & Key Insights

Ethy has matured into a fast, standalone Ethereum state & economy observatory (`ETHY/0` swarm sync at `>500k acc/s`, `snap/1` + EIP-7928 BAL head tracking, default-on `:8545` JSON-RPC 2.0, on-demand EVM sandbox, and the live `/live` Ethereum Plaza) that already delivers massive value **even without an LLM**. At the same time, real-world local model testing (e.g. `Ollama` with Qwen 3 / Gemma models) surfaces four important architectural truths:

1. **AI Must Be a Cleanly Separable First-Class Choice — Never Forced (`No AI` Mode):**
   - Users on constrained hardware (older laptops, low-RAM VPS instances, battery-sensitive sessions) or strict minimalist/privacy setups should be able to run Ethy with **zero AI overhead**.
   - Today, even when `--llm-url` is omitted, Ethy still dedicates `1/3` of the lower TUI to a synthetic `╭─ ● AI ─╮` box, renders an `AI` pill in the top bar, shows `AI Examples` in `/help`, and routes non-slash prompt text through fuzzy keyword heuristics (briefly flashing `"Asking the local model…"`).
   - When `aiMode === 'off'`, the TUI should drop **every** AI vestige: the Interaction View expands across the **full 3-column cockpit width (`100%`)**, the top-bar `AI` pill and `/help` AI column disappear, and the prompt operates strictly as a crisp `/` command line.
2. **Saved Convenience Default + Clean CLI Scripting & One-Off Session Overrides:**
   - Interactive users want a **one-time choice on first application open** that is remembered automatically on every subsequent `ethy` launch (`<dataDir>/config.json`, preserved across `--fresh` state resets and shared across networks).
   - Headless/scripted installers need CLI flags (`--no-ai`, `--ai default`, `--ai local`, `--ollama [model]`) to skip the interactive prompt and seed the initial config, while power users need to temporarily override their saved default for a single session (e.g. `ethy --ollama qwen3:4b` or `ethy --no-ai`) without silently overwriting their saved preference unless `--ai-save` is passed.
3. **Zero-Friction "Own Local Model" (`Ollama` + Loopback OpenAI Servers) & Critical Wire Fixes:**
   - Many developers already run **`Ollama` (`127.0.0.1:11434`)** or **`LM Studio` (`:1234`) / `llama-server` (`:8080`)**. Connecting an existing local model should take **zero URL typing** when Ollama is running: Ethy can query Ollama's local model list (`GET /api/tags`) and let the user pick an installed model with `↑`/`↓` + `Enter`.
   - **Existing `llmClient.ts` Bug Fixes Required for Ollama & Modern Small Models:**
     - `postChatCompletion` (`src/ai/llmClient.ts:78`) currently omits the `"model"` field in `POST /v1/chat/completions`, which works on single-GGUF `llama-server` but fails with **`HTTP 400 ("model is required")`** on both **Ollama** and **LM Studio**!
     - Modern reasoning-capable small models (such as **Qwen 3**) emit `<think>...</think>` blocks by default; with `max_tokens: 120` on background pulse calls, the model can exhaust its entire token budget inside `<think>` before producing `{`, causing `parseLlmJSONObject` to fail. `llmClient.ts` must pass explicit model IDs, suppress chain-of-thought on structured JSON turns where supported, strip any residual `<think>...</think>` wrapper, and size token budgets safely.
4. **Hardware-Grounded `ManagedModelProvider` Seam for the Integrated Default Model:**
   - Delivering a convenient, curated default model (`Option 1`) remains the flagship zero-setup experience, while acknowledging hardware diversity (`RAM`, `disk`, `CPU/GPU`) and decoupling **mode/UI plumbing (`WP-10a`)** from **task definition (`WP-10b`)** and **concrete model benchmarking & runner packaging (`WP-10c`)**.
   - Inspecting `os.totalmem()`, `os.freemem()`, and `fs.statfsSync(dataDir)` at first open allows Ethy to display honest RAM/disk guidance and automatically pre-focus `Option 2 (No AI)` on low-memory machines (`< 6 GiB` RAM) while pre-focusing `Option 1` on capable machines once the `WP-10c` managed runner is active.

---

### 1.2 Detailed Design Specifications

#### Part A: Persistent User Configuration & CLI Precedence (`src/persist/userConfig.ts`, `src/cli/args.ts`)

1. **Global User Config File (`<dataDir>/config.json`):**
   - Stored at the root of `resolveEthyDataDir()` (alongside `node-key.txt`, **outside** `networks/<net>/pivots/` so `--fresh` never wipes user preferences and switching `sepolia` ↔ `mainnet` keeps the user's AI setup).
   - Schema (`schemaVersion: 1`, zero third-party deps, atomic `.tmp` + `renameSync` write):
     ```ts
     export type EthyAiMode = 'default' | 'off' | 'local'

     export type LocalLlmProviderKind = 'ollama' | 'openai-compatible'

     export interface EthyAiConfig {
       mode: EthyAiMode
       /** Active when `mode === 'local'`. */
       localProvider?: LocalLlmProviderKind
       /** Loopback or explicit remote base URL (e.g. `http://127.0.0.1:11434`). */
       baseUrl?: string
       /** Model identifier required by Ollama / LM Studio (e.g. `qwen3:1.7b`). */
       model?: string
       /** Allow non-loopback `baseUrl` when explicitly opted in. */
       allowRemote?: boolean
       /** Turn memory preference (`ephemeral` 3-turn RAM ring vs `off`). */
       memory?: 'ephemeral' | 'off'
       /** Opt-in: allow autonomous AI dispatches (`WP-10c`) to see recent RAM-only session prompts. */
       sharePromptHistory?: boolean
       /** Default model id override once WP-10d ships multiple tiers. */
       defaultModelId?: string
     }

     export interface EthyUserConfig {
       schemaVersion: 1
       updatedAt: string
       ai?: EthyAiConfig
     }
     ```
2. **Clear 4-Rule Resolution & Override Semantics (`resolveEffectiveAiConfig`):**
   - **Rule 1 — Explicit CLI Flags Override for This Session:**
     - `--ai <default|off|local>` and `--no-ai` (alias for `--ai off`)
     - `--ollama [model]` (implies `--ai local`, `localProvider: 'ollama'`, `baseUrl: 'http://127.0.0.1:11434'`, optional `model`)
     - `--llm-url <url>` + `--llm-model <name>` (implies `--ai local`, `localProvider: 'openai-compatible'`)
     - **Persistence rule:**
       - If `<dataDir>/config.json` **does not have `ai` yet** (scripted first install, e.g. `ethy --no-ai`) **OR** `--ai-save` is passed: write the resolved CLI `EthyAiConfig` to `<dataDir>/config.json` as the saved default!
       - If `<dataDir>/config.json` **already has `ai`** and `--ai-save` is **not** passed: apply the CLI flags for **this process only** without mutating `config.json` (so a user with `default` saved can test `ethy --ollama gemma3:4b` or `ethy --no-ai` once and return to their saved default next time).
   - **Rule 2 — Saved Default (`config.ai` exists, no CLI AI flags):**
     - Boot directly into `config.ai` with **zero onboarding prompt**.
   - **Rule 3 — Interactive First Open (`config.ai === undefined`, TTY session, not `--demo`, not `--headless`):**
     - Boot TUI immediately in full-width layout with `activeWidget = { kind: 'ai_onboarding' }` (also reachable anytime via `--ai-setup` or `/ai setup` / `/ai`).
     - P2P discovery and state sync start normally in the background so no sync time is lost while choosing!
   - **Rule 4 — Non-Interactive / `--headless` / `--demo` Without Config or Flags:**
     - Never block on an interactive choice; default cleanly to `mode: 'off'` (`--headless`) or lightweight deterministic demo (`--demo`, unless `--ai` / `--llm-url` is explicitly supplied).

#### Part B: Full-Width `No AI` TUI Layout & Chrome Delimiters (`src/tui/`, `src/spine/`)

When effective `spine.aiMode === 'off'` (and while the user is on the initial `ai_onboarding` screen before activating an AI mode):

1. **Band 3 Full-Width Expansion (`src/tui/lowerArea.ts`):**
   - Omit the right `1/3` `╭─ ● AI ─╮` box completely.
   - Render `leftBox` (the **Interaction View**) at **`contentWidth`** (`w0 + gap + w1 + gap + w2`, i.e. spanning beneath all three upper cockpit boxes `Economy · State · P2P`).
   - All existing views (`LiveHeadPlazaUIComponent`, `TableUIComponent`, `KeyValueUIComponent`, `DomainHelpUIComponent`, `StartPageUIComponent`) naturally receive the wider `innerRowWidth(contentWidth)` with zero frame-width drift (`lines.length === rows`, `visibleWidth === cols`).
2. **Top Bar, Start Page & Unified `/help` Delimiters:**
   - **Top Capability Bar (`src/tui/renderFrame.ts`):** Filter `'ai'` out of rendered capability pills when `spine.aiMode === 'off'` so only `Economy · State · P2P` are shown. When `spine.aiMode !== 'off'`, render `AI` (`●` ready, `◐` warming/downloading, `○` offline/error).
   - **Welcome Screen (`src/tui/components/StartPageUIComponent.ts`):** When `spine.aiMode === 'off'`, replace `Swarm Intelligence` / `ask AI` hints with pure node copy (`Press Tab for help · Enter plaza · / command`).
   - **Unified `/help` (`src/tools/help.ts`, `src/tui/components/DomainHelpUIComponent.ts`):**
     - When `spine.aiMode === 'off'`: title is `/help · Commands` (not `/help · Commands & AI`), `AI Examples` is omitted from the right column, and `/ai` is listed succinctly under `P2P` / system commands (`Configure or enable AI mode`).
3. **Strict Slash-Only Prompt Discipline (`src/tui/session.ts`, `src/ai/hybridEngine.ts`):**
   - When `spine.aiMode === 'off'`:
     - Do **not** start `AiPulseNarrator` or the 30s `overviewNarrator` timer.
     - Never display `Asking the local model…`.
     - Submitting a line that does **not** start with `/` does **not** run fuzzy English keyword matching — instead it returns a clean, non-intrusive `CommandUnavailable` / hint widget explaining that AI is disabled (`Commands start with / — press Tab for /help, or run /ai to enable a model`).

#### Part C: First-Open Onboarding & Live `/ai` Switcher (`AiOnboardingUIComponent`, `src/ai/hardwareCheck.ts`)

1. **Hardware Readiness Snapshot (`src/ai/hardwareCheck.ts`):**
   - Pure Node.js inspection (`os.totalmem()`, `os.freemem()`, `process.platform`, `process.arch`, and `fs.statfsSync(dataDir)` wrapped in `try/catch`):
     - `totalRamBytes`, `freeRamBytes`, `freeDiskBytes`
     - `lowHardware: boolean` (`totalRamBytes < 6 * 1024 ** 3` or `freeDiskBytes < 2 * 1024 ** 3`).
2. **Interactive 3-Option Selector (`AiOnboardingUIComponent`):**
   - Rendered inside the full-width Interaction View box (`╭─ Choose AI Mode ─╮`), controllable via **`↑` / `↓` + `Enter`** or direct number keys **`1` / `2` / `3`** (while `/` commands or `Esc` remain responsive):
     1. **`1. Install / use default model (<DEFAULT_MODEL_NAME>)`**
        - Subtitle explains: zero-config integrated local model, runs privately on your machine (`~<size>` download on first use).
        - Shows hardware note if `lowHardware === true` (and pre-selects Option 2 on low-RAM machines).
        - *Note on `WP-10a` → `WP-10c` seam:* `src/ai/managedModel.ts` defines the `ManagedModelProvider` interface and `DEFAULT_MANAGED_MODEL_SPEC`. Until `WP-10c` attaches the native/worker GGUF runtime and locked default model weights, if local `Ollama` is detected with the recommended model family or can serve it, bridge cleanly; otherwise display an honest `"Default embedded runner lands in WP-10c — select No AI or Own local model (Ollama) for now"` status inline without crashing or dead-ending!
     2. **`2. No AI (Pure Ethereum Client)`**
        - Subtitle explains: full-width cockpit, `/live` Plaza, JSON-RPC, and `/` slash commands only — zero model RAM, CPU, or disk usage.
     3. **`3. Connect own local model (Ollama · LM Studio · llama.cpp)`**
        - Automatically runs a fast background loopback discovery probe (`127.0.0.1:11434` Ollama `GET /api/tags`, `127.0.0.1:1234` LM Studio `GET /v1/models`, `127.0.0.1:8080` `llama-server` `GET /v1/models`) when the view opens!
        - If **Ollama models** or **local server models** are discovered, displays them directly in an inline sub-list (`↑`/`↓` + `Enter` to pick e.g. `ollama · qwen3:4b` or `lm-studio · gemma-3-4b-it` in 1–2 keystrokes!).
        - Also supports typing `/ai url http://127.0.0.1:<port> [model]` for custom ports.
3. **Live Mid-Session Switching (`/ai` Tool):**
   - `/ai` (with no args) or `/ai setup` opens the AI configuration & status card showing current mode, active provider/model, health latency, memory mode, and saved default status, allowing live switching without restarting the node!
   - Direct subcommands:
     - `/ai off` — switches immediately to `No AI` (collapses the right `AI` box to full width and saves default unless `--no-save`).
     - `/ai local [modelOrUrl]` — switches to local provider (auto-picks discovered Ollama model or matches `<model>` substring, e.g. `/ai local qwen`, and saves).
     - `/ai default` — switches to the managed default model mode.
     - `/ai stateless` / `/ai ephemeral` — toggles the 3-turn RAM follow-up ring (`WP-07c` compatibility preserved).

#### Part D: Zero-Dep Local Provider Discovery & `llmClient.ts` Hardening (`src/ai/localProviders.ts`, `src/ai/llmClient.ts`)

1. **Loopback Provider Auto-Discovery (`src/ai/localProviders.ts`):**
   - Zero npm dependencies (`globalThis.fetch` with `1,200 ms` timeout, strictly loopback `127.0.0.1` only):
     - **Ollama (`http://127.0.0.1:11434`):**
       - `GET /api/tags` → parses `{ models: [{ name, size, details: { parameter_size, quantization_level, family } }] }`.
       - Filters out embedding-only models (`nomic-embed`, `mxbai-embed`, `bge-`, `all-minilm`) so chat/instruct models appear first!
     - **OpenAI-Compatible Servers (`http://127.0.0.1:1234` LM Studio, `http://127.0.0.1:8080` `llama-server`):**
       - `GET /v1/models` → parses `{ data: [{ id }] }`.
2. **Protocol & Reasoning-Model Fixes in `src/ai/llmClient.ts`:**
   - Extend `FetchLlmTransport` / `postChatCompletion` with `model?: string` and `provider?: LocalLlmProviderKind`:
     - Include `...(model ? { model } : {})` in the JSON body of `POST /v1/chat/completions`.
     - **Thinking / Reasoning Budget Protection:**
       - Small reasoning models (e.g. Qwen 3, DeepSeek R1 distills) emit `<think>...</think>` tokens by default.
       - For Ollama, support native `/api/chat` (`format: 'json'`, `think: false`, `stream: false`) **or** `/v1/chat/completions` with reasoning disabled + strip any leading `<think>[\s\S]*?</think>` block inside `parseLlmJSONObject` before locating `{ ... }`! (Using Ollama's native `POST /api/chat` with `think: false` and `format: 'json'` when `provider === 'ollama'` guarantees zero wasted `<think>` tokens and deterministic JSON mode across Qwen 3 and Gemma 3, while keeping `/v1/chat/completions` for `openai-compatible` endpoints!)
       - Raise pulse `max_tokens` / `num_predict` floor from `120` to `256` so multi-section `{ state, economy, p2p }` JSON (`<= 600` chars from `WP-07f`) never truncates mid-JSON! *(Note: `WP-07f` expanded AI Overview to 3 sections `<= 600` chars (~160–200 tokens), while `llmClient.ts:81` still had `max_tokens: 120` from `WP-07c` — another real truncation bug fixed here!)*

---

### 1.3 Acceptance Criteria (`WP-10a`)

- [x] **Zero new runtime dependencies** added to `packages/ethy/package.json`.
- [x] **Persistent `<dataDir>/config.json` & CLI Precedence:**
  - First interactive launch without `config.json` or `--ai*` flags opens `AiOnboardingUIComponent` inside the TUI while P2P/sync runs uninterrupted in the background, and saves the chosen mode to `<dataDir>/config.json`.
  - Subsequent `ethy` launches boot directly into the saved mode without prompting; `--fresh` preserves `config.json`.
  - CLI flags (`--no-ai`, `--ai off|local|default`, `--ollama [model]`, `--llm-url <url> --llm-model <id>`, `--ai-save`, `--ai-setup`) obey the session-override vs. first-run/explicit-save rules, and `--headless` never blocks on onboarding.
- [x] **Full-Width `No AI` Mode (`aiMode === 'off'`):**
  - `renderLowerArea` omits the right `AI` box and renders the Interaction View across the full 3-column `contentWidth` (`visibleWidth === cols` across `80..160` cols).
  - Top bar omits the `AI` pill; `StartPageUIComponent` and unified `/help` omit AI examples/copy; non-`/` prompt submissions show a calm slash-command hint without invoking fuzzy NL matching or background timers.
- [x] **Zero-Friction `Ollama` & OpenAI-Compatible Local Model Support:**
  - Auto-discovers running local Ollama models (`:11434/api/tags`, filtering out embedding models) and OpenAI-compatible loopback servers (`:1234`, `:8080`).
  - Fixes missing `model` parameter, suppresses/strips `<think>...</think>` blocks on Qwen 3 / reasoning models, and raises pulse output token cap from `120` to `256` so 3-domain JSON overviews (`<= 600` chars) never truncate.
- [x] **Live `/ai` Switching & Hardware Check:**
  - `/ai` (`/ai off`, `/ai local [model]`, `/ai setup`) transitions layout and active engine live inside a running session; low-RAM machines (`< 6 GiB`) pre-select `No AI` on first open.
- [x] **100% Offline Deterministic Tests & Gates:**
  - Unit & virtual-framebuffer tests cover config precedence, full-width vs split-width `renderFrame` geometry, onboarding key handling (`1`/`2`/`3`, `↑`/`↓`, `Enter`), mocked Ollama `/api/tags` + `/api/chat` (`think: false`), `<think>` stripping, and live `/ai` mode toggling.
  - `npm run tsc`, `npm test`, and `npm run spellcheck` pass in `@ethereumjs/ethy`.

---

## 2. Concrete Implementation Plan (Planner — Grok 4.7)

### Design locks

- `/ai off` is **AI mode** `off` (memory ring uses `/ai stateless` and `/ai ephemeral`).
- Embedded default runner remains **WP-10d**; Option 1 bridges via Ollama family match when present.
- `sharePromptHistory` is schema-only until WP-10c.

### Modules & wiring

| Area | Files |
| --- | --- |
| Config | `src/persist/userConfig.ts`, `src/cli/args.ts`, `src/cli/main.ts` |
| Runtime | `src/ai/aiRuntime.ts`, `src/core/createEthyNode.ts`, `spine.aiMode` |
| Providers | `src/ai/localProviders.ts`, `src/ai/llmClient.ts`, `src/ai/fixtureEngine.ts` |
| TUI | `src/tui/lowerArea.ts`, `renderFrame.ts`, `AiOnboardingUIComponent.ts`, `aiOnboardingSession.ts`, `session.ts` |
| `/ai` | `src/ai/hybridEngine.ts` |
| Placeholder default | `src/ai/managedModel.ts` |

### Tests

`test/userConfig.spec.ts`, `hardwareCheck.spec.ts`, `localProviders.spec.ts`; extensions to `aiEngine.spec.ts`, `tui.spec.ts`, `args.spec.ts`.

---

## 3. Implementation Notes & Deviations (Implementer — Composer 2.5)

- **2026-11-19:** Shipped WP-10a end-to-end. `EthySpine.aiMode` defaults `off` (full-width interaction + no AI pill). `/ai` redefined for mode switching; `AiRuntimeController` hot-wires `HybridIntentEngine` transport. Ollama uses native `/api/chat` with `think: false` and `format: json`; pulse `num_predict` / `max_tokens` floor **256**. `cspell-ts`: `Ollama` / `ollama`.
