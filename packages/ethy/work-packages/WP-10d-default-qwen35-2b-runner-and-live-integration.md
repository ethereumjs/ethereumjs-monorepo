# WP-10d: Integrated Default Model (`Qwen3.5-2B`) — Managed GGUF Downloader, Local Runner Backend, Live Hot-Start & End-to-End Smoke Testing

- **Status:** `READY_FOR_PLANNING`
- **Series:** `WP-10` — Next-Generation LLM Integration, Capabilities & Model Strategy
  - **`WP-10a` (`DONE`):** Modular AI runtime modes (`default` / `off` / `local`), first-open TUI onboarding, full-width `No AI` cockpit, `<dataDir>/config.json`, and Ollama/loopback discovery.
  - **`WP-10b` (`DONE`):** Layer 1 deterministic Ethereum signal engine, multi-horizon time series, EIP-7702/L2-blob/BAL-slot analytics, and local `name()`/`symbol()` + ENS reverse identity resolution.
  - **`WP-10c` (`DONE`):** Layer 2 autonomous Chain-Detective LLM, bounded read-only Investigation Toolbelt, Dispatch Feed UI, self-history journal, and opt-in prompt-history sharing.
  - **`WP-10d` (this package):** Ships the concrete integrated default model (**`Qwen3.5-2B-Q4_K_M`**, Apache 2.0, `~1.28 GB`) behind `WP-10a`'s `ManagedModelProvider` seam so Option 1 (`Install / use default model`) works end-to-end out of the box for local live runs.
  - **`WP-10e` – `WP-10g` (`OPTIONAL_FUTURE`):** Optional post-MVP optimization & specialization track (50-case evaluation bake-off, `~30 MB` distilled GGUF LoRA diffset + pinned KV-cache, and LLM-compiled zero-CPU persistent watch rules).
- **Dependencies:** `WP-10a`, `WP-10b`, `WP-10c` (`DONE`)
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Holistic Scope & Architectural Requirements (Coordinator — Gemini 4 Carbon)

### 1.1 Architectural Motivation & Why `Qwen3.5-2B` Is the Practical Default Bet

With `WP-10a`–`WP-10c` shipped, the entire two-layer Ethereum intelligence pipeline is wired and tested offline — what remains to make **Option 1 (`default` model)** live and testable end-to-end is a concrete, reliable local model + runner implementation behind `src/ai/managedModel.ts`.

**Why `Qwen3.5-2B` (`Q4_K_M`, `~1.28 GB`, Apache 2.0) specifically?**
1. **Latest Official Small Release from Alibaba/Qwen:** Official `Qwen3.6` and `Qwen3.8` open releases are `27B+` only, and `Qwen4-Max` has no small open weights yet. `Qwen3.5` (`0.8B`, `2B`, `4B`, `9B`) is the latest official Apache-2.0 small family; community "3.8 small" checkpoints are third-party distillations built on the exact same `Qwen3.5` architecture.
2. **Best Capability-to-Size Knee:** `Qwen3.5-2B` delivers roughly `4×` the multi-step tool/agent accuracy of `0.8B` (`~532 MB`) while staying `2.6×` smaller on disk than `Gemma 4 E2B` (`~3.35 GB`) and using a hybrid linear-attention architecture (`Gated DeltaNet`) that keeps KV-cache RAM and laptop thermals low.
3. **Single Concrete Default First:** Locking one concrete model in `WP-10d` keeps testing deterministic and unlocks immediate local live runs on Sepolia and Mainnet before investing in multi-model bake-offs (`WP-10e`) or LoRA post-training (`WP-10f`).

---

### 1.2 Detailed Design Specifications

#### Part A: Pinned Model Catalog & Resumable GGUF Store (`src/ai/managedModel.ts`, `src/ai/modelStore.ts`)

1. **Pin `DEFAULT_MANAGED_MODEL_SPEC` to `Qwen3.5-2B` (`Q4_K_M`):**
   - Update `DEFAULT_MANAGED_MODEL_SPEC` in `src/ai/managedModel.ts`:
     - `id: 'qwen3.5-2b-q4_k_m'`
     - `displayName: 'Qwen3.5-2B (~1.28 GB)'`
     - `filename: 'Qwen3.5-2B-Q4_K_M.gguf'`
     - `downloadUrl`: pinned upstream Apache-2.0 GGUF URL (e.g. `https://huggingface.co/unsloth/Qwen3.5-2B-GGUF/resolve/main/Qwen3.5-2B-Q4_K_M.gguf`, overridable via `ETHY_DEFAULT_MODEL_URL` for local mirrors/testing)
     - `expectedBytes`: `1_280_835_840` (or exact pinned byte length + optional `sha256` verification once confirmed)
     - `ollamaFamilyHints: ['qwen3.5:2b', 'qwen3.5', 'qwen3:4b', 'qwen3']`
