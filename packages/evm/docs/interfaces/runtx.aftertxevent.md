[@ethereumjs/vm](../README.md) / [Exports](../modules.md) / [runTx](../modules/runTx.md) / AfterTxEvent

# Interface: AfterTxEvent

[runTx](../modules/runTx.md).AfterTxEvent

## Hierarchy

- [`RunTxResult`](runTx.RunTxResult.md)

  ↳ **`AfterTxEvent`**

## Table of contents

### Properties

- [accessList](runTx.AfterTxEvent.md#accesslist)
- [amountSpent](runTx.AfterTxEvent.md#amountspent)
- [bloom](runTx.AfterTxEvent.md#bloom)
- [gasRefund](runTx.AfterTxEvent.md#gasrefund)
- [receipt](runTx.AfterTxEvent.md#receipt)
- [transaction](runTx.AfterTxEvent.md#transaction)

## Properties

### accessList

• `Optional` **accessList**: `AccessList`

EIP-2930 access list generated for the tx (see `reportAccessList` option)

#### Inherited from

[RunTxResult](runTx.RunTxResult.md).[accessList](runTx.RunTxResult.md#accesslist)

#### Defined in

[runTx.ts:104](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runTx.ts#L104)

___

### amountSpent

• **amountSpent**: `BN`

The amount of ether used by this transaction

#### Inherited from

[RunTxResult](runTx.RunTxResult.md).[amountSpent](runTx.RunTxResult.md#amountspent)

#### Defined in

[runTx.ts:89](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runTx.ts#L89)

___

### bloom

• **bloom**: `default`

Bloom filter resulted from transaction

#### Inherited from

[RunTxResult](runTx.RunTxResult.md).[bloom](runTx.RunTxResult.md#bloom)

#### Defined in

[runTx.ts:84](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runTx.ts#L84)

___

### gasRefund

• `Optional` **gasRefund**: `BN`

The amount of gas as that was refunded during the transaction (i.e. `gasUsed = totalGasConsumed - gasRefund`)

#### Inherited from

[RunTxResult](runTx.RunTxResult.md).[gasRefund](runTx.RunTxResult.md#gasrefund)

#### Defined in

[runTx.ts:99](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runTx.ts#L99)

___

### receipt

• **receipt**: [`TxReceipt`](../modules/types.md#txreceipt)

The tx receipt

#### Inherited from

[RunTxResult](runTx.RunTxResult.md).[receipt](runTx.RunTxResult.md#receipt)

#### Defined in

[runTx.ts:94](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runTx.ts#L94)

___

### transaction

• **transaction**: `TypedTransaction`

The transaction which just got finished

#### Defined in

[runTx.ts:111](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runTx.ts#L111)
