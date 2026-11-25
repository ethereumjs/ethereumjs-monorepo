# WP-16f: Ethy Client-Wide `STATY/0` Leverage — Priority Concurrent EVM Sandbox, False-Zero-Safe JSON-RPC & Tx Broadcast, Live ENS & Zero-Leech AI Forensics, Mode-Aware Gating & Onboarding UX

- **Status:** `READY_FOR_PLANNING`
- **Dependencies:** `WP-16b` (`READY_FOR_PLANNING`), `WP-16c` (`READY_FOR_PLANNING`), `WP-16d` (`READY_FOR_PLANNING`), `WP-16e` (`READY_FOR_PLANNING`), `WP-08b` (`DONE`), `WP-15` (`DONE`)
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Holistic Scope & Architectural Requirements

### Goal
Audit and upgrade every client subsystem built under the legacy *"16-bucket SNAP accounts-only"* assumption so the **entire Ethy product** — JSON-RPC & MetaMask tx sending, EVM Sandbox, Live ENS (`IdentityResolver`), AI Contract Forensics & Storyteller, Start Page / Plaza UX, and persistent config — fully harvests the speed, completeness, and safety invariants of the **`STATY/0` + `ETHY/0` `v0.3`** architecture.

---

### Concrete Architectural Gaps Addressed (`WP-16f`)

Audit of the live Ethy codebase identified six concrete subsystems that would either stall, silently lie, leech `snap/1`, or lock out commands under `STATY/0` without this work package:

1. **Single Serial EVM Sandbox Queue (`src/evm/queue.ts`):**
   - Currently one global FIFO promise chain serializes all `eth_call`, `eth_estimateGas`, `IdentityResolver`, and AI `ContractDossierProbes` calls.
   - Under `STATY/0`, a single cold-miss `eth_call` waiting `250 ms` on `GET_WITNESSES` blocks hot MetaMask calls, prevents concurrent witness coalescing, and blows past AI probe budgets (`PROBE_BUDGET_MS = 100`).
2. **False-Zero Danger in JSON-RPC & Tx Validation (`src/rpc/methods.ts`, `src/txpool/validate.ts`):**
   - `eth_getBalance` / `eth_getTransactionCount` / `validateRawTransaction` currently treat `account === undefined` as `0n`. In Open-World `STATY/0` mode, an unresolved network timeout MUST NOT fabricate a `0 ETH` balance or `nonce = 0`!
3. **Synchronous ENS Registry Gate (`src/contracts/identityResolver.ts`):**
   - `hasLocalEnsRegistry()` synchronously checks RAM/disk only, missing the chance to warm the ENS Registry + Reverse Registrar immediately on `STATY/0` boot and unlock live `.eth` resolution within minutes.
4. **Background AI `snap/1` Leeching Risk (`src/contracts/contractDossierProbes.ts`, `src/ai/investigationTools.ts`):**
   - Without policy isolation, autonomous background AI forensics probing random newly-seen contracts could trigger upstream `snap/1` cold-miss fallbacks — violating our anti-leeching P2P citizenship invariant.
5. **16-Bucket SNAP Lockouts in Command Gating & Capability Derivation (`src/domains/commandAvailability.ts`, `src/spine/createSpine.ts`):**
   - `/account` checks `snapBucketsDoneCount === 16`, `/range` and `/sample` assume 16-bucket SNAP journals, and `deriveStateCapability` only models `SNAP_SYNCING` / `BAL_CATCHUP`.
6. **Start Page, Plaza Privacy Districts & Persistent State Mode (`StartPageUIComponent.ts`, `LiveHeadPlazaUIComponent.ts`, `persist/userConfig.ts`):**
   - Start page and Plaza do not yet surface the fast 2-stage `STATY/0` onboarding (`Rolling BALs → Hot Epochs`), per-district Closed-World privacy lights (`--full`), or saved `stateMode` preferences.

---

### Key Deliverables (`WP-16f`)

