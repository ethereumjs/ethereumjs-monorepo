# @ethereumjs/devp2p

[![NPM Status][devp2p-npm-badge]][devp2p-npm-link]
[![GitHub Issues][devp2p-issues-badge]][devp2p-issues-link]
[![Actions Status][devp2p-actions-badge]][devp2p-actions-link]
[![Coverage Status][devp2p-coverage-badge]][devp2p-coverage-link]
[![Discord][discord-badge]][discord-link]

## Introduction

This library bundles different components for lower-level peer-to-peer connection and message exchange:

- Distributed Peer Table (DPT) / v4 Node Discovery / DNS Discovery
- RLPx Transport Protocol
- Ethereum Wire Protocol (ETH/68)

## Usage

All components of this library have a public `events` property containing a Node.js `EventEmitter` object
and make heavy use of the Node.js network stack.

You can react on events from the network like this:

```ts
// ./examples/peer-communication.ts#L65-L65

dpt.events.on('error', (err) => console.error(chalk.red(`DPT error: ${err}`)))
```

## Examples

Basic example to connect to some bootstrap nodes and get basic peer info:

- [simple](examples/simple.cts)

Communicate with peers to read new transaction and block information:

- [peer-communication](examples/peer-communication.cts)

Run an example with:

```
DEBUG=ethjs,devp2p:* node -r tsx/register ./examples/peer-communication.cts
```

## Docs

For a complete API reference see the generated [documentation](./docs).

Additionally you can find a description of the main entrypoints for using
the different modules in the following sections.

## Distributed Peer Table (DPT) / Node Discovery

Maintain/manage a list of peers, see [./src/dpt/](./src/dpt/), also
includes node discovery ([./src/dpt/server.ts](./src/dpt/server.ts))

### Usage

Create your peer table:

```ts
// examples/dpt.ts

import { DPT } from '@ethereumjs/devp2p'
import { bytesToHex, hexToBytes } from '@ethereumjs/util'

const PRIVATE_KEY = hexToBytes('0xed6df2d4b7e82d105538e4a1279925a16a84e772243e80a561e1b201f2e78220')
const main = async () => {
  const dpt = new DPT(PRIVATE_KEY, {
    endpoint: {
      address: '0.0.0.0',
      udpPort: null,
      tcpPort: null,
    },
  })
  console.log(`DPT is active and has id - ${bytesToHex(dpt.id!)}`)
  // Should log the DPT's hex ID - 0xcd80bb7a768432302d267729c15da61d172373ea036...
  dpt.destroy()
}

void main()
```

Add some bootstrap nodes (or some custom nodes with `dpt.addPeer()`):

```ts
// ./examples/peer-communication.ts#L321-L325


for (const bootnode of BOOTNODES) {
  dpt.bootstrap(bootnode).catch((err) => {
    console.error(chalk.bold.red(`DPT bootstrap error: ${err.stack ?? err}`))
  })
```

### API

See the following [diagram](./diagram/devp2p.svg) for a high level overview on the library.

#### `DPT` (extends `EventEmitter`)

Distributed Peer Table. Manages a Kademlia DHT K-bucket (`Kbucket`) for storing peer information
and a `BanList` for keeping a list of bad peers. `Server` implements the node discovery (`ping`,
`pong`, `findNeighbours`).

##### `new DPT(privateKey, options)`

Creates new DPT object

- `privateKey` - Key for message encoding/signing.
- `options.timeout` - Timeout in ms for server `ping`, passed to `Server` (default: `10s`).
- `options.endpoint` - Endpoint information to send with the server `ping`, passed to `Server` (default: `{ address: '0.0.0.0', udpPort: null, tcpPort: null }`).
- `options.createSocket` - A datagram (dgram) `createSocket` function, passed to `Server` (default: `dgram.createSocket.bind(null, 'udp4')`).
- `options.refreshInterval` - Interval in ms for refreshing (calling `findNeighbours`) the peer list (default: `60s`).
- `options.shouldFindNeighbours` - Toggles whether or not peers should be queried with 'findNeighbours' to discover more peers (default: `true`)
- `options.shouldGetDnsPeers` - Toggles whether or not peers should be discovered by querying EIP-1459 DNS lists (default: `false`)
- `options.dnsRefreshQuantity` - Max number of candidate peers to retrieve from DNS records when attempting to discover new nodes (default: `25`)
- `options.dnsNetworks` - EIP-1459 ENR tree urls to query for peer discovery (default: network dependent)
- `options.dnsAddr` - DNS server to query DNS TXT records from for peer discovery

