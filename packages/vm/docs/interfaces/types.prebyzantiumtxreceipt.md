[@ethereumjs/vm](../README.md) / [Exports](../modules.md) / [types](../modules/types.md) / PreByzantiumTxReceipt

# Interface: PreByzantiumTxReceipt

[types](../modules/types.md).PreByzantiumTxReceipt

Pre-Byzantium receipt type with a field
for the intermediary state root

## Hierarchy

- [`BaseTxReceipt`](types.BaseTxReceipt.md)

  ↳ **`PreByzantiumTxReceipt`**

## Table of contents

### Properties

- [bitvector](types.PreByzantiumTxReceipt.md#bitvector)
- [gasUsed](types.PreByzantiumTxReceipt.md#gasused)
- [logs](types.PreByzantiumTxReceipt.md#logs)
- [stateRoot](types.PreByzantiumTxReceipt.md#stateroot)

## Properties

### bitvector

• **bitvector**: `Buffer`

Bloom bitvector

#### Inherited from

[BaseTxReceipt](types.BaseTxReceipt.md).[bitvector](types.BaseTxReceipt.md#bitvector)

#### Defined in

[types.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L16)

___

### gasUsed

• **gasUsed**: `Buffer`

Cumulative gas used in the block including this tx

#### Inherited from

[BaseTxReceipt](types.BaseTxReceipt.md).[gasUsed](types.BaseTxReceipt.md#gasused)

#### Defined in

[types.ts:12](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L12)

___

### logs

• **logs**: `Log`[]

Logs emitted

#### Inherited from

[BaseTxReceipt](types.BaseTxReceipt.md).[logs](types.BaseTxReceipt.md#logs)

#### Defined in

[types.ts:20](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L20)

___

### stateRoot

• **stateRoot**: `Buffer`

Intermediary state root

#### Defined in

[types.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L31)
