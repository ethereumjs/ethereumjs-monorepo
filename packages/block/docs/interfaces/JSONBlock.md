[**@ethereumjs/block**](../README.md)

***

[@ethereumjs/block](../README.md) / JSONBlock

# Interface: JSONBlock

Defined in: [types.ts:159](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L159)

An object with the block's data represented as strings.

## Properties

### executionWitness?

> `optional` **executionWitness**: `null` \| `VerkleExecutionWitness`

Defined in: [types.ts:167](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L167)

***

### header?

> `optional` **header**: [`JSONHeader`](JSONHeader.md)

Defined in: [types.ts:163](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L163)

Header data for the block

***

### transactions?

> `optional` **transactions**: `JSONTx`[]

Defined in: [types.ts:164](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L164)

***

### uncleHeaders?

> `optional` **uncleHeaders**: [`JSONHeader`](JSONHeader.md)[]

Defined in: [types.ts:165](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L165)

***

### withdrawals?

> `optional` **withdrawals**: `JSONRPCWithdrawal`[]

Defined in: [types.ts:166](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L166)
