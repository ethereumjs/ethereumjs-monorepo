# Interop instructions for running Prysm<>EthJS

## Build Prysm

Following [these instructions](https://hackmd.io/q1SLCaubTIWw_1zsEjW_Vg?view), build Prysm locally.
```sh
$ git clone https://github.com/prysmaticlabs/prysm.git
$ cd prysm
$ git checkout eip4844
$ bazel build //cmd/prysmctl
$ bazel build //cmd/beacon-chain
$ bazel build //cmd/validator
$ cd ../
```

## Start Prysm

Open a terminal window and navigate to the `[path/to/ethjs/client]/test/sim/configs/prysm` folder --
1. Run `start_prysm.sh /[path/to/prysm/directory/root]`
2. Open a second terminal window and run `start_prysm_validator.sh /[path/to/prysm/directory/root]`

## Start EthJS

Open a terminal window and navigate to the `[path/to/ethjs/client]/test/sim/configs/prysm` folder --
Run `start_ethjs.sh`

## Run blob transactions

It takes 25-30 slots to reach the 4844 epoch on the beacon chain (1-2 minutes).

You should see something like below Prysm reaches the 4844 epoch.
```
[2023-01-11 16:00:57]  INFO state: Upgraded to EIP4844 hard fork!
[2023-01-11 16:00:57]  INFO state: Upgraded to EIP4844 hard fork!
```

1. Run `npx ts-node ./test/sim//configs/prysm/txGenerator.ts 8545 'hello'` to submit a blob transaction.  
2. Monitor the EthJS logs to see when the transaction is included in a block via an RPC call to `engine_newPayloadV3` and note the block hash.  
3. Monitor the Prysm Beacon Node logs and note when the EL block payload is included in a beacon block.  You should see logs like below indicating a block with one blob init.  The first few characters of the `blockhash` field in the logs should match the blockhash reported by EthJS
```
[2023-01-11 20:40:59] DEBUG blockchain: Synced new payload blockHash=0xe254fb313f64 blsToExecutionChanges=0 gasUtilized=0.00 parentHash=0x00b9a2268e4b withdrawals=0
[2023-01-11 20:40:59]  INFO blockchain: Finished applying state transition attestations=1 blobCount=1 payloadHash=0xe254fb313f64 slot=91 syncBitsCount=512 txCount=1
```
4. Once the block is stored in the beacon chain, you can verify that the blob transaction was included by navigating to `http://127.0.0.1:3500/eth/v2/beacon/blocks/{block slot number}` to see the beacon block body and validate the kzg commitment matches the one reported by the EthJS logs in the `engine_getBlobsBundleV1` response for the corresponding block.  
