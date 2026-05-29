[**@ethereumjs/block**](../README.md)

***

[@ethereumjs/block](../README.md) / JSONBlock

# Interface: JSONBlock

Defined in: [types.ts:154](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L154)

An object with the block's data represented as strings.

## Properties

### header?

> `optional` **header**: [`JSONHeader`](JSONHeader.md)

Defined in: [types.ts:158](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L158)

Header data for the block

***

### transactions?

> `optional` **transactions**: `JSONTx`[]

Defined in: [types.ts:159](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L159)

***

### uncleHeaders?

> `optional` **uncleHeaders**: [`JSONHeader`](JSONHeader.md)[]

Defined in: [types.ts:160](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L160)

***

### withdrawals?

> `optional` **withdrawals**: `JSONRPCWithdrawal`[]

Defined in: [types.ts:161](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L161)
