[**@ethereumjs/vm**](../README.md)

***

[@ethereumjs/vm](../README.md) / RunBlockResult

# Interface: RunBlockResult

Defined in: [vm/src/types.ts:370](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L370)

Result of [runBlock](../functions/runBlock.md)

## Extends

- `Omit`\<[`ApplyBlockResult`](ApplyBlockResult.md), `"bloom"`\>

## Extended by

- [`AfterBlockEvent`](AfterBlockEvent.md)

## Properties

### blockLevelAccessList?

> `optional` **blockLevelAccessList**: `BlockLevelAccessList`

Defined in: [vm/src/types.ts:396](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L396)

The block level access list created during execution when EIP-7928 is active.
Populated by [runBlock](../functions/runBlock.md) / applyBlock; use with `generate: true` for
builder flows or pass via [RunBlockOpts.blockAccessList](RunBlockOpts.md#blockaccesslist) for validation.

#### Remarks

Experimental (Amsterdam): may change on patch releases. See `@ethereumjs/vm`
README section `Amsterdam hardfork (experimental)` for release ↔ spec tracking.

***

### gasUsed

> **gasUsed**: `bigint`

Defined in: [vm/src/types.ts:348](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L348)

The gas used after executing the block

#### Inherited from

[`ApplyBlockResult`](ApplyBlockResult.md).[`gasUsed`](ApplyBlockResult.md#gasused)

***

### logsBloom

> **logsBloom**: `Uint8Array`

Defined in: [vm/src/types.ts:378](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L378)

The bloom filter of the LOGs (events) after executing the block

***

### preimages?

> `optional` **preimages**: `Map`\<`` `0x${string}` ``, `Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [vm/src/types.ts:364](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L364)

Preimages mapping of the touched accounts from the block (see reportPreimages option)

#### Inherited from

[`ApplyBlockResult`](ApplyBlockResult.md).[`preimages`](ApplyBlockResult.md#preimages)

***

### receipts

> **receipts**: [`TxReceipt`](../type-aliases/TxReceipt.md)[]

Defined in: [vm/src/types.ts:356](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L356)

Receipts generated for transactions in the block

#### Inherited from

[`ApplyBlockResult`](ApplyBlockResult.md).[`receipts`](ApplyBlockResult.md#receipts)

***

### receiptsRoot

> **receiptsRoot**: `Uint8Array`

Defined in: [vm/src/types.ts:352](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L352)

The receipt root after executing the block

#### Inherited from

[`ApplyBlockResult`](ApplyBlockResult.md).[`receiptsRoot`](ApplyBlockResult.md#receiptsroot)

***

### requests?

> `optional` **requests**: `CLRequest`\<`CLRequestType`\>[]

Defined in: [vm/src/types.ts:387](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L387)

Any CL requests that were processed in the course of this block

***

### requestsHash?

> `optional` **requestsHash**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [vm/src/types.ts:383](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L383)

The requestsHash for any CL requests in the block

***

### results

> **results**: [`RunTxResult`](RunTxResult.md)[]

Defined in: [vm/src/types.ts:360](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L360)

Results of executing the transactions in the block

#### Inherited from

[`ApplyBlockResult`](ApplyBlockResult.md).[`results`](ApplyBlockResult.md#results)

***

### stateRoot

> **stateRoot**: `Uint8Array`

Defined in: [vm/src/types.ts:374](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L374)

The stateRoot after executing the block
