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

### Properties

* [bootnodes](_net_server_rlpxserver_.rlpxserver.md#bootnodes)
* [config](_net_server_rlpxserver_.rlpxserver.md#config)
* [dpt](_net_server_rlpxserver_.rlpxserver.md#dpt)
* [ip](_net_server_rlpxserver_.rlpxserver.md#ip)
* [key](_net_server_rlpxserver_.rlpxserver.md#key)
* [port](_net_server_rlpxserver_.rlpxserver.md#port)
* [rlpx](_net_server_rlpxserver_.rlpxserver.md#rlpx)
* [started](_net_server_rlpxserver_.rlpxserver.md#started)

### Accessors

* [name](_net_server_rlpxserver_.rlpxserver.md#name)
* [running](_net_server_rlpxserver_.rlpxserver.md#running)

### Methods

* [addListener](_net_server_rlpxserver_.rlpxserver.md#addlistener)
* [addProtocols](_net_server_rlpxserver_.rlpxserver.md#addprotocols)
* [ban](_net_server_rlpxserver_.rlpxserver.md#ban)
* [bootstrap](_net_server_rlpxserver_.rlpxserver.md#bootstrap)
* [emit](_net_server_rlpxserver_.rlpxserver.md#emit)
* [error](_net_server_rlpxserver_.rlpxserver.md#private-error)
* [eventNames](_net_server_rlpxserver_.rlpxserver.md#eventnames)
* [getMaxListeners](_net_server_rlpxserver_.rlpxserver.md#getmaxlisteners)
* [getRlpxInfo](_net_server_rlpxserver_.rlpxserver.md#getrlpxinfo)
* [initDpt](_net_server_rlpxserver_.rlpxserver.md#private-initdpt)
* [initRlpx](_net_server_rlpxserver_.rlpxserver.md#private-initrlpx)
* [listenerCount](_net_server_rlpxserver_.rlpxserver.md#listenercount)
* [listeners](_net_server_rlpxserver_.rlpxserver.md#listeners)
* [off](_net_server_rlpxserver_.rlpxserver.md#off)
* [on](_net_server_rlpxserver_.rlpxserver.md#on)
* [once](_net_server_rlpxserver_.rlpxserver.md#once)
* [prependListener](_net_server_rlpxserver_.rlpxserver.md#prependlistener)
* [prependOnceListener](_net_server_rlpxserver_.rlpxserver.md#prependoncelistener)
* [rawListeners](_net_server_rlpxserver_.rlpxserver.md#rawlisteners)
* [removeAllListeners](_net_server_rlpxserver_.rlpxserver.md#removealllisteners)
* [removeListener](_net_server_rlpxserver_.rlpxserver.md#removelistener)
* [setMaxListeners](_net_server_rlpxserver_.rlpxserver.md#setmaxlisteners)
* [start](_net_server_rlpxserver_.rlpxserver.md#start)
* [stop](_net_server_rlpxserver_.rlpxserver.md#stop)

## Constructors

###  constructor

\+ **new RlpxServer**(`options`: [RlpxServerOptions](../interfaces/_net_server_rlpxserver_.rlpxserveroptions.md)): *[RlpxServer](_net_server_rlpxserver_.rlpxserver.md)*

*Overrides [Server](_net_server_server_.server.md).[constructor](_net_server_server_.server.md#constructor)*

*Defined in [lib/net/server/rlpxserver.ts:45](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/rlpxserver.ts#L45)*

Create new DevP2P/RLPx server

**Parameters:**

Name | Type |
------ | ------ |
`options` | [RlpxServerOptions](../interfaces/_net_server_rlpxserver_.rlpxserveroptions.md) |

**Returns:** *[RlpxServer](_net_server_rlpxserver_.rlpxserver.md)*

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

###  dpt

• **dpt**: *Devp2pDPT | null* = null

*Defined in [lib/net/server/rlpxserver.ts:44](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/rlpxserver.ts#L44)*

___

###  ip

• **ip**: *string* = "::"

*Defined in [lib/net/server/rlpxserver.ts:45](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/rlpxserver.ts#L45)*

___

###  key

• **key**: *Buffer | undefined*

*Inherited from [Server](_net_server_server_.server.md).[key](_net_server_server_.server.md#key)*

*Defined in [lib/net/server/server.ts:27](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/server.ts#L27)*

___

###  port

• **port**: *number*

*Defined in [lib/net/server/rlpxserver.ts:40](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/rlpxserver.ts#L40)*

___

###  rlpx

• **rlpx**: *Devp2pRLPx | null* = null

*Defined in [lib/net/server/rlpxserver.ts:43](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/rlpxserver.ts#L43)*

___

###  started

• **started**: *boolean*

*Inherited from [Server](_net_server_server_.server.md).[started](_net_server_server_.server.md#started)*

*Defined in [lib/net/server/server.ts:33](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/server.ts#L33)*

## Accessors

###  name

• **get name**(): *string*

*Overrides [Server](_net_server_server_.server.md).[name](_net_server_server_.server.md#name)*

*Defined in [lib/net/server/rlpxserver.ts:74](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/rlpxserver.ts#L74)*

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

*Defined in [lib/net/server/rlpxserver.ts:157](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/rlpxserver.ts#L157)*

Ban peer for a specified time

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`peerId` | string | - | id of peer |
`maxAge` | number | 60000 | - |

**Returns:** *boolean*

True if ban was successfully executed

___

###  bootstrap

▸ **bootstrap**(): *Promise‹void›*

*Defined in [lib/net/server/rlpxserver.ts:122](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/rlpxserver.ts#L122)*

Bootstrap bootnode peers from the network

**Returns:** *Promise‹void›*

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

▸ **error**(`error`: Error, `peer?`: [RlpxPeer](_net_peer_rlpxpeer_.rlpxpeer.md)): *void*

*Defined in [lib/net/server/rlpxserver.ts:172](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/rlpxserver.ts#L172)*

Handles errors from server and peers

**`emits`** error

**Parameters:**

Name | Type |
------ | ------ |
`error` | Error |
`peer?` | [RlpxPeer](_net_peer_rlpxpeer_.rlpxpeer.md) |

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

###  getRlpxInfo

▸ **getRlpxInfo**(): *object | object*

*Defined in [lib/net/server/rlpxserver.ts:81](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/rlpxserver.ts#L81)*

Return Rlpx info

**Returns:** *object | object*

___

### `Private` initDpt

▸ **initDpt**(): *void*

*Defined in [lib/net/server/rlpxserver.ts:187](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/rlpxserver.ts#L187)*

Initializes DPT for peer discovery

**Returns:** *void*

___

### `Private` initRlpx

▸ **initRlpx**(): *void*

*Defined in [lib/net/server/rlpxserver.ts:208](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/rlpxserver.ts#L208)*

Initializes RLPx instance for peer management

**Returns:** *void*

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

*Defined in [lib/net/server/rlpxserver.ts:106](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/rlpxserver.ts#L106)*

Start Devp2p/RLPx server. Returns a promise that resolves once server has been started.

**Returns:** *Promise‹boolean›*

Resolves with true if server successfully started

___

###  stop

▸ **stop**(): *Promise‹boolean›*

*Overrides [Server](_net_server_server_.server.md).[stop](_net_server_server_.server.md#stop)*

*Defined in [lib/net/server/rlpxserver.ts:141](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/rlpxserver.ts#L141)*

Stop Devp2p/RLPx server. Returns a promise that resolves once server has been stopped.

**Returns:** *Promise‹boolean›*
