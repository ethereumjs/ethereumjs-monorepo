[**@ethereumjs/common**](../README.md)

***

[@ethereumjs/common](../README.md) / CustomCrypto

# Interface: CustomCrypto

Defined in: [common/src/types.ts:76](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L76)

## Properties

### ecdsaRecover()?

> `optional` **ecdsaRecover**: (`sig`, `recId`, `hash`) => `Uint8Array`

Defined in: [common/src/types.ts:90](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L90)

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

### ecrecover()?

> `optional` **ecrecover**: (`msgHash`, `v`, `r`, `s`, `chainId?`) => `Uint8Array`

Defined in: [common/src/types.ts:81](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L81)

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

> `optional` **ecsign**: (`message`, `secretKey`, `opts?`) => `Uint8Array`

Defined in: [common/src/types.ts:89](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L89)

#### Parameters

##### message

`Uint8Array`

##### secretKey

`Uint8Array`

##### opts?

`ECDSASignOpts`

#### Returns

`Uint8Array`

***

### keccak256()?

> `optional` **keccak256**: (`msg`) => `Uint8Array`

Defined in: [common/src/types.ts:80](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L80)

Interface for providing custom cryptographic primitives in place of `ethereum-cryptography` variants

#### Parameters

##### msg

`Uint8Array`

#### Returns

`Uint8Array`

***

### kzg?

> `optional` **kzg**: `KZG`

Defined in: [common/src/types.ts:91](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L91)

***

### sha256()?

> `optional` **sha256**: (`msg`) => `Uint8Array`

Defined in: [common/src/types.ts:88](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L88)

#### Parameters

##### msg

`Uint8Array`

#### Returns

`Uint8Array`
