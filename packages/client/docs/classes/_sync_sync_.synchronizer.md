[ethereumjs-client](../README.md) › ["sync/sync"](../modules/_sync_sync_.md) › [Synchronizer](_sync_sync_.synchronizer.md)

# Class: Synchronizer

Base class for blockchain synchronizers

**`memberof`** module:sync

## Hierarchy

* EventEmitter

  ↳ **Synchronizer**

  ↳ [LightSynchronizer](_sync_lightsync_.lightsynchronizer.md)

  ↳ [FullSynchronizer](_sync_fullsync_.fullsynchronizer.md)

## Index

### Constructors

* [constructor](_sync_sync_.synchronizer.md#constructor)

### Properties

* [config](_sync_sync_.synchronizer.md#config)
* [defaultMaxListeners](_sync_sync_.synchronizer.md#static-defaultmaxlisteners)
* [errorMonitor](_sync_sync_.synchronizer.md#static-errormonitor)

### Accessors

* [type](_sync_sync_.synchronizer.md#type)

### Methods

* [addListener](_sync_sync_.synchronizer.md#addlistener)
* [emit](_sync_sync_.synchronizer.md#emit)
* [eventNames](_sync_sync_.synchronizer.md#eventnames)
* [getMaxListeners](_sync_sync_.synchronizer.md#getmaxlisteners)
* [listenerCount](_sync_sync_.synchronizer.md#listenercount)
* [listeners](_sync_sync_.synchronizer.md#listeners)
* [off](_sync_sync_.synchronizer.md#off)
* [on](_sync_sync_.synchronizer.md#on)
* [once](_sync_sync_.synchronizer.md#once)
* [open](_sync_sync_.synchronizer.md#open)
* [prependListener](_sync_sync_.synchronizer.md#prependlistener)
* [prependOnceListener](_sync_sync_.synchronizer.md#prependoncelistener)
* [rawListeners](_sync_sync_.synchronizer.md#rawlisteners)
* [removeAllListeners](_sync_sync_.synchronizer.md#removealllisteners)
* [removeListener](_sync_sync_.synchronizer.md#removelistener)
* [setMaxListeners](_sync_sync_.synchronizer.md#setmaxlisteners)
* [start](_sync_sync_.synchronizer.md#start)
* [stop](_sync_sync_.synchronizer.md#stop)
* [syncable](_sync_sync_.synchronizer.md#syncable)
* [listenerCount](_sync_sync_.synchronizer.md#static-listenercount)

## Constructors

###  constructor

\+ **new Synchronizer**(`options`: [SynchronizerOptions](../interfaces/_sync_sync_.synchronizeroptions.md)): *[Synchronizer](_sync_sync_.synchronizer.md)*

*Overrides void*

*Defined in [lib/sync/sync.ts:37](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/sync.ts#L37)*

Create new node

**Parameters:**

Name | Type |
------ | ------ |
`options` | [SynchronizerOptions](../interfaces/_sync_sync_.synchronizeroptions.md) |

**Returns:** *[Synchronizer](_sync_sync_.synchronizer.md)*

## Properties

###  config

• **config**: *[Config](_config_.config.md)*

*Defined in [lib/sync/sync.ts:30](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/sync.ts#L30)*

___

### `Static` defaultMaxListeners

▪ **defaultMaxListeners**: *number*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[defaultMaxListeners](_net_protocol_sender_.sender.md#static-defaultmaxlisteners)*

Defined in node_modules/@types/node/events.d.ts:45

___

### `Static` errorMonitor

▪ **errorMonitor**: *keyof symbol*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[errorMonitor](_net_protocol_sender_.sender.md#static-errormonitor)*

Defined in node_modules/@types/node/events.d.ts:55

This symbol shall be used to install a listener for only monitoring `'error'`
events. Listeners installed using this symbol are called before the regular
`'error'` listeners are called.

Installing a listener using this symbol does not change the behavior once an
`'error'` event is emitted, therefore the process will still crash if no
regular `'error'` listener is installed.

## Accessors

###  type

• **get type**(): *string*

*Defined in [lib/sync/sync.ts:65](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/sync.ts#L65)*

Returns synchronizer type

**Returns:** *string*

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

*Defined in [lib/sync/sync.ts:73](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/sync.ts#L73)*

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

*Defined in [lib/sync/sync.ts:87](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/sync.ts#L87)*

Start synchronization

**Returns:** *Promise‹void | boolean›*

___

###  stop

▸ **stop**(): *Promise‹boolean›*

*Defined in [lib/sync/sync.ts:110](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/sync.ts#L110)*

Stop synchronization. Returns a promise that resolves once stopped.

**Returns:** *Promise‹boolean›*

___

###  syncable

▸ **syncable**(`_peer`: any): *boolean*

*Defined in [lib/sync/sync.ts:80](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/sync.ts#L80)*

Returns true if peer can be used for syncing

**Parameters:**

Name | Type |
------ | ------ |
`_peer` | any |

**Returns:** *boolean*

___

### `Static` listenerCount

▸ **listenerCount**(`emitter`: EventEmitter, `event`: string | symbol): *number*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[listenerCount](_net_protocol_sender_.sender.md#static-listenercount)*

Defined in node_modules/@types/node/events.d.ts:44

**`deprecated`** since v4.0.0

**Parameters:**

Name | Type |
------ | ------ |
`emitter` | EventEmitter |
`event` | string &#124; symbol |

**Returns:** *number*
