This folder contains a script to run with `tsx` together with `retesteth`.

# Instructions

Clone `ethereum/tests` (either in the `ethereumjs-monorepo` or elsewhere).

Configure and run `transition-tool`:

Note: All paths are relative paths to the `VM` package root.

1. If you change the port number in `transition-cluster.ts` to anything other than 3000 (or run `transition-cluster` on a separate machine or different IP address from retesteth), update `test/vm/retesteth/clients/ethereumjs/start.sh` to reflect the right IP and port.

2. From VM package root directory, run `tsx test/retesteth/transition-cluster.cts`. (Note: if not ran from root, spawning child processes will error out!)

Configure and run `retesteth`:

1. Follow the build instructions to build and install [`retesteth`](https://github.com/ethereum/retesteth)

2. Run `retesteth` from `[retesteth repository root]/retesteth` using the below command

`./retesteth -t GeneralStateTests -- --testpath $ETHEREUM_TESTPATH --datadir $RETESTETH_CLIENTS --clients "ethereumjs"`

Here `$ETHEREUM_TESTPATH` should be set to where `ethereum/tests` root folder is installed (so after cloning it). `$RETESTETH_CLIENTS` should be set to `[ethereumjs-monorepo root]/packages/vm/test/retesteth/clients` (use the absolute path from root when running retesteth from another folder).

Note: if an error regarding "default client not found" pops up, copy the `test/retesteth/clients/ethereumjs` folder into `test/retesteth/clients/default`. If retesteth complains about Paris missing, then move genesis/Merge.json to genesis/Paris.json
