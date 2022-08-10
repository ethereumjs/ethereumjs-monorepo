[@ethereumjs/vm](../README.md) / RunTxResult

# Interface: RunTxResult

Execution result of a transaction

## Hierarchy

- `EVMResult`

  ↳ **`RunTxResult`**

  ↳↳ [`AfterTxEvent`](AfterTxEvent.md)

## Table of contents

### Properties

- [accessList](RunTxResult.md#accesslist)
- [amountSpent](RunTxResult.md#amountspent)
- [bloom](RunTxResult.md#bloom)
- [createdAddress](RunTxResult.md#createdaddress)
- [execResult](RunTxResult.md#execresult)
- [gasRefund](RunTxResult.md#gasrefund)
- [receipt](RunTxResult.md#receipt)
- [totalGasSpent](RunTxResult.md#totalgasspent)

## Properties

### accessList

• `Optional` **accessList**: `AccessList`

EIP-2930 access list generated for the tx (see `reportAccessList` option)

#### Defined in

[packages/vm/src/types.ts:359](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L359)

___

### amountSpent

• **amountSpent**: `bigint`

The amount of ether used by this transaction

#### Defined in

[packages/vm/src/types.ts:337](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L337)

___

### bloom

• **bloom**: `Bloom`

Bloom filter resulted from transaction

#### Defined in

[packages/vm/src/types.ts:332](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L332)

___

### createdAddress

• `Optional` **createdAddress**: `Address`

Address of created account during transaction, if any

#### Inherited from

EVMResult.createdAddress

#### Defined in

packages/evm/dist/evm.d.ts:192

___

### execResult

• **execResult**: `ExecResult`

Contains the results from running the code, if any, as described in runCode

#### Inherited from

EVMResult.execResult

#### Defined in

packages/evm/dist/evm.d.ts:196

___

### gasRefund

• **gasRefund**: `bigint`

The amount of gas as that was refunded during the transaction (i.e. `gasUsed = totalGasConsumed - gasRefund`)

#### Defined in

[packages/vm/src/types.ts:354](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L354)

___

### receipt

• **receipt**: [`TxReceipt`](../README.md#txreceipt)

The tx receipt

#### Defined in

[packages/vm/src/types.ts:342](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L342)

___

### totalGasSpent

• **totalGasSpent**: `bigint`

The amount of gas used in this transaction, which is paid for
This contains the gas units that have been used on execution, plus the upfront cost,
which consists of calldata cost, intrinsic cost and optionally the access list costs

#### Defined in

[packages/vm/src/types.ts:349](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L349)
