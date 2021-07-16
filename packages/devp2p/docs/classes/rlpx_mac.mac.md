[@ethereumjs/devp2p](../README.md) / [rlpx/mac](../modules/rlpx_mac.md) / MAC

# Class: MAC

[rlpx/mac](../modules/rlpx_mac.md).MAC

## Table of contents

### Constructors

- [constructor](rlpx_mac.mac.md#constructor)

### Properties

- [\_hash](rlpx_mac.mac.md#_hash)
- [\_secret](rlpx_mac.mac.md#_secret)

### Methods

- [digest](rlpx_mac.mac.md#digest)
- [update](rlpx_mac.mac.md#update)
- [updateBody](rlpx_mac.mac.md#updatebody)
- [updateHeader](rlpx_mac.mac.md#updateheader)

## Constructors

### constructor

• **new MAC**(`secret`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `secret` | `Buffer` |

#### Defined in

[packages/devp2p/src/rlpx/mac.ts:7](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/mac.ts#L7)

## Properties

### \_hash

• **\_hash**: `any`

#### Defined in

[packages/devp2p/src/rlpx/mac.ts:6](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/mac.ts#L6)

___

### \_secret

• **\_secret**: `Buffer`

#### Defined in

[packages/devp2p/src/rlpx/mac.ts:7](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/mac.ts#L7)

## Methods

### digest

▸ **digest**(): `any`

#### Returns

`any`

#### Defined in

[packages/devp2p/src/rlpx/mac.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/mac.ts#L31)

___

### update

▸ **update**(`data`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `string` \| `Buffer` |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/mac.ts:13](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/mac.ts#L13)

___

### updateBody

▸ **updateBody**(`data`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `string` \| `Buffer` |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/mac.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/mac.ts#L23)

___

### updateHeader

▸ **updateHeader**(`data`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `string` \| `Buffer` |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/mac.ts:17](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/mac.ts#L17)
