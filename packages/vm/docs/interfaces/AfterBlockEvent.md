[**@ethereumjs/vm**](../README.md)

***

[@ethereumjs/vm](../README.md) / AfterBlockEvent

# Interface: AfterBlockEvent

Defined in: [vm/src/types.ts:377](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L377)

Result of [runBlock](../functions/runBlock.md)

## Extends

- [`RunBlockResult`](RunBlockResult.md)

## Properties

### block

> **block**: `Block`

Defined in: [vm/src/types.ts:379](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L379)

***

### gasUsed

> **gasUsed**: `bigint`

Defined in: [vm/src/types.ts:335](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L335)

The gas used after executing the block

#### Inherited from

[`RunBlockResult`](RunBlockResult.md).[`gasUsed`](RunBlockResult.md#gasused)

***

### logsBloom

> **logsBloom**: `Uint8Array`

Defined in: [vm/src/types.ts:365](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L365)

The bloom filter of the LOGs (events) after executing the block

#### Inherited from

[`RunBlockResult`](RunBlockResult.md).[`logsBloom`](RunBlockResult.md#logsbloom)

***

### preimages?

> `optional` **preimages**: `Map`\<`` `0x${string}` ``, `Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [vm/src/types.ts:351](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L351)

Preimages mapping of the touched accounts from the block (see reportPreimages option)

#### Inherited from

[`RunBlockResult`](RunBlockResult.md).[`preimages`](RunBlockResult.md#preimages)

***

### receipts

> **receipts**: [`TxReceipt`](../type-aliases/TxReceipt.md)[]

Defined in: [vm/src/types.ts:343](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L343)

Receipts generated for transactions in the block

#### Inherited from

[`RunBlockResult`](RunBlockResult.md).[`receipts`](RunBlockResult.md#receipts)

***

### receiptsRoot

> **receiptsRoot**: `Uint8Array`

Defined in: [vm/src/types.ts:339](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L339)

The receipt root after executing the block

#### Inherited from

[`RunBlockResult`](RunBlockResult.md).[`receiptsRoot`](RunBlockResult.md#receiptsroot)

***

### requests?

> `optional` **requests**: `CLRequest`\<`CLRequestType`\>[]

Defined in: [vm/src/types.ts:374](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L374)

Any CL requests that were processed in the course of this block

#### Inherited from

[`RunBlockResult`](RunBlockResult.md).[`requests`](RunBlockResult.md#requests)

***

### requestsHash?

> `optional` **requestsHash**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [vm/src/types.ts:370](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L370)

The requestsHash for any CL requests in the block

#### Inherited from

[`RunBlockResult`](RunBlockResult.md).[`requestsHash`](RunBlockResult.md#requestshash)

***

### results

> **results**: [`RunTxResult`](RunTxResult.md)[]

Defined in: [vm/src/types.ts:347](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L347)

Results of executing the transactions in the block

#### Inherited from

[`RunBlockResult`](RunBlockResult.md).[`results`](RunBlockResult.md#results)

***

### stateRoot

> **stateRoot**: `Uint8Array`

Defined in: [vm/src/types.ts:361](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L361)

The stateRoot after executing the block

#### Inherited from

[`RunBlockResult`](RunBlockResult.md).[`stateRoot`](RunBlockResult.md#stateroot)
