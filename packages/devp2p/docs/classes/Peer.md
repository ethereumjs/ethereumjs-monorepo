[**@ethereumjs/devp2p**](../README.md)

***

[@ethereumjs/devp2p](../README.md) / Peer

# Class: Peer

Defined in: [packages/devp2p/src/rlpx/peer.ts:65](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L65)

## Constructors

### new Peer()

> **new Peer**(`options`): [`Peer`](Peer.md)

Defined in: [packages/devp2p/src/rlpx/peer.ts:99](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L99)

#### Parameters

##### options

[`PeerOptions`](../interfaces/PeerOptions.md)

#### Returns

[`Peer`](Peer.md)

## Properties

### \_protocols

> **\_protocols**: `ProtocolDescriptor`[]

Defined in: [packages/devp2p/src/rlpx/peer.ts:97](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L97)

Subprotocols (e.g. `ETH`) derived from the exchange on
capabilities

***

### clientId

> `readonly` **clientId**: `Uint8Array`

Defined in: [packages/devp2p/src/rlpx/peer.ts:67](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L67)

***

### common

> **common**: `Common`

Defined in: [packages/devp2p/src/rlpx/peer.ts:69](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L69)

***

### events

> **events**: `EventEmitter`

Defined in: [packages/devp2p/src/rlpx/peer.ts:66](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L66)

***

### id

> `readonly` **id**: `Uint8Array`

Defined in: [packages/devp2p/src/rlpx/peer.ts:71](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L71)

## Methods

### \_addFirstPeerDebugger()

> **\_addFirstPeerDebugger**(): `void`

Defined in: [packages/devp2p/src/rlpx/peer.ts:707](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L707)

Called once from the subprotocol (e.g. `ETH`) on the peer
where a first successful `STATUS` msg exchange could be achieved.

Can be used together with the `devp2p:FIRST_PEER` debugger.

#### Returns

`void`

***

### \_getProtocol()

> **\_getProtocol**(`code`): `undefined` \| `ProtocolDescriptor`

Defined in: [packages/devp2p/src/rlpx/peer.ts:669](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L669)

Returns either a protocol object with a `protocol` parameter
reference to this Peer instance or to a subprotocol instance (e.g. `ETH`)
(depending on the `code` provided)

#### Parameters

##### code

`number`

#### Returns

`undefined` \| `ProtocolDescriptor`

***

### \_handleAck()

> **\_handleAck**(): `void`

Defined in: [packages/devp2p/src/rlpx/peer.ts:338](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L338)

ACK message received

#### Returns

`void`

***

### \_handleAuth()

> **\_handleAuth**(): `void`

Defined in: [packages/devp2p/src/rlpx/peer.ts:315](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L315)

AUTH message received

#### Returns

`void`

***

### \_handleBody()

> **\_handleBody**(): `void`

Defined in: [packages/devp2p/src/rlpx/peer.ts:531](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L531)

Handle message body

#### Returns

`void`

***

### \_handleDisconnect()

> **\_handleDisconnect**(`payload`): `void`

Defined in: [packages/devp2p/src/rlpx/peer.ts:452](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L452)

DISCONNECT message received

#### Parameters

##### payload

`any`

#### Returns

`void`

***

### \_handleHeader()

> **\_handleHeader**(): `void`

Defined in: [packages/devp2p/src/rlpx/peer.ts:511](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L511)

Handle message header

#### Returns

`void`

***

### \_handleHello()

> **\_handleHello**(`payload`): `void`

Defined in: [packages/devp2p/src/rlpx/peer.ts:369](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L369)

HELLO message received

#### Parameters

##### payload

`any`

#### Returns

`void`

***

### \_handleMessage()

> **\_handleMessage**(`code`, `msg`): `void`

Defined in: [packages/devp2p/src/rlpx/peer.ts:491](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L491)

Message handling, called from a SubProtocol context

#### Parameters

##### code

`PREFIXES`

##### msg

`Uint8Array`

#### Returns

`void`

***

### \_handlePing()

> **\_handlePing**(): `void`

