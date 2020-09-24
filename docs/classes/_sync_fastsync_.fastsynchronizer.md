[ethereumjs-client](../README.md) › ["sync/fastsync"](../modules/_sync_fastsync_.md) › [FastSynchronizer](_sync_fastsync_.fastsynchronizer.md)

# Class: FastSynchronizer

Implements an ethereum fast sync synchronizer

**`memberof`** module:sync

## Hierarchy

  ↳ [Synchronizer](_sync_sync_.synchronizer.md)

  ↳ **FastSynchronizer**

## Index

### Constructors

* [constructor](_sync_fastsync_.fastsynchronizer.md#constructor)

### Accessors

* [type](_sync_fastsync_.fastsynchronizer.md#type)

### Methods

* [announced](_sync_fastsync_.fastsynchronizer.md#announced)
* [best](_sync_fastsync_.fastsynchronizer.md#best)
* [latest](_sync_fastsync_.fastsynchronizer.md#latest)
* [open](_sync_fastsync_.fastsynchronizer.md#open)
* [start](_sync_fastsync_.fastsynchronizer.md#start)
* [stop](_sync_fastsync_.fastsynchronizer.md#stop)
* [sync](_sync_fastsync_.fastsynchronizer.md#sync)
* [syncWithPeer](_sync_fastsync_.fastsynchronizer.md#syncwithpeer)
* [syncable](_sync_fastsync_.fastsynchronizer.md#syncable)

## Constructors

###  constructor

\+ **new FastSynchronizer**(`options`: object): *[FastSynchronizer](_sync_fastsync_.fastsynchronizer.md)*

*Inherited from [Synchronizer](_sync_sync_.synchronizer.md).[constructor](_sync_sync_.synchronizer.md#constructor)*

*Defined in [lib/sync/sync.js:18](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/sync.js#L18)*

Create new node

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`options` | object | constructor parameters |

**Returns:** *[FastSynchronizer](_sync_fastsync_.fastsynchronizer.md)*

## Accessors

###  type

• **get type**(): *string*

*Overrides [Synchronizer](_sync_sync_.synchronizer.md).[type](_sync_sync_.synchronizer.md#type)*

*Defined in [lib/sync/fastsync.js:17](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fastsync.js#L17)*

Returns synchronizer type

**Returns:** *string*

type

## Methods

###  announced

▸ **announced**(`announcements`: Object[], `peer`: any): *Promise‹any›*

*Defined in [lib/sync/fastsync.js:116](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fastsync.js#L116)*

Chain was updated

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`announcements` | Object[] | new block hash announcements |
`peer` | any | peer |

**Returns:** *Promise‹any›*

___

###  best

▸ **best**(): *any*

*Defined in [lib/sync/fastsync.js:35](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fastsync.js#L35)*

Finds the best peer to sync with. We will synchronize to this peer's
blockchain. Returns null if no valid peer is found

**Returns:** *any*

___

###  latest

▸ **latest**(`peer`: any): *Promise‹any›*

*Defined in [lib/sync/fastsync.js:53](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fastsync.js#L53)*

Get latest header of peer

**Parameters:**

Name | Type |
------ | ------ |
`peer` | any |

**Returns:** *Promise‹any›*

Resolves with header

___

###  open

▸ **open**(): *Promise‹any›*

*Overrides [Synchronizer](_sync_sync_.synchronizer.md).[open](_sync_sync_.synchronizer.md#open)*

*Defined in [lib/sync/fastsync.js:128](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fastsync.js#L128)*

Open synchronizer. Must be called before sync() is called

**Returns:** *Promise‹any›*

___

###  start

▸ **start**(): *Promise‹any›*

*Inherited from [Synchronizer](_sync_sync_.synchronizer.md).[start](_sync_sync_.synchronizer.md#start)*

*Defined in [lib/sync/sync.js:76](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/sync.js#L76)*

Start synchronization

**Returns:** *Promise‹any›*

___

###  stop

▸ **stop**(): *Promise‹any›*

*Overrides [Synchronizer](_sync_sync_.synchronizer.md).[stop](_sync_sync_.synchronizer.md#stop)*

*Defined in [lib/sync/fastsync.js:141](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fastsync.js#L141)*

Stop synchronization. Returns a promise that resolves once its stopped.

**Returns:** *Promise‹any›*

___

###  sync

▸ **sync**(): *Promise‹any›*

*Defined in [lib/sync/fastsync.js:105](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fastsync.js#L105)*

Fetch all blocks from current height up to highest found amongst peers and
fetch entire recent state trie

**Returns:** *Promise‹any›*

Resolves with true if sync successful

___

###  syncWithPeer

▸ **syncWithPeer**(`peer`: any): *Promise‹any›*

*Defined in [lib/sync/fastsync.js:65](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fastsync.js#L65)*

Sync all blocks and state from peer starting from current height.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`peer` | any | remote peer to sync with |

**Returns:** *Promise‹any›*

Resolves when sync completed

___

###  syncable

▸ **syncable**(`peer`: any): *boolean*

*Overrides [Synchronizer](_sync_sync_.synchronizer.md).[syncable](_sync_sync_.synchronizer.md#syncable)*

*Defined in [lib/sync/fastsync.js:25](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fastsync.js#L25)*

Returns true if peer can be used for syncing

**Parameters:**

Name | Type |
------ | ------ |
`peer` | any |

**Returns:** *boolean*
