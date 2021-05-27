[@ethereumjs/vm](../README.md) / [runBlock](../modules/runblock.md) / RunBlockResult

# Interface: RunBlockResult

[runBlock](../modules/runblock.md).RunBlockResult

Result of [runBlock](../classes/index.default.md#runblock)

## Hierarchy

- **RunBlockResult**

  ↳ [*AfterBlockEvent*](runblock.afterblockevent.md)

## Table of contents

### Properties

- [gasUsed](runblock.runblockresult.md#gasused)
- [logsBloom](runblock.runblockresult.md#logsbloom)
- [receiptRoot](runblock.runblockresult.md#receiptroot)
- [receipts](runblock.runblockresult.md#receipts)
- [results](runblock.runblockresult.md#results)
- [stateRoot](runblock.runblockresult.md#stateroot)

## Properties

### gasUsed

• **gasUsed**: *BN*

The gas used after executing the block

Defined in: [runBlock.ts:79](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runBlock.ts#L79)

___

### logsBloom

• **logsBloom**: *Buffer*

The bloom filter of the LOGs (events) after executing the block

Defined in: [runBlock.ts:83](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runBlock.ts#L83)

___

### receiptRoot

• **receiptRoot**: *Buffer*

The receipt root after executing the block

Defined in: [runBlock.ts:87](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runBlock.ts#L87)

___

### receipts

• **receipts**: [*TxReceipt*](../modules/types.md#txreceipt)[]

Receipts generated for transactions in the block

Defined in: [runBlock.ts:67](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runBlock.ts#L67)

___

### results

• **results**: [*RunTxResult*](runtx.runtxresult.md)[]

Results of executing the transactions in the block

Defined in: [runBlock.ts:71](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runBlock.ts#L71)

___

### stateRoot

• **stateRoot**: *Buffer*

The stateRoot after executing the block

Defined in: [runBlock.ts:75](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runBlock.ts#L75)
