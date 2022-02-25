# kiln v2 instructions

kiln v2 testnets are awaiting setup, once initialized the config files will be added to `kiln/config`

## Execution - EthereumJS Setup

Please ensure you have Node 12.x+ installed

1. `git clone --depth 1 --branch merge-kiln-v2 https://github.com/ethereumjs/ethereumjs-monorepo.git`
1. `cd ethereumjs-monorepo`
1. `npm i`
1. `cd packages/client`

### Run client

1. `npm run client:start -- --datadir kiln/datadir --gethGenesis kiln/config/genesis.json --saveReceipts --rpc --ws --rpcEngine --rpcEnginePort=8545 --bootnodes=`

#### Docker

Or try it in Docker.

In `packages/client/kiln` run:

`docker-compose --file docker-compose.ethereumjs.yml up`

## Consensus

### Lodestar

#### Beacon

1. Use lodestar branch `master` and run `yarn && yarn build`
1. Run cmd: `./lodestar beacon --rootDir kiln/temp --network=kiln --eth1.providerUrls=http://localhost:8545 --execution.urls=http://localhost:8545`

#### Validator

1. Run cmd: `./lodestar validator --rootDir=kiln/temp_validatordata --paramsFile=kiln/config/config.yaml --keystoresDir=kiln/keystores --secretsDir=kiln/secrets`

### Lighthouse

### Beacon

1. Use lighthouse branch `unstable` and run `make`
1. Make dir `lighthouse/kiln` and copy in from this dir: `config.yaml`, `genesis.ssz`, `deploy_block.txt`, `deposit_contract.txt`, `deposit_contract_block.txt`
1. Run cmd: `lighthouse --debug-level=info --datadir=kiln/datadir --testnet-dir=kiln beacon_node --disable-enr-auto-update --dummy-eth1 --boot-nodes="enr:" --merge --http-allow-sync-stalled --metrics --disable-packet-filter --execution-endpoints=http://127.0.0.1:8545 --terminal-total-difficulty-override=`
