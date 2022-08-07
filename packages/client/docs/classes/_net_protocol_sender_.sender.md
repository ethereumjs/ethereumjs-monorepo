[ethereumjs-client](../README.md) › ["net/protocol/sender"](../modules/_net_protocol_sender_.md) › [Sender](_net_protocol_sender_.sender.md)

# Class: Sender

Base class for transport specific message sender/receiver. Subclasses should
emit a message event when the sender receives a new message, and they should
emit a status event when the sender receives a handshake status message

**`emits`** message

**`emits`** status

**`memberof`** module:net/protocol

## Hierarchy

- EventEmitter

  ↳ **Sender**

  ↳ [RlpxSender](_net_protocol_rlpxsender_.rlpxsender.md)

  ↳ [Libp2pSender](_net_protocol_libp2psender_.libp2psender.md)

## Index

### Constructors

- [constructor](_net_protocol_sender_.sender.md#constructor)

### Properties

- [defaultMaxListeners](_net_protocol_sender_.sender.md#static-defaultmaxlisteners)
- [errorMonitor](_net_protocol_sender_.sender.md#static-errormonitor)

### Accessors

- [status](_net_protocol_sender_.sender.md#status)

### Methods

- [addListener](_net_protocol_sender_.sender.md#addlistener)
- [emit](_net_protocol_sender_.sender.md#emit)
- [eventNames](_net_protocol_sender_.sender.md#eventnames)
- [getMaxListeners](_net_protocol_sender_.sender.md#getmaxlisteners)
- [listenerCount](_net_protocol_sender_.sender.md#listenercount)
- [listeners](_net_protocol_sender_.sender.md#listeners)
- [off](_net_protocol_sender_.sender.md#off)
- [on](_net_protocol_sender_.sender.md#on)
- [once](_net_protocol_sender_.sender.md#once)
- [prependListener](_net_protocol_sender_.sender.md#prependlistener)
- [prependOnceListener](_net_protocol_sender_.sender.md#prependoncelistener)
- [rawListeners](_net_protocol_sender_.sender.md#rawlisteners)
- [removeAllListeners](_net_protocol_sender_.sender.md#removealllisteners)
- [removeListener](_net_protocol_sender_.sender.md#removelistener)
- [sendMessage](_net_protocol_sender_.sender.md#protected-sendmessage)
- [sendStatus](_net_protocol_sender_.sender.md#protected-sendstatus)
- [setMaxListeners](_net_protocol_sender_.sender.md#setmaxlisteners)
- [listenerCount](_net_protocol_sender_.sender.md#static-listenercount)

## Constructors

### constructor

\+ **new Sender**(): _[Sender](_net_protocol_sender_.sender.md)_

_Overrides void_

_Defined in [lib/net/protocol/sender.ts:12](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/sender.ts#L12)_

**Returns:** _[Sender](_net_protocol_sender_.sender.md)_

## Properties

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

### status

• **get status**(): _any_

_Defined in [lib/net/protocol/sender.ts:19](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/sender.ts#L19)_

**Returns:** _any_

• **set status**(`status`: any): _void_

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

### `Protected` sendMessage

▸ **sendMessage**(`_code`: number, `_rlpEncodedData`: any[] | Buffer): _void_

_Defined in [lib/net/protocol/sender.ts:43](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/sender.ts#L43)_

Send a message to peer

**Parameters:**

| Name              | Type                |
| ----------------- | ------------------- |
| `_code`           | number              |
| `_rlpEncodedData` | any[] &#124; Buffer |

**Returns:** _void_

---

### `Protected` sendStatus

▸ **sendStatus**(`_status`: any): _void_

_Defined in [lib/net/protocol/sender.ts:33](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/sender.ts#L33)_

Send a status to peer

**Parameters:**

| Name      | Type |
| --------- | ---- |
| `_status` | any  |

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
