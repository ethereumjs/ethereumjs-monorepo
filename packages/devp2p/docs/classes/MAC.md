[@ethereumjs/devp2p](../README.md) / MAC

# Class: MAC

## Table of contents

### Constructors

- [constructor](MAC.md#constructor)

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
| `secret` | `Uint8Array` |

#### Defined in

[packages/devp2p/src/rlpx/mac.ts:11](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/mac.ts#L11)

## Methods

### digest

▸ **digest**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Defined in

[packages/devp2p/src/rlpx/mac.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/mac.ts#L34)

___

### update

▸ **update**(`data`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `string` \| `Uint8Array` |

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
| `data` | `string` \| `Uint8Array` |

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
| `data` | `string` \| `Uint8Array` |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/mac.ts:20](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/mac.ts#L20)
