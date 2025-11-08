[**@ethereumjs/vm**](../README.md)

***

[@ethereumjs/vm](../README.md) / RunBlockResult

# Interface: RunBlockResult

Defined in: [vm/src/types.ts:358](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L358)

Result of [runBlock](../functions/runBlock.md)

## Extends

- `Omit`\<[`ApplyBlockResult`](ApplyBlockResult.md), `"bloom"`\>

## Extended by

- [`AfterBlockEvent`](AfterBlockEvent.md)

## Properties

### gasUsed

> **gasUsed**: `bigint`

Defined in: [vm/src/types.ts:336](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L336)

The gas used after executing the block

#### Inherited from

[`ApplyBlockResult`](ApplyBlockResult.md).[`gasUsed`](ApplyBlockResult.md#gasused)

***

### logsBloom

> **logsBloom**: `Uint8Array`

Defined in: [vm/src/types.ts:366](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L366)

The bloom filter of the LOGs (events) after executing the block

***

### preimages?

> `optional` **preimages**: `Map`\<`` `0x${string}` ``, `Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [vm/src/types.ts:352](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L352)

Preimages mapping of the touched accounts from the block (see reportPreimages option)

#### Inherited from

[`ApplyBlockResult`](ApplyBlockResult.md).[`preimages`](ApplyBlockResult.md#preimages)

***

### receipts

> **receipts**: [`TxReceipt`](../type-aliases/TxReceipt.md)[]

Defined in: [vm/src/types.ts:344](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L344)

Receipts generated for transactions in the block

#### Inherited from

[`ApplyBlockResult`](ApplyBlockResult.md).[`receipts`](ApplyBlockResult.md#receipts)

***

### receiptsRoot

> **receiptsRoot**: `Uint8Array`

Defined in: [vm/src/types.ts:340](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L340)

The receipt root after executing the block

#### Inherited from

[`ApplyBlockResult`](ApplyBlockResult.md).[`receiptsRoot`](ApplyBlockResult.md#receiptsroot)

***

### requests?

> `optional` **requests**: `CLRequest`\<`CLRequestType`\>[]

Defined in: [vm/src/types.ts:375](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L375)

Any CL requests that were processed in the course of this block

***

### requestsHash?

> `optional` **requestsHash**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [vm/src/types.ts:371](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L371)

The requestsHash for any CL requests in the block

***

### results

> **results**: [`RunTxResult`](RunTxResult.md)[]

Defined in: [vm/src/types.ts:348](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L348)

Results of executing the transactions in the block

#### Inherited from

[`ApplyBlockResult`](ApplyBlockResult.md).[`results`](ApplyBlockResult.md#results)

***

### stateRoot

> **stateRoot**: `Uint8Array`

Defined in: [vm/src/types.ts:362](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L362)

The stateRoot after executing the block
