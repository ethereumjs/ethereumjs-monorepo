[**@ethereumjs/common**](../README.md)

***

[@ethereumjs/common](../README.md) / CustomCrypto

# Interface: CustomCrypto

Defined in: [types.ts:76](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L76)

## Properties

### ecdsaRecover()?

> `optional` **ecdsaRecover**: (`sig`, `recId`, `hash`) => `Uint8Array`

Defined in: [types.ts:94](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L94)

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

Defined in: [types.ts:81](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L81)

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

> `optional` **ecsign**: (`msg`, `pk`, `ecSignOpts?`) => `Pick`\<`ReturnType`\<*typeof* `secp256k1.sign`\>, `"recovery"` \| `"r"` \| `"s"`\>

Defined in: [types.ts:89](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L89)

#### Parameters

##### msg

`Uint8Array`

##### pk

`Uint8Array`

##### ecSignOpts?

###### extraEntropy?

`boolean` \| `Uint8Array`\<`ArrayBufferLike`\>

#### Returns

`Pick`\<`ReturnType`\<*typeof* `secp256k1.sign`\>, `"recovery"` \| `"r"` \| `"s"`\>

***

### keccak256()?

> `optional` **keccak256**: (`msg`) => `Uint8Array`

Defined in: [types.ts:80](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L80)

Interface for providing custom cryptographic primitives in place of `ethereum-cryptography` variants

#### Parameters

##### msg

`Uint8Array`

#### Returns

`Uint8Array`

***

### kzg?

> `optional` **kzg**: `KZG`

Defined in: [types.ts:95](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L95)

***

### sha256()?

> `optional` **sha256**: (`msg`) => `Uint8Array`

Defined in: [types.ts:88](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L88)

#### Parameters

##### msg

`Uint8Array`

#### Returns

`Uint8Array`
