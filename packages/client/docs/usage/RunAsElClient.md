# Running ethereumjs in PoS (ready) configurations

If the networks have the `merge` hardfork defined, ethereumjs will transition into PoS state

1. Once the ttd (total terminal difficulty) hits the `merge` hardfork, and from there on follows engine API calls by a CL for post merge continuation of the chain
2. Or the CL starts issuing engine API calls transitioning the normal forward sync into (backfill) beacon sync, signalling to ethereumjs that the chain is post merge.

So to run ethereumjs in PoS (ready) configurations, one requires to specify the correct ttd in the network configurations as well as turn on the engine api (via `--rpcEngine`).

## Networks which have been merged to PoS

Following networks have been merge to PoS with ethereumjs client having the baked in `merge` hardfork configurations:

1. Sepolia (`--network sepolia`)
2. Goerli (`--network goerli`)
3. (Upcoming) Mainnet (`--network mainnet`)

However, we recommend running `ethereumjs` on `sepolia` network as it's a relatively young network that can be easily synced by the `ethereumjs` client.

## Sepolia testnet instructions

- Execution chain can be followed at: https://sepolia.etherscan.io
- Beacon chain can be followed at: https://sepolia.beaconcha.in

To run `sepolia`, the configurations are baked in for both EL and CL clients. Our instructions will focus on the `lodestar` CL client, however other CL clients (`lighthouse`,`nimbus`,`teku`,`prysm`) can be similarly hooked up to `ethereumjs` as they all (should) follow `engine` API spec.

### Jwt-secret

The EL (`ethereumjs`) and CL (`lodestar`) communications over the `engine` API are protected by `jwt` auth. To enable this, you will need to generate and provide a jwt secret. We just use here a dummy one for illustrations, please generate one of your own.

```shell
echo "0xdc6457099f127cf0bac78de8b297df04951281909db4f58b43def7c7151e765d" > /path/to/jwtsecretfile
```

### Execution - EthereumJS Setup

Please ensure you have Node 16.x installed.

#### Client Installation

##### GitHub

1. `git clone --depth 1 --branch master https://github.com/ethereumjs/ethereumjs-monorepo.git`
2. `cd ethereumjs-monorepo`
3. `npm i`
4. `cd packages/client`

##### NPM

```shell
npm install -g @ethereumjs/client
```

Note that you eventually want to start the client just with `ethereumjs` instead of using the `npm run client:start` GitHub start command (also leave the in-between `--` to forward the client config options).

##### Docker

Or try it in Docker.

In `packages/merge`, you can build a docker image using

```shell
docker build . --tag ethereumjs:latest
```

You may now do appropriate directory/file mounts for `data` dir and `jwtsecret` file and provide their path appropriately in the `client` run command.

#### Run client

This the the bare minimum command required for interop with the CL `lodestar`. You may add further args to expose functionality for your use case.

```shell
npm run client:start -- --network sepolia --rpcEngine --jwt-secret /path/to/jwtsecret/file
```

This will start `ethereumjs` client on `sepolia` network and expose `engine` endpoints at `8551`(default port, can be modified see cli help via `--help`).

In case you want to host `engine_*` without auth (not recommended, only for debugging purposes), pass `--rpcEngineAuth false` as extra argument in the above run command (and you may skip `--jwt-secret`).

### Consensus - Lodestar Setup

#### Beacon

1. Use lodestar branch `stable` and run `yarn && yarn build`
2. Run cmd: `./lodestar beacon --network sepolia --jwt-secret /path/to/jwtsecret/file`

This will by default try reaching out `ethereumjs` over the endpoint `8551`. (You may customize this in conjuction with `ethereumjs`, see lodestar cli help via `--help`).

You may provide `--checkpointSyncUrl` (with a synced `sepolia` beacon node endpoint as arg value) to start directly off the head/provided checkpoint on the `sepolia` beacon chain, possibly triggering (backfill) beacon sync on ethereumjs.

#### (Optional) Validator

Once you start a beacon node as instructed above, it will expose some default api endpoints. The validator started as instructed below will connect to the beacon node via these apis (Refer to `lodestar` cli help to modify the default endpoints for both beacon and validator)

1. Run cmd: `./lodestar validator --importKeystores /path/to/generated/keystores --importKeystoresPassword /path/to/keystores/password/file`

where the keystores have been generated via [staking-deposit-cli](https://github.com/ethereum/staking-deposit-cli) with the same password as in the above provided password file.

For a testnet chain, you may skip keystore generation and directly provide lodestar validator with a `mnemonic` and its range indices to derive validators via `--fromMnemonic` and `--mnemonicIndexes` args. For e.g.:

`./lodestar validator --fromMnemonic "lens risk clerk foot verb planet drill roof boost aim salt omit celery tube list permit motor obvious flash demise churn hold wave hollow" --mnemonicIndexes 0..5`

(Modify the mnemonic and range indices as per your validator configuration).
