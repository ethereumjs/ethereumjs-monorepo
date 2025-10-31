[**@ethereumjs/block**](../README.md)

***

[@ethereumjs/block](../README.md) / BlockData

# Interface: BlockData

Defined in: [types.ts:114](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L114)

A block's data.

## Properties

### header?

> `optional` **header**: [`HeaderData`](HeaderData.md)

Defined in: [types.ts:118](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L118)

Header data for the block

***

### transactions?

> `optional` **transactions**: (`LegacyTxData` \| `AccessList2930TxData` \| `FeeMarketEIP1559TxData` \| `BlobEIP4844TxData` \| `EOACode7702TxData`)[]

Defined in: [types.ts:119](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L119)

***

### uncleHeaders?

> `optional` **uncleHeaders**: [`HeaderData`](HeaderData.md)[]

Defined in: [types.ts:120](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L120)

***

### withdrawals?

> `optional` **withdrawals**: `WithdrawalData`[]

Defined in: [types.ts:121](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L121)
