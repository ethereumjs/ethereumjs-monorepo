# Developer Documentation

The VM package is the gravitational center of the monorepo: running blocks and transactions here exercises `@ethereumjs/evm`, `@ethereumjs/block`, `@ethereumjs/tx`, `@ethereumjs/common`, `@ethereumjs/statemanager`, and related packages together. Consensus tests against official Ethereum fixtures are therefore both VM tests and a practical end-to-end check of those libraries.

This document covers how we run those tests, how we update the fixture snapshot, and how to debug and profile the VM. Library usage belongs in the [package README](./README.md). Monorepo tooling belongs in the [root developer docs](../../DEVELOPER.md).

## Table of Contents

- [Overview](#overview)
  - [Test suites](#test-suites)
  - [What “green” means](#what-green-means)
  - [Submodules](#submodules)
- [Official Ethereum Tests](#official-ethereum-tests)
  - [Landscape](#landscape)
  - [Execution-spec tests (primary)](#execution-spec-tests-primary)
  - [Legacy `ethereum/tests` (secondary)](#legacy-ethereumtests-secondary)
  - [Updating fixtures](#updating-fixtures)
- [Package Tests](#package-tests)
- [Debugging](#debugging)
- [Performance](#performance)
- [Specialist Tools](#specialist-tools)

## Overview

### Test suites

There are two official fixture sources, plus package-level tests:

| Suite | Source | Runners | Typical use |
| --- | --- | --- | --- |
| Execution-spec tests (EST) | Curated snapshot of [execution-specs](https://github.com/ethereum/execution-specs) releases | [`executionSpecState.test.ts`](./test/tester/executionSpecState.test.ts), [`executionSpecBlockchain.test.ts`](./test/tester/executionSpecBlockchain.test.ts) | Default consensus tests (Osaka+, Amsterdam/dev) |
| Legacy Ethereum tests | [ethereum/tests](https://github.com/ethereum/tests) (deprecated) | [`state.spec.ts`](./test/tester/state.spec.ts), [`blockchain.spec.ts`](./test/tester/blockchain.spec.ts) | Prague and older forks still in CI |
| Package tests | `test/api/` | `npm run test:API` | Unit / API tests for VM itself |

EST is the primary consensus suite. The legacy runners still matter for older forks and still expose some flags the EST runners do not. If you find legacy-only functionality that should exist on the EST runners, re-implement it in the new runner files — do not copy large chunks of the old wrappers across.

### What “green” means

On an ordinary PR, the VM is green when all of the following pass:

- `npm run test:API` (and the coverage job in CI)
- `npm run test:est:stable:state` and `npm run test:est:stable:blockchain`
- `npm run test:est:dev:state` and `npm run test:est:dev:blockchain` (dev may be empty or narrowly scoped; see below)
- Legacy Prague state and blockchain tests (`npm run test:state` / `npm run test:blockchain`, default fork)

Extended legacy hardforks (`test:state:allForks`, `test:blockchain:allForks`) run in CI only with the `test all hardforks` label. They are not required for a normal PR.

CI skip labels:

- `skip most stable VM` — skip most stable VM jobs; run a small integrity check instead
- `skip dev VM` — skip EST `dev` jobs
- `test all hardforks` — enable extended legacy fork matrices

### Submodules

From the monorepo root:

```bash
git submodule update --init --recursive
```

- [`packages/execution-spec-tests`](../execution-spec-tests/) — submodule of [ethereumjs/execution-spec-tests-fixtures](https://github.com/ethereumjs/execution-spec-tests-fixtures) (our curated fixture snapshot)
- [`packages/ethereum-tests`](../ethereum-tests/) — submodule of [ethereum/tests](https://github.com/ethereum/tests) (`develop`)

All commands below assume `packages/vm` as the working directory unless noted.

## Official Ethereum Tests

### Landscape

Fixture releases no longer come from `ethereum/execution-spec-tests` (archived). They are published from [ethereum/execution-specs](https://github.com/ethereum/execution-specs):

| Tag pattern | Meaning |
| --- | --- |
| `tests@vX.Y.Z` | Mainnet “must pass” fixtures, up to and including the latest mainnet fork |
| `tests-<feature>@vX.Y.Z` | Feature / devnet releases, e.g. `tests-glamsterdam-devnet@v7.0.0` |

We do not consume those tarballs directly in CI. We copy selected trees into [execution-spec-tests-fixtures](https://github.com/ethereumjs/execution-spec-tests-fixtures), then pin that repo as the `packages/execution-spec-tests` submodule.

That snapshot is split by **EthereumJS support**, not by upstream `_stable` / `_develop` naming:

- `stable/` — expected to pass on current `master`
- `dev/` — upcoming fork / EIP work that is not fully supported yet

What is currently in the snapshot (release tags, folders, GitHub size exclusions) lives in the [fixtures README](../execution-spec-tests/README.md) (same file as the fixtures repo). Keep that file as an inventory; keep this file as the procedure.

### Execution-spec tests (primary)

Runners discover `.json` fixtures under `TEST_PATH` (default `../execution-spec-tests`) and flatten them into Vitest cases. Scripts pin `TEST_PATH` to `stable/` or `dev/` subtrees.

#### Default commands

```bash
npm run test:est:stable:state
npm run test:est:stable:blockchain
npm run test:est:dev:state
npm run test:est:dev:blockchain
```

`test:est:dev:blockchain` currently aliases a specific Amsterdam subtree (`test:est:dev:blockchain:glamsterdam-devnet-v611`). Extra scripts exist for older BAL snapshots (`:v301`, `:v200`). When the `dev/` tree changes, update these scripts so they still point at the folders you intend to run.

`dev/state_tests` may be empty. `test:est:dev:state` then collects no tests and skips; that is expected until we add state fixtures there.

Each EST script also enables [`perDirectoryReporter.ts`](./test/tester/util/perDirectoryReporter.ts), which prints a per-EIP / per-folder pass/fail table after the run.

#### Run a subset

```bash
# Directory (or any subtree)
TEST_PATH=../execution-spec-tests/stable/state_tests/osaka \
  npx vitest run --reporter=default \
  --reporter=./test/tester/util/perDirectoryReporter.ts \
  test/tester/executionSpecState.test.ts

# Single file (with or without .json)
TEST_PATH=../execution-spec-tests/stable/state_tests \
  TEST_FILE=test_p256verify.json \
  npx vitest run test/tester/executionSpecState.test.ts

# Case name substring
TEST_PATH=../execution-spec-tests/dev/blockchain_tests/amsterdam \
  TEST_CASE=eip7928 \
  npx vitest run test/tester/executionSpecBlockchain.test.ts
```

`TEST_FILE` matches the basename. `TEST_CASE` is a substring of the fixture id.

#### CI

PR workflow [`.github/workflows/vm-pr.yml`](../../.github/workflows/vm-pr.yml) always clones submodules for the EST jobs (no submodule cache yet) and runs the four `test:est:*` scripts above.

Blockchain fixtures for some BPO transition networks are skipped in the runner (`SKIP_NETWORKS` in [`executionSpecBlockchain.test.ts`](./test/tester/executionSpecBlockchain.test.ts)).

#### Failure triage

For a folder of blockchain fixtures, file-by-file with fixture metadata:

```bash
npm run test:analysis:report -- --folder=../execution-spec-tests/dev/blockchain_tests/amsterdam
```

Amsterdam blockchain tests also compare Block-Level Access Lists when the fixture includes them ([`balComparatorAI.ts`](./test/tester/util/balComparatorAI.ts)).

#### Gaps vs the legacy runner

Not yet on the EST runners: `--jsontrace`, `--debug`, `--profile`, `--fork=Hardfork+EIP`, skip lists, `--dist`. Isolate with `TEST_PATH` / `TEST_FILE` / `TEST_CASE` instead. `DEBUG=ethjs` still works for VM/EVM logs.

### Legacy `ethereum/tests` (secondary)

Deprecated, still used for Prague (default PR) and for older forks (nightly / `test all hardforks`). Wrappers: [`vitest-wrapper.ts`](./test/tester/vitest-wrapper.ts), [`vitest-wrapper-blockchain.ts`](./test/tester/vitest-wrapper-blockchain.ts). Config and skip lists: [`config.ts`](./test/tester/config.ts).

#### Default commands

```bash
# Prague (wrapper default)
npm run test:state
npm run test:blockchain

# Other forks
npm run test:state -- --fork=Cancun
npm run test:blockchain -- --fork=London

# Fork matrices
npm run test:state:newForks      # Prague
npm run test:state:oldForks      # Chainstart … Cancun
npm run test:state:transitionForks
npm run test:state:allForks
npm run test:state:slow          # include SKIP_SLOW

npm run test:blockchain:allForks
```

Direct Vitest (same env the wrappers set):

```bash
VITE_FORK=Prague npx vitest test/tester/state.spec.ts
VITE_FORK=Prague npx vitest test/tester/blockchain.spec.ts
```

#### Filter

```bash
npm run test:state -- --test='stackOverflow'
npm run test:state -- --file='create2collisionCode2'
npm run test:state -- --dir='stCreate2'
npm run test:state -- --test='CreateCollisionToEmpty' --data=0 --gas=1 --value=0

npm run test:blockchain -- --file='randomStatetest303'
npm run test:blockchain -- --dir='bcBlockGasLimitTest'

# Custom trees (legacy runner)
npm run test:state -- --fork='London' --customTestsPath=../../my_custom_test_folder
npm run test:state -- --customStateTest='{path_to_file}'
```

`--data` / `--gas` / `--value` are indexes into the test `transaction` arrays; see the [legacy state-test attributes](http://ethereum-tests.readthedocs.io/en/latest/test_types/state_tests.html).

#### Skip lists

`BROKEN`, `PERMANENT`, and `SLOW` in [`config.ts`](./test/tester/config.ts). Default: skip all three.

```bash
npm run test:state -- --skip=BROKEN,PERMANENT   # include SLOW
npm run test:state -- --runSkipped=SLOW         # only SLOW
```

`NONE` and `ALL` are also accepted.

#### Compiled output, extra EIPs

Tests run against TypeScript source by default.

```bash
npm run build:dist && npm run test:state -- --dist
npm run build:dist && npm run test:blockchain -- --dist
```

`--fork` can append EIPs (legacy runner only). Most combinations collect zero tests:

```bash
npm run test:state -- --fork='London+3855'
npm run test:blockchain -- --fork='London+3855+3860'
```

### Updating fixtures

This is the procedure for bumping the EST snapshot. It is meant to be followed by a human or by an agent (see `.cursor/skills/update-est-fixtures`). If a round diverges, update this section so the next round stays a short prompt.

Work in **two git repos**: [execution-spec-tests-fixtures](https://github.com/ethereumjs/execution-spec-tests-fixtures) (the snapshot) and this monorepo (submodule pointer, npm scripts, VM code). Do not commit unless asked.

1. **Choose the release.** Read the current [fixtures README](../execution-spec-tests/README.md) and the [execution-specs releases](https://github.com/ethereum/execution-specs/releases). Decide `stable/` vs `dev/` from EthereumJS support, not from upstream tag names. Mainnet tags look like `tests@v20.0.1`; devnet tags look like `tests-glamsterdam-devnet@v7.0.0`.

2. **Download and extract.** From a working directory (not necessarily either repo):

   ```bash
   gh release download tests-glamsterdam-devnet@v7.0.0 \
     --repo ethereum/execution-specs --pattern '*.tar.gz'
   tar -tzf fixtures.tar.gz | head
   ```

   Copy only the `state_tests` / `blockchain_tests` trees we consume. Do not import engine-x, benchmark, or other formats unless we have a runner for them.

3. **Place files and apply exclusions.** GitHub rejects files ≳100 MB. List skipped files in the fixtures README (current examples are the Osaka EIP-7934 RLP-limit blockchain tests). Keep `stable/` vs `dev/` layout consistent with the npm scripts in this package.

4. **Rewrite the fixtures README** so tags, dates, folders, and exclusions match the tree. That file is the inventory; it should not grow into a second testing guide.

5. **Point the submodule** at the new fixtures commit, then from the monorepo root:

   ```bash
   git submodule update --init packages/execution-spec-tests
   ```

   If `dev/` folder names changed, update `test:est:dev:*` scripts in [`package.json`](./package.json) and any CI assumptions in [`vm-pr.yml`](../../.github/workflows/vm-pr.yml).

6. **Run EST suites and fix code** until the “green” set above passes. Useful loop:

   ```bash
   npm run test:est:stable:state
   npm run test:est:stable:blockchain
   npm run test:est:dev:state
   npm run test:est:dev:blockchain
   ```

   Narrow with `TEST_PATH` / `TEST_FILE` / `TEST_CASE`, or `npm run test:analysis:report`. Update `SKIP_NETWORKS` only with a reason.

7. **Confirm legacy Prague** (`npm run test:state`, `npm run test:blockchain`) unless this round explicitly retires that path.

## Package Tests

```bash
npm run test:API
npm run test:browser
npm run coverage          # Vitest coverage used by the CI vm-api job
```

To measure how well a slice of official fixtures hits a given source file (example: EST Osaka state tests vs an EVM precompile):

```bash
DEBUG=ethjs,dummy:* \
  TEST_PATH=../execution-spec-tests/stable/state_tests/osaka \
  npx vitest watch --coverage --coverage.reporter=html --ui \
  --coverage.allowExternal \
  --coverage.include=../evm/src/precompiles/0c-bls12-g1msm.ts \
  test/tester/executionSpecState.test.ts
```

`--coverage.allowExternal` is required to include files outside this package (EVM). `DEBUG=ethjs,dummy:*` avoids debug-disabled branches distorting the numbers. The command stays in watch mode and opens the Vitest UI.

Vitest reporters (`--reporter=json`, `--reporter=verbose`, …) work on any of the suites; see `npx vitest --help`.

## Debugging

### Isolate one fixture

EST (preferred for Osaka+ / Amsterdam):

```bash
TEST_PATH=../execution-spec-tests/stable/state_tests \
  TEST_FILE=test_p256verify.json \
  npx vitest run test/tester/executionSpecState.test.ts
```

Legacy:

```bash
npm run test:state -- --test='stackOverflow'
npm run test:blockchain -- --debug --test='ZeroValue_SELFDESTRUCT_ToOneStorageKey_OOGRevert_d0g0v0_EIP158'
```

`--debug` (legacy blockchain) verifies post-state. `--jsontrace` (legacy state) prints opcode traces. Neither flag exists on the EST runners yet; use `DEBUG=ethjs` for VM/EVM logs.

Many legacy state tests also exist as blockchain tests under `GeneralStateTests` in `ethereum/tests`. The blockchain variant is often easier to debug.

### Compare with geth

Other clients can emit opcode traces. A local `geth` binary is enough (`evm` tool, no need to build from source):

```bash
evm --json --nomemory statetest path/to/state_test.json
```

Point `path/to/state_test.json` at a fixture in `packages/ethereum-tests` or `packages/execution-spec-tests`. To restrict output to one fork, copy the JSON and delete the other `post` entries.

[evmlab](https://github.com/holiman/evmlab) is still a strong toolbox for traces and for constructing examples.

## Performance

### Built-in profiler (legacy runner)

```bash
npm run test:state -- --test='CreateCollisionToEmpty' --data=0 --gas=1 --value=0 --profile
```

`--profile` is not wired up on the EST runners yet.

### Mainnet block benchmarks

Historical numbers for `master`: [ethereumjs.github.io … /dev/bench/vm](http://ethereumjs.github.io/ethereumjs-monorepo/dev/bench/vm).

Build compiled JS first so `tsx` does not dominate the profile:

```bash
npm run build:benchmarks
npm run benchmarks -- mainnetBlocks
npm run benchmarks -- mainnetBlocks:10
```

Flamegraphs with [0x](https://github.com/davidmarkclements/0x):

```bash
npm run profiling -- mainnetBlocks:10
```

Open the link it prints. For flame-graph reading, see e.g. [this overview](https://blog.codecentric.de/en/2017/09/jvm-fire-using-flame-graphs-analyse-performance/) (the non-Java parts).

### Older helpers

These still exist but assume the **legacy** runner (and in one case TAP output). Verify they still do what you want before relying on them.

[Clinic](https://github.com/nearform/node-clinic) flamegraph of legacy blockchain tests:

```bash
NODE_OPTIONS="--max-old-space-size=4096" clinic flame -- \
  VITE_EXCLUDE_DIR='GeneralStateTests' npx vitest test/tester/blockchain.spec.ts
```

[`scripts/diffTester.sh`](./scripts/diffTester.sh) checks out another branch, runs one state-test file N times, then runs the same on the current branch. Run from `packages/vm`, preferably with `master` checked out:

```bash
./scripts/diffTester.sh -b git-branch-you-want-to-test \
  -t "path/to/state/test.json" -r 5
```

It stashes, switches branches, and restores. Treat the averages as a sniff test, not a rigorous benchmark.

## Specialist Tools

### T8N (transition tool)

The VM can act as a t8n binary so [execution-specs](https://github.com/ethereum/execution-specs) (or a local fill) can generate fixtures using EthereumJS as the EVM. See [`test/t8n/README.md`](./test/t8n/README.md). Fill now targets `execution-specs`, not the archived `execution-spec-tests` repo.

### Filling fixtures with EELS

To generate fixtures with the spec’s own Python EVM, follow the [execution-specs](https://github.com/ethereum/execution-specs) setup, then e.g.:

```bash
uv run fill -v tests/prague/eip2537_bls_12_381_precompiles/test_bls12_g1msm.py \
  --fork Osaka --clean -m state_test
```

Fixtures land under `fixtures/state_tests/...`. Point the EST runner at that folder:

```bash
TEST_PATH=/path/to/execution-specs/fixtures/state_tests/prague/eip2537_bls_12_381_precompiles/bls12_g1msm \
  npx vitest run test/tester/executionSpecState.test.ts
```

### retesteth

There is a leftover [retesteth](./test/retesteth/README.md) integration for the legacy `ethereum/tests` flow. It is not part of current CI. Prefer the Vitest runners above.
