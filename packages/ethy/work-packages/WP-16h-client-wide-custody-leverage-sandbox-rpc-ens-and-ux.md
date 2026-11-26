# WP-16h: Ethy Client-Wide Custody Leverage — Priority Concurrent EVM Sandbox, False-Zero-Safe JSON-RPC & Tx Broadcast, Live ENS & Zero-Leech AI Forensics, Mode-Aware Gating & Onboarding UX

- **Status:** `READY_FOR_PLANNING`
- **Dependencies:** `WP-16b` (`DONE`), `WP-16c` (`DONE`), `WP-16d`..`WP-16g` (`READY_FOR_PLANNING`), `WP-08b` (`DONE`), `WP-15` (`DONE`)
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Holistic Scope & Architectural Requirements

### Goal
Audit and upgrade every client subsystem built under the legacy *"wait for all 16 SNAP buckets before state is usable"* assumption so the **entire Ethy product** — JSON-RPC & MetaMask tx sending, EVM Sandbox, Live ENS (`IdentityResolver`), AI Contract Forensics & Storyteller, Start Page / Plaza UX, and persistent config — fully harvests the speed, 1-hop custody completeness, and safety invariants of **Unified Custody `ETHY/0`**.

---

### Concrete Architectural Gaps Addressed (`WP-16h`)

Audit of the live Ethy codebase identified six concrete subsystems that would otherwise stall, silently lie, leech `snap/1`, or lock out commands under Custody `ETHY/0`:

1. **Single Serial EVM Sandbox Queue (`src/evm/queue.ts`):**
   - Currently one global FIFO promise chain serializes all `eth_call`, `eth_estimateGas`, `IdentityResolver`, and AI `ContractDossierProbes` calls.
   - Under Open-World Custody mode, a single cold-miss `eth_call` waiting `50–250 ms` on a 1-hop `ETHY/0` witness/chunk blocks hot MetaMask calls, prevents concurrent witness coalescing, and blows past AI probe budgets (`PROBE_BUDGET_MS = 100`).
2. **False-Zero Danger in JSON-RPC & Tx Validation (`src/rpc/methods.ts`, `src/txpool/validate.ts`):**
   - `eth_getBalance` / `eth_getTransactionCount` / `validateRawTransaction` currently treat `account === undefined` as `0n`. In Open-World buckets (the 14 remote buckets under default `--custody 2`), an unresolved network timeout MUST NOT fabricate a `0 ETH` balance or `nonce = 0`!
3. **Synchronous ENS Registry Gate (`src/contracts/identityResolver.ts`):**
   - `hasLocalEnsRegistry()` synchronously checks RAM/disk only, missing the chance to warm the ENS Registry + Reverse Registrar in 1 hop from their bucket custodians immediately on boot and unlock live `.eth` resolution within minutes.
4. **Background AI `snap/1` Leeching Risk (`src/contracts/contractDossierProbes.ts`, `src/ai/investigationTools.ts`):**
   - Without policy isolation, autonomous background AI forensics probing random newly-seen contracts could trigger Day-1 `snap/1` fallback on uncovered buckets — violating our anti-leeching P2P citizenship invariant.
5. **16-Bucket SNAP Lockouts in Command Gating & Capability Derivation (`src/domains/commandAvailability.ts`, `src/spine/createSpine.ts`):**
   - `/account` checks `snapBucketsDoneCount === 16`, `/range` and `/sample` assume 16-bucket SNAP journals, and `deriveStateCapability` only models `SNAP_SYNCING` / `BAL_CATCHUP`.
6. **Start Page, Plaza Privacy Districts & Persistent Custody Config (`StartPageUIComponent.ts`, `LiveHeadPlazaUIComponent.ts`, `persist/userConfig.ts`):**
   - Start page and Plaza do not yet surface fast 2-stage Custody onboarding (`Rolling BALs → Live + Background Custody`), per-district Closed-World vs 1-Hop Swarm lights, or saved `custodyCount` preferences.

---

### Key Deliverables (`WP-16h`)

