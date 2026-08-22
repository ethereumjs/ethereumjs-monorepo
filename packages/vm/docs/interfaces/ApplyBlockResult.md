[**@ethereumjs/vm**](../README.md)

***

[@ethereumjs/vm](../README.md) / ApplyBlockResult

# Interface: ApplyBlockResult

Defined in: [vm/src/types.ts:346](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L346)

Result returned internally by [runBlock](../functions/runBlock.md) after executing all transactions in a block.

## Properties

### bloom

> **bloom**: [`Bloom`](../classes/Bloom.md)

Defined in: [vm/src/types.ts:350](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L350)

The Bloom filter

***

### gasUsed

> **gasUsed**: `bigint`

Defined in: [vm/src/types.ts:354](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L354)

The gas used after executing the block

***

### preimages?

> `optional` **preimages?**: `Map`\<`` `0x${string}` ``, `Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [vm/src/types.ts:370](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L370)

Preimages mapping of the touched accounts from the block (see reportPreimages option)

***

### receipts

> **receipts**: [`TxReceipt`](../type-aliases/TxReceipt.md)[]

Defined in: [vm/src/types.ts:362](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L362)

Receipts generated for transactions in the block

***

### receiptsRoot

> **receiptsRoot**: `Uint8Array`

Defined in: [vm/src/types.ts:358](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L358)

The receipt root after executing the block

***

### results

> **results**: [`RunTxResult`](RunTxResult.md)[]

Defined in: [vm/src/types.ts:366](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L366)

Results of executing the transactions in the block
