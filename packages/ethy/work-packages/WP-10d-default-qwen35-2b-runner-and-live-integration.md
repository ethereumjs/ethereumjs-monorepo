# WP-10d: Integrated Default Model (`Qwen3.5-2B`) — Managed GGUF Downloader, Zero-Dep Local Runner, Live Hot-Start & 3-Layer Offline `MockLlmServer` Test Suite

- **Status:** `DONE`
- **Series:** `WP-10` — Next-Generation LLM Integration, Capabilities & Model Strategy
  - **`WP-10a` (`DONE`):** Modular AI runtime modes (`default` / `off` / `local`), first-open TUI onboarding, full-width `No AI` cockpit, `<dataDir>/config.json`, and Ollama/loopback discovery.
  - **`WP-10b` (`DONE`):** Layer 1 deterministic Ethereum signal engine, multi-horizon time series, EIP-7702/L2-blob/BAL-slot analytics, and local `name()`/`symbol()` + ENS reverse identity resolution.
  - **`WP-10c` (`DONE`):** Layer 2 autonomous Chain-Detective LLM, bounded read-only Investigation Toolbelt, Dispatch Feed UI, self-history journal, and opt-in prompt-history sharing.
  - **`WP-10d` (this package):** Ships the concrete integrated default model (**`Qwen3.5-2B-Q4_K_M`**, Apache 2.0, `~1.28 GB`) behind `WP-10a`'s `ManagedModelProvider` seam, plus a full **3-layer offline `MockLlmServer` test suite** so every agent builds & verifies everything 100% offline while the human triggers the first real `Qwen3.5-2B` download manually on client start.
  - **`WP-10e` – `WP-10g` (`OPTIONAL_FUTURE`):** Optional post-MVP optimization & specialization track (50-case evaluation bake-off, `~30 MB` distilled GGUF LoRA diffset + pinned KV-cache, and LLM-compiled zero-CPU persistent watch rules).
- **Dependencies:** `WP-10a`, `WP-10b`, `WP-10c` (`DONE`)
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Holistic Scope & Architectural Requirements (Coordinator — Gemini 4 Carbon)

### 1.1 Hard Agent Guardrails (Mandatory for Planner & Implementer)

1. **Zero Autonomous Model Downloads:** Neither Grok (Planner) nor Composer (Implementer) may download `Qwen3.5-2B-Q4_K_M.gguf`, contact HuggingFace, or execute live `npm run ai:smoke` (without `--mock`). The human will trigger the first real `1.28 GB` download manually in a controlled way on client start.
2. **Zero New Dependencies in `package.json`:** Do **not** add `node-llama-cpp` or any other third-party npm dependency to `packages/ethy/package.json` during `WP-10d`. Keep `node-llama-cpp` strictly as a typed, lazy dynamic-`import` adapter seam (activated only if installed externally or explicitly approved in a later round), while shipping the zero-dep managed `llama-server` child-process runner and Ollama bridge out of the box.
3. **100% Offline, Fast, Deterministic Verification:** All planning & implementation verification runs strictly against the local 3-layer offline mocks (`MockLlmServer`, `MockModelDownloadServer`, and fake `ETHY_LLAMA_SERVER_BIN` / `--mock` smoke mode) in `< 1s`.

### 1.2 Architectural Motivation & Why `Qwen3.5-2B` Is the Practical Default Bet

With `WP-10a`–`WP-10c` shipped and reviewed (`2f0a42135`), the entire two-layer Ethereum intelligence pipeline is solid and tested offline — what remains to make **Option 1 (`default` model)** live and testable end-to-end is a concrete, reliable local model + runner implementation behind `src/ai/managedModel.ts`.

