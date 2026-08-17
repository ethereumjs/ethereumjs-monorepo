[**@ethereumjs/block**](../README.md)

***

[@ethereumjs/block](../README.md) / BlockData

# Interface: BlockData

Defined in: [types.ts:126](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L126)

A block's data.

## Properties

### header?

> `optional` **header**: [`HeaderData`](HeaderData.md)

Defined in: [types.ts:130](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L130)

Header data for the block

***

### transactions?

> `optional` **transactions**: (`LegacyTxData` \| `AccessList2930TxData` \| `FeeMarketEIP1559TxData` \| `BlobEIP4844TxData` \| `EOACode7702TxData`)[]

Defined in: [types.ts:131](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L131)

***

### uncleHeaders?

> `optional` **uncleHeaders**: [`HeaderData`](HeaderData.md)[]

Defined in: [types.ts:132](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L132)

***

### withdrawals?

> `optional` **withdrawals**: `WithdrawalData`[]

Defined in: [types.ts:133](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L133)
