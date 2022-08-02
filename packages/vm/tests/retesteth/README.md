This folder contains a script to run with `ts-node` together with `retesteth`. 

Instructions
====

Clone `ethereum/tests`.

Install `retesteth v0.2.2`.

Ensure that in `retesteth/clients/ethereumjs/start.sh` the right path of `transition-tool` is set.

Now run `retesteth`:

`./retesteth -t GeneralStateTests -- --testpath $ETHEREUM_TESTPATH --datadir #RETESTETH_CLIENTS --clients "ethereumjs"`

Here `$ETHEREUM_TESTPATH` should be set to where `ethereum/tests` root folder is installed (so after cloning it). `$RETESTETH_CLIENTS` should be set to `./retesteth/clients` (use the absolute path from root when running retesteth from another folder).
