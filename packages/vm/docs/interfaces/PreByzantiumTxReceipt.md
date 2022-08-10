[@ethereumjs/vm](../README.md) / PreByzantiumTxReceipt

# Interface: PreByzantiumTxReceipt

Pre-Byzantium receipt type with a field
for the intermediary state root

## Hierarchy

- [`BaseTxReceipt`](BaseTxReceipt.md)

  ↳ **`PreByzantiumTxReceipt`**

## Table of contents

### Properties

- [bitvector](PreByzantiumTxReceipt.md#bitvector)
- [cumulativeBlockGasUsed](PreByzantiumTxReceipt.md#cumulativeblockgasused)
- [logs](PreByzantiumTxReceipt.md#logs)
- [stateRoot](PreByzantiumTxReceipt.md#stateroot)

## Properties

### bitvector

• **bitvector**: `Buffer`

Bloom bitvector

#### Inherited from

[BaseTxReceipt](BaseTxReceipt.md).[bitvector](BaseTxReceipt.md#bitvector)

#### Defined in

[packages/vm/src/types.ts:22](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L22)

___

### cumulativeBlockGasUsed

• **cumulativeBlockGasUsed**: `bigint`

Cumulative gas used in the block including this tx

#### Inherited from

[BaseTxReceipt](BaseTxReceipt.md).[cumulativeBlockGasUsed](BaseTxReceipt.md#cumulativeblockgasused)

#### Defined in

[packages/vm/src/types.ts:18](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L18)

___

### logs

• **logs**: `Log`[]

Logs emitted

#### Inherited from

[BaseTxReceipt](BaseTxReceipt.md).[logs](BaseTxReceipt.md#logs)

#### Defined in

[packages/vm/src/types.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L26)

___

### stateRoot

• **stateRoot**: `Buffer`

Intermediary state root

#### Defined in

[packages/vm/src/types.ts:37](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L37)
