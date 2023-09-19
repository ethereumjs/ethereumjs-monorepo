[@ethereumjs/vm](../README.md) / AfterBlockEvent

# Interface: AfterBlockEvent

Result of runBlock

## Hierarchy

- [`RunBlockResult`](RunBlockResult.md)

  ↳ **`AfterBlockEvent`**

## Table of contents

### Properties

- [block](AfterBlockEvent.md#block)
- [gasUsed](AfterBlockEvent.md#gasused)
- [logsBloom](AfterBlockEvent.md#logsbloom)
- [receipts](AfterBlockEvent.md#receipts)
- [receiptsRoot](AfterBlockEvent.md#receiptsroot)
- [results](AfterBlockEvent.md#results)
- [stateRoot](AfterBlockEvent.md#stateroot)

## Properties

### block

• **block**: `Block`

#### Defined in

[vm/src/types.ts:298](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L298)

___

### gasUsed

• **gasUsed**: `bigint`

The gas used after executing the block

#### Inherited from

[RunBlockResult](RunBlockResult.md).[gasUsed](RunBlockResult.md#gasused)

#### Defined in

[vm/src/types.ts:285](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L285)

___

### logsBloom

• **logsBloom**: `Uint8Array`

The bloom filter of the LOGs (events) after executing the block

#### Inherited from

[RunBlockResult](RunBlockResult.md).[logsBloom](RunBlockResult.md#logsbloom)

#### Defined in

[vm/src/types.ts:289](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L289)

___

### receipts

• **receipts**: [`TxReceipt`](../README.md#txreceipt)[]

Receipts generated for transactions in the block

#### Inherited from

[RunBlockResult](RunBlockResult.md).[receipts](RunBlockResult.md#receipts)

#### Defined in

[vm/src/types.ts:273](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L273)

___

### receiptsRoot

• **receiptsRoot**: `Uint8Array`

The receipt root after executing the block

#### Inherited from

[RunBlockResult](RunBlockResult.md).[receiptsRoot](RunBlockResult.md#receiptsroot)

#### Defined in

[vm/src/types.ts:293](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L293)

___

### results

• **results**: [`RunTxResult`](RunTxResult.md)[]

Results of executing the transactions in the block

#### Inherited from

[RunBlockResult](RunBlockResult.md).[results](RunBlockResult.md#results)

#### Defined in

[vm/src/types.ts:277](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L277)

___

### stateRoot

• **stateRoot**: `Uint8Array`

The stateRoot after executing the block

#### Inherited from

[RunBlockResult](RunBlockResult.md).[stateRoot](RunBlockResult.md#stateroot)

#### Defined in

[vm/src/types.ts:281](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L281)
