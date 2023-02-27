# 4844 Interop Instructions

## Prysm<>EthJS

### Build Prysm

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

### Configure genesis parameters

For local interop testing with prysm, run `generate_genesis.sh [absolute path to prysm directory root]` from the `devnets/4844-interop/prysm` subdirectory to update the genesis parameters with correct timestamps for post merge hardforks so that EthJS <> Prysm can run a local devnet from genesis.

### Running EthereumJS

Start EthereumJS with a miner, jwt-secured Engine APIs, and the interop genesis parameters created in the step above.

```
npm run client:start -- \
  --datadir=devnets/4844-interop/prysm/el_data \
  --gethGenesis=devnets/4844-interop/prysm/genesisGEN.json \
  --rpc --rpcEngine \
  --jwt-secret=devnets/4844-interop/config/jwtsecret.txt \
  --mine \
  --unlock=devnets/4844-interop/config/minerKey.txt \
  --rpcDebug --loglevel=debug
```

### Start Prysm

#### Optional symlinks

Create a symlink to the monorepo interop directory from within the prysm repository root:

```shell
ln -s ../ethereumjs-monorepo/packages/client/devnets/4844-interop .
```

#### Starting prysm

Start Prysm beacon client from the `prysm` root directory:

Note, if the above symlink isn't created, provide absolute paths to your data directory, `genesis.ssz`, and `config.yml` in below commands.

```shell
bazel run //cmd/beacon-chain -- \
    --datadir=4844_interop/prysm/cl_data \
	--min-sync-peers=0 \
    --force-clear-db \
	--interop-genesis-state=4844_interop/prysm/genesis.ssz \
	--interop-eth1data-votes \
	--bootstrap-node= \
	--chain-config-file=4844_interop/prysm/config.yml \
	--chain-id=32382 \
	--accept-terms-of-use \
	--jwt-secret=4844_interop/config/jwtsecret.txt \
	--suggested-fee-recipient=0x123463a4b065722e99115d6c222f267d9cabb524 \
	--verbosity debug
```

Optionally start Prysm validator from the `prysm` directory:

```shell
bazel run //cmd/validator -- \
    --datadir=4844_interop/prysm/cl_data \
	--accept-terms-of-use \
	--interop-num-validators=512 \
	--interop-start-index=0 \
	--chain-config-file=4844_interop/prysm/config.yml
```

## General Helpers

### Run blob transactions

It takes 25-30 slots to reach the 4844 epoch on the beacon chain (1-2 minutes).

You should see something like below Prysm reaches the 4844 epoch.

```
[2023-01-11 16:00:57]  INFO state: Upgraded to EIP4844 hard fork!
[2023-01-11 16:00:57]  INFO state: Upgraded to EIP4844 hard fork!
```

1. Run `npx ts-node ./tools/txGenerator.ts 8545 'hello' [path/to/genesis.json] [private key of tx sender as unprefixed hex string]` to submit a blob transaction.
2. Monitor the EthJS logs to see when the transaction is included in a block via an RPC call to `engine_newPayloadV3` and note the block hash.
3. Monitor the Prysm Beacon Node logs and note when the EL block payload is included in a beacon block. You should see logs like below indicating a block with one blob in it. The first few characters of the `blockhash` field in the logs should match the blockhash reported by EthJS

```
[2023-01-11 20:40:59] DEBUG blockchain: Synced new payload blockHash=0xe254fb313f64 blsToExecutionChanges=0 gasUtilized=0.00 parentHash=0x00b9a2268e4b withdrawals=0
[2023-01-11 20:40:59]  INFO blockchain: Finished applying state transition attestations=1 blobCount=1 payloadHash=0xe254fb313f64 slot=91 syncBitsCount=512 txCount=1
```

4. Once the block is stored in the beacon chain, you can verify that the blob transaction was included by navigating to `http://127.0.0.1:3500/eth/v2/beacon/blocks/{block slot number}` to see the beacon block body and validate the kzg commitment matches the one reported by the EthJS logs in the `engine_getBlobsBundleV1` response for the corresponding block.
