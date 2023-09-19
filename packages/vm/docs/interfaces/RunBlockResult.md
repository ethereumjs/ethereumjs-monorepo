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
- [receipts](RunBlockResult.md#receipts)
- [receiptsRoot](RunBlockResult.md#receiptsroot)
- [results](RunBlockResult.md#results)
- [stateRoot](RunBlockResult.md#stateroot)

## Properties

### gasUsed

• **gasUsed**: `bigint`

The gas used after executing the block

#### Defined in

[vm/src/types.ts:285](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L285)

___

### logsBloom

• **logsBloom**: `Uint8Array`

The bloom filter of the LOGs (events) after executing the block

#### Defined in

[vm/src/types.ts:289](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L289)

___

### receipts

• **receipts**: [`TxReceipt`](../README.md#txreceipt)[]

Receipts generated for transactions in the block

#### Defined in

[vm/src/types.ts:273](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L273)

___

### receiptsRoot

• **receiptsRoot**: `Uint8Array`

The receipt root after executing the block

#### Defined in

[vm/src/types.ts:293](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L293)

___

### results

• **results**: [`RunTxResult`](RunTxResult.md)[]

Results of executing the transactions in the block

#### Defined in

[vm/src/types.ts:277](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L277)

___

### stateRoot

• **stateRoot**: `Uint8Array`

The stateRoot after executing the block

#### Defined in

[vm/src/types.ts:281](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L281)
