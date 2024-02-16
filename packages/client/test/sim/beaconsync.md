### Beaconsync sim setup

## Prerequisites

1. ZSH terminal
2. Docker (without sudo)
3. `jq` & `curl` installed
4. `ethereumjs-monorepo` codebase build via `npm i` (for e.g. at `/usr/app/ethereumjs`)

You may pre-download docker images for lodestar (`docker pull chainsafe/lodestar:latest`) and geth (`docker pull ethereum/client-go:v1.12.2`) to avoid any test timeout issues.

Note: All commands should be run from the `client` package directory root (so something like `/usr/app/ethereumjs/packages/client`)

## How to run

1. Cleanup some datadirs (if you have had previous runs)

```bash
rm -rf ./datadir
```

2. Run the sim

```bash
BEACON_SYNC=true  NETWORK=mainnet NETWORKID=1337903 ELCLIENT=geth npx vitest run test/sim/beaconsync.spec.ts
```

or just

```bash
rm -rf ./datadir; DEBUG=ethjs,client:* BEACON_SYNC=true  NETWORK=mainnet NETWORKID=1337903 ELCLIENT=geth npx vitest run test/sim/beaconsync.spec.ts
```
