# Agent notes

Short entrypoint for coding agents in this monorepo. Human documentation lives in the files below; do not duplicate long procedures here.

## Docs

- [README.md](README.md) — monorepo landing page (entry points, package map, quick start)
- [DEVELOPER.md](DEVELOPER.md) — human map: setup, conventions, tooling index, releases policy, rule catalog
- [ARCHITECTURE.md](ARCHITECTURE.md) — how packages fit together
- [packages/vm/DEVELOPER.md](packages/vm/DEVELOPER.md) — VM / execution-spec tests
- [.github/CONTRIBUTING.md](.github/CONTRIBUTING.md)

## Cursor

Always-on rules: [`.cursor/rules/`](.cursor/rules/) — `ci`, `typecheck`, `spellcheck`, `security`, `git`.

Topic rules (load when relevant): [`code-conventions.mdc`](.cursor/rules/code-conventions.mdc), [`api-docs.mdc`](.cursor/rules/api-docs.mdc), [`examples.mdc`](.cursor/rules/examples.mdc), [`api-tests.mdc`](.cursor/rules/api-tests.mdc), [`tx-tests.mdc`](.cursor/rules/tx-tests.mdc), [`releases.mdc`](.cursor/rules/releases.mdc).

Skills: [`.cursor/skills/`](.cursor/skills/) — use `update-est-fixtures` when bumping execution-spec test fixtures.

## Habits

- Conventions: [DEVELOPER.md](DEVELOPER.md) § Conventions + [`code-conventions.mdc`](.cursor/rules/code-conventions.mdc).
- Releases / CHANGELOG: [`.cursor/rules/releases.mdc`](.cursor/rules/releases.mdc) — never publish without explicit human ask.
- Do not commit unless asked.
- Rename or move files with `git mv` ([`git.mdc`](.cursor/rules/git.mdc)).
- After edits: `npm run tsc` in touched packages and spellcheck on changed files ([`typecheck.mdc`](.cursor/rules/typecheck.mdc), [`spellcheck.mdc`](.cursor/rules/spellcheck.mdc)).
- Keep a change set to one kind of work (docs/policy, tests, or product code) unless the user explicitly asks to mix them.
