[@ethereumjs/vm](../README.md) / EIP4844BlobTxReceipt

# Interface: EIP4844BlobTxReceipt

Receipt type for Byzantium and beyond replacing the intermediary
state root field with a status code field (EIP-658)

## Hierarchy

- [`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md)

  ↳ **`EIP4844BlobTxReceipt`**

## Table of contents

### Properties

- [bitvector](EIP4844BlobTxReceipt.md#bitvector)
- [blobGasPrice](EIP4844BlobTxReceipt.md#blobgasprice)
- [blobGasUsed](EIP4844BlobTxReceipt.md#blobgasused)
- [cumulativeBlockGasUsed](EIP4844BlobTxReceipt.md#cumulativeblockgasused)
- [logs](EIP4844BlobTxReceipt.md#logs)
- [status](EIP4844BlobTxReceipt.md#status)

## Properties

### bitvector

• **bitvector**: `Uint8Array`

Bloom bitvector

#### Inherited from

[PostByzantiumTxReceipt](PostByzantiumTxReceipt.md).[bitvector](PostByzantiumTxReceipt.md#bitvector)

#### Defined in

[vm/src/types.ts:21](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L21)

___

### blobGasPrice

• **blobGasPrice**: `bigint`

blob gas price for block transaction was included in

Note: This valus is not included in the `receiptRLP` used for encoding the `receiptsRoot` in a block
and is only provided as part of receipt metadata.

#### Defined in

[vm/src/types.ts:64](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L64)

___

### blobGasUsed

• **blobGasUsed**: `bigint`

blob gas consumed by a transaction

Note: This value is not included in the receiptRLP used for encoding the receiptsRoot in a block
and is only provided as part of receipt metadata.

#### Defined in

[vm/src/types.ts:57](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L57)

___

### cumulativeBlockGasUsed

• **cumulativeBlockGasUsed**: `bigint`

Cumulative gas used in the block including this tx

#### Inherited from

[PostByzantiumTxReceipt](PostByzantiumTxReceipt.md).[cumulativeBlockGasUsed](PostByzantiumTxReceipt.md#cumulativeblockgasused)

#### Defined in

[vm/src/types.ts:17](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L17)

___

### logs

• **logs**: `Log`[]

Logs emitted

#### Inherited from

[PostByzantiumTxReceipt](PostByzantiumTxReceipt.md).[logs](PostByzantiumTxReceipt.md#logs)

#### Defined in

[vm/src/types.ts:25](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L25)

___

### status

• **status**: ``0`` \| ``1``

Status of transaction, `1` if successful, `0` if an exception occurred

#### Inherited from

[PostByzantiumTxReceipt](PostByzantiumTxReceipt.md).[status](PostByzantiumTxReceipt.md#status)

#### Defined in

[vm/src/types.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L47)
