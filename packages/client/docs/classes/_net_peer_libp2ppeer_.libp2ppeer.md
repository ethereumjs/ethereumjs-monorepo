[ethereumjs-client](../README.md) › ["net/peer/libp2ppeer"](../modules/_net_peer_libp2ppeer_.md) › [Libp2pPeer](_net_peer_libp2ppeer_.libp2ppeer.md)

# Class: Libp2pPeer

Libp2p peer

**`memberof`** module:net/peer

**`example`** 

import { Libp2pPeer } from './lib/net/peer'
import { Chain } from './lib/blockchain'
import { EthProtocol } from './lib/net/protocol'

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

### Properties

* [address](_net_peer_libp2ppeer_.libp2ppeer.md#address)
* [bound](_net_peer_libp2ppeer_.libp2ppeer.md#bound)
* [config](_net_peer_libp2ppeer_.libp2ppeer.md#config)
* [eth](_net_peer_libp2ppeer_.libp2ppeer.md#eth)
* [id](_net_peer_libp2ppeer_.libp2ppeer.md#id)
* [inbound](_net_peer_libp2ppeer_.libp2ppeer.md#inbound)
* [les](_net_peer_libp2ppeer_.libp2ppeer.md#les)
* [server](_net_peer_libp2ppeer_.libp2ppeer.md#server)

### Accessors

* [idle](_net_peer_libp2ppeer_.libp2ppeer.md#idle)

### Methods

* [accept](_net_peer_libp2ppeer_.libp2ppeer.md#private-accept)
* [addListener](_net_peer_libp2ppeer_.libp2ppeer.md#addlistener)
* [bindProtocol](_net_peer_libp2ppeer_.libp2ppeer.md#protected-bindprotocol)
* [bindProtocols](_net_peer_libp2ppeer_.libp2ppeer.md#private-bindprotocols)
* [connect](_net_peer_libp2ppeer_.libp2ppeer.md#connect)
* [createPeerInfo](_net_peer_libp2ppeer_.libp2ppeer.md#createpeerinfo)
* [emit](_net_peer_libp2ppeer_.libp2ppeer.md#emit)
* [eventNames](_net_peer_libp2ppeer_.libp2ppeer.md#eventnames)
* [getMaxListeners](_net_peer_libp2ppeer_.libp2ppeer.md#getmaxlisteners)
* [listenerCount](_net_peer_libp2ppeer_.libp2ppeer.md#listenercount)
* [listeners](_net_peer_libp2ppeer_.libp2ppeer.md#listeners)
* [off](_net_peer_libp2ppeer_.libp2ppeer.md#off)
* [on](_net_peer_libp2ppeer_.libp2ppeer.md#on)
* [once](_net_peer_libp2ppeer_.libp2ppeer.md#once)
* [prependListener](_net_peer_libp2ppeer_.libp2ppeer.md#prependlistener)
* [prependOnceListener](_net_peer_libp2ppeer_.libp2ppeer.md#prependoncelistener)
* [rawListeners](_net_peer_libp2ppeer_.libp2ppeer.md#rawlisteners)
* [removeAllListeners](_net_peer_libp2ppeer_.libp2ppeer.md#removealllisteners)
* [removeListener](_net_peer_libp2ppeer_.libp2ppeer.md#removelistener)
* [setMaxListeners](_net_peer_libp2ppeer_.libp2ppeer.md#setmaxlisteners)
* [toString](_net_peer_libp2ppeer_.libp2ppeer.md#tostring)
* [understands](_net_peer_libp2ppeer_.libp2ppeer.md#understands)

## Constructors

###  constructor

\+ **new Libp2pPeer**(`options`: [Libp2pPeerOptions](../interfaces/_net_peer_libp2ppeer_.libp2ppeeroptions.md)): *[Libp2pPeer](_net_peer_libp2ppeer_.libp2ppeer.md)*

*Overrides [Peer](_net_peer_peer_.peer.md).[constructor](_net_peer_peer_.peer.md#constructor)*

*Defined in [lib/net/peer/libp2ppeer.ts:36](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/libp2ppeer.ts#L36)*

Create new libp2p peer

**Parameters:**

Name | Type |
------ | ------ |
`options` | [Libp2pPeerOptions](../interfaces/_net_peer_libp2ppeer_.libp2ppeeroptions.md) |

**Returns:** *[Libp2pPeer](_net_peer_libp2ppeer_.libp2ppeer.md)*

## Properties

###  address

• **address**: *string*

*Inherited from [Peer](_net_peer_peer_.peer.md).[address](_net_peer_peer_.peer.md#address)*

*Defined in [lib/net/peer/peer.ts:36](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/peer.ts#L36)*

___

###  bound

• **bound**: *Map‹string, [BoundProtocol](_net_protocol_boundprotocol_.boundprotocol.md)›*

*Inherited from [Peer](_net_peer_peer_.peer.md).[bound](_net_peer_peer_.peer.md#bound)*

*Defined in [lib/net/peer/peer.ts:39](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/peer.ts#L39)*

___

###  config

• **config**: *[Config](_config_.config.md)*

*Inherited from [Peer](_net_peer_peer_.peer.md).[config](_net_peer_peer_.peer.md#config)*

*Defined in [lib/net/peer/peer.ts:34](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/peer.ts#L34)*

___

###  eth

• **eth**: *[BoundProtocol](_net_protocol_boundprotocol_.boundprotocol.md) | undefined*

*Inherited from [Peer](_net_peer_peer_.peer.md).[eth](_net_peer_peer_.peer.md#eth)*

*Defined in [lib/net/peer/peer.ts:46](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/peer.ts#L46)*

___

###  id

• **id**: *string*

*Inherited from [Peer](_net_peer_peer_.peer.md).[id](_net_peer_peer_.peer.md#id)*

*Defined in [lib/net/peer/peer.ts:35](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/peer.ts#L35)*

___

###  inbound

• **inbound**: *boolean*

*Inherited from [Peer](_net_peer_peer_.peer.md).[inbound](_net_peer_peer_.peer.md#inbound)*

*Defined in [lib/net/peer/peer.ts:37](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/peer.ts#L37)*

___

###  les

• **les**: *[BoundProtocol](_net_protocol_boundprotocol_.boundprotocol.md) | undefined*

*Inherited from [Peer](_net_peer_peer_.peer.md).[les](_net_peer_peer_.peer.md#les)*

*Defined in [lib/net/peer/peer.ts:45](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/peer.ts#L45)*

___

###  server

• **server**: *[Server](_net_server_server_.server.md) | undefined*

*Inherited from [Peer](_net_peer_peer_.peer.md).[server](_net_peer_peer_.peer.md#server)*

*Defined in [lib/net/peer/peer.ts:38](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/peer.ts#L38)*

## Accessors

###  idle

• **get idle**(): *boolean*

*Inherited from [Peer](_net_peer_peer_.peer.md).[idle](_net_peer_peer_.peer.md#idle)*

*Defined in [lib/net/peer/peer.ts:71](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/peer.ts#L71)*

Get idle state of peer

**`type`** {boolean}

**Returns:** *boolean*

• **set idle**(`value`: boolean): *void*

*Inherited from [Peer](_net_peer_peer_.peer.md).[idle](_net_peer_peer_.peer.md#idle)*

*Defined in [lib/net/peer/peer.ts:79](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/peer.ts#L79)*

Set idle state of peer

**`type`** {boolean}

**Parameters:**

Name | Type |
------ | ------ |
`value` | boolean |

**Returns:** *void*

## Methods

### `Private` accept

▸ **accept**(`protocol`: any, `connection`: any, `server`: any): *Promise‹void›*

*Defined in [lib/net/peer/libp2ppeer.ts:76](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/libp2ppeer.ts#L76)*

Accept new peer connection from a libp2p server

**Parameters:**

Name | Type |
------ | ------ |
`protocol` | any |
`connection` | any |
`server` | any |

**Returns:** *Promise‹void›*

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

### `Protected` bindProtocol

▸ **bindProtocol**(`protocol`: [Protocol](_net_protocol_protocol_.protocol.md), `sender`: [Sender](_net_protocol_sender_.sender.md)): *Promise‹void›*

*Inherited from [Peer](_net_peer_peer_.peer.md).[bindProtocol](_net_peer_peer_.peer.md#protected-bindprotocol)*

*Defined in [lib/net/peer/peer.ts:107](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/peer.ts#L107)*

Adds a protocol to this peer given a sender instance. Protocol methods
will be accessible via a field with the same name as protocol. New methods
will be added corresponding to each message defined by the protocol, in
addition to send() and request() methods that takes a message name and message
arguments. send() only sends a message without waiting for a response, whereas
request() also sends the message but will return a promise that resolves with
the response payload.

**`example`** 

await peer.bindProtocol(ethProtocol, sender)
// Example: Directly call message name as a method on the bound protocol
const headers1 = await peer.eth.getBlockHeaders(1, 100, 0, 0)
// Example: Call request() method with message name as first parameter
const headers2 = await peer.eth.request('getBlockHeaders', 1, 100, 0, 0)
// Example: Call send() method with message name as first parameter and
// wait for response message as an event
peer.eth.send('getBlockHeaders', 1, 100, 0, 0)
peer.eth.on('message', ({ data }) => console.log(`Received ${data.length} headers`))

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`protocol` | [Protocol](_net_protocol_protocol_.protocol.md) | protocol instance |
`sender` | [Sender](_net_protocol_sender_.sender.md) | Sender instance provided by subclass |

**Returns:** *Promise‹void›*

___

### `Private` bindProtocols

▸ **bindProtocols**(`node`: any, `peerInfo`: any, `server`: any): *Promise‹void›*

*Defined in [lib/net/peer/libp2ppeer.ts:90](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/libp2ppeer.ts#L90)*

Adds protocols to the peer given a libp2p node and peerInfo

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`node` | any | - | libp2p node |
`peerInfo` | any | - | libp2p peerInfo |
`server` | any | null | - |

**Returns:** *Promise‹void›*

___

###  connect

▸ **connect**(): *Promise‹void›*

*Defined in [lib/net/peer/libp2ppeer.ts:58](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/libp2ppeer.ts#L58)*

Initiate peer connection

**Returns:** *Promise‹void›*

___

###  createPeerInfo

▸ **createPeerInfo**(`__namedParameters`: object): *Promise‹PeerInfo›*

*Defined in [lib/net/peer/libp2ppeer.ts:110](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/libp2ppeer.ts#L110)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`id` | undefined &#124; string |
`multiaddrs` | string[] |

**Returns:** *Promise‹PeerInfo›*

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

###  toString

▸ **toString**(`withFullId`: boolean): *string*

*Inherited from [Peer](_net_peer_peer_.peer.md).[toString](_net_peer_peer_.peer.md#tostring)*

*Defined in [lib/net/peer/peer.ts:126](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/peer.ts#L126)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`withFullId` | boolean | false |

**Returns:** *string*

___

###  understands

▸ **understands**(`protocolName`: string): *boolean*

*Inherited from [Peer](_net_peer_peer_.peer.md).[understands](_net_peer_peer_.peer.md#understands)*

*Defined in [lib/net/peer/peer.ts:122](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/peer.ts#L122)*

Return true if peer understand the specified protocol name

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`protocolName` | string |   |

**Returns:** *boolean*
