---
name: update-est-fixtures
description: Updates EthereumJS execution-spec test fixtures from an ethereum/execution-specs release, points the monorepo submodule, runs VM EST suites, and fixes failures until green. Use when the user asks to update EST, EELS, or execution-spec tests/fixtures, bump a fixture release (tests@vX or tests-glamsterdam-devnet@vX), or get VM spec tests green after a fixture change.
---

# Update EST fixtures

Human procedure (source of truth): `packages/vm/DEVELOPER.md` — section **Updating fixtures**, plus **What “green” means**. Read that file before changing fixtures or runners.

This skill is a first-pass agent wrapper around that playbook. If a round is done differently, update the DEVELOPER.md playbook first, then this file.

## Before starting

- Two git repos: `execution-spec-tests-fixtures` (snapshot) and `ethereumjs-monorepo` (submodule, scripts, VM code).
- Do not commit or push unless the user asks.
- Do not import fixture formats we have no runner for (engine-x, benchmarks, …). We consume `state_tests` and `blockchain_tests`.
- `stable/` vs `dev/` is **EthereumJS support**, not upstream `_stable` / `_develop` or tag names.

## Checklist

Copy and track:

```
- [ ] Read fixtures README + choose release tag
- [ ] Download tarball, inspect layout, copy only consumed trees
- [ ] Place into stable/ and or dev/; apply GitHub size exclusions
- [ ] Rewrite fixtures README (inventory only)
- [ ] Point packages/execution-spec-tests submodule; fix npm scripts if folders moved
- [ ] Run EST suites; fix VM/code/skips until green
- [ ] Confirm legacy Prague unless this round retires it
- [ ] If process diverged, patch DEVELOPER.md playbook (and this skill)
```

## Steps

1. Read [execution-spec-tests-fixtures/README.md](https://github.com/ethereumjs/execution-spec-tests-fixtures/blob/main/README.md) (workspace copy if present) and [execution-specs releases](https://github.com/ethereum/execution-specs/releases). Confirm the exact tag with the user if it is ambiguous (`tests@v…` vs `tests-glamsterdam-devnet@v…`).

2. Download:

   ```bash
   gh release download <tag> --repo ethereum/execution-specs --pattern '*.tar.gz'
   tar -tzf fixtures.tar.gz | head
   ```

3. Copy selected `state_tests` / `blockchain_tests` into the fixtures repo. Skip files ≳100 MB; list them under exclusions in the README. Keep folder names aligned with `packages/vm/package.json` `test:est:*` scripts.

4. Rewrite the fixtures README so tags, dates, folders, and exclusions match the tree. Do not turn it into a testing guide.

5. In the monorepo, point the `execution-spec-tests` submodule at the new fixtures commit. `git submodule update --init packages/execution-spec-tests`. If `dev/` paths changed, update `test:est:dev:*` in `packages/vm/package.json` and CI in `.github/workflows/vm-pr.yml`.

6. From `packages/vm`, run until the green set in DEVELOPER.md passes:

   ```bash
   npm run test:est:stable:state
   npm run test:est:stable:blockchain
   npm run test:est:dev:state
   npm run test:est:dev:blockchain
   ```

   Narrow with `TEST_PATH`, `TEST_FILE`, `TEST_CASE`. Folder triage: `npm run test:analysis:report -- --folder=<path>`. Change `SKIP_NETWORKS` only with a reason.

7. Unless this round explicitly drops them: `npm run test:state` and `npm run test:blockchain` (legacy Prague).

## Green set

Ordinary PR: API tests, EST stable state+blockchain, EST dev state+blockchain (empty `dev/state_tests` skip is OK), legacy Prague state+blockchain. Extended legacy forks are opt-in (`test all hardforks`).

## Do not

- Treat archived `ethereum/execution-spec-tests` as the release source.
- Assume EST runners have `--jsontrace` / `--debug` / `--profile` / `--fork=HF+EIP`.
- Copy large chunks of the legacy wrappers into the EST runners; re-implement if a flag is missing.
