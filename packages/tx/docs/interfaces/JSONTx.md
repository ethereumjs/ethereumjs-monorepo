[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / JSONTx

# Interface: JSONTx

Defined in: [types.ts:629](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L629)

Generic interface for all tx types with a
JSON representation of a transaction.

Note that all values are marked as optional
and not all the values are present on all tx types
(an EIP1559 tx e.g. lacks a `gasPrice`).

## Properties

### accessList?

> `optional` **accessList?**: `JSONAccessListItem`[]

Defined in: [types.ts:640](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L640)

***

### authorizationList?

> `optional` **authorizationList?**: `EOACode7702AuthorizationList`

Defined in: [types.ts:641](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L641)

***

### blobVersionedHashes?

> `optional` **blobVersionedHashes?**: `` `0x${string}` ``[]

Defined in: [types.ts:646](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L646)

***

### chainId?

> `optional` **chainId?**: `` `0x${string}` ``

Defined in: [types.ts:639](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L639)

***

### data?

> `optional` **data?**: `` `0x${string}` ``

Defined in: [types.ts:634](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L634)

***

### gasLimit?

> `optional` **gasLimit?**: `` `0x${string}` ``

Defined in: [types.ts:632](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L632)

***

### gasPrice?

> `optional` **gasPrice?**: `` `0x${string}` ``

Defined in: [types.ts:631](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L631)

***

### maxFeePerBlobGas?

> `optional` **maxFeePerBlobGas?**: `` `0x${string}` ``

Defined in: [types.ts:645](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L645)

***

### maxFeePerGas?

> `optional` **maxFeePerGas?**: `` `0x${string}` ``

Defined in: [types.ts:644](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L644)

***

### maxPriorityFeePerGas?

> `optional` **maxPriorityFeePerGas?**: `` `0x${string}` ``

Defined in: [types.ts:643](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L643)

***

### nonce?

> `optional` **nonce?**: `` `0x${string}` ``

Defined in: [types.ts:630](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L630)

***

### r?

> `optional` **r?**: `` `0x${string}` ``

Defined in: [types.ts:636](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L636)

***

### s?

> `optional` **s?**: `` `0x${string}` ``

Defined in: [types.ts:637](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L637)

***

### to?

> `optional` **to?**: `` `0x${string}` ``

Defined in: [types.ts:633](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L633)

***

### type?

> `optional` **type?**: `` `0x${string}` ``

Defined in: [types.ts:642](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L642)

***

### v?

> `optional` **v?**: `` `0x${string}` ``

Defined in: [types.ts:635](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L635)

***

### value?

> `optional` **value?**: `` `0x${string}` ``

Defined in: [types.ts:638](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L638)

***

### yParity?

> `optional` **yParity?**: `` `0x${string}` ``

Defined in: [types.ts:647](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L647)
