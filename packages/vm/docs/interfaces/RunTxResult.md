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
- [blobGasUsed](RunTxResult.md#blobgasused)
- [bloom](RunTxResult.md#bloom)
- [createdAddress](RunTxResult.md#createdaddress)
- [execResult](RunTxResult.md#execresult)
- [gasRefund](RunTxResult.md#gasrefund)
- [minerValue](RunTxResult.md#minervalue)
- [preimages](RunTxResult.md#preimages)
- [receipt](RunTxResult.md#receipt)
- [totalGasSpent](RunTxResult.md#totalgasspent)

## Properties

### accessList

• `Optional` **accessList**: `AccessList`

EIP-2930 access list generated for the tx (see `reportAccessList` option)

#### Defined in

[vm/src/types.ts:427](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L427)

___

### amountSpent

• **amountSpent**: `bigint`

The amount of ether used by this transaction

#### Defined in

[vm/src/types.ts:405](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L405)

___

### blobGasUsed

• `Optional` **blobGasUsed**: `bigint`

This is the blob gas units times the fee per blob gas for 4844 transactions

#### Defined in

[vm/src/types.ts:442](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L442)

___

### bloom

• **bloom**: `Bloom`

Bloom filter resulted from transaction

#### Defined in

[vm/src/types.ts:400](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L400)

___

### createdAddress

• `Optional` **createdAddress**: `Address`

Address of created account during transaction, if any

#### Inherited from

EVMResult.createdAddress

#### Defined in

evm/dist/cjs/types.d.ts:248

___

### execResult

• **execResult**: `ExecResult`

Contains the results from running the code, if any, as described in runCode

#### Inherited from

EVMResult.execResult

#### Defined in

evm/dist/cjs/types.d.ts:252

___

### gasRefund

• **gasRefund**: `bigint`

The amount of gas as that was refunded during the transaction (i.e. `gasUsed = totalGasConsumed - gasRefund`)

#### Defined in

[vm/src/types.ts:422](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L422)

___

### minerValue

• **minerValue**: `bigint`

The value that accrues to the miner by this transaction

#### Defined in

[vm/src/types.ts:437](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L437)

___

### preimages

• `Optional` **preimages**: `Map`<`string`, `Uint8Array`\>

Preimages mapping of the touched accounts from the tx (see `reportPreimages` option)

#### Defined in

[vm/src/types.ts:432](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L432)

___

### receipt

• **receipt**: [`TxReceipt`](../README.md#txreceipt)

The tx receipt

#### Defined in

[vm/src/types.ts:410](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L410)

___

### totalGasSpent

• **totalGasSpent**: `bigint`

The amount of gas used in this transaction, which is paid for
This contains the gas units that have been used on execution, plus the upfront cost,
which consists of calldata cost, intrinsic cost and optionally the access list costs

#### Defined in

[vm/src/types.ts:417](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L417)
