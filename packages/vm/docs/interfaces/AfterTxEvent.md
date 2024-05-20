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
- [blobGasUsed](AfterTxEvent.md#blobgasused)
- [bloom](AfterTxEvent.md#bloom)
- [createdAddress](AfterTxEvent.md#createdaddress)
- [execResult](AfterTxEvent.md#execresult)
- [gasRefund](AfterTxEvent.md#gasrefund)
- [minerValue](AfterTxEvent.md#minervalue)
- [preimages](AfterTxEvent.md#preimages)
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

[vm/src/types.ts:427](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L427)

___

### amountSpent

• **amountSpent**: `bigint`

The amount of ether used by this transaction

#### Inherited from

[RunTxResult](RunTxResult.md).[amountSpent](RunTxResult.md#amountspent)

#### Defined in

[vm/src/types.ts:405](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L405)

___

### blobGasUsed

• `Optional` **blobGasUsed**: `bigint`

This is the blob gas units times the fee per blob gas for 4844 transactions

#### Inherited from

[RunTxResult](RunTxResult.md).[blobGasUsed](RunTxResult.md#blobgasused)

#### Defined in

[vm/src/types.ts:442](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L442)

___

### bloom

• **bloom**: `Bloom`

Bloom filter resulted from transaction

#### Inherited from

[RunTxResult](RunTxResult.md).[bloom](RunTxResult.md#bloom)

#### Defined in

[vm/src/types.ts:400](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L400)

___

### createdAddress

• `Optional` **createdAddress**: `Address`

Address of created account during transaction, if any

#### Inherited from

[RunTxResult](RunTxResult.md).[createdAddress](RunTxResult.md#createdaddress)

#### Defined in

evm/dist/cjs/types.d.ts:248

___

### execResult

• **execResult**: `ExecResult`

Contains the results from running the code, if any, as described in runCode

#### Inherited from

[RunTxResult](RunTxResult.md).[execResult](RunTxResult.md#execresult)

#### Defined in

evm/dist/cjs/types.d.ts:252

___

### gasRefund

• **gasRefund**: `bigint`

The amount of gas as that was refunded during the transaction (i.e. `gasUsed = totalGasConsumed - gasRefund`)

#### Inherited from

[RunTxResult](RunTxResult.md).[gasRefund](RunTxResult.md#gasrefund)

#### Defined in

[vm/src/types.ts:422](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L422)

___

### minerValue

• **minerValue**: `bigint`

The value that accrues to the miner by this transaction

#### Inherited from

[RunTxResult](RunTxResult.md).[minerValue](RunTxResult.md#minervalue)

#### Defined in

[vm/src/types.ts:437](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L437)

___

### preimages

• `Optional` **preimages**: `Map`<`string`, `Uint8Array`\>

Preimages mapping of the touched accounts from the tx (see `reportPreimages` option)

#### Inherited from

[RunTxResult](RunTxResult.md).[preimages](RunTxResult.md#preimages)

#### Defined in

[vm/src/types.ts:432](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L432)

___

### receipt

• **receipt**: [`TxReceipt`](../README.md#txreceipt)

The tx receipt

#### Inherited from

[RunTxResult](RunTxResult.md).[receipt](RunTxResult.md#receipt)

#### Defined in

[vm/src/types.ts:410](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L410)

___

### totalGasSpent

• **totalGasSpent**: `bigint`

The amount of gas used in this transaction, which is paid for
This contains the gas units that have been used on execution, plus the upfront cost,
which consists of calldata cost, intrinsic cost and optionally the access list costs

#### Inherited from

[RunTxResult](RunTxResult.md).[totalGasSpent](RunTxResult.md#totalgasspent)

#### Defined in

[vm/src/types.ts:417](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L417)

___

### transaction

• **transaction**: `TypedTransaction`

The transaction which just got finished

#### Defined in

[vm/src/types.ts:449](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L449)