1. **Priority Concurrent EVM Sandbox Pool (`packages/ethy/src/evm/queue.ts`, `evm/sandbox.ts`):**
   - Replace the single serial FIFO `enqueueSandbox` with a bounded concurrent scheduler (`maxConcurrent = 4`) supporting **3 priority lanes**:
     - `'rpc'` (highest — user JSON-RPC `eth_call`, `eth_estimateGas`, `eth_createAccessList`, `/simulate`; `resolutionPolicy: 'full'`, default timeout `5,000 ms`).
     - `'identity'` (medium — `IdentityResolver` ENS / `name()` / `symbol()`; `resolutionPolicy: 'swarm-only'` for background block hooks, `'full'` for explicit `/contract` or `/account` user commands; timeout `1,500 ms`).
     - `'ai_probe'` (lowest — `ContractDossierProbes` & autonomous AI investigation tools; **`resolutionPolicy: 'swarm-only'` ALWAYS** so autonomous AI NEVER triggers upstream `snap/1` fallback!; timeout `600 ms` per call, `1,200 ms` dossier probe budget).
   - Concurrent execution inside the pool naturally enables `WitnessResolver`'s `10–25 ms` coalescing window when multiple cold calls arrive together (e.g., MetaMask batching `eth_getBalance` + `eth_call` + `eth_estimateGas` in parallel!).

2. **False-Zero-Safe JSON-RPC, End-to-End Tx Broadcast & `ethy_statyStatus` (`packages/ethy/src/rpc/methods.ts`, `txpool/validate.ts`, `tools/rpcTools.ts`):**
   - Catch `StateMissUnavailableError` across `eth_getBalance`, `eth_getTransactionCount`, `eth_getCode`, `eth_getStorageAt`, `eth_call`, `eth_estimateGas`, `eth_createAccessList`, and `eth_sendRawTransaction` → return an explicit, honest JSON-RPC error (`code: -32000`, `message: "State witness unavailable for open-world key; retry"`). **Never fabricate `0x0` on an unresolved miss.**
   - Verify end-to-end wallet / MetaMask transaction workflow under `STATY/0`:
     - Cold wallet `eth_getBalance` + `eth_getTransactionCount` → 1 verified witness.
     - Active ERC-20 / DEX `eth_estimateGas` → hot contract local + 1 verified `balances[sender]` witness.
     - `eth_sendRawTransaction` → verified sender balance/nonce + P2P `eth/71` broadcast + receipt in 64-block window.
   - Add **`ethy_statyStatus`** JSON-RPC method and extend **`ethy_status`** with `stateMode: 'staty' | 'full'`, `closedBucketsMask`, `privateBucketsCount` (`0..16`), `balHorizon`, `epochCoverage`, and `witnessStats` (for external wallets, dashboards, and MCP consumers).
   - Update `/rpc` method status matrix (`tools/rpcTools.ts`) so `Head State`, `EVM Sandbox`, and `Tx Broadcast` show `● active` immediately upon `STATY/0` `HEAD_FOLLOWING` (not waiting for 16 SNAP buckets).

3. **Live ENS Unlock, Active-State Contract Forensics & Provenance Badges (`packages/ethy/src/contracts/identityResolver.ts`, `contractDossierProbes.ts`, `tools/contractTools.ts`, `tools/headTools.ts`):**
   - **ENS Bootstrap (`IdentityResolver`):**
     - Add one-time async `warmEnsBootstrap()` upon entering `HEAD_FOLLOWING` in `STATY/0` mode (fetching ENS Registry + Reverse Registrar account & code via `STATY/0` → cached once for the whole session!).
     - Update `hasLocalEnsRegistry()` to reflect warmed shared `code/` accurately; resolve active tokens and forward-verified `.eth` reverse names cleanly on both Sepolia and Mainnet.
   - **Zero-Leech Deep Contract Forensics:**
     - Pass `lane: 'ai_probe'` (`resolutionPolicy: 'swarm-only'`) from `ContractDossierProbes` and autonomous `ChainDetective` tools; raise `PROBE_BUDGET_MS` cleanly (e.g. `400 ms` total) so hot contracts succeed on the first pass while cold untouched contracts fail gracefully without ever touching `snap/1`.
     - Ensure EIP-1967 / EIP-1167 / EIP-7702 proxy implementation following resolves implementation bytecodes from shared `code/` (`SharedCodeStore`).
   - **Cryptographic Provenance Line in `/account` & `/contract`:**
     - Display how the inspected state was verified: e.g., `Verified: Closed-World ETHY/0 Bucket 0x7 (100% Private)` or `Verified: STATY/0 Epoch #47120 + 18 BALs (Open-World)` or `Verified: Cached Witness (#12062700 + 40 BALs)`.

