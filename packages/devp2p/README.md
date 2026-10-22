# @ethereumjs/devp2p `v10`

[![NPM Status][devp2p-npm-badge]][devp2p-npm-link]
[![GitHub Issues][devp2p-issues-badge]][devp2p-issues-link]
[![Actions Status][devp2p-actions-badge]][devp2p-actions-link]
[![Coverage Status][devp2p-coverage-badge]][devp2p-coverage-link]
[![Discord][discord-badge]][discord-link]

| Ethereum **devp2p** stack in TypeScript — discovery (DPT, DNS), **RLPx** transport, and **ETH** / **SNAP** wire subprotocols. |
| --- |

- 🔎 **DPT** node discovery (v4 UDP) and optional **EIP-1459** DNS ENR trees
- 🔐 **RLPx** encrypted sessions (ECIES handshake, capability negotiation)
- 📡 **ETH** wire (versions 62–68) and **SNAP** sync subprotocol
- 🧪 **`devp2p` CLI** — local lab, long-lived sessions, scripted wire verbs
- 📋 **JSON scenarios** for in-process regression tests (replaces legacy simulators)
- 🏄🏾‍♂️ Pure JS default · **Node.js ≥ 22**

Runnable examples: [`examples/`](./examples/). Generated API: [`docs/`](./docs).

## Table of Contents

