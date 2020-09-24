[ethereumjs-client](../README.md) › ["net/server/libp2pserver"](_net_server_libp2pserver_.md)

# Module: "net/server/libp2pserver"

## Index

### Classes

* [Libp2pServer](../classes/_net_server_libp2pserver_.libp2pserver.md)

### Variables

* [Libp2pNode](_net_server_libp2pserver_.md#const-libp2pnode)
* [Libp2pPeer](_net_server_libp2pserver_.md#const-libp2ppeer)
* [PeerId](_net_server_libp2pserver_.md#const-peerid)
* [PeerInfo](_net_server_libp2pserver_.md#const-peerinfo)
* [Server](_net_server_libp2pserver_.md#const-server)

### Object literals

* [defaultOptions](_net_server_libp2pserver_.md#const-defaultoptions)

## Variables

### `Const` Libp2pNode

• **Libp2pNode**: *[Libp2pNode](../classes/_net_peer_libp2pnode_.libp2pnode.md)* = require('../peer/libp2pnode')

*Defined in [lib/net/server/libp2pserver.js:6](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/libp2pserver.js#L6)*

___

### `Const` Libp2pPeer

• **Libp2pPeer**: *[Libp2pPeer](../classes/_net_peer_libp2ppeer_.libp2ppeer.md)* = require('../peer/libp2ppeer')

*Defined in [lib/net/server/libp2pserver.js:7](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/libp2pserver.js#L7)*

___

### `Const` PeerId

• **PeerId**: *any* = require('peer-id')

*Defined in [lib/net/server/libp2pserver.js:4](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/libp2pserver.js#L4)*

___

### `Const` PeerInfo

• **PeerInfo**: *any* = require('peer-info')

*Defined in [lib/net/server/libp2pserver.js:5](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/libp2pserver.js#L5)*

___

### `Const` Server

• **Server**: *[Server](../classes/_net_server_server_.server.md)* = require('./server')

*Defined in [lib/net/server/libp2pserver.js:3](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/libp2pserver.js#L3)*

## Object literals

### `Const` defaultOptions

### ▪ **defaultOptions**: *object*

*Defined in [lib/net/server/libp2pserver.js:9](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/libp2pserver.js#L9)*

###  bootnodes

• **bootnodes**: *never[]* = []

*Defined in [lib/net/server/libp2pserver.js:12](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/libp2pserver.js#L12)*

###  key

• **key**: *null* = null

*Defined in [lib/net/server/libp2pserver.js:11](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/libp2pserver.js#L11)*

###  multiaddrs

• **multiaddrs**: *string[]* = [ '/ip4/127.0.0.1/tcp/50580/ws' ]

*Defined in [lib/net/server/libp2pserver.js:10](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/libp2pserver.js#L10)*
