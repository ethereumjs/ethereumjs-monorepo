[**@ethereumjs/vm**](../README.md)

***

[@ethereumjs/vm](../README.md) / RunBlockResult

# Interface: RunBlockResult

Defined in: [vm/src/types.ts:357](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L357)

Result of [runBlock](../functions/runBlock.md)

## Extends

- `Omit`\<[`ApplyBlockResult`](ApplyBlockResult.md), `"bloom"`\>

## Extended by

- [`AfterBlockEvent`](AfterBlockEvent.md)

## Properties

### gasUsed

> **gasUsed**: `bigint`

Defined in: [vm/src/types.ts:335](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L335)

The gas used after executing the block

#### Inherited from

`Omit.gasUsed`

***

### logsBloom

> **logsBloom**: `Uint8Array`

Defined in: [vm/src/types.ts:365](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L365)

The bloom filter of the LOGs (events) after executing the block

***

### preimages?

> `optional` **preimages**: `Map`\<`` `0x${string}` ``, `Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [vm/src/types.ts:351](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L351)

Preimages mapping of the touched accounts from the block (see reportPreimages option)

#### Inherited from

`Omit.preimages`

***

### receipts

> **receipts**: [`TxReceipt`](../type-aliases/TxReceipt.md)[]

Defined in: [vm/src/types.ts:343](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L343)

Receipts generated for transactions in the block

#### Inherited from

`Omit.receipts`

***

### receiptsRoot

> **receiptsRoot**: `Uint8Array`

Defined in: [vm/src/types.ts:339](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L339)

The receipt root after executing the block

#### Inherited from

`Omit.receiptsRoot`

***

### requests?

> `optional` **requests**: `CLRequest`\<`CLRequestType`\>[]

Defined in: [vm/src/types.ts:374](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L374)

Any CL requests that were processed in the course of this block

***

### requestsHash?

> `optional` **requestsHash**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [vm/src/types.ts:370](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L370)

The requestsHash for any CL requests in the block

***

### results

> **results**: [`RunTxResult`](RunTxResult.md)[]

Defined in: [vm/src/types.ts:347](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L347)

Results of executing the transactions in the block

#### Inherited from

`Omit.results`

***

### stateRoot

> **stateRoot**: `Uint8Array`

Defined in: [vm/src/types.ts:361](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L361)

The stateRoot after executing the block
