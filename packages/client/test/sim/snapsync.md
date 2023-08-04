### Snapsync sim setup

1. Start external geth client:

```bash
NETWORK=mainnet NETWORKID=1337903 ELCLIENT=geth  DATADIR=/usr/app/ethereumjs/packages/client/data test
/sim/single-run.sh
```

2. (optional) Add some txs/state to geth

```bash
EXTERNAL_RUN=true ADD_EOA_STATE=true  DATADIR=/usr/app/ethereumjs/packages/client/data npx vitest test/sim/snapsync.spec.ts
```

3. Run snap sync:

```bash
EXTERNAL_RUN=true SNAP_SYNC=true  DATADIR=/usr/app/ethereumjs/packages/client/data npx vitest test/sim/snapsync.spec.ts
```

you may add `DEBUG_SNAP=client:*` to see client fetcher snap sync debug logs i.e.

```bash
EXTERNAL_RUN=true SNAP_SYNC=true DEBUG_SNAP=client:* DATADIR=/usr/app/ethereumjs/packages/client/data npx vitest test/sim/snapsync.spec.ts
```

## Combinations

Combine 2 & 3 in single step:

```bash
EXTERNAL_RUN=true ADD_EOA_STATE=true SNAP_SYNC=true  DATADIR=/usr/app/ethereumjs/packages/client/data npx vitest test/sim/snapsync.spec.ts
```

Combine 1, 2, 3 in single step

```bash
NETWORK=mainnet NETWORKID=1337903 ELCLIENT=geth ADD_EOA_STATE=true SNAP_SYNC=true DEBUG_SNAP=client:*  DATADIR=/usr/app/ethereumjs/packages/client/data npx vitest test/sim/snapsync.spec.ts
```

### Fully combined scenarios

1. Test syncing genesis state from geth:

```bash
NETWORK=mainnet NETWORKID=1337903 ELCLIENT=geth SNAP_SYNC=true DEBUG_SNAP=client:*  DATADIR=/usr/app/ethereumjs/packages/client/data npx vitest test/sim/snapsync.spec.ts
```

2. Add some EOA account states to geth (just add `ADD_EOA_STATE=true` flag to the command)

```bash
NETWORK=mainnet NETWORKID=1337903 ELCLIENT=geth ADD_EOA_STATE=true SNAP_SYNC=true DEBUG_SNAP=client:*  DATADIR=/usr/app/ethereumjs/packages/client/data npx vitest test/sim/snapsync.spec.ts
```

3. Add EOA as well as some contract states (just add `ADD_CONTRACT_STATE=true` flag to the command)
   TBD
