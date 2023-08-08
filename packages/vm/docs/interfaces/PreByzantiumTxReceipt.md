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

• **bitvector**: `Uint8Array`

Bloom bitvector

#### Inherited from

[BaseTxReceipt](BaseTxReceipt.md).[bitvector](BaseTxReceipt.md#bitvector)

#### Defined in

[vm/src/types.ts:21](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L21)

___

### cumulativeBlockGasUsed

• **cumulativeBlockGasUsed**: `bigint`

Cumulative gas used in the block including this tx

#### Inherited from

[BaseTxReceipt](BaseTxReceipt.md).[cumulativeBlockGasUsed](BaseTxReceipt.md#cumulativeblockgasused)

#### Defined in

[vm/src/types.ts:17](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L17)

___

### logs

• **logs**: `Log`[]

Logs emitted

#### Inherited from

[BaseTxReceipt](BaseTxReceipt.md).[logs](BaseTxReceipt.md#logs)

#### Defined in

[vm/src/types.ts:25](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L25)

___

### stateRoot

• **stateRoot**: `Uint8Array`

Intermediary state root

#### Defined in

[vm/src/types.ts:36](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L36)
