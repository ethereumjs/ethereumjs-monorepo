### Snapsync sim setup

1. Start external geth client:
```bash
NETWORK=mainnet NETWORKID=1337903 ELCLIENT=geth  DATADIR=/usr/app/ethereumjs/packages/client/data test
/sim/single-run.sh
```

2. (optional) Add some txs/state to geth
```bash
EXTERNAL_RUN=true TARGET_PEER=true  DATADIR=/usr/app/ethereumjs/packages/client/data npm run tape -- test/sim/snapsync.spec.ts
```

3. Run snap sync:
```bash
EXTERNAL_RUN=true SNAP_SYNC=true  DATADIR=/usr/app/ethereumjs/packages/client/data npm run tape -- test/sim/snapsync.spec.ts
```
you may add `DEBUG_SNAP=client:*` to see client fetcher snap sync debug logs i.e.
```bash
EXTERNAL_RUN=true SNAP_SYNC=true DEBUG_SNAP=client:* DATADIR=/usr/app/ethereumjs/packages/client/data npm run tape -- test/sim/snapsync.spec.ts
```

## Combinations

Combine 2 & 3 in single step:
```bash
EXTERNAL_RUN=true TARGET_PEER=true SNAP_SYNC=true  DATADIR=/usr/app/ethereumjs/packages/client/data npm run tape -- test/sim/snapsync.spec.ts
```

Combine 1, 2, 3 in single step
```bash
TARGET_PEER=true SNAP_SYNC=true  DATADIR=/usr/app/ethereumjs/packages/client/data npm run tape -- test/sim/snapsync.spec.ts
```