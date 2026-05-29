[**@ethereumjs/vm**](../README.md)

***

[@ethereumjs/vm](../README.md) / PostByzantiumTxReceipt

# Interface: PostByzantiumTxReceipt

Defined in: [vm/src/types.ts:56](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L56)

Receipt type for Byzantium and beyond replacing the intermediary
state root field with a status code field (EIP-658)

## Extends

- [`BaseTxReceipt`](BaseTxReceipt.md)

## Extended by

- [`EIP4844BlobTxReceipt`](EIP4844BlobTxReceipt.md)

## Properties

### bitvector

> **bitvector**: `Uint8Array`

Defined in: [vm/src/types.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L34)

Bloom bitvector

#### Inherited from

[`BaseTxReceipt`](BaseTxReceipt.md).[`bitvector`](BaseTxReceipt.md#bitvector)

***

### cumulativeBlockGasUsed

> **cumulativeBlockGasUsed**: `bigint`

Defined in: [vm/src/types.ts:30](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L30)

Cumulative gas used in the block including this tx

#### Inherited from

[`BaseTxReceipt`](BaseTxReceipt.md).[`cumulativeBlockGasUsed`](BaseTxReceipt.md#cumulativeblockgasused)

***

### logs

> **logs**: `Log`[]

Defined in: [vm/src/types.ts:38](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L38)

Logs emitted

#### Inherited from

[`BaseTxReceipt`](BaseTxReceipt.md).[`logs`](BaseTxReceipt.md#logs)

***

### status

> **status**: `0` \| `1`

Defined in: [vm/src/types.ts:60](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L60)

Status of transaction, `1` if successful, `0` if an exception occurred
