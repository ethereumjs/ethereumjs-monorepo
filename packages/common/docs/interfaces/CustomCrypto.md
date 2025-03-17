[**@ethereumjs/common**](../README.md)

***

[@ethereumjs/common](../README.md) / CustomCrypto

# Interface: CustomCrypto

Defined in: [types.ts:81](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L81)

## Properties

### ecdsaRecover()?

> `optional` **ecdsaRecover**: (`sig`, `recId`, `hash`) => `Uint8Array`

Defined in: [types.ts:96](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L96)

#### Parameters

##### sig

`Uint8Array`

##### recId

`number`

##### hash

`Uint8Array`

#### Returns

`Uint8Array`

***

### ecdsaSign()?

> `optional` **ecdsaSign**: (`msg`, `pk`) => `object`

Defined in: [types.ts:95](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L95)

#### Parameters

##### msg

`Uint8Array`

##### pk

`Uint8Array`

#### Returns

`object`

##### recid

> **recid**: `number`

##### signature

> **signature**: `Uint8Array`

***

### ecrecover()?

> `optional` **ecrecover**: (`msgHash`, `v`, `r`, `s`, `chainId`?) => `Uint8Array`

Defined in: [types.ts:86](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L86)

#### Parameters

##### msgHash

`Uint8Array`

##### v

`bigint`

##### r

`Uint8Array`

##### s

`Uint8Array`

##### chainId?

`bigint`

#### Returns

`Uint8Array`

***

### ecsign()?

> `optional` **ecsign**: (`msg`, `pk`, `chainId`?) => `ECDSASignature`

Defined in: [types.ts:94](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L94)

#### Parameters

##### msg

`Uint8Array`

##### pk

`Uint8Array`

##### chainId?

`bigint`

#### Returns

`ECDSASignature`

***

### keccak256()?

> `optional` **keccak256**: (`msg`) => `Uint8Array`

Defined in: [types.ts:85](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L85)

Interface for providing custom cryptographic primitives in place of `ethereum-cryptography` variants

#### Parameters

##### msg

`Uint8Array`

#### Returns

`Uint8Array`

***

### kzg?

> `optional` **kzg**: `KZG`

Defined in: [types.ts:97](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L97)

***

### sha256()?

> `optional` **sha256**: (`msg`) => `Uint8Array`

Defined in: [types.ts:93](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L93)

#### Parameters

##### msg

`Uint8Array`

#### Returns

`Uint8Array`

***

### verkle?

> `optional` **verkle**: `VerkleCrypto`

Defined in: [types.ts:98](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L98)
