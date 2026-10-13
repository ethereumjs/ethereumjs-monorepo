# Archived packages

Source kept for reference. These trees are **not** npm workspaces: nothing here is installed by root `npm ci`, built on `postinstall`, or exercised in CI.

## `@ethereumjs/client` (`client/`)

Frozen snapshot of the deprecated execution client. Do **not** treat `client/package.json.stale` as a live dependency manifest (for audits, dependency updates, or agent inventories).

**Manual restore (unsupported):**

1. `git mv archive/client packages/client`
2. `git mv packages/client/package.json.stale packages/client/package.json`
3. `npm install` at the repo root

There is no CI check that restore still works.

Root `Dockerfile`, `docker/`, and the disabled docker-image CI workflow were removed; use EthPandaOps images or hive `clients/ethereumjs` Dockerfiles for client containers.

## `@ethereumjs/devp2p` (`devp2p/`)

Frozen snapshot of the deprecated devp2p stack. Do **not** treat `devp2p/package.json.stale` as a live dependency manifest (for audits, dependency updates, or agent inventories).

No active library depends on this package. Archiving it drops the ENR string-parser dependency from the workspace install. The Snappy binding stays, because `@ethereumjs/e2store` still depends on it.

**Manual restore (unsupported):**

1. `git mv archive/devp2p packages/devp2p`
2. `git mv packages/devp2p/package.json.stale packages/devp2p/package.json`
3. `npm install` at the repo root

There is no CI check that restore still works.
