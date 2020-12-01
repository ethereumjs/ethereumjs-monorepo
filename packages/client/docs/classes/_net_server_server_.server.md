[ethereumjs-client](../README.md) › ["net/server/server"](../modules/_net_server_server_.md) › [Server](_net_server_server_.server.md)

# Class: Server

Base class for transport specific server implementations.

**`memberof`** module:net/server

## Hierarchy

* EventEmitter

  ↳ **Server**

  ↳ [RlpxServer](_net_server_rlpxserver_.rlpxserver.md)

  ↳ [Libp2pServer](_net_server_libp2pserver_.libp2pserver.md)

## Index

### Constructors

* [constructor](_net_server_server_.server.md#constructor)

### Properties

* [bootnodes](_net_server_server_.server.md#bootnodes)
* [config](_net_server_server_.server.md#config)
* [key](_net_server_server_.server.md#key)
* [started](_net_server_server_.server.md#started)
* [defaultMaxListeners](_net_server_server_.server.md#static-defaultmaxlisteners)
* [errorMonitor](_net_server_server_.server.md#static-errormonitor)

### Accessors

* [name](_net_server_server_.server.md#name)
* [running](_net_server_server_.server.md#running)

### Methods

* [addListener](_net_server_server_.server.md#addlistener)
* [addProtocols](_net_server_server_.server.md#addprotocols)
* [ban](_net_server_server_.server.md#protected-ban)
* [emit](_net_server_server_.server.md#emit)
* [eventNames](_net_server_server_.server.md#eventnames)
* [getMaxListeners](_net_server_server_.server.md#getmaxlisteners)
* [listenerCount](_net_server_server_.server.md#listenercount)
* [listeners](_net_server_server_.server.md#listeners)
* [off](_net_server_server_.server.md#off)
* [on](_net_server_server_.server.md#on)
* [once](_net_server_server_.server.md#once)
* [prependListener](_net_server_server_.server.md#prependlistener)
* [prependOnceListener](_net_server_server_.server.md#prependoncelistener)
* [rawListeners](_net_server_server_.server.md#rawlisteners)
* [removeAllListeners](_net_server_server_.server.md#removealllisteners)
* [removeListener](_net_server_server_.server.md#removelistener)
* [setMaxListeners](_net_server_server_.server.md#setmaxlisteners)
* [start](_net_server_server_.server.md#start)
* [stop](_net_server_server_.server.md#stop)
* [listenerCount](_net_server_server_.server.md#static-listenercount)

## Constructors

###  constructor

\+ **new Server**(`options`: [ServerOptions](../interfaces/_net_server_server_.serveroptions.md)): *[Server](_net_server_server_.server.md)*

*Overrides void*

*Defined in [lib/net/server/server.ts:33](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/server.ts#L33)*

Create new server

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ServerOptions](../interfaces/_net_server_server_.serveroptions.md) |

**Returns:** *[Server](_net_server_server_.server.md)*

## Properties

###  bootnodes

• **bootnodes**: *[Bootnode](../interfaces/_types_.bootnode.md)[]* = []

*Defined in [lib/net/server/server.ts:28](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/server.ts#L28)*

___

###  config

• **config**: *[Config](_config_.config.md)*

*Defined in [lib/net/server/server.ts:26](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/server.ts#L26)*

___

###  key

• **key**: *Buffer | undefined*

*Defined in [lib/net/server/server.ts:27](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/server.ts#L27)*

___

###  started

• **started**: *boolean*

*Defined in [lib/net/server/server.ts:33](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/server.ts#L33)*

___

### `Static` defaultMaxListeners

▪ **defaultMaxListeners**: *number*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[defaultMaxListeners](_net_protocol_sender_.sender.md#static-defaultmaxlisteners)*

Defined in node_modules/@types/node/events.d.ts:45

___

### `Static` errorMonitor

▪ **errorMonitor**: *keyof symbol*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[errorMonitor](_net_protocol_sender_.sender.md#static-errormonitor)*

Defined in node_modules/@types/node/events.d.ts:55

This symbol shall be used to install a listener for only monitoring `'error'`
events. Listeners installed using this symbol are called before the regular
`'error'` listeners are called.

Installing a listener using this symbol does not change the behavior once an
`'error'` event is emitted, therefore the process will still crash if no
regular `'error'` listener is installed.

## Accessors

###  name

• **get name**(): *string*

*Defined in [lib/net/server/server.ts:51](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/server.ts#L51)*

**Returns:** *string*

___

###  running

• **get running**(): *boolean*

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

*Defined in [lib/net/server/server.ts:92](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/server.ts#L92)*

Specify which protocols the server must support

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`protocols` | [Protocol](_net_protocol_protocol_.protocol.md)[] | protocol classes |

**Returns:** *boolean*

True if protocol added successfully

___

### `Protected` ban

▸ **ban**(`_peerId`: string, `_maxAge`: number): *void*

*Defined in [lib/net/server/server.ts:108](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/server.ts#L108)*

Ban peer for a specified time

**Parameters:**

Name | Type |
------ | ------ |
`_peerId` | string |
`_maxAge` | number |

**Returns:** *void*

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

*Defined in [lib/net/server/server.ts:66](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/server.ts#L66)*

Start server. Returns a promise that resolves once server has been started.

**Returns:** *Promise‹boolean›*

Resolves with true if server successfully started

___

###  stop

▸ **stop**(): *Promise‹boolean›*

*Defined in [lib/net/server/server.ts:81](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/server/server.ts#L81)*

Stop server. Returns a promise that resolves once server has been stopped.

**Returns:** *Promise‹boolean›*

___

### `Static` listenerCount

▸ **listenerCount**(`emitter`: EventEmitter, `event`: string | symbol): *number*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[listenerCount](_net_protocol_sender_.sender.md#static-listenercount)*

Defined in node_modules/@types/node/events.d.ts:44

**`deprecated`** since v4.0.0

**Parameters:**

Name | Type |
------ | ------ |
`emitter` | EventEmitter |
`event` | string &#124; symbol |

**Returns:** *number*
