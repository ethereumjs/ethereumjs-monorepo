# WP-05a: `@ethereumjs/beacon-light` — Workspace Package, `@ethereumjs/common` Consensus Config, SSZ Merkle Proofs & BLS12-381 Sync Committee Verifier

- **Status:** `DONE`
- **Dependencies:** `WP-04k`
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Holistic Scope & Architectural Requirements

### Goal
Create the new first-class active workspace package **`@ethereumjs/beacon-light`** (`packages/beacon-light/`, version `10.1.3`) in the EthereumJS monorepo — a zero-bloat, pure-TypeScript Ethereum Consensus Layer (CL) Light Client verifier built natively on `@ethereumjs/common`, `@ethereumjs/util`, `@noble/curves/bls12-381.js`, and `@noble/hashes/sha2.js`.

Rather than trusting centralized RPC URLs or unverified execution-layer P2P headers (`difficulty = 0` post-Merge), `@ethereumjs/beacon-light` verifies the **512-validator Altair/Capella/Deneb/Electra/Osaka Sync Committee BLS12-381 aggregate signatures** and **SHA-256 Generalized-Index Merkle branches** (`finality_branch`, `next_sync_committee_branch`, `execution_branch`) to prove the canonical **`ExecutionPayloadHeader` (`blockNumber`, `blockHash`, `stateRoot`)** directly from Ethereum's validator set.

### Why Split the `WP-05` Series into `WP-05a` + `WP-05b`?
- **`WP-05a` (Cryptographic Core, `@ethereumjs/common` Consensus Metadata & Full Monorepo Release/CI Integration):** Establishes `packages/beacon-light`, extends `@ethereumjs/common` with Beacon Light Client chain parameters, implements the pure-TS SSZ Merkle + BLS12-381 Sync Committee verifier + `BeaconLightClient` state machine, and integrates `@ethereumjs/beacon-light` into all monorepo CI/release/API-snapshot tooling with 100% deterministic offline unit tests.
- **`WP-05b` (Multi-Endpoint REST/SSE Transport, Standalone `beacon-light` Live Pulse CLI & `@ethereumjs/ethy` Consensus Anchor Integration):** Adds the multi-provider untrusted HTTP/SSE transport (`fetch`), on-disk `SyncCommittee` persistence, the standalone interactive CLI (`npx @ethereumjs/beacon-light sepolia`) so developers can *feel* live 12s slot ticks and BLS verification in real time, and wires `@ethereumjs/beacon-light` into `@ethereumjs/ethy` (`CL` capability, verified pivot/head roots, and `/cl` microscope).

---

### Key Deliverables (`WP-05a`)

1. **Extend `@ethereumjs/common` with Consensus Light Client Chain Config (`packages/common/src/`):**
   - Add an optional `beaconLightClient?: BeaconLightClientConfig` field to `ChainConfig` in `packages/common/src/types.ts`:
     ```ts
     export interface BeaconForkScheduleEntry {
       /** Consensus fork name (`altair`, `bellatrix`, `capella`, `deneb`, `electra`, `osaka`, `amsterdam`) */
       name: string
       /** Activation epoch on the Beacon Chain */
       epoch: number
       /** 4-byte fork version hex (e.g. `'0x90000070'`) */
       version: PrefixedHexString
     }

     export interface BeaconLightClientConfig {
       /** Genesis time (unix seconds) of the Beacon Chain */
       genesisTime: number
       /** 32-byte `genesis_validators_root` hex */
       genesisValidatorsRoot: PrefixedHexString
       /** Seconds per slot (12 on Mainnet/Sepolia/Hoodi/Holesky) */
       secondsPerSlot: number
       /** Slots per epoch (32) */
       slotsPerEpoch: number
       /** Epochs per sync committee period (256 = 8,192 slots ≈ 27.3h) */
       epochsPerSyncCommitteePeriod: number
       /** Consensus fork version schedule for `compute_fork_version` / `DOMAIN_SYNC_COMMITTEE` */
       forks: BeaconForkScheduleEntry[]
       /** Default untrusted community Beacon Light Client REST endpoints for multi-provider fallback */
       defaultEndpoints: string[]
       /** Optional weak-subjectivity checkpoint block root hex */
       defaultCheckpointRoot?: PrefixedHexString
     }
     ```
   - Populate `beaconLightClient` on **`Mainnet`**, **`Sepolia`**, **`Hoodi`**, and **`Holesky`** in `packages/common/src/chains.ts` with their official `genesisTime`, `genesisValidatorsRoot`, fork versions (`altair` through `electra`/`osaka`), and public Beacon API endpoints.
   - Add helper methods on `Common` (or exported helpers in `@ethereumjs/beacon-light` reading `common.chainConfig().beaconLightClient`): `forkVersionAtEpoch(epoch)`, `syncCommitteePeriodAtSlot(slot)`.

