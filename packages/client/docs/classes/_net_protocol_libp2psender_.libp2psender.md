[ethereumjs-client](../README.md) › ["net/protocol/libp2psender"](../modules/_net_protocol_libp2psender_.md) › [Libp2pSender](_net_protocol_libp2psender_.libp2psender.md)

# Class: Libp2pSender

Libp2p protocol sender

**`emits`** message

**`emits`** status

**`memberof`** module:net/protocol

## Hierarchy

  ↳ [Sender](_net_protocol_sender_.sender.md)

  ↳ **Libp2pSender**

## Index

### Constructors

* [constructor](_net_protocol_libp2psender_.libp2psender.md#constructor)

### Accessors

* [status](_net_protocol_libp2psender_.libp2psender.md#status)

### Methods

* [addListener](_net_protocol_libp2psender_.libp2psender.md#addlistener)
* [emit](_net_protocol_libp2psender_.libp2psender.md#emit)
* [error](_net_protocol_libp2psender_.libp2psender.md#error)
* [eventNames](_net_protocol_libp2psender_.libp2psender.md#eventnames)
* [getMaxListeners](_net_protocol_libp2psender_.libp2psender.md#getmaxlisteners)
* [init](_net_protocol_libp2psender_.libp2psender.md#init)
* [listenerCount](_net_protocol_libp2psender_.libp2psender.md#listenercount)
* [listeners](_net_protocol_libp2psender_.libp2psender.md#listeners)
* [off](_net_protocol_libp2psender_.libp2psender.md#off)
* [on](_net_protocol_libp2psender_.libp2psender.md#on)
* [once](_net_protocol_libp2psender_.libp2psender.md#once)
* [prependListener](_net_protocol_libp2psender_.libp2psender.md#prependlistener)
* [prependOnceListener](_net_protocol_libp2psender_.libp2psender.md#prependoncelistener)
* [rawListeners](_net_protocol_libp2psender_.libp2psender.md#rawlisteners)
* [removeAllListeners](_net_protocol_libp2psender_.libp2psender.md#removealllisteners)
* [removeListener](_net_protocol_libp2psender_.libp2psender.md#removelistener)
* [sendMessage](_net_protocol_libp2psender_.libp2psender.md#sendmessage)
* [sendStatus](_net_protocol_libp2psender_.libp2psender.md#sendstatus)
* [setMaxListeners](_net_protocol_libp2psender_.libp2psender.md#setmaxlisteners)

## Constructors

###  constructor

\+ **new Libp2pSender**(`connection`: any): *[Libp2pSender](_net_protocol_libp2psender_.libp2psender.md)*

*Overrides [Sender](_net_protocol_sender_.sender.md).[constructor](_net_protocol_sender_.sender.md#constructor)*

*Defined in [lib/net/protocol/libp2psender.ts:19](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/libp2psender.ts#L19)*

Creates a new Libp2p protocol sender

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`connection` | any | connection to libp2p peer  |

**Returns:** *[Libp2pSender](_net_protocol_libp2psender_.libp2psender.md)*

## Accessors

###  status

• **get status**(): *any*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[status](_net_protocol_sender_.sender.md#status)*

*Defined in [lib/net/protocol/sender.ts:19](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/sender.ts#L19)*

**Returns:** *any*

• **set status**(`status`: any): *void*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[status](_net_protocol_sender_.sender.md#status)*

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

###  error

▸ **error**(`error`: Error): *void*

*Defined in [lib/net/protocol/libp2psender.ts:83](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/libp2psender.ts#L83)*

Handle pull stream errors

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`error` | Error | error  |

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

###  init

▸ **init**(): *void*

*Defined in [lib/net/protocol/libp2psender.ts:32](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/libp2psender.ts#L32)*

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

###  sendMessage

▸ **sendMessage**(`code`: number, `data`: any): *void*

*Overrides [Sender](_net_protocol_sender_.sender.md).[sendMessage](_net_protocol_sender_.sender.md#protected-sendmessage)*

*Defined in [lib/net/protocol/libp2psender.ts:75](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/libp2psender.ts#L75)*

Send a message to peer

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`code` | number | message code |
`data` | any | message payload  |

**Returns:** *void*

___

###  sendStatus

▸ **sendStatus**(`status`: any): *void*

*Overrides [Sender](_net_protocol_sender_.sender.md).[sendStatus](_net_protocol_sender_.sender.md#protected-sendstatus)*

*Defined in [lib/net/protocol/libp2psender.ts:65](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/libp2psender.ts#L65)*

Send a status to peer

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`status` | any |   |

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
