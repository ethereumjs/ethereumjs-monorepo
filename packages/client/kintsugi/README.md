# Kintsugi instructions

## Execution - EthereumJS Setup

Please ensure you have Node 12.x+ installed

1. `git clone --depth 1 --branch merge-kintsugi https://github.com/ethereumjs/ethereumjs-monorepo.git`
1. `cd ethereumjs-monorepo`
1. `npm i`
1. `cd packages/client`

### Run client

1. `npm run client:start -- --datadir kintsugi/datadir --gethGenesis kintsugi/genesis.json --saveReceipts --rpc --rpcEngine --rpcEnginePort=8545  --rpcDebug --loglevel=debug`

## Consensus

### Lodestar

#### Beacon

*(Coming soon, below are old pithos instructions)*

1. Use lodestar branch `master` and run `yarn build`
1. Make dir `lodestar/kintsugi` and copy in from this dir: `config.yml`, `genesis.ssz`, `rcconfig.yml`
1. Run cmd: `./lodestar beacon --rootDir pithos/temp --rcConfig pithos/rcconfig.yml --paramsFile=pithos/config.yaml --network.connectToDiscv5Bootnodes`

#### Validator

1. Run cmd: `./lodestar validator --rootDir=pithos/temp_validatordata --paramsFile=pithos/config.yaml --keystoresDir=pithos/keystores --secretsDir=pithos/secrets`

### Lighthouse

### Beacon

*(Coming soon, below are old pithos instructions)*

1. Use lighthouse branch `merge-f2f` and run `make`
1. Make dir `lighthouse/pithos` and copy in from this dir: `config.yaml`, `genesis.ssz`, `deploy_block.txt`, `deposit_contract.txt`, `deposit_contract_block.txt`
1. Run cmd: `lighthouse --debug-level=info --datadir=pithos/temp --testnet-dir=pithos beacon_node --disable-enr-auto-update --dummy-eth1 --boot-nodes="enr:-Iq4QKuNB_wHmWon7hv5HntHiSsyE1a6cUTK1aT7xDSU_hNTLW3R4mowUboCsqYoh1kN9v3ZoSu_WuvW9Aw0tQ0Dxv6GAXxQ7Nv5gmlkgnY0gmlwhLKAlv6Jc2VjcDI1NmsxoQK6S-Cii_KmfFdUJL2TANL3ksaKUnNXvTCv1tLwXs0QgIN1ZHCCIyk" --merge --http-allow-sync-stalled --metrics --disable-packet-filter --execution-endpoints=http://127.0.0.1:8545 --terminal-total-difficulty-override=60000000`
