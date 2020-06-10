[ethereumjs-client](../README.md) › ["net/server/rlpxserver"](_net_server_rlpxserver_.md)

# Module: "net/server/rlpxserver"

## Index

### Classes

* [RlpxServer](../classes/_net_server_rlpxserver_.rlpxserver.md)

### Variables

* [RlpxPeer](_net_server_rlpxserver_.md#const-rlpxpeer)
* [Server](_net_server_rlpxserver_.md#const-server)
* [devp2p](_net_server_rlpxserver_.md#const-devp2p)
* [ignoredErrors](_net_server_rlpxserver_.md#const-ignorederrors)
* [parse](_net_server_rlpxserver_.md#parse)
* [randomBytes](_net_server_rlpxserver_.md#randombytes)

### Object literals

* [defaultOptions](_net_server_rlpxserver_.md#const-defaultoptions)

## Variables

### `Const` RlpxPeer

• **RlpxPeer**: *[RlpxPeer](../classes/_net_peer_rlpxpeer_.rlpxpeer.md)* = require('../peer/rlpxpeer')

*Defined in [lib/net/server/rlpxserver.js:6](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/rlpxserver.js#L6)*

___

### `Const` Server

• **Server**: *[Server](../classes/_net_server_server_.server.md)* = require('./server')

*Defined in [lib/net/server/rlpxserver.js:3](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/rlpxserver.js#L3)*

___

### `Const` devp2p

• **devp2p**: *any* = require('ethereumjs-devp2p')

*Defined in [lib/net/server/rlpxserver.js:5](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/rlpxserver.js#L5)*

___

### `Const` ignoredErrors

• **ignoredErrors**: *RegExp‹›* = new RegExp([
  'EPIPE',
  'ECONNRESET',
  'ETIMEDOUT',
  'NetworkId mismatch',
  'Timeout error: ping',
  'Genesis block mismatch',
  'Handshake timed out',
  'Invalid address buffer',
  'Invalid MAC',
  'Invalid timestamp buffer',
  'Hash verification failed'
].join('|'))

*Defined in [lib/net/server/rlpxserver.js:16](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/rlpxserver.js#L16)*

___

###  parse

• **parse**: *["util/parse"](_util_parse_.md)*

*Defined in [lib/net/server/rlpxserver.js:7](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/rlpxserver.js#L7)*

___

###  randomBytes

• **randomBytes**: *randomBytes*

*Defined in [lib/net/server/rlpxserver.js:4](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/rlpxserver.js#L4)*

## Object literals

### `Const` defaultOptions

### ▪ **defaultOptions**: *object*

*Defined in [lib/net/server/rlpxserver.js:9](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/rlpxserver.js#L9)*

###  bootnodes

• **bootnodes**: *never[]* = []

*Defined in [lib/net/server/rlpxserver.js:13](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/rlpxserver.js#L13)*

###  clientFilter

• **clientFilter**: *string[]* = ['go1.5', 'go1.6', 'go1.7', 'quorum', 'pirl', 'ubiq', 'gmc', 'gwhale', 'prichain']

*Defined in [lib/net/server/rlpxserver.js:12](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/rlpxserver.js#L12)*

###  key

• **key**: *Buffer‹›* = randomBytes(32)

*Defined in [lib/net/server/rlpxserver.js:11](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/rlpxserver.js#L11)*

###  port

• **port**: *number* = 30303

*Defined in [lib/net/server/rlpxserver.js:10](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/rlpxserver.js#L10)*
