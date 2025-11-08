[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / JSONTx

# Interface: JSONTx

Defined in: [types.ts:593](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L593)

Generic interface for all tx types with a
JSON representation of a transaction.

Note that all values are marked as optional
and not all the values are present on all tx types
(an EIP1559 tx e.g. lacks a `gasPrice`).

## Properties

### accessList?

> `optional` **accessList**: `JSONAccessListItem`[]

Defined in: [types.ts:604](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L604)

***

### authorizationList?

> `optional` **authorizationList**: `EOACode7702AuthorizationList`

Defined in: [types.ts:605](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L605)

***

### blobVersionedHashes?

> `optional` **blobVersionedHashes**: `` `0x${string}` ``[]

Defined in: [types.ts:610](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L610)

***

### chainId?

> `optional` **chainId**: `` `0x${string}` ``

Defined in: [types.ts:603](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L603)

***

### data?

> `optional` **data**: `` `0x${string}` ``

Defined in: [types.ts:598](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L598)

***

### gasLimit?

> `optional` **gasLimit**: `` `0x${string}` ``

Defined in: [types.ts:596](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L596)

***

### gasPrice?

> `optional` **gasPrice**: `` `0x${string}` ``

Defined in: [types.ts:595](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L595)

***

### maxFeePerBlobGas?

> `optional` **maxFeePerBlobGas**: `` `0x${string}` ``

Defined in: [types.ts:609](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L609)

***

### maxFeePerGas?

> `optional` **maxFeePerGas**: `` `0x${string}` ``

Defined in: [types.ts:608](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L608)

***

### maxPriorityFeePerGas?

> `optional` **maxPriorityFeePerGas**: `` `0x${string}` ``

Defined in: [types.ts:607](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L607)

***

### nonce?

> `optional` **nonce**: `` `0x${string}` ``

Defined in: [types.ts:594](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L594)

***

### r?

> `optional` **r**: `` `0x${string}` ``

Defined in: [types.ts:600](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L600)

***

### s?

> `optional` **s**: `` `0x${string}` ``

Defined in: [types.ts:601](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L601)

***

### to?

> `optional` **to**: `` `0x${string}` ``

Defined in: [types.ts:597](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L597)

***

### type?

> `optional` **type**: `` `0x${string}` ``

Defined in: [types.ts:606](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L606)

***

### v?

> `optional` **v**: `` `0x${string}` ``

Defined in: [types.ts:599](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L599)

***

### value?

> `optional` **value**: `` `0x${string}` ``

Defined in: [types.ts:602](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L602)

***

### yParity?

> `optional` **yParity**: `` `0x${string}` ``

Defined in: [types.ts:611](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L611)
