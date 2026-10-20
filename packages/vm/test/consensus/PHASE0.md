# Phase 0 — EST migration measurements

Recorded during migration planning (see attached plan). Re-run locally after `npm run fixtures:fetch`.

| Metric | Value | Notes |
| --- | --- | --- |
| `tests@v21.0.1` tarball | 999,553,432 bytes (~953 MiB) | sha256 in `fixtures.json` |
| Index `test_count` (v21.0.1) | 354,684 | from tarball header `.meta/index.json` |
| Forks in v21.0.1 | 24 | Frontier → Amsterdam + transitions |
| `tests-bogota-devnet@v1.1.0` tarball | 1,571,141,755 bytes (~1.46 GiB) | full release asset; **fetch extracts Hegota forks only** |
| Bogota index `test_count` (full release) | 464,087 | cached subset: `extractForks` in `fixtures.json` |
| Legacy GST in EST | ~28k+ index paths under `ported_static/` | ethereum/tests GST removed on `develop` |
| Legacy BC not in EST | `BlockchainTests/*` | still via `--source legacy` |

## Local commands

```bash
cd packages/vm
npm run fixtures:fetch -- tests          # main release only
npm run fixtures:fetch -- bogota-devnet  # optional dev corpus
npm run test:consensus -- --list --source tests --forks recent
time npm run test:consensus -- --source tests --fork Osaka --format state --jobs 4
```

## CI cache

Pin cache key to `hashFiles('packages/vm/test/consensus/fixtures.json')`. Warm on `master` via `.github/workflows/vm-consensus-cache-warm.yml`.
