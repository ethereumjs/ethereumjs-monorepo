# `@ethereumjs/ethy`

Execution-free state and intelligence node for Ethereum (Amsterdam `snap/1` + `eth/71` BAL focus) with a zero-log four-zone terminal UI.

## Quick start

From the monorepo (after `npm install` and `npm run build --workspace=@ethereumjs/ethy`):

```bash
npx tsx packages/ethy/src/cli/main.ts sepolia --demo
```

Or use the built CLI:

```bash
npx ethy sepolia --demo
```

Flags:

- `--demo` — synthetic P2P/snap progression (offline)
- `--headless` — no TUI (for programmatic use)

## Docs

- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [PROGRESS.md](./PROGRESS.md)
- [AGENTS.md](./AGENTS.md)
