[@ethereumjs/devp2p](../README.md) / RLPx

# Class: RLPx

## Table of contents

### Constructors

- [constructor](RLPx.md#constructor)

### Properties

- [clientId](RLPx.md#clientid)
- [events](RLPx.md#events)
- [id](RLPx.md#id)

### Methods

- [\_connectToPeer](RLPx.md#_connecttopeer)
- [\_getOpenQueueSlots](RLPx.md#_getopenqueueslots)
- [\_getOpenSlots](RLPx.md#_getopenslots)
- [\_isAlive](RLPx.md#_isalive)
- [\_isAliveCheck](RLPx.md#_isalivecheck)
- [\_onConnect](RLPx.md#_onconnect)
- [\_refillConnections](RLPx.md#_refillconnections)
- [connect](RLPx.md#connect)
- [destroy](RLPx.md#destroy)
- [disconnect](RLPx.md#disconnect)
- [getPeers](RLPx.md#getpeers)
- [listen](RLPx.md#listen)

## Constructors

### constructor

• **new RLPx**(`privateKey`, `options`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `privateKey` | `Uint8Array` |
| `options` | [`RLPxOptions`](../interfaces/RLPxOptions.md) |

#### Defined in

[packages/devp2p/src/rlpx/rlpx.ts:55](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L55)

## Properties

### clientId

• `Readonly` **clientId**: `Uint8Array`

#### Defined in

[packages/devp2p/src/rlpx/rlpx.ts:40](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L40)

___

### events

• **events**: `EventEmitter`

#### Defined in

[packages/devp2p/src/rlpx/rlpx.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L34)

___

### id

• `Readonly` **id**: `Uint8Array`

#### Defined in

[packages/devp2p/src/rlpx/rlpx.ts:36](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L36)

## Methods

### \_connectToPeer

▸ **_connectToPeer**(`peer`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `peer` | [`PeerInfo`](../interfaces/PeerInfo.md) |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/rlpx.ts:192](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L192)

___

### \_getOpenQueueSlots

▸ **_getOpenQueueSlots**(): `number`

#### Returns

`number`

#### Defined in

[packages/devp2p/src/rlpx/rlpx.ts:188](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L188)

___

### \_getOpenSlots

▸ **_getOpenSlots**(): `number`

#### Returns

`number`

#### Defined in

[packages/devp2p/src/rlpx/rlpx.ts:184](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L184)

___

### \_isAlive

▸ **_isAlive**(): `boolean`

#### Returns

`boolean`

#### Defined in

[packages/devp2p/src/rlpx/rlpx.ts:176](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L176)

___

### \_isAliveCheck

▸ **_isAliveCheck**(): `void`

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/rlpx.ts:180](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L180)

___

### \_onConnect

▸ **_onConnect**(`socket`, `peerId`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `socket` | `Socket` |
| `peerId` | ``null`` \| `Uint8Array` |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/rlpx.ts:201](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L201)

___

### \_refillConnections

▸ **_refillConnections**(): `void`

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/rlpx.ts:286](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L286)

___

### connect

▸ **connect**(`peer`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `peer` | [`PeerInfo`](../interfaces/PeerInfo.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/devp2p/src/rlpx/rlpx.ts:137](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L137)

___

### destroy

▸ **destroy**(...`args`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/rlpx.ts:125](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L125)

___

### disconnect

▸ **disconnect**(`id`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `Uint8Array` |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/rlpx.ts:169](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L169)

___

### getPeers

▸ **getPeers**(): (`Socket` \| [`Peer`](Peer.md))[]

#### Returns

(`Socket` \| [`Peer`](Peer.md))[]

#### Defined in

[packages/devp2p/src/rlpx/rlpx.ts:165](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L165)

___

### listen

▸ **listen**(...`args`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/rlpx.ts:118](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L118)
