# EIP 4844 Testing

## Prerequisites

1. Bash terminal
2. Docker (without sudo)
3. `jq` & `curl` installed
4. `ethereumjs-monorepo` codebase build via `npm i` (for e.g. at `ethjs/`)

You may pre-download docker images for lodestar (`docker pull g11tech/lodestar:36-7b0e9f`) to avoid any test timeout issues.

Note: All commands should be run from the `client` package directory root (so something like `ethjs/packages/client`)

## Running a local devnet

Step 1. To run a single EthereumJS client <> Lodestar CL client for testing, run the following command:
`NETWORK=sharding EXTRA_CL_PARAMS="--params.CAPELLA_FORK_EPOCH 0 --params.DENEB_FORK_EPOCH 0" LODE_IMAGE=g11tech/lodestar:36-7b0e9f DATADIR=path/to/your/data/directory test/sim/./single-run.sh`

Step 2. (Optional) To run a second EthereumJS <> Lodestar pair, use this command:
`MULTIPEER=syncpeer NETWORK=sharding EXTRA_CL_PARAMS="--params.CAPELLA_FORK_EPOCH 0 --params.DENEB_FORK_EPOCH 0" LODE_IMAGE=g11tech/lodestar:36-7b0e9f DATADIR=path/to/your/data/directory test/sim/./single-run.sh`

Step 3. To send a single blob transaction to the network, you may just run spec test:
`EXTERNAL_RUN=true npx vitest test/sim/sharding.spec.ts`

OR, you can use the `txGenerator.ts` script as follows:

`tsx test/sim/txGenerator 8545 'hello'`. The first argument is the port number of the EthereumJS client you which to submit the transaction to and the second is any data to include in the blob.

This script was adapted from the [interop repo blob script](https://github.com/Inphi/eip4844-interop/blob/master/blob_tx_generator/blob.js)

## EIP-4844 spec tests

You don't need to externally start the nodes, the sim tests will do all that for you as well as run the tests against it.

Run Step 1 & 3 together:

`LODE_IMAGE=g11tech/lodestar:36-7b0e9f DATADIR=path/to/your/data/directory npx vitest test/sim/sharding.spec.ts`

### Run Step 1, 2 & 3 together

`WITH_PEER=syncpeer LODE_IMAGE=g11tech/lodestar:36-7b0e9f DATADIR=path/to/your/data/directory npx vitest test/sim/sharding.spec.ts`

Note, these tests are adapted from the specification tests contained in the [EIP-4844 Interop repo](https://github.com/Inphi/eip4844-interop)