**Why `Qwen3.5-2B` (`Q4_K_M`, `~1.28 GB`, Apache 2.0) specifically?**
1. **Latest Official Small Release from Alibaba/Qwen:** Official `Qwen3.6` and `Qwen3.8` open releases are `27B+` only, and `Qwen4-Max` has no small open weights yet. `Qwen3.5` (`0.8B`, `2B`, `4B`, `9B`) is the latest official Apache-2.0 small family; community "3.8 small" checkpoints are third-party distillations built on the exact same `Qwen3.5` architecture.
2. **Best Capability-to-Size Knee:** `Qwen3.5-2B` delivers roughly `4×` the multi-step tool/agent accuracy of `0.8B` (`~532 MB`) while staying `2.6×` smaller on disk than `Gemma 4 E2B` (`~3.35 GB`) and using a hybrid linear-attention architecture (`Gated DeltaNet`) that keeps KV-cache RAM and laptop thermals low.
3. **Single Concrete Default First:** Locking one concrete model in `WP-10d` keeps testing deterministic and unlocks immediate local live runs on Sepolia and Mainnet before investing in multi-model bake-offs (`WP-10e`) or LoRA post-training (`WP-10f`).

---

### 1.3 Detailed Design Specifications

#### Part A: Pinned Model Catalog & Resumable GGUF Store (`src/ai/managedModel.ts`, `src/ai/modelStore.ts`)

1. **Pin `DEFAULT_MANAGED_MODEL_SPEC` to `Qwen3.5-2B` (`Q4_K_M`):**
   - Update `DEFAULT_MANAGED_MODEL_SPEC` in `src/ai/managedModel.ts`:
     - `id: 'qwen3.5-2b-q4_k_m'`
     - `displayName: 'Qwen3.5-2B (~1.28 GB)'`
     - `filename: 'Qwen3.5-2B-Q4_K_M.gguf'`
     - `downloadUrl`: `https://huggingface.co/unsloth/Qwen3.5-2B-GGUF/resolve/main/Qwen3.5-2B-Q4_K_M.gguf` (overridable via `ETHY_DEFAULT_MODEL_URL` for local mirrors/testing)
     - `expectedBytes`: `1_280_835_840` (informational / disk pre-check)
     - `minValidBytes`: `100 * 1024 * 1024` (`100 MiB` floor in production; overridable in unit tests)
     - `sha256?: string` (optional — when omitted, verify **GGUF magic bytes** `0x47 0x47 0x55 0x46` `"GGUF"` + `minValidBytes` so an HTML 404/error page is rejected without ever blocking manual download on an unverified hash; when `sha256` IS provided, enforce exact streaming SHA-256 verification!)
     - `ollamaFamilyHints: ['qwen3.5:2b', 'qwen3.5', 'qwen3:4b', 'qwen3']`
2. **Resumable Atomic Model Downloader (`src/ai/modelStore.ts`):**
   - Stores downloaded weights globally under `<dataDir>/models/` (preserved across `--fresh` state resets and shared across networks, just like `<dataDir>/config.json`).
   - Uses `globalThis.fetch` (Node `>= 22`, zero new deps) with:
     - HTTP `Range: bytes=<offset>-` resume against `<filename>.part` (falling back cleanly to fresh write if server replies `200` instead of `206`);
     - Free-disk pre-check (`>= expectedBytes + 512 MiB` buffer via `hardwareCheck.ts`);
     - Header validation (`"GGUF"` 4-byte magic check on `<file>.part` before rename) + optional streaming `crypto.createHash('sha256')` check, followed by atomic `renameSync(<file>.part, <file>)`;
     - Progress callback (`{ downloadedBytes, totalBytes, pct }`) throttled to `250 ms` to drive live TUI status without redraw spam;
     - Clean `AbortSignal` cancellation if the user exits Ethy or runs `/ai off` mid-download.

#### Part B: Zero-Dep Local Runner Chain Behind `ManagedModelProvider` (`src/ai/managedRunner.ts`)

Keep `@ethereumjs/ethy` zero-new-deps and resilient across macOS Apple Silicon, Linux, and Windows:

