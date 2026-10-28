# WP-04: Bidirectional Local LLM `IntentEngine` (`<ethy_state>`, Dynamic Tool Gating & Fixture Replay)

- **Status:** `READY_FOR_PLANNING` (Can be planned & implemented after or alongside `WP-03`)
- **Dependencies:** `WP-01` (`DONE`), `WP-02` (`DONE`)
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Holistic Scope & Architectural Requirements

### Goal
Upgrade Ethy's `IntentEngine` from deterministic slash/keyword routing to full **natural-language + grammar-constrained tool calling** for ~1 GB local instruct models (1.5B–2B parameters in 4-bit quantization), while keeping **zero mandatory npm dependencies** in the default install and **100% deterministic offline execution in GitHub CI**.

### Architectural Strategy (Zero-Dep First + Optional Embedded Engine)
1. **Zero-Dep Local HTTP Adapter (`LocalHttpIntentEngine`):**
   - Uses Node 22's built-in `fetch()` to talk to any local OpenAI-compatible or `llama-server` endpoint (defaulting to `http://127.0.0.1:11434/api/chat` or `http://127.0.0.1:8080/v1/chat/completions`) with structured JSON schema / tool definitions.
   - Auto-detects at startup whether a local model server is reachable:
     - If reachable: flips `spine.capabilities.ai` to `ready` (`● AI`), updates the **`● AI Metrics`** box in the 3-Box Cockpit (`Engine: Local LLM (<model>)`), and posts a subtle `info` notice via `NoticeBoard`.
     - If not reachable: keeps `DeterministicIntentEngine` active (`◐ AI` / `Engine: Slash / Rule Mode`) so the prompt works seamlessly with zero setup friction.
2. **Optional Embedded `node-llama-cpp` Adapter (Hook Prepared):**
   - Design a clean dynamic adapter boundary (`EmbeddedLlamaIntentEngine`) that dynamically imports `node-llama-cpp` *only if installed by the user* (or approved later), streaming model download progress (`0..100%`) directly into `spine.capabilities.ai.progressPct` while the Onboarding Carousel rotates in Zone 2.
   - **Important:** Do **not** add `node-llama-cpp` to `package.json` unless the human explicitly approves adding the dependency.

### Key Deliverables

1. **Bidirectional `<ethy_state>` Prompt Protocol (`src/ai/stateHeader.ts`):**
   - Tracks `lastQuerySlot` and `lastQueryTimestamp` per session.
   - Prepends the compact `<ethy_state>` XML/structured telemetry block before every user prompt:
     - Current network, `slot`, `slot_delta` (e.g. `"+3 since last query"`), `phase`.
     - Per-capability status (`p2p`, `snap` with completed/stalled bucket prefixes, `head`).
     - Top recent anomaly from `diagnosticRingBuffer` if a bucket is currently stalled.
   - System prompt instructs the model to:
     1. Pick the best unlocked tool to answer the user's question and populate Zone 2 with a deterministic `WidgetSpec`.
     2. Mention `slot_delta` or partial sync state naturally in its 1–2 sentence `assistantComment` when relevant (e.g., if the user asks about an address prefix that hasn't synced yet).

2. **Dynamic Tool Gating & JSON Schema Enforcer (`src/ai/toolGating.ts`):**
   - Filters the tool catalog based on `spine.capabilities` (`P2P_WARMUP` vs `SNAP_SYNCING` vs `HEAD_FOLLOWING`).
   - Exports a strict JSON Schema for the LLM response (`{ toolName, args, assistantComment }`) so grammar-constrained sampling (`response_format: { type: "json_schema" }`) cannot emit malformed JSON or invent non-existent tools.

3. **Deterministic Fixture Recorder & Replay Runner (`src/ai/fixtureEngine.ts`):**
   - Supports `--record-fixture <path>` during live local LLM testing: saves `{ userPrompt, ethyStateHeader, unlockedTools, resolvedToolCall }` to `test/fixtures/ai/`.
   - `FixtureReplayIntentEngine` replays these recorded fixtures in CI unit tests (<5ms) and validates that every recorded LLM output passes the tool schema validator and renders the expected `WidgetSpec` in Zone 2.

4. **Tier-1 Unit Test Suite (`test/aiEngine.spec.ts`):**
   - Tests `<ethy_state>` generation across all phases and `slot_delta` transitions.
   - Tests dynamic tool gating (confirming locked tools are excluded from the schema sent to the model, and rejected if a model ever attempts to call them).
   - Tests `LocalHttpIntentEngine` against a mock `fetch` responder (including timeout/offline fallback to `DeterministicIntentEngine`) and replays canonical fixtures from `test/fixtures/ai/`.

### Acceptance Criteria
- [ ] Zero new dependencies added to `package.json`.
- [ ] `LocalHttpIntentEngine` cleanly routes natural-language prompts (German and English) with `<ethy_state>` awareness and falls back to `DeterministicIntentEngine` when offline.
- [ ] `npm run tsc`, `npm test`, and `npm run spellcheck` pass in CI with 0 network calls.

---

## 2. Concrete Implementation Plan (Planner — Grok 4.7)

*(To be filled out by Grok 4.7 during the Planning pass.)*

---

## 3. Implementation Notes & Deviations (Implementer — Composer 2.5)

*(To be filled out by Composer 2.5 after implementation and verification.)*
