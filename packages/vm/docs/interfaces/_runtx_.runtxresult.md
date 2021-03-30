[@ethereumjs/vm](../README.md) › ["runTx"](../modules/_runtx_.md) › [RunTxResult](_runtx_.runtxresult.md)

# Interface: RunTxResult

Execution result of a transaction

## Hierarchy

* EVMResult

  ↳ **RunTxResult**

  ↳ [AfterTxEvent](_runtx_.aftertxevent.md)

## Index

### Properties

* [accessList](_runtx_.runtxresult.md#optional-accesslist)
* [amountSpent](_runtx_.runtxresult.md#amountspent)
* [bloom](_runtx_.runtxresult.md#bloom)
* [createdAddress](_runtx_.runtxresult.md#optional-createdaddress)
* [execResult](_runtx_.runtxresult.md#execresult)
* [gasRefund](_runtx_.runtxresult.md#optional-gasrefund)
* [gasUsed](_runtx_.runtxresult.md#gasused)

## Properties

### `Optional` accessList

• **accessList**? : *AccessList*

*Defined in [runTx.ts:82](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runTx.ts#L82)*

EIP-2930 access list generated for the tx (see `reportAccessList` option)

___

###  amountSpent

• **amountSpent**: *BN*

*Defined in [runTx.ts:73](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runTx.ts#L73)*

The amount of ether used by this transaction

___

###  bloom

• **bloom**: *Bloom*

*Defined in [runTx.ts:69](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runTx.ts#L69)*

Bloom filter resulted from transaction

___

### `Optional` createdAddress

• **createdAddress**? : *Address*

*Inherited from [RunTxResult](_runtx_.runtxresult.md).[createdAddress](_runtx_.runtxresult.md#optional-createdaddress)*

*Defined in [evm/evm.ts:36](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/evm/evm.ts#L36)*

Address of created account durint transaction, if any

___

###  execResult

• **execResult**: *ExecResult*

*Inherited from [RunTxResult](_runtx_.runtxresult.md).[execResult](_runtx_.runtxresult.md#execresult)*

*Defined in [evm/evm.ts:40](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/evm/evm.ts#L40)*

Contains the results from running the code, if any, as described in [runCode](../classes/_index_.vm.md#runcode)

___

### `Optional` gasRefund

• **gasRefund**? : *BN*

*Defined in [runTx.ts:77](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runTx.ts#L77)*

The amount of gas as that was refunded during the transaction (i.e. `gasUsed = totalGasConsumed - gasRefund`)

___

###  gasUsed

• **gasUsed**: *BN*

*Inherited from [RunTxResult](_runtx_.runtxresult.md).[gasUsed](_runtx_.runtxresult.md#gasused)*

*Defined in [evm/evm.ts:32](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/evm/evm.ts#L32)*

Amount of gas used by the transaction
