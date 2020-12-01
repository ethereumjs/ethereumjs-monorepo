[ethereumjs-client](../README.md) › ["net/protocol/protocol"](../modules/_net_protocol_protocol_.md) › [Protocol](_net_protocol_protocol_.protocol.md)

# Class: Protocol

Base class for all wire protocols

**`memberof`** module:net/protocol

## Hierarchy

* EventEmitter

  ↳ **Protocol**

  ↳ [EthProtocol](_net_protocol_ethprotocol_.ethprotocol.md)

  ↳ [LesProtocol](_net_protocol_lesprotocol_.lesprotocol.md)

## Index

### Constructors

* [constructor](_net_protocol_protocol_.protocol.md#constructor)

### Properties

* [config](_net_protocol_protocol_.protocol.md#config)
* [opened](_net_protocol_protocol_.protocol.md#opened)
* [timeout](_net_protocol_protocol_.protocol.md#timeout)
* [defaultMaxListeners](_net_protocol_protocol_.protocol.md#static-defaultmaxlisteners)
* [errorMonitor](_net_protocol_protocol_.protocol.md#static-errormonitor)

### Accessors

* [messages](_net_protocol_protocol_.protocol.md#messages)
* [name](_net_protocol_protocol_.protocol.md#name)
* [versions](_net_protocol_protocol_.protocol.md#versions)

### Methods

* [addListener](_net_protocol_protocol_.protocol.md#addlistener)
* [bind](_net_protocol_protocol_.protocol.md#bind)
* [decode](_net_protocol_protocol_.protocol.md#protected-decode)
* [decodeStatus](_net_protocol_protocol_.protocol.md#decodestatus)
* [emit](_net_protocol_protocol_.protocol.md#emit)
* [encode](_net_protocol_protocol_.protocol.md#protected-encode)
* [encodeStatus](_net_protocol_protocol_.protocol.md#encodestatus)
* [eventNames](_net_protocol_protocol_.protocol.md#eventnames)
* [getMaxListeners](_net_protocol_protocol_.protocol.md#getmaxlisteners)
* [handshake](_net_protocol_protocol_.protocol.md#private-handshake)
* [listenerCount](_net_protocol_protocol_.protocol.md#listenercount)
* [listeners](_net_protocol_protocol_.protocol.md#listeners)
* [off](_net_protocol_protocol_.protocol.md#off)
* [on](_net_protocol_protocol_.protocol.md#on)
* [once](_net_protocol_protocol_.protocol.md#once)
* [open](_net_protocol_protocol_.protocol.md#open)
* [prependListener](_net_protocol_protocol_.protocol.md#prependlistener)
* [prependOnceListener](_net_protocol_protocol_.protocol.md#prependoncelistener)
* [rawListeners](_net_protocol_protocol_.protocol.md#rawlisteners)
* [removeAllListeners](_net_protocol_protocol_.protocol.md#removealllisteners)
* [removeListener](_net_protocol_protocol_.protocol.md#removelistener)
* [setMaxListeners](_net_protocol_protocol_.protocol.md#setmaxlisteners)
* [listenerCount](_net_protocol_protocol_.protocol.md#static-listenercount)

## Constructors

###  constructor

\+ **new Protocol**(`options`: [ProtocolOptions](../interfaces/_net_protocol_protocol_.protocoloptions.md)): *[Protocol](_net_protocol_protocol_.protocol.md)*

*Overrides void*

*Defined in [lib/net/protocol/protocol.ts:43](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/protocol.ts#L43)*

Create new protocol

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ProtocolOptions](../interfaces/_net_protocol_protocol_.protocoloptions.md) |

**Returns:** *[Protocol](_net_protocol_protocol_.protocol.md)*

## Properties

###  config

• **config**: *[Config](_config_.config.md)*

*Defined in [lib/net/protocol/protocol.ts:41](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/protocol.ts#L41)*

___

###  opened

• **opened**: *boolean*

*Defined in [lib/net/protocol/protocol.ts:43](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/protocol.ts#L43)*

___

###  timeout

• **timeout**: *number*

*Defined in [lib/net/protocol/protocol.ts:42](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/protocol.ts#L42)*

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

###  messages

• **get messages**(): *[Message](../modules/_net_protocol_protocol_.md#message)[]*

*Defined in [lib/net/protocol/protocol.ts:113](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/protocol.ts#L113)*

Messages defined by this protocol

**`type`** {Protocol~Message[]}

**Returns:** *[Message](../modules/_net_protocol_protocol_.md#message)[]*

___

###  name

• **get name**(): *string*

*Defined in [lib/net/protocol/protocol.ts:97](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/protocol.ts#L97)*

Abstract getter for name of protocol

**`type`** {string}

**Returns:** *string*

___

###  versions

• **get versions**(): *number[]*

*Defined in [lib/net/protocol/protocol.ts:105](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/protocol.ts#L105)*

Protocol versions supported

**`type`** {number[]}

**Returns:** *number[]*

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

###  bind

▸ **bind**(`peer`: [Peer](_net_peer_peer_.peer.md), `sender`: [Sender](_net_protocol_sender_.sender.md)): *Promise‹[BoundProtocol](_net_protocol_boundprotocol_.boundprotocol.md)›*

*Defined in [lib/net/protocol/protocol.ts:171](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/protocol.ts#L171)*

Binds this protocol to a given peer using the specified sender to handle
message communication.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`peer` | [Peer](_net_peer_peer_.peer.md) | peer |
`sender` | [Sender](_net_protocol_sender_.sender.md) | sender |

**Returns:** *Promise‹[BoundProtocol](_net_protocol_boundprotocol_.boundprotocol.md)›*

___

### `Protected` decode

▸ **decode**(`message`: [Message](../modules/_net_protocol_protocol_.md#message), `payload`: any): *any*

*Defined in [lib/net/protocol/protocol.ts:157](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/protocol.ts#L157)*

Decodes message payload

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`message` | [Message](../modules/_net_protocol_protocol_.md#message) | message definition |
`payload` | any | message payload |

**Returns:** *any*

___

###  decodeStatus

▸ **decodeStatus**(`_status`: any): *any*

*Defined in [lib/net/protocol/protocol.ts:131](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/protocol.ts#L131)*

Decodes status message payload into a status object.  Must be implemented
by subclass.

**Parameters:**

Name | Type |
------ | ------ |
`_status` | any |

**Returns:** *any*

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

### `Protected` encode

▸ **encode**(`message`: [Message](../modules/_net_protocol_protocol_.md#message), `args`: any): *any*

*Defined in [lib/net/protocol/protocol.ts:142](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/protocol.ts#L142)*

Encodes message into proper format before sending

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`message` | [Message](../modules/_net_protocol_protocol_.md#message) | message definition |
`args` | any | message arguments |

**Returns:** *any*

___

###  encodeStatus

▸ **encodeStatus**(): *any*

*Defined in [lib/net/protocol/protocol.ts:121](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/protocol.ts#L121)*

Encodes status into status message payload. Must be implemented by subclass.

**Returns:** *any*

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

### `Private` handshake

▸ **handshake**(`sender`: [Sender](_net_protocol_sender_.sender.md)): *Promise‹unknown›*

*Defined in [lib/net/protocol/protocol.ts:71](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/protocol.ts#L71)*

Perform handshake given a sender from subclass.

**Parameters:**

Name | Type |
------ | ------ |
`sender` | [Sender](_net_protocol_sender_.sender.md) |

**Returns:** *Promise‹unknown›*

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

▸ **open**(): *Promise‹boolean | void›*

*Defined in [lib/net/protocol/protocol.ts:62](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/protocol.ts#L62)*

Opens protocol and any associated dependencies

**Returns:** *Promise‹boolean | void›*

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
