[ethereumjs-client](../README.md) › ["sync/lightsync"](../modules/_sync_lightsync_.md) › [LightSynchronizer](_sync_lightsync_.lightsynchronizer.md)

# Class: LightSynchronizer

Implements an ethereum light sync synchronizer

**`memberof`** module:sync

## Hierarchy

  ↳ [Synchronizer](_sync_sync_.synchronizer.md)

  ↳ **LightSynchronizer**

## Index

### Constructors

* [constructor](_sync_lightsync_.lightsynchronizer.md#constructor)

### Properties

* [config](_sync_lightsync_.lightsynchronizer.md#config)

### Accessors

* [type](_sync_lightsync_.lightsynchronizer.md#type)

### Methods

* [addListener](_sync_lightsync_.lightsynchronizer.md#addlistener)
* [best](_sync_lightsync_.lightsynchronizer.md#best)
* [emit](_sync_lightsync_.lightsynchronizer.md#emit)
* [eventNames](_sync_lightsync_.lightsynchronizer.md#eventnames)
* [getMaxListeners](_sync_lightsync_.lightsynchronizer.md#getmaxlisteners)
* [listenerCount](_sync_lightsync_.lightsynchronizer.md#listenercount)
* [listeners](_sync_lightsync_.lightsynchronizer.md#listeners)
* [off](_sync_lightsync_.lightsynchronizer.md#off)
* [on](_sync_lightsync_.lightsynchronizer.md#on)
* [once](_sync_lightsync_.lightsynchronizer.md#once)
* [open](_sync_lightsync_.lightsynchronizer.md#open)
* [prependListener](_sync_lightsync_.lightsynchronizer.md#prependlistener)
* [prependOnceListener](_sync_lightsync_.lightsynchronizer.md#prependoncelistener)
* [rawListeners](_sync_lightsync_.lightsynchronizer.md#rawlisteners)
* [removeAllListeners](_sync_lightsync_.lightsynchronizer.md#removealllisteners)
* [removeListener](_sync_lightsync_.lightsynchronizer.md#removelistener)
* [setMaxListeners](_sync_lightsync_.lightsynchronizer.md#setmaxlisteners)
* [start](_sync_lightsync_.lightsynchronizer.md#start)
* [stop](_sync_lightsync_.lightsynchronizer.md#stop)
* [sync](_sync_lightsync_.lightsynchronizer.md#sync)
* [syncWithPeer](_sync_lightsync_.lightsynchronizer.md#syncwithpeer)
* [syncable](_sync_lightsync_.lightsynchronizer.md#syncable)

## Constructors

###  constructor

\+ **new LightSynchronizer**(`options`: [SynchronizerOptions](../interfaces/_sync_sync_.synchronizeroptions.md)): *[LightSynchronizer](_sync_lightsync_.lightsynchronizer.md)*

*Overrides [Synchronizer](_sync_sync_.synchronizer.md).[constructor](_sync_sync_.synchronizer.md#constructor)*

*Defined in [lib/sync/lightsync.ts:13](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/lightsync.ts#L13)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [SynchronizerOptions](../interfaces/_sync_sync_.synchronizeroptions.md) |

**Returns:** *[LightSynchronizer](_sync_lightsync_.lightsynchronizer.md)*

## Properties

###  config

• **config**: *[Config](_config_.config.md)*

*Inherited from [Synchronizer](_sync_sync_.synchronizer.md).[config](_sync_sync_.synchronizer.md#config)*

*Defined in [lib/sync/sync.ts:30](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/sync.ts#L30)*

## Accessors

###  type

• **get type**(): *string*

*Overrides [Synchronizer](_sync_sync_.synchronizer.md).[type](_sync_sync_.synchronizer.md#type)*

*Defined in [lib/sync/lightsync.ts:24](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/lightsync.ts#L24)*

Returns synchronizer type

**Returns:** *string*

type

## Methods

###  addListener

▸ **addListener**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[addListener](_net_protocol_sender_.sender.md#addlistener)*

Defined in node_modules/@types/node/events.d.ts:62

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  best

▸ **best**(): *[Peer](_net_peer_peer_.peer.md) | undefined*

*Defined in [lib/sync/lightsync.ts:40](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/lightsync.ts#L40)*

Finds the best peer to sync with. We will synchronize to this peer's
blockchain. Returns null if no valid peer is found

**Returns:** *[Peer](_net_peer_peer_.peer.md) | undefined*

___

###  emit

▸ **emit**(`event`: string | symbol, ...`args`: any[]): *boolean*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[emit](_net_protocol_sender_.sender.md#emit)*

Defined in node_modules/@types/node/events.d.ts:72

**Parameters:**

Name | Type |
------ | ------ |
`event` | string &#124; symbol |
`...args` | any[] |

**Returns:** *boolean*

___

###  eventNames

▸ **eventNames**(): *Array‹string | symbol›*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[eventNames](_net_protocol_sender_.sender.md#eventnames)*

Defined in node_modules/@types/node/events.d.ts:77

**Returns:** *Array‹string | symbol›*

___

###  getMaxListeners

▸ **getMaxListeners**(): *number*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[getMaxListeners](_net_protocol_sender_.sender.md#getmaxlisteners)*

Defined in node_modules/@types/node/events.d.ts:69

**Returns:** *number*

___

###  listenerCount

▸ **listenerCount**(`event`: string | symbol): *number*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[listenerCount](_net_protocol_sender_.sender.md#listenercount)*

Defined in node_modules/@types/node/events.d.ts:73

**Parameters:**

Name | Type |
------ | ------ |
`event` | string &#124; symbol |

**Returns:** *number*

___

###  listeners

▸ **listeners**(`event`: string | symbol): *Function[]*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[listeners](_net_protocol_sender_.sender.md#listeners)*

Defined in node_modules/@types/node/events.d.ts:70

**Parameters:**

Name | Type |
------ | ------ |
`event` | string &#124; symbol |

**Returns:** *Function[]*

___

###  off

▸ **off**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[off](_net_protocol_sender_.sender.md#off)*

Defined in node_modules/@types/node/events.d.ts:66

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  on

▸ **on**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[on](_net_protocol_sender_.sender.md#on)*

Defined in node_modules/@types/node/events.d.ts:63

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  once

▸ **once**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[once](_net_protocol_sender_.sender.md#once)*

Defined in node_modules/@types/node/events.d.ts:64

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  open

▸ **open**(): *Promise‹void›*

*Overrides [Synchronizer](_sync_sync_.synchronizer.md).[open](_sync_sync_.synchronizer.md#open)*

*Defined in [lib/sync/lightsync.ts:115](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/lightsync.ts#L115)*

Open synchronizer. Must be called before sync() is called

**Returns:** *Promise‹void›*

___

###  prependListener

▸ **prependListener**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[prependListener](_net_protocol_sender_.sender.md#prependlistener)*

Defined in node_modules/@types/node/events.d.ts:75

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  prependOnceListener

▸ **prependOnceListener**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[prependOnceListener](_net_protocol_sender_.sender.md#prependoncelistener)*

Defined in node_modules/@types/node/events.d.ts:76

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  rawListeners

▸ **rawListeners**(`event`: string | symbol): *Function[]*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[rawListeners](_net_protocol_sender_.sender.md#rawlisteners)*

Defined in node_modules/@types/node/events.d.ts:71

**Parameters:**

Name | Type |
------ | ------ |
`event` | string &#124; symbol |

**Returns:** *Function[]*

___

###  removeAllListeners

▸ **removeAllListeners**(`event?`: string | symbol): *this*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[removeAllListeners](_net_protocol_sender_.sender.md#removealllisteners)*

Defined in node_modules/@types/node/events.d.ts:67

**Parameters:**

Name | Type |
------ | ------ |
`event?` | string &#124; symbol |

**Returns:** *this*

___

###  removeListener

▸ **removeListener**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[removeListener](_net_protocol_sender_.sender.md#removelistener)*

Defined in node_modules/@types/node/events.d.ts:65

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  setMaxListeners

▸ **setMaxListeners**(`n`: number): *this*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[setMaxListeners](_net_protocol_sender_.sender.md#setmaxlisteners)*

Defined in node_modules/@types/node/events.d.ts:68

**Parameters:**

Name | Type |
------ | ------ |
`n` | number |

**Returns:** *this*

___

###  start

▸ **start**(): *Promise‹void | boolean›*

*Inherited from [Synchronizer](_sync_sync_.synchronizer.md).[start](_sync_sync_.synchronizer.md#start)*

*Defined in [lib/sync/sync.ts:87](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/sync.ts#L87)*

Start synchronization

**Returns:** *Promise‹void | boolean›*

___

###  stop

▸ **stop**(): *Promise‹boolean›*

*Overrides [Synchronizer](_sync_sync_.synchronizer.md).[stop](_sync_sync_.synchronizer.md#stop)*

*Defined in [lib/sync/lightsync.ts:128](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/lightsync.ts#L128)*

Stop synchronization. Returns a promise that resolves once its stopped.

**Returns:** *Promise‹boolean›*

___

###  sync

▸ **sync**(): *Promise‹boolean›*

*Defined in [lib/sync/lightsync.ts:107](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/lightsync.ts#L107)*

Fetch all headers from current height up to highest found amongst peers

**Returns:** *Promise‹boolean›*

Resolves with true if sync successful

___

###  syncWithPeer

▸ **syncWithPeer**(`peer?`: [Peer](_net_peer_peer_.peer.md)): *Promise‹boolean›*

*Defined in [lib/sync/lightsync.ts:63](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/lightsync.ts#L63)*

Sync all headers and state from peer starting from current height.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`peer?` | [Peer](_net_peer_peer_.peer.md) | remote peer to sync with |

**Returns:** *Promise‹boolean›*

Resolves when sync completed

___

###  syncable

▸ **syncable**(`peer`: [Peer](_net_peer_peer_.peer.md)): *boolean*

*Overrides [Synchronizer](_sync_sync_.synchronizer.md).[syncable](_sync_sync_.synchronizer.md#syncable)*

*Defined in [lib/sync/lightsync.ts:32](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/lightsync.ts#L32)*

Returns true if peer can be used for syncing

**Parameters:**

Name | Type |
------ | ------ |
`peer` | [Peer](_net_peer_peer_.peer.md) |

**Returns:** *boolean*
