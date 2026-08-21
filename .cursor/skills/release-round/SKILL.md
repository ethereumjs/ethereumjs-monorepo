---
name: release-round
description: Runs a coordinated EthereumJS npm release round in six human-gated phases — intent and readiness, CHANGELOG, version bump, publish (human executes), post-publish verification, and announcements. Use when the user asks to prepare or ship a release, bump all @ethereumjs packages, write release notes, or publish to npm and GitHub.
---

# Release round

Human versioning policy: [DEVELOPER.md](../../../DEVELOPER.md) § Releases. Invariants (do-nots, same version, include/omit): [releases.mdc](../../rules/releases.mdc).

**Out of scope:** major (breaking) rounds, nightlies, fork `--scope` publishes (see `release-npm.ts` header).

## Workflow gates (mandatory)

This is a **multi-phase workflow with hard stops**. After each phase, **stop completely** — do not start the next phase in the same turn, even if the user said “let’s go” at the outset. “Let’s go” means begin the current phase; it does **not** waive later gates.

| Phase | Agent does | Then **STOP** until human |
| --- | --- | --- |
| **1** — Intent and readiness | Assess goal fit, tree, tooling, security | Explicit **GO** for phase 2 |
| **2** — CHANGELOG | Draft all active package notes | Explicit **GO** for phase 3 |
| **3** — Bump and pre-publish | `--bump-version` only, light checks | Human **commits to `master`**, then **GO** for phase 4 |
| **4** — Publish | Give npm + GitHub commands; human runs them | Human confirms success, then **GO** for phase 5 |
| **5** — Post-publish verify | npm + GitHub + smoke checks | Explicit **GO** for phase 6 |
| **6** — Announce | Paste-ready Twitter / Discord kit | Done (human posts) |

**Commits and publish:** by default **the human** commits CHANGELOG + version bump and runs publish scripts. The agent must **not** commit, push, or publish unless explicitly asked. Never force-push.

Phase 4 requires CHANGELOG + bump on **`master`**. Phase 4 publish is **npm first**, then GitHub.

---

## Phase 1 — Intent and readiness

**Human must provide first** (do not assess without this):

- Target version (e.g. `10.1.3`) and bump type: **patch** or **minor**
- Emphasis in a few sentences (e.g. security fixes, bugfix round, try Amsterdam preview)
- Optional: PRs that must land, blockers, “do not wait for X”

**Agent checks** (concise):

1. Last release tag (e.g. `@ethereumjs/vm@10.1.2`) and commits/PRs on `master` since then ([tags](https://github.com/ethereumjs/ethereumjs-monorepo/tags))
2. Open GitHub PRs that look intended for this emphasis
3. Tooling: latest `master` CI green, `npm audit --omit=dev` if relevant, version drift
4. Security glance ([security.mdc](../../rules/security.mdc)): flag S0/S1 changes (tx/util signing, evm/vm) — do not invent a disclosure process
5. Goal fit: can the current tree deliver the stated emphasis?
6. At most **three** “good occasion to also…” suggestions — do not expand scope unless the human picks one

**Output template** — then **STOP**:

```markdown
## Phase 1 summary — Intent and readiness

**Readiness:** green | yellow | red
**Goal fit:** …
**In tree:** …
**Missing:** …
**Tooling:** …
**Security:** …
**Occasion to also:** … (max 3)
**Verdict:** GO for phase 2 | wait for X
```

---

## Phase 2 — CHANGELOG / release notes

Read [changelog.md](./changelog.md) before editing.

```
- [ ] Confirm version and date (default: today unless human said otherwise)
- [ ] List squash commits / PRs since last release tag
- [ ] Update every active package CHANGELOG.md (use ACTIVE_PACKAGES in scripts/release-npm.ts)
- [ ] Scale prose to phase-1 emphasis (quiet patch vs fork preview)
- [ ] npm run spellcheck on touched CHANGELOGs
- [ ] Summarize: packages touched, headline themes, anything omitted (internal PRs)
- [ ] **STOP** — wait for human GO for phase 3
```

Include/omit rules live in [releases.mdc](../../rules/releases.mdc).

---

## Phase 3 — Version bump and pre-publish checks

Bump only — **do not** pass `--publish`:

```sh
tsx scripts/release-npm.ts --bump-version=<version>
```

Then:

```
- [ ] Every active package.json version = <version>
- [ ] Internal @ethereumjs/* refs match (including deps-only packages)
- [ ] npm run tsc --workspaces
- [ ] npm run build --workspaces
- [ ] cd packages/vm && npm run test:API   # vm "npm test" is a stub; use test:API
- [ ] Spellcheck on touched files
```

**Do not** combine bump + publish in one command.

**Output:** list of changed files, check results — then **STOP**. Human reviews and **commits to `master`**, then GO for phase 4.

---

## Phase 4 — Publish (human executes)

Ask first: npm token / OTP ready? `gh auth status` or `GITHUB_TOKEN` ready?

Give these commands; **do not run them** unless the human explicitly asks the agent to:

```sh
tsx scripts/release-npm.ts --publish=latest --otp=<code>
tsx scripts/release-github.ts --version=<version>
```

Notes for the human:

- `prepublishOnly` runs `clean`, `build`, and `npm test` per package — publish can take a while.
- npm **before** GitHub.
- Resume interrupted GitHub releases: `tsx scripts/release-github.ts --version=<version> --start-with=<package>`

**STOP** until the human confirms both npm and GitHub succeeded.

---

## Phase 5 — Post-publish verification

Automate where possible:

```
- [ ] npm view @ethereumjs/<pkg> version for each ACTIVE_PACKAGES entry
- [ ] gh release list / tags for @ethereumjs/<pkg>@<version>
- [ ] Temp-dir smoke: npm install @ethereumjs/vm@<version> and import createVM (or npm pack)
- [ ] Spot-check one GitHub release body vs CHANGELOG extract
```

Report mismatches; do not “fix” the registry. Summarize — then **STOP** until GO for phase 6.

---

## Phase 6 — Announce

Read [announce.md](./announce.md) before drafting.

Analyze phase-1 emphasis + what actually shipped. Ask back if Twitter handle or Discord channel is unclear.

Deliver a **paste-ready kit** (human posts — no Twitter/Discord MCP):

1. Twitter/X — tweet or thread
2. Discord — slightly longer post
3. Optional third channel only if emphasis warrants it

**Visuals (v1):** text first. Optional simple release card via image generation if helpful. Code-snippet images are a follow-up.

---

If this procedure diverges from practice, update [DEVELOPER.md](../../../DEVELOPER.md) § Releases first, then this skill.
