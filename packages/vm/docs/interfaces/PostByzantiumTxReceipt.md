[@ethereumjs/vm](../README.md) / PostByzantiumTxReceipt

# Interface: PostByzantiumTxReceipt

Receipt type for Byzantium and beyond replacing the intermediary
state root field with a status code field (EIP-658)

## Hierarchy

- [`BaseTxReceipt`](BaseTxReceipt.md)

  ↳ **`PostByzantiumTxReceipt`**

## Table of contents

### Properties

- [bitvector](PostByzantiumTxReceipt.md#bitvector)
- [cumulativeBlockGasUsed](PostByzantiumTxReceipt.md#cumulativeblockgasused)
- [logs](PostByzantiumTxReceipt.md#logs)
- [status](PostByzantiumTxReceipt.md#status)

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

### status

• **status**: ``0`` \| ``1``

Status of transaction, `1` if successful, `0` if an exception occured

#### Defined in

[packages/vm/src/types.ts:48](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L48)
