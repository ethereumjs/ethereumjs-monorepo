[ethereumjs-client](../README.md) › ["net/protocol/lesprotocol"](../modules/_net_protocol_lesprotocol_.md) › [LesProtocol](_net_protocol_lesprotocol_.lesprotocol.md)

# Class: LesProtocol

Implements les/1 and les/2 protocols

**`memberof`** module:net/protocol

## Hierarchy

  ↳ [Protocol](_net_protocol_protocol_.protocol.md)

  ↳ **LesProtocol**

## Index

### Constructors

* [constructor](_net_protocol_lesprotocol_.lesprotocol.md#constructor)

### Properties

* [config](_net_protocol_lesprotocol_.lesprotocol.md#config)
* [opened](_net_protocol_lesprotocol_.lesprotocol.md#opened)
* [timeout](_net_protocol_lesprotocol_.lesprotocol.md#timeout)

### Accessors

* [messages](_net_protocol_lesprotocol_.lesprotocol.md#messages)
* [name](_net_protocol_lesprotocol_.lesprotocol.md#name)
* [versions](_net_protocol_lesprotocol_.lesprotocol.md#versions)

### Methods

* [addListener](_net_protocol_lesprotocol_.lesprotocol.md#addlistener)
* [bind](_net_protocol_lesprotocol_.lesprotocol.md#bind)
* [decode](_net_protocol_lesprotocol_.lesprotocol.md#protected-decode)
* [decodeStatus](_net_protocol_lesprotocol_.lesprotocol.md#decodestatus)
* [emit](_net_protocol_lesprotocol_.lesprotocol.md#emit)
* [encode](_net_protocol_lesprotocol_.lesprotocol.md#protected-encode)
* [encodeStatus](_net_protocol_lesprotocol_.lesprotocol.md#encodestatus)
* [eventNames](_net_protocol_lesprotocol_.lesprotocol.md#eventnames)
* [getMaxListeners](_net_protocol_lesprotocol_.lesprotocol.md#getmaxlisteners)
* [handshake](_net_protocol_lesprotocol_.lesprotocol.md#private-handshake)
* [listenerCount](_net_protocol_lesprotocol_.lesprotocol.md#listenercount)
* [listeners](_net_protocol_lesprotocol_.lesprotocol.md#listeners)
* [off](_net_protocol_lesprotocol_.lesprotocol.md#off)
* [on](_net_protocol_lesprotocol_.lesprotocol.md#on)
* [once](_net_protocol_lesprotocol_.lesprotocol.md#once)
* [open](_net_protocol_lesprotocol_.lesprotocol.md#open)
* [prependListener](_net_protocol_lesprotocol_.lesprotocol.md#prependlistener)
* [prependOnceListener](_net_protocol_lesprotocol_.lesprotocol.md#prependoncelistener)
* [rawListeners](_net_protocol_lesprotocol_.lesprotocol.md#rawlisteners)
* [removeAllListeners](_net_protocol_lesprotocol_.lesprotocol.md#removealllisteners)
* [removeListener](_net_protocol_lesprotocol_.lesprotocol.md#removelistener)
* [setMaxListeners](_net_protocol_lesprotocol_.lesprotocol.md#setmaxlisteners)

## Constructors

###  constructor

\+ **new LesProtocol**(`options`: [LesProtocolOptions](../interfaces/_net_protocol_lesprotocol_.lesprotocoloptions.md)): *[LesProtocol](_net_protocol_lesprotocol_.lesprotocol.md)*

*Overrides [Protocol](_net_protocol_protocol_.protocol.md).[constructor](_net_protocol_protocol_.protocol.md#constructor)*

*Defined in [lib/net/protocol/lesprotocol.ts:75](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/lesprotocol.ts#L75)*

Create les protocol

**Parameters:**

Name | Type |
------ | ------ |
`options` | [LesProtocolOptions](../interfaces/_net_protocol_lesprotocol_.lesprotocoloptions.md) |

**Returns:** *[LesProtocol](_net_protocol_lesprotocol_.lesprotocol.md)*

## Properties

###  config

• **config**: *[Config](_config_.config.md)*

*Inherited from [EthProtocol](_net_protocol_ethprotocol_.ethprotocol.md).[config](_net_protocol_ethprotocol_.ethprotocol.md#config)*

*Defined in [lib/net/protocol/protocol.ts:41](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/protocol.ts#L41)*

___

###  opened

• **opened**: *boolean*

*Inherited from [EthProtocol](_net_protocol_ethprotocol_.ethprotocol.md).[opened](_net_protocol_ethprotocol_.ethprotocol.md#opened)*

*Defined in [lib/net/protocol/protocol.ts:43](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/protocol.ts#L43)*

___

###  timeout

• **timeout**: *number*

*Inherited from [EthProtocol](_net_protocol_ethprotocol_.ethprotocol.md).[timeout](_net_protocol_ethprotocol_.ethprotocol.md#timeout)*

*Defined in [lib/net/protocol/protocol.ts:42](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/protocol.ts#L42)*

## Accessors

###  messages

• **get messages**(): *any*

*Overrides [Protocol](_net_protocol_protocol_.protocol.md).[messages](_net_protocol_protocol_.protocol.md#messages)*

*Defined in [lib/net/protocol/lesprotocol.ts:111](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/lesprotocol.ts#L111)*

Messages defined by this protocol

**`type`** {Protocol~Message[]}

**Returns:** *any*

___

###  name

• **get name**(): *string*

*Overrides [Protocol](_net_protocol_protocol_.protocol.md).[name](_net_protocol_protocol_.protocol.md#name)*

*Defined in [lib/net/protocol/lesprotocol.ts:95](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/lesprotocol.ts#L95)*

Name of protocol

**`type`** {string}

**Returns:** *string*

___

###  versions

• **get versions**(): *number[]*

*Overrides [Protocol](_net_protocol_protocol_.protocol.md).[versions](_net_protocol_protocol_.protocol.md#versions)*

*Defined in [lib/net/protocol/lesprotocol.ts:103](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/lesprotocol.ts#L103)*

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

*Inherited from [EthProtocol](_net_protocol_ethprotocol_.ethprotocol.md).[bind](_net_protocol_ethprotocol_.ethprotocol.md#bind)*

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

*Inherited from [EthProtocol](_net_protocol_ethprotocol_.ethprotocol.md).[decode](_net_protocol_ethprotocol_.ethprotocol.md#protected-decode)*

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

▸ **decodeStatus**(`status`: any): *any*

*Overrides [Protocol](_net_protocol_protocol_.protocol.md).[decodeStatus](_net_protocol_protocol_.protocol.md#decodestatus)*

*Defined in [lib/net/protocol/lesprotocol.ts:164](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/lesprotocol.ts#L164)*

Decodes ETH status message payload into a status object

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`status` | any | status message payload |

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

*Inherited from [EthProtocol](_net_protocol_ethprotocol_.ethprotocol.md).[encode](_net_protocol_ethprotocol_.ethprotocol.md#protected-encode)*

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

*Overrides [Protocol](_net_protocol_protocol_.protocol.md).[encodeStatus](_net_protocol_protocol_.protocol.md#encodestatus)*

*Defined in [lib/net/protocol/lesprotocol.ts:131](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/lesprotocol.ts#L131)*

Encodes status into LES status message payload

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

*Inherited from [EthProtocol](_net_protocol_ethprotocol_.ethprotocol.md).[handshake](_net_protocol_ethprotocol_.ethprotocol.md#private-handshake)*

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

*Overrides [Protocol](_net_protocol_protocol_.protocol.md).[open](_net_protocol_protocol_.protocol.md#open)*

*Defined in [lib/net/protocol/lesprotocol.ts:119](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/lesprotocol.ts#L119)*

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
