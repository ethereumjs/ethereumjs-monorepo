[**@ethereumjs/vm**](../README.md)

***

[@ethereumjs/vm](../README.md) / ApplyBlockResult

# Interface: ApplyBlockResult

Defined in: [vm/src/types.ts:327](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L327)

Result of applyBlock

## Properties

### bloom

> **bloom**: `Bloom`

Defined in: [vm/src/types.ts:331](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L331)

The Bloom filter

***

### gasUsed

> **gasUsed**: `bigint`

Defined in: [vm/src/types.ts:335](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L335)

The gas used after executing the block

***

### preimages?

> `optional` **preimages**: `Map`\<`` `0x${string}` ``, `Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [vm/src/types.ts:351](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L351)

Preimages mapping of the touched accounts from the block (see reportPreimages option)

***

### receipts

> **receipts**: [`TxReceipt`](../type-aliases/TxReceipt.md)[]

Defined in: [vm/src/types.ts:343](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L343)

Receipts generated for transactions in the block

***

### receiptsRoot

> **receiptsRoot**: `Uint8Array`

Defined in: [vm/src/types.ts:339](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L339)

The receipt root after executing the block

***

### results

> **results**: [`RunTxResult`](RunTxResult.md)[]

Defined in: [vm/src/types.ts:347](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L347)

Results of executing the transactions in the block