2. **Resumable Atomic Model Downloader (`src/ai/modelStore.ts`):**
   - Stores downloaded weights globally under `<dataDir>/models/` (preserved across `--fresh` state resets and shared across networks, just like `<dataDir>/config.json`).
   - Uses `globalThis.fetch` (Node `>= 22`, zero new deps) with:
     - HTTP `Range` resume against `<filename>.part` so interrupted downloads pick up cleanly;
     - Free-disk pre-check (`>= expectedBytes + 512 MiB` buffer via `hardwareCheck.ts`);
     - Streaming `crypto.createHash('sha256')` integrity check when `sha256` is pinned, followed by atomic `renameSync(<file>.part, <file>)`;
     - Progress callback (`{ downloadedBytes, totalBytes, pct }`) throttled to `250 ms` to drive live TUI status without redraw spam;
     - Clean `AbortSignal` cancellation if the user exits Ethy or runs `/ai off` mid-download.

#### Part B: Pluggable Local Runner Chain Behind `ManagedModelProvider` (`src/ai/managedRunner.ts`)

Keep `@ethereumjs/ethy` resilient across macOS Apple Silicon, Linux, and Windows without making native C++ compilation a hard install blocker:

1. **Runner Priority Chain (All Implementing `LlmTransport`):**
   - **Backend 1 — Managed `node-llama-cpp` In-Process Runner (Optional Dependency, Lazy Dynamic `import`):**
     - **Dependency Note (Requires Explicit Human Approval at Planning/Implementation Time per `dependencies.mdc`):** If `node-llama-cpp` is installed (e.g. as an `optionalDependencies` entry in `packages/ethy/package.json` ONLY — never in any core `@ethereumjs/*` library package), `ManagedModelRunner` dynamically imports it only when `aiMode === 'default'` starts.
     - Loads `<dataDir>/models/Qwen3.5-2B-Q4_K_M.gguf` with conservative laptop defaults (`contextSize: 4096`, auto Metal/CUDA/Vulkan offload, non-thinking / JSON-schema grammar constraint via `createGrammarForJsonSchema` when supported), and disposes cleanly on `/ai off` or process shutdown.
     - Keeps a single serialized inference queue so interactive user prompts never race with background `ChainDetectiveNarrator` ticks.
   - **Backend 2 — Zero-Dep Managed `llama-server` Child Process Fallback:**
     - If `node-llama-cpp` is unavailable on a machine (or during zero-dep testing), checks whether `llama-server` exists on `PATH` (or `ETHY_LLAMA_SERVER_BIN`).
     - Spawns `llama-server -m <modelPath> --host 127.0.0.1 --port <freePort> --ctx-size 4096 --reasoning-budget 0` with `stdio: 'ignore'` (zero terminal corruption in the Zero-Log TUI!), waits for `GET /health` (`<= 15s`), wraps it in `FetchLlmTransport` (`provider: 'openai-compatible'`), and kills the child process cleanly on `/ai off`, `SIGINT`, `SIGTERM`, and `exit`.
   - **Backend 3 — Graceful Ollama Bridge / Clear Guidance:**
     - If neither `node-llama-cpp` nor `llama-server` is available, checks loopback Ollama (`findOllamaBridgeModel`) and bridges transparently if a compatible `qwen3.5` / `qwen3` model is installed; otherwise sets `spine.capabilities.ai = { status: 'partial', label: 'Install runner' }` and shows a concise 2-line setup hint in the right-hand `AI` panel (never crashing or stalling P2P sync).

#### Part C: Live Hot-Start & Mid-Session Lifecycle in `aiRuntime.ts` & `session.ts`

Audit of `WP-10a` / `WP-10c` surfaced two live-session wiring gaps that `WP-10d` closes:

