# @ethereumjs/client

[![NPM Package][client-npm-badge]][client-npm-link]
[![GitHub Issues][client-issues-badge]][client-issues-link]
[![Actions Status][client-actions-badge]][client-actions-link]
[![Code Coverage][client-coverage-badge]][client-coverage-link]
[![Discord][discord-badge]][discord-link]

| Ethereum Execution (Eth 1.0) Client built in TypeScript/JavaScript. |
| ------------------------------------------------------------------- |

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [General Usage](#general-usage)
- [Supported Networks](#supported-networks)
- [Running with a Consensus Layer (CL) Client](#running-with-a-consensus-layer-cl-client)
- [Custom Chains](#custom-chains)
- [Custom Network Mining (Beta)](#custom-network-mining-beta)
- [API](#api)
- [JSON RPC](#json-rpc)
- [Development](#development)
- [EthereumJS](#ethereumjs)

## Introduction

The EthereumJS Client is an Ethereum Execution Client (similar to [go-ethereum](https://github.com/ethereum/go-ethereum) or [Nethermind](https://github.com/NethermindEth/nethermind)) written in `TypeScript`/`JavaScript`, the non-Smart-Contract language Ethereum dApp developers are most familiar with. It is targeted to be a client for research and development and not meant to be used in production on `mainnet` for the foreseeable future (out of resource and security considerations).

Here are some use cases:

- Sync the main Ethereum networks (`mainnet` (experimental), `goerli`, `rinkeby`, `sepolia`...)
- Set up your own local development networks (PoS with consensus client / PoA Clique / PoW with CPU miner)
- Run a network with your own custom [EthereumJS VM](../vm)
- Analyze what's in the Ethereum `mainnet` [transaction pool (mempool)](./lib/sync/txpool.ts)

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
4. Run `npm client:start -- --help` for help on the CLI parameters

### Docker

Docker images are not yet published on a regular basis. You can build your own image by going to the repository
root directory and run:

```shell
docker build . -f Dockerfile.fromSource --tag ethereumjs:latest
```

You may now do appropriate directory/file mounts for `data` dir and `jwtsecret` file and provide their path appropriately in the `client` run command.

## General Usage

You can get the client up and running by going to the shell and run:

```shell
# npm installation
ethereumjs

# GitHub installation
npm run client:start
```

And pass in CLI parameters like:

```shell
# npm installation
ethereumjs --network=goerli

# GitHub installation
npm run client:start -- --network=goerli
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
- `goerli`
- `sepolia` (`v0.3.0`+)

Use the CLI `--network` option to switch the network:

```shell
ethereumjs --network=sepolia
```

The client currently supports `full` sync being set as a default and has experimental support for `light` sync.

## Running with a Consensus Layer (CL) Client

In most scenarios you will want to run the EthereumJS client in a combination with a consensus layer (CL) client. The most tested combination is to run the client with the [Lodestar](https://github.com/ChainSafe/lodestar) TypeScript CL client. Other possible options are to run with [Prysm](https://github.com/prysmaticlabs/prysm) (Go), [Lighthouse](https://github.com/sigp/lighthouse) (Rust), [Nimbus](https://github.com/status-im/nimbus-eth2) (Nim) or [Teku](https://github.com/ConsenSys/teku) (Java).

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
2. Run cmd: `./lodestar beacon --network sepolia --jwt-secret /path/to/jwtsecret/file`

This will by default try connecting to `ethereumjs` over the endpoint `8551`. (You may customize this in conjunction with `ethereumjs`, see lodestar cli help via `--help`).

You may provide `--checkpointSyncUrl` (with a synced `sepolia` beacon node endpoint as arg value) to start directly off the head/provided checkpoint on the `sepolia` beacon chain, possibly triggering (backfill) beacon sync on ethereumjs.

#### (Optional) Validator

Once you start a beacon node as instructed above, it will expose some default api endpoints. The validator started as instructed below will connect to the beacon node via these apis (Refer to `lodestar` cli help to modify the default endpoints for both beacon and validator). Again more complete and up-to-date [docs](https://chainsafe.github.io/lodestar/usage/validator-management/) are available within the Lodestar documentation.

1. Run cmd: `./lodestar validator --importKeystores /path/to/generated/keystores --importKeystoresPassword /path/to/keystores/password/file`

where the keystores have been generated via [staking-deposit-cli](https://github.com/ethereum/staking-deposit-cli) with the same password as in the above provided password file.

For a testnet chain, you may skip keystore generation and directly provide lodestar validator with a `mnemonic` and its range indices to derive validators via `--fromMnemonic` and `--mnemonicIndexes` args. For e.g.:

`./lodestar validator --fromMnemonic "lens risk clerk foot verb planet drill roof boost aim salt omit celery tube list permit motor obvious flash demise churn hold wave hollow" --mnemonicIndexes 0..5`

(Modify the mnemonic and range indices as per your validator configuration).

#### Running EthereumJS/Lodestar on Sepolia

A suited network to test the EthereumJS/Lodestar client combination is the Sepolia network, being still somewhat lightweight but nevertheless being actively used with a significant transaction load.

To sync the EthereumJS client pre-Merge run:

```shell
ethereumjs --network=sepolia
```

After the Merge you need to expand and start with JSON RPC and Engine API endpoints exposed:

```shell
ethereumjs --network=sepolia --rpc --rpcEngine
```

Then start the Lodestar client with:

```shell
./lodestar beacon --network=sepolia --jwt-secret=[PATH-TO-JWT-SECRET-FROM-ETHEREUMJS-CLIENT]
```

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
ethereumjs --dev --rpc

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
ethereumjs --dev --rpc --unlock=0xd8066d5822138e7c76d1565deb249f5f7ae370fa
```

Note: If the `--dev` command is used in conjunction with `--unlock` to use a predefined account, the blockchain's state will be preserved between consecutive runs. If you try to use a different predefined account, you may see errors related to incompatible genesis blocks. Simply run the client with the `--dev` flag by itself and use the new prefunded account provided by the client in further rounds of execution.

To explicitly set the miner coinbase (etherbase) specify `--minerCoinbase=[ADDRESS]` - otherwise this will default to the primary account.

The `--dev` command defaults to `--dev=poa`. If you would like to use PoW ethash with CPU miner (warning: slow) then pass `--dev=pow`.

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
[./lib/rpc/modules/](./lib/rpc/modules) source folder or the tracking issue
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

### Design

For an overview on the design goals which served as a guideline on design decisions as well as some structural client overview see the dedicated [DESIGN.md](./DESIGN.md) document.

### Client Customization

To get a start on customizing the client and using it programmatically see the code from [./bin/cli.ts](./bin/cli.ts) to get an idea of how an [EthereumClient](./lib/client.ts) instance is invoked programmatically.

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

The above command outputs the log messages from all `devp2p` debug loggers available. For a more targeted logging the different loggers can also be activated separately, e.g.:

```shell
DEBUG=ethjs,devp2p:rlpx,devp2p:eth,-babel [CLIENT_START_COMMAND]
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
