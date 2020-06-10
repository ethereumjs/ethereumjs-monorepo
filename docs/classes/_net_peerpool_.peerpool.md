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

* any

  ↳ **PeerPool**

## Index

### Constructors

* [constructor](_net_peerpool_.peerpool.md#constructor)

### Accessors

* [peers](_net_peerpool_.peerpool.md#peers)
* [size](_net_peerpool_.peerpool.md#size)

### Methods

* [add](_net_peerpool_.peerpool.md#add)
* [ban](_net_peerpool_.peerpool.md#ban)
* [close](_net_peerpool_.peerpool.md#close)
* [contains](_net_peerpool_.peerpool.md#contains)
* [idle](_net_peerpool_.peerpool.md#idle)
* [init](_net_peerpool_.peerpool.md#init)
* [open](_net_peerpool_.peerpool.md#open)
* [remove](_net_peerpool_.peerpool.md#remove)

## Constructors

###  constructor

\+ **new PeerPool**(`options`: object): *[PeerPool](_net_peerpool_.peerpool.md)*

*Defined in [lib/net/peerpool.js:29](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peerpool.js#L29)*

Create new peer pool

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`options` | object | constructor parameters |

**Returns:** *[PeerPool](_net_peerpool_.peerpool.md)*

## Accessors

###  peers

• **get peers**(): *[Peer](_net_peer_peer_.peer.md)‹›[]*

*Defined in [lib/net/peerpool.js:81](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peerpool.js#L81)*

Connected peers

**`type`** {Peer[]}

**Returns:** *[Peer](_net_peer_peer_.peer.md)‹›[]*

___

###  size

• **get size**(): *number*

*Defined in [lib/net/peerpool.js:89](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peerpool.js#L89)*

Number of peers in pool

**`type`** {number}

**Returns:** *number*

## Methods

###  add

▸ **add**(`peer`: [Peer](_net_peer_peer_.peer.md)‹›): *void*

*Defined in [lib/net/peerpool.js:169](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peerpool.js#L169)*

Add peer to pool

**`emits`** added

**`emits`** message

**`emits`** message:{protocol}

**Parameters:**

Name | Type |
------ | ------ |
`peer` | [Peer](_net_peer_peer_.peer.md)‹› |

**Returns:** *void*

___

###  ban

▸ **ban**(`peer`: [Peer](_net_peer_peer_.peer.md)‹›, `maxAge`: number): *void*

*Defined in [lib/net/peerpool.js:153](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peerpool.js#L153)*

Ban peer from being added to the pool for a period of time

**`emits`** banned

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`peer` | [Peer](_net_peer_peer_.peer.md)‹› | - |
`maxAge` | number | ban period in milliseconds |

**Returns:** *void*

___

###  close

▸ **close**(): *Promise‹any›*

*Defined in [lib/net/peerpool.js:72](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peerpool.js#L72)*

Close pool

**Returns:** *Promise‹any›*

___

###  contains

▸ **contains**(`peer`: string | [Peer](_net_peer_peer_.peer.md)‹›): *boolean*

*Defined in [lib/net/peerpool.js:98](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peerpool.js#L98)*

Return true if pool contains the specified peer

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`peer` | string &#124; [Peer](_net_peer_peer_.peer.md)‹› | object or peer id |

**Returns:** *boolean*

___

###  idle

▸ **idle**(`filterFn`: undefined | Function): *[Peer](_net_peer_peer_.peer.md)‹›*

*Defined in [lib/net/peerpool.js:110](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peerpool.js#L110)*

Returns a random idle peer from the pool

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`filterFn` | undefined &#124; Function | () => true |

**Returns:** *[Peer](_net_peer_peer_.peer.md)‹›*

___

###  init

▸ **init**(): *void*

*Defined in [lib/net/peerpool.js:49](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peerpool.js#L49)*

**Returns:** *void*

___

###  open

▸ **open**(): *Promise‹any›*

*Defined in [lib/net/peerpool.js:57](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peerpool.js#L57)*

Open pool

**Returns:** *Promise‹any›*

___

###  remove

▸ **remove**(`peer`: [Peer](_net_peer_peer_.peer.md)‹›): *void*

*Defined in [lib/net/peerpool.js:181](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peerpool.js#L181)*

Remove peer from pool

**`emits`** removed

**Parameters:**

Name | Type |
------ | ------ |
`peer` | [Peer](_net_peer_peer_.peer.md)‹› |

**Returns:** *void*
