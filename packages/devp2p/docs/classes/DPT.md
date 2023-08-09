[@ethereumjs/devp2p](../README.md) / DPT

# Class: DPT

## Table of contents

### Constructors

- [constructor](DPT.md#constructor)

### Properties

- [events](DPT.md#events)
- [id](DPT.md#id)

### Methods

- [\_addPeerBatch](DPT.md#_addpeerbatch)
- [\_onKBucketPing](DPT.md#_onkbucketping)
- [addPeer](DPT.md#addpeer)
- [banPeer](DPT.md#banpeer)
- [bind](DPT.md#bind)
- [bootstrap](DPT.md#bootstrap)
- [destroy](DPT.md#destroy)
- [getClosestPeers](DPT.md#getclosestpeers)
- [getDnsPeers](DPT.md#getdnspeers)
- [getPeer](DPT.md#getpeer)
- [getPeers](DPT.md#getpeers)
- [refresh](DPT.md#refresh)
- [removePeer](DPT.md#removepeer)

## Constructors

### constructor

• **new DPT**(`privateKey`, `options`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `privateKey` | `Uint8Array` |
| `options` | [`DPTOptions`](../interfaces/DPTOptions.md) |

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L35)

## Properties

### events

• **events**: `EventEmitter`

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:18](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L18)

___

### id

• `Readonly` **id**: `undefined` \| `Uint8Array`

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L24)

## Methods

### \_addPeerBatch

▸ **_addPeerBatch**(`peers`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `peers` | [`PeerInfo`](../interfaces/PeerInfo.md)[] |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:105](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L105)

___

### \_onKBucketPing

▸ **_onKBucketPing**(`oldPeers`, `newPeer`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `oldPeers` | [`PeerInfo`](../interfaces/PeerInfo.md)[] |
| `newPeer` | [`PeerInfo`](../interfaces/PeerInfo.md) |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:84](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L84)

___

### addPeer

▸ **addPeer**(`obj`): `Promise`<[`PeerInfo`](../interfaces/PeerInfo.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | [`PeerInfo`](../interfaces/PeerInfo.md) |

#### Returns

`Promise`<[`PeerInfo`](../interfaces/PeerInfo.md)\>

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:131](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L131)

___

### banPeer

▸ **banPeer**(`obj`, `maxAge?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `string` \| `Uint8Array` \| [`PeerInfo`](../interfaces/PeerInfo.md) |
| `maxAge?` | `number` |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:167](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L167)

___

### bind

▸ **bind**(...`args`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:75](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L75)

___

### bootstrap

▸ **bootstrap**(`peer`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `peer` | [`PeerInfo`](../interfaces/PeerInfo.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:118](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L118)

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

[packages/devp2p/src/dpt/dpt.ts:79](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L79)

___

### getClosestPeers

▸ **getClosestPeers**(`id`): [`PeerInfo`](../interfaces/PeerInfo.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `Uint8Array` |

#### Returns

[`PeerInfo`](../interfaces/PeerInfo.md)[]

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:159](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L159)

___

### getDnsPeers

▸ **getDnsPeers**(): `Promise`<[`PeerInfo`](../interfaces/PeerInfo.md)[]\>

#### Returns

`Promise`<[`PeerInfo`](../interfaces/PeerInfo.md)[]\>

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:172](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L172)

___

### getPeer

▸ **getPeer**(`obj`): ``null`` \| [`PeerInfo`](../interfaces/PeerInfo.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `string` \| `Uint8Array` \| [`PeerInfo`](../interfaces/PeerInfo.md) |

#### Returns

``null`` \| [`PeerInfo`](../interfaces/PeerInfo.md)

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:151](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L151)

___

### getPeers

▸ **getPeers**(): [`PeerInfo`](../interfaces/PeerInfo.md)[]

#### Returns

[`PeerInfo`](../interfaces/PeerInfo.md)[]

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:155](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L155)

___

### refresh

▸ **refresh**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:176](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L176)

___

### removePeer

▸ **removePeer**(`obj`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `string` \| `Uint8Array` \| [`PeerInfo`](../interfaces/PeerInfo.md) |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:163](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L163)
