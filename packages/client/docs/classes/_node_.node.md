[ethereumjs-client](../README.md) › ["node"](../modules/_node_.md) › [Node](_node_.node.md)

# Class: Node

Represents the top-level ethereum node, and is responsible for managing the
lifecycle of included services.

**`memberof`** module:node

## Hierarchy

- EventEmitter

  ↳ **Node**

## Index

### Constructors

- [constructor](_node_.node.md#constructor)

### Properties

- [config](_node_.node.md#config)
- [opened](_node_.node.md#opened)
- [services](_node_.node.md#services)
- [started](_node_.node.md#started)
- [defaultMaxListeners](_node_.node.md#static-defaultmaxlisteners)
- [errorMonitor](_node_.node.md#static-errormonitor)

### Methods

- [addListener](_node_.node.md#addlistener)
- [emit](_node_.node.md#emit)
- [eventNames](_node_.node.md#eventnames)
- [getMaxListeners](_node_.node.md#getmaxlisteners)
- [listenerCount](_node_.node.md#listenercount)
- [listeners](_node_.node.md#listeners)
- [off](_node_.node.md#off)
- [on](_node_.node.md#on)
- [once](_node_.node.md#once)
- [open](_node_.node.md#open)
- [prependListener](_node_.node.md#prependlistener)
- [prependOnceListener](_node_.node.md#prependoncelistener)
- [rawListeners](_node_.node.md#rawlisteners)
- [removeAllListeners](_node_.node.md#removealllisteners)
- [removeListener](_node_.node.md#removelistener)
- [server](_node_.node.md#server)
- [service](_node_.node.md#service)
- [setMaxListeners](_node_.node.md#setmaxlisteners)
- [start](_node_.node.md#start)
- [stop](_node_.node.md#stop)
- [listenerCount](_node_.node.md#static-listenercount)

## Constructors

### constructor

\+ **new Node**(`options`: [NodeOptions](../interfaces/_node_.nodeoptions.md)): _[Node](_node_.node.md)_

_Overrides void_

_Defined in [lib/node.ts:35](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/node.ts#L35)_

Create new node

**Parameters:**

| Name      | Type                                               |
| --------- | -------------------------------------------------- |
| `options` | [NodeOptions](../interfaces/_node_.nodeoptions.md) |

**Returns:** _[Node](_node_.node.md)_

## Properties

### config

• **config**: _[Config](_config_.config.md)_

_Defined in [lib/node.ts:30](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/node.ts#L30)_

---

### opened

• **opened**: _boolean_

_Defined in [lib/node.ts:34](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/node.ts#L34)_

---

### services

• **services**: _([FullEthereumService](_service_fullethereumservice_.fullethereumservice.md)‹› | [LightEthereumService](_service_lightethereumservice_.lightethereumservice.md)‹›)[]_

_Defined in [lib/node.ts:32](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/node.ts#L32)_

---

### started

• **started**: _boolean_

_Defined in [lib/node.ts:35](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/node.ts#L35)_

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

### open

▸ **open**(): _Promise‹undefined | false›_

_Defined in [lib/node.ts:65](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/node.ts#L65)_

Open node. Must be called before node is started

**Returns:** _Promise‹undefined | false›_

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

### server

▸ **server**(`name`: string): _undefined | [RlpxServer](_net_server_rlpxserver_.rlpxserver.md)‹› | [Libp2pServer](_net_server_libp2pserver_.libp2pserver.md)‹›_

_Defined in [lib/node.ts:129](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/node.ts#L129)_

Returns the server with the specified name.

**Parameters:**

| Name   | Type   | Description    |
| ------ | ------ | -------------- |
| `name` | string | name of server |

**Returns:** _undefined | [RlpxServer](_net_server_rlpxserver_.rlpxserver.md)‹› | [Libp2pServer](_net_server_libp2pserver_.libp2pserver.md)‹›_

---

### service

▸ **service**(`name`: string): _undefined | [FullEthereumService](_service_fullethereumservice_.fullethereumservice.md)‹› | [LightEthereumService](_service_lightethereumservice_.lightethereumservice.md)‹›_

_Defined in [lib/node.ts:120](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/node.ts#L120)_

Returns the service with the specified name.

**Parameters:**

| Name   | Type   | Description     |
| ------ | ------ | --------------- |
| `name` | string | name of service |

**Returns:** _undefined | [FullEthereumService](_service_fullethereumservice_.fullethereumservice.md)‹› | [LightEthereumService](_service_lightethereumservice_.lightethereumservice.md)‹›_

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

### start

▸ **start**(): _Promise‹undefined | false›_

_Defined in [lib/node.ts:93](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/node.ts#L93)_

Starts node and all services and network servers.

**Returns:** _Promise‹undefined | false›_

---

### stop

▸ **stop**(): _Promise‹undefined | false›_

_Defined in [lib/node.ts:106](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/node.ts#L106)_

Stops node and all services and network servers.

**Returns:** _Promise‹undefined | false›_

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
