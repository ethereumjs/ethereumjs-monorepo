[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / JSONTx

# Interface: JSONTx

Defined in: [types.ts:538](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L538)

Generic interface for all tx types with a
JSON representation of a transaction.

Note that all values are marked as optional
and not all the values are present on all tx types
(an EIP1559 tx e.g. lacks a `gasPrice`).

## Properties

### accessList?

> `optional` **accessList**: `JSONAccessListItem`[]

Defined in: [types.ts:549](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L549)

***

### authorizationList?

> `optional` **authorizationList**: [`AuthorizationList`](../type-aliases/AuthorizationList.md)

Defined in: [types.ts:550](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L550)

***

### blobVersionedHashes?

> `optional` **blobVersionedHashes**: `` `0x${string}` ``[]

Defined in: [types.ts:555](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L555)

***

### chainId?

> `optional` **chainId**: `` `0x${string}` ``

Defined in: [types.ts:548](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L548)

***

### data?

> `optional` **data**: `` `0x${string}` ``

Defined in: [types.ts:543](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L543)

***

### gasLimit?

> `optional` **gasLimit**: `` `0x${string}` ``

Defined in: [types.ts:541](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L541)

***

### gasPrice?

> `optional` **gasPrice**: `` `0x${string}` ``

Defined in: [types.ts:540](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L540)

***

### maxFeePerBlobGas?

> `optional` **maxFeePerBlobGas**: `` `0x${string}` ``

Defined in: [types.ts:554](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L554)

***

### maxFeePerGas?

> `optional` **maxFeePerGas**: `` `0x${string}` ``

Defined in: [types.ts:553](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L553)

***

### maxPriorityFeePerGas?

> `optional` **maxPriorityFeePerGas**: `` `0x${string}` ``

Defined in: [types.ts:552](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L552)

***

### nonce?

> `optional` **nonce**: `` `0x${string}` ``

Defined in: [types.ts:539](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L539)

***

### r?

> `optional` **r**: `` `0x${string}` ``

Defined in: [types.ts:545](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L545)

***

### s?

> `optional` **s**: `` `0x${string}` ``

Defined in: [types.ts:546](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L546)

***

### to?

> `optional` **to**: `` `0x${string}` ``

Defined in: [types.ts:542](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L542)

***

### type?

> `optional` **type**: `` `0x${string}` ``

Defined in: [types.ts:551](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L551)

***

### v?

> `optional` **v**: `` `0x${string}` ``

Defined in: [types.ts:544](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L544)

***

### value?

> `optional` **value**: `` `0x${string}` ``

Defined in: [types.ts:547](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L547)

***

### yParity?

> `optional` **yParity**: `` `0x${string}` ``

Defined in: [types.ts:556](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L556)
