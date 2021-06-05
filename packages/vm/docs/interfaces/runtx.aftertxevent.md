[@ethereumjs/vm](../README.md) / [runTx](../modules/runtx.md) / AfterTxEvent

# Interface: AfterTxEvent

[runTx](../modules/runtx.md).AfterTxEvent

## Hierarchy

- [*RunTxResult*](runtx.runtxresult.md)

  ↳ **AfterTxEvent**

## Table of contents

### Properties

- [accessList](runtx.aftertxevent.md#accesslist)
- [amountSpent](runtx.aftertxevent.md#amountspent)
- [bloom](runtx.aftertxevent.md#bloom)
- [createdAddress](runtx.aftertxevent.md#createdaddress)
- [execResult](runtx.aftertxevent.md#execresult)
- [gasRefund](runtx.aftertxevent.md#gasrefund)
- [gasUsed](runtx.aftertxevent.md#gasused)
- [receipt](runtx.aftertxevent.md#receipt)
- [transaction](runtx.aftertxevent.md#transaction)

## Properties

### accessList

• `Optional` **accessList**: AccessList

EIP-2930 access list generated for the tx (see `reportAccessList` option)

Inherited from: [RunTxResult](runtx.runtxresult.md).[accessList](runtx.runtxresult.md#accesslist)

Defined in: [runTx.ts:106](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runTx.ts#L106)

___

### amountSpent

• **amountSpent**: *BN*

The amount of ether used by this transaction

Inherited from: [RunTxResult](runtx.runtxresult.md).[amountSpent](runtx.runtxresult.md#amountspent)

Defined in: [runTx.ts:91](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runTx.ts#L91)

___

### bloom

• **bloom**: *default*

Bloom filter resulted from transaction

Inherited from: [RunTxResult](runtx.runtxresult.md).[bloom](runtx.runtxresult.md#bloom)

Defined in: [runTx.ts:86](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runTx.ts#L86)

___

### createdAddress

• `Optional` **createdAddress**: *Address*

Address of created account durint transaction, if any

Inherited from: [RunTxResult](runtx.runtxresult.md).[createdAddress](runtx.runtxresult.md#createdaddress)

Defined in: [evm/evm.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/evm/evm.ts#L31)

___

### execResult

• **execResult**: ExecResult

Contains the results from running the code, if any, as described in [runCode](../classes/index.default.md#runcode)

Inherited from: [RunTxResult](runtx.runtxresult.md).[execResult](runtx.runtxresult.md#execresult)

Defined in: [evm/evm.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/evm/evm.ts#L35)

___

### gasRefund

• `Optional` **gasRefund**: *BN*

The amount of gas as that was refunded during the transaction (i.e. `gasUsed = totalGasConsumed - gasRefund`)

Inherited from: [RunTxResult](runtx.runtxresult.md).[gasRefund](runtx.runtxresult.md#gasrefund)

Defined in: [runTx.ts:101](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runTx.ts#L101)

___

### gasUsed

• **gasUsed**: *BN*

Amount of gas used by the transaction

Inherited from: [RunTxResult](runtx.runtxresult.md).[gasUsed](runtx.runtxresult.md#gasused)

Defined in: [evm/evm.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/evm/evm.ts#L27)

___

### receipt

• **receipt**: [*TxReceipt*](../modules/types.md#txreceipt)

The tx receipt

Inherited from: [RunTxResult](runtx.runtxresult.md).[receipt](runtx.runtxresult.md#receipt)

Defined in: [runTx.ts:96](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runTx.ts#L96)

___

### transaction

• **transaction**: TypedTransaction

The transaction which just got finished

Defined in: [runTx.ts:113](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runTx.ts#L113)