1. **Dynamic `ChainDetectiveNarrator` Start / Stop / Rewire in `session.ts`:**
   - Currently `session.ts` checks `const llmConfigured = node.spine.aiMode !== 'off' && node.llm !== undefined` once at startup. If the user selects Option 1 or Option 3 during **first-open onboarding**, finishes downloading `Qwen3.5-2B` in the background, or switches `/ai off` → `/ai default` / `/ai local` mid-session, `ChainDetectiveNarrator` must **automatically start (or rebind to the new transport)** without restarting Ethy, and **stop + dispose the model runner** immediately when switching to `/ai off`!
2. **Live Download & Warmup Progress in the Right-Hand `AI` Box:**
   - While `Qwen3.5-2B` is downloading (`downloading`) or warming up (`warming`), update `spine.capabilities.ai` (`status: 'partial'`, `label: 'Downloading 42%'` / `'Loading model'`, `progressPct`) and render a calm progress card in `╭─ ● AI ─╮` (e.g. `Downloading Qwen3.5-2B… 42% (540 MB / 1.28 GB) · P2P & sync running normally`).
   - As soon as the runner becomes `ready`, flip `spine.llmPulseReady = true` (`● AI`), bind the `LlmTransport` on `HybridIntentEngine` + `ChainDetectiveNarrator`, and trigger the first live Chain-Detective cycle!
3. **Minor Wire Hygiene Fix (`src/ai/llmClient.ts`):**
   - Tighten `isOllamaBase(base)` so it matches port `11434` (not any bare `127.0.0.1` URL with empty port), preventing misrouting of port-80 OpenAI-compatible proxies.

#### Part D: Local End-to-End AI Smoke Harness (`scripts/ai-smoke.ts` / `npm run ai:smoke`)

Add a standalone developer smoke CLI (outside CI, matching `p2p:canary` and `ethy:swarm-smoke`):
- Runs the configured `default` (`Qwen3.5-2B`) or `--ollama <model>` runner against **3 realistic synthetic `WP-10b`/`WP-10c` scenarios**:
  1. **EIP-7702 Proxy Delegation Surge** (tests 2-step `investigate → inspect_delegations → dispatch`);
  2. **Sustained L2 Blob Settlement Cost Climb** (tests `inspect_l2_blobs` + factual numbers);
  3. **Quiet Normal Block** (tests calm dispatch / zero hallucinated drama).
- Prints per-scenario latency (ms), parsed tool calls, final Dispatch Card, and JSON validity so you can locally test and feel `Qwen3.5-2B` in under 15 seconds!

---

### 1.3 Acceptance Criteria (`WP-10d`)

- [ ] **Pinned Default Model (`Qwen3.5-2B-Q4_K_M`):** `DEFAULT_MANAGED_MODEL_SPEC` targets `Qwen3.5-2B` (`~1.28 GB`, Apache 2.0) and stores weights under `<dataDir>/models/` (preserved across `--fresh`).
- [ ] **Resumable Verified Downloader (`modelStore.ts`):** Supports HTTP `Range` resume, disk-space pre-check, SHA-256 verification, throttled progress events, and clean `AbortSignal` cancellation — verified offline via mocked HTTP server / fetch tests.
- [ ] **Working Local Runner Behind `ManagedModelProvider`:** Supports embedded `node-llama-cpp` (if approved & installed) and zero-dep managed `llama-server` loopback child-process fallback (with clean teardown on `/ai off` and process exit), plus Ollama bridge fallback.
- [ ] **Live Hot-Start Lifecycle:** Selecting Option 1 or Option 3 during first-open onboarding, completing a model download, or running `/ai default` / `/ai local` / `/ai off` mid-session dynamically starts, rebinds, or stops `ChainDetectiveNarrator` and `HybridIntentEngine` without restarting Ethy.
- [ ] **Local Smoke Script (`npm run ai:smoke`):** Exercises real `Qwen3.5-2B` end-to-end across 3 synthetic `ChainDetective` scenarios (tool call + synthesis + calm restraint) with timing and structured validation output.
- [ ] **100% Offline CI & Quality Gates:** CI never downloads GGUF weights or invokes native inference; `npm run tsc`, `npm test`, and `npm run spellcheck` pass in `@ethereumjs/ethy`.

---

## 2. Concrete Implementation Plan (Planner — Grok 4.7)

*(To be filled out by Planner — Grok 4.7 when assigned.)*

---

## 3. Implementation Notes & Deviations (Implementer — Composer 2.5)

*(To be filled out by Implementer — Composer 2.5 when implemented.)*
