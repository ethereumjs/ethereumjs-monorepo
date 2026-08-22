# CHANGELOG craft (dual audience)

One file, two readers: **humans** (integrators, curious devs) and **agents** (including [scripts/release-github.ts](../../../scripts/release-github.ts), which extracts `## <version> - <date>` sections).

Do **not** add a parallel machine changelog — it will drift.

**Include / omit** (what to list): [releases.mdc](../../rules/releases.mdc). This file is structure and tone.

## What agents need

- Version header: `## 10.1.3 - 2026-08-21` (matches GitHub script regex)
- **Real identifiers** in bullets: `createVM`, `RunBlockOpts.blockAccessList`, `Hardfork.Amsterdam`, `EthereumJSError` codes
- Short code snippets with imports agents can grep
- `### Changes` as a scannable index with PR links

Agents struggle when the delta is buried in metaphor or when a 400-word round essay is duplicated into every package.

## What humans need

- Why this release matters (one idea)
- When to care (hardfork, migration, security)
- How to try it (snippet or link to examples/README)
- Honest caveats for experimental work

Tone: curious and concrete — see `packages/block/CHANGELOG.md` **10.1.2**. Not emoji-banner hype (save that for rare majors).

## Scale to the release emphasis

| Emphasis | Typical shape |
| --- | --- |
| Quiet bugfix / maintenance | Round blurb (2–3 sentences) + At a glance + Changes |
| Several user-facing fixes | Package paragraph + At a glance + Changes; themed section only if one fix needs explanation |
| Fork preview / big feature round | Full structure below; richest prose in **owning** packages (`vm`, `evm`, `block`, …) |

Do not force Amsterdam-essay energy onto a quiet patch.

## Section structure (feature rounds)

Use this hierarchy; skip sections that add no information.

```markdown
## <version> - <YYYY-MM-DD>

### Release round overview

3–5 sentences, **same text in every active package**. Full fork story lives in `@ethereumjs/vm`; other packages link there.

### `@ethereumjs/<pkg>`

One paragraph: what **this package** owns in this round.

### At a glance

- Bullets with identifiers (agent lane). Required even for quiet packages:
  - `Maintenance release, version sync for @ethereumjs/* 10.x.y`

### <Themed section> (optional, human lane)

Only when explanation is needed: new EIP API, finer-grained errors, migration notes.
Short `createX` snippet in the **owning** package only; others link to README or vm notes.

### Changes

- User-facing bullet, see PR [#NNNN](https://github.com/ethereumjs/ethereumjs-monorepo/pull/NNNN)
```

**Bullets:** one bullet per **user-facing change**, not necessarily one per PR. Group related PRs on one line when they ship one feature.

Quiet packages still get a version section; use the maintenance placeholder in At a glance / Changes.

## Good / too much / too dry

**Good (10.1.2 `@ethereumjs/vm`):** round overview states experimental Amsterdam + spec snapshot; package paragraph says what vm owns; At a glance lists EIPs with result types; themed section has one focused snippet; Changes groups PRs by feature.

**Too much:** copying the full Amsterdam walkthrough into `@ethereumjs/rlp` when RLP had no API change; repeating the same 200-word overview in twelve packages without trimming.

**Too dry:** `- Various fixes` with no identifiers; no Release round overview on a fork preview; skipping CHANGELOG for “unchanged” packages.

Source: squash commits since the last [release tag](https://github.com/ethereumjs/ethereumjs-monorepo/tags). Spellcheck touched files. Do not bump `package.json` here — that is phase 3.
