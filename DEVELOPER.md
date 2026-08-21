# EthereumJS — Developer Docs

How we work in this monorepo: setup, conventions, tooling, releases, and where the canonical procedures live.

For coding agents, start at [AGENTS.md](./AGENTS.md) — it indexes the Cursor rules below. This file is the **human map**; rules hold operational finish steps agents should follow.

If you change how CI, releases, docs, or conventions work, update the **canonical file** in the same PR. Do not invent a parallel procedure.

## Contents

- [Sources of truth](#sources-of-truth)
- [Get running](#get-running)
- [Conventions](#conventions)
- [Tooling](#tooling)
- [Releases](#releases)
- [Occasional tasks](#occasional-tasks)
- [Agent and Cursor rules](#agent-and-cursor-rules)
- [Further reading](#further-reading)

## Sources of truth

| Topic | Canonical location |
| ----- | ------------------ |
| Monorepo landing / package map | [README.md](./README.md) |
| Package graph, execution flow | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| Public API JSDoc | [`.cursor/rules/api-docs.mdc`](.cursor/rules/api-docs.mdc) |
| Examples and embedme | [`.cursor/rules/examples.mdc`](.cursor/rules/examples.mdc) |
| Code naming, `createX`, options | [`.cursor/rules/code-conventions.mdc`](.cursor/rules/code-conventions.mdc) + § [Conventions](#conventions) below |
| CI job budget, affected selection | [`.cursor/rules/ci.mdc`](.cursor/rules/ci.mdc), [`scripts/ci-affected.mjs`](./scripts/ci-affected.mjs) |
| Typecheck / spellcheck finish steps | [`.cursor/rules/typecheck.mdc`](.cursor/rules/typecheck.mdc), [`.cursor/rules/spellcheck.mdc`](.cursor/rules/spellcheck.mdc) |
| Security trust tiers | [`.cursor/rules/security.mdc`](.cursor/rules/security.mdc) |
| API tests (Vitest) | [`.cursor/rules/api-tests.mdc`](.cursor/rules/api-tests.mdc) |
| Tx tests | [`.cursor/rules/tx-tests.mdc`](.cursor/rules/tx-tests.mdc) |
| npm releases and CHANGELOG | [`.cursor/rules/releases.mdc`](.cursor/rules/releases.mdc) |
| VM consensus fixtures, profiling | [packages/vm/DEVELOPER.md](./packages/vm/DEVELOPER.md) |
| Hive tests (deprecated client) | [packages/client/DEVELOPER.md](./packages/client/DEVELOPER.md) |
| EST fixture bumps | [`.cursor/skills/update-est-fixtures/SKILL.md`](.cursor/skills/update-est-fixtures/SKILL.md) |

## Get running

### Monorepo layout

The project uses [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces) to link packages.

- **`/packages`** — library packages (`@ethereumjs/*`)
- **`/config`** — shared TypeScript, ESLint, cspell, TypeDoc, and CLI helper scripts ([`config/cli/`](./config/cli/))
- **`packages/ethereum-tests`** — git submodule (legacy Ethereum test vectors)
- **`packages/execution-spec-tests`** — git submodule (curated execution-spec test fixtures; see VM developer docs)

Package `package.json` scripts call helpers under `config/cli/` (e.g. `ts-compile.sh`, `ts-build.sh`, `coverage.sh`, `typedoc.sh`). See that directory for the full set — do not assume a closed list from older docs.

### Clone and install

```sh
git clone https://github.com/ethereumjs/ethereumjs-monorepo.git
cd ethereumjs-monorepo
git submodule update --init
npm install
```

### Everyday commands

From the repo root:

| Command | Purpose |
| ------- | ------- |
| `npm run lint` / `npm run lint:fix` | ESLint v9 + Biome |
| `npm run tsc --workspaces` | Typecheck all packages (same gate as CI) |
| `npm run spellcheck` | cspell on TS + markdown |
| `npm run build --workspaces` | Production build all packages |
| `npm run docs:build --workspaces` | TypeDoc markdown to `packages/*/docs/` |
| `npm run clean` | Remove build artifacts and `node_modules` |

On a single package (example: VM):

```sh
cd packages/vm
npm run test
npm run tsc
npx vitest test/path/to/test.spec.ts
npm run build --workspace=@ethereumjs/vm   # from repo root
```

### Windows note

If script paths fail on Windows, point npm at Git Bash:

```sh
npm config set script-shell "C:\\Program Files (x86)\\git\\bin\\bash.exe"
```

Reset with `npm config delete script-shell`.

## Conventions

This section describes recurring patterns **as they exist today** — descriptive, not aspirational. Agent-enforceable naming is also in [`code-conventions.mdc`](.cursor/rules/code-conventions.mdc).

### Constructor functions (`createX`)

Most objects are created via free-standing **`createX…`** factories (often in `constructors.ts`), not public `new Class(…)` calls. Factories may do async setup or input normalization the bare constructor does not.

Examples: `createBlock`, `createBlockFromRLP` (`packages/block`); `createTx`, `createTxFromRLP` (`packages/tx`); `createEVM`, `createVM`; `createCommonFromGethGenesis`, `createCustomCommon`.

Sub-pattern: **`createXFromY`** for alternate inputs (`FromRLP`, `FromRPC`, `FromBytesArray`, …).

### Per-package file layout

Active packages converge on:

- **`types.ts`** — public interfaces, option types, event maps (larger packages may nest types, e.g. `packages/tx/src/legacy/`)
- **`constructors.ts`** — `createX` factories (exceptions: `packages/tx` uses `transactionFactory.ts`; `packages/block` uses `block/constructors.ts` and `header/constructors.ts`)
- **`params.ts`** — EIP-indexed parameter dictionary merged into `Common` at construction (see below)

### Options objects

Constructors and `createX` take an options object (`EVMOpts`, `VMOpts`, `CommonOpts`, `BlockOptions`, …), not long positional lists. Document non-obvious fields on the interface in `types.ts`.

### Events (`eventemitter3`)

Emitting packages expose `events: EventEmitter<XEvent>` on the class; the matching event map lives in `types.ts`. On option interfaces, `events` is often optional (`events?`). Handlers may receive an optional `resolve` callback for async listeners.

Packages: `EVM`, `VM`, `Blockchain`, `Common`.

### Errors

Error handling is **not fully uniform** (known, being addressed):

- Base: `EthereumJSError` in `packages/rlp/src/errors.ts`, re-exported via `packages/util/src/errors.ts`
- `EthereumJSErrorWithoutCode(message)` is deprecated — prefer `EthereumJSError` with a real `code`
- `EVMError` (`packages/evm/src/errors.ts`) is **not** a subclass of `Error` or `EthereumJSError` — intentional divergence

For new errors, prefer `EthereumJSError` with a structured `code`.

### EIP and parameter config

Two mechanisms:

1. **Hardfork / EIP activation** — `@ethereumjs/common`: chains, hardforks, EIPs (`common.isActivatedEIP`, `common.gteHardfork`, …)
2. **Numeric parameter values** (gas costs, limits) — each package’s `params.ts` exports an EIP-indexed `ParamsDict` (`paramsEVM`, `paramsVM`, `paramsTx`, `paramsBlock`, …). At construction, packages merge via `common.updateParams(opts.params ?? paramsX)`. Values are read with `common.param('name')`.

**What is active** lives in `common`; **what each value is** lives next to the code that uses it.

### Naming

- **`createX…`** — factories
- **`xToY`** — pure converters (`bytesToBigInt`, `hexToBytes`, …)
- **`isX`** — predicates (`isLegacyTx`, `isHexString`, …)

Acronym casing: see [`code-conventions.mdc`](.cursor/rules/code-conventions.mdc).

### ESM imports

Relative imports inside `src/` use explicit **`.ts`** extensions. Root `tsconfig.json` enables `allowImportingTsExtensions` and rewrites to `.js` in output.

## Tooling

One command and one config pointer per tool. Finish-step detail for agents is in the linked rules — not duplicated here.

### TypeScript

Shared base: [`config/tsconfig.json`](./config/tsconfig.json), [`config/tsconfig.prod.json`](./config/tsconfig.prod.json). Each package has `tsconfig.json` (dev + tests) and `tsconfig.prod.json` (build).

- **`npm run tsc`** in a package — typecheck via `config/cli/ts-compile.sh`
- **`npm run build`** — production emit via `config/cli/ts-build.sh`

After TS edits: [`typecheck.mdc`](.cursor/rules/typecheck.mdc). `npm test` does **not** run `tsc`.

### Linting

ESLint v9 + Biome. Root config plus per-package `eslint.config.mjs`.

```sh
npm run lint
npm run lint:fix
```

### Spellcheck

[cspell](https://github.com/streetsidesoftware/cspell): [`config/cspell-ts.json`](./config/cspell-ts.json), [`config/cspell-md.json`](./config/cspell-md.json).

```sh
npm run spellcheck          # root
npm run spellcheck:ts       # package-level pattern
npm run spellcheck:md
```

Prefer **rewording** over adding dictionary entries. See [`spellcheck.mdc`](.cursor/rules/spellcheck.mdc).

### Testing

[Vitest](https://vitest.dev/) with v8 / istanbul coverage.

PR CI (**`Build`**, required check **`Build / CI`**) runs tests for affected packages via [`scripts/ci-affected.mjs`](./scripts/ci-affected.mjs). Per-package jobs may be **skipped**; skipped counts as success. Lint, typecheck, and runtime `npm audit` always run. Pushes to `master`, workflow dispatch, or changes under `.github/`, `config/`, or the lockfile run the full matrix.

Informational jobs (`bundle-size`, in-flux `vm-est-dev`) are not part of the gate.

```sh
npm run test                # package or root
npx vitest test/foo.spec.ts # single file, watch
```

API test conventions: [`api-tests.mdc`](.cursor/rules/api-tests.mdc). Tx-specific: [`tx-tests.mdc`](.cursor/rules/tx-tests.mdc). VM consensus runners: [packages/vm/DEVELOPER.md](./packages/vm/DEVELOPER.md).

#### Browser tests

Optional locally unless you work on bundling or browser behavior. Install Chromium once:

```sh
npm run install-browser-deps
```

Then `npm run test:browser` in a package or from the root. CI uses the Playwright Docker image (`mcr.microsoft.com/playwright:v1.60.0-noble` in [`.github/workflows/browser.yml`](./.github/workflows/browser.yml)) — keep that tag in sync with the `playwright` version in `package-lock.json`.

### Documentation

Public API reference: [TypeDoc](https://typedoc.org/) → `packages/*/docs/`. JSDoc conventions: [`api-docs.mdc`](.cursor/rules/api-docs.mdc).

TypeDoc 0.28 needs the TypeScript 6 compiler API; monorepo `tsc` uses TypeScript 7. Package `docs:build` scripts call [`config/cli/typedoc.sh`](./config/cli/typedoc.sh) (loads TS 6 via [`config/typedoc/register.mjs`](./config/typedoc/register.mjs)). Do not run bare `typedoc`.

Cross-package `{@link}` uses package-qualified names with URLs in [`config/typedoc-external-links.mjs`](./config/typedoc-external-links.mjs).

### Examples

Runnable examples in `packages/*/examples/`. README snippets sync via [embedme](https://github.com/zackarychapple/embedme) (`npm run examples:build` in a package). CI runs `npm run examples --if-present --workspaces`. See [`examples.mdc`](.cursor/rules/examples.mdc).

### CI (maintainers)

When changing workflows or affected-package selection, read [`ci.mdc`](.cursor/rules/ci.mdc). Document user-visible CI behavior here or in workflow comments — not only in YAML.

## Releases

Active packages (see [README § Package map](./README.md#package-map)) are released **in sync** with the **same version number**. Matching versions are CI-tested together.

| Release type | When |
| ------------ | ---- |
| Bugfix | Most rounds; may ship non-finalized EIP behavior |
| Minor | Hardfork finalization or selected features |
| Major | Rare; structural API breaks |

### Branches

| Branch | Series | Status |
| ------ | ------ | ------ |
| [`master`](https://github.com/ethereumjs/ethereumjs-monorepo) | v10 | Active |
| [`maintenance-v8`](https://github.com/ethereumjs/ethereumjs-monorepo/tree/maintenance-v8) | v7 / v8 | Maintenance |
| [`maintenance-v6`](https://github.com/ethereumjs/ethereumjs-monorepo/tree/maintenance-v6) | v6 | Maintenance |

Open PRs against the current working branch unless backporting. Inspect past releases via [tags](https://github.com/ethereumjs/ethereumjs-monorepo/tags).

### Procedure

Operational steps (version bump script, npm auth, CHANGELOG rules, fork `--scope` publishes) live in [`.cursor/rules/releases.mdc`](.cursor/rules/releases.mdc). Implementation: [`scripts/release-npm.ts`](./scripts/release-npm.ts).

Do not publish or bump versions without an explicit maintainer request.

## Occasional tasks

### Link a package into an external project

```sh
cd packages/package-name && npm run build && npm link
cd path/to/your/project && npm link @ethereumjs/package-name
# rebuild package after changes; unlink when done
```

### Shared dev dependencies

Common toolchain packages (`eslint`, `biome`, `typescript`, …) live in the root `package.json`.

### Security

Protocol libraries — wrong hashes or EVM results are consensus bugs. Trust tiers and constraints: [`.cursor/rules/security.mdc`](.cursor/rules/security.mdc). Extra care on `tx`, `util` signing, and `evm` / `vm` spec tests.

## Agent and Cursor rules

Rules live in [`.cursor/rules/`](.cursor/rules/). They are plain markdown with YAML front matter — usable from Cursor and other agent setups that load project instructions.

| Rule | When it applies | Caveat |
| ---- | --------------- | ------ |
| `ci`, `typecheck`, `spellcheck`, `git`, `security` | Always | Finish steps; do not weaken tests or skip hooks to go green |
| `code-conventions` | `src/`, `examples/` | No public API renames without explicit human ask |
| `api-docs` | `src/` | Cross-package links need `@ethereumjs/pkg!Symbol` |
| `examples` | `examples/`, package READMEs | Not public API; run embedme after README edits |
| `api-tests` | active package `test/` | VM consensus runners out of scope |
| `tx-tests` | `packages/tx` | 4844 matrix uses stub KZG |
| `releases` | CHANGELOG / release / `release-npm.ts` | Never publish without human approval |

**Skills:** [`update-est-fixtures`](.cursor/skills/update-est-fixtures/SKILL.md) — execution-spec fixture bumps only.

Package-specific deep docs stay in package `DEVELOPER.md` files (VM, deprecated client) — not duplicated as Cursor rules unless a pattern repeats across the monorepo.

[AGENTS.md](./AGENTS.md) is the agent entrypoint; it should not grow into a second copy of this file.

## Further reading

- [ARCHITECTURE.md](./ARCHITECTURE.md) — responsibilities, dependency graph, block execution flow
- [packages/vm/DEVELOPER.md](./packages/vm/DEVELOPER.md) — EST / legacy tests, debugging, profiling
- [packages/client/DEVELOPER.md](./packages/client/DEVELOPER.md) — Hive (deprecated `@ethereumjs/client`)
- [CONTRIBUTING.md](./.github/CONTRIBUTING.md) — how to contribute
- [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)
