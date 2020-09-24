[ethereumjs-client](../README.md) › ["net/peer/rlpxpeer"](../modules/_net_peer_rlpxpeer_.md) › [RlpxPeer](_net_peer_rlpxpeer_.rlpxpeer.md)

# Class: RlpxPeer

Devp2p/RLPx peer

**`memberof`** module:net/peer

**`example`** 

const { RlpxPeer } = require('./lib/net/peer')
const { Chain } = require('./lib/blockchain')
const { EthProtocol } = require('./lib/net/protocol')

const chain = new Chain()
const protocols = [ new EthProtocol({ chain })]
const id = '70180a7fcca96aa013a3609fe7c23cc5c349ba82652c077be6f05b8419040560a622a4fc197a450e5e2f5f28fe6227637ccdbb3f9ba19220d1fb607505ffb455'
const host = '192.0.2.1'
const port = 12345

new RlpxPeer({ id, host, port, protocols })
  .on('error', (err) => console.log('Error:', err))
  .on('connected', () => console.log('Connected'))
  .on('disconnected', (reason) => console.log('Disconnected:', reason))
  .connect()

## Hierarchy

  ↳ [Peer](_net_peer_peer_.peer.md)

  ↳ **RlpxPeer**

## Index

### Constructors

* [constructor](_net_peer_rlpxpeer_.rlpxpeer.md#constructor)

### Accessors

* [idle](_net_peer_rlpxpeer_.rlpxpeer.md#idle)

### Methods

* [connect](_net_peer_rlpxpeer_.rlpxpeer.md#connect)
* [toString](_net_peer_rlpxpeer_.rlpxpeer.md#tostring)
* [understands](_net_peer_rlpxpeer_.rlpxpeer.md#understands)
* [capabilities](_net_peer_rlpxpeer_.rlpxpeer.md#static-capabilities)

## Constructors

###  constructor

\+ **new RlpxPeer**(`options`: object): *[RlpxPeer](_net_peer_rlpxpeer_.rlpxpeer.md)*

*Overrides [Peer](_net_peer_peer_.peer.md).[constructor](_net_peer_peer_.peer.md#constructor)*

*Defined in [lib/net/peer/rlpxpeer.js:35](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/rlpxpeer.js#L35)*

Create new devp2p/rlpx peer

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`options` | object | constructor parameters |

**Returns:** *[RlpxPeer](_net_peer_rlpxpeer_.rlpxpeer.md)*

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

*Defined in [lib/net/peer/rlpxpeer.js:84](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/rlpxpeer.js#L84)*

Initiate peer connection

**Returns:** *Promise‹any›*

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

___

### `Static` capabilities

▸ **capabilities**(`protocols`: any[]): *Object[]*

*Defined in [lib/net/peer/rlpxpeer.js:65](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/rlpxpeer.js#L65)*

Return devp2p/rlpx capabilities for the specified protocols

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`protocols` | any[] | protocol instances |

**Returns:** *Object[]*

capabilities
