[@ethereumjs/vm](../README.md) / RunBlockResult

# Interface: RunBlockResult

Result of runBlock

## Hierarchy

- `Omit`<[`ApplyBlockResult`](ApplyBlockResult.md), ``"bloom"``\>

  ↳ **`RunBlockResult`**

  ↳↳ [`AfterBlockEvent`](AfterBlockEvent.md)

## Table of contents

### Properties

- [gasUsed](RunBlockResult.md#gasused)
- [logsBloom](RunBlockResult.md#logsbloom)
- [preimages](RunBlockResult.md#preimages)
- [receipts](RunBlockResult.md#receipts)
- [receiptsRoot](RunBlockResult.md#receiptsroot)
- [results](RunBlockResult.md#results)
- [stateRoot](RunBlockResult.md#stateroot)

## Properties

### gasUsed

• **gasUsed**: `bigint`

The gas used after executing the block

#### Inherited from

Omit.gasUsed

#### Defined in

[vm/src/types.ts:296](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L296)

___

### logsBloom

• **logsBloom**: `Uint8Array`

The bloom filter of the LOGs (events) after executing the block

#### Defined in

[vm/src/types.ts:326](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L326)

___

### preimages

• `Optional` **preimages**: `Map`<`string`, `Uint8Array`\>

Preimages mapping of the touched accounts from the block (see reportPreimages option)

#### Inherited from

Omit.preimages

#### Defined in

[vm/src/types.ts:312](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L312)

___

### receipts

• **receipts**: [`TxReceipt`](../README.md#txreceipt)[]

Receipts generated for transactions in the block

#### Inherited from

Omit.receipts

#### Defined in

[vm/src/types.ts:304](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L304)

___

### receiptsRoot

• **receiptsRoot**: `Uint8Array`

The receipt root after executing the block

#### Inherited from

Omit.receiptsRoot

#### Defined in

[vm/src/types.ts:300](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L300)

___

### results

• **results**: [`RunTxResult`](RunTxResult.md)[]

Results of executing the transactions in the block

#### Inherited from

Omit.results

#### Defined in

[vm/src/types.ts:308](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L308)

___

### stateRoot

• **stateRoot**: `Uint8Array`

The stateRoot after executing the block

#### Defined in

[vm/src/types.ts:322](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L322)
