[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / JSONTx

# Interface: JSONTx

Defined in: [types.ts:521](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L521)

Generic interface for all tx types with a
JSON representation of a transaction.

Note that all values are marked as optional
and not all the values are present on all tx types
(an EIP1559 tx e.g. lacks a `gasPrice`).

## Properties

### accessList?

> `optional` **accessList**: `JSONAccessListItem`[]

Defined in: [types.ts:532](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L532)

***

### authorizationList?

> `optional` **authorizationList**: `EOACode7702AuthorizationList`

Defined in: [types.ts:533](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L533)

***

### blobVersionedHashes?

> `optional` **blobVersionedHashes**: `` `0x${string}` ``[]

Defined in: [types.ts:538](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L538)

***

### chainId?

> `optional` **chainId**: `` `0x${string}` ``

Defined in: [types.ts:531](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L531)

***

### data?

> `optional` **data**: `` `0x${string}` ``

Defined in: [types.ts:526](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L526)

***

### gasLimit?

> `optional` **gasLimit**: `` `0x${string}` ``

Defined in: [types.ts:524](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L524)

***

### gasPrice?

> `optional` **gasPrice**: `` `0x${string}` ``

Defined in: [types.ts:523](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L523)

***

### maxFeePerBlobGas?

> `optional` **maxFeePerBlobGas**: `` `0x${string}` ``

Defined in: [types.ts:537](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L537)

***

### maxFeePerGas?

> `optional` **maxFeePerGas**: `` `0x${string}` ``

Defined in: [types.ts:536](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L536)

***

### maxPriorityFeePerGas?

> `optional` **maxPriorityFeePerGas**: `` `0x${string}` ``

Defined in: [types.ts:535](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L535)

***

### nonce?

> `optional` **nonce**: `` `0x${string}` ``

Defined in: [types.ts:522](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L522)

***

### r?

> `optional` **r**: `` `0x${string}` ``

Defined in: [types.ts:528](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L528)

***

### s?

> `optional` **s**: `` `0x${string}` ``

Defined in: [types.ts:529](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L529)

***

### to?

> `optional` **to**: `` `0x${string}` ``

Defined in: [types.ts:525](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L525)

***

### type?

> `optional` **type**: `` `0x${string}` ``

Defined in: [types.ts:534](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L534)

***

### v?

> `optional` **v**: `` `0x${string}` ``

Defined in: [types.ts:527](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L527)

***

### value?

> `optional` **value**: `` `0x${string}` ``

Defined in: [types.ts:530](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L530)

***

### yParity?

> `optional` **yParity**: `` `0x${string}` ``

Defined in: [types.ts:539](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L539)
