[@ethereumjs/vm](../README.md) / [Exports](../modules.md) / [runBlock](../modules/runBlock.md) / AfterBlockEvent

# Interface: AfterBlockEvent

[runBlock](../modules/runBlock.md).AfterBlockEvent

## Hierarchy

- [`RunBlockResult`](runBlock.RunBlockResult.md)

  ↳ **`AfterBlockEvent`**

## Table of contents

### Properties

- [block](runBlock.AfterBlockEvent.md#block)
- [gasUsed](runBlock.AfterBlockEvent.md#gasused)
- [logsBloom](runBlock.AfterBlockEvent.md#logsbloom)
- [receiptRoot](runBlock.AfterBlockEvent.md#receiptroot)
- [receipts](runBlock.AfterBlockEvent.md#receipts)
- [results](runBlock.AfterBlockEvent.md#results)
- [stateRoot](runBlock.AfterBlockEvent.md#stateroot)

## Properties

### block

• **block**: `Block`

#### Defined in

[runBlock.ts:95](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runBlock.ts#L95)

___

### gasUsed

• **gasUsed**: `BN`

The gas used after executing the block

#### Inherited from

[RunBlockResult](runBlock.RunBlockResult.md).[gasUsed](runBlock.RunBlockResult.md#gasused)

#### Defined in

[runBlock.ts:82](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runBlock.ts#L82)

___

### logsBloom

• **logsBloom**: `Buffer`

The bloom filter of the LOGs (events) after executing the block

#### Inherited from

[RunBlockResult](runBlock.RunBlockResult.md).[logsBloom](runBlock.RunBlockResult.md#logsbloom)

#### Defined in

[runBlock.ts:86](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runBlock.ts#L86)

___

### receiptRoot

• **receiptRoot**: `Buffer`

The receipt root after executing the block

#### Inherited from

[RunBlockResult](runBlock.RunBlockResult.md).[receiptRoot](runBlock.RunBlockResult.md#receiptroot)

#### Defined in

[runBlock.ts:90](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runBlock.ts#L90)

___

### receipts

• **receipts**: [`TxReceipt`](../modules/types.md#txreceipt)[]

Receipts generated for transactions in the block

#### Inherited from

[RunBlockResult](runBlock.RunBlockResult.md).[receipts](runBlock.RunBlockResult.md#receipts)

#### Defined in

[runBlock.ts:70](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runBlock.ts#L70)

___

### results

• **results**: [`RunTxResult`](runTx.RunTxResult.md)[]

Results of executing the transactions in the block

#### Inherited from

[RunBlockResult](runBlock.RunBlockResult.md).[results](runBlock.RunBlockResult.md#results)

#### Defined in

[runBlock.ts:74](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runBlock.ts#L74)

___

### stateRoot

• **stateRoot**: `Buffer`

The stateRoot after executing the block

#### Inherited from

[RunBlockResult](runBlock.RunBlockResult.md).[stateRoot](runBlock.RunBlockResult.md#stateroot)

#### Defined in

[runBlock.ts:78](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runBlock.ts#L78)
