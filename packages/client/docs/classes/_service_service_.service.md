[ethereumjs-client](../README.md) › ["service/service"](../modules/_service_service_.md) › [Service](_service_service_.service.md)

# Class: Service

Base class for all services

**`memberof`** module:service

## Hierarchy

- EventEmitter

  ↳ **Service**

  ↳ [EthereumService](_service_ethereumservice_.ethereumservice.md)

## Index

### Constructors

- [constructor](_service_service_.service.md#constructor)

### Properties

- [config](_service_service_.service.md#config)
- [opened](_service_service_.service.md#opened)
- [pool](_service_service_.service.md#pool)
- [running](_service_service_.service.md#running)
- [defaultMaxListeners](_service_service_.service.md#static-defaultmaxlisteners)
- [errorMonitor](_service_service_.service.md#static-errormonitor)

### Accessors

- [name](_service_service_.service.md#protected-name)
- [protocols](_service_service_.service.md#protocols)

### Methods

- [addListener](_service_service_.service.md#addlistener)
- [close](_service_service_.service.md#close)
- [emit](_service_service_.service.md#emit)
- [eventNames](_service_service_.service.md#eventnames)
- [getMaxListeners](_service_service_.service.md#getmaxlisteners)
- [handle](_service_service_.service.md#handle)
- [listenerCount](_service_service_.service.md#listenercount)
- [listeners](_service_service_.service.md#listeners)
- [off](_service_service_.service.md#off)
- [on](_service_service_.service.md#on)
- [once](_service_service_.service.md#once)
- [open](_service_service_.service.md#open)
- [prependListener](_service_service_.service.md#prependlistener)
- [prependOnceListener](_service_service_.service.md#prependoncelistener)
- [rawListeners](_service_service_.service.md#rawlisteners)
- [removeAllListeners](_service_service_.service.md#removealllisteners)
- [removeListener](_service_service_.service.md#removelistener)
- [setMaxListeners](_service_service_.service.md#setmaxlisteners)
- [start](_service_service_.service.md#start)
- [stop](_service_service_.service.md#stop)
- [listenerCount](_service_service_.service.md#static-listenercount)

## Constructors

### constructor

\+ **new Service**(`options`: [ServiceOptions](../interfaces/_service_service_.serviceoptions.md)): _[Service](_service_service_.service.md)_

_Overrides void_

_Defined in [lib/service/service.ts:20](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/service.ts#L20)_

Create new service and associated peer pool

**Parameters:**

| Name      | Type                                                                |
| --------- | ------------------------------------------------------------------- |
| `options` | [ServiceOptions](../interfaces/_service_service_.serviceoptions.md) |

**Returns:** _[Service](_service_service_.service.md)_

## Properties

### config

• **config**: _[Config](_config_.config.md)_

_Defined in [lib/service/service.ts:17](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/service.ts#L17)_

---

### opened

• **opened**: _boolean_

_Defined in [lib/service/service.ts:18](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/service.ts#L18)_

---

### pool

• **pool**: _[PeerPool](_net_peerpool_.peerpool.md)_

_Defined in [lib/service/service.ts:20](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/service.ts#L20)_

---

### running

• **running**: _boolean_

_Defined in [lib/service/service.ts:19](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/service.ts#L19)_

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

### `Protected` name

• **get name**(): _any_

_Defined in [lib/service/service.ts:59](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/service.ts#L59)_

Service name

**`type`** {string}

**Returns:** _any_

---

### protocols

• **get protocols**(): _[Protocol](_net_protocol_protocol_.protocol.md)[]_

_Defined in [lib/service/service.ts:68](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/service.ts#L68)_

Returns all protocols required by this service

**`type`** {Protocol[]} required protocols

**Returns:** _[Protocol](_net_protocol_protocol_.protocol.md)[]_

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

### close

▸ **close**(): _Promise‹void›_

_Defined in [lib/service/service.ts:96](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/service.ts#L96)_

Close service.

**Returns:** _Promise‹void›_

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

### handle

▸ **handle**(`_message`: any, `_protocol`: string, `_peer`: [Peer](_net_peer_peer_.peer.md)): _Promise‹any›_

_Defined in [lib/service/service.ts:136](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/service.ts#L136)_

Handles incoming request from connected peer

**Parameters:**

| Name        | Type                            |
| ----------- | ------------------------------- |
| `_message`  | any                             |
| `_protocol` | string                          |
| `_peer`     | [Peer](_net_peer_peer_.peer.md) |

**Returns:** _Promise‹any›_

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

_Defined in [lib/service/service.ts:76](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/service.ts#L76)_

Open service. Must be called before service is running

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

▸ **start**(): _Promise‹void | boolean›_

_Defined in [lib/service/service.ts:108](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/service.ts#L108)_

Start service

**Returns:** _Promise‹void | boolean›_

---

### stop

▸ **stop**(): _Promise‹void | boolean›_

_Defined in [lib/service/service.ts:121](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/service/service.ts#L121)_

Stop service

**Returns:** _Promise‹void | boolean›_

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
