[ethereumjs-client](../README.md) › ["sync/sync"](../modules/_sync_sync_.md) › [Synchronizer](_sync_sync_.synchronizer.md)

# Class: Synchronizer

Base class for blockchain synchronizers

**`memberof`** module:sync

## Hierarchy

* any

  ↳ **Synchronizer**

  ↳ [FastSynchronizer](_sync_fastsync_.fastsynchronizer.md)

  ↳ [LightSynchronizer](_sync_lightsync_.lightsynchronizer.md)

## Index

### Constructors

* [constructor](_sync_sync_.synchronizer.md#constructor)

### Accessors

* [type](_sync_sync_.synchronizer.md#type)

### Methods

* [open](_sync_sync_.synchronizer.md#open)
* [start](_sync_sync_.synchronizer.md#start)
* [stop](_sync_sync_.synchronizer.md#stop)
* [syncable](_sync_sync_.synchronizer.md#syncable)

## Constructors

###  constructor

\+ **new Synchronizer**(`options`: object): *[Synchronizer](_sync_sync_.synchronizer.md)*

*Defined in [lib/sync/sync.js:18](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/sync.js#L18)*

Create new node

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`options` | object | constructor parameters |

**Returns:** *[Synchronizer](_sync_sync_.synchronizer.md)*

## Accessors

###  type

• **get type**(): *string*

*Defined in [lib/sync/sync.js:54](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/sync.js#L54)*

Returns synchronizer type

**Returns:** *string*

type

## Methods

###  open

▸ **open**(): *Promise‹any›*

*Defined in [lib/sync/sync.js:61](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/sync.js#L61)*

Open synchronizer. Must be called before sync() is called

**Returns:** *Promise‹any›*

___

###  start

▸ **start**(): *Promise‹any›*

*Defined in [lib/sync/sync.js:76](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/sync.js#L76)*

Start synchronization

**Returns:** *Promise‹any›*

___

###  stop

▸ **stop**(): *Promise‹any›*

*Defined in [lib/sync/sync.js:98](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/sync.js#L98)*

Stop synchronization. Returns a promise that resolves once its stopped.

**Returns:** *Promise‹any›*

___

###  syncable

▸ **syncable**(`peer`: any): *boolean*

*Defined in [lib/sync/sync.js:68](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/sync.js#L68)*

Returns true if peer can be used for syncing

**Parameters:**

Name | Type |
------ | ------ |
`peer` | any |

**Returns:** *boolean*
