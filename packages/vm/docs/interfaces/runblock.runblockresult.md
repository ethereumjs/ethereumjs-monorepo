[@ethereumjs/vm](../README.md) / [Exports](../modules.md) / [runBlock](../modules/runBlock.md) / RunBlockResult

# Interface: RunBlockResult

[runBlock](../modules/runBlock.md).RunBlockResult

Result of [runBlock](../classes/index.default.md#runblock)

## Hierarchy

- **`RunBlockResult`**

  ↳ [`AfterBlockEvent`](runBlock.AfterBlockEvent.md)

## Table of contents

### Properties

- [gasUsed](runBlock.RunBlockResult.md#gasused)
- [logsBloom](runBlock.RunBlockResult.md#logsbloom)
- [receiptRoot](runBlock.RunBlockResult.md#receiptroot)
- [receipts](runBlock.RunBlockResult.md#receipts)
- [results](runBlock.RunBlockResult.md#results)
- [stateRoot](runBlock.RunBlockResult.md#stateroot)

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

• **receipts**: [`TxReceipt`](../modules/types.md#txreceipt)[]

Receipts generated for transactions in the block

#### Defined in

[runBlock.ts:70](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runBlock.ts#L70)

___

### results

• **results**: [`RunTxResult`](runTx.RunTxResult.md)[]

Results of executing the transactions in the block

#### Defined in

[runBlock.ts:74](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runBlock.ts#L74)

___

### stateRoot

• **stateRoot**: `Buffer`

The stateRoot after executing the block

#### Defined in

[runBlock.ts:78](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runBlock.ts#L78)
