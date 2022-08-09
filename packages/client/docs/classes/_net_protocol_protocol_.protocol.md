[ethereumjs-client](../README.md) › ["net/protocol/protocol"](../modules/_net_protocol_protocol_.md) › [Protocol](_net_protocol_protocol_.protocol.md)

# Class: Protocol

Base class for all wire protocols

**`memberof`** module:net/protocol

## Hierarchy

- EventEmitter

  ↳ **Protocol**

  ↳ [EthProtocol](_net_protocol_ethprotocol_.ethprotocol.md)

  ↳ [LesProtocol](_net_protocol_lesprotocol_.lesprotocol.md)

## Index

### Constructors

- [constructor](_net_protocol_protocol_.protocol.md#constructor)

### Properties

- [config](_net_protocol_protocol_.protocol.md#config)
- [opened](_net_protocol_protocol_.protocol.md#opened)
- [timeout](_net_protocol_protocol_.protocol.md#timeout)
- [defaultMaxListeners](_net_protocol_protocol_.protocol.md#static-defaultmaxlisteners)
- [errorMonitor](_net_protocol_protocol_.protocol.md#static-errormonitor)

### Accessors

- [messages](_net_protocol_protocol_.protocol.md#messages)
- [name](_net_protocol_protocol_.protocol.md#name)
- [versions](_net_protocol_protocol_.protocol.md#versions)

### Methods

- [addListener](_net_protocol_protocol_.protocol.md#addlistener)
- [bind](_net_protocol_protocol_.protocol.md#bind)
- [decode](_net_protocol_protocol_.protocol.md#protected-decode)
- [decodeStatus](_net_protocol_protocol_.protocol.md#decodestatus)
- [emit](_net_protocol_protocol_.protocol.md#emit)
- [encode](_net_protocol_protocol_.protocol.md#protected-encode)
- [encodeStatus](_net_protocol_protocol_.protocol.md#encodestatus)
- [eventNames](_net_protocol_protocol_.protocol.md#eventnames)
- [getMaxListeners](_net_protocol_protocol_.protocol.md#getmaxlisteners)
- [handshake](_net_protocol_protocol_.protocol.md#private-handshake)
- [listenerCount](_net_protocol_protocol_.protocol.md#listenercount)
- [listeners](_net_protocol_protocol_.protocol.md#listeners)
- [off](_net_protocol_protocol_.protocol.md#off)
- [on](_net_protocol_protocol_.protocol.md#on)
- [once](_net_protocol_protocol_.protocol.md#once)
- [open](_net_protocol_protocol_.protocol.md#open)
- [prependListener](_net_protocol_protocol_.protocol.md#prependlistener)
- [prependOnceListener](_net_protocol_protocol_.protocol.md#prependoncelistener)
- [rawListeners](_net_protocol_protocol_.protocol.md#rawlisteners)
- [removeAllListeners](_net_protocol_protocol_.protocol.md#removealllisteners)
- [removeListener](_net_protocol_protocol_.protocol.md#removelistener)
- [setMaxListeners](_net_protocol_protocol_.protocol.md#setmaxlisteners)
- [listenerCount](_net_protocol_protocol_.protocol.md#static-listenercount)

## Constructors

### constructor

\+ **new Protocol**(`options`: [ProtocolOptions](../interfaces/_net_protocol_protocol_.protocoloptions.md)): _[Protocol](_net_protocol_protocol_.protocol.md)_

_Overrides void_

_Defined in [lib/net/protocol/protocol.ts:43](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/protocol.ts#L43)_

Create new protocol

**Parameters:**

| Name      | Type                                                                        |
| --------- | --------------------------------------------------------------------------- |
| `options` | [ProtocolOptions](../interfaces/_net_protocol_protocol_.protocoloptions.md) |

**Returns:** _[Protocol](_net_protocol_protocol_.protocol.md)_

## Properties

### config

• **config**: _[Config](_config_.config.md)_

_Defined in [lib/net/protocol/protocol.ts:41](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/protocol.ts#L41)_

---

### opened

• **opened**: _boolean_

_Defined in [lib/net/protocol/protocol.ts:43](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/protocol.ts#L43)_

---

### timeout

• **timeout**: _number_

_Defined in [lib/net/protocol/protocol.ts:42](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/protocol.ts#L42)_

---

### `Static` defaultMaxListeners

▪ **defaultMaxListeners**: _number_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[defaultMaxListeners](_net_protocol_sender_.sender.md#static-defaultmaxlisteners)_

Defined in node_modules/@types/node/events.d.ts:45

---

### `Static` errorMonitor

▪ **errorMonitor**: _keyof symbol_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[errorMonitor](_net_protocol_sender_.sender.md#static-errormonitor)_

Defined in node_modules/@types/node/events.d.ts:55

This symbol shall be used to install a listener for only monitoring `'error'`
events. Listeners installed using this symbol are called before the regular
`'error'` listeners are called.

Installing a listener using this symbol does not change the behavior once an
`'error'` event is emitted, therefore the process will still crash if no
regular `'error'` listener is installed.

## Accessors

### messages

• **get messages**(): _[Message](../modules/_net_protocol_protocol_.md#message)[]_

_Defined in [lib/net/protocol/protocol.ts:113](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/protocol.ts#L113)_

Messages defined by this protocol

**`type`** {Protocol~Message[]}

**Returns:** _[Message](../modules/_net_protocol_protocol_.md#message)[]_

---

### name

• **get name**(): _string_

_Defined in [lib/net/protocol/protocol.ts:97](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/protocol.ts#L97)_

Abstract getter for name of protocol

**`type`** {string}

**Returns:** _string_

---

### versions

• **get versions**(): _number[]_

_Defined in [lib/net/protocol/protocol.ts:105](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/protocol.ts#L105)_

Protocol versions supported

**`type`** {number[]}

**Returns:** _number[]_

## Methods

### addListener

▸ **addListener**(`event`: string | symbol, `listener`: function): _this_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[addListener](_net_protocol_sender_.sender.md#addlistener)_

Defined in node_modules/@types/node/events.d.ts:62

**Parameters:**

▪ **event**: _string | symbol_

▪ **listener**: _function_

▸ (...`args`: any[]): _void_

**Parameters:**

| Name      | Type  |
| --------- | ----- |
| `...args` | any[] |

**Returns:** _this_

---

### bind

▸ **bind**(`peer`: [Peer](_net_peer_peer_.peer.md), `sender`: [Sender](_net_protocol_sender_.sender.md)): _Promise‹[BoundProtocol](_net_protocol_boundprotocol_.boundprotocol.md)›_

_Defined in [lib/net/protocol/protocol.ts:171](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/protocol.ts#L171)_

Binds this protocol to a given peer using the specified sender to handle
message communication.

**Parameters:**

| Name     | Type                                      | Description |
| -------- | ----------------------------------------- | ----------- |
| `peer`   | [Peer](_net_peer_peer_.peer.md)           | peer        |
| `sender` | [Sender](_net_protocol_sender_.sender.md) | sender      |

**Returns:** _Promise‹[BoundProtocol](_net_protocol_boundprotocol_.boundprotocol.md)›_

---

### `Protected` decode

▸ **decode**(`message`: [Message](../modules/_net_protocol_protocol_.md#message), `payload`: any): _any_

_Defined in [lib/net/protocol/protocol.ts:157](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/protocol.ts#L157)_

Decodes message payload

**Parameters:**

| Name      | Type                                                     | Description        |
| --------- | -------------------------------------------------------- | ------------------ |
| `message` | [Message](../modules/_net_protocol_protocol_.md#message) | message definition |
| `payload` | any                                                      | message payload    |

**Returns:** _any_

---

### decodeStatus

▸ **decodeStatus**(`_status`: any): _any_

_Defined in [lib/net/protocol/protocol.ts:131](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/protocol.ts#L131)_

Decodes status message payload into a status object. Must be implemented
by subclass.

**Parameters:**

| Name      | Type |
| --------- | ---- |
| `_status` | any  |

**Returns:** _any_

---

### emit

▸ **emit**(`event`: string | symbol, ...`args`: any[]): _boolean_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[emit](_net_protocol_sender_.sender.md#emit)_

Defined in node_modules/@types/node/events.d.ts:72

**Parameters:**

| Name      | Type                 |
| --------- | -------------------- |
| `event`   | string &#124; symbol |
| `...args` | any[]                |

**Returns:** _boolean_

---

### `Protected` encode

▸ **encode**(`message`: [Message](../modules/_net_protocol_protocol_.md#message), `args`: any): _any_

_Defined in [lib/net/protocol/protocol.ts:142](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/protocol.ts#L142)_

Encodes message into proper format before sending

**Parameters:**

| Name      | Type                                                     | Description        |
| --------- | -------------------------------------------------------- | ------------------ |
| `message` | [Message](../modules/_net_protocol_protocol_.md#message) | message definition |
| `args`    | any                                                      | message arguments  |

**Returns:** _any_

---

### encodeStatus

▸ **encodeStatus**(): _any_

_Defined in [lib/net/protocol/protocol.ts:121](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/protocol.ts#L121)_

Encodes status into status message payload. Must be implemented by subclass.

**Returns:** _any_

---

### eventNames

▸ **eventNames**(): _Array‹string | symbol›_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[eventNames](_net_protocol_sender_.sender.md#eventnames)_

Defined in node_modules/@types/node/events.d.ts:77

**Returns:** _Array‹string | symbol›_

---

### getMaxListeners

▸ **getMaxListeners**(): _number_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[getMaxListeners](_net_protocol_sender_.sender.md#getmaxlisteners)_

Defined in node_modules/@types/node/events.d.ts:69

**Returns:** _number_

---

### `Private` handshake

▸ **handshake**(`sender`: [Sender](_net_protocol_sender_.sender.md)): _Promise‹unknown›_

_Defined in [lib/net/protocol/protocol.ts:71](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/protocol.ts#L71)_

Perform handshake given a sender from subclass.

**Parameters:**

| Name     | Type                                      |
| -------- | ----------------------------------------- |
| `sender` | [Sender](_net_protocol_sender_.sender.md) |

**Returns:** _Promise‹unknown›_

---

### listenerCount

▸ **listenerCount**(`event`: string | symbol): _number_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[listenerCount](_net_protocol_sender_.sender.md#listenercount)_

Defined in node_modules/@types/node/events.d.ts:73

**Parameters:**

| Name    | Type                 |
| ------- | -------------------- |
| `event` | string &#124; symbol |

**Returns:** _number_

---

### listeners

▸ **listeners**(`event`: string | symbol): _Function[]_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[listeners](_net_protocol_sender_.sender.md#listeners)_

Defined in node_modules/@types/node/events.d.ts:70

**Parameters:**

| Name    | Type                 |
| ------- | -------------------- |
| `event` | string &#124; symbol |

**Returns:** _Function[]_

---

### off

▸ **off**(`event`: string | symbol, `listener`: function): _this_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[off](_net_protocol_sender_.sender.md#off)_

Defined in node_modules/@types/node/events.d.ts:66

**Parameters:**

▪ **event**: _string | symbol_

▪ **listener**: _function_

▸ (...`args`: any[]): _void_

**Parameters:**

| Name      | Type  |
| --------- | ----- |
| `...args` | any[] |

**Returns:** _this_

---

### on

▸ **on**(`event`: string | symbol, `listener`: function): _this_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[on](_net_protocol_sender_.sender.md#on)_

Defined in node_modules/@types/node/events.d.ts:63

**Parameters:**

▪ **event**: _string | symbol_

▪ **listener**: _function_

▸ (...`args`: any[]): _void_

**Parameters:**

| Name      | Type  |
| --------- | ----- |
| `...args` | any[] |

**Returns:** _this_

---

### once

▸ **once**(`event`: string | symbol, `listener`: function): _this_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[once](_net_protocol_sender_.sender.md#once)_

Defined in node_modules/@types/node/events.d.ts:64

**Parameters:**

▪ **event**: _string | symbol_

▪ **listener**: _function_

▸ (...`args`: any[]): _void_

**Parameters:**

| Name      | Type  |
| --------- | ----- |
| `...args` | any[] |

**Returns:** _this_

---

### open

▸ **open**(): _Promise‹boolean | void›_

_Defined in [lib/net/protocol/protocol.ts:62](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/protocol.ts#L62)_

Opens protocol and any associated dependencies

**Returns:** _Promise‹boolean | void›_

---

### prependListener

▸ **prependListener**(`event`: string | symbol, `listener`: function): _this_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[prependListener](_net_protocol_sender_.sender.md#prependlistener)_

Defined in node_modules/@types/node/events.d.ts:75

**Parameters:**

▪ **event**: _string | symbol_

▪ **listener**: _function_

▸ (...`args`: any[]): _void_

**Parameters:**

| Name      | Type  |
| --------- | ----- |
| `...args` | any[] |

**Returns:** _this_

---

### prependOnceListener

▸ **prependOnceListener**(`event`: string | symbol, `listener`: function): _this_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[prependOnceListener](_net_protocol_sender_.sender.md#prependoncelistener)_

Defined in node_modules/@types/node/events.d.ts:76

**Parameters:**

▪ **event**: _string | symbol_

▪ **listener**: _function_

▸ (...`args`: any[]): _void_

**Parameters:**

| Name      | Type  |
| --------- | ----- |
| `...args` | any[] |

**Returns:** _this_

---

### rawListeners

▸ **rawListeners**(`event`: string | symbol): _Function[]_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[rawListeners](_net_protocol_sender_.sender.md#rawlisteners)_

Defined in node_modules/@types/node/events.d.ts:71

**Parameters:**

| Name    | Type                 |
| ------- | -------------------- |
| `event` | string &#124; symbol |

**Returns:** _Function[]_

---

### removeAllListeners

▸ **removeAllListeners**(`event?`: string | symbol): _this_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[removeAllListeners](_net_protocol_sender_.sender.md#removealllisteners)_

Defined in node_modules/@types/node/events.d.ts:67

**Parameters:**

| Name     | Type                 |
| -------- | -------------------- |
| `event?` | string &#124; symbol |

**Returns:** _this_

---

### removeListener

▸ **removeListener**(`event`: string | symbol, `listener`: function): _this_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[removeListener](_net_protocol_sender_.sender.md#removelistener)_

Defined in node_modules/@types/node/events.d.ts:65

**Parameters:**

▪ **event**: _string | symbol_

▪ **listener**: _function_

▸ (...`args`: any[]): _void_

**Parameters:**

| Name      | Type  |
| --------- | ----- |
| `...args` | any[] |

**Returns:** _this_

---

### setMaxListeners

▸ **setMaxListeners**(`n`: number): _this_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[setMaxListeners](_net_protocol_sender_.sender.md#setmaxlisteners)_

Defined in node_modules/@types/node/events.d.ts:68

**Parameters:**

| Name | Type   |
| ---- | ------ |
| `n`  | number |

**Returns:** _this_

---

### `Static` listenerCount

▸ **listenerCount**(`emitter`: EventEmitter, `event`: string | symbol): _number_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[listenerCount](_net_protocol_sender_.sender.md#static-listenercount)_

Defined in node_modules/@types/node/events.d.ts:44

**`deprecated`** since v4.0.0

**Parameters:**

| Name      | Type                 |
| --------- | -------------------- |
| `emitter` | EventEmitter         |
| `event`   | string &#124; symbol |

**Returns:** _number_
