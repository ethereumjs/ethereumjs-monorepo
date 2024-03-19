[@ethereumjs/common](../README.md) / CustomCrypto

# Interface: CustomCrypto

## Table of contents

### Properties

- [ecdsaRecover](CustomCrypto.md#ecdsarecover)
- [ecdsaSign](CustomCrypto.md#ecdsasign)
- [ecrecover](CustomCrypto.md#ecrecover)
- [ecsign](CustomCrypto.md#ecsign)
- [keccak256](CustomCrypto.md#keccak256)
- [kzg](CustomCrypto.md#kzg)
- [sha256](CustomCrypto.md#sha256)

## Properties

### ecdsaRecover

• `Optional` **ecdsaRecover**: (`sig`: `Uint8Array`, `recId`: `number`, `hash`: `Uint8Array`) => `Uint8Array`

#### Type declaration

▸ (`sig`, `recId`, `hash`): `Uint8Array`

##### Parameters

| Name | Type |
| :------ | :------ |
| `sig` | `Uint8Array` |
| `recId` | `number` |
| `hash` | `Uint8Array` |

##### Returns

`Uint8Array`

#### Defined in

[types.ts:86](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L86)

___

### ecdsaSign

• `Optional` **ecdsaSign**: (`msg`: `Uint8Array`, `pk`: `Uint8Array`) => { `recid`: `number` ; `signature`: `Uint8Array`  }

#### Type declaration

▸ (`msg`, `pk`): `Object`

##### Parameters

| Name | Type |
| :------ | :------ |
| `msg` | `Uint8Array` |
| `pk` | `Uint8Array` |

##### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `recid` | `number` |
| `signature` | `Uint8Array` |

#### Defined in

[types.ts:85](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L85)

___

### ecrecover

• `Optional` **ecrecover**: (`msgHash`: `Uint8Array`, `v`: `bigint`, `r`: `Uint8Array`, `s`: `Uint8Array`, `chainId?`: `bigint`) => `Uint8Array`

#### Type declaration

▸ (`msgHash`, `v`, `r`, `s`, `chainId?`): `Uint8Array`

##### Parameters

| Name | Type |
| :------ | :------ |
| `msgHash` | `Uint8Array` |
| `v` | `bigint` |
| `r` | `Uint8Array` |
| `s` | `Uint8Array` |
| `chainId?` | `bigint` |

##### Returns

`Uint8Array`

#### Defined in

[types.ts:76](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L76)

___

### ecsign

• `Optional` **ecsign**: (`msg`: `Uint8Array`, `pk`: `Uint8Array`, `chainId?`: `bigint`) => `ECDSASignature`

#### Type declaration

▸ (`msg`, `pk`, `chainId?`): `ECDSASignature`

##### Parameters

| Name | Type |
| :------ | :------ |
| `msg` | `Uint8Array` |
| `pk` | `Uint8Array` |
| `chainId?` | `bigint` |

##### Returns

`ECDSASignature`

#### Defined in

[types.ts:84](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L84)

___

### keccak256

• `Optional` **keccak256**: (`msg`: `Uint8Array`) => `Uint8Array`

#### Type declaration

▸ (`msg`): `Uint8Array`

Interface for providing custom cryptographic primitives in place of `ethereum-cryptography` variants

##### Parameters

| Name | Type |
| :------ | :------ |
| `msg` | `Uint8Array` |

##### Returns

`Uint8Array`

#### Defined in

[types.ts:75](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L75)

___

### kzg

• `Optional` **kzg**: `Kzg`

#### Defined in

[types.ts:87](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L87)

___

### sha256

• `Optional` **sha256**: (`msg`: `Uint8Array`) => `Uint8Array`

#### Type declaration

▸ (`msg`): `Uint8Array`

##### Parameters

| Name | Type |
| :------ | :------ |
| `msg` | `Uint8Array` |

##### Returns

`Uint8Array`

#### Defined in

[types.ts:83](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L83)
