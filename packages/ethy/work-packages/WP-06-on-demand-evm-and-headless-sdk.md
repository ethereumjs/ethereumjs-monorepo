# WP-06: On-Demand `@ethereumjs/evm` Sandbox, Light Beacon Pulse & Headless SDK

- **Status:** `BLOCKED_BY_WP-05`
- **Dependencies:** `WP-04`, `WP-05`
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Holistic Scope & Architectural Requirements

### Goal
Complete the first full milestone cycle of Ethy by coupling `@ethereumjs/evm` and `@ethereumjs/vm` to `StateStore` for **on-demand local execution and tracing at the chain head** (including on-demand `snap/1` cold-account fetching when running in Rolling-Window mode), adding the Stage-2 lightweight HTTP Beacon header pulse, and exposing the clean **`createEthyNode({ headless: true })` programmatic SDK** so external consumers (such as the *Feel Your Protocol* MCP server) can spawn isolated Copy-on-Write simulation overlays on live state in milliseconds.

### Key Deliverables

1. **Copy-on-Write Sandbox Overlays & On-Demand Cold-State Fallback on `FlatStateManager` (`src/evm/`):**
   - Uses `FlatStateManager.shallowCopy()` (from `@ethereumjs/statemanager`, built in `WP-03`) so every on-demand simulation or "what-if" session runs on an O(1) Copy-on-Write overlay on top of the live synced `FlatStateManager` — 10 concurrent simulations never mutate canonical synced state.
   - **On-Demand Cold-State Fallback (Rolling-Window Model A):** If `getAccount`, `getCode`, or `getStorage` encounters an account/slot not yet present in `FlatStateManager`, optionally fetches it on-demand from a connected `snap/1` peer (with polite rate-limiting and local caching) and records the fetch in `EthySpine`.

2. **On-Demand EVM Simulation & Semantic Trace Tool (`src/tools/simulateTools.ts`):**
   - `simulateTxOnHead`: Runs a call or transaction via `@ethereumjs/evm` (`runCall`) or `@ethereumjs/vm` (`runTx`) on an overlay of the current head state (with optional state/code overrides and experimental Amsterdam EIP flags).
   - Captures a **compact, LLM-friendly semantic execution summary** (call frames, gas used, storage slot diffs, revert reason, and generated EIP-7928 BAL footprint) rather than a 50 MB raw opcode dump, and renders a structured summary widget in Zone 2.

3. **Lightweight Beacon Header Pulse (`src/cl/beaconPulse.ts`):**
   - Optional Stage-2 consensus tracker (~50 lines using built-in `fetch()`) polling a configurable Beacon REST endpoint (`/eth/v1/beacon/states/head/header` or `/eth/v2/beacon/blocks/head`) every 12 seconds when configured, feeding canonical `slot` and `execution_payload_header.state_root` / `block_hash` into `EthySpine` alongside P2P announcements.

4. **Public Programmatic & Headless SDK (`src/index.ts`):**
   - Clean public exports for library and MCP consumers:
     - `createEthyNode(opts)` (`headless: true | false`, `network`, `stateStore`, `intentEngine`).
     - `node.spine` (read-only telemetry snapshot & event emitter).
     - `node.createSandboxOverlay()` (spawns an isolated `StateManagerInterface` + `@ethereumjs/vm` instance anchored at the current head in `<2ms`).
     - `node.executeTool(toolName, args)` and `node.resolvePrompt(prompt)` (direct structured access for MCP servers).

5. **Tier-1 Unit Test Suite (`test/evmSandbox.spec.ts` & `test/headlessSdk.spec.ts`):**
   - Tests `EthyStateManager` Copy-on-Write isolation: run a state-mutating contract call on the overlay, verify the overlay reflects the new storage value + return data, and verify the underlying `StateStore` remains untouched.
   - Tests on-demand cold-account fallback via `SyntheticSnapPeer`.
   - Tests `createEthyNode({ headless: true })` end-to-end (synthetic sync → BAL head update → `simulateTxOnHead` tool execution) with zero stdout output.

### Acceptance Criteria
- [ ] `EthyStateManager` implements `StateManagerInterface` with full Copy-on-Write isolation and passes `@ethereumjs/evm` call/tx simulations.
- [ ] `simulateTxOnHead` works both from the TUI prompt (`ethy >`) and programmatically via `createEthyNode({ headless: true })`.
- [ ] All workspace gates (`npm run tsc`, `npm test`, `npm run spellcheck`) pass with 0 errors.

---

## 2. Concrete Implementation Plan (Planner — Grok 4.7)

*(To be filled out by Grok 4.7 during the Planning pass.)*

---

## 3. Implementation Notes & Deviations (Implementer — Composer 2.5)

*(To be filled out by Composer 2.5 after implementation and verification.)*
