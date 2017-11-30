# ethereumjs-devp2p

[![NPM Package](https://img.shields.io/npm/v/ethereumjs-devp2p.svg?style=flat-square)](https://www.npmjs.org/package/ethereumjs-devp2p)
[![Build Status](https://travis-ci.org/ethereumjs/ethereumjs-devp2p.svg?branch=master)](https://travis-ci.org/ethereumjs/ethereumjs-devp2p)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

This library bundles different components for lower-level peer-to-peer connection and message exchange:

- Distributed Peer Table (DPT)
- RLPx Transport Protocol
- Ethereum Wire Protocol (ETH)

The library is based on [ethereumjs/node-devp2p](https://github.com/ethereumjs/node-devp2p) as well
as other sub-libraries (``node-*`` named) (all outdated).

## Run/Build

This library has to be compiled with babel to a ``Node 6`` friendly source format.
For triggering a (first) build to create the ``lib/`` directory run:

```
npm run build
```

You can also use babel just-in-time compilation to run a script:

```
node -r babel-register [YOUR_SCRIPT_TO_RUN.js]
```

## Usage/Examples

All components of this library are implemented as Node ``EventEmitter`` objects
and make heavy use of the Node.js network stack.

You can react on events from the network like this:

```
dpt.on('peer:added', (peer) => {
  // Do something...
})
```

Basic example to connect to some bootstrap nodes and get basic peer info:

  - [simple](examples/simple.js)

Communicate with peers to read new transaction and block information:

  - [peer-communication](examples/peer-communication.js)

Run an example with:

```
node -r babel-register ./examples/peer-communication.js
```

## Distributed Peer Table (DPT)

Maintain/manage a list of peers, see [./src/dpt/](./src/dpt/), also 
includes node discovery ([./src/dpt/server.js](./src/dpt/server.js))

### Usage

Create your peer table:

```
const dpt = new DPT(Buffer.from(PRIVATE_KEY, 'hex'), {
  endpoint: {
    address: '0.0.0.0',
    udpPort: null,
    tcpPort: null
  }
})
```

Add some bootstrap nodes (or some custom nodes with ``dpt.addPeer()``):

```
dpt.bootstrap(bootnode).catch((err) => console.error('Something went wrong!'))
```

Events emitted:

| Event         | Description                              |
| ------------- |:----------------------------------------:|
| peer:added    | Peer added to DHT bucket                 |
| peer:removed  | Peer removed from DHT bucket             |
| peer:new      | New peer added                           |
| listening     | Forwarded from server                    |
| close         | Forwarded from server                    |
| error         | Forwarded from server                    |

### Reference

- [Node discovery protocol](https://github.com/ethereum/wiki/wiki/Node-discovery-protocol)
- [RLPx - Node Discovery Protocol](https://github.com/ethereum/devp2p/blob/master/rlpx.md#node-discovery)
- [Kademlia Peer Selection](https://github.com/ethereum/wiki/wiki/Kademlia-Peer-Selection)

## RLPx Transport Protocol

Connect to a peer, organize the communication, see [./src/rlpx/](./src/rlpx/)

### Usage

Create your ``RLPx`` object, e.g.:

```
const rlpx = new devp2p.RLPx(PRIVATE_KEY, {
  dpt: dpt,
  maxPeers: 25,
  capabilities: [
    devp2p.ETH.eth63,
    devp2p.ETH.eth62
  ],
  listenPort: null
})
```

Events emitted:

| Event         | Description                              |
| ------------- |:----------------------------------------:|
| peer:added    | Handshake with peer successful           |
| peer:removed  | Disconnected from peer                   |
| peer:error    | Error connecting to peer                 |
| listening     | Forwarded from server                    |
| close         | Forwarded from server                    |
| error         | Forwarded from server                    |


### Reference

- [RLPx: Cryptographic Network & Transport Protocol](https://github.com/ethereum/devp2p/blob/master/rlpx.md)
- [devp2p wire protocol](https://github.com/ethereum/wiki/wiki/%C3%90%CE%9EVp2p-Wire-Protocol)

## Ethereum Wire Protocol (ETH)

Talk to peers and send/receive messages, see [./src/eth/](./src/eth/)

### Usage

Send messages with ``sendMessage()``, send status info with ``sendStatus()``.

Events emitted:

| Event         | Description                              |
| ------------- |:----------------------------------------:|
| message       | Message received                         |
| status        | Status info received                     |

### Reference

- [Ethereum wire protocol](https://github.com/ethereum/wiki/wiki/Ethereum-Wire-Protocol)


## Tests

There are unit tests in the ``test/`` directory which can be run with:

```
npm run test
```

## Debugging

This library uses [debug](https://github.com/visionmedia/debug) debugging utility package.

For the debugging output to show up, set the ``DEBUG`` environment variable (e.g. in Linux/Mac OS: 
``export DEBUG=*,-babel``).

You should now see debug output like to following when running one of the examples above (the indented lines):

```
Add peer: 52.3.158.184:30303 Geth/v1.7.3-unstable-479aa61f/linux-amd64/go1.9 (eth63) (total: 2)
  devp2p:rlpx:peer Received body 52.169.42.101:30303 01c110 +133ms
  devp2p:rlpx:peer Message code: 1 - 0 = 1 +0ms
  devp2p:rlpx refill connections.. queue size: 0, open slots: 20 +1ms
  devp2p:rlpx 52.169.42.101:30303 disconnect, reason: 16 +1ms
Remove peer: 52.169.42.101:30303 (peer disconnect, reason code: 16) (total: 1)
```

## General References

### Other Implementations

The following is a list of major implementations of the ``devp2p`` stack in other languages:

- [pydevp2p](https://github.com/ethereum/pydevp2p) (Python)
- [Go Ethereum](https://github.com/ethereum/go-ethereum/tree/master/p2p) (Go)
- [Exthereum](https://github.com/exthereum/exth_crypto) (Elixir)

### Links

- [Blog article series](https://ocalog.com/post/10/)  on implementing Ethereum protocol stack

## License

MIT
