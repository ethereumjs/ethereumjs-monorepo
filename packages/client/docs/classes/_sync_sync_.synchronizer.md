[ethereumjs-client](../README.md) › ["sync/sync"](../modules/_sync_sync_.md) › [Synchronizer](_sync_sync_.synchronizer.md)

# Class: Synchronizer

Base class for blockchain synchronizers

**`memberof`** module:sync

## Hierarchy

- EventEmitter

  ↳ **Synchronizer**

  ↳ [LightSynchronizer](_sync_lightsync_.lightsynchronizer.md)

  ↳ [FullSynchronizer](_sync_fullsync_.fullsynchronizer.md)

## Index

### Constructors

- [constructor](_sync_sync_.synchronizer.md#constructor)

### Properties

- [config](_sync_sync_.synchronizer.md#config)
- [defaultMaxListeners](_sync_sync_.synchronizer.md#static-defaultmaxlisteners)
- [errorMonitor](_sync_sync_.synchronizer.md#static-errormonitor)

### Accessors

- [type](_sync_sync_.synchronizer.md#type)

### Methods

- [addListener](_sync_sync_.synchronizer.md#addlistener)
- [emit](_sync_sync_.synchronizer.md#emit)
- [eventNames](_sync_sync_.synchronizer.md#eventnames)
- [getMaxListeners](_sync_sync_.synchronizer.md#getmaxlisteners)
- [listenerCount](_sync_sync_.synchronizer.md#listenercount)
- [listeners](_sync_sync_.synchronizer.md#listeners)
- [off](_sync_sync_.synchronizer.md#off)
- [on](_sync_sync_.synchronizer.md#on)
- [once](_sync_sync_.synchronizer.md#once)
- [open](_sync_sync_.synchronizer.md#open)
- [prependListener](_sync_sync_.synchronizer.md#prependlistener)
- [prependOnceListener](_sync_sync_.synchronizer.md#prependoncelistener)
- [rawListeners](_sync_sync_.synchronizer.md#rawlisteners)
- [removeAllListeners](_sync_sync_.synchronizer.md#removealllisteners)
- [removeListener](_sync_sync_.synchronizer.md#removelistener)
- [setMaxListeners](_sync_sync_.synchronizer.md#setmaxlisteners)
- [start](_sync_sync_.synchronizer.md#start)
- [stop](_sync_sync_.synchronizer.md#stop)
- [syncable](_sync_sync_.synchronizer.md#syncable)
- [listenerCount](_sync_sync_.synchronizer.md#static-listenercount)

## Constructors

### constructor

\+ **new Synchronizer**(`options`: [SynchronizerOptions](../interfaces/_sync_sync_.synchronizeroptions.md)): _[Synchronizer](_sync_sync_.synchronizer.md)_

_Overrides void_

_Defined in [lib/sync/sync.ts:37](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/sync.ts#L37)_

Create new node

**Parameters:**

| Name      | Type                                                                    |
| --------- | ----------------------------------------------------------------------- |
| `options` | [SynchronizerOptions](../interfaces/_sync_sync_.synchronizeroptions.md) |

**Returns:** _[Synchronizer](_sync_sync_.synchronizer.md)_

## Properties

### config

• **config**: _[Config](_config_.config.md)_

_Defined in [lib/sync/sync.ts:30](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/sync.ts#L30)_

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

### type

• **get type**(): _string_

_Defined in [lib/sync/sync.ts:65](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/sync.ts#L65)_

Returns synchronizer type

**Returns:** _string_

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

▸ **open**(): _Promise‹void›_

_Defined in [lib/sync/sync.ts:73](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/sync.ts#L73)_

Open synchronizer. Must be called before sync() is called

**Returns:** _Promise‹void›_

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

_Defined in [lib/sync/sync.ts:87](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/sync.ts#L87)_

Start synchronization

**Returns:** _Promise‹void | boolean›_

---

### stop

▸ **stop**(): _Promise‹boolean›_

_Defined in [lib/sync/sync.ts:110](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/sync.ts#L110)_

Stop synchronization. Returns a promise that resolves once stopped.

**Returns:** _Promise‹boolean›_

---

### syncable

▸ **syncable**(`_peer`: any): _boolean_

_Defined in [lib/sync/sync.ts:80](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/sync.ts#L80)_

Returns true if peer can be used for syncing

**Parameters:**

| Name    | Type |
| ------- | ---- |
| `_peer` | any  |

**Returns:** _boolean_

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
