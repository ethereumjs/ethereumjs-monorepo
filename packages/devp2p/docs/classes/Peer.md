[**@ethereumjs/devp2p**](../README.md)

***

[@ethereumjs/devp2p](../README.md) / Peer

# Class: Peer

Defined in: [packages/devp2p/src/rlpx/peer.ts:77](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L77)

## Constructors

### Constructor

> **new Peer**(`options`): `Peer`

Defined in: [packages/devp2p/src/rlpx/peer.ts:111](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L111)

#### Parameters

##### options

[`PeerOptions`](../interfaces/PeerOptions.md)

#### Returns

`Peer`

## Properties

### \_protocols

> **\_protocols**: `ProtocolDescriptor`[]

Defined in: [packages/devp2p/src/rlpx/peer.ts:109](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L109)

Subprotocols (e.g. `ETH`) derived from the exchange on
capabilities

***

### clientId

> `readonly` **clientId**: `Uint8Array`

Defined in: [packages/devp2p/src/rlpx/peer.ts:79](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L79)

***

### common

> **common**: `Common`

Defined in: [packages/devp2p/src/rlpx/peer.ts:81](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L81)

***

### events

> **events**: `EventEmitter`

Defined in: [packages/devp2p/src/rlpx/peer.ts:78](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L78)

***

### id

> `readonly` **id**: `Uint8Array`

Defined in: [packages/devp2p/src/rlpx/peer.ts:83](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L83)

## Methods

### \_addFirstPeerDebugger()

> **\_addFirstPeerDebugger**(): `void`

Defined in: [packages/devp2p/src/rlpx/peer.ts:719](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L719)

Called once from the subprotocol (e.g. `ETH`) on the peer
where a first successful `STATUS` msg exchange could be achieved.

Can be used together with the `devp2p:FIRST_PEER` debugger.

#### Returns

`void`

***

### \_getProtocol()

> **\_getProtocol**(`code`): `ProtocolDescriptor` \| `undefined`

Defined in: [packages/devp2p/src/rlpx/peer.ts:681](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L681)

Returns either a protocol object with a `protocol` parameter
reference to this Peer instance or to a subprotocol instance (e.g. `ETH`)
(depending on the `code` provided)

#### Parameters

##### code

`number`

#### Returns

`ProtocolDescriptor` \| `undefined`

***

### \_handleAck()

> **\_handleAck**(): `void`

Defined in: [packages/devp2p/src/rlpx/peer.ts:349](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L349)

ACK message received

#### Returns

`void`

***

### \_handleAuth()

> **\_handleAuth**(): `void`

Defined in: [packages/devp2p/src/rlpx/peer.ts:326](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L326)

AUTH message received

#### Returns

`void`

***

### \_handleBody()

> **\_handleBody**(): `void`

Defined in: [packages/devp2p/src/rlpx/peer.ts:543](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L543)

Handle message body

#### Returns

`void`

***

### \_handleDisconnect()

> **\_handleDisconnect**(`payload`): `void`

Defined in: [packages/devp2p/src/rlpx/peer.ts:463](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L463)

DISCONNECT message received

#### Parameters

##### payload

`any`

#### Returns

`void`

***

### \_handleHeader()

> **\_handleHeader**(): `void`

Defined in: [packages/devp2p/src/rlpx/peer.ts:523](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L523)

Handle message header

#### Returns

`void`

***

### \_handleHello()

> **\_handleHello**(`payload`): `void`

Defined in: [packages/devp2p/src/rlpx/peer.ts:380](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L380)

HELLO message received

#### Parameters

##### payload

`any`

#### Returns

`void`

***

### \_handleMessage()

> **\_handleMessage**(`code`, `msg`): `void`

Defined in: [packages/devp2p/src/rlpx/peer.ts:503](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L503)

Message handling, called from a SubProtocol context

#### Parameters

##### code

[`PREFIXES`](../type-aliases/PREFIXES.md)

##### msg

`Uint8Array`

#### Returns

`void`

***

### \_handlePing()

> **\_handlePing**(): `void`

Defined in: [packages/devp2p/src/rlpx/peer.ts:487](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L487)

