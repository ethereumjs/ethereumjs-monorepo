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

[vm/src/types.ts:298](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L298)

___

### logsBloom

• **logsBloom**: `Uint8Array`

The bloom filter of the LOGs (events) after executing the block

#### Defined in

[vm/src/types.ts:302](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L302)

___

### receipts

• **receipts**: [`TxReceipt`](../README.md#txreceipt)[]

Receipts generated for transactions in the block

#### Defined in

[vm/src/types.ts:286](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L286)

___

### receiptsRoot

• **receiptsRoot**: `Uint8Array`

The receipt root after executing the block

#### Defined in

[vm/src/types.ts:306](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L306)

___

### results

• **results**: [`RunTxResult`](RunTxResult.md)[]

Results of executing the transactions in the block

#### Defined in

[vm/src/types.ts:290](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L290)

___

### stateRoot

• **stateRoot**: `Uint8Array`

The stateRoot after executing the block

#### Defined in

[vm/src/types.ts:294](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L294)
