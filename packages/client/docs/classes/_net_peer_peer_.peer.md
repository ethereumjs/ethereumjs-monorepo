[ethereumjs-client](../README.md) › ["net/peer/peer"](../modules/_net_peer_peer_.md) › [Peer](_net_peer_peer_.peer.md)

# Class: Peer

Network peer

**`memberof`** module:net/peer

## Hierarchy

* EventEmitter

  ↳ **Peer**

  ↳ [RlpxPeer](_net_peer_rlpxpeer_.rlpxpeer.md)

  ↳ [Libp2pPeer](_net_peer_libp2ppeer_.libp2ppeer.md)

## Index

### Constructors

* [constructor](_net_peer_peer_.peer.md#constructor)

### Properties

* [address](_net_peer_peer_.peer.md#address)
* [bound](_net_peer_peer_.peer.md#bound)
* [config](_net_peer_peer_.peer.md#config)
* [eth](_net_peer_peer_.peer.md#eth)
* [id](_net_peer_peer_.peer.md#id)
* [inbound](_net_peer_peer_.peer.md#inbound)
* [les](_net_peer_peer_.peer.md#les)
* [server](_net_peer_peer_.peer.md#server)
* [defaultMaxListeners](_net_peer_peer_.peer.md#static-defaultmaxlisteners)
* [errorMonitor](_net_peer_peer_.peer.md#static-errormonitor)

### Accessors

* [idle](_net_peer_peer_.peer.md#idle)

### Methods

* [addListener](_net_peer_peer_.peer.md#addlistener)
* [bindProtocol](_net_peer_peer_.peer.md#protected-bindprotocol)
* [emit](_net_peer_peer_.peer.md#emit)
* [eventNames](_net_peer_peer_.peer.md#eventnames)
* [getMaxListeners](_net_peer_peer_.peer.md#getmaxlisteners)
* [listenerCount](_net_peer_peer_.peer.md#listenercount)
* [listeners](_net_peer_peer_.peer.md#listeners)
* [off](_net_peer_peer_.peer.md#off)
* [on](_net_peer_peer_.peer.md#on)
* [once](_net_peer_peer_.peer.md#once)
* [prependListener](_net_peer_peer_.peer.md#prependlistener)
* [prependOnceListener](_net_peer_peer_.peer.md#prependoncelistener)
* [rawListeners](_net_peer_peer_.peer.md#rawlisteners)
* [removeAllListeners](_net_peer_peer_.peer.md#removealllisteners)
* [removeListener](_net_peer_peer_.peer.md#removelistener)
* [setMaxListeners](_net_peer_peer_.peer.md#setmaxlisteners)
* [toString](_net_peer_peer_.peer.md#tostring)
* [understands](_net_peer_peer_.peer.md#understands)
* [listenerCount](_net_peer_peer_.peer.md#static-listenercount)

## Constructors

###  constructor

\+ **new Peer**(`options`: [PeerOptions](../interfaces/_net_peer_peer_.peeroptions.md)): *[Peer](_net_peer_peer_.peer.md)*

*Overrides void*

*Defined in [lib/net/peer/peer.ts:46](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/peer.ts#L46)*

Create new peer

**Parameters:**

Name | Type |
------ | ------ |
`options` | [PeerOptions](../interfaces/_net_peer_peer_.peeroptions.md) |

**Returns:** *[Peer](_net_peer_peer_.peer.md)*

## Properties

###  address

• **address**: *string*

*Defined in [lib/net/peer/peer.ts:36](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/peer.ts#L36)*

___

###  bound

• **bound**: *Map‹string, [BoundProtocol](_net_protocol_boundprotocol_.boundprotocol.md)›*

*Defined in [lib/net/peer/peer.ts:39](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/peer.ts#L39)*

___

###  config

• **config**: *[Config](_config_.config.md)*

*Defined in [lib/net/peer/peer.ts:34](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/peer.ts#L34)*

___

###  eth

• **eth**: *[BoundProtocol](_net_protocol_boundprotocol_.boundprotocol.md) | undefined*

*Defined in [lib/net/peer/peer.ts:46](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/peer.ts#L46)*

___

###  id

• **id**: *string*

*Defined in [lib/net/peer/peer.ts:35](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/peer.ts#L35)*

___

###  inbound

• **inbound**: *boolean*

*Defined in [lib/net/peer/peer.ts:37](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/peer.ts#L37)*

___

###  les

• **les**: *[BoundProtocol](_net_protocol_boundprotocol_.boundprotocol.md) | undefined*

*Defined in [lib/net/peer/peer.ts:45](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/peer.ts#L45)*

___

###  server

• **server**: *[Server](_net_server_server_.server.md) | undefined*

*Defined in [lib/net/peer/peer.ts:38](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/peer.ts#L38)*

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

###  idle

• **get idle**(): *boolean*

*Defined in [lib/net/peer/peer.ts:71](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/peer.ts#L71)*

Get idle state of peer

**`type`** {boolean}

**Returns:** *boolean*

• **set idle**(`value`: boolean): *void*

*Defined in [lib/net/peer/peer.ts:79](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/peer.ts#L79)*

Set idle state of peer

**`type`** {boolean}

**Parameters:**

Name | Type |
------ | ------ |
`value` | boolean |

**Returns:** *void*

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

### `Protected` bindProtocol

▸ **bindProtocol**(`protocol`: [Protocol](_net_protocol_protocol_.protocol.md), `sender`: [Sender](_net_protocol_sender_.sender.md)): *Promise‹void›*

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

*Defined in [lib/net/peer/peer.ts:126](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/peer.ts#L126)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`withFullId` | boolean | false |

**Returns:** *string*

___

###  understands

▸ **understands**(`protocolName`: string): *boolean*

*Defined in [lib/net/peer/peer.ts:122](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/peer.ts#L122)*

Return true if peer understand the specified protocol name

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`protocolName` | string |   |

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
