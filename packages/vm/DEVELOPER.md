# Developer Documentation

The VM package is the gravitational center of the monorepo: running blocks and transactions here exercises `@ethereumjs/evm`, `@ethereumjs/block`, `@ethereumjs/tx`, `@ethereumjs/common`, `@ethereumjs/statemanager`, and related packages together. Consensus tests against official Ethereum fixtures are therefore both VM tests and a practical end-to-end check of those libraries.

This document covers how we run those tests, how we update the fixture snapshot, and how to debug and profile the VM. Library usage belongs in the [package README](./README.md). Monorepo tooling belongs in the [root developer docs](../../DEVELOPER.md).

## Table of Contents

- [Overview](#overview)
- [Consensus runner (EST + legacy blockchain)](#consensus-runner-est--legacy-blockchain)
- [Updating fixtures (manifest bump)](#updating-fixtures-manifest-bump)
- [Package Tests](#package-tests)
- [Debugging](#debugging)
- [Performance](#performance)
- [Specialist Tools](#specialist-tools)

## Overview

### Test suites

| Suite | Source | Runner | Typical use |
| --- | --- | --- | --- |
| Execution-spec tests (EST) | Pinned [execution-specs](https://github.com/ethereum/execution-specs) release tarballs | [`test/consensus/`](./test/consensus/) CLI | Default PR / nightly consensus (state + blockchain) |
| Legacy blockchain | [ethereum/tests](https://github.com/ethereum/tests) `BlockchainTests` | Same CLI (`--source legacy`) | Frozen `bc*` suites not ported to EST |
| Package tests | `test/api/` | `npm run test:API` | Unit / API tests for VM itself |

GeneralStateTests from `ethereum/tests` are retired upstream; ported cases live under EST `tests/ported_static/`. Legacy **BlockchainTests** and **TransactionTests** are pinned in [`config/legacy-ethereum-tests.json`](../../config/legacy-ethereum-tests.json) and fetched with `npm run legacy-tests:fetch` (see root [DEVELOPER.md](../../DEVELOPER.md)). Block difficulty JSON is vendored in `packages/block`.

### What “green” means

On an ordinary PR, the VM is green when `npm run test:API` (and the coverage job in CI) passes. Recent execution-spec forks are opt-in.

- **`test: consensus`:** one CI job per recent fork, `vm-consensus-est-recent (Prague|Osaka|Amsterdam)`. Each runs `test:consensus -- --source tests --fork <name>`, four workers (`nproc`), per-fork fixture cache. Without the label those jobs are skipped and the PR stays mergeable. The pull request then runs `npm run test:consensus:smoke` instead.
- **`master` pushes** still run the recent forks.

With the `test: all hardforks` label, CI runs one job per EST fork (`ALL_EST_FORKS`) plus legacy blockchain, and does not also run the recent jobs. With **`test: bogota`**, CI runs `vm-consensus-bogota` (one job per `Bogota` and `AmsterdamToBogotaAtTime15k`, manifest in `fixtures.bogota.json`). Nightly runs one job per EST fork and `--run-skipped slow`.

Do not add skip entries just to go green on consensus (S1).

### Local development tiers (no tarball every time)

Fixtures are **not** in git. You download each pinned release **once per machine** (or per `EST_FIXTURES_CACHE`), then reuse the cache. The runner does **not** download by default — run `fixtures:fetch` explicitly, or pass `--auto-fetch` on a one-off command.

| Tier | When | Command |
| --- | --- | --- |
| **1 — Fast** | VM / library edits, agents, prepublish | `npm run test:API`, `npm run test:consensus:smoke` |
| **2 — Runner slice** | Consensus runner / selection, no network | `npm run test:consensus:sample` (checked-in tree, `--list`) |
| **3 — Targeted EST** | One fork or file after cache exists | `npm run test:consensus -- --fork Osaka --format state --file foo.json --jobs 1` |
| **4 — Full EST** | Pre-push, fixture bumps | `npm run fixtures:fetch -- tests` (tarball + Prague/Osaka/Amsterdam extracts) then `npm run test:consensus:pr` |

**Cache layout:** `EST_FIXTURES_CACHE` defaults to `~/.cache/ethereumjs/est-fixtures/<source>/<tag>/`. Per-fork trees live under `forks/<ForkName>/` (state + blockchain + filtered index). CI restores `est-extract-tests-<fixtures-hash>-<Fork>` per job. Master warm fills recent forks via [`vm-consensus-cache-warm.yml`](../../.github/workflows/vm-consensus-cache-warm.yml).

**Local fills:** after EELS `fill`, pass `--fixture-root /path/to/fixtures` (no release tarball).

**Legacy Prague `bc*` only:** `npm run test:consensus:legacy` uses cached `BlockchainTests` (`legacy-tests:fetch -- blockchain`) — no EST download.

**Hegota dev (`bogota-devnet`):** pinned in [`fixtures.bogota.json`](./test/consensus/fixtures.bogota.json) (separate from `fixtures.json` so tag bumps do not invalidate stable CI caches). Fetch per fork: `npm run fixtures:fetch -- bogota-devnet --fork Bogota`.

## Consensus runner (EST + legacy blockchain)

Standalone harness under [`test/consensus/`](./test/consensus/) — not Vitest. Worker threads, index-driven selection, shared skip list, per-directory report + JSON output.

**Manifests:** [`fixtures.json`](./test/consensus/fixtures.json) (`tests` + `legacy`), [`fixtures.bogota.json`](./test/consensus/fixtures.bogota.json) (`bogota-devnet` only). **Cache:** `EST_FIXTURES_CACHE` (default `~/.cache/ethereumjs/est-fixtures/`).

```bash
cd packages/vm
npm run fixtures:fetch                  # idempotent download + extract
npm run test:consensus -- --list        # counts per fork/format
npm run test:consensus:pr               # EST, recent forks (CI with test: consensus)
npm run test:consensus:all              # EST, all forks (nightly / label)
npm run test:consensus:legacy           # Prague blockchain from ethereum/tests
npm run test:consensus:dev              # bogota-devnet (Hegota dev set)
npm run test:consensus:smoke            # Vitest: cli/forks/skips + sample loader
npm run test:consensus:sample           # runner + checked-in fixtures (--list, no download)
```

**One-time fetch (main EST suite, ~1 GB tarball, selective extract):**

```bash
npm run fixtures:fetch -- tests                    # warm recent fork extracts
npm run fixtures:fetch -- tests --fork Amsterdam   # one fork (matches a CI job)
npm run fixtures:fetch -- bogota-devnet --fork Bogota
```

**Examples:**

```bash
npm run test:consensus -- --fork Osaka --format state --test sstore_combinations
npm run test:consensus -- --source legacy --format blockchain --legacy-fork Cancun
npm run test:consensus -- --rerun-failed /tmp/consensus-report.json --jobs 1 --debug
npm run test:consensus:phase0           # local size/count/timing helpers (see PHASE0.md)
```

**CI failure → local rerun (agents and humans):**

1. A red check names the fork (e.g. `vm-consensus-est-recent (Amsterdam)`). Artifacts: `consensus-est-failures-<Fork>` or `consensus-bogota-failures-<Fork>`.
2. From `packages/vm` (needs `gh` auth + `fixtures:fetch -- tests --fork <Fork>` for that job):

   ```bash
   npm run consensus:fetch-ci-failures
   npm run test:consensus -- --source tests --fork Amsterdam --rerun-failed .ci/consensus-failures.json --jobs 4 --skip-fetch
   ```

   Optional: `--run-id <Build workflow run id>` or `--branch <name>`. `--rerun-failed` ignores `--shard`.

**Flags (summary):** `--source`, `--format`, `--fork` / `--forks recent|all`, `--dir`, `--file`, `--test`, `--jobs`, `--shard i/n` (local only; not used in CI), `--list`, `--bail`, `--skip` / `--run-skipped`, `--report`, `--rerun-failed`, `--fixture-root`, `--skip-fetch`, `--auto-fetch`, `--jsontrace`, `--debug`, `--profile`. Fetch CLI: `--fork`, `--full-extract`, `--tarball-only`.

Shared steps live in [`.github/actions/consensus-fork`](../../.github/actions/consensus-fork/action.yml). Job matrices stay in [`.github/workflows/vm-pr.yml`](../../.github/workflows/vm-pr.yml), [`vm-nightly-test.yml`](../../.github/workflows/vm-nightly-test.yml), and [`vm-consensus-cache-warm.yml`](../../.github/workflows/vm-consensus-cache-warm.yml).

First-round reporting template: [`test/consensus/FIRST_ROUND.md`](./test/consensus/FIRST_ROUND.md).

## Updating fixtures (manifest bump)

We no longer submodule [execution-spec-tests-fixtures](https://github.com/ethereumjs/execution-spec-tests-fixtures). Bumps are a **manifest diff** (`fixtures.json` for `tests` + `legacy`, `fixtures.bogota.json` for `bogota-devnet`) plus a first-round consensus report.

1. Choose the upstream tag on [execution-specs releases](https://github.com/ethereum/execution-specs/releases) (e.g. `tests@v21.0.1`, `tests-bogota-devnet@v1.1.0`).
2. Refresh the manifest entry:

   ```bash
   cd packages/vm
   npm run fixtures:fetch -- --update tests tests@vX.Y.Z
   npm run fixtures:fetch -- --update bogota-devnet tests-bogota-devnet@vX.Y.Z   # when Hegota pin moves
   ```

3. Run `npm run fixtures:fetch -- tests` (warms recent fork extracts), then `npm run test:consensus -- --list --source tests --forks all`.
4. First-round run on affected forks; record pass/fail in `FIRST_ROUND.md`.
5. Commit the manifest file(s) only for a wiring PR; implementation PRs follow the usual spec-delta workflow.

Skill playbook: [`.cursor/skills/update-est-fixtures/SKILL.md`](../../.cursor/skills/update-est-fixtures/SKILL.md).

## Package Tests

```bash
npm run test:API
npm run test:browser
npm run coverage          # Vitest coverage used by the CI vm-api job
```

## Debugging

### Isolate one fixture

```bash
npm run test:consensus -- --fork Osaka --format state --file test_p256verify.json --jobs 1
npm run test:consensus -- --source legacy --format blockchain --test ZeroValue_SELFDESTRUCT --debug
```

`--debug` on legacy blockchain verifies post-state. `--jsontrace` prints opcode traces where supported.

### Compare with geth

```bash
evm --json --nomemory statetest path/to/state_test.json
```

Fixtures live under the EST cache tree or `LEGACY_ETHEREUM_TESTS_CACHE` (legacy blockchain).

## Performance

VM stack cases live in `packages/vm/benchmarks/*.bench.ts`:

```bash
npm run bench
```

The consensus runner defaults to `os.cpus().length` workers; cap with `--jobs`. Phase 0 timing notes: [`test/consensus/PHASE0.md`](./test/consensus/PHASE0.md).

## Specialist Tools

### T8N (transition tool)

See [`test/t8n/README.md`](./test/t8n/README.md). Fill targets [execution-specs](https://github.com/ethereum/execution-specs).

### Filling fixtures with EELS

```bash
uv run fill -v tests/prague/eip2537_bls_12_381_precompiles/test_bls12_g1msm.py \
  --fork Osaka --clean -m state_test
```

Point the consensus runner at the generated tree with `--fixture-root /path/to/fixtures`.

### retesteth

Legacy [retesteth](./test/retesteth/README.md) integration is not part of current CI.
