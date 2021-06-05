[@ethereumjs/vm](../README.md) / [runTx](../modules/runtx.md) / RunTxResult

# Interface: RunTxResult

[runTx](../modules/runtx.md).RunTxResult

Execution result of a transaction

## Hierarchy

- *EVMResult*

  ↳ **RunTxResult**

  ↳↳ [*AfterTxEvent*](runtx.aftertxevent.md)

## Table of contents

### Properties

- [accessList](runtx.runtxresult.md#accesslist)
- [amountSpent](runtx.runtxresult.md#amountspent)
- [bloom](runtx.runtxresult.md#bloom)
- [createdAddress](runtx.runtxresult.md#createdaddress)
- [execResult](runtx.runtxresult.md#execresult)
- [gasRefund](runtx.runtxresult.md#gasrefund)
- [gasUsed](runtx.runtxresult.md#gasused)
- [receipt](runtx.runtxresult.md#receipt)

## Properties

### accessList

• `Optional` **accessList**: AccessList

EIP-2930 access list generated for the tx (see `reportAccessList` option)

Defined in: [runTx.ts:106](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runTx.ts#L106)

___

### amountSpent

• **amountSpent**: *BN*

The amount of ether used by this transaction

Defined in: [runTx.ts:91](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runTx.ts#L91)

___

### bloom

• **bloom**: *default*

Bloom filter resulted from transaction

Defined in: [runTx.ts:86](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runTx.ts#L86)

___

### createdAddress

• `Optional` **createdAddress**: *Address*

Address of created account durint transaction, if any

Inherited from: EVMResult.createdAddress

Defined in: [evm/evm.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/evm/evm.ts#L31)

___

### execResult

• **execResult**: ExecResult

Contains the results from running the code, if any, as described in [runCode](../classes/index.default.md#runcode)

Inherited from: EVMResult.execResult

Defined in: [evm/evm.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/evm/evm.ts#L35)

___

### gasRefund

• `Optional` **gasRefund**: *BN*

The amount of gas as that was refunded during the transaction (i.e. `gasUsed = totalGasConsumed - gasRefund`)

Defined in: [runTx.ts:101](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runTx.ts#L101)

___

### gasUsed

• **gasUsed**: *BN*

Amount of gas used by the transaction

Inherited from: EVMResult.gasUsed

Defined in: [evm/evm.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/evm/evm.ts#L27)

___

### receipt

• **receipt**: [*TxReceipt*](../modules/types.md#txreceipt)

The tx receipt

Defined in: [runTx.ts:96](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runTx.ts#L96)
