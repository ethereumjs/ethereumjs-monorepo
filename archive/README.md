# Archived packages

Source kept for reference. These trees are **not** npm workspaces: nothing here is installed by root `npm ci`, built on `postinstall`, or exercised in CI.

## `@ethereumjs/client` (`client/`)

Frozen snapshot of the deprecated execution client. Do **not** treat `client/package.json.stale` as a live dependency manifest (for audits, dependency updates, or agent inventories).

**Manual restore (unsupported):**

1. `git mv archive/client packages/client`
2. `git mv packages/client/package.json.stale packages/client/package.json`
3. `npm install` at the repo root

There is no CI check that restore still works.
