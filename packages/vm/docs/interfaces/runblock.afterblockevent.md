[@ethereumjs/vm](../README.md) / [runBlock](../modules/runblock.md) / AfterBlockEvent

# Interface: AfterBlockEvent

[runBlock](../modules/runblock.md).AfterBlockEvent

## Hierarchy

- [*RunBlockResult*](runblock.runblockresult.md)

  ↳ **AfterBlockEvent**

## Table of contents

### Properties

- [block](runblock.afterblockevent.md#block)
- [gasUsed](runblock.afterblockevent.md#gasused)
- [logsBloom](runblock.afterblockevent.md#logsbloom)
- [receiptRoot](runblock.afterblockevent.md#receiptroot)
- [receipts](runblock.afterblockevent.md#receipts)
- [results](runblock.afterblockevent.md#results)
- [stateRoot](runblock.afterblockevent.md#stateroot)

## Properties

### block

• **block**: *Block*

Defined in: [runBlock.ts:92](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runBlock.ts#L92)

___

### gasUsed

• **gasUsed**: *BN*

The gas used after executing the block

Inherited from: [RunBlockResult](runblock.runblockresult.md).[gasUsed](runblock.runblockresult.md#gasused)

Defined in: [runBlock.ts:79](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runBlock.ts#L79)

___

### logsBloom

• **logsBloom**: *Buffer*

The bloom filter of the LOGs (events) after executing the block

Inherited from: [RunBlockResult](runblock.runblockresult.md).[logsBloom](runblock.runblockresult.md#logsbloom)

Defined in: [runBlock.ts:83](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runBlock.ts#L83)

___

### receiptRoot

• **receiptRoot**: *Buffer*

The receipt root after executing the block

Inherited from: [RunBlockResult](runblock.runblockresult.md).[receiptRoot](runblock.runblockresult.md#receiptroot)

Defined in: [runBlock.ts:87](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runBlock.ts#L87)

___

### receipts

• **receipts**: [*TxReceipt*](../modules/types.md#txreceipt)[]

Receipts generated for transactions in the block

Inherited from: [RunBlockResult](runblock.runblockresult.md).[receipts](runblock.runblockresult.md#receipts)

Defined in: [runBlock.ts:67](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runBlock.ts#L67)

___

### results

• **results**: [*RunTxResult*](runtx.runtxresult.md)[]

Results of executing the transactions in the block

Inherited from: [RunBlockResult](runblock.runblockresult.md).[results](runblock.runblockresult.md#results)

Defined in: [runBlock.ts:71](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runBlock.ts#L71)

___

### stateRoot

• **stateRoot**: *Buffer*

The stateRoot after executing the block

Inherited from: [RunBlockResult](runblock.runblockresult.md).[stateRoot](runblock.runblockresult.md#stateroot)

Defined in: [runBlock.ts:75](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runBlock.ts#L75)
