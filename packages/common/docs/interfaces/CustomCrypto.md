[**@ethereumjs/common**](../README.md)

***

[@ethereumjs/common](../README.md) / CustomCrypto

# Interface: CustomCrypto

Defined in: [types.ts:87](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L87)

CustomCrypto type.

## Properties

### ecdsaRecover?

> `optional` **ecdsaRecover?**: (`sig`, `recId`, `hash`) => `Uint8Array`

Defined in: [types.ts:101](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L101)

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

### ecrecover?

> `optional` **ecrecover?**: (`msgHash`, `v`, `r`, `s`, `chainId?`) => `Uint8Array`

Defined in: [types.ts:92](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L92)

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

### ecsign?

> `optional` **ecsign?**: (`message`, `secretKey`, `opts?`) => `Uint8Array`

Defined in: [types.ts:100](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L100)

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

### keccak256?

> `optional` **keccak256?**: (`msg`) => `Uint8Array`

Defined in: [types.ts:91](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L91)

Interface for providing custom cryptographic primitives in place of `ethereum-cryptography` variants

#### Parameters

##### msg

`Uint8Array`

#### Returns

`Uint8Array`

***

### kzg?

> `optional` **kzg?**: `KZG`

Defined in: [types.ts:102](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L102)

***

### sha256?

> `optional` **sha256?**: (`msg`) => `Uint8Array`

Defined in: [types.ts:99](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L99)

#### Parameters

##### msg

`Uint8Array`

#### Returns

`Uint8Array`
