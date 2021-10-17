# Pithos testnet instructions

## EthereumJS Setup

Please ensure you have Node 12.x+ installed

1. `git clone --depth 1 --branch merge-pithos https://github.com/ethereumjs/ethereumjs-monorepo.git`
1. `cd ethereumjs-monorepo`
1. `npm i`
1. `cd packages/client`

### Run client

1. `npm run client:start -- --datadir pithos/temp --gethGenesis pithos/genesis.json --rpc --rpcEngine --rpcStubGetLogs --bootnodes=enode://e56b164de03d22eb85b79b03cdd9edd428c2e3b5f2ff435cf284e3dfb81699058fa602a39cbcd0315c72be904ff0c6ec66750ffa1912fe33e615e45d73c9a980@137.184.195.98:30303 --rpcDebug --loglevel=debug`

## Lodestar

1. `./lodestar beacon --rcConfig pithos/rcconfig.yml --rootDir pithos/temp --network.connectToDiscv5Bootnodes`

## Docker

`docker-compose --file docker-compose.ethereumjs.yml --env-file pithos.vars up`

# Dashboards / Monitors

https://pithos-explorer.ethdevops.io/

https://pithos.consensus-monitor.stokes.io/
