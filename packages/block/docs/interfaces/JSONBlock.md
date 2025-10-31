[**@ethereumjs/block**](../README.md)

***

[@ethereumjs/block](../README.md) / JSONBlock

# Interface: JSONBlock

Defined in: [types.ts:142](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L142)

An object with the block's data represented as strings.

## Properties

### header?

> `optional` **header**: [`JSONHeader`](JSONHeader.md)

Defined in: [types.ts:146](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L146)

Header data for the block

***

### transactions?

> `optional` **transactions**: `JSONTx`[]

Defined in: [types.ts:147](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L147)

***

### uncleHeaders?

> `optional` **uncleHeaders**: [`JSONHeader`](JSONHeader.md)[]

Defined in: [types.ts:148](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L148)

***

### withdrawals?

> `optional` **withdrawals**: `JSONRPCWithdrawal`[]

Defined in: [types.ts:149](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L149)
