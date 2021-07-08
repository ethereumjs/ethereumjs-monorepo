[@ethereumjs/vm](../README.md) / [runBlock](../modules/runblock.md) / RunBlockResult

# Interface: RunBlockResult

[runBlock](../modules/runblock.md).RunBlockResult

Result of [runBlock](../classes/index.default.md#runblock)

## Hierarchy

- **RunBlockResult**

  ↳ [AfterBlockEvent](runblock.afterblockevent.md)

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

• **gasUsed**: `BN`

The gas used after executing the block

#### Defined in

[runBlock.ts:82](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runBlock.ts#L82)

___

### logsBloom

• **logsBloom**: `Buffer`

The bloom filter of the LOGs (events) after executing the block

#### Defined in

[runBlock.ts:86](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runBlock.ts#L86)

___

### receiptRoot

• **receiptRoot**: `Buffer`

The receipt root after executing the block

#### Defined in

[runBlock.ts:90](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runBlock.ts#L90)

___

### receipts

• **receipts**: [TxReceipt](../modules/types.md#txreceipt)[]

Receipts generated for transactions in the block

#### Defined in

[runBlock.ts:70](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runBlock.ts#L70)

___

### results

• **results**: [RunTxResult](runtx.runtxresult.md)[]

Results of executing the transactions in the block

#### Defined in

[runBlock.ts:74](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runBlock.ts#L74)

___

### stateRoot

• **stateRoot**: `Buffer`

The stateRoot after executing the block

#### Defined in

[runBlock.ts:78](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runBlock.ts#L78)
