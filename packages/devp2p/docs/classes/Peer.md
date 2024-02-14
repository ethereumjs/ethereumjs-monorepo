[@ethereumjs/devp2p](../README.md) / Peer

# Class: Peer

## Table of contents

### Constructors

- [constructor](Peer.md#constructor)

### Properties

- [\_protocols](Peer.md#_protocols)
- [clientId](Peer.md#clientid)
- [common](Peer.md#common)
- [events](Peer.md#events)
- [id](Peer.md#id)

### Methods

- [\_addFirstPeerDebugger](Peer.md#_addfirstpeerdebugger)
- [\_getProtocol](Peer.md#_getprotocol)
- [\_handleAck](Peer.md#_handleack)
- [\_handleAuth](Peer.md#_handleauth)
- [\_handleBody](Peer.md#_handlebody)
- [\_handleDisconnect](Peer.md#_handledisconnect)
- [\_handleHeader](Peer.md#_handleheader)
- [\_handleHello](Peer.md#_handlehello)
- [\_handleMessage](Peer.md#_handlemessage)
- [\_handlePing](Peer.md#_handleping)
- [\_handlePong](Peer.md#_handlepong)
- [\_onSocketClose](Peer.md#_onsocketclose)
- [\_onSocketData](Peer.md#_onsocketdata)
- [\_sendAck](Peer.md#_sendack)
- [\_sendAuth](Peer.md#_sendauth)
- [\_sendDisconnect](Peer.md#_senddisconnect)
- [\_sendHello](Peer.md#_sendhello)
- [\_sendMessage](Peer.md#_sendmessage)
- [\_sendPing](Peer.md#_sendping)
- [\_sendPong](Peer.md#_sendpong)
- [disconnect](Peer.md#disconnect)
- [getDisconnectPrefix](Peer.md#getdisconnectprefix)
- [getHelloMessage](Peer.md#gethellomessage)
- [getId](Peer.md#getid)
- [getMsgPrefix](Peer.md#getmsgprefix)
- [getProtocols](Peer.md#getprotocols)

## Constructors

### constructor

• **new Peer**(`options`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`PeerOptions`](../interfaces/PeerOptions.md) |

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:98](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L98)

## Properties

### \_protocols

• **\_protocols**: `ProtocolDescriptor`[]

Subprotocols (e.g. `ETH`) derived from the exchange on
capabilities

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:96](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L96)

___

### clientId

• `Readonly` **clientId**: `Uint8Array`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:68](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L68)

___

### common

• **common**: `Common`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:70](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L70)

___

### events

• **events**: `EventEmitter`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:67](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L67)

___

### id

• `Readonly` **id**: `Uint8Array`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:72](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L72)

## Methods

### \_addFirstPeerDebugger

▸ **_addFirstPeerDebugger**(): `void`

Called once from the subprotocol (e.g. `ETH`) on the peer
where a first successful `STATUS` msg exchange could be achieved.

Can be used together with the `devp2p:FIRST_PEER` debugger.

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:689](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L689)

___

### \_getProtocol

▸ **_getProtocol**(`code`): `undefined` \| `ProtocolDescriptor`

Returns either a protocol object with a `protocol` parameter
reference to this Peer instance or to a subprotocol instance (e.g. `ETH`)
(depending on the `code` provided)

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | `number` |

#### Returns

`undefined` \| `ProtocolDescriptor`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:651](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L651)

___

### \_handleAck

▸ **_handleAck**(): `void`

ACK message received

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:328](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L328)

___

### \_handleAuth

▸ **_handleAuth**(): `void`

AUTH message received

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:303](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L303)

___

### \_handleBody

▸ **_handleBody**(): `void`

Handle message body

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:516](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L516)

___

### \_handleDisconnect

▸ **_handleDisconnect**(`payload`): `void`

DISCONNECT message received

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `any` |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:440](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L440)

___

### \_handleHeader

▸ **_handleHeader**(): `void`

Handle message header

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:497](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L497)

___

### \_handleHello

▸ **_handleHello**(`payload`): `void`

HELLO message received

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `any` |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:359](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L359)

___

### \_handleMessage

▸ **_handleMessage**(`code`, `msg`): `void`

Message handling, called from a SubProtocol context

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | `PREFIXES` |
| `msg` | `Uint8Array` |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:477](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L477)

___

### \_handlePing

▸ **_handlePing**(): `void`

PING message received

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:461](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L461)

___

### \_handlePong

▸ **_handlePong**(): `void`

PONG message received

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:468](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L468)

___

### \_onSocketClose

▸ **_onSocketClose**(): `void`

React to socket being closed

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:638](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L638)

___

### \_onSocketData

▸ **_onSocketData**(`data`): `void`

Process socket data

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Uint8Array` |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:608](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L608)

___

### \_sendAck

▸ **_sendAck**(): `void`

Send ACK message

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:170](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L170)

___

### \_sendAuth

▸ **_sendAuth**(): `void`

Send AUTH message

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:149](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L149)

___

### \_sendDisconnect

▸ **_sendDisconnect**(`reason`): `void`

Send DISCONNECT message

#### Parameters

| Name | Type |
| :------ | :------ |
| `reason` | [`DISCONNECT_REASON`](../enums/DISCONNECT_REASON.md) |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:253](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L253)

___

### \_sendHello

▸ **_sendHello**(): `void`

Send HELLO message

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:217](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L217)

___

### \_sendMessage

▸ **_sendMessage**(`code`, `data`): `undefined` \| `boolean`

Create message HEADER and BODY and send to socket
Also called from SubProtocol context

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | `number` |
| `data` | `Uint8Array` |

#### Returns

`undefined` \| `boolean`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:197](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L197)

___

### \_sendPing

▸ **_sendPing**(): `void`

Send PING message

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:272](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L272)

___

### \_sendPong

▸ **_sendPong**(): `void`

Send PONG message

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:290](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L290)

___

### disconnect

▸ **disconnect**(`reason?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `reason` | [`DISCONNECT_REASON`](../enums/DISCONNECT_REASON.md) | `DISCONNECT_REASON.DISCONNECT_REQUESTED` |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:679](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L679)

___

### getDisconnectPrefix

▸ **getDisconnectPrefix**(`code`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | [`DISCONNECT_REASON`](../enums/DISCONNECT_REASON.md) |

#### Returns

`string`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:675](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L675)

___

### getHelloMessage

▸ **getHelloMessage**(): ``null`` \| `Hello`

#### Returns

``null`` \| `Hello`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:663](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L663)

___

### getId

▸ **getId**(): ``null`` \| `Uint8Array`

#### Returns

``null`` \| `Uint8Array`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:658](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L658)

___

### getMsgPrefix

▸ **getMsgPrefix**(`code`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | `PREFIXES` |

#### Returns

`string`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:671](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L671)

___

### getProtocols

▸ **getProtocols**(): `Protocol`[]

#### Returns

`Protocol`[]

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:667](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L667)
