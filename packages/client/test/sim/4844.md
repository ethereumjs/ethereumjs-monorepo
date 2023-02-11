# EIP 4844 Testing

Note: All commands should be run from the `client` package directory root (so something like `ethjs/packages/client`)

## Running a local devnet

To run a single EthereumJS client <> Lodestar CL client for testing, run the following command:
`NETWORK=sharding EXTRA_CL_PARAMS="--params.CAPELLA_FORK_EPOCH 0 --params.EIP4844_FORK_EPOCH 0" LODE_IMAGE=g11tech/lodestar:4844-ae177e DATADIR=path/to/your/data/directory test/sim/./single-run.sh`

To run a second EthereumJS <> Lodestar pair, use this command:
`MULTIPEER=syncpeer NETWORK=sharding EXTRA_CL_PARAMS="--params.CAPELLA_FORK_EPOCH 0 --params.EIP4844_FORK_EPOCH 0" LODE_IMAGE=g11tech/lodestar:4844-ae177e DATADIR=path/to/your/data/directory test/sim/./single-run.sh`

To send a single blob transaction to the network, you can use the `txGenerator.ts` script as follows:

`ts-node test/sim/txGenerator 8545 'hello'`. The first argument is the port number of the EthereumJS client you which to submit the transaction to and the second is any data to include in the blob.

This script was adapted from the [interop repo blob script](https://github.com/Inphi/eip4844-interop/blob/master/blob_tx_generator/blob.js)

## EIP-4844 spec tests

To run the 4844 spec tests contained in `test/sim/sharding.spec.ts`, use the following command:

`EXTRA_CL_PARAMS="--params.CAPELLA_FORK_EPOCH 0 --params.EIP4844_FORK_EPOCH 0" LODE_IMAGE=g11tech/lodestar:4844-ae177e DATADIR=/absolute/path/to/your/data/dir npm run tape -- test/sim/sharding.spec.ts`

Note, these tests are adapted from the specification tests contained in the [EIP-4844 Interop repo](https://github.com/Inphi/eip4844-interop)
