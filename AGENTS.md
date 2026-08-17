# Agent notes

Short entrypoint for coding agents in this monorepo. Human documentation lives in the files below; do not duplicate it here.

## Docs

- [README.md](README.md) — packages and setup
- [DEVELOPER.md](DEVELOPER.md) — workspaces, conventions, releases, tooling
- [ARCHITECTURE.md](ARCHITECTURE.md) — how packages fit together
- [packages/vm/DEVELOPER.md](packages/vm/DEVELOPER.md) — VM / execution-spec tests
- [.github/CONTRIBUTING.md](.github/CONTRIBUTING.md)

## Cursor

Always-on rules: [`.cursor/rules/`](.cursor/rules/) (spellcheck, security). Tx tests: [`.cursor/rules/tx-tests.mdc`](.cursor/rules/tx-tests.mdc). Skills: [`.cursor/skills/`](.cursor/skills/) — use `update-est-fixtures` when bumping execution-spec test fixtures.

## Habits

- Follow `DEVELOPER.md` conventions (`createX`, options objects, `.ts` ESM imports).
- Do not commit unless asked.
- After edits, run spellcheck on the files you touched.
- Keep a change set to one kind of work (docs/policy, or tests, or product code) unless the user explicitly asks to mix them.
