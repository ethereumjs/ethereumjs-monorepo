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

GeneralStateTests from `ethereum/tests` are retired upstream; ported cases live under EST `tests/ported_static/`. The `packages/ethereum-tests` submodule stays for legacy blockchain tests and for `tx` / `block` / `evm` packages.

### What “green” means

On an ordinary PR, the VM is green when:

- `npm run test:API` (and the coverage job in CI)
- Sharded `npm run test:consensus:pr` (EST `tests@v21.x`, `--forks recent`, state + blockchain)
- `npm run test:consensus:smoke` when the `type: test skip most stable VM` label is present

Amsterdam runs in a separate **non-gating** CI job until the fork is green on the pinned release. Do not add skip entries just to go green (S1).

With the `test all hardforks` label, CI runs `--forks all` on EST plus legacy blockchain on older networks. Nightly runs the full EST tree, legacy blockchain, and `--run-skipped slow`.

### Local development tiers (no tarball every time)

Fixtures are **not** in git. You download each pinned release **once per machine** (or per `EST_FIXTURES_CACHE`), then reuse the cache. The runner does **not** download by default — run `fixtures:fetch` explicitly, or pass `--auto-fetch` on a one-off command.

| Tier | When | Command |
| --- | --- | --- |
| **1 — Fast** | VM / library edits, agents, prepublish | `npm run test:API`, `npm run test:consensus:smoke` |
| **2 — Runner slice** | Consensus runner / selection, no network | `npm run test:consensus:sample` (checked-in tree, `--list`) |
| **3 — Targeted EST** | One fork or file after cache exists | `npm run test:consensus -- --fork Osaka --format state --file foo.json --jobs 1` |
| **4 — Full EST** | Pre-push, fixture bumps, CI parity | `npm run fixtures:fetch -- tests` then `npm run test:consensus:pr` (or `:all`) |

**Cache layout:** `EST_FIXTURES_CACHE` defaults to `~/.cache/ethereumjs/est-fixtures/<source>/<tag>/`. Point several local checkouts at the same directory to avoid duplicate downloads. CI uses a workspace-local cache restored from Actions.

**Local fills:** after EELS `fill`, pass `--fixture-root /path/to/fixtures` (no release tarball).

**Legacy Prague `bc*` only:** `npm run test:consensus:legacy` uses `packages/ethereum-tests` — no EST download.

**Hegota dev (`bogota-devnet`):** still downloads the upstream release tarball once to verify sha256, but **extracts and caches only** `Bogota` and `AmsterdamToBogotaAtTime15k` cases (index-driven). The tarball is removed from cache after extract; integrity is the release digest plus a filtered `.meta/index.json` (per-case `fixture_hash` entries preserved).

## Consensus runner (EST + legacy blockchain)

Standalone harness under [`test/consensus/`](./test/consensus/) — not Vitest. Worker threads, index-driven selection, shared skip list, per-directory report + JSON output.

**Manifest:** [`test/consensus/fixtures.json`](./test/consensus/fixtures.json) pins release URL, sha256, and extract paths. **Cache:** `EST_FIXTURES_CACHE` (default `~/.cache/ethereumjs/est-fixtures/`).

```bash
cd packages/vm
npm run fixtures:fetch                  # idempotent download + extract
npm run test:consensus -- --list        # counts per fork/format
npm run test:consensus:pr               # EST, recent forks (CI gate)
npm run test:consensus:all              # EST, all forks (nightly / label)
npm run test:consensus:legacy           # Prague blockchain from ethereum/tests
npm run test:consensus:dev              # bogota-devnet (Hegota dev set)
npm run test:consensus:smoke            # Vitest: cli/forks/skips + sample loader
npm run test:consensus:sample           # runner + checked-in fixtures (--list, no download)
```

**One-time fetch (main EST suite, ~1 GB tarball, selective extract):**

```bash
npm run fixtures:fetch -- tests          # not bogota-devnet unless you need Hegota dev
```

**Examples:**

```bash
npm run test:consensus -- --fork Osaka --format state --test sstore_combinations
npm run test:consensus -- --source legacy --format blockchain --legacy-fork Cancun
npm run test:consensus -- --rerun-failed /tmp/consensus-report.json --jobs 1 --debug
npm run test:consensus:phase0           # local size/count/timing helpers (see PHASE0.md)
```

**Flags (summary):** `--source`, `--format`, `--fork` / `--forks recent|all`, `--dir`, `--file`, `--test`, `--jobs`, `--shard i/n`, `--list`, `--bail`, `--skip` / `--run-skipped`, `--report`, `--rerun-failed`, `--fixture-root`, `--skip-fetch`, `--auto-fetch`, `--jsontrace`, `--debug`, `--profile`.

CI restores an Actions cache keyed on `fixtures.json`, then runs `fixtures:fetch`. See [`.github/workflows/vm-pr.yml`](../../.github/workflows/vm-pr.yml) and [`vm-consensus-cache-warm.yml`](../../.github/workflows/vm-consensus-cache-warm.yml).

First-round reporting template: [`test/consensus/FIRST_ROUND.md`](./test/consensus/FIRST_ROUND.md).

## Updating fixtures (manifest bump)

We no longer submodule [execution-spec-tests-fixtures](https://github.com/ethereumjs/execution-spec-tests-fixtures). Bumps are a **one-file manifest diff** plus a first-round consensus report.

1. Choose the upstream tag on [execution-specs releases](https://github.com/ethereum/execution-specs/releases) (e.g. `tests@v21.0.1`, `tests-bogota-devnet@v1.1.0`).
2. Refresh the manifest entry:

   ```bash
   cd packages/vm
   npm run fixtures:fetch -- --update tests tests@vX.Y.Z
   ```

3. Run `npm run fixtures:fetch`, then `npm run test:consensus -- --list --source tests --forks all`.
4. First-round run on affected forks; record pass/fail in `FIRST_ROUND.md` (Amsterdam separately until green).
5. Commit `fixtures.json` only for a wiring PR; implementation PRs follow the usual spec-delta workflow.

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

Fixtures live under the EST cache tree or `packages/ethereum-tests`.

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
