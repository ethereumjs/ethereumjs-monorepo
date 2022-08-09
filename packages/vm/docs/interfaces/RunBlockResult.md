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

[packages/vm/src/types.ts:263](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L263)

___

### logsBloom

• **logsBloom**: `Buffer`

The bloom filter of the LOGs (events) after executing the block

#### Defined in

[packages/vm/src/types.ts:267](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L267)

___

### receiptRoot

• **receiptRoot**: `Buffer`

The receipt root after executing the block

#### Defined in

[packages/vm/src/types.ts:271](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L271)

___

### receipts

• **receipts**: [`TxReceipt`](../README.md#txreceipt)[]

Receipts generated for transactions in the block

#### Defined in

[packages/vm/src/types.ts:251](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L251)

___

### results

• **results**: [`RunTxResult`](RunTxResult.md)[]

Results of executing the transactions in the block

#### Defined in

[packages/vm/src/types.ts:255](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L255)

___

### stateRoot

• **stateRoot**: `Buffer`

The stateRoot after executing the block

#### Defined in

[packages/vm/src/types.ts:259](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L259)
