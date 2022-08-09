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
- [receiptRoot](AfterBlockEvent.md#receiptroot)
- [receipts](AfterBlockEvent.md#receipts)
- [results](AfterBlockEvent.md#results)
- [stateRoot](AfterBlockEvent.md#stateroot)

## Properties

### block

• **block**: `Block`

#### Defined in

[packages/vm/src/types.ts:276](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L276)

___

### gasUsed

• **gasUsed**: `bigint`

The gas used after executing the block

#### Inherited from

[RunBlockResult](RunBlockResult.md).[gasUsed](RunBlockResult.md#gasused)

#### Defined in

[packages/vm/src/types.ts:263](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L263)

___

### logsBloom

• **logsBloom**: `Buffer`

The bloom filter of the LOGs (events) after executing the block

#### Inherited from

[RunBlockResult](RunBlockResult.md).[logsBloom](RunBlockResult.md#logsbloom)

#### Defined in

[packages/vm/src/types.ts:267](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L267)

___

### receiptRoot

• **receiptRoot**: `Buffer`

The receipt root after executing the block

#### Inherited from

[RunBlockResult](RunBlockResult.md).[receiptRoot](RunBlockResult.md#receiptroot)

#### Defined in

[packages/vm/src/types.ts:271](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L271)

___

### receipts

• **receipts**: [`TxReceipt`](../README.md#txreceipt)[]

Receipts generated for transactions in the block

#### Inherited from

[RunBlockResult](RunBlockResult.md).[receipts](RunBlockResult.md#receipts)

#### Defined in

[packages/vm/src/types.ts:251](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L251)

___

### results

• **results**: [`RunTxResult`](RunTxResult.md)[]

Results of executing the transactions in the block

#### Inherited from

[RunBlockResult](RunBlockResult.md).[results](RunBlockResult.md#results)

#### Defined in

[packages/vm/src/types.ts:255](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L255)

___

### stateRoot

• **stateRoot**: `Buffer`

The stateRoot after executing the block

#### Inherited from

[RunBlockResult](RunBlockResult.md).[stateRoot](RunBlockResult.md#stateroot)

#### Defined in

[packages/vm/src/types.ts:259](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L259)