1. **Priority Concurrent EVM Sandbox Pool (`packages/ethy/src/evm/queue.ts`, `evm/sandbox.ts`):**
   - Replace the single serial FIFO `enqueueSandbox` with a bounded concurrent scheduler (`maxConcurrent = 4`) supporting **3 priority lanes**:
     - `'rpc'` (highest — user JSON-RPC `eth_call`, `eth_estimateGas`, `eth_createAccessList`, `/simulate`; `resolutionPolicy: 'full'`, default timeout `5,000 ms`).
     - `'identity'` (medium — `IdentityResolver` ENS / `name()` / `symbol()`; `resolutionPolicy: 'swarm-only'` for background block hooks, `'full'` for explicit `/contract` or `/account` user commands; timeout `1,500 ms`).
     - `'ai_probe'` (lowest — `ContractDossierProbes` & autonomous AI investigation tools; **`resolutionPolicy: 'swarm-only'` ALWAYS** — resolves via 1-hop `ETHY/0` custodians freely, **NEVER** touches `snap/1`!; timeout `600 ms` per call, `1,200 ms` dossier probe budget).
   - Concurrent execution naturally feeds `CustodyStateResolver`'s `10–25 ms` coalescing window when MetaMask batches parallel `eth_getBalance` + `eth_call` + `eth_estimateGas` requests.

2. **False-Zero-Safe JSON-RPC, End-to-End Tx Broadcast & `ethy_custodyStatus` (`packages/ethy/src/rpc/methods.ts`, `txpool/validate.ts`, `tools/rpcTools.ts`):**
   - Catch `StateMissUnavailableError` across `eth_getBalance`, `eth_getTransactionCount`, `eth_getCode`, `eth_getStorageAt`, `eth_call`, `eth_estimateGas`, `eth_createAccessList`, and `eth_sendRawTransaction` → return an explicit, honest JSON-RPC error (`code: -32000`, `message: "State witness unavailable for open-world key; retry"`). **Never fabricate `0x0` on an unresolved miss.**
   - Verify end-to-end wallet / MetaMask transaction workflow under default `--custody 2`:
     - Cold wallet `eth_getBalance` + `eth_getTransactionCount` → 1-hop `ETHY/0` witness/chunk from the wallet's bucket custodian.
     - Active ERC-20 / DEX `eth_estimateGas` → hot contract local + 1-hop verified `balances[sender]` witness.
     - `eth_sendRawTransaction` → verified sender balance/nonce + P2P `eth/71` broadcast + receipt in 64-block window.
   - Add **`ethy_custodyStatus`** JSON-RPC method and extend **`ethy_status`** with `custodyCount` (`1..16`), `custodyBucketsMask`, `closedBucketsMask`, `trieBucketsMask`, `swarmReachableBucketsMask`, `privateBucketsCount` (`0..16`), `balHorizon`, and `resolutionStats` (for external wallets, dashboards, and MCP consumers).
   - Update `/rpc` method status matrix (`tools/rpcTools.ts`) so `Head State`, `EVM Sandbox`, and `Tx Broadcast` show `● active` immediately upon entering live `HEAD_FOLLOWING` (not waiting for 16 SNAP buckets).

3. **Live ENS Unlock, Zero-Leech Contract Forensics & Provenance Badges (`packages/ethy/src/contracts/identityResolver.ts`, `contractDossierProbes.ts`, `tools/contractTools.ts`, `tools/headTools.ts`):**
   - **ENS Bootstrap (`IdentityResolver`):**
     - Add one-time async `warmEnsBootstrap()` upon entering `HEAD_FOLLOWING` (fetching ENS Registry + Reverse Registrar account & code in 1 hop from their `ETHY/0` bucket custodians → cached once for the whole session!).
     - Update `hasLocalEnsRegistry()` to reflect warmed `SharedCodeStore` accurately; resolve active tokens and forward-verified `.eth` reverse names cleanly on both Sepolia and Mainnet.
   - **Zero-Leech Deep Contract Forensics:**
     - Pass `lane: 'ai_probe'` (`resolutionPolicy: 'swarm-only'`) from `ContractDossierProbes` and autonomous `ChainDetective` tools; raise `PROBE_BUDGET_MS` to `400 ms` total so contracts resolve via local custody or 1-hop `ETHY/0` peers while uncovered buckets fail gracefully without ever touching `snap/1`.
   - **Honest Provenance Badges in `/account` & `/contract`:**
     - Surface exact source provenance (`Local Custody 🔒`, `Local BAL`, `Proven-Empty`, `ETHY 1-Hop Proof`, `ETHY 1-Hop Chunk`, or `SNAP Bootstrap`) so developers and operators can inspect exactly how every answer was cryptographically verified.

