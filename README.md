# ethereumjs-devp2p

[![NPM Package](https://img.shields.io/npm/v/ethereumjs-devp2p.svg?style=flat-square)](https://www.npmjs.org/package/ethereumjs-devp2p)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

**devp2p Distributed Peer Table**

- Maintain/manage a list of peers, see [./src/dpt/](./src/dpt/)

**RLPx transport protocol**

- Connect to a peer, see [./src/rlpx/](./src/rlpx/)

**Ethereum wire protocol**

- Talk to peers and send/receive messages, see [./src/eth/](./src/eth/)

Library is based on [ethereumjs/node-devp2p](https://github.com/ethereumjs/node-devp2p) (outdated).

## Usage

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

Add some bootstrap nodes (or some custom nodes with ``dpt.addPeer``):

```
dpt.bootstrap(bootnode).catch((err) => console.error('Something went wrong!'))
```

Then you can react on different events triggered by the ``DPT`` which acs as an
``EventEmitter``, e.g.:

```
dpt.on('peer:added', (peer) => {
  // Do something...
})
dpt.on('peer:removed', (peer) => {
  // Do something...
})
```

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

## Examples

Basic example to connect to some bootstrap nodes and get basic peer info:

  - [simple](examples/simple.js)

Communicate with peers to read new transaction and block information:

  - [peer-communication](examples/peer-communication.js)

Run an example with:

```
node -r babel-register ./examples/peer-communication.js
```

## Tests

There are unit tests in the ``test/`` directory which can be run with:

```
npm run test
```

## Reference

- [RLPx Node Discovery Protocol](https://github.com/ethereum/go-ethereum/wiki/RLPx-----Node-Discovery-Protocol) (outdated)
- [Node discovery protocol](https://github.com/ethereum/wiki/wiki/Node-discovery-protocol)
- [RLPx: Cryptographic Network & Transport Protocol](https://github.com/ethereum/devp2p/blob/master/rlpx.md)
- [devp2p wire protocol](https://github.com/ethereum/wiki/wiki/%C3%90%CE%9EVp2p-Wire-Protocol)
- [Ethereum wire protocol](https://github.com/ethereum/wiki/wiki/Ethereum-Wire-Protocol)

## License

MIT
