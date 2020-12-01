[ethereumjs-client](../README.md) › ["node"](../modules/_node_.md) › [Node](_node_.node.md)

# Class: Node

Represents the top-level ethereum node, and is responsible for managing the
lifecycle of included services.

**`memberof`** module:node

## Hierarchy

* EventEmitter

  ↳ **Node**

## Index

### Constructors

* [constructor](_node_.node.md#constructor)

### Properties

* [config](_node_.node.md#config)
* [opened](_node_.node.md#opened)
* [services](_node_.node.md#services)
* [started](_node_.node.md#started)
* [defaultMaxListeners](_node_.node.md#static-defaultmaxlisteners)
* [errorMonitor](_node_.node.md#static-errormonitor)

### Methods

* [addListener](_node_.node.md#addlistener)
* [emit](_node_.node.md#emit)
* [eventNames](_node_.node.md#eventnames)
* [getMaxListeners](_node_.node.md#getmaxlisteners)
* [listenerCount](_node_.node.md#listenercount)
* [listeners](_node_.node.md#listeners)
* [off](_node_.node.md#off)
* [on](_node_.node.md#on)
* [once](_node_.node.md#once)
* [open](_node_.node.md#open)
* [prependListener](_node_.node.md#prependlistener)
* [prependOnceListener](_node_.node.md#prependoncelistener)
* [rawListeners](_node_.node.md#rawlisteners)
* [removeAllListeners](_node_.node.md#removealllisteners)
* [removeListener](_node_.node.md#removelistener)
* [server](_node_.node.md#server)
* [service](_node_.node.md#service)
* [setMaxListeners](_node_.node.md#setmaxlisteners)
* [start](_node_.node.md#start)
* [stop](_node_.node.md#stop)
* [listenerCount](_node_.node.md#static-listenercount)

## Constructors

###  constructor

\+ **new Node**(`options`: [NodeOptions](../interfaces/_node_.nodeoptions.md)): *[Node](_node_.node.md)*

*Overrides void*

*Defined in [lib/node.ts:35](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/node.ts#L35)*

Create new node

**Parameters:**

Name | Type |
------ | ------ |
`options` | [NodeOptions](../interfaces/_node_.nodeoptions.md) |

**Returns:** *[Node](_node_.node.md)*

## Properties

###  config

• **config**: *[Config](_config_.config.md)*

*Defined in [lib/node.ts:30](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/node.ts#L30)*

___

###  opened

• **opened**: *boolean*

*Defined in [lib/node.ts:34](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/node.ts#L34)*

___

###  services

• **services**: *([FullEthereumService](_service_fullethereumservice_.fullethereumservice.md)‹› | [LightEthereumService](_service_lightethereumservice_.lightethereumservice.md)‹›)[]*

*Defined in [lib/node.ts:32](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/node.ts#L32)*

___

###  started

• **started**: *boolean*

*Defined in [lib/node.ts:35](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/node.ts#L35)*

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

###  open

▸ **open**(): *Promise‹undefined | false›*

*Defined in [lib/node.ts:65](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/node.ts#L65)*

Open node. Must be called before node is started

**Returns:** *Promise‹undefined | false›*

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

###  server

▸ **server**(`name`: string): *undefined | [RlpxServer](_net_server_rlpxserver_.rlpxserver.md)‹› | [Libp2pServer](_net_server_libp2pserver_.libp2pserver.md)‹›*

*Defined in [lib/node.ts:129](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/node.ts#L129)*

Returns the server with the specified name.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`name` | string | name of server |

**Returns:** *undefined | [RlpxServer](_net_server_rlpxserver_.rlpxserver.md)‹› | [Libp2pServer](_net_server_libp2pserver_.libp2pserver.md)‹›*

___

###  service

▸ **service**(`name`: string): *undefined | [FullEthereumService](_service_fullethereumservice_.fullethereumservice.md)‹› | [LightEthereumService](_service_lightethereumservice_.lightethereumservice.md)‹›*

*Defined in [lib/node.ts:120](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/node.ts#L120)*

Returns the service with the specified name.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`name` | string | name of service |

**Returns:** *undefined | [FullEthereumService](_service_fullethereumservice_.fullethereumservice.md)‹› | [LightEthereumService](_service_lightethereumservice_.lightethereumservice.md)‹›*

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

▸ **start**(): *Promise‹undefined | false›*

*Defined in [lib/node.ts:93](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/node.ts#L93)*

Starts node and all services and network servers.

**Returns:** *Promise‹undefined | false›*

___

###  stop

▸ **stop**(): *Promise‹undefined | false›*

*Defined in [lib/node.ts:106](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/node.ts#L106)*

Stops node and all services and network servers.

**Returns:** *Promise‹undefined | false›*

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
