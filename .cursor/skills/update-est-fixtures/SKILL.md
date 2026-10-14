---
name: update-est-fixtures
description: Updates EthereumJS VM consensus fixtures by bumping the pinned execution-specs release in packages/vm/test/consensus/fixtures.json, fetching into the local/CI cache, running a first-round consensus report, then implementing ordered “what we need” items in gated steps. Use when the user asks to update EST, EELS, execution-spec tests/fixtures, bump tests@v… or bogota-devnet, or implement spec-delta items from a first-round report.
---

# Update EST fixtures (manifest + consensus runner)

Source of truth: `packages/vm/DEVELOPER.md` — **Updating fixtures (manifest bump)** and **What “green” means**. Read that before changing files.

Fixtures are **not** a git submodule anymore. The manifest [`packages/vm/test/consensus/fixtures.json`](../../packages/vm/test/consensus/fixtures.json) pins URL + sha256; [`npm run fixtures:fetch`](../../packages/vm/package.json) downloads and extracts into `EST_FIXTURES_CACHE` (default `~/.cache/ethereumjs/est-fixtures/`). The consensus runner does **not** download on its own — run `fixtures:fetch` first (or `--auto-fetch` once). **`bogota-devnet`** uses `extractForks` (Hegota only): full tarball is verified then discarded; cache stores a filtered tree + index. Agents: see [packages/vm/DEVELOPER.md](../../packages/vm/DEVELOPER.md) § Local development tiers.

## Workflow gates (mandatory)

Multi-phase workflow with hard stops. After each phase, **stop** until the human gives the next **go**.

| Phase | Agent does | Then **STOP** until human |
| --- | --- | --- |
| **A** — manifest bump | `--update` manifest, fetch, `--list`, first-round runs, update `FIRST_ROUND.md` | Review manifest diff + report; **go** for commit/PR |
| **B** — monorepo wiring PR | Commit `fixtures.json` (+ report doc if useful); open PR if asked | Merge + **go** for implementation |
| **C** — implementation | One “what we need” item: C1 plan → stop → C2 implement → stop | Explicit **go** before each C1/C2 step |

**Commits and pushes:** human by default unless explicitly asked. Never force-push.

## Phase A — manifest bump

```
- [ ] Pick upstream tag on execution-specs releases (e.g. tests@v21.x, tests-bogota-devnet@v…)
- [ ] cd packages/vm && npm run fixtures:fetch -- --update <source> <tag>
- [ ] npm run fixtures:fetch
- [ ] npm run test:consensus -- --list --source tests --forks all (and bogota-devnet if relevant)
- [ ] First-round: npm run test:consensus:pr / targeted --fork … ; record in test/consensus/FIRST_ROUND.md
- [ ] Amsterdam: separate table until green — no skip entries to force green (S1)
- [ ] **STOP**
```

Do **not** use `test:analysis:report` for first-round (too slow). Do not start Phase C in the same turn as the report.

### First-round report (layout)

Same two-table discipline as before: **What's new** (upstream) vs **What we need** (EthereumJS), per-directory table from consensus `--report` JSON, Amsterdam called out separately.

Template: [`packages/vm/test/consensus/FIRST_ROUND.md`](../../packages/vm/test/consensus/FIRST_ROUND.md).

## Phase B — wiring PR (after explicit go)

```
- [ ] Commit fixtures.json (one-file diff is the goal)
- [ ] Grep monorepo for old paths (execution-spec-tests, test:est:*, glamsterdam folder names)
- [ ] CI: cache key follows fixtures.json; vm-consensus jobs fetch on cache miss
- [ ] Open monorepo PR if asked — title names upstream tag; labels package: vm, type: spec updates, type: tests
- [ ] **STOP**
```

Consensus CI may fail until implementation lands; say so in the PR.

## Phase C — implementation

Unchanged habit: one numbered “what we need” block at a time, C1 plan → stop → C2 code → stop. Re-run targeted `npm run test:consensus -- --fork …` after each item.

Legacy `ethereum/tests` blockchain tests: `npm run test:consensus -- --source legacy --format blockchain --legacy-fork …` when a bump touches ported static or runner behaviour.

## Do not

- Reintroduce the `execution-spec-tests-fixtures` submodule.
- Treat archived `ethereum/execution-spec-tests` as the release source (use execution-specs release assets).
- Skip or weaken vectors to go green.
