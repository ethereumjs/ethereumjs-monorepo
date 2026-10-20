[**@ethereumjs/block**](../README.md)

***

[@ethereumjs/block](../README.md) / BlockData

# Interface: BlockData

Defined in: [types.ts:147](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L147)

A block's data.

## Properties

### header?

> `optional` **header?**: [`HeaderData`](HeaderData.md)

Defined in: [types.ts:151](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L151)

Header data for the block

***

### transactions?

> `optional` **transactions?**: (`LegacyTxData` \| `AccessList2930TxData` \| `FeeMarketEIP1559TxData` \| `EOACode7702TxData` \| `BlobEIP4844TxData`)[]

Defined in: [types.ts:152](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L152)

***

### uncleHeaders?

> `optional` **uncleHeaders?**: [`HeaderData`](HeaderData.md)[]

Defined in: [types.ts:153](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L153)

***

### withdrawals?

> `optional` **withdrawals?**: `WithdrawalData`[]

Defined in: [types.ts:154](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L154)