4. **Mode-Aware Spine Capabilities, Command Availability, Start/Plaza UX & Saved `stateMode` (`spine/createSpine.ts`, `domains/commandAvailability.ts`, `StartPageUIComponent.ts`, `LiveHeadPlazaUIComponent.ts`, `persist/userConfig.ts`):**
   - **`deriveStateCapability` & `commandAvailability.ts`:**
     - Support `STATY_BAL_WARMUP`, `STATY_EPOCH_SYNC`, and `HEAD_FOLLOWING` cleanly across `staty` and `full` modes.
     - Unlock `/account`, `/contract`, `/simulate`, `/send`, `/rpc`, `/live`, `/story` as soon as `STATY/0` reaches `HEAD_FOLLOWING` (removing stale `snapBucketsDoneCount === 16` gates!).
     - Adapt `/sample` in `STATY/0` mode to sample verified active accounts from the live working set (with an honest note that full key space sampling requires `--full`).
   - **Start Page 2-Stage Onboarding Bar (`StartPageUIComponent.ts`):**
     - Surface clear 2-stage progress during the 3–5 min `STATY/0` boot (`Step 1/2 Rolling BALs 5.4k/8.2k` → `Step 2/2 Hot Epochs 24/32 · Code 14.2k`), then auto-flip into the Ethereum Plaza (`/live`).
   - **Plaza 16-District Privacy Lights (`LiveHeadPlazaUIComponent.ts`):**
     - In `--full` mode, distinguish Closed-World private districts (`closedBucketsMask`) visually on the `0x0..0xf` Neighborhood Lights grid so users watch their read privacy grow bucket-by-bucket to `16/16`.
   - **Persistent `stateMode` Config (`persist/userConfig.ts`):**
     - Support optional `stateMode: 'staty' | 'full'` in `<dataDir>/config.json` (default `'staty'`), with `--full` / `--staty` CLI flags acting as session overrides (matching `WP-10a`'s `aiMode` precedence contract).

5. **Comprehensive End-to-End Integration & Safety Tests (`packages/ethy/test/statyClientLeverage.spec.ts`):**
   - **False-Zero Safety Gate:** Open-World `eth_getBalance`, `eth_getTransactionCount`, `eth_call`, and `eth_sendRawTransaction` on an unresolved miss MUST return JSON-RPC `-32000` — NEVER `0x0`! Proven-empty tombstones and Closed-World buckets MUST return `0x0` cleanly.
   - **MetaMask Tx Lifecycle Under `STATY/0`:** End-to-end test running `eth_getBalance` → `eth_getTransactionCount` → `eth_estimateGas` (active ERC-20 + cold sender balance slot) → `eth_sendRawTransaction` on a `STATY/0` node with verified P2P tx broadcast.
   - **Priority Pool & Zero-Leech AI Gate:** Verify a stalled cold `ai_probe` does not block a hot `rpc` `eth_call`, and verify `ai_probe` (`resolutionPolicy: 'swarm-only'`) makes **0** `snap/1` calls even on 100% cold contracts.
   - **Live ENS Warmup & Mode-Aware Command Gating:** Verify `IdentityResolver.warmEnsBootstrap()` resolves a reverse `.eth` name over `STATY/0`, and verify `/account`, `/simulate`, `/rpc`, and `/staty` unlock without 16-bucket SNAP completion.

---

### Acceptance Criteria (`WP-16f`)
- [ ] Zero false-zero RPC responses: unresolved open-world misses return `-32000` across every state/EVM/tx RPC method; proven-empty tombstones and Closed-World buckets return `0` locally.
- [ ] Full MetaMask/wallet tx workflow (`eth_getBalance` + `eth_getTransactionCount` + `eth_estimateGas` + `eth_sendRawTransaction`) passes end-to-end on a `STATY/0` node.
- [ ] Background AI probes run on the low-priority `'swarm-only'` lane (`0` `snap/1` calls) without ever head-of-line blocking user JSON-RPC.
- [ ] Live ENS resolution, `/account`, `/contract`, `/simulate`, `/rpc`, Start Page 2-stage progress, and Plaza privacy districts work seamlessly in both default `STATY/0` and `--full` modes.
- [ ] `npm run tsc`, `npm test`, and `npm run spellcheck` pass in `packages/ethy`.

---

## 2. Concrete Implementation Plan (Planner — Grok 4.7)

*(To be filled by Grok 4.7)*

---

## 3. Implementation Notes & Deviations (Implementer — Composer 2.5)

*(To be filled by Composer 2.5)*
