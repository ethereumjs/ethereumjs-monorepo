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

### Properties

* [bootnodes](_net_server_libp2pserver_.libp2pserver.md#bootnodes)
* [config](_net_server_libp2pserver_.libp2pserver.md#config)
* [key](_net_server_libp2pserver_.libp2pserver.md#key)
* [started](_net_server_libp2pserver_.libp2pserver.md#started)

### Accessors

* [name](_net_server_libp2pserver_.libp2pserver.md#name)
* [running](_net_server_libp2pserver_.libp2pserver.md#running)

### Methods

* [addListener](_net_server_libp2pserver_.libp2pserver.md#addlistener)
* [addProtocols](_net_server_libp2pserver_.libp2pserver.md#addprotocols)
* [ban](_net_server_libp2pserver_.libp2pserver.md#ban)
* [createPeer](_net_server_libp2pserver_.libp2pserver.md#createpeer)
* [createPeerInfo](_net_server_libp2pserver_.libp2pserver.md#createpeerinfo)
* [emit](_net_server_libp2pserver_.libp2pserver.md#emit)
* [error](_net_server_libp2pserver_.libp2pserver.md#private-error)
* [eventNames](_net_server_libp2pserver_.libp2pserver.md#eventnames)
* [getMaxListeners](_net_server_libp2pserver_.libp2pserver.md#getmaxlisteners)
* [getPeerInfo](_net_server_libp2pserver_.libp2pserver.md#getpeerinfo)
* [isBanned](_net_server_libp2pserver_.libp2pserver.md#isbanned)
* [listenerCount](_net_server_libp2pserver_.libp2pserver.md#listenercount)
* [listeners](_net_server_libp2pserver_.libp2pserver.md#listeners)
* [off](_net_server_libp2pserver_.libp2pserver.md#off)
* [on](_net_server_libp2pserver_.libp2pserver.md#on)
* [once](_net_server_libp2pserver_.libp2pserver.md#once)
* [prependListener](_net_server_libp2pserver_.libp2pserver.md#prependlistener)
* [prependOnceListener](_net_server_libp2pserver_.libp2pserver.md#prependoncelistener)
* [rawListeners](_net_server_libp2pserver_.libp2pserver.md#rawlisteners)
* [removeAllListeners](_net_server_libp2pserver_.libp2pserver.md#removealllisteners)
* [removeListener](_net_server_libp2pserver_.libp2pserver.md#removelistener)
* [setMaxListeners](_net_server_libp2pserver_.libp2pserver.md#setmaxlisteners)
* [start](_net_server_libp2pserver_.libp2pserver.md#start)
* [stop](_net_server_libp2pserver_.libp2pserver.md#stop)

## Constructors

###  constructor

\+ **new Libp2pServer**(`options`: [Libp2pServerOptions](../interfaces/_net_server_libp2pserver_.libp2pserveroptions.md)): *[Libp2pServer](_net_server_libp2pserver_.libp2pserver.md)*

*Overrides [Server](_net_server_server_.server.md).[constructor](_net_server_server_.server.md#constructor)*

*Defined in [lib/net/server/libp2pserver.ts:25](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/libp2pserver.ts#L25)*

Create new DevP2P/RLPx server

**Parameters:**

Name | Type |
------ | ------ |
`options` | [Libp2pServerOptions](../interfaces/_net_server_libp2pserver_.libp2pserveroptions.md) |

**Returns:** *[Libp2pServer](_net_server_libp2pserver_.libp2pserver.md)*

## Properties

###  bootnodes

• **bootnodes**: *[Bootnode](../interfaces/_types_.bootnode.md)[]* = []

*Inherited from [Server](_net_server_server_.server.md).[bootnodes](_net_server_server_.server.md#bootnodes)*

*Defined in [lib/net/server/server.ts:28](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/server.ts#L28)*

___

###  config

• **config**: *[Config](_config_.config.md)*

*Inherited from [Server](_net_server_server_.server.md).[config](_net_server_server_.server.md#config)*

*Defined in [lib/net/server/server.ts:26](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/server.ts#L26)*

___

###  key

• **key**: *Buffer | undefined*

*Inherited from [Server](_net_server_server_.server.md).[key](_net_server_server_.server.md#key)*

*Defined in [lib/net/server/server.ts:27](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/server.ts#L27)*

___

###  started

• **started**: *boolean*

*Inherited from [Server](_net_server_server_.server.md).[started](_net_server_server_.server.md#started)*

*Defined in [lib/net/server/server.ts:33](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/server.ts#L33)*

## Accessors

###  name

• **get name**(): *string*

*Overrides [Server](_net_server_server_.server.md).[name](_net_server_server_.server.md#name)*

*Defined in [lib/net/server/libp2pserver.ts:46](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/libp2pserver.ts#L46)*

Server name

**`type`** {string}

**Returns:** *string*

___

###  running

• **get running**(): *boolean*

*Inherited from [Server](_net_server_server_.server.md).[running](_net_server_server_.server.md#running)*

*Defined in [lib/net/server/server.ts:58](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/server.ts#L58)*

Check if server is running

**Returns:** *boolean*

## Methods

###  addListener

▸ **addListener**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[addListener](_net_protocol_sender_.sender.md#addlistener)*

Defined in node_modules/@types/node/events.d.ts:62

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  addProtocols

▸ **addProtocols**(`protocols`: [Protocol](_net_protocol_protocol_.protocol.md)[]): *boolean*

*Inherited from [Server](_net_server_server_.server.md).[addProtocols](_net_server_server_.server.md#addprotocols)*

*Defined in [lib/net/server/server.ts:92](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/server.ts#L92)*

Specify which protocols the server must support

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`protocols` | [Protocol](_net_protocol_protocol_.protocol.md)[] | protocol classes |

**Returns:** *boolean*

True if protocol added successfully

___

###  ban

▸ **ban**(`peerId`: string, `maxAge`: number): *boolean*

*Overrides [Server](_net_server_server_.server.md).[ban](_net_server_server_.server.md#protected-ban)*

*Defined in [lib/net/server/libp2pserver.ts:131](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/libp2pserver.ts#L131)*

Ban peer for a specified time

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`peerId` | string | - | id of peer |
`maxAge` | number | 60000 | - |

**Returns:** *boolean*

___

###  createPeer

▸ **createPeer**(`peerInfo`: any): *[Libp2pPeer](_net_peer_libp2ppeer_.libp2ppeer.md)‹›*

*Defined in [lib/net/server/libp2pserver.ts:196](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/libp2pserver.ts#L196)*

**Parameters:**

Name | Type |
------ | ------ |
`peerInfo` | any |

**Returns:** *[Libp2pPeer](_net_peer_libp2ppeer_.libp2ppeer.md)‹›*

___

###  createPeerInfo

▸ **createPeerInfo**(): *Promise‹unknown›*

*Defined in [lib/net/server/libp2pserver.ts:163](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/libp2pserver.ts#L163)*

**Returns:** *Promise‹unknown›*

___

###  emit

▸ **emit**(`event`: string | symbol, ...`args`: any[]): *boolean*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[emit](_net_protocol_sender_.sender.md#emit)*

Defined in node_modules/@types/node/events.d.ts:72

**Parameters:**

Name | Type |
------ | ------ |
`event` | string &#124; symbol |
`...args` | any[] |

**Returns:** *boolean*

___

### `Private` error

▸ **error**(`error`: Error): *void*

*Defined in [lib/net/server/libp2pserver.ts:159](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/libp2pserver.ts#L159)*

Handles errors from server and peers

**`emits`** error

**Parameters:**

Name | Type |
------ | ------ |
`error` | Error |

**Returns:** *void*

___

###  eventNames

▸ **eventNames**(): *Array‹string | symbol›*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[eventNames](_net_protocol_sender_.sender.md#eventnames)*

Defined in node_modules/@types/node/events.d.ts:77

**Returns:** *Array‹string | symbol›*

___

###  getMaxListeners

▸ **getMaxListeners**(): *number*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[getMaxListeners](_net_protocol_sender_.sender.md#getmaxlisteners)*

Defined in node_modules/@types/node/events.d.ts:69

**Returns:** *number*

___

###  getPeerInfo

▸ **getPeerInfo**(`connection`: any): *Promise‹unknown›*

*Defined in [lib/net/server/libp2pserver.ts:185](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/libp2pserver.ts#L185)*

**Parameters:**

Name | Type |
------ | ------ |
`connection` | any |

**Returns:** *Promise‹unknown›*

___

###  isBanned

▸ **isBanned**(`peerId`: string): *boolean*

*Defined in [lib/net/server/libp2pserver.ts:144](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/libp2pserver.ts#L144)*

Check if peer is currently banned

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`peerId` | string | id of peer |

**Returns:** *boolean*

true if banned

___

###  listenerCount

▸ **listenerCount**(`event`: string | symbol): *number*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[listenerCount](_net_protocol_sender_.sender.md#listenercount)*

Defined in node_modules/@types/node/events.d.ts:73

**Parameters:**

Name | Type |
------ | ------ |
`event` | string &#124; symbol |

**Returns:** *number*

___

###  listeners

▸ **listeners**(`event`: string | symbol): *Function[]*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[listeners](_net_protocol_sender_.sender.md#listeners)*

Defined in node_modules/@types/node/events.d.ts:70

**Parameters:**

Name | Type |
------ | ------ |
`event` | string &#124; symbol |

**Returns:** *Function[]*

___

###  off

▸ **off**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[off](_net_protocol_sender_.sender.md#off)*

Defined in node_modules/@types/node/events.d.ts:66

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  on

▸ **on**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[on](_net_protocol_sender_.sender.md#on)*

Defined in node_modules/@types/node/events.d.ts:63

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  once

▸ **once**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[once](_net_protocol_sender_.sender.md#once)*

Defined in node_modules/@types/node/events.d.ts:64

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  prependListener

▸ **prependListener**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[prependListener](_net_protocol_sender_.sender.md#prependlistener)*

Defined in node_modules/@types/node/events.d.ts:75

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  prependOnceListener

▸ **prependOnceListener**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[prependOnceListener](_net_protocol_sender_.sender.md#prependoncelistener)*

Defined in node_modules/@types/node/events.d.ts:76

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  rawListeners

▸ **rawListeners**(`event`: string | symbol): *Function[]*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[rawListeners](_net_protocol_sender_.sender.md#rawlisteners)*

Defined in node_modules/@types/node/events.d.ts:71

**Parameters:**

Name | Type |
------ | ------ |
`event` | string &#124; symbol |

**Returns:** *Function[]*

___

###  removeAllListeners

▸ **removeAllListeners**(`event?`: string | symbol): *this*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[removeAllListeners](_net_protocol_sender_.sender.md#removealllisteners)*

Defined in node_modules/@types/node/events.d.ts:67

**Parameters:**

Name | Type |
------ | ------ |
`event?` | string &#124; symbol |

**Returns:** *this*

___

###  removeListener

▸ **removeListener**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[removeListener](_net_protocol_sender_.sender.md#removelistener)*

Defined in node_modules/@types/node/events.d.ts:65

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  setMaxListeners

▸ **setMaxListeners**(`n`: number): *this*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[setMaxListeners](_net_protocol_sender_.sender.md#setmaxlisteners)*

Defined in node_modules/@types/node/events.d.ts:68

**Parameters:**

Name | Type |
------ | ------ |
`n` | number |

**Returns:** *this*

___

###  start

▸ **start**(): *Promise‹boolean›*

*Overrides [Server](_net_server_server_.server.md).[start](_net_server_server_.server.md#start)*

*Defined in [lib/net/server/libp2pserver.ts:54](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/libp2pserver.ts#L54)*

Start Libp2p server. Returns a promise that resolves once server has been started.

**Returns:** *Promise‹boolean›*

Resolves with true if server successfully started

___

###  stop

▸ **stop**(): *Promise‹boolean›*

*Overrides [Server](_net_server_server_.server.md).[stop](_net_server_server_.server.md#stop)*

*Defined in [lib/net/server/libp2pserver.ts:117](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/libp2pserver.ts#L117)*

Stop Libp2p server. Returns a promise that resolves once server has been stopped.

**Returns:** *Promise‹boolean›*
