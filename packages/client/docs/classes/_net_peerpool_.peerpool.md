[ethereumjs-client](../README.md) › ["net/peerpool"](../modules/_net_peerpool_.md) › [PeerPool](_net_peerpool_.peerpool.md)

# Class: PeerPool

Pool of connected peers

**`memberof`** module:net

**`emits`** connected

**`emits`** disconnected

**`emits`** banned

**`emits`** added

**`emits`** removed

**`emits`** message

**`emits`** message:{protocol}

**`emits`** error

## Hierarchy

* EventEmitter

  ↳ **PeerPool**

## Index

### Constructors

* [constructor](_net_peerpool_.peerpool.md#constructor)

### Properties

* [config](_net_peerpool_.peerpool.md#config)
* [defaultMaxListeners](_net_peerpool_.peerpool.md#static-defaultmaxlisteners)
* [errorMonitor](_net_peerpool_.peerpool.md#static-errormonitor)

### Accessors

* [peers](_net_peerpool_.peerpool.md#peers)
* [size](_net_peerpool_.peerpool.md#size)

### Methods

* [_statusCheck](_net_peerpool_.peerpool.md#_statuscheck)
* [add](_net_peerpool_.peerpool.md#add)
* [addListener](_net_peerpool_.peerpool.md#addlistener)
* [ban](_net_peerpool_.peerpool.md#ban)
* [close](_net_peerpool_.peerpool.md#close)
* [connected](_net_peerpool_.peerpool.md#private-connected)
* [contains](_net_peerpool_.peerpool.md#contains)
* [disconnected](_net_peerpool_.peerpool.md#private-disconnected)
* [emit](_net_peerpool_.peerpool.md#emit)
* [eventNames](_net_peerpool_.peerpool.md#eventnames)
* [getMaxListeners](_net_peerpool_.peerpool.md#getmaxlisteners)
* [idle](_net_peerpool_.peerpool.md#idle)
* [init](_net_peerpool_.peerpool.md#init)
* [listenerCount](_net_peerpool_.peerpool.md#listenercount)
* [listeners](_net_peerpool_.peerpool.md#listeners)
* [off](_net_peerpool_.peerpool.md#off)
* [on](_net_peerpool_.peerpool.md#on)
* [once](_net_peerpool_.peerpool.md#once)
* [open](_net_peerpool_.peerpool.md#open)
* [prependListener](_net_peerpool_.peerpool.md#prependlistener)
* [prependOnceListener](_net_peerpool_.peerpool.md#prependoncelistener)
* [rawListeners](_net_peerpool_.peerpool.md#rawlisteners)
* [remove](_net_peerpool_.peerpool.md#remove)
* [removeAllListeners](_net_peerpool_.peerpool.md#removealllisteners)
* [removeListener](_net_peerpool_.peerpool.md#removelistener)
* [setMaxListeners](_net_peerpool_.peerpool.md#setmaxlisteners)
* [listenerCount](_net_peerpool_.peerpool.md#static-listenercount)

## Constructors

###  constructor

\+ **new PeerPool**(`options`: [PeerPoolOptions](../interfaces/_net_peerpool_.peerpooloptions.md)): *[PeerPool](_net_peerpool_.peerpool.md)*

*Overrides void*

*Defined in [lib/net/peerpool.ts:33](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peerpool.ts#L33)*

Create new peer pool

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`options` | [PeerPoolOptions](../interfaces/_net_peerpool_.peerpooloptions.md) | constructor parameters  |

**Returns:** *[PeerPool](_net_peerpool_.peerpool.md)*

## Properties

###  config

• **config**: *[Config](_config_.config.md)*

*Defined in [lib/net/peerpool.ts:28](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peerpool.ts#L28)*

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

###  peers

• **get peers**(): *[Peer](_net_peer_peer_.peer.md)[]*

*Defined in [lib/net/peerpool.ts:90](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peerpool.ts#L90)*

Connected peers

**Returns:** *[Peer](_net_peer_peer_.peer.md)[]*

___

###  size

• **get size**(): *number*

*Defined in [lib/net/peerpool.ts:99](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peerpool.ts#L99)*

Number of peers in pool

**`type`** {number}

**Returns:** *number*

## Methods

###  _statusCheck

▸ **_statusCheck**(): *Promise‹void›*

*Defined in [lib/net/peerpool.ts:202](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peerpool.ts#L202)*

Peer pool status check on a repeated interval

**Returns:** *Promise‹void›*

___

###  add

▸ **add**(`peer?`: [Peer](_net_peer_peer_.peer.md)): *void*

*Defined in [lib/net/peerpool.ts:179](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peerpool.ts#L179)*

Add peer to pool

**`emits`** added

**`emits`** message

**`emits`** message:{protocol}

**Parameters:**

Name | Type |
------ | ------ |
`peer?` | [Peer](_net_peer_peer_.peer.md) |

**Returns:** *void*

___

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

###  ban

▸ **ban**(`peer`: [Peer](_net_peer_peer_.peer.md), `maxAge`: number): *void*

*Defined in [lib/net/peerpool.ts:162](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peerpool.ts#L162)*

Ban peer from being added to the pool for a period of time

**`emits`** banned

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`peer` | [Peer](_net_peer_peer_.peer.md) | - | - |
`maxAge` | number | 60000 | ban period in milliseconds |

**Returns:** *void*

___

###  close

▸ **close**(): *Promise‹void›*

*Defined in [lib/net/peerpool.ts:81](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peerpool.ts#L81)*

Close pool

**Returns:** *Promise‹void›*

___

### `Private` connected

▸ **connected**(`peer`: [Peer](_net_peer_peer_.peer.md)): *void*

*Defined in [lib/net/peerpool.ts:130](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peerpool.ts#L130)*

Handler for peer connections

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`peer` | [Peer](_net_peer_peer_.peer.md) |   |

**Returns:** *void*

___

###  contains

▸ **contains**(`peer`: [Peer](_net_peer_peer_.peer.md) | string): *boolean*

*Defined in [lib/net/peerpool.ts:107](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peerpool.ts#L107)*

Return true if pool contains the specified peer

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`peer` | [Peer](_net_peer_peer_.peer.md) &#124; string | object or peer id  |

**Returns:** *boolean*

___

### `Private` disconnected

▸ **disconnected**(`peer`: [Peer](_net_peer_peer_.peer.md)): *void*

*Defined in [lib/net/peerpool.ts:152](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peerpool.ts#L152)*

Handler for peer disconnections

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`peer` | [Peer](_net_peer_peer_.peer.md) |   |

**Returns:** *void*

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

###  idle

▸ **idle**(`filterFn`: (Anonymous function)): *[Peer](_net_peer_peer_.peer.md)*

*Defined in [lib/net/peerpool.ts:119](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peerpool.ts#L119)*

Returns a random idle peer from the pool

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`filterFn` | (Anonymous function) | (_peer: Peer) => true |

**Returns:** *[Peer](_net_peer_peer_.peer.md)*

___

###  init

▸ **init**(): *void*

*Defined in [lib/net/peerpool.ts:52](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peerpool.ts#L52)*

**Returns:** *void*

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

▸ **open**(): *Promise‹boolean | void›*

*Defined in [lib/net/peerpool.ts:60](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peerpool.ts#L60)*

Open pool

**Returns:** *Promise‹boolean | void›*

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

###  remove

▸ **remove**(`peer?`: [Peer](_net_peer_peer_.peer.md)): *void*

*Defined in [lib/net/peerpool.ts:191](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peerpool.ts#L191)*

Remove peer from pool

**`emits`** removed

**Parameters:**

Name | Type |
------ | ------ |
`peer?` | [Peer](_net_peer_peer_.peer.md) |

**Returns:** *void*

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
