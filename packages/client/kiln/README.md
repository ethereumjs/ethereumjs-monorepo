# kiln v2 instructions

kiln v2 spec devnet5 has been bootstrapped. The configs can be download from https://github.com/eth-clients/merge-testnets/tree/main/merge-devnet-5

## Execution - EthereumJS Setup

Please ensure you have Node 12.x+ installed

1. `git clone --depth 1 --branch merge-kiln-v2 https://github.com/ethereumjs/ethereumjs-monorepo.git`
1. `cd ethereumjs-monorepo`
1. `npm i`
1. `cd packages/client`

### Download the config

1. `mkdir kiln/devnet5 && cd kiln/devnet5`
2. `git init && git remote add -f origin https://github.com/eth-clients/merge-testnets.git && git config core.sparseCheckout true && echo "merge-devnet-5/*" >> .git/info/sparse-checkout && git pull --depth=1 origin main`

This will download the config files in `kiln/devnet5/merge-devnet-5` which we will refer as `/path/to/downloaded/config/dir` in the following instructions.
### Run client

1. `npm run client:start -- --datadir kiln/datadir --gethGenesis kiln/devnet5/merge-devnet-5/genesis.json --saveReceipts --rpc --ws --rpcEngine --rpcEnginePort=8545 --bootnodes=`

Starting the client will write a `kiln/datadir/jwtsecret` file (referred to as `/path/to/written/jwt/secret/file` in the following instructions) with a randomly generated secret to be used in conjuction with a CL client. To prevent the secret to be re-generated next time around you restart the client, pass the file as an argument to read from via `--jwt-secret=kiln/datadir/jwtsecret`.

#### Docker

Or try it in Docker.

In `packages/client/kiln` run:

`docker-compose --file docker-compose.ethereumjs.yml up`

## Consensus

### Lodestar

#### Beacon

1. Use lodestar branch `master` and run `yarn && yarn build`
2. Export path of the downloaded config dir `export CONFIG_PATH=/path/to/downloaded/config/dir`
3. Export path of the written jwt secret file `export JWT_SECRET_PATH=/path/to/written/jwt/secret/file`
2. Run cmd: `./lodestar beacon --rootDir kiln/temp --paramsFile $CONFIG_PATH/config.yaml --genesisStateFile $CONFIG_PATH/genesis.ssz --bootnodesFile $CONFIG_PATH/boot_enr.yaml --network.connectToDiscv5Bootnodes --network.discv5.enabled true --eth1.enabled true --eth1.providerUrls=http://localhost:8545 --execution.urls=http://localhost:8545 --eth1.disableEth1DepositDataTracker true --jwt-secret $JWT_SECRET_PATH` 

#### Validator

1. Run cmd: `./lodestar validator --rootDir=kiln/temp_validatordata --paramsFile=kiln/config/config.yaml --keystoresDir=kiln/keystores --secretsDir=kiln/secrets`

Also, one will need to remove `--eth1.disableEth1DepositDataTracker true` and instead provide `--eth1.depositContractDeployBlock <block number>` in the previous beacon start command. The block number can be extracted from `/path/to/downloaded/config/dir/deposit_contract_block.txt`

### Lighthouse

### Beacon

1. Use lighthouse branch `unstable` and run `make`
1. Make dir `lighthouse/kiln` and copy in from the downloaded config dir: `config.yaml`, `genesis.ssz`, `deploy_block.txt`, `deposit_contract.txt`, `deposit_contract_block.txt`
1. Run cmd: `lighthouse --debug-level=info --datadir=kiln/datadir --testnet-dir=kiln beacon_node --disable-enr-auto-update --dummy-eth1 --boot-nodes="enr:" --merge --http-allow-sync-stalled --metrics --disable-packet-filter --execution-endpoints=http://127.0.0.1:8545 --terminal-total-difficulty-override=`
