[ethereumjs-client](../README.md) › ["net/peer/peer"](../modules/_net_peer_peer_.md) › [Peer](_net_peer_peer_.peer.md)

# Class: Peer

Network peer

**`memberof`** module:net/peer

## Hierarchy

* any

  ↳ **Peer**

  ↳ [Libp2pPeer](_net_peer_libp2ppeer_.libp2ppeer.md)

  ↳ [RlpxPeer](_net_peer_rlpxpeer_.rlpxpeer.md)

## Index

### Constructors

* [constructor](_net_peer_peer_.peer.md#constructor)

### Accessors

* [idle](_net_peer_peer_.peer.md#idle)

### Methods

* [toString](_net_peer_peer_.peer.md#tostring)
* [understands](_net_peer_peer_.peer.md#understands)

## Constructors

###  constructor

\+ **new Peer**(`options`: object): *[Peer](_net_peer_peer_.peer.md)*

*Defined in [lib/net/peer/peer.js:17](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/peer.js#L17)*

Create new peer

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`options` | object | constructor parameters |

**Returns:** *[Peer](_net_peer_peer_.peer.md)*

## Accessors

###  idle

• **get idle**(): *boolean*

*Defined in [lib/net/peer/peer.js:48](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/peer.js#L48)*

Get idle state of peer

**`type`** {boolean}

**Returns:** *boolean*

• **set idle**(`value`: boolean): *void*

*Defined in [lib/net/peer/peer.js:56](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/peer.js#L56)*

Set idle state of peer

**`type`** {boolean}

**Parameters:**

Name | Type |
------ | ------ |
`value` | boolean |

**Returns:** *void*

## Methods

###  toString

▸ **toString**(`fullId`: any): *string*

*Defined in [lib/net/peer/peer.js:103](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/peer.js#L103)*

**Parameters:**

Name | Type |
------ | ------ |
`fullId` | any |

**Returns:** *string*

___

###  understands

▸ **understands**(`protocolName`: string): *boolean*

*Defined in [lib/net/peer/peer.js:99](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/peer.js#L99)*

Return true if peer understand the specified protocol name

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`protocolName` | string |   |

**Returns:** *boolean*