Defined in: [packages/devp2p/src/rlpx/peer.ts:475](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L475)

PING message received

#### Returns

`void`

***

### \_handlePong()

> **\_handlePong**(): `void`

Defined in: [packages/devp2p/src/rlpx/peer.ts:482](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L482)

PONG message received

#### Returns

`void`

***

### \_onSocketClose()

> **\_onSocketClose**(): `void`

Defined in: [packages/devp2p/src/rlpx/peer.ts:656](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L656)

React to socket being closed

#### Returns

`void`

***

### \_onSocketData()

> **\_onSocketData**(`data`): `void`

Defined in: [packages/devp2p/src/rlpx/peer.ts:626](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L626)

Process socket data

#### Parameters

##### data

`Uint8Array`

#### Returns

`void`

***

### \_sendAck()

> **\_sendAck**(): `void`

Defined in: [packages/devp2p/src/rlpx/peer.ts:174](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L174)

Send ACK message

#### Returns

`void`

***

### \_sendAuth()

> **\_sendAuth**(): `void`

Defined in: [packages/devp2p/src/rlpx/peer.ts:152](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L152)

Send AUTH message

#### Returns

`void`

***

### \_sendDisconnect()

> **\_sendDisconnect**(`reason`): `void`

Defined in: [packages/devp2p/src/rlpx/peer.ts:259](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L259)

Send DISCONNECT message

#### Parameters

##### reason

[`DISCONNECT_REASON`](../enumerations/DISCONNECT_REASON.md)

#### Returns

`void`

***

### \_sendHello()

> **\_sendHello**(): `void`

Defined in: [packages/devp2p/src/rlpx/peer.ts:221](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L221)

Send HELLO message

#### Returns

`void`

***

### \_sendMessage()

> **\_sendMessage**(`code`, `data`): `undefined` \| `boolean`

Defined in: [packages/devp2p/src/rlpx/peer.ts:201](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L201)

Create message HEADER and BODY and send to socket
Also called from SubProtocol context

#### Parameters

##### code

`number`

##### data

`Uint8Array`

#### Returns

`undefined` \| `boolean`

***

### \_sendPing()

> **\_sendPing**(): `void`

Defined in: [packages/devp2p/src/rlpx/peer.ts:280](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L280)

Send PING message

#### Returns

`void`

***

### \_sendPong()

> **\_sendPong**(): `void`

Defined in: [packages/devp2p/src/rlpx/peer.ts:300](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L300)

Send PONG message

#### Returns

`void`

***

### disconnect()

> **disconnect**(`reason`): `void`

Defined in: [packages/devp2p/src/rlpx/peer.ts:697](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L697)

#### Parameters

##### reason

[`DISCONNECT_REASON`](../enumerations/DISCONNECT_REASON.md) = `DISCONNECT_REASON.DISCONNECT_REQUESTED`

#### Returns

`void`

***

### getDisconnectPrefix()

> **getDisconnectPrefix**(`code`): `string`

Defined in: [packages/devp2p/src/rlpx/peer.ts:693](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L693)

#### Parameters

##### code

[`DISCONNECT_REASON`](../enumerations/DISCONNECT_REASON.md)

#### Returns

`string`

***

### getHelloMessage()

> **getHelloMessage**(): `null` \| `Hello`

Defined in: [packages/devp2p/src/rlpx/peer.ts:681](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L681)

#### Returns

`null` \| `Hello`

***

### getId()

> **getId**(): `null` \| `Uint8Array`

Defined in: [packages/devp2p/src/rlpx/peer.ts:676](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L676)

#### Returns

`null` \| `Uint8Array`

***

### getMsgPrefix()

> **getMsgPrefix**(`code`): `string`

Defined in: [packages/devp2p/src/rlpx/peer.ts:689](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L689)

#### Parameters

##### code

`PREFIXES`

#### Returns

`string`

***

### getProtocols()

> **getProtocols**(): `Protocol`[]

Defined in: [packages/devp2p/src/rlpx/peer.ts:685](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L685)

#### Returns

`Protocol`[]
