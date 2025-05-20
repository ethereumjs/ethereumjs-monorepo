# @ethereumjs/client

[![NPM Package][client-npm-badge]][client-npm-link]
[![GitHub Issues][client-issues-badge]][client-issues-link]
[![Actions Status][client-actions-badge]][client-actions-link]
[![Code Coverage][client-coverage-badge]][client-coverage-link]
[![Discord][discord-badge]][discord-link]

| Ethereum Execution Layer (EL) Client built in TypeScript/JavaScript. |
| -------------------------------------------------------------------- |

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [General Usage](#general-usage)
- [Supported Networks](#supported-networks)
- [Running with a Consensus Layer (CL) Client](#running-with-a-consensus-layer-cl-client)
- [Testnets](#testnets)
- [Custom Chains](#custom-chains)
- [Custom Network Mining (Beta)](#custom-network-mining-beta)
- [API](#api)
- [JSON RPC](#json-rpc)
- [Development](#development)
- [EthereumJS](#ethereumjs)

## Introduction

The EthereumJS Client is an Ethereum Execution Client (similar to [go-ethereum](https://github.com/ethereum/go-ethereum) or [Nethermind](https://github.com/NethermindEth/nethermind)) written in `TypeScript`/`JavaScript`, the non-Smart-Contract language Ethereum dApp developers are most familiar with. It is targeted to be a client for research and development and not meant to be used in production on `mainnet` for the foreseeable future (out of resource and security considerations).

Here are some use cases:

- Sync the main Ethereum networks (`mainnet` (experimental), `sepolia`, `holesky`, ...)
- Set up your own local development networks (PoS with consensus client / PoA Clique / PoW with CPU miner)
- Run a network with your own custom [EthereumJS VM](../vm)
- Analyze what's in the Ethereum `mainnet` [transaction pool (mempool)](./src/sync/txpool.ts)

The client has an extremely modular design by building upon central other libraries in the EthereumJS monorepo ([VM](../vm), [Merkle Patricia Tree](../trie), [Blockchain](../blockchain), [Block](../block), [tx](../tx), [devp2p](../devp2p) and [Common](../common)) and is therefore extremely well suited for a deep dive into Ethereum protocol development.

We invite you to explore and would be delighted if you give us feedback on your journey! 🙂 ❤️

## Installation

To be able to run the EthereumJS client, you need a working [Node.js](https://nodejs.org/en/) installation, see e.g. these [docs](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) from the npm documentation for combined instructions on how to install Node.js and eventually npm.

We currently recommend to run the client with a recent Node.js version `18` installation.

### NPM Installation

Client releases are done on a regular basis on [npm](https://www.npmjs.com/package/@ethereumjs/client).

You can install the latest version with:

```shell
npm install -g @ethereumjs/client
```

### Source Installation

The client can also be easily installed and built from source:

1. Clone the EthereumJS monorepo with `git clone https://github.com/ethereumjs/ethereumjs-monorepo.git`
2. Run `npm i` from the root folder to install dependencies and build
3. Now the client can be run from the `packages/client` folder with `npm run client:start`
4. Run `npm run client:start -- --help` for help on the CLI parameters

### Docker

A Docker image is built nightly from the current master branch and can be retrieved via the below command:

```sh
docker pull ethpandaops/ethereumjs:master
```

Alternatively, an image from the most recent stable release can be accessed via:

```sh
docker pull ethpandaops/ethereumjs:stable
```

You can also build your own image by going to the repository
root directory and run:

```shell
docker build . -f Dockerfile --tag ethereumjs:latest
```

You may now do appropriate directory/file mounts for `data` dir and `jwtsecret` file and provide their path appropriately in the `client` run command.

Also, in your `docker run` command, be sure to include the `--init` flag so that the container will properly handle kernel signals (like SIGINT and SIGTERM). Not doing so can lead to unexpected behaviour [(as documented here)](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md#handling-kernel-signals)

## General Usage

You can get the client up and running by going to the shell and run:

```shell
# npm installation
ethereumjs

# Source installation
npm run client:start
```

And pass in CLI parameters like:

```shell
# npm installation
ethereumjs --network=holesky

# Source installation
npm run client:start -- --network=holesky
```

To see a help page with the full list of client options available run:

```shell
ethereumjs --help
```

For the networks that have transitioned to PoS aka **merged** (all Ethereum networks have been _merged_), checkout how to [run Ethereumjs in the PoS configuration](docs/usage/RunAsElClient.md).

## Supported Networks

The EthereumJS client is tightly integrated with the EthereumJS [Common](../common) library and gets its network state and information from this library. The client supports all networks supported by `Common`.

The main supported networks are:

- `mainnet` (experimental)
- `sepolia` (`v0.3.0`+)
- `holesky` (`v0.9.0`+)

Use the CLI `--network` option to switch the network:

```shell
ethereumjs --network=holesky
```

The client currently supports `full` sync being set as a default and has experimental support for `light` sync.

## Running with a Consensus Layer (CL) Client

In most scenarios you will want to run the EthereumJS client in a combination with a consensus layer (CL) client. The most tested combination is to run the client with the [Lodestar](https://github.com/ChainSafe/lodestar) TypeScript CL client. Lodestar provides a [quick-start repository](https://github.com/ChainSafe/lodestar-quickstart) that allows users to get started quickly with minimal configuration. After cloning the linked quick-start repository, all that should be necessary to get the Lodestar consensus client started with EthereumJS is to run the following command:

```shell
./setup.sh --network sepolia --dataDir sepolia-data --elClient ethereumjs
```

Other possible options are to run with [Prysm](https://github.com/prysmaticlabs/prysm) (Go), [Lighthouse](https://github.com/sigp/lighthouse) (Rust), [Nimbus](https://github.com/status-im/nimbus-eth2) (Nim) or [Teku](https://github.com/ConsenSys/teku) (Java).

### Necessary CLI Options

#### Engine API

Execution and consensus layer clients communicate with each other through a new set of JSON-RPC API calls, the so-called [Engine API](https://github.com/ethereum/execution-apis/tree/main/src/engine).

The Engine API can be activated in the client with:

```shell
--rpcEngine
```

This will expose `engine` endpoints at `8551`(default port, can be modified see cli help via `--help`).

#### JWT Authentication

To ensure a secure communication channel between clients, a [JWT](https://jwt.io/) token is needed for authentication. If no further option is provided in the client, a JWT token is created on first run and stored to a predefined location (see CLI output). This secret will then be re-used by default, and can then be provided to the CL client (see CL client documentation for details).

To use an existing token the path to the token can be passed to the client with the following flag:

```shell
--jwt-secret
```

JWT authentication can be disabled by adding the `--rpcEngineAuth false` flag (do not use in production).

### Example: Setup with Lodestar

#### Beacon

The following is a rough guidance to run Lodestar as a beacon (non-validating) Node, see Lodestar [docs](https://chainsafe.github.io/lodestar/usage/beacon-management/) for more complete and up-to-date instructions on beacon management with Lodestar.

1. Use lodestar branch `stable` and run `yarn && yarn build`
2. Run cmd: `./lodestar beacon --network holesky --jwt-secret /path/to/jwtsecret/file`

This will by default try connecting to `ethereumjs` over the endpoint `8551`. (You may customize this in conjunction with `ethereumjs`, see lodestar cli help via `--help`).

You may provide `--checkpointSyncUrl` (with a synced `holesky` beacon node endpoint as arg value) to start directly off the head/provided checkpoint on the `holesky` beacon chain, possibly triggering (backfill) beacon sync on ethereumjs.

#### (Optional) Validator

Once you start a beacon node as instructed above, it will expose some default api endpoints. The validator started as instructed below will connect to the beacon node via these apis (Refer to `lodestar` cli help to modify the default endpoints for both beacon and validator). Again more complete and up-to-date [docs](https://chainsafe.github.io/lodestar/usage/validator-management/) are available within the Lodestar documentation.

1. Run cmd: `./lodestar validator --importKeystores /path/to/generated/keystores --importKeystoresPassword /path/to/keystores/password/file`

where the keystores have been generated via [staking-deposit-cli](https://github.com/ethereum/staking-deposit-cli) with the same password as in the above provided password file.

For a testnet chain, you may skip keystore generation and directly provide lodestar validator with a `mnemonic` and its range indices to derive validators via `--fromMnemonic` and `--mnemonicIndexes` args. For e.g.:

`./lodestar validator --fromMnemonic "lens risk clerk foot verb planet drill roof boost aim salt omit celery tube list permit motor obvious flash demise churn hold wave hollow" --mnemonicIndexes 0..5`

(Modify the mnemonic and range indices as per your validator configuration).

#### Running EthereumJS/Lodestar on Holesky

A suited network to test the EthereumJS/Lodestar client combination is the Holesky network, being still somewhat lightweight but nevertheless being actively used with a significant transaction load.

To start the EthereumJS client with JSON RPC and Engine API endpoints exposed:

```shell
ethereumjs --network=holesky --rpc --rpcEngine
```

Then start the Lodestar client with:

```shell
./lodestar beacon --network=holesky --jwt-secret=[PATH-TO-JWT-SECRET-FROM-ETHEREUMJS-CLIENT]
```

## Experimental Testnets

The EthereumJS client supports ongoing protocol development efforts, allowing developers and testers to participate in various testnets using the EthereumJS client.

### Verkle testnet

We currently support the Kaustinen7 testnet, both with stateless and stateful execution. We will be proactively supporting upcoming testnets as they launch. 

Step 1 - Running the EthereumJS client (from the cloned @ethereumjs/client package)

For stateless execution: 

`npm run client:start:ts -- --rpc --gethGenesis=./devnets/kaustinen7/genesis.json --dataDir=datadir/kaust7 --rpcEngine --rpcEngineAuth=false --statelessVerkle=true`

For stateful execution:

`npm run client:start:ts -- --rpc --gethGenesis=./devnets/kaustinen7/genesis.json --dataDir=datadir/kaust7 --rpcEngine --rpcEngineAuth=false --statefulVerkle=true`

Step 2 - Running the Lodestar client (from the cloned Lodestar quick-start repository)

`./setup.sh --network kaustinen7 --dataDir kaust --justCL`

Additional information on the Kaustinen7 testnet can be retrieve from this page: https://verkle-gen-devnet-7.ethpandaops.io/

The process should be similar for other testnets, and the quick-start repository should provide testnet-specific configuration instructions for the Lodestar consensus layer client.

## Custom Chains

The EthereumJS client supports running custom chains based on a custom chain configuration. There are two ways of reading in custom chain configuration parameters:

### Common-based Configuration

We have got our own flexible chain configuration and genesis state configuration format applied in the `Common` library, see the `Common` [chain JSON files](../common/src/chains/) as well as corresponding blockchain [Genesis JSON files](../blockchain/src/genesisStates/) for inspiration.

Custom chain files following this format can be passed in to the client with the following options:

```shell
ethereumjs --customChain=[COMMON_FORMAT_CHAIN_FILE] --customGenesisState=[COMMON_FORMAT_GENESIS_STATE]
```

### Geth Genesis Files

It is also possible to use a chain configuration as defined by the Go-Ethereum [genesis.json file format](https://geth.ethereum.org/docs/interface/private-network).

Use the following option to pass in to the client:

```shell
ethereumjs --gethGenesis=[GETH_GENESIS_JSON_FILE]
```

## Custom Network Mining (Beta)

The client supports private custom network mining by using the `--mine` option together with passing in a comma separated list of accounts with the `--unlock` option:

```shell
ethereumjs --mine --unlock=[ADDRESS1],[ADDRESS2],...
```

Note that this feature is in `beta` and shouldn't be used with accounts holding a substantial amount of `Ether` on mainnet (or other valuable assets) for security reasons.

### Custom Network for Development

The client provides a quick way to get a local instance of a blockchain up and running using the `--dev` command. This will start up a private PoA clique network with a prefunded account that mines block on 10 second intervals. The prefunded account and its private key are printed to the screen when the client starts. When paired with the `--rpc` command, you have a ready-made environment for local development.

```shell
ethereumjs --dev=poa --rpc

==================================================
Account generated for mining blocks:
Address: 0xd8066d5822138e7c76d1565deb249f5f7ae370fa
Private key: 0x6239e36ab8b27212868a1aa3f9c3b88b084075ea56aa4979d206371f065d3feb
WARNING: Do not use this account for mainnet funds
==================================================
```

Please **heed** the warning and do not use the provided account/private key for mainnet funds.

This can also be paired with the `--unlock` command if you would like to specify the miner/prefunded account:

```shell
ethereumjs --dev=poa --rpc --unlock=0xd8066d5822138e7c76d1565deb249f5f7ae370fa
```

Note: If the `--dev` command is used in conjunction with `--unlock` to use a predefined account, the blockchain's state will be preserved between consecutive runs. If you try to use a different predefined account, you may see errors related to incompatible genesis blocks. Simply run the client with the `--dev=poa` flag by itself and use the new prefunded account provided by the client in further rounds of execution.

To explicitly set the miner coinbase (etherbase) specify `--minerCoinbase=[ADDRESS]` - otherwise this will default to the primary account.

The `--dev` command must be passed with a value (either 'poa' or 'pow') or you will receive an error.

### CLI Parameter Autocompletion (experimental)

The client supports a primitive form of autocompletion for CLI parameters. To enable, first ensure you have built the client (or installed from NPM).

Then, configure the client to use autocompletion. This works with either `bash` or `zsh` shells.

Set up the autocompletion script.

```
dist/bin/cli.js completion >> ~/.zshrc
```

Close and reopen the your terminal window (or else run `source ~/.zshrc`).
When you next type `dist/bin/cli.js --d` and then press `tab`, you should see something like:

```sh
dist/bin/cli.js --d
--dataDir            -- Data directory for the blockchain
--debugCode          -- Generate code for local debugging (internal usage mostly)
--dev                -- Start an ephemeral PoA blockchain with a single miner and prefunded accounts
--disableBeaconSync  -- Disables beacon (optimistic) sync if the CL provides blocks at the head of the chain
--discDns            -- Query EIP-1459 DNS TXT records for peer discovery
--discV4             -- Use v4 ("findneighbour" node requests) for peer discovery
--dnsAddr            -- IPv4 address of DNS server to use when acquiring peer discovery targets
--dnsNetworks        -- EIP-1459 ENR tree urls to query for peer discovery targets
```

## Metrics

The client can optionally collect metrics using the [Prometheus](https://github.com/prometheus/prometheus) metrics platform and expose them via an HTTP endpoint with the following CLI flags.  
The current metrics that are reported by the client can be found at the default port and route: `localhost:8000/metrics`.

```sh
# npm installation
ethereumjs --prometheus

# source installation
npm run client:start:ts -- --prometheus --prometheusPort=9123
```

## API

[API Reference](./docs/README.md)

See also this [diagram](./diagram/client.svg) for an overview of the client structure with the initialization and message flow.

## JSON-RPC

### Overview

You can expose a [JSON-RPC](https://ethereum.org/en/developers/docs/apis/json-rpc/) interface along a client run with:

```shell
ethereumjs --rpc
```

To run just the server without syncing:

```shell
ethereumjs --rpc --maxPeers=0
```

Currently only a small subset of `RPC` methods are implemented.(\*) You can have a look at the
[./src/rpc/modules/](./src/rpc/modules) source folder or the tracking issue
[#1114](https://github.com/ethereumjs/ethereumjs-monorepo/issues/1114) for an overview.

(*) Side note: implementing RPC methods is actually an extremely thankful task for a first-time
contribution on the project *hint\* _hint_. 😄

### API Examples

You can use `cURL` to request data from an API endpoint. Here is a simple example for
[web3_clientVersion](https://ethereum.org/en/developers/docs/apis/json-rpc/#web3_clientversion):

```shell
curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","id":1,"method":"web3_clientVersion", "params": []}' http://localhost:8545
```

Note that `"params": []` can also be omitted in this case.

Or - somewhat more convenient and with formatted output - with a tool like [httpie](http://httpie.org/):

```shell
http POST http://localhost:8545 jsonrpc=2.0 id=1 method=web3_clientVersion params:=[]
```

Note the `:=` separator for the `params` parameter to
[indicate](https://httpie.org/docs#non-string-json-fields) raw `JSON` as an input.

This will give you an output like the following:

```json
{
  "id": "1",
  "jsonrpc": "2.0",
  "result": "EthereumJS/0.0.5/darwin/node12.15.0"
}
```

Here's an example for a call on an endpoint with the need for parameters. The following call uses
the [eth_getBlockByNumber](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblockbynumber) endpoint
to request data for block number 436 (you can use a tool like
[RapidTables](https://www.rapidtables.com/convert/number/decimal-to-hex.html) for conversion to `hex`):

```shell
curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_getBlockByNumber","params":["0x1b4", true],"id":1}' http://127.0.0.1:8545
```

Same with `httpie`:

```shell
http POST http://localhost:8545 jsonrpc=2.0 id=1 method=eth_getBlockByNumber params:='["0x1b4",true]'
```

Output:

```json
{
  "jsonrpc": "2.0",
  "id": "1",
  "result": {
    "number": "0x1b4",
    "hash": "0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae",
    "parentHash": "0xe99e022112df268087ea7eafaf4790497fd21dbeeb6bd7a1721df161a6657a54",
    "nonce": "0x689056015818adbe",
    "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
    "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    "transactionsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
    "stateRoot": "0xddc8b0234c2e0cad087c8b389aa7ef01f7d79b2570bccb77ce48648aa61c904d",
    "receiptsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
    "miner": "0xbb7b8287f3f0a933474a79eae42cbca977791171",
    "difficulty": "0x4ea3f27bc",
    "totalDifficulty": "0x78ed983323d",
    "extraData": "0x476574682f4c5649562f76312e302e302f6c696e75782f676f312e342e32",
    "size": "0x747",
    "gasLimit": "0x1388",
    "gasUsed": "0x0",
    "timestamp": "0x55ba467c",
    "transactions": [],
    "uncles": []
  }
}
```

## Development

See also [DEVELOPER.md](./DEVELOPER.md).

### Design

For an overview on the design goals which served as a guideline on design decisions as well as some structural client overview see the dedicated [DESIGN.md](./DESIGN.md) document.

### Client Customization

To get a start on customizing the client and using it programmatically see the code from [./bin/cli.ts](./bin/cli.ts) to get an idea of how an [EthereumClient](./src/client.ts) instance is invoked programmatically.

We would love to hear feedback from you on what you are planning and exchange on ideas how a programmatic exposure of the client API can be achieved more systematically and useful for third-party development use.

### Debugging

#### Local Test Network

For some guidance on how to setup local testnetworks see the examples on [local debugging](./examples/local-debugging.md) and setting up a [private network with Geth](./examples/private-geth-network.md).

#### Using Debug Loggers

The client's logging verbosity level can be set with `--loglevel`. Available levels are
`error`, `warn`, `info`, `debug`.

```shell
ethereumjs --loglevel=debug
```

For more in-depth debugging on networking the underlying [devp2p](../devp2p) library integrates with the [debug](https://github.com/visionmedia/debug) package and can also be used from within a client execution context:

```shell
DEBUG=ethjs,*,-babel [CLIENT_START_COMMAND]
```

The above command outputs the log messages from all `devp2p` debug loggers available. For more targeted logging, the different loggers can also be activated separately, e.g.:

```shell
DEBUG=ethjs,devp2p:rlpx,devp2p:eth,-babel [CLIENT_START_COMMAND]

The following options are available:

| Logger              | Description                                      |
| ------------------- | ------------------------------------------------ |
| `client:fetcher:#`            | This option enables logging for core fetcher operations such as job scheduling   |
| `client:fetcher:bytecode`   | This option enables logging for the snap sync bytecode fetcher         |
| `client:fetcher:storage`    | This option enables logging for the snap sync storage fetcher  |
| `client:fetcher:trienode`   | This option enables logging for the snap sync trienode fetcher      |
| `client:fetcher:account`    | This option enables logging for the snap sync account fetcher      |

```

`ethjs` **must** be included in the `DEBUG` environment variables to enable **any** logs.
Additional log selections can be added with a comma separated list (no spaces). Logs with extensions can be enabled with a colon `:`, and `*` can be used to include all extensions.

`DEBUG=ethjs,client:fetcher:*,devp2p:eth npm run client:start`

#### Hive testing

See [DEVELOPER.md](./DEVELOPER.md)

### REPL

An under-development REPL is now available to users. It can be run using the npm script available in the client package:

`npm run repl`

In order to pass parameters to the client while using the repl, you can append it to the npm script command:

`npm run repl -- --gethGenesis /data/genesis.json`

The repl allows access to the JSON-RPC and ENGINE API's from the terminal. For help and a list of supported functions, type `.help` upon repl startup:
```
[01-17|09:05:57] INFO Started JSON RPC Server address=http://localhost:8545 namespaces=eth,web3,net,admin,txpool,debug 
[01-17|09:05:57] INFO Started JSON RPC server address=http://localhost:8551 namespaces=eth,engine rpcEngineAuth=false 
EthJS > .help
```

Example usage of repl commands:
```
[01-17|09:10:54] INFO Started JSON RPC Server address=http://localhost:8545 namespaces=eth,web3,net,admin,txpool,debug 
[01-17|09:10:54] INFO Started JSON RPC server address=http://localhost:8551 namespaces=eth,engine rpcEngineAuth=false 
EthJS > .eth_getBlockByNumber ["latest", true]
EthJS > {
  number: '0x0',
  hash: '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
  parentHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
  mixHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
  nonce: '0x0000000000000042',
  ...
```

### Diagram Updates

To update the structure diagram files in the root folder open the `client.drawio` file in [draw.io](https://draw.io/), make your changes, and open a PR with the updated files. Export `svg` and `png` with `border` `width=20` and `transparency=false`. For `png` go to "Advanced" and select `300 DPI`.

## EthereumJS

See our organizational [documentation](https://ethereumjs.readthedocs.io) for an introduction to `EthereumJS` as well as information on current standards and best practices.

If you want to join for work or do improvements on the libraries have a look at our [contribution guidelines](https://ethereumjs.readthedocs.io/en/latest/contributing.html).

[client-npm-badge]: https://img.shields.io/npm/v/@ethereumjs/client.svg
[client-npm-link]: https://www.npmjs.com/package/@ethereumjs/client
[client-issues-badge]: https://img.shields.io/github/issues/ethereumjs/ethereumjs-monorepo/package:%20client?label=issues
[client-issues-link]: https://github.com/ethereumjs/ethereumjs-monorepo/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+client"
[client-actions-badge]: https://github.com/ethereumjs/ethereumjs-monorepo/workflows/Client/badge.svg
[client-actions-link]: https://github.com/ethereumjs/ethereumjs-monorepo/actions?query=workflow%3A%22Client%22
[client-coverage-badge]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/branch/master/graph/badge.svg?flag=client
[client-coverage-link]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/tree/master/packages/client
[discord-badge]: https://img.shields.io/static/v1?logo=discord&label=discord&message=Join&color=blue
[discord-link]: https://discord.gg/TNwARpR
