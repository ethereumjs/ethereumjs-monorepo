[ethereumjs-client](../README.md) › ["net/protocol/sender"](../modules/_net_protocol_sender_.md) › [Sender](_net_protocol_sender_.sender.md)

# Class: Sender

Base class for transport specific message sender/receiver. Subclasses should
emit a message event when the sender receives a new message, and they should
emit a status event when the sender receives a handshake status message

**`emits`** message

**`emits`** status

**`memberof`** module:net/protocol

## Hierarchy

* EventEmitter

  ↳ **Sender**

  ↳ [RlpxSender](_net_protocol_rlpxsender_.rlpxsender.md)

  ↳ [Libp2pSender](_net_protocol_libp2psender_.libp2psender.md)

## Index

### Constructors

* [constructor](_net_protocol_sender_.sender.md#constructor)

### Properties

* [defaultMaxListeners](_net_protocol_sender_.sender.md#static-defaultmaxlisteners)
* [errorMonitor](_net_protocol_sender_.sender.md#static-errormonitor)

### Accessors

* [status](_net_protocol_sender_.sender.md#status)

### Methods

* [addListener](_net_protocol_sender_.sender.md#addlistener)
* [emit](_net_protocol_sender_.sender.md#emit)
* [eventNames](_net_protocol_sender_.sender.md#eventnames)
* [getMaxListeners](_net_protocol_sender_.sender.md#getmaxlisteners)
* [listenerCount](_net_protocol_sender_.sender.md#listenercount)
* [listeners](_net_protocol_sender_.sender.md#listeners)
* [off](_net_protocol_sender_.sender.md#off)
* [on](_net_protocol_sender_.sender.md#on)
* [once](_net_protocol_sender_.sender.md#once)
* [prependListener](_net_protocol_sender_.sender.md#prependlistener)
* [prependOnceListener](_net_protocol_sender_.sender.md#prependoncelistener)
* [rawListeners](_net_protocol_sender_.sender.md#rawlisteners)
* [removeAllListeners](_net_protocol_sender_.sender.md#removealllisteners)
* [removeListener](_net_protocol_sender_.sender.md#removelistener)
* [sendMessage](_net_protocol_sender_.sender.md#protected-sendmessage)
* [sendStatus](_net_protocol_sender_.sender.md#protected-sendstatus)
* [setMaxListeners](_net_protocol_sender_.sender.md#setmaxlisteners)
* [listenerCount](_net_protocol_sender_.sender.md#static-listenercount)

## Constructors

###  constructor

\+ **new Sender**(): *[Sender](_net_protocol_sender_.sender.md)*

*Overrides void*

*Defined in [lib/net/protocol/sender.ts:12](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/sender.ts#L12)*

**Returns:** *[Sender](_net_protocol_sender_.sender.md)*

## Properties

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

*Defined in [lib/net/protocol/sender.ts:19](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/sender.ts#L19)*

**Returns:** *any*

• **set status**(`status`: any): *void*

*Defined in [lib/net/protocol/sender.ts:23](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/sender.ts#L23)*

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

### `Protected` sendMessage

▸ **sendMessage**(`_code`: number, `_rlpEncodedData`: any[] | Buffer): *void*

*Defined in [lib/net/protocol/sender.ts:43](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/sender.ts#L43)*

Send a message to peer

**Parameters:**

Name | Type |
------ | ------ |
`_code` | number |
`_rlpEncodedData` | any[] &#124; Buffer |

**Returns:** *void*

___

### `Protected` sendStatus

▸ **sendStatus**(`_status`: any): *void*

*Defined in [lib/net/protocol/sender.ts:33](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/sender.ts#L33)*

Send a status to peer

**Parameters:**

Name | Type |
------ | ------ |
`_status` | any |

**Returns:** *void*

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
