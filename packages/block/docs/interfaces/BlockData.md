[**@ethereumjs/block**](../README.md)

***

[@ethereumjs/block](../README.md) / BlockData

# Interface: BlockData

Defined in: [types.ts:117](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L117)

A block's data.

## Properties

### executionWitness?

> `optional` **executionWitness**: `null` \| `VerkleExecutionWitness`

Defined in: [types.ts:128](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L128)

EIP-6800: Verkle Proof Data (experimental)

***

### header?

> `optional` **header**: [`HeaderData`](HeaderData.md)

Defined in: [types.ts:121](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L121)

Header data for the block

***

### transactions?

> `optional` **transactions**: (`LegacyTxData` \| `AccessList2930TxData` \| `FeeMarketEIP1559TxData` \| `BlobEIP4844TxData` \| `EOACode7702TxData`)[]

Defined in: [types.ts:122](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L122)

***

### uncleHeaders?

> `optional` **uncleHeaders**: [`HeaderData`](HeaderData.md)[]

Defined in: [types.ts:123](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L123)

***

### withdrawals?

> `optional` **withdrawals**: `WithdrawalData`[]

Defined in: [types.ts:124](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L124)