PING message received

#### Returns

`void`

***

### \_handlePong()

> **\_handlePong**(): `void`

Defined in: [packages/devp2p/src/rlpx/peer.ts:494](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L494)

PONG message received

#### Returns

`void`

***

### \_onSocketClose()

> **\_onSocketClose**(): `void`

Defined in: [packages/devp2p/src/rlpx/peer.ts:668](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L668)

React to socket being closed

#### Returns

`void`

***

### \_onSocketData()

> **\_onSocketData**(`data`): `void`

Defined in: [packages/devp2p/src/rlpx/peer.ts:638](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L638)

Process socket data

#### Parameters

##### data

`Uint8Array`

#### Returns

`void`

***

### \_sendAck()

> **\_sendAck**(): `void`

Defined in: [packages/devp2p/src/rlpx/peer.ts:185](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L185)

Send ACK message

#### Returns

`void`

***

### \_sendAuth()

> **\_sendAuth**(): `void`

Defined in: [packages/devp2p/src/rlpx/peer.ts:163](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L163)

Send AUTH message

#### Returns

`void`

***

### \_sendDisconnect()

> **\_sendDisconnect**(`reason`): `void`

Defined in: [packages/devp2p/src/rlpx/peer.ts:270](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L270)

Send DISCONNECT message

#### Parameters

##### reason

[`DISCONNECT_REASON`](../type-aliases/DISCONNECT_REASON.md)

#### Returns

`void`

***

### \_sendHello()

> **\_sendHello**(): `void`

Defined in: [packages/devp2p/src/rlpx/peer.ts:232](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L232)

Send HELLO message

#### Returns

`void`

***

### \_sendMessage()

> **\_sendMessage**(`code`, `data`): `boolean` \| `undefined`

Defined in: [packages/devp2p/src/rlpx/peer.ts:212](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L212)

Create message HEADER and BODY and send to socket
Also called from SubProtocol context

#### Parameters

##### code

`number`

##### data

`Uint8Array`

#### Returns

`boolean` \| `undefined`

***

### \_sendPing()

> **\_sendPing**(): `void`

Defined in: [packages/devp2p/src/rlpx/peer.ts:291](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L291)

Send PING message

#### Returns

`void`

***

### \_sendPong()

> **\_sendPong**(): `void`

Defined in: [packages/devp2p/src/rlpx/peer.ts:311](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L311)

Send PONG message

#### Returns

`void`

***

### disconnect()

> **disconnect**(`reason?`): `void`

Defined in: [packages/devp2p/src/rlpx/peer.ts:709](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L709)

#### Parameters

##### reason?

[`DISCONNECT_REASON`](../type-aliases/DISCONNECT_REASON.md) = `DISCONNECT_REASON.DISCONNECT_REQUESTED`

#### Returns

`void`

***

### getDisconnectPrefix()

> **getDisconnectPrefix**(`code`): `string`

Defined in: [packages/devp2p/src/rlpx/peer.ts:705](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L705)

#### Parameters

##### code

[`DISCONNECT_REASON`](../type-aliases/DISCONNECT_REASON.md)

#### Returns

`string`

***

### getHelloMessage()

> **getHelloMessage**(): `Hello` \| `null`

Defined in: [packages/devp2p/src/rlpx/peer.ts:693](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L693)

#### Returns

`Hello` \| `null`

***

### getId()

> **getId**(): `Uint8Array`\<`ArrayBufferLike`\> \| `null`

Defined in: [packages/devp2p/src/rlpx/peer.ts:688](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L688)

#### Returns

`Uint8Array`\<`ArrayBufferLike`\> \| `null`

***

### getMsgPrefix()

> **getMsgPrefix**(`code`): `string`

Defined in: [packages/devp2p/src/rlpx/peer.ts:701](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L701)

#### Parameters

##### code

[`PREFIXES`](../type-aliases/PREFIXES.md)

#### Returns

`string`

***

### getProtocols()

> **getProtocols**(): `Protocol`[]

Defined in: [packages/devp2p/src/rlpx/peer.ts:697](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L697)

#### Returns

`Protocol`[]
