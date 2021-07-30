[@ethereumjs/devp2p](../README.md) / [rlpx/peer](../modules/rlpx_peer.md) / Peer

# Class: Peer

[rlpx/peer](../modules/rlpx_peer.md).Peer

## Hierarchy

- `EventEmitter`

  ↳ **Peer**

## Table of contents

### Constructors

- [constructor](rlpx_peer.peer.md#constructor)

### Properties

- [\_EIP8](rlpx_peer.peer.md#_eip8)
- [\_capabilities](rlpx_peer.peer.md#_capabilities)
- [\_clientId](rlpx_peer.peer.md#_clientid)
- [\_closed](rlpx_peer.peer.md#_closed)
- [\_common](rlpx_peer.peer.md#_common)
- [\_connected](rlpx_peer.peer.md#_connected)
- [\_disconnectReason](rlpx_peer.peer.md#_disconnectreason)
- [\_disconnectWe](rlpx_peer.peer.md#_disconnectwe)
- [\_eciesSession](rlpx_peer.peer.md#_eciessession)
- [\_hello](rlpx_peer.peer.md#_hello)
- [\_id](rlpx_peer.peer.md#_id)
- [\_nextPacketSize](rlpx_peer.peer.md#_nextpacketsize)
- [\_pingIntervalId](rlpx_peer.peer.md#_pingintervalid)
- [\_pingTimeout](rlpx_peer.peer.md#_pingtimeout)
- [\_pingTimeoutId](rlpx_peer.peer.md#_pingtimeoutid)
- [\_port](rlpx_peer.peer.md#_port)
- [\_protocols](rlpx_peer.peer.md#_protocols)
- [\_remoteClientIdFilter](rlpx_peer.peer.md#_remoteclientidfilter)
- [\_remoteId](rlpx_peer.peer.md#_remoteid)
- [\_socket](rlpx_peer.peer.md#_socket)
- [\_socketData](rlpx_peer.peer.md#_socketdata)
- [\_state](rlpx_peer.peer.md#_state)
- [\_weHello](rlpx_peer.peer.md#_wehello)
- [defaultMaxListeners](rlpx_peer.peer.md#defaultmaxlisteners)

### Methods

- [\_getProtocol](rlpx_peer.peer.md#_getprotocol)
- [\_handleAck](rlpx_peer.peer.md#_handleack)
- [\_handleAuth](rlpx_peer.peer.md#_handleauth)
- [\_handleBody](rlpx_peer.peer.md#_handlebody)
- [\_handleDisconnect](rlpx_peer.peer.md#_handledisconnect)
- [\_handleHeader](rlpx_peer.peer.md#_handleheader)
- [\_handleHello](rlpx_peer.peer.md#_handlehello)
- [\_handleMessage](rlpx_peer.peer.md#_handlemessage)
- [\_handlePing](rlpx_peer.peer.md#_handleping)
- [\_handlePong](rlpx_peer.peer.md#_handlepong)
- [\_onSocketClose](rlpx_peer.peer.md#_onsocketclose)
- [\_onSocketData](rlpx_peer.peer.md#_onsocketdata)
- [\_sendAck](rlpx_peer.peer.md#_sendack)
- [\_sendAuth](rlpx_peer.peer.md#_sendauth)
- [\_sendDisconnect](rlpx_peer.peer.md#_senddisconnect)
- [\_sendHello](rlpx_peer.peer.md#_sendhello)
- [\_sendMessage](rlpx_peer.peer.md#_sendmessage)
- [\_sendPing](rlpx_peer.peer.md#_sendping)
- [\_sendPong](rlpx_peer.peer.md#_sendpong)
- [addListener](rlpx_peer.peer.md#addlistener)
- [disconnect](rlpx_peer.peer.md#disconnect)
- [emit](rlpx_peer.peer.md#emit)
- [eventNames](rlpx_peer.peer.md#eventnames)
- [getDisconnectPrefix](rlpx_peer.peer.md#getdisconnectprefix)
- [getHelloMessage](rlpx_peer.peer.md#gethellomessage)
- [getId](rlpx_peer.peer.md#getid)
- [getMaxListeners](rlpx_peer.peer.md#getmaxlisteners)
- [getMsgPrefix](rlpx_peer.peer.md#getmsgprefix)
- [getProtocols](rlpx_peer.peer.md#getprotocols)
- [listenerCount](rlpx_peer.peer.md#listenercount)
- [listeners](rlpx_peer.peer.md#listeners)
- [off](rlpx_peer.peer.md#off)
- [on](rlpx_peer.peer.md#on)
- [once](rlpx_peer.peer.md#once)
- [prependListener](rlpx_peer.peer.md#prependlistener)
- [prependOnceListener](rlpx_peer.peer.md#prependoncelistener)
- [rawListeners](rlpx_peer.peer.md#rawlisteners)
- [removeAllListeners](rlpx_peer.peer.md#removealllisteners)
- [removeListener](rlpx_peer.peer.md#removelistener)
- [setMaxListeners](rlpx_peer.peer.md#setmaxlisteners)
- [listenerCount](rlpx_peer.peer.md#listenercount)
- [once](rlpx_peer.peer.md#once)

## Constructors

### constructor

• **new Peer**(`options`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `any` |

#### Overrides

EventEmitter.constructor

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:101](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L101)

## Properties

### \_EIP8

• **\_EIP8**: `Buffer`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:86](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L86)

___

### \_capabilities

• `Optional` **\_capabilities**: [Capabilities](../interfaces/rlpx_peer.capabilities.md)[]

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:80](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L80)

___

### \_clientId

• **\_clientId**: `Buffer`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:79](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L79)

___

### \_closed

• **\_closed**: `boolean`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:96](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L96)

___

### \_common

• **\_common**: `default`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:81](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L81)

___

### \_connected

• **\_connected**: `boolean`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:97](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L97)

___

### \_disconnectReason

• `Optional` **\_disconnectReason**: [DISCONNECT\_REQUESTED](../enums/rlpx_peer.disconnect_reasons.md#disconnect_requested) \| [NETWORK\_ERROR](../enums/rlpx_peer.disconnect_reasons.md#network_error) \| [PROTOCOL\_ERROR](../enums/rlpx_peer.disconnect_reasons.md#protocol_error) \| [USELESS\_PEER](../enums/rlpx_peer.disconnect_reasons.md#useless_peer) \| [TOO\_MANY\_PEERS](../enums/rlpx_peer.disconnect_reasons.md#too_many_peers) \| [ALREADY\_CONNECTED](../enums/rlpx_peer.disconnect_reasons.md#already_connected) \| [INCOMPATIBLE\_VERSION](../enums/rlpx_peer.disconnect_reasons.md#incompatible_version) \| [INVALID\_IDENTITY](../enums/rlpx_peer.disconnect_reasons.md#invalid_identity) \| [CLIENT\_QUITTING](../enums/rlpx_peer.disconnect_reasons.md#client_quitting) \| [UNEXPECTED\_IDENTITY](../enums/rlpx_peer.disconnect_reasons.md#unexpected_identity) \| [SAME\_IDENTITY](../enums/rlpx_peer.disconnect_reasons.md#same_identity) \| [TIMEOUT](../enums/rlpx_peer.disconnect_reasons.md#timeout) \| [SUBPROTOCOL\_ERROR](../enums/rlpx_peer.disconnect_reasons.md#subprotocol_error)

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:98](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L98)

___

### \_disconnectWe

• **\_disconnectWe**: `any`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:99](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L99)

___

### \_eciesSession

• **\_eciesSession**: [ECIES](rlpx_ecies.ecies.md)

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:87](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L87)

___

### \_hello

• **\_hello**: ``null`` \| [Hello](../interfaces/rlpx_peer.hello.md)

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:90](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L90)

___

### \_id

• **\_id**: `Buffer`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:83](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L83)

___

### \_nextPacketSize

• **\_nextPacketSize**: `number`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:91](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L91)

___

### \_pingIntervalId

• **\_pingIntervalId**: ``null`` \| `Timeout`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:94](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L94)

___

### \_pingTimeout

• **\_pingTimeout**: `number`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:100](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L100)

___

### \_pingTimeoutId

• **\_pingTimeoutId**: ``null`` \| `Timeout`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:95](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L95)

___

### \_port

• **\_port**: `number`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:82](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L82)

___

### \_protocols

• **\_protocols**: [ProtocolDescriptor](../interfaces/rlpx_peer.protocoldescriptor.md)[]

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:101](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L101)

___

### \_remoteClientIdFilter

• **\_remoteClientIdFilter**: `any`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:84](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L84)

___

### \_remoteId

• **\_remoteId**: `Buffer`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:85](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L85)

___

### \_socket

• **\_socket**: `Socket`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:92](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L92)

___

### \_socketData

• **\_socketData**: `BufferList`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:93](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L93)

___

### \_state

• **\_state**: `string`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:88](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L88)

___

### \_weHello

• **\_weHello**: ``null`` \| [HelloMsg](../modules/rlpx_peer.md#hellomsg)

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:89](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L89)

___

### defaultMaxListeners

▪ `Static` **defaultMaxListeners**: `number`

#### Inherited from

EventEmitter.defaultMaxListeners

#### Defined in

node_modules/@types/node/events.d.ts:20

## Methods

### \_getProtocol

▸ **_getProtocol**(`code`): `undefined` \| [ProtocolDescriptor](../interfaces/rlpx_peer.protocoldescriptor.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | `number` |

#### Returns

`undefined` \| [ProtocolDescriptor](../interfaces/rlpx_peer.protocoldescriptor.md)

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:553](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L553)

___

### \_handleAck

▸ **_handleAck**(): `void`

ACK message received

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:304](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L304)

___

### \_handleAuth

▸ **_handleAuth**(): `void`

AUTH message received

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:281](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L281)

___

### \_handleBody

▸ **_handleBody**(): `void`

Handle message body

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:468](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L468)

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

[packages/devp2p/src/rlpx/peer.ts:397](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L397)

___

### \_handleHeader

▸ **_handleHeader**(): `void`

Handle message header

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:449](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L449)

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

[packages/devp2p/src/rlpx/peer.ts:331](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L331)

___

### \_handleMessage

▸ **_handleMessage**(`code`, `msg`): `void`

Message handling, called from a SubProtocol context

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | [PREFIXES](../enums/rlpx_peer.prefixes.md) |
| `msg` | `Buffer` |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:428](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L428)

___

### \_handlePing

▸ **_handlePing**(): `void`

PING message received

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:412](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L412)

___

### \_handlePong

▸ **_handlePong**(): `void`

PONG message received

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:419](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L419)

___

### \_onSocketClose

▸ **_onSocketClose**(): `void`

React to socket being closed

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:545](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L545)

___

### \_onSocketData

▸ **_onSocketData**(`data`): `void`

Process socket data

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Buffer` |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:515](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L515)

___

### \_sendAck

▸ **_sendAck**(): `void`

Send ACK message

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:172](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L172)

___

### \_sendAuth

▸ **_sendAuth**(): `void`

Send AUTH message

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:151](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L151)

___

### \_sendDisconnect

▸ **_sendDisconnect**(`reason`): `void`

Send DISCONNECT message

#### Parameters

| Name | Type |
| :------ | :------ |
| `reason` | [DISCONNECT\_REASONS](../enums/rlpx_peer.disconnect_reasons.md) |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:240](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L240)

___

### \_sendHello

▸ **_sendHello**(): `void`

Send HELLO message

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:216](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L216)

___

### \_sendMessage

▸ **_sendMessage**(`code`, `data`): `undefined` \| `boolean`

Create message HEADER and BODY and send to socket
Also called from SubProtocol context

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | `number` |
| `data` | `Buffer` |

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

[packages/devp2p/src/rlpx/peer.ts:258](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L258)

___

### \_sendPong

▸ **_sendPong**(): `void`

Send PONG message

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:272](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L272)

___

### addListener

▸ **addListener**(`event`, `listener`): [Peer](rlpx_peer.peer.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[Peer](rlpx_peer.peer.md)

#### Inherited from

EventEmitter.addListener

#### Defined in

node_modules/@types/node/globals.d.ts:595

___

### disconnect

▸ **disconnect**(`reason?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `reason` | [DISCONNECT\_REASONS](../enums/rlpx_peer.disconnect_reasons.md) |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:581](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L581)

___

### emit

▸ **emit**(`event`, ...`args`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `...args` | `any`[] |

#### Returns

`boolean`

#### Inherited from

EventEmitter.emit

#### Defined in

node_modules/@types/node/globals.d.ts:605

___

### eventNames

▸ **eventNames**(): (`string` \| `symbol`)[]

#### Returns

(`string` \| `symbol`)[]

#### Inherited from

EventEmitter.eventNames

#### Defined in

node_modules/@types/node/globals.d.ts:610

___

### getDisconnectPrefix

▸ **getDisconnectPrefix**(`code`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | [DISCONNECT\_REASONS](../enums/rlpx_peer.disconnect_reasons.md) |

#### Returns

`string`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:577](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L577)

___

### getHelloMessage

▸ **getHelloMessage**(): ``null`` \| [Hello](../interfaces/rlpx_peer.hello.md)

#### Returns

``null`` \| [Hello](../interfaces/rlpx_peer.hello.md)

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:565](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L565)

___

### getId

▸ **getId**(): ``null`` \| `Buffer`

#### Returns

``null`` \| `Buffer`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:560](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L560)

___

### getMaxListeners

▸ **getMaxListeners**(): `number`

#### Returns

`number`

#### Inherited from

EventEmitter.getMaxListeners

#### Defined in

node_modules/@types/node/globals.d.ts:602

___

### getMsgPrefix

▸ **getMsgPrefix**(`code`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | [PREFIXES](../enums/rlpx_peer.prefixes.md) |

#### Returns

`string`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:573](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L573)

___

### getProtocols

▸ **getProtocols**<T\>(): `T`[]

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T`: [ETH](eth.eth-2.md) \| [LES](les.les-2.md) |

#### Returns

`T`[]

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:569](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L569)

___

### listenerCount

▸ **listenerCount**(`type`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` \| `symbol` |

#### Returns

`number`

#### Inherited from

EventEmitter.listenerCount

#### Defined in

node_modules/@types/node/globals.d.ts:606

___

### listeners

▸ **listeners**(`event`): `Function`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |

#### Returns

`Function`[]

#### Inherited from

EventEmitter.listeners

#### Defined in

node_modules/@types/node/globals.d.ts:603

___

### off

▸ **off**(`event`, `listener`): [Peer](rlpx_peer.peer.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[Peer](rlpx_peer.peer.md)

#### Inherited from

EventEmitter.off

#### Defined in

node_modules/@types/node/globals.d.ts:599

___

### on

▸ **on**(`event`, `listener`): [Peer](rlpx_peer.peer.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[Peer](rlpx_peer.peer.md)

#### Inherited from

EventEmitter.on

#### Defined in

node_modules/@types/node/globals.d.ts:596

___

### once

▸ **once**(`event`, `listener`): [Peer](rlpx_peer.peer.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[Peer](rlpx_peer.peer.md)

#### Inherited from

EventEmitter.once

#### Defined in

node_modules/@types/node/globals.d.ts:597

___

### prependListener

▸ **prependListener**(`event`, `listener`): [Peer](rlpx_peer.peer.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[Peer](rlpx_peer.peer.md)

#### Inherited from

EventEmitter.prependListener

#### Defined in

node_modules/@types/node/globals.d.ts:608

___

### prependOnceListener

▸ **prependOnceListener**(`event`, `listener`): [Peer](rlpx_peer.peer.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[Peer](rlpx_peer.peer.md)

#### Inherited from

EventEmitter.prependOnceListener

#### Defined in

node_modules/@types/node/globals.d.ts:609

___

### rawListeners

▸ **rawListeners**(`event`): `Function`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |

#### Returns

`Function`[]

#### Inherited from

EventEmitter.rawListeners

#### Defined in

node_modules/@types/node/globals.d.ts:604

___

### removeAllListeners

▸ **removeAllListeners**(`event?`): [Peer](rlpx_peer.peer.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event?` | `string` \| `symbol` |

#### Returns

[Peer](rlpx_peer.peer.md)

#### Inherited from

EventEmitter.removeAllListeners

#### Defined in

node_modules/@types/node/globals.d.ts:600

___

### removeListener

▸ **removeListener**(`event`, `listener`): [Peer](rlpx_peer.peer.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[Peer](rlpx_peer.peer.md)

#### Inherited from

EventEmitter.removeListener

#### Defined in

node_modules/@types/node/globals.d.ts:598

___

### setMaxListeners

▸ **setMaxListeners**(`n`): [Peer](rlpx_peer.peer.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `number` |

#### Returns

[Peer](rlpx_peer.peer.md)

#### Inherited from

EventEmitter.setMaxListeners

#### Defined in

node_modules/@types/node/globals.d.ts:601

___

### listenerCount

▸ `Static` **listenerCount**(`emitter`, `event`): `number`

**`deprecated`** since v4.0.0

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | `EventEmitter` |
| `event` | `string` \| `symbol` |

#### Returns

`number`

#### Inherited from

EventEmitter.listenerCount

#### Defined in

node_modules/@types/node/events.d.ts:17

___

### once

▸ `Static` **once**(`emitter`, `event`): `Promise`<any[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | `NodeEventTarget` |
| `event` | `string` \| `symbol` |

#### Returns

`Promise`<any[]\>

#### Inherited from

EventEmitter.once

#### Defined in

node_modules/@types/node/events.d.ts:13

▸ `Static` **once**(`emitter`, `event`): `Promise`<any[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | `DOMEventTarget` |
| `event` | `string` |

#### Returns

`Promise`<any[]\>

#### Inherited from

EventEmitter.once

#### Defined in

node_modules/@types/node/events.d.ts:14
