[ethereumjs-client](../README.md) › ["sync/lightsync"](../modules/_sync_lightsync_.md) › [LightSynchronizer](_sync_lightsync_.lightsynchronizer.md)

# Class: LightSynchronizer

Implements an ethereum light sync synchronizer

**`memberof`** module:sync

## Hierarchy

↳ [Synchronizer](_sync_sync_.synchronizer.md)

↳ **LightSynchronizer**

## Index

### Constructors

- [constructor](_sync_lightsync_.lightsynchronizer.md#constructor)

### Properties

- [config](_sync_lightsync_.lightsynchronizer.md#config)

### Accessors

- [type](_sync_lightsync_.lightsynchronizer.md#type)

### Methods

- [addListener](_sync_lightsync_.lightsynchronizer.md#addlistener)
- [best](_sync_lightsync_.lightsynchronizer.md#best)
- [emit](_sync_lightsync_.lightsynchronizer.md#emit)
- [eventNames](_sync_lightsync_.lightsynchronizer.md#eventnames)
- [getMaxListeners](_sync_lightsync_.lightsynchronizer.md#getmaxlisteners)
- [listenerCount](_sync_lightsync_.lightsynchronizer.md#listenercount)
- [listeners](_sync_lightsync_.lightsynchronizer.md#listeners)
- [off](_sync_lightsync_.lightsynchronizer.md#off)
- [on](_sync_lightsync_.lightsynchronizer.md#on)
- [once](_sync_lightsync_.lightsynchronizer.md#once)
- [open](_sync_lightsync_.lightsynchronizer.md#open)
- [prependListener](_sync_lightsync_.lightsynchronizer.md#prependlistener)
- [prependOnceListener](_sync_lightsync_.lightsynchronizer.md#prependoncelistener)
- [rawListeners](_sync_lightsync_.lightsynchronizer.md#rawlisteners)
- [removeAllListeners](_sync_lightsync_.lightsynchronizer.md#removealllisteners)
- [removeListener](_sync_lightsync_.lightsynchronizer.md#removelistener)
- [setMaxListeners](_sync_lightsync_.lightsynchronizer.md#setmaxlisteners)
- [start](_sync_lightsync_.lightsynchronizer.md#start)
- [stop](_sync_lightsync_.lightsynchronizer.md#stop)
- [sync](_sync_lightsync_.lightsynchronizer.md#sync)
- [syncWithPeer](_sync_lightsync_.lightsynchronizer.md#syncwithpeer)
- [syncable](_sync_lightsync_.lightsynchronizer.md#syncable)

## Constructors

### constructor

\+ **new LightSynchronizer**(`options`: [SynchronizerOptions](../interfaces/_sync_sync_.synchronizeroptions.md)): _[LightSynchronizer](_sync_lightsync_.lightsynchronizer.md)_

_Overrides [Synchronizer](_sync_sync_.synchronizer.md).[constructor](_sync_sync_.synchronizer.md#constructor)_

_Defined in [lib/sync/lightsync.ts:13](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/lightsync.ts#L13)_

**Parameters:**

| Name      | Type                                                                    |
| --------- | ----------------------------------------------------------------------- |
| `options` | [SynchronizerOptions](../interfaces/_sync_sync_.synchronizeroptions.md) |

**Returns:** _[LightSynchronizer](_sync_lightsync_.lightsynchronizer.md)_

## Properties

### config

• **config**: _[Config](_config_.config.md)_

_Inherited from [Synchronizer](_sync_sync_.synchronizer.md).[config](_sync_sync_.synchronizer.md#config)_

_Defined in [lib/sync/sync.ts:30](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/sync.ts#L30)_

## Accessors

### type

• **get type**(): _string_

_Overrides [Synchronizer](_sync_sync_.synchronizer.md).[type](_sync_sync_.synchronizer.md#type)_

_Defined in [lib/sync/lightsync.ts:24](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/lightsync.ts#L24)_

Returns synchronizer type

**Returns:** _string_

type

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

### best

▸ **best**(): _[Peer](_net_peer_peer_.peer.md) | undefined_

_Defined in [lib/sync/lightsync.ts:40](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/lightsync.ts#L40)_

Finds the best peer to sync with. We will synchronize to this peer's
blockchain. Returns null if no valid peer is found

**Returns:** _[Peer](_net_peer_peer_.peer.md) | undefined_

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

_Overrides [Synchronizer](_sync_sync_.synchronizer.md).[open](_sync_sync_.synchronizer.md#open)_

_Defined in [lib/sync/lightsync.ts:115](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/lightsync.ts#L115)_

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

_Inherited from [Synchronizer](_sync_sync_.synchronizer.md).[start](_sync_sync_.synchronizer.md#start)_

_Defined in [lib/sync/sync.ts:87](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/sync.ts#L87)_

Start synchronization

**Returns:** _Promise‹void | boolean›_

---

### stop

▸ **stop**(): _Promise‹boolean›_

_Overrides [Synchronizer](_sync_sync_.synchronizer.md).[stop](_sync_sync_.synchronizer.md#stop)_

_Defined in [lib/sync/lightsync.ts:128](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/lightsync.ts#L128)_

Stop synchronization. Returns a promise that resolves once its stopped.

**Returns:** _Promise‹boolean›_

---

### sync

▸ **sync**(): _Promise‹boolean›_

_Defined in [lib/sync/lightsync.ts:107](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/lightsync.ts#L107)_

Fetch all headers from current height up to highest found amongst peers

**Returns:** _Promise‹boolean›_

Resolves with true if sync successful

---

### syncWithPeer

▸ **syncWithPeer**(`peer?`: [Peer](_net_peer_peer_.peer.md)): _Promise‹boolean›_

_Defined in [lib/sync/lightsync.ts:63](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/lightsync.ts#L63)_

Sync all headers and state from peer starting from current height.

**Parameters:**

| Name    | Type                            | Description              |
| ------- | ------------------------------- | ------------------------ |
| `peer?` | [Peer](_net_peer_peer_.peer.md) | remote peer to sync with |

**Returns:** _Promise‹boolean›_

Resolves when sync completed

---

### syncable

▸ **syncable**(`peer`: [Peer](_net_peer_peer_.peer.md)): _boolean_

_Overrides [Synchronizer](_sync_sync_.synchronizer.md).[syncable](_sync_sync_.synchronizer.md#syncable)_

_Defined in [lib/sync/lightsync.ts:32](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/lightsync.ts#L32)_

Returns true if peer can be used for syncing

**Parameters:**

| Name   | Type                            |
| ------ | ------------------------------- |
| `peer` | [Peer](_net_peer_peer_.peer.md) |

**Returns:** _boolean_
