# WP-08b: On-Demand `@ethereumjs/evm` Execution (`eth_call`, `eth_estimateGas`, `eth_createAccessList`, `/simulate`), P2P Transaction Broadcast (`eth_sendRawTransaction`) & Headless SDK

- **Status:** `READY_FOR_PLANNING`
- **Dependencies:** `WP-06c`, `WP-07h` (`DONE`), `WP-08a`
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Holistic Scope & Architectural Requirements

### Goal
Complete the full execution-on-demand and wallet-transaction cycle of Ethy by coupling `@ethereumjs/evm` and `@ethereumjs/vm` to `FlatStateManager` (using `shallowCopy()` overlays and the cold account/code/storage disk hooks from `WP-04g`/`WP-07g`/`WP-08a`), wiring **`eth_call`**, **`eth_estimateGas`**, **`eth_createAccessList`**, and **`eth_sendRawTransaction`** into the `WP-08a` JSON-RPC 2.0 server, unlocking the **`/simulate`** TUI microscope, and exposing the clean **`createEthyNode({ headless: true })` programmatic SDK**.

### Key Deliverables

1. **Copy-on-Write Sandbox Overlays on `FlatStateManager` (`src/evm/`):**
   - Uses `FlatStateManager.shallowCopy()` (backed by `coldAccountLookup`, `coldCodeLookup`, and `coldStorageLookup`) so every on-demand `eth_call`, `eth_estimateGas`, `eth_createAccessList`, or `/simulate` session runs on an O(1) Copy-on-Write overlay on top of the live synced `FlatStateManager` — concurrent simulations never mutate canonical synced state.
   - Supports standard JSON-RPC `stateOverride` sets (`balance`, `nonce`, `code`, `state`, `stateDiff`) on `eth_call` and `eth_estimateGas`.

2. **JSON-RPC Execution & Broadcast Methods (`src/rpc/`):**
   - `eth_call(txObj, tag?, stateOverride?)`: Executes `evm.runCall` on an isolated overlay at `"latest"` and returns hex return data (or standard EIP-1474 `execution reverted` error with revert data and decoded `Error(string)` / custom error reason).
   - `eth_estimateGas(txObj, tag?, stateOverride?)`: Estimates minimal gas limit via `runCall` + binary search.
   - `eth_createAccessList(txObj, tag?)`: Runs call with access-list tracking and returns `{ accessList, gasUsed }`.
   - `eth_sendRawTransaction(signedTxHex)`: Decodes and validates the signed transaction via `@ethereumjs/tx` (chainId, signature, sender balance & nonce against `FlatStateManager`), broadcasts `TRANSACTIONS (0x02)` / `NEW_POOLED_TRANSACTION_HASHES (0x08)` to connected `eth` peers, and returns the 32-byte transaction hash.

3. **Interactive `/simulate` & `/send` TUI Tools (`src/tools/simulateTools.ts`):**
   - `/simulate <to> <data_or_sig> [value]`: Runs an on-demand EVM call at the current head and renders a compact semantic execution summary (`Gas used`, `Return data` + decoded ABI preview, `Storage slot diffs`, `Logs emitted`, and `Accounts touched`) in the Interaction View.

4. **Public Programmatic & Headless SDK (`src/index.ts`):**
   - Clean public exports for library and MCP consumers (`createEthyNode`, `node.spine`, `node.createSandboxOverlay()`, `node.executeTool()`, `node.rpc`).

### Acceptance Criteria
- [ ] `eth_call`, `eth_estimateGas`, `eth_createAccessList`, and `eth_sendRawTransaction` work over the `WP-08a` JSON-RPC 2.0 server and pass unit/integration tests.
- [ ] `/simulate` works both from the TUI prompt (`ethy >`) and programmatically via `createEthyNode({ headless: true })`.
- [ ] All workspace gates (`npm run tsc`, `npm test`, `npm run spellcheck`) pass with 0 errors.

---

## 2. Concrete Implementation Plan (Planner — Grok 4.7)

*(To be filled out by Grok 4.7 during the Planning pass.)*

---

## 3. Implementation Notes & Deviations (Implementer — Composer 2.5)

*(To be filled out by Composer 2.5 after implementation and verification.)*
