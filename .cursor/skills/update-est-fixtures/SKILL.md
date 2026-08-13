---
name: update-est-fixtures
description: Updates EthereumJS execution-spec test fixtures from an ethereum/execution-specs release, then (after a human merge) points the monorepo submodule, updates VM npm scripts, and reports a first test run. Use when the user asks to update EST, EELS, or execution-spec tests/fixtures, bump a fixture release (tests@vX or tests-glamsterdam-devnet@vX), or integrate a fixtures-repo change into the monorepo.
---

# Update EST fixtures

Source of truth: `packages/vm/DEVELOPER.md` — **Updating fixtures** and **What “green” means**. Read that before changing files.

Two repos, two human gates. Do not commit or push unless asked. **Exception:** if GO explicitly asks to commit/push Phase A, do that on the fixtures repo (no force-push). If a round diverges, patch DEVELOPER.md first, then this file.

## Replace vs add

- **Glamsterdam mixed tree:** default **replace** in place at `dev/blockchain_tests/amsterdam/glamsterdam/`. Upstream path: `blockchain_tests/for_amsterdam/amsterdam/`. Do not keep an old versioned folder beside it.
- **BAL-only snapshots** (`v200_…`, `v301_…`): keep unless this round says drop them.
- If unclear, **ask** before deleting or adding a tree.

## Download once

Tarballs are large (~648 MB for `tests-glamsterdam-devnet@v7.0.0`). Download is preferred when practical, but only once:

- Work in `execution-spec-tests-fixtures`. `.gitignore` `fixtures*` covers `fixtures_*.tar.gz` and `fixtures/`.
- If the tarball is already on disk, reuse it (check size / sha256 from the GitHub asset). Do not re-download.
- Extract to gitignored `fixtures/`. Copy only `state_tests` / `blockchain_tests` into `stable/` or `dev/`.

## Phase A — fixtures repo

Stop when the tree + README are ready. Commit/push only if GO asked for that. Otherwise the human commits, pushes, and merges.

```
- [ ] Confirm tag + stable vs dev + replace vs add
- [ ] Download tarball once (or reuse); extract
- [ ] Copy consumed trees; apply ≳100 MB exclusions
- [ ] Replace previous glamsterdam folder when that is the policy
- [ ] Rewrite fixtures README (tags, folders, exclusions, JSON counts)
- [ ] Summarize: old vs new counts, what moved; STOP
```

Summary must include old JSON count, new JSON count, folder names, exclusions, and a pointer to the upstream release.

## Phase B — monorepo (only after green light)

Fixtures commit must be reachable. Prefer `origin/main` after merge; a local SHA from the sibling fixtures checkout is fine for a first-round run (avoids GitHub SSH / macOS Touch ID).

If `origin` fetch is required and remote is `git@ssh.github.com`, tell the user they may need to confirm Touch ID **before** running fetch. Prefer the local fetch when both workspaces are open:

```bash
git -C packages/execution-spec-tests fetch origin
git -C packages/execution-spec-tests checkout origin/main   # or the merge SHA
# or, from the sibling fixtures repo:
git -C packages/execution-spec-tests fetch <path-to-execution-spec-tests-fixtures> <sha>
git -C packages/execution-spec-tests checkout <sha>
```

```
- [ ] Point packages/execution-spec-tests at the new SHA (do not commit unless asked)
- [ ] Update test:est:* in packages/vm/package.json if paths changed; CI if needed
- [ ] Grep the old folder name across the monorepo (package.json, consumeBal.test.ts, generateLargeFixture.ts, DEVELOPER.md, this skill)
- [ ] Inventory (no tests): fixture eipNNNN dirs vs packages/common/src/hardforks.ts (HF eips list) vs packages/common/src/eips.ts
- [ ] Read upstream release notes; check packages/vm/src/params.ts (and Common EIP params) for address / constant drift
- [ ] First-round: npm run test:est:dev:blockchain:summary (from packages/vm). Also test:est:dev:state if state fixtures were added
- [ ] Report from the table + /tmp/est-dev-blockchain-summary.json; STOP
```

Do **not** use `test:analysis:report` for first-round (file-by-file, too slow). Do not start implementation in the same turn as this first-round report.

### First-round report (required sections)

1. Totals + per-directory table (from the reporter).
2. Top error clusters (reporter / JSON). Name the likely spec delta when a cluster matches release notes (e.g. `INTRINSIC_GAS_TOO_LOW` → EIP-2780/8037 gas split).
3. Fixture `eipNNNN` folders **not** in the hardfork `eips` list or missing from `eips.ts` (those cannot pass until Common wires them).
4. System-contract / param mismatches vs release notes (e.g. EIP-8282 addresses in `params.ts`).
5. Short upstream release-note digest + likely packages (`vm`, `evm`, `common`, `util`, …).

## Do not

- Treat archived `ethereum/execution-spec-tests` as the release source.
- Import engine-x / benchmark / sync formats without a runner.
- Re-download a tarball that is already present and valid.
- Skip the Phase A or Phase B human gate.
- Assume EST runners have `--jsontrace` / `--debug` / `--profile` / `--fork=HF+EIP`.
- Dump or grep a full vitest default-reporter log when `:summary` + `EST_SUMMARY_JSON` exist.
