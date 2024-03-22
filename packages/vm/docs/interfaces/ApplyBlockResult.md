[@ethereumjs/vm](../README.md) / ApplyBlockResult

# Interface: ApplyBlockResult

Result of applyBlock

## Table of contents

### Properties

- [bloom](ApplyBlockResult.md#bloom)
- [gasUsed](ApplyBlockResult.md#gasused)
- [preimages](ApplyBlockResult.md#preimages)
- [receipts](ApplyBlockResult.md#receipts)
- [receiptsRoot](ApplyBlockResult.md#receiptsroot)
- [results](ApplyBlockResult.md#results)

## Properties

### bloom

• **bloom**: `Bloom`

The Bloom filter

#### Defined in

[vm/src/types.ts:292](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L292)

___

### gasUsed

• **gasUsed**: `bigint`

The gas used after executing the block

#### Defined in

[vm/src/types.ts:296](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L296)

___

### preimages

• `Optional` **preimages**: `Map`<`string`, `Uint8Array`\>

Preimages mapping of the touched accounts from the block (see reportPreimages option)

#### Defined in

[vm/src/types.ts:312](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L312)

___

### receipts

• **receipts**: [`TxReceipt`](../README.md#txreceipt)[]

Receipts generated for transactions in the block

#### Defined in

[vm/src/types.ts:304](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L304)

___

### receiptsRoot

• **receiptsRoot**: `Uint8Array`

The receipt root after executing the block

#### Defined in

[vm/src/types.ts:300](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L300)

___

### results

• **results**: [`RunTxResult`](RunTxResult.md)[]

Results of executing the transactions in the block

#### Defined in

[vm/src/types.ts:308](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L308)
