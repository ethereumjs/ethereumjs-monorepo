[@ethereumjs/vm](../README.md) / [runTx](../modules/runtx.md) / RunTxResult

# Interface: RunTxResult

[runTx](../modules/runtx.md).RunTxResult

Execution result of a transaction

## Hierarchy

- `EVMResult`

  ↳ **RunTxResult**

  ↳↳ [AfterTxEvent](runtx.aftertxevent.md)

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

### createdAddress

• `Optional` **createdAddress**: `Address`

Address of created account durint transaction, if any

#### Inherited from

EVMResult.createdAddress

#### Defined in

[evm/evm.ts:37](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/evm/evm.ts#L37)

___

### execResult

• **execResult**: `ExecResult`

Contains the results from running the code, if any, as described in [runCode](../classes/index.default.md#runcode)

#### Inherited from

EVMResult.execResult

#### Defined in

[evm/evm.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/evm/evm.ts#L41)

___

### gasRefund

• `Optional` **gasRefund**: `BN`

The amount of gas as that was refunded during the transaction (i.e. `gasUsed = totalGasConsumed - gasRefund`)

#### Defined in

[runTx.ts:99](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runTx.ts#L99)

___

### gasUsed

• **gasUsed**: `BN`

Amount of gas used by the transaction

#### Inherited from

EVMResult.gasUsed

#### Defined in

[evm/evm.ts:33](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/evm/evm.ts#L33)

___

### receipt

• **receipt**: [TxReceipt](../modules/types.md#txreceipt)

The tx receipt

#### Defined in

[runTx.ts:94](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runTx.ts#L94)
