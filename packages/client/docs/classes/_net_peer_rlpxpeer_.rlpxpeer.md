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

- [constructor](_net_peer_rlpxpeer_.rlpxpeer.md#constructor)

### Properties

- [address](_net_peer_rlpxpeer_.rlpxpeer.md#address)
- [bound](_net_peer_rlpxpeer_.rlpxpeer.md#bound)
- [config](_net_peer_rlpxpeer_.rlpxpeer.md#config)
- [connected](_net_peer_rlpxpeer_.rlpxpeer.md#connected)
- [eth](_net_peer_rlpxpeer_.rlpxpeer.md#eth)
- [id](_net_peer_rlpxpeer_.rlpxpeer.md#id)
- [inbound](_net_peer_rlpxpeer_.rlpxpeer.md#inbound)
- [les](_net_peer_rlpxpeer_.rlpxpeer.md#les)
- [rlpx](_net_peer_rlpxpeer_.rlpxpeer.md#rlpx)
- [rlpxPeer](_net_peer_rlpxpeer_.rlpxpeer.md#rlpxpeer)
- [server](_net_peer_rlpxpeer_.rlpxpeer.md#server)

### Accessors

- [idle](_net_peer_rlpxpeer_.rlpxpeer.md#idle)

### Methods

- [accept](_net_peer_rlpxpeer_.rlpxpeer.md#private-accept)
- [addListener](_net_peer_rlpxpeer_.rlpxpeer.md#addlistener)
- [bindProtocol](_net_peer_rlpxpeer_.rlpxpeer.md#protected-bindprotocol)
- [bindProtocols](_net_peer_rlpxpeer_.rlpxpeer.md#private-bindprotocols)
- [connect](_net_peer_rlpxpeer_.rlpxpeer.md#connect)
- [emit](_net_peer_rlpxpeer_.rlpxpeer.md#emit)
- [eventNames](_net_peer_rlpxpeer_.rlpxpeer.md#eventnames)
- [getMaxListeners](_net_peer_rlpxpeer_.rlpxpeer.md#getmaxlisteners)
- [listenerCount](_net_peer_rlpxpeer_.rlpxpeer.md#listenercount)
- [listeners](_net_peer_rlpxpeer_.rlpxpeer.md#listeners)
- [off](_net_peer_rlpxpeer_.rlpxpeer.md#off)
- [on](_net_peer_rlpxpeer_.rlpxpeer.md#on)
- [once](_net_peer_rlpxpeer_.rlpxpeer.md#once)
- [prependListener](_net_peer_rlpxpeer_.rlpxpeer.md#prependlistener)
- [prependOnceListener](_net_peer_rlpxpeer_.rlpxpeer.md#prependoncelistener)
- [rawListeners](_net_peer_rlpxpeer_.rlpxpeer.md#rawlisteners)
- [removeAllListeners](_net_peer_rlpxpeer_.rlpxpeer.md#removealllisteners)
- [removeListener](_net_peer_rlpxpeer_.rlpxpeer.md#removelistener)
- [setMaxListeners](_net_peer_rlpxpeer_.rlpxpeer.md#setmaxlisteners)
- [toString](_net_peer_rlpxpeer_.rlpxpeer.md#tostring)
- [understands](_net_peer_rlpxpeer_.rlpxpeer.md#understands)
- [capabilities](_net_peer_rlpxpeer_.rlpxpeer.md#static-capabilities)

## Constructors

### constructor

\+ **new RlpxPeer**(`options`: [RlpxPeerOptions](../interfaces/_net_peer_rlpxpeer_.rlpxpeeroptions.md)): _[RlpxPeer](_net_peer_rlpxpeer_.rlpxpeer.md)_

_Overrides [Peer](_net_peer_peer_.peer.md).[constructor](_net_peer_peer_.peer.md#constructor)_

_Defined in [lib/net/peer/rlpxpeer.ts:53](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/rlpxpeer.ts#L53)_

Create new devp2p/rlpx peer

**Parameters:**

| Name      | Type                                                                    |
| --------- | ----------------------------------------------------------------------- |
| `options` | [RlpxPeerOptions](../interfaces/_net_peer_rlpxpeer_.rlpxpeeroptions.md) |

**Returns:** _[RlpxPeer](_net_peer_rlpxpeer_.rlpxpeer.md)_

## Properties

### address

• **address**: _string_

_Inherited from [Peer](_net_peer_peer_.peer.md).[address](_net_peer_peer_.peer.md#address)_

_Defined in [lib/net/peer/peer.ts:36](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/peer.ts#L36)_

---

### bound

• **bound**: _Map‹string, [BoundProtocol](_net_protocol_boundprotocol_.boundprotocol.md)›_

_Inherited from [Peer](_net_peer_peer_.peer.md).[bound](_net_peer_peer_.peer.md#bound)_

_Defined in [lib/net/peer/peer.ts:39](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/peer.ts#L39)_

---

### config

• **config**: _[Config](_config_.config.md)_

_Inherited from [Peer](_net_peer_peer_.peer.md).[config](_net_peer_peer_.peer.md#config)_

_Defined in [lib/net/peer/peer.ts:34](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/peer.ts#L34)_

---

### connected

• **connected**: _boolean_

_Defined in [lib/net/peer/rlpxpeer.ts:53](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/rlpxpeer.ts#L53)_

---

### eth

• **eth**: _[BoundProtocol](_net_protocol_boundprotocol_.boundprotocol.md) | undefined_

_Inherited from [Peer](_net_peer_peer_.peer.md).[eth](_net_peer_peer_.peer.md#eth)_

_Defined in [lib/net/peer/peer.ts:46](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/peer.ts#L46)_

---

### id

• **id**: _string_

_Inherited from [Peer](_net_peer_peer_.peer.md).[id](_net_peer_peer_.peer.md#id)_

_Defined in [lib/net/peer/peer.ts:35](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/peer.ts#L35)_

---

### inbound

• **inbound**: _boolean_

_Inherited from [Peer](_net_peer_peer_.peer.md).[inbound](_net_peer_peer_.peer.md#inbound)_

_Defined in [lib/net/peer/peer.ts:37](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/peer.ts#L37)_

---

### les

• **les**: _[BoundProtocol](_net_protocol_boundprotocol_.boundprotocol.md) | undefined_

_Inherited from [Peer](_net_peer_peer_.peer.md).[les](_net_peer_peer_.peer.md#les)_

_Defined in [lib/net/peer/peer.ts:45](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/peer.ts#L45)_

---

### rlpx

• **rlpx**: _Devp2pRLPx | null_

_Defined in [lib/net/peer/rlpxpeer.ts:51](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/rlpxpeer.ts#L51)_

---

### rlpxPeer

• **rlpxPeer**: _Devp2pRlpxPeer | null_

_Defined in [lib/net/peer/rlpxpeer.ts:52](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/rlpxpeer.ts#L52)_

---

### server

• **server**: _[Server](_net_server_server_.server.md) | undefined_

_Inherited from [Peer](_net_peer_peer_.peer.md).[server](_net_peer_peer_.peer.md#server)_

_Defined in [lib/net/peer/peer.ts:38](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/peer.ts#L38)_

## Accessors

### idle

• **get idle**(): _boolean_

_Inherited from [Peer](_net_peer_peer_.peer.md).[idle](_net_peer_peer_.peer.md#idle)_

_Defined in [lib/net/peer/peer.ts:71](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/peer.ts#L71)_

Get idle state of peer

**`type`** {boolean}

**Returns:** _boolean_

• **set idle**(`value`: boolean): _void_

_Inherited from [Peer](_net_peer_peer_.peer.md).[idle](_net_peer_peer_.peer.md#idle)_

_Defined in [lib/net/peer/peer.ts:79](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/peer.ts#L79)_

Set idle state of peer

**`type`** {boolean}

**Parameters:**

| Name    | Type    |
| ------- | ------- |
| `value` | boolean |

**Returns:** _void_

## Methods

### `Private` accept

▸ **accept**(`rlpxPeer`: Devp2pRlpxPeer, `server`: any): _Promise‹void›_

_Defined in [lib/net/peer/rlpxpeer.ts:146](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/rlpxpeer.ts#L146)_

Accept new peer connection from an rlpx server

**Parameters:**

| Name       | Type           |
| ---------- | -------------- |
| `rlpxPeer` | Devp2pRlpxPeer |
| `server`   | any            |

**Returns:** _Promise‹void›_

---

### addListener

▸ **addListener**(`event`: string | symbol, `listener`: function): _this_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[addListener](_net_protocol_sender_.sender.md#addlistener)_

Defined in node_modules/@types/node/events.d.ts:62

**Parameters:**

▪ **event**: _string | symbol_

▪ **listener**: _function_

▸ (...`args`: any[]): _void_

**Parameters:**

| Name      | Type  |
| --------- | ----- |
| `...args` | any[] |

**Returns:** _this_

---

### `Protected` bindProtocol

▸ **bindProtocol**(`protocol`: [Protocol](_net_protocol_protocol_.protocol.md), `sender`: [Sender](_net_protocol_sender_.sender.md)): _Promise‹void›_

_Inherited from [Peer](_net_peer_peer_.peer.md).[bindProtocol](_net_peer_peer_.peer.md#protected-bindprotocol)_

_Defined in [lib/net/peer/peer.ts:107](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/peer.ts#L107)_

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

| Name       | Type                                            | Description                          |
| ---------- | ----------------------------------------------- | ------------------------------------ |
| `protocol` | [Protocol](_net_protocol_protocol_.protocol.md) | protocol instance                    |
| `sender`   | [Sender](_net_protocol_sender_.sender.md)       | Sender instance provided by subclass |

**Returns:** _Promise‹void›_

---

### `Private` bindProtocols

▸ **bindProtocols**(`rlpxPeer`: Devp2pRlpxPeer): _Promise‹void›_

_Defined in [lib/net/peer/rlpxpeer.ts:160](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/rlpxpeer.ts#L160)_

Adds protocols to this peer given an rlpx native peer instance.

**Parameters:**

| Name       | Type           | Description      |
| ---------- | -------------- | ---------------- |
| `rlpxPeer` | Devp2pRlpxPeer | rlpx native peer |

**Returns:** _Promise‹void›_

---

### connect

▸ **connect**(): _Promise‹void›_

_Defined in [lib/net/peer/rlpxpeer.ts:98](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/rlpxpeer.ts#L98)_

Initiate peer connection

**Returns:** _Promise‹void›_

---

### emit

▸ **emit**(`event`: string | symbol, ...`args`: any[]): _boolean_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[emit](_net_protocol_sender_.sender.md#emit)_

Defined in node_modules/@types/node/events.d.ts:72

**Parameters:**

| Name      | Type                 |
| --------- | -------------------- |
| `event`   | string &#124; symbol |
| `...args` | any[]                |

**Returns:** _boolean_

---

### eventNames

▸ **eventNames**(): _Array‹string | symbol›_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[eventNames](_net_protocol_sender_.sender.md#eventnames)_

Defined in node_modules/@types/node/events.d.ts:77

**Returns:** _Array‹string | symbol›_

---

### getMaxListeners

▸ **getMaxListeners**(): _number_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[getMaxListeners](_net_protocol_sender_.sender.md#getmaxlisteners)_

Defined in node_modules/@types/node/events.d.ts:69

**Returns:** _number_

---

### listenerCount

▸ **listenerCount**(`event`: string | symbol): _number_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[listenerCount](_net_protocol_sender_.sender.md#listenercount)_

Defined in node_modules/@types/node/events.d.ts:73

**Parameters:**

| Name    | Type                 |
| ------- | -------------------- |
| `event` | string &#124; symbol |

**Returns:** _number_

---

### listeners

▸ **listeners**(`event`: string | symbol): _Function[]_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[listeners](_net_protocol_sender_.sender.md#listeners)_

Defined in node_modules/@types/node/events.d.ts:70

**Parameters:**

| Name    | Type                 |
| ------- | -------------------- |
| `event` | string &#124; symbol |

**Returns:** _Function[]_

---

### off

▸ **off**(`event`: string | symbol, `listener`: function): _this_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[off](_net_protocol_sender_.sender.md#off)_

Defined in node_modules/@types/node/events.d.ts:66

**Parameters:**

▪ **event**: _string | symbol_

▪ **listener**: _function_

▸ (...`args`: any[]): _void_

**Parameters:**

| Name      | Type  |
| --------- | ----- |
| `...args` | any[] |

**Returns:** _this_

---

### on

▸ **on**(`event`: string | symbol, `listener`: function): _this_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[on](_net_protocol_sender_.sender.md#on)_

Defined in node_modules/@types/node/events.d.ts:63

**Parameters:**

▪ **event**: _string | symbol_

▪ **listener**: _function_

▸ (...`args`: any[]): _void_

**Parameters:**

| Name      | Type  |
| --------- | ----- |
| `...args` | any[] |

**Returns:** _this_

---

### once

▸ **once**(`event`: string | symbol, `listener`: function): _this_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[once](_net_protocol_sender_.sender.md#once)_

Defined in node_modules/@types/node/events.d.ts:64

**Parameters:**

▪ **event**: _string | symbol_

▪ **listener**: _function_

▸ (...`args`: any[]): _void_

**Parameters:**

| Name      | Type  |
| --------- | ----- |
| `...args` | any[] |

**Returns:** _this_

---

### prependListener

▸ **prependListener**(`event`: string | symbol, `listener`: function): _this_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[prependListener](_net_protocol_sender_.sender.md#prependlistener)_

Defined in node_modules/@types/node/events.d.ts:75

**Parameters:**

▪ **event**: _string | symbol_

▪ **listener**: _function_

▸ (...`args`: any[]): _void_

**Parameters:**

| Name      | Type  |
| --------- | ----- |
| `...args` | any[] |

**Returns:** _this_

---

### prependOnceListener

▸ **prependOnceListener**(`event`: string | symbol, `listener`: function): _this_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[prependOnceListener](_net_protocol_sender_.sender.md#prependoncelistener)_

Defined in node_modules/@types/node/events.d.ts:76

**Parameters:**

▪ **event**: _string | symbol_

▪ **listener**: _function_

▸ (...`args`: any[]): _void_

**Parameters:**

| Name      | Type  |
| --------- | ----- |
| `...args` | any[] |

**Returns:** _this_

---

### rawListeners

▸ **rawListeners**(`event`: string | symbol): _Function[]_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[rawListeners](_net_protocol_sender_.sender.md#rawlisteners)_

Defined in node_modules/@types/node/events.d.ts:71

**Parameters:**

| Name    | Type                 |
| ------- | -------------------- |
| `event` | string &#124; symbol |

**Returns:** _Function[]_

---

### removeAllListeners

▸ **removeAllListeners**(`event?`: string | symbol): _this_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[removeAllListeners](_net_protocol_sender_.sender.md#removealllisteners)_

Defined in node_modules/@types/node/events.d.ts:67

**Parameters:**

| Name     | Type                 |
| -------- | -------------------- |
| `event?` | string &#124; symbol |

**Returns:** _this_

---

### removeListener

▸ **removeListener**(`event`: string | symbol, `listener`: function): _this_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[removeListener](_net_protocol_sender_.sender.md#removelistener)_

Defined in node_modules/@types/node/events.d.ts:65

**Parameters:**

▪ **event**: _string | symbol_

▪ **listener**: _function_

▸ (...`args`: any[]): _void_

**Parameters:**

| Name      | Type  |
| --------- | ----- |
| `...args` | any[] |

**Returns:** _this_

---

### setMaxListeners

▸ **setMaxListeners**(`n`: number): _this_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[setMaxListeners](_net_protocol_sender_.sender.md#setmaxlisteners)_

Defined in node_modules/@types/node/events.d.ts:68

**Parameters:**

| Name | Type   |
| ---- | ------ |
| `n`  | number |

**Returns:** _this_

---

### toString

▸ **toString**(`withFullId`: boolean): _string_

_Inherited from [Peer](_net_peer_peer_.peer.md).[toString](_net_peer_peer_.peer.md#tostring)_

_Defined in [lib/net/peer/peer.ts:126](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/peer.ts#L126)_

**Parameters:**

| Name         | Type    | Default |
| ------------ | ------- | ------- |
| `withFullId` | boolean | false   |

**Returns:** _string_

---

### understands

▸ **understands**(`protocolName`: string): _boolean_

_Inherited from [Peer](_net_peer_peer_.peer.md).[understands](_net_peer_peer_.peer.md#understands)_

_Defined in [lib/net/peer/peer.ts:122](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/peer.ts#L122)_

Return true if peer understand the specified protocol name

**Parameters:**

| Name           | Type   | Description |
| -------------- | ------ | ----------- |
| `protocolName` | string |             |

**Returns:** _boolean_

---

### `Static` capabilities

▸ **capabilities**(`protocols`: [Protocol](_net_protocol_protocol_.protocol.md)[]): _Devp2pCapabilities[]_

_Defined in [lib/net/peer/rlpxpeer.ts:79](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/peer/rlpxpeer.ts#L79)_

Return devp2p/rlpx capabilities for the specified protocols

**Parameters:**

| Name        | Type                                              | Description        |
| ----------- | ------------------------------------------------- | ------------------ |
| `protocols` | [Protocol](_net_protocol_protocol_.protocol.md)[] | protocol instances |

**Returns:** _Devp2pCapabilities[]_

capabilities
