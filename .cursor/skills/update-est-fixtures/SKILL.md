---
name: update-est-fixtures
description: Updates EthereumJS execution-spec test fixtures from an ethereum/execution-specs release, then (after a human merge) points the monorepo submodule, updates VM npm scripts, reports a first test run, and implements ordered “what we need” items in two gated steps each. Use when the user asks to update EST, EELS, or execution-spec tests/fixtures, bump a fixture release, integrate a fixtures-repo change into the monorepo, or implement a “what we need” / Amsterdam spec-delta item from a first-round report.
---

# Update EST fixtures

Source of truth: `packages/vm/DEVELOPER.md` — **Updating fixtures** and **What “green” means**. Read that before changing files.

Two repos, two human gates. Do not commit or push unless asked. **Exceptions** (never force-push):

- Phase A: if GO explicitly asks to commit/push, do that on the fixtures repo.
- Phase B: if GO explicitly asks to commit/push **as a new PR**, do that on the monorepo after the first-round report (see below).

If a round diverges, patch DEVELOPER.md first, then this file.

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
- [ ] Report from the table + /tmp/est-dev-blockchain-summary.json
- [ ] STOP, unless GO asked to commit/push this step as a new PR
```

Do **not** use `test:analysis:report` for first-round (file-by-file, too slow). Do not start implementation in the same turn as this first-round report.

### First-round report (layout)

Do **not** mix “what’s new upstream” and “what we need in EthereumJS” in the same paragraph or bullet list. Two columns / two tables, then the numbers.

**Chat:** a Cursor canvas (not a markdown-table dump). Open it beside the chat. Sections, in order:

1. Headline stats (pass/fail/total, runtime) + one callout for the dominant error cluster.
2. **What's new** (upstream only: release-note deltas, new addresses, EIP list ⬆️). No implementation advice here.
3. **What we need** (EthereumJS only): **numbered, well-scoped blocks** in implementation order. Put high-leverage / easy wins first (unblocks a lot of tests so later items are readable). Each block is one implementation unit. No restating the spec essay.
4. Per-EIP table with both sides: `EIP | What's new | What we need | Pass % | Packages`.
5. Per-directory first-round table (from the reporter / JSON).
6. Inventory gaps (fixture dirs vs `hardforks.ts` / `eips.ts`, address mismatches).

**GitHub PR body:** the same structure as markdown tables (canvas is chat-only). Keep the two-column split. Link the fixtures PR and the upstream release.

Example (abbreviated):

```markdown
## What's new (upstream)
| EIP | Change in this release |
| --- | --- |
| 2780 / 8037 | State-dep costs leave intrinsic; charged at top-frame |

## What we need (EthereumJS)
| EIP | Gap | Packages |
| --- | --- | --- |
| 2780 / 8037 | Split intrinsic vs runtime | vm, evm |

## First-round
| Directory | Passed | Failed | Pass % |
```

### Phase B PR (only if explicitly asked)

After the first-round report, if GO asked to commit/push this step as a PR:

1. Commit the Phase B files (submodule gitlink, `test:est:*` path updates, leftover path greps, playbook/skill if they changed). Do not include implementation of spec deltas.
2. Push the current branch (`-u` if needed) and open a **new** monorepo PR (not a fixtures-repo PR).
3. Title: meaningful, e.g. `Update EST glamsterdam fixtures to tests-glamsterdam-devnet@v7.0.0`.
4. Body: the first-round report in the **two-table layout** (What's new vs What we need, then numbers) plus a link to the **fixtures repo PR** (or merge commit if already on `main`).
5. Labels, if they can be applied: `package: vm`, `PR state: merge ready`, `type: spec updates`, `type: tests` (exact names; note the space in `package: vm`).
6. CI `test:est:dev:blockchain` will fail until implementation. Mention that in the PR. Do **not** add `type: test skip dev VM` unless asked.

Return the PR URL. Then STOP (implementation is Phase C).

## Phase C — implementation (one “what we need” item at a time)

The numbered **What we need** blocks from the first-round report are the implementation backlog. Do not start item N+1 until item N is done, unless asked. Each item is **two steps**, each with a **manual stop** (so a different model can pick up the next step).

Do not commit or push unless asked.

### C1 — strategy (stop for confirmation)

Work out a plan only. Do not edit production code in this step.

- Structural: where to integrate (packages/files), what already exists vs what vN changed.
- Efficient path: order of edits, which EST folders prove the item, what to ignore until later items.
- API: **backwards-compatible / preserving**. May *add* to the public API if it is useful to library users. Do not rename or change existing signatures to get the spec green.
- Local tests: which `test/api/EIPs/eip-NNNN.spec.ts` (or existing suite) to add, matching nearby tests.
- READMEs: which package READMEs to update (see below).
- Done-when: local tests + named EST subsets (not “all 3707 green”).

**Chat:** canvas (same visual bar as first-round). Then STOP. Implementation is C2 after they confirm.

### C2 — implement (after confirmation)

Implement until the item’s done-when holds. Then STOP.

- Keep API stable; additions only if useful.
- Add local EIP tests that fit the existing `packages/<pkg>/test/` layout (`vm/test/api/EIPs/` is the usual home for fork behaviour). These speed up the next EST run and future local work.
- README updates (concise, consistent):
  - Canonical Amsterdam overview: `packages/vm/README.md` → **Amsterdam hardfork (experimental)** (EIP list + which specs this release implements / which EST snapshot).
  - Other touched packages (`evm`, `tx`, `common`, `block`, `util`, …): a short Amsterdam note in the natural hardfork/EIP place, linking that canonical section. If the package has no such note yet, add one there — same heading style (`Amsterdam hardfork (experimental)` or `See the canonical Amsterdam overview…`).
  - State which specs are implemented after this item (do not claim the whole fork is done).

Verify with local tests first, then the EST folders named in C1 (`TEST_PATH=…/eipNNNN` or `TEST_CASE=`). Use `:summary` for a broader check if useful.

### API and docs rules (every C2)

- No breaking changes to existing exports / `RunTxResult` / constructor opts.
- New exports are OK when they help users (e.g. a helper already used internally).
- Do not rewrite unrelated README sections.

## Do not

- Treat archived `ethereum/execution-spec-tests` as the release source.
- Import engine-x / benchmark / sync formats without a runner.
- Re-download a tarball that is already present and valid.
- Skip the Phase A or Phase B human gate, or start C2 in the same turn as C1.
- Assume EST runners have `--jsontrace` / `--debug` / `--profile` / `--fork=HF+EIP`.
- Dump or grep a full vitest default-reporter log when `:summary` + `EST_SUMMARY_JSON` exist.
- Mix “what’s new upstream” and “what we need” in the same bullets; dump first-round numbers as a markdown table in chat (use a canvas).
- Break existing public APIs to match a spec revision (add, don’t redefine).
