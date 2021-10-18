# Pithos testnet instructions

## Execution - EthereumJS Setup

Please ensure you have Node 12.x+ installed

1. `git clone --depth 1 --branch merge-pithos https://github.com/ethereumjs/ethereumjs-monorepo.git`
1. `cd ethereumjs-monorepo`
1. `npm i`
1. `cd packages/client`

### Run client

1. `npm run client:start -- --datadir pithos/temp --gethGenesis pithos/genesis.json --rpc --rpcEngine --rpcStubGetLogs --bootnodes=enode://e56b164de03d22eb85b79b03cdd9edd428c2e3b5f2ff435cf284e3dfb81699058fa602a39cbcd0315c72be904ff0c6ec66750ffa1912fe33e615e45d73c9a980@137.184.195.98:30303 --rpcDebug --loglevel=debug`

## Consensus

### Lodestar

#### Beacon

1. Use lodestar branch `master` and run `yarn build`
1. Make dir `lodestar/pithos` and copy in from this dir: `config.yml`, `genesis.ssz`, `rcconfig.yml`
1. Run cmd: `./lodestar beacon --rootDir pithos/temp --rcConfig pithos/rcconfig.yml --paramsFile=pithos/config.yaml --network.connectToDiscv5Bootnodes`

#### Validator

1. Run cmd: `./lodestar validator --rootDir=pithos/temp_validatordata --paramsFile=pithos/config.yaml --keystoresDir=pithos/keystores --secretsDir=pithos/secrets`

### Lighthouse

### Beacon

1. In the ethereumjs client append flag `--rpcEnginePort=8545`
1. Use lighthouse branch `merge-f2f` and run `make`
1. Make dir `lighthouse/pithos` and copy in from this dir: `config.yaml`, `genesis.ssz`, `deploy_block.txt`, `deposit_contract.txt`, `deposit_contract_block.txt`
1. Run cmd: `lighthouse --debug-level=info --datadir=pithos/temp --testnet-dir=pithos beacon_node --disable-enr-auto-update --dummy-eth1 --boot-nodes="enr:-Iq4QKuNB_wHmWon7hv5HntHiSsyE1a6cUTK1aT7xDSU_hNTLW3R4mowUboCsqYoh1kN9v3ZoSu_WuvW9Aw0tQ0Dxv6GAXxQ7Nv5gmlkgnY0gmlwhLKAlv6Jc2VjcDI1NmsxoQK6S-Cii_KmfFdUJL2TANL3ksaKUnNXvTCv1tLwXs0QgIN1ZHCCIyk" --merge --http-allow-sync-stalled --metrics --disable-packet-filter --execution-endpoints=http://127.0.0.1:8545 --terminal-total-difficulty-override=60000000`

## Docker

`docker-compose --file docker-compose.ethereumjs.yml --env-file pithos.vars up`

# Dashboards / Monitors

https://pithos-explorer.ethdevops.io/

https://pithos.consensus-monitor.stokes.io/
