[@ethereumjs/vm](../README.md) / RunBlockResult

# Interface: RunBlockResult

Result of runBlock

## Hierarchy

- **`RunBlockResult`**

  ↳ [`AfterBlockEvent`](AfterBlockEvent.md)

## Table of contents

### Properties

- [gasUsed](RunBlockResult.md#gasused)
- [logsBloom](RunBlockResult.md#logsbloom)
- [receiptRoot](RunBlockResult.md#receiptroot)
- [receipts](RunBlockResult.md#receipts)
- [results](RunBlockResult.md#results)
- [stateRoot](RunBlockResult.md#stateroot)

## Properties

### gasUsed

• **gasUsed**: `bigint`

The gas used after executing the block

#### Defined in

[packages/vm/src/types.ts:264](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L264)

___

### logsBloom

• **logsBloom**: `Buffer`

The bloom filter of the LOGs (events) after executing the block

#### Defined in

[packages/vm/src/types.ts:268](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L268)

___

### receiptRoot

• **receiptRoot**: `Buffer`

The receipt root after executing the block

#### Defined in

[packages/vm/src/types.ts:272](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L272)

___

### receipts

• **receipts**: [`TxReceipt`](../README.md#txreceipt)[]

Receipts generated for transactions in the block

#### Defined in

[packages/vm/src/types.ts:252](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L252)

___

### results

• **results**: [`RunTxResult`](RunTxResult.md)[]

Results of executing the transactions in the block

#### Defined in

[packages/vm/src/types.ts:256](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L256)

___

### stateRoot

• **stateRoot**: `Buffer`

The stateRoot after executing the block

#### Defined in

[packages/vm/src/types.ts:260](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L260)
