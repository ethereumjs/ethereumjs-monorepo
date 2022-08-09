[@ethereumjs/devp2p](../README.md) / MAC

# Class: MAC

## Table of contents

### Constructors

- [constructor](MAC.md#constructor)

### Properties

- [\_hash](MAC.md#_hash)
- [\_secret](MAC.md#_secret)

### Methods

- [digest](MAC.md#digest)
- [update](MAC.md#update)
- [updateBody](MAC.md#updatebody)
- [updateHeader](MAC.md#updateheader)

## Constructors

### constructor

• **new MAC**(`secret`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `secret` | `Buffer` |

#### Defined in

[packages/devp2p/src/rlpx/mac.ts:11](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/mac.ts#L11)

## Properties

### \_hash

• **\_hash**: `Hash`<`Keccak`\>

#### Defined in

[packages/devp2p/src/rlpx/mac.ts:9](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/mac.ts#L9)

___

### \_secret

• **\_secret**: `Buffer`

#### Defined in

[packages/devp2p/src/rlpx/mac.ts:10](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/mac.ts#L10)

## Methods

### digest

▸ **digest**(): `Buffer`

#### Returns

`Buffer`

#### Defined in

[packages/devp2p/src/rlpx/mac.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/mac.ts#L34)

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

[packages/devp2p/src/rlpx/mac.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/mac.ts#L16)

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

[packages/devp2p/src/rlpx/mac.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/mac.ts#L26)

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

[packages/devp2p/src/rlpx/mac.ts:20](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/mac.ts#L20)
