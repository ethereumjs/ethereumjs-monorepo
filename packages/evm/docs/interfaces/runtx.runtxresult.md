[@ethereumjs/vm](../README.md) / [Exports](../modules.md) / [runTx](../modules/runTx.md) / RunTxResult

# Interface: RunTxResult

[runTx](../modules/runTx.md).RunTxResult

Execution result of a transaction

## Hierarchy

- `EVMResult`

  ↳ **`RunTxResult`**

  ↳↳ [`AfterTxEvent`](runTx.AfterTxEvent.md)

## Table of contents

### Properties

- [accessList](runTx.RunTxResult.md#accesslist)
- [amountSpent](runTx.RunTxResult.md#amountspent)
- [bloom](runTx.RunTxResult.md#bloom)
- [gasRefund](runTx.RunTxResult.md#gasrefund)
- [receipt](runTx.RunTxResult.md#receipt)

## Properties

### accessList

• `Optional` **accessList**: `AccessList`

EIP-2930 access list generated for the tx (see `reportAccessList` option)

#### Defined in

[runTx.ts:104](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runTx.ts#L104)

___

### amountSpent

• **amountSpent**: `BN`

The amount of ether used by this transaction

#### Defined in

[runTx.ts:89](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runTx.ts#L89)

___

### bloom

• **bloom**: `default`

Bloom filter resulted from transaction

#### Defined in

[runTx.ts:84](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runTx.ts#L84)

___

### gasRefund

• `Optional` **gasRefund**: `BN`

The amount of gas as that was refunded during the transaction (i.e. `gasUsed = totalGasConsumed - gasRefund`)

#### Defined in

[runTx.ts:99](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runTx.ts#L99)

___

### receipt

• **receipt**: [`TxReceipt`](../modules/types.md#txreceipt)

The tx receipt

#### Defined in

[runTx.ts:94](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runTx.ts#L94)
