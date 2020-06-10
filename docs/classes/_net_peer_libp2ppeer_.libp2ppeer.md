[ethereumjs-client](../README.md) › ["net/peer/libp2ppeer"](../modules/_net_peer_libp2ppeer_.md) › [Libp2pPeer](_net_peer_libp2ppeer_.libp2ppeer.md)

# Class: Libp2pPeer

Libp2p peer

**`memberof`** module:net/peer

**`example`** 

const { Libp2pPeer } = require('./lib/net/peer')
const { Chain } = require('./lib/blockchain')
const { EthProtocol } = require('./lib/net/protocol')

const chain = new Chain()
const protocols = [ new EthProtocol({ chain })]
const id = 'QmWYhkpLFDhQBwHCMSWzEebbJ5JzXWBKLJxjEuiL8wGzUu'
const multiaddrs = [ '/ip4/192.0.2.1/tcp/12345' ]

new Libp2pPeer({ id, multiaddrs, protocols })
  .on('error', (err) => console.log('Error:', err))
  .on('connected', () => console.log('Connected'))
  .on('disconnected', (reason) => console.log('Disconnected:', reason))
  .connect()

## Hierarchy

  ↳ [Peer](_net_peer_peer_.peer.md)

  ↳ **Libp2pPeer**

## Index

### Constructors

* [constructor](_net_peer_libp2ppeer_.libp2ppeer.md#constructor)

### Accessors

* [idle](_net_peer_libp2ppeer_.libp2ppeer.md#idle)

### Methods

* [connect](_net_peer_libp2ppeer_.libp2ppeer.md#connect)
* [createPeerInfo](_net_peer_libp2ppeer_.libp2ppeer.md#createpeerinfo)
* [init](_net_peer_libp2ppeer_.libp2ppeer.md#init)
* [toString](_net_peer_libp2ppeer_.libp2ppeer.md#tostring)
* [understands](_net_peer_libp2ppeer_.libp2ppeer.md#understands)

## Constructors

###  constructor

\+ **new Libp2pPeer**(`options`: object): *[Libp2pPeer](_net_peer_libp2ppeer_.libp2ppeer.md)*

*Overrides [Peer](_net_peer_peer_.peer.md).[constructor](_net_peer_peer_.peer.md#constructor)*

*Defined in [lib/net/peer/libp2ppeer.js:35](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/libp2ppeer.js#L35)*

Create new libp2p peer

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`options` | object | constructor parameters |

**Returns:** *[Libp2pPeer](_net_peer_libp2ppeer_.libp2ppeer.md)*

## Accessors

###  idle

• **get idle**(): *boolean*

*Inherited from [Peer](_net_peer_peer_.peer.md).[idle](_net_peer_peer_.peer.md#idle)*

*Defined in [lib/net/peer/peer.js:48](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/peer.js#L48)*

Get idle state of peer

**`type`** {boolean}

**Returns:** *boolean*

• **set idle**(`value`: boolean): *void*

*Inherited from [Peer](_net_peer_peer_.peer.md).[idle](_net_peer_peer_.peer.md#idle)*

*Defined in [lib/net/peer/peer.js:56](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/peer.js#L56)*

Set idle state of peer

**`type`** {boolean}

**Parameters:**

Name | Type |
------ | ------ |
`value` | boolean |

**Returns:** *void*

## Methods

###  connect

▸ **connect**(): *Promise‹any›*

*Defined in [lib/net/peer/libp2ppeer.js:66](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/libp2ppeer.js#L66)*

Initiate peer connection

**Returns:** *Promise‹any›*

___

###  createPeerInfo

▸ **createPeerInfo**(`__namedParameters`: object): *Promise‹any›*

*Defined in [lib/net/peer/libp2ppeer.js:114](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/libp2ppeer.js#L114)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`id` | any |
`multiaddrs` | any |

**Returns:** *Promise‹any›*

___

###  init

▸ **init**(): *void*

*Defined in [lib/net/peer/libp2ppeer.js:55](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/libp2ppeer.js#L55)*

**Returns:** *void*

___

###  toString

▸ **toString**(`fullId`: any): *string*

*Inherited from [Peer](_net_peer_peer_.peer.md).[toString](_net_peer_peer_.peer.md#tostring)*

*Defined in [lib/net/peer/peer.js:103](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/peer.js#L103)*

**Parameters:**

Name | Type |
------ | ------ |
`fullId` | any |

**Returns:** *string*

___

###  understands

▸ **understands**(`protocolName`: string): *boolean*

*Inherited from [Peer](_net_peer_peer_.peer.md).[understands](_net_peer_peer_.peer.md#understands)*

*Defined in [lib/net/peer/peer.js:99](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/peer.js#L99)*

Return true if peer understand the specified protocol name

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`protocolName` | string |   |

**Returns:** *boolean*
