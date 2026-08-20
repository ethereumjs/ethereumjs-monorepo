[**@ethereumjs/vm**](../README.md)

***

[@ethereumjs/vm](../README.md) / PostByzantiumTxReceipt

# Interface: PostByzantiumTxReceipt

Defined in: [vm/src/types.ts:57](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L57)

Receipt type for Byzantium and beyond replacing the intermediary
state root field with a status code field (EIP-658)

## Extends

- [`BaseTxReceipt`](BaseTxReceipt.md)

## Extended by

- [`EIP4844BlobTxReceipt`](EIP4844BlobTxReceipt.md)

## Properties

### bitvector

> **bitvector**: `Uint8Array`

Defined in: [vm/src/types.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L35)

Bloom bitvector

#### Inherited from

[`BaseTxReceipt`](BaseTxReceipt.md).[`bitvector`](BaseTxReceipt.md#bitvector)

***

### cumulativeBlockGasUsed

> **cumulativeBlockGasUsed**: `bigint`

Defined in: [vm/src/types.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L31)

Cumulative gas used in the block including this tx

#### Inherited from

[`BaseTxReceipt`](BaseTxReceipt.md).[`cumulativeBlockGasUsed`](BaseTxReceipt.md#cumulativeblockgasused)

***

### logs

> **logs**: `Log`[]

Defined in: [vm/src/types.ts:39](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L39)

Logs emitted

#### Inherited from

[`BaseTxReceipt`](BaseTxReceipt.md).[`logs`](BaseTxReceipt.md#logs)

***

### status

> **status**: `0` \| `1`

Defined in: [vm/src/types.ts:61](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L61)

Status of transaction, `1` if successful, `0` if an exception occurred
