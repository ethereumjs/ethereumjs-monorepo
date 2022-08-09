[ethereumjs-client](../README.md) › ["net/protocol/rlpxsender"](../modules/_net_protocol_rlpxsender_.md) › [RlpxSender](_net_protocol_rlpxsender_.rlpxsender.md)

# Class: RlpxSender

DevP2P/RLPx protocol sender

**`emits`** message

**`emits`** status

**`memberof`** module:net/protocol

## Hierarchy

↳ [Sender](_net_protocol_sender_.sender.md)

↳ **RlpxSender**

## Index

### Constructors

- [constructor](_net_protocol_rlpxsender_.rlpxsender.md#constructor)

### Accessors

- [status](_net_protocol_rlpxsender_.rlpxsender.md#status)

### Methods

- [addListener](_net_protocol_rlpxsender_.rlpxsender.md#addlistener)
- [emit](_net_protocol_rlpxsender_.rlpxsender.md#emit)
- [eventNames](_net_protocol_rlpxsender_.rlpxsender.md#eventnames)
- [getMaxListeners](_net_protocol_rlpxsender_.rlpxsender.md#getmaxlisteners)
- [listenerCount](_net_protocol_rlpxsender_.rlpxsender.md#listenercount)
- [listeners](_net_protocol_rlpxsender_.rlpxsender.md#listeners)
- [off](_net_protocol_rlpxsender_.rlpxsender.md#off)
- [on](_net_protocol_rlpxsender_.rlpxsender.md#on)
- [once](_net_protocol_rlpxsender_.rlpxsender.md#once)
- [prependListener](_net_protocol_rlpxsender_.rlpxsender.md#prependlistener)
- [prependOnceListener](_net_protocol_rlpxsender_.rlpxsender.md#prependoncelistener)
- [rawListeners](_net_protocol_rlpxsender_.rlpxsender.md#rawlisteners)
- [removeAllListeners](_net_protocol_rlpxsender_.rlpxsender.md#removealllisteners)
- [removeListener](_net_protocol_rlpxsender_.rlpxsender.md#removelistener)
- [sendMessage](_net_protocol_rlpxsender_.rlpxsender.md#sendmessage)
- [sendStatus](_net_protocol_rlpxsender_.rlpxsender.md#sendstatus)
- [setMaxListeners](_net_protocol_rlpxsender_.rlpxsender.md#setmaxlisteners)

## Constructors

### constructor

\+ **new RlpxSender**(`rlpxProtocol`: any): _[RlpxSender](_net_protocol_rlpxsender_.rlpxsender.md)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[constructor](_net_protocol_sender_.sender.md#constructor)_

_Defined in [lib/net/protocol/rlpxsender.ts:11](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/rlpxsender.ts#L11)_

Creates a new DevP2P/Rlpx protocol sender

**Parameters:**

| Name           | Type | Description                            |
| -------------- | ---- | -------------------------------------- |
| `rlpxProtocol` | any  | protocol object from ethereumjs-devp2p |

**Returns:** _[RlpxSender](_net_protocol_rlpxsender_.rlpxsender.md)_

## Accessors

### status

• **get status**(): _any_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[status](_net_protocol_sender_.sender.md#status)_

_Defined in [lib/net/protocol/sender.ts:19](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/sender.ts#L19)_

**Returns:** _any_

• **set status**(`status`: any): _void_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[status](_net_protocol_sender_.sender.md#status)_

_Defined in [lib/net/protocol/sender.ts:23](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/sender.ts#L23)_

**Parameters:**

| Name     | Type |
| -------- | ---- |
| `status` | any  |

**Returns:** _void_

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

### sendMessage

▸ **sendMessage**(`code`: number, `data`: any): _void_

_Overrides [Sender](_net_protocol_sender_.sender.md).[sendMessage](_net_protocol_sender_.sender.md#protected-sendmessage)_

_Defined in [lib/net/protocol/rlpxsender.ts:45](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/rlpxsender.ts#L45)_

Send a message to peer

**Parameters:**

| Name   | Type   | Description     |
| ------ | ------ | --------------- |
| `code` | number | message code    |
| `data` | any    | message payload |

**Returns:** _void_

---

### sendStatus

▸ **sendStatus**(`status`: any): _void_

_Overrides [Sender](_net_protocol_sender_.sender.md).[sendStatus](_net_protocol_sender_.sender.md#protected-sendstatus)_

_Defined in [lib/net/protocol/rlpxsender.ts:32](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/rlpxsender.ts#L32)_

Send a status to peer

**Parameters:**

| Name     | Type | Description |
| -------- | ---- | ----------- |
| `status` | any  |             |

**Returns:** _void_

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
