# First-round consensus report (EST migration)

Run after `npm run fixtures:fetch -- tests` and a full `--list` pass. Update this file when bumping `fixtures.json` or `fixtures.bogota.json`.

## Manifest

| Source | Tag | Role |
| --- | --- | --- |
| `tests` | `tests@v21.0.1` | PR gate: one CI job per recent fork; nightly one job per EST fork; full index ~354k cases / 24 forks |
| `bogota-devnet` | `tests-bogota-devnet@v1.1.0` | `fixtures.bogota.json`; label `test: bogota`; one job per `Bogota` + `AmsterdamToBogotaAtTime15k` |
| `legacy` | `packages/ethereum-tests` | Frozen `BlockchainTests` only |

Pinned `tests@v21.0.1` tarball: ~1.0 GB compressed; sha256 in `fixtures.json`. Extract includes `state_tests`, `blockchain_tests`, and `.meta/index.json` only.

## How to regenerate counts

```bash
cd packages/vm
npm run test:consensus -- --list --source tests --forks all > /tmp/est-all-list.txt
npm run test:consensus -- --list --source tests --forks recent > /tmp/est-pr-list.txt
npm run test:consensus -- --list --source legacy --legacy-fork Prague --format blockchain
```

## Ported static sanity (state)

Compare per-fork `--list` counts against legacy `expectedTestsFull` in removed `legacy/config.ts` for orders-of-magnitude; EST counts are higher due to EIP-native tests.

## Legacy blockchain

Required for `bc*` suites not ported to EST. Nightly + `test: all hardforks` label.
