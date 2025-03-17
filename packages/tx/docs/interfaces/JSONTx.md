[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / JSONTx

# Interface: JSONTx

Defined in: [types.ts:534](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L534)

Generic interface for all tx types with a
JSON representation of a transaction.

Note that all values are marked as optional
and not all the values are present on all tx types
(an EIP1559 tx e.g. lacks a `gasPrice`).

## Properties

### accessList?

> `optional` **accessList**: `JSONAccessListItem`[]

Defined in: [types.ts:545](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L545)

***

### authorizationList?

> `optional` **authorizationList**: [`AuthorizationList`](../type-aliases/AuthorizationList.md)

Defined in: [types.ts:546](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L546)

***

### blobVersionedHashes?

> `optional` **blobVersionedHashes**: `` `0x${string}` ``[]

Defined in: [types.ts:551](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L551)

***

### chainId?

> `optional` **chainId**: `` `0x${string}` ``

Defined in: [types.ts:544](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L544)

***

### data?

> `optional` **data**: `` `0x${string}` ``

Defined in: [types.ts:539](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L539)

***

### gasLimit?

> `optional` **gasLimit**: `` `0x${string}` ``

Defined in: [types.ts:537](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L537)

***

### gasPrice?

> `optional` **gasPrice**: `` `0x${string}` ``

Defined in: [types.ts:536](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L536)

***

### maxFeePerBlobGas?

> `optional` **maxFeePerBlobGas**: `` `0x${string}` ``

Defined in: [types.ts:550](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L550)

***

### maxFeePerGas?

> `optional` **maxFeePerGas**: `` `0x${string}` ``

Defined in: [types.ts:549](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L549)

***

### maxPriorityFeePerGas?

> `optional` **maxPriorityFeePerGas**: `` `0x${string}` ``

Defined in: [types.ts:548](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L548)

***

### nonce?

> `optional` **nonce**: `` `0x${string}` ``

Defined in: [types.ts:535](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L535)

***

### r?

> `optional` **r**: `` `0x${string}` ``

Defined in: [types.ts:541](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L541)

***

### s?

> `optional` **s**: `` `0x${string}` ``

Defined in: [types.ts:542](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L542)

***

### to?

> `optional` **to**: `` `0x${string}` ``

Defined in: [types.ts:538](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L538)

***

### type?

> `optional` **type**: `` `0x${string}` ``

Defined in: [types.ts:547](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L547)

***

### v?

> `optional` **v**: `` `0x${string}` ``

Defined in: [types.ts:540](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L540)

***

### value?

> `optional` **value**: `` `0x${string}` ``

Defined in: [types.ts:543](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L543)

***

### yParity?

> `optional` **yParity**: `` `0x${string}` ``

Defined in: [types.ts:552](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L552)
