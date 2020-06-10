[ethereumjs-client](../README.md) › ["net/server/server"](../modules/_net_server_server_.md) › [Server](_net_server_server_.server.md)

# Class: Server

Base class for transport specific server implementations.

**`memberof`** module:net/server

## Hierarchy

* any

  ↳ **Server**

  ↳ [RlpxServer](_net_server_rlpxserver_.rlpxserver.md)

  ↳ [Libp2pServer](_net_server_libp2pserver_.libp2pserver.md)

## Index

### Constructors

* [constructor](_net_server_server_.server.md#constructor)

### Accessors

* [name](_net_server_server_.server.md#name)
* [running](_net_server_server_.server.md#running)

### Methods

* [addProtocols](_net_server_server_.server.md#addprotocols)
* [start](_net_server_server_.server.md#start)
* [stop](_net_server_server_.server.md#stop)

## Constructors

###  constructor

\+ **new Server**(`options`: any): *[Server](_net_server_server_.server.md)*

*Defined in [lib/net/server/server.js:16](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/server.js#L16)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | any |

**Returns:** *[Server](_net_server_server_.server.md)*

## Accessors

###  name

• **get name**(): *string*

*Defined in [lib/net/server/server.js:28](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/server.js#L28)*

**Returns:** *string*

___

###  running

• **get running**(): *boolean*

*Defined in [lib/net/server/server.js:36](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/server.js#L36)*

Check if server is running

**Returns:** *boolean*

true if server is running

## Methods

###  addProtocols

▸ **addProtocols**(`protocols`: any[]): *undefined | false*

*Defined in [lib/net/server/server.js:67](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/server.js#L67)*

Specify which protocols the server must support

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`protocols` | any[] | protocol classes  |

**Returns:** *undefined | false*

___

###  start

▸ **start**(): *Promise‹any›*

*Defined in [lib/net/server/server.js:44](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/server.js#L44)*

Start server. Returns a promise that resolves once server has been started.

**Returns:** *Promise‹any›*

___

###  stop

▸ **stop**(): *Promise‹any›*

*Defined in [lib/net/server/server.js:58](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/server.js#L58)*

Stop server. Returns a promise that resolves once server has been stopped.

**Returns:** *Promise‹any›*
