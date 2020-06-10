[ethereumjs-client](../README.md) › ["net/server/rlpxserver"](../modules/_net_server_rlpxserver_.md) › [RlpxServer](_net_server_rlpxserver_.rlpxserver.md)

# Class: RlpxServer

DevP2P/RLPx server

**`emits`** connected

**`emits`** disconnected

**`emits`** error

**`memberof`** module:net/server

## Hierarchy

  ↳ [Server](_net_server_server_.server.md)

  ↳ **RlpxServer**

## Index

### Constructors

* [constructor](_net_server_rlpxserver_.rlpxserver.md#constructor)

### Accessors

* [name](_net_server_rlpxserver_.rlpxserver.md#name)
* [running](_net_server_rlpxserver_.rlpxserver.md#running)

### Methods

* [addProtocols](_net_server_rlpxserver_.rlpxserver.md#addprotocols)
* [ban](_net_server_rlpxserver_.rlpxserver.md#ban)
* [init](_net_server_rlpxserver_.rlpxserver.md#init)
* [start](_net_server_rlpxserver_.rlpxserver.md#start)
* [stop](_net_server_rlpxserver_.rlpxserver.md#stop)

## Constructors

###  constructor

\+ **new RlpxServer**(`options`: object): *[RlpxServer](_net_server_rlpxserver_.rlpxserver.md)*

*Overrides [Server](_net_server_server_.server.md).[constructor](_net_server_server_.server.md#constructor)*

*Defined in [lib/net/server/rlpxserver.js:37](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/rlpxserver.js#L37)*

Create new DevP2P/RLPx server

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`options` | object | constructor parameters |

**Returns:** *[RlpxServer](_net_server_rlpxserver_.rlpxserver.md)*

## Accessors

###  name

• **get name**(): *string*

*Overrides [Server](_net_server_server_.server.md).[name](_net_server_server_.server.md#name)*

*Defined in [lib/net/server/rlpxserver.js:65](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/rlpxserver.js#L65)*

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

*Defined in [lib/net/server/rlpxserver.js:125](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/rlpxserver.js#L125)*

Ban peer for a specified time

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`peerId` | string | - | id of peer |
`maxAge` | undefined &#124; number | 60000 | - |

**Returns:** *Promise‹any›*

___

###  init

▸ **init**(): *void*

*Defined in [lib/net/server/rlpxserver.js:69](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/rlpxserver.js#L69)*

**Returns:** *void*

___

###  start

▸ **start**(): *Promise‹any›*

*Overrides [Server](_net_server_server_.server.md).[start](_net_server_server_.server.md#start)*

*Defined in [lib/net/server/rlpxserver.js:85](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/rlpxserver.js#L85)*

Start Devp2p/RLPx server. Returns a promise that resolves once server has been started.

**Returns:** *Promise‹any›*

___

###  stop

▸ **stop**(): *Promise‹any›*

*Overrides [Server](_net_server_server_.server.md).[stop](_net_server_server_.server.md#stop)*

*Defined in [lib/net/server/rlpxserver.js:110](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/rlpxserver.js#L110)*

Stop Devp2p/RLPx server. Returns a promise that resolves once server has been stopped.

**Returns:** *Promise‹any›*
