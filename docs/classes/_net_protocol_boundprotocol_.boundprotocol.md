[ethereumjs-client](../README.md) › ["net/protocol/boundprotocol"](../modules/_net_protocol_boundprotocol_.md) › [BoundProtocol](_net_protocol_boundprotocol_.boundprotocol.md)

# Class: BoundProtocol

Binds a protocol implementation to the specified peer

**`memberof`** module:net/protocol

## Hierarchy

* EventEmitter

  ↳ **BoundProtocol**

## Index

### Constructors

* [constructor](_net_protocol_boundprotocol_.boundprotocol.md#constructor)

### Properties

* [config](_net_protocol_boundprotocol_.boundprotocol.md#config)
* [name](_net_protocol_boundprotocol_.boundprotocol.md#name)
* [defaultMaxListeners](_net_protocol_boundprotocol_.boundprotocol.md#static-defaultmaxlisteners)
* [errorMonitor](_net_protocol_boundprotocol_.boundprotocol.md#static-errormonitor)

### Accessors

* [status](_net_protocol_boundprotocol_.boundprotocol.md#status)

### Methods

* [addListener](_net_protocol_boundprotocol_.boundprotocol.md#addlistener)
* [addMethods](_net_protocol_boundprotocol_.boundprotocol.md#addmethods)
* [emit](_net_protocol_boundprotocol_.boundprotocol.md#emit)
* [eventNames](_net_protocol_boundprotocol_.boundprotocol.md#eventnames)
* [getMaxListeners](_net_protocol_boundprotocol_.boundprotocol.md#getmaxlisteners)
* [handle](_net_protocol_boundprotocol_.boundprotocol.md#private-handle)
* [handshake](_net_protocol_boundprotocol_.boundprotocol.md#handshake)
* [listenerCount](_net_protocol_boundprotocol_.boundprotocol.md#listenercount)
* [listeners](_net_protocol_boundprotocol_.boundprotocol.md#listeners)
* [off](_net_protocol_boundprotocol_.boundprotocol.md#off)
* [on](_net_protocol_boundprotocol_.boundprotocol.md#on)
* [once](_net_protocol_boundprotocol_.boundprotocol.md#once)
* [prependListener](_net_protocol_boundprotocol_.boundprotocol.md#prependlistener)
* [prependOnceListener](_net_protocol_boundprotocol_.boundprotocol.md#prependoncelistener)
* [rawListeners](_net_protocol_boundprotocol_.boundprotocol.md#rawlisteners)
* [removeAllListeners](_net_protocol_boundprotocol_.boundprotocol.md#removealllisteners)
* [removeListener](_net_protocol_boundprotocol_.boundprotocol.md#removelistener)
* [request](_net_protocol_boundprotocol_.boundprotocol.md#request)
* [send](_net_protocol_boundprotocol_.boundprotocol.md#send)
* [setMaxListeners](_net_protocol_boundprotocol_.boundprotocol.md#setmaxlisteners)
* [listenerCount](_net_protocol_boundprotocol_.boundprotocol.md#static-listenercount)

## Constructors

###  constructor

\+ **new BoundProtocol**(`options`: [BoundProtocolOptions](../interfaces/_net_protocol_boundprotocol_.boundprotocoloptions.md)): *[BoundProtocol](_net_protocol_boundprotocol_.boundprotocol.md)*

*Overrides void*

*Defined in [lib/net/protocol/boundprotocol.ts:30](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/boundprotocol.ts#L30)*

Create bound protocol

**Parameters:**

Name | Type |
------ | ------ |
`options` | [BoundProtocolOptions](../interfaces/_net_protocol_boundprotocol_.boundprotocoloptions.md) |

**Returns:** *[BoundProtocol](_net_protocol_boundprotocol_.boundprotocol.md)*

## Properties

###  config

• **config**: *[Config](_config_.config.md)*

*Defined in [lib/net/protocol/boundprotocol.ts:22](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/boundprotocol.ts#L22)*

___

###  name

• **name**: *string*

*Defined in [lib/net/protocol/boundprotocol.ts:23](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/boundprotocol.ts#L23)*

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

###  status

• **get status**(): *any*

*Defined in [lib/net/protocol/boundprotocol.ts:61](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/boundprotocol.ts#L61)*

**Returns:** *any*

• **set status**(`status`: any): *void*

*Defined in [lib/net/protocol/boundprotocol.ts:65](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/boundprotocol.ts#L65)*

**Parameters:**

Name | Type |
------ | ------ |
`status` | any |

**Returns:** *void*

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

###  addMethods

▸ **addMethods**(): *void*

*Defined in [lib/net/protocol/boundprotocol.ts:161](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/boundprotocol.ts#L161)*

Add a methods to the bound protocol for each protocol message that has a
corresponding response message

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

### `Private` handle

▸ **handle**(`incoming`: any): *void*

*Defined in [lib/net/protocol/boundprotocol.ts:79](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/boundprotocol.ts#L79)*

Handle incoming message

**`emits`** message

**Parameters:**

Name | Type |
------ | ------ |
`incoming` | any |

**Returns:** *void*

___

###  handshake

▸ **handshake**(`sender`: [Sender](_net_protocol_sender_.sender.md)): *Promise‹void›*

*Defined in [lib/net/protocol/boundprotocol.ts:69](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/boundprotocol.ts#L69)*

**Parameters:**

Name | Type |
------ | ------ |
`sender` | [Sender](_net_protocol_sender_.sender.md) |

**Returns:** *Promise‹void›*

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

###  request

▸ **request**(`name`: string, `args`: any[]): *Promise‹any›*

*Defined in [lib/net/protocol/boundprotocol.ts:135](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/boundprotocol.ts#L135)*

Returns a promise that resolves with the message payload when a response
to the specified message is received

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`name` | string | message to wait for |
`args` | any[] | message arguments |

**Returns:** *Promise‹any›*

___

###  send

▸ **send**(`name`: string, `args?`: any): *any*

*Defined in [lib/net/protocol/boundprotocol.ts:116](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/boundprotocol.ts#L116)*

Send message with name and the specified args

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`name` | string | message name |
`args?` | any | message arguments  |

**Returns:** *any*

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
