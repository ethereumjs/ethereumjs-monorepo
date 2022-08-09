[ethereumjs-client](../README.md) › ["net/protocol/ethprotocol"](../modules/_net_protocol_ethprotocol_.md) › [EthProtocol](_net_protocol_ethprotocol_.ethprotocol.md)

# Class: EthProtocol

Implements eth/62 and eth/63 protocols

**`memberof`** module:net/protocol

## Hierarchy

↳ [Protocol](_net_protocol_protocol_.protocol.md)

↳ **EthProtocol**

## Index

### Constructors

- [constructor](_net_protocol_ethprotocol_.ethprotocol.md#constructor)

### Properties

- [config](_net_protocol_ethprotocol_.ethprotocol.md#config)
- [opened](_net_protocol_ethprotocol_.ethprotocol.md#opened)
- [timeout](_net_protocol_ethprotocol_.ethprotocol.md#timeout)

### Accessors

- [messages](_net_protocol_ethprotocol_.ethprotocol.md#messages)
- [name](_net_protocol_ethprotocol_.ethprotocol.md#name)
- [versions](_net_protocol_ethprotocol_.ethprotocol.md#versions)

### Methods

- [addListener](_net_protocol_ethprotocol_.ethprotocol.md#addlistener)
- [bind](_net_protocol_ethprotocol_.ethprotocol.md#bind)
- [decode](_net_protocol_ethprotocol_.ethprotocol.md#protected-decode)
- [decodeStatus](_net_protocol_ethprotocol_.ethprotocol.md#decodestatus)
- [emit](_net_protocol_ethprotocol_.ethprotocol.md#emit)
- [encode](_net_protocol_ethprotocol_.ethprotocol.md#protected-encode)
- [encodeStatus](_net_protocol_ethprotocol_.ethprotocol.md#encodestatus)
- [eventNames](_net_protocol_ethprotocol_.ethprotocol.md#eventnames)
- [getMaxListeners](_net_protocol_ethprotocol_.ethprotocol.md#getmaxlisteners)
- [handshake](_net_protocol_ethprotocol_.ethprotocol.md#private-handshake)
- [listenerCount](_net_protocol_ethprotocol_.ethprotocol.md#listenercount)
- [listeners](_net_protocol_ethprotocol_.ethprotocol.md#listeners)
- [off](_net_protocol_ethprotocol_.ethprotocol.md#off)
- [on](_net_protocol_ethprotocol_.ethprotocol.md#on)
- [once](_net_protocol_ethprotocol_.ethprotocol.md#once)
- [open](_net_protocol_ethprotocol_.ethprotocol.md#open)
- [prependListener](_net_protocol_ethprotocol_.ethprotocol.md#prependlistener)
- [prependOnceListener](_net_protocol_ethprotocol_.ethprotocol.md#prependoncelistener)
- [rawListeners](_net_protocol_ethprotocol_.ethprotocol.md#rawlisteners)
- [removeAllListeners](_net_protocol_ethprotocol_.ethprotocol.md#removealllisteners)
- [removeListener](_net_protocol_ethprotocol_.ethprotocol.md#removelistener)
- [setMaxListeners](_net_protocol_ethprotocol_.ethprotocol.md#setmaxlisteners)

## Constructors

### constructor

\+ **new EthProtocol**(`options`: EthProtocolOptions): _[EthProtocol](_net_protocol_ethprotocol_.ethprotocol.md)_

_Overrides [Protocol](_net_protocol_protocol_.protocol.md).[constructor](_net_protocol_protocol_.protocol.md#constructor)_

_Defined in [lib/net/protocol/ethprotocol.ts:58](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/ethprotocol.ts#L58)_

Create eth protocol

**Parameters:**

| Name      | Type               |
| --------- | ------------------ |
| `options` | EthProtocolOptions |

**Returns:** _[EthProtocol](_net_protocol_ethprotocol_.ethprotocol.md)_

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

• **get messages**(): _[Message](../modules/_net_protocol_protocol_.md#message)[]_

_Overrides [Protocol](_net_protocol_protocol_.protocol.md).[messages](_net_protocol_protocol_.protocol.md#messages)_

_Defined in [lib/net/protocol/ethprotocol.ts:90](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/ethprotocol.ts#L90)_

Messages defined by this protocol

**`type`** {Protocol~Message[]}

**Returns:** _[Message](../modules/_net_protocol_protocol_.md#message)[]_

---

### name

• **get name**(): _string_

_Overrides [Protocol](_net_protocol_protocol_.protocol.md).[name](_net_protocol_protocol_.protocol.md#name)_

_Defined in [lib/net/protocol/ethprotocol.ts:74](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/ethprotocol.ts#L74)_

Name of protocol

**`type`** {string}

**Returns:** _string_

---

### versions

• **get versions**(): _number[]_

_Overrides [Protocol](_net_protocol_protocol_.protocol.md).[versions](_net_protocol_protocol_.protocol.md#versions)_

_Defined in [lib/net/protocol/ethprotocol.ts:82](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/ethprotocol.ts#L82)_

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

_Defined in [lib/net/protocol/ethprotocol.ts:124](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/ethprotocol.ts#L124)_

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

_Defined in [lib/net/protocol/ethprotocol.ts:110](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/ethprotocol.ts#L110)_

Encodes status into ETH status message payload

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

_Defined in [lib/net/protocol/ethprotocol.ts:98](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/ethprotocol.ts#L98)_

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
