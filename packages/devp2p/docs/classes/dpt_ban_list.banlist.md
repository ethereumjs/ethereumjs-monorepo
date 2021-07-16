[@ethereumjs/devp2p](../README.md) / [dpt/ban-list](../modules/dpt_ban_list.md) / BanList

# Class: BanList

[dpt/ban-list](../modules/dpt_ban_list.md).BanList

## Table of contents

### Constructors

- [constructor](dpt_ban_list.banlist.md#constructor)

### Methods

- [add](dpt_ban_list.banlist.md#add)
- [has](dpt_ban_list.banlist.md#has)

## Constructors

### constructor

• **new BanList**()

#### Defined in

[packages/devp2p/src/dpt/ban-list.ts:11](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/ban-list.ts#L11)

## Methods

### add

▸ **add**(`obj`, `maxAge?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `string` \| [PeerInfo](../interfaces/dpt_dpt.peerinfo.md) \| `Buffer` |
| `maxAge?` | `number` |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/dpt/ban-list.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/ban-list.ts#L16)

___

### has

▸ **has**(`obj`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `string` \| [PeerInfo](../interfaces/dpt_dpt.peerinfo.md) \| `Buffer` |

#### Returns

`boolean`

#### Defined in

[packages/devp2p/src/dpt/ban-list.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/ban-list.ts#L23)
