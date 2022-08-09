[ethereumjs-client](../README.md) › ["sync/fullsync"](../modules/_sync_fullsync_.md) › [FullSynchronizer](_sync_fullsync_.fullsynchronizer.md)

# Class: FullSynchronizer

Implements an ethereum full sync synchronizer

**`memberof`** module:sync

## Hierarchy

↳ [Synchronizer](_sync_sync_.synchronizer.md)

↳ **FullSynchronizer**

## Index

### Constructors

- [constructor](_sync_fullsync_.fullsynchronizer.md#constructor)

### Properties

- [config](_sync_fullsync_.fullsynchronizer.md#config)

### Accessors

- [type](_sync_fullsync_.fullsynchronizer.md#type)

### Methods

- [addListener](_sync_fullsync_.fullsynchronizer.md#addlistener)
- [announced](_sync_fullsync_.fullsynchronizer.md#announced)
- [best](_sync_fullsync_.fullsynchronizer.md#best)
- [emit](_sync_fullsync_.fullsynchronizer.md#emit)
- [eventNames](_sync_fullsync_.fullsynchronizer.md#eventnames)
- [getMaxListeners](_sync_fullsync_.fullsynchronizer.md#getmaxlisteners)
- [latest](_sync_fullsync_.fullsynchronizer.md#latest)
- [listenerCount](_sync_fullsync_.fullsynchronizer.md#listenercount)
- [listeners](_sync_fullsync_.fullsynchronizer.md#listeners)
- [off](_sync_fullsync_.fullsynchronizer.md#off)
- [on](_sync_fullsync_.fullsynchronizer.md#on)
- [once](_sync_fullsync_.fullsynchronizer.md#once)
- [open](_sync_fullsync_.fullsynchronizer.md#open)
- [prependListener](_sync_fullsync_.fullsynchronizer.md#prependlistener)
- [prependOnceListener](_sync_fullsync_.fullsynchronizer.md#prependoncelistener)
- [rawListeners](_sync_fullsync_.fullsynchronizer.md#rawlisteners)
- [removeAllListeners](_sync_fullsync_.fullsynchronizer.md#removealllisteners)
- [removeListener](_sync_fullsync_.fullsynchronizer.md#removelistener)
- [setMaxListeners](_sync_fullsync_.fullsynchronizer.md#setmaxlisteners)
- [start](_sync_fullsync_.fullsynchronizer.md#start)
- [stop](_sync_fullsync_.fullsynchronizer.md#stop)
- [sync](_sync_fullsync_.fullsynchronizer.md#sync)
- [syncWithPeer](_sync_fullsync_.fullsynchronizer.md#syncwithpeer)
- [syncable](_sync_fullsync_.fullsynchronizer.md#syncable)

## Constructors

### constructor

\+ **new FullSynchronizer**(`options`: [SynchronizerOptions](../interfaces/_sync_sync_.synchronizeroptions.md)): _[FullSynchronizer](_sync_fullsync_.fullsynchronizer.md)_

_Overrides [Synchronizer](_sync_sync_.synchronizer.md).[constructor](_sync_sync_.synchronizer.md#constructor)_

_Defined in [lib/sync/fullsync.ts:13](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fullsync.ts#L13)_

**Parameters:**

| Name      | Type                                                                    |
| --------- | ----------------------------------------------------------------------- |
| `options` | [SynchronizerOptions](../interfaces/_sync_sync_.synchronizeroptions.md) |

**Returns:** _[FullSynchronizer](_sync_fullsync_.fullsynchronizer.md)_

## Properties

### config

• **config**: _[Config](_config_.config.md)_

_Inherited from [Synchronizer](_sync_sync_.synchronizer.md).[config](_sync_sync_.synchronizer.md#config)_

_Defined in [lib/sync/sync.ts:30](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/sync.ts#L30)_

## Accessors

### type

• **get type**(): _string_

_Overrides [Synchronizer](_sync_sync_.synchronizer.md).[type](_sync_sync_.synchronizer.md#type)_

_Defined in [lib/sync/fullsync.ts:24](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fullsync.ts#L24)_

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

### announced

▸ **announced**(`announcements`: any[], `_peer`: [Peer](_net_peer_peer_.peer.md)): _Promise‹void›_

_Defined in [lib/sync/fullsync.ts:133](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fullsync.ts#L133)_

Chain was updated

**Parameters:**

| Name            | Type                            | Description                  |
| --------------- | ------------------------------- | ---------------------------- |
| `announcements` | any[]                           | new block hash announcements |
| `_peer`         | [Peer](_net_peer_peer_.peer.md) | -                            |

**Returns:** _Promise‹void›_

---

### best

▸ **best**(): _[Peer](_net_peer_peer_.peer.md) | undefined_

_Defined in [lib/sync/fullsync.ts:42](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fullsync.ts#L42)_

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

### latest

▸ **latest**(`peer`: [Peer](_net_peer_peer_.peer.md)): _Promise‹any›_

_Defined in [lib/sync/fullsync.ts:64](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fullsync.ts#L64)_

Get latest header of peer

**Parameters:**

| Name   | Type                            |
| ------ | ------------------------------- |
| `peer` | [Peer](_net_peer_peer_.peer.md) |

**Returns:** _Promise‹any›_

Resolves with header

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

_Defined in [lib/sync/fullsync.ts:144](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fullsync.ts#L144)_

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

_Defined in [lib/sync/fullsync.ts:157](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fullsync.ts#L157)_

Stop synchronization. Returns a promise that resolves once its stopped.

**Returns:** _Promise‹boolean›_

---

### sync

▸ **sync**(): _Promise‹boolean›_

_Defined in [lib/sync/fullsync.ts:122](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fullsync.ts#L122)_

Fetch all blocks from current height up to highest found amongst peers

**Returns:** _Promise‹boolean›_

Resolves with true if sync successful

---

### syncWithPeer

▸ **syncWithPeer**(`peer?`: [Peer](_net_peer_peer_.peer.md)): _Promise‹boolean›_

_Defined in [lib/sync/fullsync.ts:78](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fullsync.ts#L78)_

Sync all blocks and state from peer starting from current height.

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

_Defined in [lib/sync/fullsync.ts:34](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fullsync.ts#L34)_

Returns true if peer can be used for syncing

**Parameters:**

| Name   | Type                            |
| ------ | ------------------------------- |
| `peer` | [Peer](_net_peer_peer_.peer.md) |

**Returns:** _boolean_