- [Installation](#installation)
- [Choose a path](#choose-a-path)
- [CLI and lab](#cli-and-lab)
- [Library stack](#library-stack)
- [Examples](#examples)
- [JSON scenarios](#json-scenarios)
- [Debugging](#debugging)
- [API reference](#api-reference)
- [Developer](#developer)
- [Protocol references](#protocol-references)
- [EthereumJS](#ethereumjs)
- [License](#license)

## Installation

```shell
npm install @ethereumjs/devp2p
```

From this package directory (after `npm run build`) or any project that depends on `@ethereumjs/devp2p`, run the CLI with **`npx devp2p`** (see [CLI and lab](#cli-and-lab)).

Requires **`@ethereumjs/common`** on the same major version for chain config, bootstrap nodes, and fork IDs on ETH connections.

## Choose a path

| Goal | Start here |
| --- | --- |
| Step through discovery → handshake → ETH messages without a custom app | [CLI and lab](#cli-and-lab) (`init`, `node run`, `peer` / `eth` / `snap` verbs) |
| Minimal TypeScript that compiles in CI | [Examples](#examples) → `npm run examples` |
| Talk to mainnet bootnodes or live peers | [`examples/manual/`](./examples/manual/) (network access; use `DEBUG=ethjs,devp2p:*`) |
| Embed devp2p in your own node or tool | [Library stack](#library-stack) + [API reference](#api-reference) |
| Assert wire behaviour in tests | [JSON scenarios](#json-scenarios) |

## CLI and lab

The CLI is built for **one long-lived node process** and many short control commands. **`node run`** keeps a single DPT + RLPx stack (and negotiated subprotocols) until **`node stop`**. Every other command opens the node’s control socket, runs one request, and exits — the peer and handshake stay in the daemon.

**Lab layout** (default **`./lab`** under the current working directory; override with **`--dir`** / **`-l`**):

| Path | Purpose |
| --- | --- |
| `lab/network.json` | Chain / hardfork for the lab |
| `lab/<name>/node.json` | Listen ports, capabilities (`eth68`, `snap`, …) |
| `lab/<name>/key.json` | Node private key |
| `lab/<name>/enode.txt` | Enode URL |
| `lab/<name>/control.sock` | Unix socket while `node run` is active |
| `lab/.node` | Default node name (`devp2p use`) |

**Default node** when **`--node`** / **`-n`** is omitted: **`DEVP2P_NODE`** → **`lab/.node`** (from **`devp2p use <name>`** or updated when **`node run`** starts) → only node in the lab → only running daemon. Override anytime with **`--node bob`**.

```bash
npx devp2p --help
npx devp2p init --nodes alice,bob
npx devp2p use alice    # once per multi-node lab (or export DEVP2P_NODE=alice)
```

### Session verbs

| Area | Commands |
| --- | --- |
| Peers | `peer add`, `peer list`, `peer disconnect` |
| Discovery | `dpt ping` (session DPT; prefer over ephemeral `discovery-v4 ping`) |
| Transport | `rlpx ping`, `wait --event rlpx.PONG` |
| ETH | `eth send`, `eth wait` (builders + `--json` / `--rlp`) |
| SNAP | `snap send`, `snap wait` |
| Any event | `wait --event peer.added \| eth.NAME \| snap.NAME \| rlpx.PONG` |
| REPL | `attach` (same verbs as one-shot CLI) |

NDJSON events: `npx devp2p node run --events ndjson`. Run **`npx devp2p --help`** for flags.

### Two local nodes (STATUS + headers)

Terminal A — start Alice and watch NDJSON:

```bash
npx devp2p node run --events ndjson
```

Terminal B — dial Bob, exchange STATUS, request a header:

```bash
# Ports: lab/bob/node.json (udpPort / tcpPort)

npx devp2p peer add 127.0.0.1 <bob-udp> --tcp <bob-tcp>
npx devp2p wait --event peer.added
npx devp2p eth send --name STATUS --json '{"td":"0x040000000000","bestHash":"0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3","genesisHash":"0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3"}'
npx devp2p eth send --name GET_BLOCK_HEADERS --json '{"requestId":"0x01","blockHash":"0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3","max":1,"skip":0,"reverse":false}'
npx devp2p eth wait --name BLOCK_HEADERS --timeout-ms 30000
```

Both sides may need to send STATUS before headers flow. **`attach`** accepts the same verbs (`eth send GET_BLOCK_HEADERS blockHash=0x… max=1`, `wait eth.BLOCK_HEADERS`, …).

### Toward a public peer

With a node still running:

```bash
npx devp2p dpt ping <host> <udpPort>
npx devp2p peer add <host> <udpPort> --tcp <tcpPort>
npx devp2p wait --event peer.added
```

Then repeat the `eth send` / `eth wait` sequence. Remotes may disconnect, ignore requests, or time out — read NDJSON on the daemon terminal.

## Library stack

High-level layout ([diagram](./diagram/devp2p.svg)):

```text
  Your app                    @ethereumjs/common (chain, bootnodes, forkId)
      │                                    │
      ▼                                    ▼
    DPT ──peer table──► RLPx ──capabilities──► ETH / SNAP (per Peer)
   UDP v4              TCP + ECIES              RLP + optional Snappy
   optional DNS ENR
```

`DPT`, `RLPx`, and each negotiated subprotocol expose an **`events`** emitter ([EventEmitter3](https://github.com/primus/eventemitter3)). Register listeners before bootstrap or dial.

```ts
import type { ETH } from '@ethereumjs/devp2p'
import { EthMessageCodes } from '@ethereumjs/devp2p'
import { intToBytes, hexToBytes } from '@ethereumjs/util'

// Discovery peer table
dpt.events.on('peer:added', (peer) => {
  /* candidate enode */
})
dpt.events.on('error', (err) => {
  console.error(err)
})

// Encrypted sessions (typically share one DPT instance)
rlpx.events.on('peer:added', (peer) => {
  const eth = peer.getProtocols()[0] as ETH

  eth.sendStatus({
    td: intToBytes(17179869184),
    bestHash: hexToBytes('0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3'),
    genesisHash: hexToBytes('0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3'),
  })

  eth.events.once('status', () => {
    eth.sendMessage(EthMessageCodes.GET_BLOCK_HEADERS, [
      Uint8Array.from([1]),
      [intToBytes(1), Uint8Array.from([1]), Uint8Array.from([]), Uint8Array.from([])],
    ])
  })

  eth.events.on('message', (code, payload) => {
    /* BLOCK_HEADERS, NEW_BLOCK_HASHES, … */
  })
})
```

Construct `dpt` and `rlpx` with a secp256k1 private key, pass **`common`** and **`capabilities`** (e.g. `[ETH.eth68, SNAP.snap]` from `@ethereumjs/devp2p`) into `RLPx`, and optionally attach the same **`dpt`** instance so discovered peers feed RLPx dials.

### Layer guide

| Layer | Module | Typical use |
| --- | --- | --- |
| Discovery | `DPT` | Kademlia peer table, UDP `ping` / `findNeighbours`, ban list |
| DNS | `DNS` / `ENR` | EIP-1459 ENR tree lookup (`DPT` options `shouldGetDnsPeers`, …) |
| Transport | `RLPx`, `Peer` | Handshake, multiplex subprotocols, base `ping` / `pong` |
| Wire | `ETH`, `SNAP` | `sendStatus`, `sendMessage`, `EthMessageCodes`, `SnapMessageCodes` |

**Discovery** — see [`examples/dpt.ts`](./examples/dpt.ts) (CI) and [`examples/manual/dptDiscovery.ts`](./examples/manual/dptDiscovery.ts) (bootstrap loop). Bootstrap from `@ethereumjs/common`:

```ts
import { Common, Mainnet } from '@ethereumjs/common'

const bootnodes = new Common({ chain: Mainnet }).bootstrapNodes()
for (const node of bootnodes) {
  dpt
    .bootstrap({ address: node.ip, udpPort: node.port, tcpPort: node.port })
    .catch((err) => console.error(`DPT bootstrap error: ${err}`))
}
```

**Transport** — see [`examples/rlpx.ts`](./examples/rlpx.ts) for `RLPx` + `Common` + ETH capabilities.

**ETH / SNAP** — after RLPx negotiates a subprotocol, call `eth.sendStatus()` and wait for `status` before other ETH messages. Full mainnet-style flow: [`examples/manual/peerCommunication.ts`](./examples/manual/peerCommunication.ts).

### Events (summary)

| Emitter | Events |
| --- | --- |
| `dpt.events` | `peer:added`, `peer:removed`, `peer:new`, `listening`, `close`, `error` |
| `rlpx.events` | `peer:added`, `peer:removed`, `peer:error`, `listening`, `close`, `error` |
| `eth.events` | `status`, `message` |
| `peer.events` | `error`, `ping`, `pong` (base protocol) |

## Examples

| Example | Role |
| --- | --- |
| [`dpt.ts`](./examples/dpt.ts) | Minimal DPT setup and discovery events (CI) |
| [`rlpx.ts`](./examples/rlpx.ts) | RLPx with `Common` and ETH capabilities (CI) |
| [`manual/dptDiscovery.ts`](./examples/manual/dptDiscovery.ts) | Bootstrap against mainnet bootnodes |
| [`manual/peerCommunication.ts`](./examples/manual/peerCommunication.ts) | Full DPT + RLPx + ETH exchange against live peers |

```shell
npm run examples
```

Manual examples need network access:

```shell
DEBUG=ethjs,devp2p:* npx tsx ./examples/manual/peerCommunication.ts
```

## JSON scenarios

[`scenarios/`](./scenarios/) holds declarative specs (DPT, RLPx, ETH, SNAP) executed in-process by the lab **`ScenarioRunner`**. They replace the old dedicated simulator test files.

```shell
npm run test:scenarios
npx devp2p scenario list
npx devp2p scenario run scenarios/eth-status-success.json
```

## Debugging

Uses the [`debug`](https://github.com/visionmedia/debug) package. Include **`ethjs`** in **`DEBUG`** or no devp2p loggers run.

```shell
DEBUG=ethjs,devp2p:dpt:*,devp2p:rlpx:peer,devp2p:eth npx tsx ./examples/manual/peerCommunication.ts
```

| Logger | Focus |
| --- | --- |
| `devp2p:dpt` / `devp2p:dpt:server` | Discovery UDP |
| `devp2p:dns:dns` | DNS ENR discovery |
| `devp2p:rlpx` / `devp2p:rlpx:peer` | RLPx framing and HELLO / PING / DISCONNECT |
| `devp2p:eth` | ETH message names (e.g. `devp2p:eth:GET_BLOCK_HEADERS`) |
| `devp2p:FIRST_PEER` | Limit traffic to the first successful subprotocol peer |
| IP filter | e.g. `devp2p:3.209.45.79` |

Add **`verbose`** for full payload dumps. DNS integration tests: set **`DEVP2P_DNS_INTEGRATION=1`**.

## API reference

Full signatures and options: generated **[TypeDoc](./docs)**.

Main exports from `@ethereumjs/devp2p`:

| Export | Role |
| --- | --- |
| `DPT` | Discovery and peer table |
| `RLPx`, `Peer` | Transport |
| `ETH`, `EthMessageCodes` | Ethereum wire subprotocol |
| `SNAP`, `SnapMessageCodes` | Snap sync subprotocol |
| `DNS`, `ENR` | DNS discovery helpers |
| `genPrivateKey`, `pk2id`, `id2pk`, `devp2pDebug` | Keys and debug namespace |

Implementation entrypoints: [`src/dpt/`](./src/dpt/), [`src/rlpx/`](./src/rlpx/), [`src/protocol/`](./src/protocol/), [`src/dns/`](./src/dns/). Lab-only code under [`src/lab/`](./src/lab/) powers the CLI and scenarios (not required for library consumers).

## Developer

**CJS and ESM** — `dist/cjs` and `dist/esm`; see `package.json` `exports`.

```ts
import { DPT, RLPx, ETH } from '@ethereumjs/devp2p'
```

Local **`/lab/`** (CLI data) is gitignored; do not confuse with **`src/lab/`** sources.

**Diagram** — edit `devp2p.drawio`, export `diagram/devp2p.svg` / `.png` (border 20px, 300 DPI for PNG).

**Monorepo** — [`DEVELOPER.md`](../../DEVELOPER.md), package workflow **Devp2p** on CI.

## Protocol references

- [Ethereum networking layer (discovery overview)](https://ethereum.org/en/developers/docs/networking-layer/)
- [devp2p RLPx](https://github.com/ethereum/devp2p/blob/master/rlpx.md)
- [Ethereum wire protocol (ETH)](https://github.com/ethereum/devp2p/blob/master/caps/eth.md)
- [Snap protocol](https://github.com/ethereum/devp2p/blob/master/caps/snap.md)
- [EIP-1459 DNS discovery](https://eips.ethereum.org/EIPS/eip-1459)

Other implementations: [go-ethereum p2p](https://github.com/ethereum/go-ethereum/tree/master/p2p), [pydevp2p](https://github.com/ethereum/pydevp2p) (historical).

## EthereumJS

The `EthereumJS` GitHub organization and its repositories are managed by members of the former Ethereum Foundation JavaScript team and the broader Ethereum community. If you want to join for work or carry out improvements on the libraries see the [developer docs](../../DEVELOPER.md) for an overview of current standards and tools and review our [code of conduct](../../CODE_OF_CONDUCT.md).

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
