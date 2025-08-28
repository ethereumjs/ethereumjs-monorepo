[**@ethereumjs/vm**](../README.md)

***

[@ethereumjs/vm](../README.md) / RunTxResult

# Interface: RunTxResult

Defined in: [vm/src/types.ts:444](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L444)

Execution result of a transaction

## Extends

- `EVMResult`

## Extended by

- [`AfterTxEvent`](AfterTxEvent.md)

## Properties

### accessList?

> `optional` **accessList**: `AccessList`

Defined in: [vm/src/types.ts:475](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L475)

EIP-2930 access list generated for the tx (see `reportAccessList` option)

***

### amountSpent

> **amountSpent**: `bigint`

Defined in: [vm/src/types.ts:453](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L453)

The amount of ether used by this transaction

***

### blobGasUsed?

> `optional` **blobGasUsed**: `bigint`

Defined in: [vm/src/types.ts:490](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L490)

This is the blob gas units times the fee per blob gas for 4844 transactions

***

### bloom

> **bloom**: `Bloom`

Defined in: [vm/src/types.ts:448](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L448)

Bloom filter resulted from transaction

***

### createdAddress?

> `optional` **createdAddress**: `Address`

Defined in: evm/dist/esm/types.d.ts:333

Address of created account during transaction, if any

#### Inherited from

`EVMResult.createdAddress`

***

### execResult

> **execResult**: `ExecResult`

Defined in: evm/dist/esm/types.d.ts:337

Contains the results from running the code, if any, as described in runCode

#### Inherited from

`EVMResult.execResult`

***

### gasRefund

> **gasRefund**: `bigint`

Defined in: [vm/src/types.ts:470](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L470)

The amount of gas as that was refunded during the transaction (i.e. `gasUsed = totalGasConsumed - gasRefund`)

***

### minerValue

> **minerValue**: `bigint`

Defined in: [vm/src/types.ts:485](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L485)

The value that accrues to the miner by this transaction

***

### preimages?

> `optional` **preimages**: `Map`\<`` `0x${string}` ``, `Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [vm/src/types.ts:480](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L480)

Preimages mapping of the touched accounts from the tx (see `reportPreimages` option)

***

### receipt

> **receipt**: [`TxReceipt`](../type-aliases/TxReceipt.md)

Defined in: [vm/src/types.ts:458](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L458)

The tx receipt

***

### totalGasSpent

> **totalGasSpent**: `bigint`

Defined in: [vm/src/types.ts:465](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L465)

The amount of gas used in this transaction, which is paid for
This contains the gas units that have been used on execution, plus the upfront cost,
which consists of calldata cost, intrinsic cost and optionally the access list costs
