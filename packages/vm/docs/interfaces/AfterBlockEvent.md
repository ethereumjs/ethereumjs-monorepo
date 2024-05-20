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
- [preimages](AfterBlockEvent.md#preimages)
- [receipts](AfterBlockEvent.md#receipts)
- [receiptsRoot](AfterBlockEvent.md#receiptsroot)
- [results](AfterBlockEvent.md#results)
- [stateRoot](AfterBlockEvent.md#stateroot)

## Properties

### block

• **block**: `Block`

#### Defined in

[vm/src/types.ts:331](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L331)

___

### gasUsed

• **gasUsed**: `bigint`

The gas used after executing the block

#### Inherited from

[RunBlockResult](RunBlockResult.md).[gasUsed](RunBlockResult.md#gasused)

#### Defined in

[vm/src/types.ts:296](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L296)

___

### logsBloom

• **logsBloom**: `Uint8Array`

The bloom filter of the LOGs (events) after executing the block

#### Inherited from

[RunBlockResult](RunBlockResult.md).[logsBloom](RunBlockResult.md#logsbloom)

#### Defined in

[vm/src/types.ts:326](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L326)

___

### preimages

• `Optional` **preimages**: `Map`<`string`, `Uint8Array`\>

Preimages mapping of the touched accounts from the block (see reportPreimages option)

#### Inherited from

[RunBlockResult](RunBlockResult.md).[preimages](RunBlockResult.md#preimages)

#### Defined in

[vm/src/types.ts:312](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L312)

___

### receipts

• **receipts**: [`TxReceipt`](../README.md#txreceipt)[]

Receipts generated for transactions in the block

#### Inherited from

[RunBlockResult](RunBlockResult.md).[receipts](RunBlockResult.md#receipts)

#### Defined in

[vm/src/types.ts:304](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L304)

___

### receiptsRoot

• **receiptsRoot**: `Uint8Array`

The receipt root after executing the block

#### Inherited from

[RunBlockResult](RunBlockResult.md).[receiptsRoot](RunBlockResult.md#receiptsroot)

#### Defined in

[vm/src/types.ts:300](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L300)

___

### results

• **results**: [`RunTxResult`](RunTxResult.md)[]

Results of executing the transactions in the block

#### Inherited from

[RunBlockResult](RunBlockResult.md).[results](RunBlockResult.md#results)

#### Defined in

[vm/src/types.ts:308](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L308)

___

### stateRoot

• **stateRoot**: `Uint8Array`

The stateRoot after executing the block

#### Inherited from

[RunBlockResult](RunBlockResult.md).[stateRoot](RunBlockResult.md#stateroot)

#### Defined in

[vm/src/types.ts:322](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L322)