#### `dpt.bootstrap(peer)` (`async`)

Uses a peer as new bootstrap peer and calls `findNeighbours`.

- `peer` - Peer to be added, format `{ address: [ADDRESS], udpPort: [UDPPORT], tcpPort: [TCPPORT] }`.

#### `dpt.addPeer(object)` (`async`)

Adds a new peer.

- `object` - Peer to be added, format `{ address: [ADDRESS], udpPort: [UDPPORT], tcpPort: [TCPPORT] }`.

For other utility functions like `getPeer`, `getPeers` see [./src/dpt/dpt.ts](./src/dpt/dpt.ts).

### Events

Events emitted:

| Event        |         Description          |
| ------------ | :--------------------------: |
| peer:added   |   Peer added to DHT bucket   |
| peer:removed | Peer removed from DHT bucket |
| peer:new     |        New peer added        |
| listening    |    Forwarded from server     |
| close        |    Forwarded from server     |
| error        |    Forwarded from server     |

### Reference

- [Node discovery protocol](https://ethereum.org/en/developers/docs/networking-layer/#discovery)
- [RLPx - Node Discovery Protocol](https://github.com/ethereum/devp2p/blob/master/rlpx.md#node-discovery)
- [Kademlia Peer Selection](https://github.com/ethereum/wiki/wiki/Kademlia-Peer-Selection)

## RLPx Transport Protocol

Connect to a peer, organize the communication, see [./src/rlpx/](./src/rlpx/)

### Usage

Instantiate an [@ethereumjs/common](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/common)
instance with the network you want to connect to and then create an `RLPx` object:

```ts
// ./examples/rlpx.ts

import { Common, Mainnet } from '@ethereumjs/common'
import { ETH, RLPx } from '@ethereumjs/devp2p'
import { hexToBytes } from '@ethereumjs/util'

const main = async () => {
  const common = new Common({ chain: Mainnet })
  const PRIVATE_KEY = hexToBytes(
    '0xed6df2d4b7e82d105538e4a1279925a16a84e772243e80a561e1b201f2e78220',
  )
  const rlpx = new RLPx(PRIVATE_KEY, {
    maxPeers: 25,
    capabilities: [ETH.eth65, ETH.eth64],
    common,
  })
  console.log(`RLPx is active - ${rlpx._isAlive()}`)
  rlpx.destroy()
}

void main()
```

### API

#### `RLPx` (extends `EventEmitter`)

Manages the handshake (`ECIES`) and the handling of the peer communication (`Peer`).

##### `new RLPx(privateKey, options)`

Creates new RLPx object

- `privateKey` - Key for message encoding/signing.
- `options.timeout` - Peer `ping` timeout in ms (default: `10s`).
- `options.maxPeers` - Max number of peer connections (default: `10`).
- `options.clientId` - Client ID string (default example: `ethereumjs-devp2p/v2.1.3/darwin-x64/nodejs`).
- `options.remoteClientIdFilter` - Optional list of client ID filter strings (e.g. `['go1.5', 'quorum']`).
- `options.capabilities` - Upper layer protocol capabilities, e.g. `[devp2p.ETH.eth63, devp2p.ETH.eth62]`.
- `options.listenPort` - The listening port for the server or `null` for default.
- `options.dpt` - `DPT` object for the peers to connect to (default: `null`, no `DPT` peer management).
- `options.common` - An instance of [`@ethereumjs/common`](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/common).

#### `rlpx.connect(peer)` (`async`)

Manually connect to peer without `DPT`.

- `peer` - Peer to connect to, format `{ id: PEER_ID, address: PEER_ADDRESS, port: PEER_PORT }`.

For other connection/utility functions like `listen`, `getPeers` see [./src/rlpx/rlpx.ts](./src/rlpx/rlpx.ts).

### Events

Events emitted:

| Event        |          Description           |
| ------------ | :----------------------------: |
| peer:added   | Handshake with peer successful |
| peer:removed |     Disconnected from peer     |
| peer:error   |    Error connecting to peer    |
| listening    |     Forwarded from server      |
| close        |     Forwarded from server      |
| error        |     Forwarded from server      |

### Reference

- [RLPx: Cryptographic Network & Transport Protocol](https://github.com/ethereum/devp2p/blob/master/rlpx.md)
- [devp2p wire protocol](https://github.com/ethereum/wiki/wiki/%C3%90%CE%9EVp2p-Wire-Protocol)

## Ethereum Wire Protocol (ETH)

Upper layer protocol for exchanging Ethereum network data like block headers or transactions with a node, see [./src/protocol/eth/](./src/protocol/eth/).

### Usage

Send the initial status message with `sendStatus()`, then wait for the corresponding `status` message
to arrive to start the communication.

```ts
// ./examples/peer-communication.ts#L96-L106

eth.sendStatus({
  td: intToBytes(17179869184), // total difficulty in genesis block
  bestHash: hexToBytes('0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3'),
  genesisHash: hexToBytes('0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3'),
})

// check CHECK_BLOCK
let forkDrop: NodeJS.Timeout
let forkVerified = false
eth.events.once('status', () => {
  eth.sendMessage(devp2p.EthMessageCodes.GET_BLOCK_HEADERS, [
```

Wait for follow-up messages to arrive, send your responses.

```ts
// ./examples/peer-communication.ts#L116-L119

eth.events.on('message', async (code: any, payload: any) => {
  // We keep track of how many of each message type are received
  if (code in requests.msgTypes) {
    requests.msgTypes[code]++
```

See the `peer-communication.ts` example for a more detailed use case.

### API

#### `ETH` (extends `EventEmitter`)

Handles the different message types like `NEW_BLOCK_HASHES` or `GET_NODE_DATA` (see `MESSAGE_CODES`) for
a complete list.

##### `new ETH(privateKey, options)`

Normally not instantiated directly but created as a `SubProtocol` in the `Peer` object.

- `version` - The protocol version for communicating, e.g. `65`.
- `peer` - `Peer` object to communicate with.
- `send` - Wrapped `peer.sendMessage()` function where the communication is routed to.

#### `eth.sendStatus(status)`

Send initial status message.

- `status` - Status message to send, format `{td: TOTAL_DIFFICULTY_BUFFER, bestHash: BEST_HASH_BUFFER, genesisHash: GENESIS_HASH_BUFFER }`, `networkId` (respectively `chainId`) is taken from the `Common` instance

#### `eth.sendMessage(code, payload)`

Send initial status message.

- `code` - The message code, see `MESSAGE_CODES` for available message types.
- `payload` - Payload as a list, will be rlp-encoded.

### Events

Events emitted:

| Event   |     Description      |
| ------- | :------------------: |
| message |   Message received   |
| status  | Status info received |

### Reference

- [Ethereum wire protocol](https://github.com/ethereum/wiki/wiki/Ethereum-Wire-Protocol)

#### Hybrid CJS/ESM Builds

With the breaking releases from Summer 2023 we have started to ship our libraries with both CommonJS (`cjs` folder) and ESM builds (`esm` folder), see `package.json` for the detailed setup.

If you use an ES6-style `import` in your code files from the ESM build will be used:

```ts
import { EthereumJSClass } from '@ethereumjs/[PACKAGE_NAME]'
```

If you use Node.js specific `require`, the CJS build will be used:

```ts
const { EthereumJSClass } = require('@ethereumjs/[PACKAGE_NAME]')
```

Using ESM will give you additional advantages over CJS beyond browser usage like static code analysis / Tree Shaking which CJS can not provide.

### Events

Events emitted:

| Event   |     Description      |
| ------- | :------------------: |
| message |   Message received   |
| status  | Status info received |

### Reference

- [Light client protocol](https://ethereum.org/en/developers/docs/nodes-and-clients/#light-node)

## Debugging

### Introduction

This library uses the [debug](https://github.com/visionmedia/debug) debugging utility package.

Use the `DEBUG` environment variable to activate the logger output you are interested in, e.g.:

```shell
DEBUG=ethjs,devp2p:dpt:\*,devp2p:eth node -r tsx/register [YOUR_SCRIPT_TO_RUN.ts]
```

The following loggers are available:

| Logger                | Description                                                                              |
| --------------------- | ---------------------------------------------------------------------------------------- |
| `devp2p:dpt`          | General DPT peer discovery logging                                                       |
| `devp2p:dpt:server`   | DPT server communication (`ping`, `pong`, `findNeighbour`,... messages)                  |
| `devp2p:dpt:ban-list` | DPT ban list                                                                             |
| `devp2p:dns:dns`      | DNS discovery logging                                                                    |
| `devp2p:rlpx`         | General RLPx debug logger                                                                |
| `devp2p:rlpx:peer`    | RLPx peer message exchange logging (`PING`, `PONG`, `HELLO`, `DISCONNECT`,... messages)  |
| `devp2p:eth`          | ETH protocol message logging (`STATUS`, `GET_BLOCK_HEADER`, `TRANSACTIONS`,... messages) |

`ethjs` **must** be included in the `DEBUG` environment variables to enable **any** logs.
Additional log selections can be added with a comma separated list (no spaces). Logs with extensions can be enabled with a colon `:`, and `*` can be used to include all extensions.

`DEBUG=ethjs,devp2p:dns:dns,devp2p:dpt:*,devp2p:rlpx:peer npx vitest test/dns.spec.ts`

### Debug Verbosity

For more verbose output on logging (e.g. to output the entire msg payload) use the `verbose` logger
in addition:

DEBUG=ethjs,devp2p:dpt:\*,devp2p:eth,verbose node -r tsx/register [YOUR_SCRIPT_TO_RUN.ts]

Example logging output:

```shell
Add peer: 52.3.158.184:30303 Geth/v1.7.3-unstable-479aa61f/linux-amd64/go1.9 (eth63) (total: 2)
  devp2p:rlpx:peer Received body 52.169.42.101:30303 01c110 +133ms
  devp2p:rlpx:peer Message code: 1 - 0 = 1 +0ms
  devp2p:rlpx refill connections.. queue size: 0, open slots: 20 +1ms
  devp2p:rlpx 52.169.42.101:30303 disconnect, reason: 16 +1ms
Remove peer: 52.169.42.101:30303 (peer disconnect, reason code: 16) (total: 1)
```

### Per-Message Debugging

The following loggers from above support per-message debugging:

| Logger                        | Usage                                                                                                |
| ----------------------------- | ---------------------------------------------------------------------------------------------------- |
| `devp2p:eth`                  | e.g. `devp2p:eth:GET_BLOCK_HEADERS`                                                                  |
| `devp2p:les`                  | e.g. `devp2p:les:GET_PROOFS`                                                                         |
| `devp2p:rlpx:peer`            | e.g. `devp2p:rlpx:peer:HELLO`                                                                        |
| `devp2p:rlpx:peer:DISCONNECT` | e.g. `devp2p:rlpx:peer:DISCONNECT:TOO_MANY_PEERS` (special logger to filter on `DISCONNECT` reasons) |
| `devp2p:dpt:server`           | e.g. `devp2p:dpt:server:findneighbours`                                                              |

Available messages can be added to the logger base name to filter on a per message basis. See the following example to filter
on two message names along `ETH` protocol debugging:

```shell
DEBUG=ethjs,devp2p:eth:GET_BLOCK_HEADERS,devp2p:eth:BLOCK_HEADERS -r tsx/register [YOUR_SCRIPT_TO_RUN.ts]
```

Example logging output:

```shell
devp2p:eth:GET_BLOCK_HEADERS Received GET_BLOCK_HEADERS message from 207.154.201.177:30303: d188659b37d8e321bc52c782198181c08080 +50ms
devp2p:eth:GET_BLOCK_HEADERS Send GET_BLOCK_HEADERS message to 159.65.72.121:30303: c81bc682ded8328080 +431ms
devp2p:eth:BLOCK_HEADERS Received BLOCK_HEADERS message from 159.65.72.121:30303: c21bc0 +417ms
devp2p:eth:GET_BLOCK_HEADERS Send GET_BLOCK_HEADERS message to 162.55.98.224:30303: c81dc682df0a328080 +339ms
devp2p:eth:BLOCK_HEADERS Received BLOCK_HEADERS message from 162.55.98.224:30303: f968dd1df968d9f90217a0af80dab03492dfc689936dc9ff272ed3743da1... +72ms
```

### Per-Peer Debugging

There are the following ways to limit debug output to a certain peer:

#### Logging per IP

Log output can be limited to one or several certain IPs. This can be useful to follow on the message exchange with a certain remote peer (e.g. a bootstrap peer):

```shell
DEBUG=ethjs,devp2p:3.209.45.79 -r tsx/register [YOUR_SCRIPT_TO_RUN.ts]
```

#### First Connected

Logging can be limited to the peer with which the first successful subprotocol (e.g. `ETH`) connection could be established:

```shell
DEBUG=ethjs,devp2p:FIRST_PEER -r tsx/register [YOUR_SCRIPT_TO_RUN.ts]
```

This logger can be used in various practical scenarios if you want to concentrate on the message exchange with just one peer.

## Developer

### Diagram Updates

To update the structure diagram files in the root folder open the `devp2p.drawio` file in [draw.io](https://draw.io/), make your changes, and open a PR with the updated files. Export `svg` and `png` with `border` `width=20` and `transparency=false`. For `png` go to "Advanced" and select `300 DPI`.

## General References

### Other Implementations

The following is a list of major implementations of the `devp2p` stack in other languages:

- Python: [pydevp2p](https://github.com/ethereum/pydevp2p)
- Go: [Go Ethereum](https://github.com/ethereum/go-ethereum/tree/master/p2p)
- Elixir: [Exthereum](https://github.com/exthereum/exth_crypto) <!-- cspell:disable-line --->

### Links

- [Blog article series](https://ocalog.com/post/10/) on implementing Ethereum protocol stack

## EthereumJS

See our organizational [documentation](https://ethereumjs.readthedocs.io) for an introduction to `EthereumJS` as well as information on current standards and best practices. If you want to join for work or carry out improvements on the libraries, please review our [contribution guidelines](https://ethereumjs.readthedocs.io/en/latest/contributing.html) first.

## License

[MIT](https://opensource.org/licenses/MIT)

[discord-badge]: https://img.shields.io/static/v1?logo=discord&label=discord&message=Join&color=blue
[discord-link]: https://discord.gg/TNwARpR
[devp2p-npm-badge]: https://img.shields.io/npm/v/ethereumjs-devp2p.svg
[devp2p-npm-link]: https://www.npmjs.org/package/ethereumjs-devp2p
[devp2p-issues-badge]: https://img.shields.io/github/issues/ethereumjs/ethereumjs-monorepo/package:%20devp2p?label=issues
[devp2p-issues-link]: https://github.com/ethereumjs/ethereumjs-monorepo/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+devp2p"
[devp2p-actions-badge]: https://github.com/ethereumjs/ethereumjs-monorepo/workflows/Devp2p/badge.svg
[devp2p-actions-link]: https://github.com/ethereumjs/ethereumjs-monorepo/actions?query=workflow%3A%22Devp2p%22
[devp2p-coverage-badge]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/branch/master/graph/badge.svg?flag=devp2p
[devp2p-coverage-link]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/tree/master/packages/devp2p
