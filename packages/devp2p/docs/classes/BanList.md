[@ethereumjs/devp2p](../README.md) / BanList

# Class: BanList

## Table of contents

### Constructors

- [constructor](BanList.md#constructor)

### Methods

- [add](BanList.md#add)
- [has](BanList.md#has)

## Constructors

### constructor

• **new BanList**()

#### Defined in

[packages/devp2p/src/dpt/ban-list.ts:13](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/ban-list.ts#L13)

## Methods

### add

▸ **add**(`obj`, `maxAge?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `string` \| `Buffer` \| [`PeerInfo`](../interfaces/PeerInfo.md) |
| `maxAge?` | `number` |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/dpt/ban-list.ts:17](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/ban-list.ts#L17)

___

### has

▸ **has**(`obj`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `string` \| `Buffer` \| [`PeerInfo`](../interfaces/PeerInfo.md) |

#### Returns

`boolean`

#### Defined in

[packages/devp2p/src/dpt/ban-list.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/ban-list.ts#L24)