1. **Runner Priority Chain (All Implementing `LlmTransport`):**
   - **Backend 1 — Lazy Optional `node-llama-cpp` Adapter Seam (No `package.json` Entry Yet):**
     - Uses a tiny dynamic-import probe (`tryImportNodeLlamaCpp()`, injectable in tests) so if `node-llama-cpp` is installed externally (or added to `optionalDependencies` after explicit approval later), it loads `<dataDir>/models/Qwen3.5-2B-Q4_K_M.gguf` in-process (`contextSize: 4096`, serialized queue, clean `dispose()`). If not installed, falls through silently in `< 1 ms` to Backend 2!
   - **Backend 2 — Zero-Dep Managed `llama-server` Child Process Runner (Primary Zero-Dep Engine):**
     - Detects `llama-server` via `ETHY_LLAMA_SERVER_BIN` or `PATH` (e.g. `brew install llama.cpp` on macOS).
     - Allocates a free loopback port (`127.0.0.1`), spawns `llama-server -m <modelPath> --host 127.0.0.1 --port <port> --ctx-size 4096 --reasoning-budget 0` with `stdio: 'ignore'` (zero terminal corruption in the Zero-Log TUI!).
     - Polls `GET http://127.0.0.1:<port>/health` (`<= 15s`, abortable), wraps it in `FetchLlmTransport` (`provider: 'openai-compatible'`), and kills the child cleanly (`SIGTERM` → `SIGKILL` fallback) on `/ai off`, `SIGINT`, `SIGTERM`, and process `exit`.
   - **Backend 3 — Graceful Ollama Bridge / Clear Setup Hint:**
     - If neither `node-llama-cpp` nor `llama-server` is available, checks loopback Ollama (`findOllamaBridgeModel`) and bridges transparently if a matching `qwen3.5` / `qwen3` model is installed (note: only triggers the `1.28 GB` GGUF download when a GGUF-capable runner — Backend 1 or Backend 2 — is actually available, so users without `llama-server` don't waste bandwidth downloading a file they cannot run yet!).
     - If no runner AND no Ollama bridge exists, sets `spine.capabilities.ai = { status: 'partial', label: 'Install runner' }` and shows a crisp 2-line setup hint (`Install llama.cpp (brew install llama.cpp) for built-in Qwen3.5-2B, or run ollama pull qwen3.5:2b`).

#### Part C: Live Download Progress & Managed Runner Lifecycle (`src/ai/aiRuntime.ts`, `src/tui/session.ts`)

1. **Managed Runner Integration in `aiRuntime.ts`:**
   - Wire `mode === 'default'` in `createAiRuntimeController` to start `ManagedModelRunner` asynchronously (non-blocking — P2P and state sync keep running!), updating `spine.capabilities.ai` through `downloading` (`Downloading 42%`, `progressPct`) → `warming` (`Loading Qwen3.5-2B`) → `ready` (`Qwen3.5-2B`).
   - Add an `onRuntimeChange?: () => void` callback (or event) on `AiRuntimeController` so `session.ts` immediately redraws progress and hot-starts `ChainDetectiveNarrator` the instant `Qwen3.5-2B` finishes downloading and loading — and cleanly calls `runner.stop()` / aborts downloads on `/ai off` or session cleanup!
2. **Download / Warmup Card in Right-Hand `AI` Box:**
   - Render a calm status card inside `╭─ ● AI ─╮` during `downloading` / `warming` (e.g. `Downloading Qwen3.5-2B… 42% (540 MB / 1.28 GB) · P2P & sync running normally`), then transition automatically to Chain-Detective dispatches once `ready`.

#### Part D: Local Smoke Harness (`scripts/ai-smoke.ts` / `npm run ai:smoke`)

Add a developer smoke CLI with **two modes**:
- **`npm run ai:smoke -- --mock`** (CI-safe, 100% offline): runs the full 3-scenario `ChainDetective` smoke suite against `MockLlmServer` to verify the smoke harness itself!
- **`npm run ai:smoke`** (manual human run only — NEVER run by agents!): runs the real `default` (`Qwen3.5-2B`) or `--ollama <model>` runner against **3 realistic synthetic `WP-10b`/`WP-10c` scenarios**:
  1. **EIP-7702 Proxy Delegation Surge** (tests 2-step `investigate → inspect_delegations → dispatch`);
  2. **Sustained L2 Blob Settlement Cost Climb** (tests `inspect_l2_blobs` + factual numbers);
  3. **Quiet Normal Block** (tests calm dispatch / zero hallucinated drama).
- Prints per-scenario latency (ms), parsed tool calls, final Dispatch Card, and JSON validity so the human can test `Qwen3.5-2B` locally in ~15 seconds.

#### Part E: 3-Layer Offline LLM Mock & Integration Test Architecture (`test/helpers/mockLlmServer.ts`, `test/managedModel.spec.ts`, `test/llmIntegration.spec.ts`)

To thoroughly test the **entire** LLM wire, tool-calling, download, and lifecycle stack without ever downloading a real model:

1. **Layer A — `MockLlmServer` (`test/helpers/mockLlmServer.ts`):**
   - Lightweight in-process `node:http` server bound to `127.0.0.1:0` speaking both **OpenAI-compatible** (`GET /health`, `GET /v1/models`, `POST /v1/chat/completions`) and **Ollama** (`GET /api/tags`, `POST /api/chat`) wire protocols over real loopback HTTP.
   - Records every incoming request body so tests assert exact wire invariants (`think: false`, explicit `model`, `userCues` empty when `sharePromptHistory === false`, populated Turn 2 `toolResults`).
   - Supports scripted **realistic + adversarial scenarios**:
     - Clean 2-step `investigate → inspect_delegations / inspect_l2_blobs / probe_contract_view → dispatch` round-trip against a real `FlatStateManager` + `EthySandbox`;
     - `<think>reasoning...</think>{...}` leakage stripping (Qwen-style);
     - Markdown-fenced JSON (````json ... ````);
     - Invalid tool name / malformed address graceful recovery;
     - Truncated JSON & HTTP 500 fallback to deterministic `[SIGNAL]` card;
     - Slow response aborted cleanly via `AbortSignal` when an interactive user prompt arrives!
2. **Layer B — `MockModelDownloadServer` (`test/managedModel.spec.ts`):**
   - Local `node:http` server on `127.0.0.1:0` serving a `64 KiB` synthetic `"GGUF"` file with HTTP `Range` support:
     - Verifies fresh download + progress callbacks + atomic `.part → .gguf` rename;
     - Simulates mid-stream drop and verifies HTTP `Range` resume produces the exact byte-identical file;
     - Rejects HTML / non-`"GGUF"` responses and SHA-256 mismatches cleanly without leaving corrupt `.gguf` files behind;
     - Verifies `AbortSignal` cancellation mid-download.
3. **Layer C — `MockManagedRunner` / Fake `ETHY_LLAMA_SERVER_BIN` Lifecycle Tests (`test/managedModel.spec.ts`):**
   - Spawns a tiny Node script via `ETHY_LLAMA_SERVER_BIN` (binding the requested `--port`, serving `/health` + `/v1/chat/completions`) to test `ManagedModelRunner` startup, `ChainDetectiveNarrator` live hot-start, interactive NL query over the spawned runner, and clean child-process termination (`SIGTERM`) on `/ai off` and shutdown!
   - Also tests `ai:smoke --mock` end-to-end offline.

---

### 1.4 Acceptance Criteria (`WP-10d`)

- [ ] **Zero new dependencies** in `packages/ethy/package.json` and **zero model downloads** performed by agents or CI.
- [ ] **Pinned Default Model (`Qwen3.5-2B-Q4_K_M`):** `DEFAULT_MANAGED_MODEL_SPEC` targets `Qwen3.5-2B` (`~1.28 GB`, Apache 2.0) stored under `<dataDir>/models/` (preserved across `--fresh`), validating `"GGUF"` magic bytes + optional SHA-256.
- [ ] **Resumable Verified Downloader (`modelStore.ts`):** HTTP `Range` resume, free-disk pre-check, `"GGUF"` magic + SHA-256 check, throttled progress callbacks, and `AbortSignal` cancellation — fully verified offline via `MockModelDownloadServer`.
- [ ] **Zero-Dep Local Runner Chain (`managedRunner.ts`):** Lazy dynamic `node-llama-cpp` adapter seam + managed `llama-server` loopback child-process runner (checking runner availability before downloading 1.28 GB) + Ollama bridge fallback, with clean child-process teardown on `/ai off` and exit.
- [ ] **Live Hot-Start Lifecycle:** Completing onboarding, finishing a download, or running `/ai default` / `/ai local` / `/ai off` mid-session dynamically starts, rebinds, or stops `ChainDetectiveNarrator` and `ManagedModelRunner` without restarting Ethy.
- [ ] **3-Layer Offline LLM Test Suite (`MockLlmServer`, `MockModelDownloadServer`, `MockManagedRunner`) + `ai:smoke --mock`:** Exercises real loopback HTTP (OpenAI + Ollama), 2-step investigation tool loops, `<think>`/fenced/corrupt/HTTP-500/abort fault injection, and child-process lifecycle in `< 1s` offline.
- [ ] All quality gates pass: `npm run tsc`, `npm test`, and `npm run spellcheck` in `@ethereumjs/ethy`.

---

## 2. Concrete Implementation Plan (Planner — Grok 4.7)

### 2.0 Current codebase gaps (pre-implementation)

- [`managedModel.ts`](../src/ai/managedModel.ts) is a placeholder (`ethy-default-v1`, `PlaceholderManagedModelProvider`).
- [`aiRuntime.ts`](../src/ai/aiRuntime.ts) `mode === 'default'` clears `node.llm` and hard-codes `Default (WP-10d)` on the AI pill.
- [`deriveAiCapability`](../src/spine/createSpine.ts) overwrites that pill on every peer tick — download `progressPct` must not live on `capabilities.ai` alone.
- [`hybridEngine.ts`](../src/ai/hybridEngine.ts) `/ai default` and onboarding option 1 still bridge matching Ollama into `mode: 'local'` or reopen onboarding with a WP-10d deferral note.
- [`session.ts`](../src/tui/session.ts) starts `ChainDetectiveNarrator` only when `node.llm` exists at boot — no subscribe hook for async default runner ready.

### 2.1 Design refinements (Decision **D-126**)

1. **Runner-owned capability** — Add `spine.managedAi` (`phase`, optional `progressPct`, `detail`). `deriveAiCapability` reads it when `aiMode === 'default'` so peer ticks do not erase download percentage.
2. **Stay on `default`** — Ollama bridge wires a transport but keeps `mode: 'default'` on disk; retire interim `local` rewrite in `hybridEngine` and onboarding.
3. **Download only after a GGUF runner exists** — `node-llama-cpp` dynamic import or `llama-server` on `ETHY_LLAMA_SERVER_BIN` / `PATH`; Ollama-only and install-hint paths never fetch the 1.28 GB file.
4. **`sha256` unset in production spec** — validate GGUF magic `47 47 55 46` + `minValidBytes` (100 MiB); optional streaming SHA-256 when tests inject `sha256`.
5. **Abort keeps `.part`** for Range resume; invalid body deletes `.part` only.
6. **Epoch token** on `AiRuntimeController` — `/ai off`, `/ai local`, and a newer `/ai default` invalidate late download/runner callbacks.
7. **`llama-server` health timeout (15s)** — kill child, fall through to Ollama, then install hint (no re-download).
8. **Status in AI box** — `bootstrapNote` during `downloading` / `warming` / `needs-runner`; `refreshOverview` must not clobber those phases.

### 2.2 Pinned spec & types (`managedModel.ts`, `spine/types.ts`)

1. Extend `ManagedModelSpec` with `filename`, `downloadUrl`, `expectedBytes`, `minValidBytes`, optional `sha256`; resolve `downloadUrl` via `ETHY_DEFAULT_MODEL_URL` at read time (function, not a frozen constant).
2. Set `DEFAULT_MANAGED_MODEL_SPEC` to `qwen3.5-2b-q4_k_m`, Unsloth URL, `expectedBytes: 1_280_835_840`, hints `qwen3.5:2b`…`qwen3`; keep `findOllamaBridgeModel`. Drop or thin `PlaceholderManagedModelProvider` after runner owns status.
3. Add `ManagedAiPhase` + `spine.managedAi` on `EthySpine`.

### 2.3 Resumable downloader (`modelStore.ts`)

1. `modelsDir(dataDir)` → `<dataDir>/models/` (survives `discardPivots` / `--fresh`).
2. `ensureManagedModel(spec, { dataDir, signal, onProgress, fetchImpl, freeDiskBytes, minValidBytes })` — skip fetch when final file validates; HTTP `Range` on `.part`; throttled progress (250 ms); disk pre-check `expectedBytes + 512 MiB` via `probeHardware` / injectable `freeDiskBytes`.

### 2.4 Runner chain (`managedRunner.ts`, `nodeLlamaCppAdapter.ts`)

1. **`createManagedModelRunner`** — async non-blocking `start()`, `stop()` with epoch checks; backends implement `LlmTransport`.
2. **Backend 1** — lazy `import('node-llama-cpp')` via injectable `tryImportNodeLlamaCpp()` + minimal `.d.ts`; GGUF in-process, `contextSize: 4096`, serialized queue, `dispose()` on stop.
3. **Backend 2** — `ETHY_LLAMA_SERVER_BIN` or PATH; spawn `llama-server -m … --host 127.0.0.1 --port … --ctx-size 4096 --reasoning-budget 0` (`stdio: 'ignore'`); poll `/health`; wrap `FetchLlmTransport` (`openai-compatible`); clean `SIGTERM` → `SIGKILL` on stop/exit.
4. **Backend 3** — `discoverOllamaModels` + `findOllamaBridgeModel`; no GGUF download.
5. **Neither** — `needs-runner` phase + two-line install hint (`brew install llama.cpp` / `ollama pull qwen3.5:2b`).
6. Map phases to pill: `Downloading N%` (+ `progressPct`), `Loading Qwen3.5-2B`, `Qwen3.5-2B` ready, `Install runner`.

### 2.5 Runtime, slash commands, TUI

1. **`aiRuntime.ts`** — `default` starts runner, `subscribe(listener)` with immediate replay, wires `node.llm` + `hybridEngine.setLlmTransport` on ready; `off`/`local` stop runner and clear `managedAi`.
2. **`createSpine.ts`** — `deriveAiCapability` uses `managedAi` for default mode.
3. **`hybridEngine.ts`** — `/ai default` → `setAiConfig({ mode: 'default' })` only; remove Ollama rewrite and onboarding reopen.
4. **`aiOnboardingSession.ts`** + **`AiOnboardingUIComponent.ts`** — option 1 always `mode: 'default'`; update copy.
5. **`session.ts`** — subscribe for `bootstrapNote` progress card; `startDetectiveNarrator` on ready; guard `refreshOverview` during managed phases; cleanup stops runner via runtime.

### 2.6 Smoke CLI (`scripts/ai-smoke.ts`, `package.json`)

1. Add `"ai:smoke": "tsx scripts/ai-smoke.ts"` (script only, no new deps).
2. `--mock` — three synthetic scenarios (7702 surge, L2 blobs, quiet block) via `MockLlmServer`; agents/CI only.
3. Live mode — human-only; export `runSmokeScenarios(transport)` for unit tests.

### 2.7 Offline test harness

1. **Layer A** — `test/helpers/mockLlmServer.ts` (+ `test/llmIntegration.spec.ts` or extend `chainDetective.spec.ts`): OpenAI + Ollama loopback, wire invariants, adversarial JSON / `think` / abort.
2. **Layer B** — `test/managedModel.spec.ts`: `MockModelDownloadServer` with Range, resume, abort, SHA mismatch, disk guard, `--fresh` preserves `models/`.
3. **Layer C** — same spec: fake `ETHY_LLAMA_SERVER_BIN` (`test/helpers/fakeLlamaServer.mjs`), runtime lifecycle + `ai:smoke --mock` spawn.
4. Update tests expecting `ethy-default-v1` or `Default (WP-10d)` labels.

### 2.8 Implementation order

1. Types + `managedModel` pin → `modelStore` → `managedRunner` (+ node-llama adapter) → `aiRuntime` + spine deriver → hybrid/onboarding/session → mocks + specs → smoke script → gates (`tsc`, `npm test`, `spellcheck`).

---

## 3. Implementation Notes & Deviations (Implementer — Composer 2.5)

- Shipped **`spine.managedAi`** + `deriveAiCapability` for default-mode pill/progress; **`setManagedPhase({ phase: 'ready' })`** runs before `onPhase` so capability label is not stuck on “Loading …”.
- **`managedRunner`** chain: Ollama bridge → optional lazy `node-llama-cpp` → `ETHY_LLAMA_SERVER_BIN` child; GGUF fetch via **`modelStore.ensureManagedModel`** (Range resume, magic check, no agent download in tests).
- **`aiRuntime`** epoch + subscribe; TUI **`bootstrapNote`** during download/warmup; `/ai default` stays **`mode: 'default'`**.
- Offline verification: **`test/managedModel.spec.ts`**, **`MockLlmServer`**, **`fakeLlamaServer.mjs`**, **`npm run ai:smoke -- --mock`**; zero new `package.json` runtime deps.
