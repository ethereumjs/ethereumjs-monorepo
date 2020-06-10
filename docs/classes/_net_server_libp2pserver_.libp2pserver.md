[ethereumjs-client](../README.md) › ["net/server/libp2pserver"](../modules/_net_server_libp2pserver_.md) › [Libp2pServer](_net_server_libp2pserver_.libp2pserver.md)

# Class: Libp2pServer

Libp2p server

**`emits`** connected

**`emits`** disconnected

**`emits`** error

**`memberof`** module:net/server

## Hierarchy

  ↳ [Server](_net_server_server_.server.md)

  ↳ **Libp2pServer**

## Index

### Constructors

* [constructor](_net_server_libp2pserver_.libp2pserver.md#constructor)

### Accessors

* [name](_net_server_libp2pserver_.libp2pserver.md#name)
* [running](_net_server_libp2pserver_.libp2pserver.md#running)

### Methods

* [addProtocols](_net_server_libp2pserver_.libp2pserver.md#addprotocols)
* [ban](_net_server_libp2pserver_.libp2pserver.md#ban)
* [createPeer](_net_server_libp2pserver_.libp2pserver.md#createpeer)
* [createPeerInfo](_net_server_libp2pserver_.libp2pserver.md#createpeerinfo)
* [getPeerInfo](_net_server_libp2pserver_.libp2pserver.md#getpeerinfo)
* [init](_net_server_libp2pserver_.libp2pserver.md#init)
* [isBanned](_net_server_libp2pserver_.libp2pserver.md#isbanned)
* [start](_net_server_libp2pserver_.libp2pserver.md#start)
* [stop](_net_server_libp2pserver_.libp2pserver.md#stop)

## Constructors

###  constructor

\+ **new Libp2pServer**(`options`: object): *[Libp2pServer](_net_server_libp2pserver_.libp2pserver.md)*

*Overrides [Server](_net_server_server_.server.md).[constructor](_net_server_server_.server.md#constructor)*

*Defined in [lib/net/server/libp2pserver.js:22](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/libp2pserver.js#L22)*

Create new DevP2P/RLPx server

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`options` | object | constructor parameters |

**Returns:** *[Libp2pServer](_net_server_libp2pserver_.libp2pserver.md)*

## Accessors

###  name

• **get name**(): *string*

*Overrides [Server](_net_server_server_.server.md).[name](_net_server_server_.server.md#name)*

*Defined in [lib/net/server/libp2pserver.js:51](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/libp2pserver.js#L51)*

Server name

**`type`** {string}

**Returns:** *string*

___

###  running

• **get running**(): *boolean*

*Inherited from [Server](_net_server_server_.server.md).[running](_net_server_server_.server.md#running)*

*Defined in [lib/net/server/server.js:36](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/server.js#L36)*

Check if server is running

**Returns:** *boolean*

true if server is running

## Methods

###  addProtocols

▸ **addProtocols**(`protocols`: any[]): *undefined | false*

*Inherited from [Server](_net_server_server_.server.md).[addProtocols](_net_server_server_.server.md#addprotocols)*

*Defined in [lib/net/server/server.js:67](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/server.js#L67)*

Specify which protocols the server must support

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`protocols` | any[] | protocol classes  |

**Returns:** *undefined | false*

___

###  ban

▸ **ban**(`peerId`: string, `maxAge`: undefined | number): *Promise‹any›*

*Defined in [lib/net/server/libp2pserver.js:152](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/libp2pserver.js#L152)*

Ban peer for a specified time

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`peerId` | string | - | id of peer |
`maxAge` | undefined &#124; number | 60000 | - |

**Returns:** *Promise‹any›*

___

###  createPeer

▸ **createPeer**(`peerInfo`: any): *[Libp2pPeer](_net_peer_libp2ppeer_.libp2ppeer.md)‹›*

*Defined in [lib/net/server/libp2pserver.js:214](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/libp2pserver.js#L214)*

**Parameters:**

Name | Type |
------ | ------ |
`peerInfo` | any |

**Returns:** *[Libp2pPeer](_net_peer_libp2ppeer_.libp2ppeer.md)‹›*

___

###  createPeerInfo

▸ **createPeerInfo**(): *Promise‹any›*

*Defined in [lib/net/server/libp2pserver.js:183](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/libp2pserver.js#L183)*

**Returns:** *Promise‹any›*

___

###  getPeerInfo

▸ **getPeerInfo**(`connection`: any): *Promise‹any›*

*Defined in [lib/net/server/libp2pserver.js:205](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/libp2pserver.js#L205)*

**Parameters:**

Name | Type |
------ | ------ |
`connection` | any |

**Returns:** *Promise‹any›*

___

###  init

▸ **init**(): *void*

*Defined in [lib/net/server/libp2pserver.js:55](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/libp2pserver.js#L55)*

**Returns:** *void*

___

###  isBanned

▸ **isBanned**(`peerId`: string): *boolean*

*Defined in [lib/net/server/libp2pserver.js:164](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/libp2pserver.js#L164)*

Check if peer is currently banned

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`peerId` | string | id of peer |

**Returns:** *boolean*

true if banned

___

###  start

▸ **start**(): *Promise‹any›*

*Overrides [Server](_net_server_server_.server.md).[start](_net_server_server_.server.md#start)*

*Defined in [lib/net/server/libp2pserver.js:71](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/libp2pserver.js#L71)*

Start Libp2p server. Returns a promise that resolves once server has been started.

**Returns:** *Promise‹any›*

___

###  stop

▸ **stop**(): *Promise‹any›*

*Overrides [Server](_net_server_server_.server.md).[stop](_net_server_server_.server.md#stop)*

*Defined in [lib/net/server/libp2pserver.js:135](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/libp2pserver.js#L135)*

Stop Libp2p server. Returns a promise that resolves once server has been stopped.

**Returns:** *Promise‹any›*