4. **Mode-Aware Command Gating, Start Page, Plaza 16-District Lights & Persistent Config (`packages/ethy/src/domains/commandAvailability.ts`, `spine/createSpine.ts`, `tui/`, `persist/userConfig.ts`):**
   - **Command Gating:** Unlock `/account`, `/contract`, `/simulate`, and `/rpc` as soon as `HEAD_FOLLOWING` is active (regardless of whether `closedBucketsMask` is `1/16` or `16/16`), and keep `/range` / `/sample` clearly scoped to locally closed custody buckets.
   - **Start Page (`StartPageUIComponent.ts`):** Replace legacy *"waiting for 16 SNAP buckets"* copy with crisp 2-stage Custody onboarding (`Rolling BALs → ★ Live + Background 2/16 Custody`), showing live custody bucket progress and 1-hop swarm coverage.
   - **Ethereum Plaza 16-District Custody & Privacy Lights (`LiveHeadPlazaUIComponent.ts`):** Visually distinguish each of the 16 nibble districts (`0x0..0xf`) between **Local Closed-World (`●` Private + Trie)**, **1-Hop Swarm Reachable (`◐`)**, and **Uncovered (`○`)**, so `--full` users watch all 16 districts lock into private local custody in real time.
   - **Persistent Custody Preference (`persist/userConfig.ts`):** Persist optional `custodyCount?: number` (`1..16`, rejecting `< 1`) in `<dataDir>/config.json` with clean CLI override precedence (`--full` / `--custody <N>` > `config.json` > default `2`).

5. **Comprehensive Client-Wide Regression Suite (`packages/ethy/test/custodyClientLeverage.spec.ts`):**
   - Concurrent sandbox priority test: 1 slow cold `'ai_probe'` miss does not block a concurrent hot `'rpc'` `eth_call`; `'ai_probe'` strictly receives `resolutionPolicy: 'swarm-only'`.
   - False-zero safety test: unresolved Open-World misses return JSON-RPC error `-32000` across `eth_getBalance`, `eth_getTransactionCount`, `eth_getStorageAt`, `eth_call`, and `eth_sendRawTransaction` (never `0x0`), while Closed-World buckets and proven-empty tombstones return `0x0` cleanly.
   - `ethy_custodyStatus` + `ethy_status` schema test, ENS warm-up test, mode-aware command availability test (`custody 1` live unlocks `/account`, `/contract`, `/simulate`), and `config.json` `custodyCount` precedence test.

---

### Acceptance Criteria (`WP-16h`)
- [ ] Bounded concurrent EVM sandbox (`rpc > identity > ai_probe`) eliminates head-of-line blocking and locks autonomous AI probes to `'swarm-only'` (`0` `snap/1` leeching).
- [ ] JSON-RPC and tx validation never fabricate `0x0` on unresolved Open-World misses (`-32000` honest error); `ethy_custodyStatus` exposes accurate custody/privacy/1-hop telemetry.
- [ ] ENS bootstrap warms in 1 hop over `ETHY/0`, `/account` + `/contract` display honest provenance badges, and Start Page / Plaza / command gating reflect Unified Custody `ETHY/0` cleanly.
- [ ] `npm run tsc`, `npm test`, and `npm run spellcheck` pass in `packages/ethy`.

---

## 2. Concrete Implementation Plan (Planner — Grok 4.7)

*(To be filled out by Grok 4.7 before implementation begins.)*

---

## 3. Implementation Notes & Deviations (Implementer — Composer 2.5)

*(To be filled out by Composer 2.5 upon completion.)*
