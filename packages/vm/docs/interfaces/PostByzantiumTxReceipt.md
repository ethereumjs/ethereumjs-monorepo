[@ethereumjs/vm](../README.md) / PostByzantiumTxReceipt

# Interface: PostByzantiumTxReceipt

Receipt type for Byzantium and beyond replacing the intermediary
state root field with a status code field (EIP-658)

## Hierarchy

- [`BaseTxReceipt`](BaseTxReceipt.md)

  ↳ **`PostByzantiumTxReceipt`**

  ↳↳ [`EIP4844BlobTxReceipt`](EIP4844BlobTxReceipt.md)

## Table of contents

### Properties

- [bitvector](PostByzantiumTxReceipt.md#bitvector)
- [cumulativeBlockGasUsed](PostByzantiumTxReceipt.md#cumulativeblockgasused)
- [logs](PostByzantiumTxReceipt.md#logs)
- [status](PostByzantiumTxReceipt.md#status)

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

### status

• **status**: ``0`` \| ``1``

Status of transaction, `1` if successful, `0` if an exception occurred

#### Defined in

[vm/src/types.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L47)
