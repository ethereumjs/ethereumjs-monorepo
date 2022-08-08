[@ethereumjs/vm](../README.md) / AfterTxEvent

# Interface: AfterTxEvent

Execution result of a transaction

## Hierarchy

- [`RunTxResult`](RunTxResult.md)

  ↳ **`AfterTxEvent`**

## Table of contents

### Properties

- [accessList](AfterTxEvent.md#accesslist)
- [amountSpent](AfterTxEvent.md#amountspent)
- [bloom](AfterTxEvent.md#bloom)
- [createdAddress](AfterTxEvent.md#createdaddress)
- [execResult](AfterTxEvent.md#execresult)
- [gasRefund](AfterTxEvent.md#gasrefund)
- [receipt](AfterTxEvent.md#receipt)
- [totalGasSpent](AfterTxEvent.md#totalgasspent)
- [transaction](AfterTxEvent.md#transaction)

## Properties

### accessList

• `Optional` **accessList**: `AccessList`

EIP-2930 access list generated for the tx (see `reportAccessList` option)

#### Inherited from

[RunTxResult](RunTxResult.md).[accessList](RunTxResult.md#accesslist)

#### Defined in

[packages/vm/src/types.ts:359](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L359)

___

### amountSpent

• **amountSpent**: `bigint`

The amount of ether used by this transaction

#### Inherited from

[RunTxResult](RunTxResult.md).[amountSpent](RunTxResult.md#amountspent)

#### Defined in

[packages/vm/src/types.ts:337](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L337)

___

### bloom

• **bloom**: `Bloom`

Bloom filter resulted from transaction

#### Inherited from

[RunTxResult](RunTxResult.md).[bloom](RunTxResult.md#bloom)

#### Defined in

[packages/vm/src/types.ts:332](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L332)

___

### createdAddress

• `Optional` **createdAddress**: `Address`

Address of created account during transaction, if any

#### Inherited from

[RunTxResult](RunTxResult.md).[createdAddress](RunTxResult.md#createdaddress)

#### Defined in

packages/evm/dist/evm.d.ts:192

___

### execResult

• **execResult**: `ExecResult`

Contains the results from running the code, if any, as described in runCode

#### Inherited from

[RunTxResult](RunTxResult.md).[execResult](RunTxResult.md#execresult)

#### Defined in

packages/evm/dist/evm.d.ts:196

___

### gasRefund

• **gasRefund**: `bigint`

The amount of gas as that was refunded during the transaction (i.e. `gasUsed = totalGasConsumed - gasRefund`)

#### Inherited from

[RunTxResult](RunTxResult.md).[gasRefund](RunTxResult.md#gasrefund)

#### Defined in

[packages/vm/src/types.ts:354](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L354)

___

### receipt

• **receipt**: [`TxReceipt`](../README.md#txreceipt)

The tx receipt

#### Inherited from

[RunTxResult](RunTxResult.md).[receipt](RunTxResult.md#receipt)

#### Defined in

[packages/vm/src/types.ts:342](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L342)

___

### totalGasSpent

• **totalGasSpent**: `bigint`

The amount of gas used in this transaction, which is paid for
This contains the gas units that have been used on execution, plus the upfront cost,
which consists of calldata cost, intrinsic cost and optionally the access list costs

#### Inherited from

[RunTxResult](RunTxResult.md).[totalGasSpent](RunTxResult.md#totalgasspent)

#### Defined in

[packages/vm/src/types.ts:349](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L349)

___

### transaction

• **transaction**: `TypedTransaction`

The transaction which just got finished

#### Defined in

[packages/vm/src/types.ts:366](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L366)
