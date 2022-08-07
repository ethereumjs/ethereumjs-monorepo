[ethereumjs-client](../README.md) › ["net/protocol/lesprotocol"](../modules/_net_protocol_lesprotocol_.md) › [LesProtocol](_net_protocol_lesprotocol_.lesprotocol.md)

# Class: LesProtocol

Implements les/1 and les/2 protocols

**`memberof`** module:net/protocol

## Hierarchy

↳ [Protocol](_net_protocol_protocol_.protocol.md)

↳ **LesProtocol**

## Index

### Constructors

- [constructor](_net_protocol_lesprotocol_.lesprotocol.md#constructor)

### Properties

- [config](_net_protocol_lesprotocol_.lesprotocol.md#config)
- [opened](_net_protocol_lesprotocol_.lesprotocol.md#opened)
- [timeout](_net_protocol_lesprotocol_.lesprotocol.md#timeout)

### Accessors

- [messages](_net_protocol_lesprotocol_.lesprotocol.md#messages)
- [name](_net_protocol_lesprotocol_.lesprotocol.md#name)
- [versions](_net_protocol_lesprotocol_.lesprotocol.md#versions)

### Methods

- [addListener](_net_protocol_lesprotocol_.lesprotocol.md#addlistener)
- [bind](_net_protocol_lesprotocol_.lesprotocol.md#bind)
- [decode](_net_protocol_lesprotocol_.lesprotocol.md#protected-decode)
- [decodeStatus](_net_protocol_lesprotocol_.lesprotocol.md#decodestatus)
- [emit](_net_protocol_lesprotocol_.lesprotocol.md#emit)
- [encode](_net_protocol_lesprotocol_.lesprotocol.md#protected-encode)
- [encodeStatus](_net_protocol_lesprotocol_.lesprotocol.md#encodestatus)
- [eventNames](_net_protocol_lesprotocol_.lesprotocol.md#eventnames)
- [getMaxListeners](_net_protocol_lesprotocol_.lesprotocol.md#getmaxlisteners)
- [handshake](_net_protocol_lesprotocol_.lesprotocol.md#private-handshake)
- [listenerCount](_net_protocol_lesprotocol_.lesprotocol.md#listenercount)
- [listeners](_net_protocol_lesprotocol_.lesprotocol.md#listeners)
- [off](_net_protocol_lesprotocol_.lesprotocol.md#off)
- [on](_net_protocol_lesprotocol_.lesprotocol.md#on)
- [once](_net_protocol_lesprotocol_.lesprotocol.md#once)
- [open](_net_protocol_lesprotocol_.lesprotocol.md#open)
- [prependListener](_net_protocol_lesprotocol_.lesprotocol.md#prependlistener)
- [prependOnceListener](_net_protocol_lesprotocol_.lesprotocol.md#prependoncelistener)
- [rawListeners](_net_protocol_lesprotocol_.lesprotocol.md#rawlisteners)
- [removeAllListeners](_net_protocol_lesprotocol_.lesprotocol.md#removealllisteners)
- [removeListener](_net_protocol_lesprotocol_.lesprotocol.md#removelistener)
- [setMaxListeners](_net_protocol_lesprotocol_.lesprotocol.md#setmaxlisteners)

## Constructors

### constructor

\+ **new LesProtocol**(`options`: [LesProtocolOptions](../interfaces/_net_protocol_lesprotocol_.lesprotocoloptions.md)): _[LesProtocol](_net_protocol_lesprotocol_.lesprotocol.md)_

_Overrides [Protocol](_net_protocol_protocol_.protocol.md).[constructor](_net_protocol_protocol_.protocol.md#constructor)_

_Defined in [lib/net/protocol/lesprotocol.ts:75](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/lesprotocol.ts#L75)_

Create les protocol

**Parameters:**

| Name      | Type                                                                                 |
| --------- | ------------------------------------------------------------------------------------ |
| `options` | [LesProtocolOptions](../interfaces/_net_protocol_lesprotocol_.lesprotocoloptions.md) |

**Returns:** _[LesProtocol](_net_protocol_lesprotocol_.lesprotocol.md)_

## Properties

### config

• **config**: _[Config](_config_.config.md)_

_Inherited from [EthProtocol](_net_protocol_ethprotocol_.ethprotocol.md).[config](_net_protocol_ethprotocol_.ethprotocol.md#config)_

_Defined in [lib/net/protocol/protocol.ts:41](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/protocol.ts#L41)_

---

### opened

• **opened**: _boolean_

_Inherited from [EthProtocol](_net_protocol_ethprotocol_.ethprotocol.md).[opened](_net_protocol_ethprotocol_.ethprotocol.md#opened)_

_Defined in [lib/net/protocol/protocol.ts:43](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/protocol.ts#L43)_

---

### timeout

• **timeout**: _number_

_Inherited from [EthProtocol](_net_protocol_ethprotocol_.ethprotocol.md).[timeout](_net_protocol_ethprotocol_.ethprotocol.md#timeout)_

_Defined in [lib/net/protocol/protocol.ts:42](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/protocol.ts#L42)_

## Accessors

### messages

• **get messages**(): _any_

_Overrides [Protocol](_net_protocol_protocol_.protocol.md).[messages](_net_protocol_protocol_.protocol.md#messages)_

_Defined in [lib/net/protocol/lesprotocol.ts:111](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/lesprotocol.ts#L111)_

Messages defined by this protocol

**`type`** {Protocol~Message[]}

**Returns:** _any_

---

### name

• **get name**(): _string_

_Overrides [Protocol](_net_protocol_protocol_.protocol.md).[name](_net_protocol_protocol_.protocol.md#name)_

_Defined in [lib/net/protocol/lesprotocol.ts:95](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/lesprotocol.ts#L95)_

Name of protocol

**`type`** {string}

**Returns:** _string_

---

### versions

• **get versions**(): _number[]_

_Overrides [Protocol](_net_protocol_protocol_.protocol.md).[versions](_net_protocol_protocol_.protocol.md#versions)_

_Defined in [lib/net/protocol/lesprotocol.ts:103](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/lesprotocol.ts#L103)_

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

_Inherited from [EthProtocol](_net_protocol_ethprotocol_.ethprotocol.md).[bind](_net_protocol_ethprotocol_.ethprotocol.md#bind)_

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

_Inherited from [EthProtocol](_net_protocol_ethprotocol_.ethprotocol.md).[decode](_net_protocol_ethprotocol_.ethprotocol.md#protected-decode)_

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

▸ **decodeStatus**(`status`: any): _any_

_Overrides [Protocol](_net_protocol_protocol_.protocol.md).[decodeStatus](_net_protocol_protocol_.protocol.md#decodestatus)_

_Defined in [lib/net/protocol/lesprotocol.ts:164](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/lesprotocol.ts#L164)_

Decodes ETH status message payload into a status object

**Parameters:**

| Name     | Type | Description            |
| -------- | ---- | ---------------------- |
| `status` | any  | status message payload |

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

_Inherited from [EthProtocol](_net_protocol_ethprotocol_.ethprotocol.md).[encode](_net_protocol_ethprotocol_.ethprotocol.md#protected-encode)_

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

_Overrides [Protocol](_net_protocol_protocol_.protocol.md).[encodeStatus](_net_protocol_protocol_.protocol.md#encodestatus)_

_Defined in [lib/net/protocol/lesprotocol.ts:131](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/lesprotocol.ts#L131)_

Encodes status into LES status message payload

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

_Inherited from [EthProtocol](_net_protocol_ethprotocol_.ethprotocol.md).[handshake](_net_protocol_ethprotocol_.ethprotocol.md#private-handshake)_

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

_Overrides [Protocol](_net_protocol_protocol_.protocol.md).[open](_net_protocol_protocol_.protocol.md#open)_

_Defined in [lib/net/protocol/lesprotocol.ts:119](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/lesprotocol.ts#L119)_

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
