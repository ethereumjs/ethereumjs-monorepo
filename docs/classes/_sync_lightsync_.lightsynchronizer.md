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

### Accessors

* [type](_sync_lightsync_.lightsynchronizer.md#type)

### Methods

* [best](_sync_lightsync_.lightsynchronizer.md#best)
* [open](_sync_lightsync_.lightsynchronizer.md#open)
* [start](_sync_lightsync_.lightsynchronizer.md#start)
* [stop](_sync_lightsync_.lightsynchronizer.md#stop)
* [sync](_sync_lightsync_.lightsynchronizer.md#sync)
* [syncWithPeer](_sync_lightsync_.lightsynchronizer.md#syncwithpeer)
* [syncable](_sync_lightsync_.lightsynchronizer.md#syncable)

## Constructors

###  constructor

\+ **new LightSynchronizer**(`options`: object): *[LightSynchronizer](_sync_lightsync_.lightsynchronizer.md)*

*Inherited from [Synchronizer](_sync_sync_.synchronizer.md).[constructor](_sync_sync_.synchronizer.md#constructor)*

*Defined in [lib/sync/sync.js:18](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/sync.js#L18)*

Create new node

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`options` | object | constructor parameters |

**Returns:** *[LightSynchronizer](_sync_lightsync_.lightsynchronizer.md)*

## Accessors

###  type

• **get type**(): *string*

*Overrides [Synchronizer](_sync_sync_.synchronizer.md).[type](_sync_sync_.synchronizer.md#type)*

*Defined in [lib/sync/lightsync.js:17](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/lightsync.js#L17)*

Returns synchronizer type

**Returns:** *string*

type

## Methods

###  best

▸ **best**(): *any*

*Defined in [lib/sync/lightsync.js:34](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/lightsync.js#L34)*

Finds the best peer to sync with. We will synchronize to this peer's
blockchain. Returns null if no valid peer is found

**Returns:** *any*

___

###  open

▸ **open**(): *Promise‹any›*

*Overrides [Synchronizer](_sync_sync_.synchronizer.md).[open](_sync_sync_.synchronizer.md#open)*

*Defined in [lib/sync/lightsync.js:99](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/lightsync.js#L99)*

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

*Defined in [lib/sync/lightsync.js:112](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/lightsync.js#L112)*

Stop synchronization. Returns a promise that resolves once its stopped.

**Returns:** *Promise‹any›*

___

###  sync

▸ **sync**(): *Promise‹any›*

*Defined in [lib/sync/lightsync.js:90](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/lightsync.js#L90)*

Fetch all headers from current height up to highest found amongst peers

**Returns:** *Promise‹any›*

Resolves with true if sync successful

___

###  syncWithPeer

▸ **syncWithPeer**(`peer`: any): *Promise‹any›*

*Defined in [lib/sync/lightsync.js:53](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/lightsync.js#L53)*

Sync all headers and state from peer starting from current height.

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

*Defined in [lib/sync/lightsync.js:25](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/lightsync.js#L25)*

Returns true if peer can be used for syncing

**Parameters:**

Name | Type |
------ | ------ |
`peer` | any |

**Returns:** *boolean*
