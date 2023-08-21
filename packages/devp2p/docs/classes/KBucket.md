[@ethereumjs/devp2p](../README.md) / KBucket

# Class: KBucket

## Table of contents

### Constructors

- [constructor](KBucket.md#constructor)

### Properties

- [events](KBucket.md#events)

### Methods

- [add](KBucket.md#add)
- [closest](KBucket.md#closest)
- [get](KBucket.md#get)
- [getAll](KBucket.md#getall)
- [remove](KBucket.md#remove)
- [getKeys](KBucket.md#getkeys)

## Constructors

### constructor

• **new KBucket**(`localNodeId`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `localNodeId` | `Uint8Array` |

#### Defined in

[packages/devp2p/src/dpt/kbucket.ts:15](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/kbucket.ts#L15)

## Properties

### events

• **events**: `EventEmitter`

#### Defined in

[packages/devp2p/src/dpt/kbucket.ts:12](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/kbucket.ts#L12)

## Methods

### add

▸ **add**(`peer`): `void` \| `KBucket`

#### Parameters

| Name | Type |
| :------ | :------ |
| `peer` | [`PeerInfo`](../interfaces/PeerInfo.md) |

#### Returns

`void` \| `KBucket`

#### Defined in

[packages/devp2p/src/dpt/kbucket.ts:53](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/kbucket.ts#L53)

___

### closest

▸ **closest**(`id`): [`PeerInfo`](../interfaces/PeerInfo.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `Uint8Array` |

#### Returns

[`PeerInfo`](../interfaces/PeerInfo.md)[]

#### Defined in

[packages/devp2p/src/dpt/kbucket.ts:71](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/kbucket.ts#L71)

___

### get

▸ **get**(`obj`): ``null`` \| [`PeerInfo`](../interfaces/PeerInfo.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `string` \| `Uint8Array` \| [`PeerInfo`](../interfaces/PeerInfo.md) |

#### Returns

``null`` \| [`PeerInfo`](../interfaces/PeerInfo.md)

#### Defined in

[packages/devp2p/src/dpt/kbucket.ts:58](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/kbucket.ts#L58)

___

### getAll

▸ **getAll**(): [`PeerInfo`](../interfaces/PeerInfo.md)[]

#### Returns

[`PeerInfo`](../interfaces/PeerInfo.md)[]

#### Defined in

[packages/devp2p/src/dpt/kbucket.ts:67](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/kbucket.ts#L67)

___

### remove

▸ **remove**(`obj`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `string` \| `Uint8Array` \| [`PeerInfo`](../interfaces/PeerInfo.md) |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/dpt/kbucket.ts:75](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/kbucket.ts#L75)

___

### getKeys

▸ `Static` **getKeys**(`obj`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `string` \| `Uint8Array` \| [`PeerInfo`](../interfaces/PeerInfo.md) |

#### Returns

`string`[]

#### Defined in

[packages/devp2p/src/dpt/kbucket.ts:42](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/kbucket.ts#L42)
