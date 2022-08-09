[ethereumjs-client](../README.md) › ["net/protocol/boundprotocol"](../modules/_net_protocol_boundprotocol_.md) › [BoundProtocol](_net_protocol_boundprotocol_.boundprotocol.md)

# Class: BoundProtocol

Binds a protocol implementation to the specified peer

**`memberof`** module:net/protocol

## Hierarchy

- EventEmitter

  ↳ **BoundProtocol**

## Index

### Constructors

- [constructor](_net_protocol_boundprotocol_.boundprotocol.md#constructor)

### Properties

- [config](_net_protocol_boundprotocol_.boundprotocol.md#config)
- [name](_net_protocol_boundprotocol_.boundprotocol.md#name)
- [defaultMaxListeners](_net_protocol_boundprotocol_.boundprotocol.md#static-defaultmaxlisteners)
- [errorMonitor](_net_protocol_boundprotocol_.boundprotocol.md#static-errormonitor)

### Accessors

- [status](_net_protocol_boundprotocol_.boundprotocol.md#status)

### Methods

- [addListener](_net_protocol_boundprotocol_.boundprotocol.md#addlistener)
- [addMethods](_net_protocol_boundprotocol_.boundprotocol.md#addmethods)
- [emit](_net_protocol_boundprotocol_.boundprotocol.md#emit)
- [eventNames](_net_protocol_boundprotocol_.boundprotocol.md#eventnames)
- [getMaxListeners](_net_protocol_boundprotocol_.boundprotocol.md#getmaxlisteners)
- [handle](_net_protocol_boundprotocol_.boundprotocol.md#private-handle)
- [handshake](_net_protocol_boundprotocol_.boundprotocol.md#handshake)
- [listenerCount](_net_protocol_boundprotocol_.boundprotocol.md#listenercount)
- [listeners](_net_protocol_boundprotocol_.boundprotocol.md#listeners)
- [off](_net_protocol_boundprotocol_.boundprotocol.md#off)
- [on](_net_protocol_boundprotocol_.boundprotocol.md#on)
- [once](_net_protocol_boundprotocol_.boundprotocol.md#once)
- [prependListener](_net_protocol_boundprotocol_.boundprotocol.md#prependlistener)
- [prependOnceListener](_net_protocol_boundprotocol_.boundprotocol.md#prependoncelistener)
- [rawListeners](_net_protocol_boundprotocol_.boundprotocol.md#rawlisteners)
- [removeAllListeners](_net_protocol_boundprotocol_.boundprotocol.md#removealllisteners)
- [removeListener](_net_protocol_boundprotocol_.boundprotocol.md#removelistener)
- [request](_net_protocol_boundprotocol_.boundprotocol.md#request)
- [send](_net_protocol_boundprotocol_.boundprotocol.md#send)
- [setMaxListeners](_net_protocol_boundprotocol_.boundprotocol.md#setmaxlisteners)
- [listenerCount](_net_protocol_boundprotocol_.boundprotocol.md#static-listenercount)

## Constructors

### constructor

\+ **new BoundProtocol**(`options`: [BoundProtocolOptions](../interfaces/_net_protocol_boundprotocol_.boundprotocoloptions.md)): _[BoundProtocol](_net_protocol_boundprotocol_.boundprotocol.md)_

_Overrides void_

_Defined in [lib/net/protocol/boundprotocol.ts:30](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/boundprotocol.ts#L30)_

Create bound protocol

**Parameters:**

| Name      | Type                                                                                       |
| --------- | ------------------------------------------------------------------------------------------ |
| `options` | [BoundProtocolOptions](../interfaces/_net_protocol_boundprotocol_.boundprotocoloptions.md) |

**Returns:** _[BoundProtocol](_net_protocol_boundprotocol_.boundprotocol.md)_

## Properties

### config

• **config**: _[Config](_config_.config.md)_

_Defined in [lib/net/protocol/boundprotocol.ts:22](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/boundprotocol.ts#L22)_

---

### name

• **name**: _string_

_Defined in [lib/net/protocol/boundprotocol.ts:23](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/boundprotocol.ts#L23)_

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

### status

• **get status**(): _any_

_Defined in [lib/net/protocol/boundprotocol.ts:61](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/boundprotocol.ts#L61)_

**Returns:** _any_

• **set status**(`status`: any): _void_

_Defined in [lib/net/protocol/boundprotocol.ts:65](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/boundprotocol.ts#L65)_

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

### addMethods

▸ **addMethods**(): _void_

_Defined in [lib/net/protocol/boundprotocol.ts:161](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/boundprotocol.ts#L161)_

Add a methods to the bound protocol for each protocol message that has a
corresponding response message

**Returns:** _void_

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

### `Private` handle

▸ **handle**(`incoming`: any): _void_

_Defined in [lib/net/protocol/boundprotocol.ts:79](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/boundprotocol.ts#L79)_

Handle incoming message

**`emits`** message

**Parameters:**

| Name       | Type |
| ---------- | ---- |
| `incoming` | any  |

**Returns:** _void_

---

### handshake

▸ **handshake**(`sender`: [Sender](_net_protocol_sender_.sender.md)): _Promise‹void›_

_Defined in [lib/net/protocol/boundprotocol.ts:69](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/boundprotocol.ts#L69)_

**Parameters:**

| Name     | Type                                      |
| -------- | ----------------------------------------- |
| `sender` | [Sender](_net_protocol_sender_.sender.md) |

**Returns:** _Promise‹void›_

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

### request

▸ **request**(`name`: string, `args`: any[]): _Promise‹any›_

_Defined in [lib/net/protocol/boundprotocol.ts:135](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/boundprotocol.ts#L135)_

Returns a promise that resolves with the message payload when a response
to the specified message is received

**Parameters:**

| Name   | Type   | Description         |
| ------ | ------ | ------------------- |
| `name` | string | message to wait for |
| `args` | any[]  | message arguments   |

**Returns:** _Promise‹any›_

---

### send

▸ **send**(`name`: string, `args?`: any): _any_

_Defined in [lib/net/protocol/boundprotocol.ts:116](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/boundprotocol.ts#L116)_

Send message with name and the specified args

**Parameters:**

| Name    | Type   | Description       |
| ------- | ------ | ----------------- |
| `name`  | string | message name      |
| `args?` | any    | message arguments |

**Returns:** _any_

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