2. **New Workspace Package `@ethereumjs/beacon-light` (`packages/beacon-light/`):**
   - **Manifest (`packages/beacon-light/package.json`):**
     - `"name": "@ethereumjs/beacon-light"`, `"version": "10.1.3"`.
     - Runtime dependencies (strictly within `dependencies.mdc` rules — **zero new third-party dependencies**):
       - `@ethereumjs/common`: `10.1.3`
       - `@ethereumjs/util`: `10.1.3`
       - `@noble/curves`: `^2.4.0`
       - `@noble/hashes`: `^2.4.0`
   - **SSZ & Generalized-Index SHA-256 Merkle Verifier (`src/ssz.ts` & `src/merkle.ts`):**
     - `isValidMerkleBranch(leaf: Uint8Array, branch: Uint8Array[], depth: number, index: number, root: Uint8Array): boolean` using `sha256` from `@noble/hashes/sha2.js` (or `common.customCrypto.sha256` when provided!).
     - `hashTreeRootBeaconBlockHeader(header: BeaconBlockHeader): Uint8Array` (5-field SSZ container: `slot`, `proposerIndex`, `parentRoot`, `stateRoot`, `bodyRoot`).
     - `hashTreeRootSyncCommittee(committee: SyncCommittee): Uint8Array` (`512 × 48-byte` `publicKeys` vector + `48-byte` `aggregatePubkey`).
     - `hashTreeRootExecutionPayloadHeader(payload: ExecutionPayloadHeaderSummary | Record<string, unknown>): Uint8Array` and generalized-index constants for Capella (`depth = 4, index = 9` for `execution_branch`, `depth = 5, index = 23` for `next_sync_committee_branch`, `depth = 6, index = 41` for `finality_branch`) and Electra/Osaka (`depth = 4, index = 9` for `execution_branch`, `depth = 6, index = 55` for `next_sync_committee_branch`, `depth = 7, index = 105` for `finality_branch`), selected automatically by fork epoch!
   - **BLS12-381 Sync Committee Signature Verifier (`src/bls.ts`):**
     - Uses `bls12_381` from `@noble/curves/bls12-381.js` (and supports optional `customCrypto` override).
     - `verifySyncCommitteeSignature(opts: { publicKeys: Uint8Array[]; syncCommitteeBits: Uint8Array | boolean[]; signature: Uint8Array; signingRoot: Uint8Array; minParticipants?: number }): { valid: boolean; participantCount: number }`:
       - Enforces `participantCount >= 1` and `participantCount * 3 >= 512 * 2` ($\ge 342 / 512$ supermajority by default).
       - Sums the participating `G1` public keys (`bls12_381.G1.Point.fromHex`) into an aggregate `G1` point and verifies the 96-byte `G2` signature against `signingRoot` (`DOMAIN_SYNC_COMMITTEE = 0x07000000`, using Ethereum's standard `BLS12-381` proof-of-possession domain separation tag).
   - **Light Client State Machine (`src/client.ts`):**
     - `BeaconLightClient` class (and `createBeaconLightClient({ common, ... })` factory):
       - `bootstrap(bootstrap: LightClientBootstrap, expectedBlockRoot?: Uint8Array): LightClientHeader` — verifies `header` matches `expectedBlockRoot` (if provided) and verifies `current_sync_committee` against `header.beacon.stateRoot` via `current_sync_committee_branch`.
       - `applyUpdate(update: LightClientUpdate): { periodAdvanced: boolean; finalizedUpdated: boolean; optimisticUpdated: boolean }` — verifies the BLS sync aggregate signature on `attested_header` (at `signature_slot`), verifies `finality_branch` (`finalized_header`) and `next_sync_committee_branch` (`next_sync_committee`), and rotates `currentSyncCommittee = nextSyncCommittee` when the sync committee period advances.
       - `applyFinalityUpdate(update: LightClientFinalityUpdate)` and `applyOptimisticUpdate(update: LightClientOptimisticUpdate)`.
       - `getHeadExecution(): VerifiedExecutionHead | undefined` and `getFinalizedExecution(): VerifiedExecutionHead | undefined` returning `{ slot, beaconBlockRoot, blockNumber, blockHash, stateRoot, parentHash, timestamp, participantCount }`.

3. **Full Monorepo CI, Release & Public API Snapshot Wiring:**
   - Add `'beacon-light'` to `ACTIVE_PACKAGES` and `PUBLISH_ORDER` (after `'common'` and `'util'`) in `scripts/release-npm.ts`.
   - Add `'beacon-light'` to `PUBLIC_API_PACKAGES` in `scripts/public-api-snapshot.mjs` and generate `config/public-api-snapshots/beacon-light.json`.
   - Add `'beacon-light'` to `SKIPPABLE_JOBS.static` in `scripts/ci-affected.mjs` and add the test step to `.github/workflows/rlp-ethash-genesis-wallet-build.yml` (following `ci.mdc` Goal 1: bundle fast pure-TS library suites into the `static` workflow rather than spawning extra GitHub Actions runners), keeping `scripts/ci-affected.spec.mjs` green.
   - Add `packages/beacon-light/README.md`, `CHANGELOG.md`, `tsconfig.json`, `tsconfig.prod.cjs.json`, `tsconfig.prod.esm.json`, and `examples/verifyUpdate.ts`.

4. **Tier-1 Unit Test Suite (`packages/beacon-light/test/`):**
   - `merkle.spec.ts`: Tests `isValidMerkleBranch`, `hashTreeRootBeaconBlockHeader`, `hashTreeRootSyncCommittee`, and Capella/Electra generalized index proof verification.
   - `bls.spec.ts`: Tests `verifySyncCommitteeSignature` with real BLS12-381 `G1` validator keys and `G2` aggregate signatures, testing supermajority enforcement ($\ge 342 / 512$), tampered `signingRoot` rejection, and non-participating bitmask filtering.
   - `client.spec.ts`: Tests full `BeaconLightClient` lifecycle (`bootstrap` → `applyUpdate` across a 27-hour Sync Committee period boundary → `applyFinalityUpdate` → `applyOptimisticUpdate` → `getHeadExecution()` / `getFinalizedExecution()`), plus rejection of forged execution state roots or insufficient validator participation.

---

### Acceptance Criteria (`WP-05a`)
- [x] Zero new third-party dependencies added to root or package `package.json`.
- [x] `@ethereumjs/common` exports `BeaconLightClientConfig` on `Mainnet`, `Sepolia`, `Hoodi`, and `Holesky`.
- [x] `@ethereumjs/beacon-light` builds (`ESM` + `CJS`), passes `public-api-snapshot.spec.mjs` and `ci-affected.spec.mjs`, and is registered in `scripts/release-npm.ts` (`ACTIVE_PACKAGES` + `PUBLISH_ORDER`).
- [x] `npm run tsc`, `npm test`, and `npm run spellcheck` pass across `@ethereumjs/common` and `@ethereumjs/beacon-light`.

---

## 2. Concrete Implementation Plan (Planner — Grok 4.7)

**Decision D-085 (Electra generalized indices).** Pre-Electra light-client gindices: `CURRENT_SYNC_COMMITTEE` **54**, `NEXT_SYNC_COMMITTEE` **55**, `FINALIZED_ROOT` **105**; execution payload in `BeaconBlockBody` stays **25** through Fulu. Electra and later (CL Fulu stored as `osaka`): current **86**, next **87**, finalized **169**; execution **25**. `isValidMerkleBranch` uses `depth = floor(log2(gindex))`, `index = gindex - 2^depth`, and rejects branches whose length is not `depth`.

**Domain & BLS.** Fork version at **`signature_slot - 1`**; `DOMAIN_SYNC_COMMITTEE = 0x07000000` mixed with `genesis_validators_root`. Signing root is `sha256(headerHashTreeRoot || domain)` (two-chunk `SigningData`). `verifySyncCommitteeSignature` sums participating G1 keys (342/512 default supermajority). Invalid bootstrap/update **throws**; BLS helper returns `{ valid, participantCount }`. SHA-256 via `common.customCrypto.sha256` when set; optional `verifyAggregate` on `createBeaconLightClient` for tests/backends (no `CustomCrypto.bls` field).

**Slice 1 — `@ethereumjs/common`:** `BeaconLightClientConfig` + fork schedule on Mainnet, Sepolia, Hoodi, Holesky (`beaconLightClientConfigs.ts`); `Common.beaconLightClient()`, `forkVersionAtEpoch()`, `syncCommitteePeriodAtSlot()`; `test/beaconLightClient.spec.ts`.

**Slice 2 — package & monorepo:** `packages/beacon-light` @ `10.1.3` (genesis-shaped scaffold); release npm/github, `PUBLIC_API_PACKAGES`, `ci-affected` `static`, workflow test step, root README row, `config/public-api-snapshots/beacon-light.json`.

**Slice 3 — SSZ/Merkle:** Closed SSZ subset (`ssz.ts`), `merkle.ts` + `proofLayout.ts`, zero-tree synthetic proofs in `test/merkle.spec.ts`.

**Slice 4 — domain/BLS:** `domain.ts`, `bls.ts`, `test/bls.spec.ts` (342/341 participants, domain at Electra epoch).

**Slice 5 — state machine:** `client.ts` bootstrap / applyUpdate / finality / optimistic; `test/client.spec.ts` + `examples/verifyUpdate.ts` (offline, Mainnet).

**Out of scope:** HTTP transport, CLI, Ethy `/cl` → **WP-05b**.

---

## 3. Implementation Notes & Deviations (Implementer — Composer 2.5)

- **D-085** recorded in `PROGRESS.md`; Electra gindices in code match consensus-specs (not the pre-plan WP doc table).
- **Test chain:** Offline client tests use **Hoodi** (Capella/Deneb from epoch 0) so low-slot fixtures can carry execution payloads; the example uses **Mainnet** slot `6_500_000` with fork-aware execution-header SSZ (Capella field set before Deneb activation epoch).
- **Zero-hash ladder test:** Level 1 is `sha256(64 zero bytes)` (`0xf5a5…`), not `sha256(32 zero bytes)`.
- **Noble BLS v2.4:** G1 scalar normalization via `bls12_381.G1.normPrivateKeyToScalar`; aggregate verify via top-level `bls12_381.verify` / `aggregatePublicKeys` / `aggregateSignatures`.
- **Verification:** `npm run tsc` + `npm run test:node` in `common` and `beacon-light`; `npm run examples` in `beacon-light`; `node scripts/public-api-snapshot.spec.mjs`; `node scripts/ci-affected.spec.mjs`; package `spellcheck` green (cspell override for `gindex` / `supermajority` in `config/cspell-ts.json`).
