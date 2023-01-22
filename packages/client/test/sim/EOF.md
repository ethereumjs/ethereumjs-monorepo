### Eof sim setup

- https://github.com/ethereumjs/ethereumjs-monorepo/issues/2298

This sim test is to setup a single ethereumjs<>lodestar instance to allow executing testvectors for the EIPs targetting Shanghai hardfork.

### EIP(s) testing

Target EIPs are: `3540,3651,3670,3855,3860`

### Prerequisite(s)

- Docker since lodestar docker image is used to run CL to drive the post-merge sim run
- Docker should run without `sudo`, else prefix `sudo` in from of docker commands in `test/sim/single-run.sh`
- Mac users should skip `docker` and install directly install and use lodestar binary as instructed below

### How to run

1. `npm install` the `ethereumjs-monorepo`
2. `cd packages/client`
3. `docker pull chainsafe/lodestar:latest`, for MAC users: `npm install -g @chainsafe/lodestar:latest`
4. Install linux package `jq` is not installed
5. Create a data directory `data/eof` (or any other place convinient for you).

There are three ways to run tests with varying degree of automation:

#### Fully automated sim run

Just run:

```
DATADIR=/data/eof npm run tape -- test/sim/eof.spec.ts
```

for MAC add extra env variable `LODE_BINARY="lodestar"` (or `LODE_BINARY="npx lodestar"` if you didn't install lodestar globally) , i.e.

```
DATADIR=/data/eof LODE_BINARY="lodestar" npm run tape -- test/sim/eof.spec.ts
```

It will auto run the script to run custom network using geth's genesis json format in `test/configs/eof.json`, run tests and in end tear it down. You can modify `test/sim/eof.spec.ts` transaction scenarios to test your custom functionality.

#### Semi-Auto run using script to start custom network

Currently you can just start the local instance by
`NETWORK=eof DATADIR=data/eof test/sim/./single-run.sh`

MAC users:
`NETWORK=eof DATADIR=data/eof LODE_BINARY="lodestar" test/sim/./single-run.sh`

This command run should start both ethereumjs and lodestar in terminal. Soon you should see lodestar driving ethereumjs in PoS configuration.

- Please note the extra env variable NETWORK that we supply here in the direct runs which is used to pick the geth
  genesis config from `test/sim/configs/${NETWORK}.json`. This is not required in directly running `test/sim/eof.spec.ts` (as instructed in previous section) as it directly passes the `NETWORK` env variable to the underlying script

Once the network looks synced to you, you can run tests:

```
EXTERNAL_RUN=true npm run tape -- test/sim/eof.spec.ts
```

as `EXTERNAL_RUN=true` indicates to the `eof.spec.ts` that the network is already running directly outside.

#### Manual run to setup network

1. Clean DATADIR (`rm -rf data/eof/*`) in start of each run and do `mkdir data/eof/ethereumjs && mkdir data/eof/lodestar`
2. Start ethereumjs: `npm run client:start -- --datadir data/eof/ethereumjs --gethGenesis test/sim/configs/geth-genesis.json --rpc --rpcEngine --rpcEngineAuth false`
3. Get genesis hash from `ethereumjs` client:

```
curl --location --request POST 'http://localhost:8545' --header 'Content-Type: application/json' --data-raw '{
      "jsonrpc": "2.0",
      "method": "eth_getBlockByNumber",
      "params": [
          "0x0",
          true
      ],
      "id": 1
    }' 2>/dev/null | jq ".result.hash"
```

Currently it should give you `0x3feda37f61eaa3d50deaa39cf04e352af0b54c521b0f16d26f826b54edeef756`

4. Get current time stamp: `date +%s` and add `30` to it which gives you current time + `30` seconds for e.g. `1664538222`
5. Start lodestar replacing the timestamp that you got from step 3 in `--genesisTime`: `docker run --rm --name beacon --network host chainsafe/lodestar:latest dev --dataDir data/eof/lodestar --genesisValidators 8 --startValidators 0..7 --enr.ip 127.0.0.1 --genesisEth1Hash 0x3feda37f61eaa3d50deaa39cf04e352af0b54c521b0f16d26f826b54edeef756 --params.ALTAIR_FORK_EPOCH 0 --params.BELLATRIX_FORK_EPOCH 0 --params.TERMINAL_TOTAL_DIFFICULTY 0x01 --genesisTime 1664538222`
   For MAC users: `lodestar dev --dataDir data/eof/lodestar --genesisValidators 8 --startValidators 0..7 --enr.ip 127.0.0.1 --genesisEth1Hash $GENESIS_HASH --params.ALTAIR_FORK_EPOCH 0 --params.BELLATRIX_FORK_EPOCH 0 --params.TERMINAL_TOTAL_DIFFICULTY 0x01 --genesisTime 1664538222`

Test the sim tests using the set network as:

```
EXTERNAL_RUN=true npm run tape -- test/sim/eof.spec.ts
```

### Custom Transaction testing/development

You may want to do your own custom transaction development/testing to target the EIP functionality in the hardfork. Using **Semi Auto** network script or via **Manual network setup** steps, you may start `ethereumjs<>lodestar` custom network.
Ethereumjs rpc endpoint should now be available at `http://127.0.0.1:8545` for you to play with!

happy Testing the Shanghai!

### Process cleanup

The script should auto clean the processes. In case it fails to do so:

1. Remove lodestar by `docker rm -f beacon`
2. Find the ethereumjs process by doing `ps -a | grep client` and do `kill <process id>`

### Multi peer setup

Start peer 1

```
NETWORK=eof DATADIR=/data/eof LODE_BINARY=lodestar MULTIPEER=peer1 test/sim/./single-run.sh
```

As soon as you see lodestar started and see a count down to genesis, you can start peer 2:

```
NETWORK=eof DATADIR=/data/eof LODE_BINARY=lodestar MULTIPEER=peer2 test/sim/./single-run.sh
```

(Pls use lodestar stable version i.e. `latest` tag, if you omit `LODE_BINARY` then `chainsafe/lodestar:latest` docker image will be used)
