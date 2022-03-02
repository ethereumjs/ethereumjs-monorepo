# merge-devnet-3 instructions

## Execution - EthereumJS Setup

Please ensure you have Node 12.x+ installed

1. `git clone --depth 1 --branch merge-kintsugi https://github.com/ethereumjs/ethereumjs-monorepo.git`
1. `cd ethereumjs-monorepo`
1. `npm i`
1. `cd packages/client`

### Run client

1. `npm run client:start -- --datadir kintsugi/datadir --gethGenesis kintsugi/config/genesis.json --saveReceipts --rpc --ws --rpcEngine --rpcEnginePort=8545 --bootnodes=64.225.4.226:30303`

#### Docker

Or try it in Docker.

In `packages/client/kintsugi` run:

`docker-compose --file docker-compose.ethereumjs.yml up`

## Consensus

### Lodestar

#### Beacon

1. Use lodestar branch `master` and run `yarn && yarn build`
1. Run cmd: `./lodestar beacon --rootDir kintsugi/temp --network=kintsugi --eth1.providerUrls=http://localhost:8545 --execution.urls=http://localhost:8545`

#### Validator

1. Run cmd: `./lodestar validator --rootDir=kintsugi/temp_validatordata --paramsFile=kintsugi/config/config.yaml --keystoresDir=kintsugi/keystores --secretsDir=kintsugi/secrets`

### Lighthouse

### Beacon

1. Use lighthouse branch `kintsugi` and run `make`
1. Make dir `lighthouse/kintsugi` and copy in from this dir: `config.yaml`, `genesis.ssz`, `deploy_block.txt`, `deposit_contract.txt`, `deposit_contract_block.txt`
1. Run cmd: `lighthouse --debug-level=info --datadir=kintsugi/datadir --testnet-dir=kintsugi beacon_node --disable-enr-auto-update --dummy-eth1 --boot-nodes="enr:-Iq4QKuNB_wHmWon7hv5HntHiSsyE1a6cUTK1aT7xDSU_hNTLW3R4mowUboCsqYoh1kN9v3ZoSu_WuvW9Aw0tQ0Dxv6GAXxQ7Nv5gmlkgnY0gmlwhLKAlv6Jc2VjcDI1NmsxoQK6S-Cii_KmfFdUJL2TANL3ksaKUnNXvTCv1tLwXs0QgIN1ZHCCIyk" --merge --http-allow-sync-stalled --metrics --disable-packet-filter --execution-endpoints=http://127.0.0.1:8545 --terminal-total-difficulty-override=5000000000`
