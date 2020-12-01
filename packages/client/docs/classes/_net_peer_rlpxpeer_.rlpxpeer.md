[ethereumjs-client](../README.md) › ["net/peer/rlpxpeer"](../modules/_net_peer_rlpxpeer_.md) › [RlpxPeer](_net_peer_rlpxpeer_.rlpxpeer.md)

# Class: RlpxPeer

Devp2p/RLPx peer

**`memberof`** module:net/peer

**`example`** 

import { RlpxPeer } from './lib/net/peer'
import { Chain } from './lib/blockchain'
import { EthProtocol } from './lib/net/protocol'

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

### Properties

* [address](_net_peer_rlpxpeer_.rlpxpeer.md#address)
* [bound](_net_peer_rlpxpeer_.rlpxpeer.md#bound)
* [config](_net_peer_rlpxpeer_.rlpxpeer.md#config)
* [connected](_net_peer_rlpxpeer_.rlpxpeer.md#connected)
* [eth](_net_peer_rlpxpeer_.rlpxpeer.md#eth)
* [id](_net_peer_rlpxpeer_.rlpxpeer.md#id)
* [inbound](_net_peer_rlpxpeer_.rlpxpeer.md#inbound)
* [les](_net_peer_rlpxpeer_.rlpxpeer.md#les)
* [rlpx](_net_peer_rlpxpeer_.rlpxpeer.md#rlpx)
* [rlpxPeer](_net_peer_rlpxpeer_.rlpxpeer.md#rlpxpeer)
* [server](_net_peer_rlpxpeer_.rlpxpeer.md#server)

### Accessors

* [idle](_net_peer_rlpxpeer_.rlpxpeer.md#idle)

### Methods

* [accept](_net_peer_rlpxpeer_.rlpxpeer.md#private-accept)
* [addListener](_net_peer_rlpxpeer_.rlpxpeer.md#addlistener)
* [bindProtocol](_net_peer_rlpxpeer_.rlpxpeer.md#protected-bindprotocol)
* [bindProtocols](_net_peer_rlpxpeer_.rlpxpeer.md#private-bindprotocols)
* [connect](_net_peer_rlpxpeer_.rlpxpeer.md#connect)
* [emit](_net_peer_rlpxpeer_.rlpxpeer.md#emit)
* [eventNames](_net_peer_rlpxpeer_.rlpxpeer.md#eventnames)
* [getMaxListeners](_net_peer_rlpxpeer_.rlpxpeer.md#getmaxlisteners)
* [listenerCount](_net_peer_rlpxpeer_.rlpxpeer.md#listenercount)
* [listeners](_net_peer_rlpxpeer_.rlpxpeer.md#listeners)
* [off](_net_peer_rlpxpeer_.rlpxpeer.md#off)
* [on](_net_peer_rlpxpeer_.rlpxpeer.md#on)
* [once](_net_peer_rlpxpeer_.rlpxpeer.md#once)
* [prependListener](_net_peer_rlpxpeer_.rlpxpeer.md#prependlistener)
* [prependOnceListener](_net_peer_rlpxpeer_.rlpxpeer.md#prependoncelistener)
* [rawListeners](_net_peer_rlpxpeer_.rlpxpeer.md#rawlisteners)
* [removeAllListeners](_net_peer_rlpxpeer_.rlpxpeer.md#removealllisteners)
* [removeListener](_net_peer_rlpxpeer_.rlpxpeer.md#removelistener)
* [setMaxListeners](_net_peer_rlpxpeer_.rlpxpeer.md#setmaxlisteners)
* [toString](_net_peer_rlpxpeer_.rlpxpeer.md#tostring)
* [understands](_net_peer_rlpxpeer_.rlpxpeer.md#understands)
* [capabilities](_net_peer_rlpxpeer_.rlpxpeer.md#static-capabilities)

## Constructors

###  constructor

\+ **new RlpxPeer**(`options`: [RlpxPeerOptions](../interfaces/_net_peer_rlpxpeer_.rlpxpeeroptions.md)): *[RlpxPeer](_net_peer_rlpxpeer_.rlpxpeer.md)*

*Overrides [Peer](_net_peer_peer_.peer.md).[constructor](_net_peer_peer_.peer.md#constructor)*

*Defined in [lib/net/peer/rlpxpeer.ts:53](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/rlpxpeer.ts#L53)*

Create new devp2p/rlpx peer

**Parameters:**

Name | Type |
------ | ------ |
`options` | [RlpxPeerOptions](../interfaces/_net_peer_rlpxpeer_.rlpxpeeroptions.md) |

**Returns:** *[RlpxPeer](_net_peer_rlpxpeer_.rlpxpeer.md)*

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

###  connected

• **connected**: *boolean*

*Defined in [lib/net/peer/rlpxpeer.ts:53](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/rlpxpeer.ts#L53)*

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

###  rlpx

• **rlpx**: *Devp2pRLPx | null*

*Defined in [lib/net/peer/rlpxpeer.ts:51](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/rlpxpeer.ts#L51)*

___

###  rlpxPeer

• **rlpxPeer**: *Devp2pRlpxPeer | null*

*Defined in [lib/net/peer/rlpxpeer.ts:52](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/rlpxpeer.ts#L52)*

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

▸ **accept**(`rlpxPeer`: Devp2pRlpxPeer, `server`: any): *Promise‹void›*

*Defined in [lib/net/peer/rlpxpeer.ts:146](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/rlpxpeer.ts#L146)*

Accept new peer connection from an rlpx server

**Parameters:**

Name | Type |
------ | ------ |
`rlpxPeer` | Devp2pRlpxPeer |
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

▸ **bindProtocols**(`rlpxPeer`: Devp2pRlpxPeer): *Promise‹void›*

*Defined in [lib/net/peer/rlpxpeer.ts:160](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/rlpxpeer.ts#L160)*

Adds protocols to this peer given an rlpx native peer instance.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`rlpxPeer` | Devp2pRlpxPeer | rlpx native peer |

**Returns:** *Promise‹void›*

___

###  connect

▸ **connect**(): *Promise‹void›*

*Defined in [lib/net/peer/rlpxpeer.ts:98](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/rlpxpeer.ts#L98)*

Initiate peer connection

**Returns:** *Promise‹void›*

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

___

### `Static` capabilities

▸ **capabilities**(`protocols`: [Protocol](_net_protocol_protocol_.protocol.md)[]): *Devp2pCapabilities[]*

*Defined in [lib/net/peer/rlpxpeer.ts:79](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/rlpxpeer.ts#L79)*

Return devp2p/rlpx capabilities for the specified protocols

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`protocols` | [Protocol](_net_protocol_protocol_.protocol.md)[] | protocol instances |

**Returns:** *Devp2pCapabilities[]*

capabilities
