[ethereumjs-vm](../README.md) › ["runTx"](../modules/_runtx_.md) › [RunTxResult](_runtx_.runtxresult.md)

# Interface: RunTxResult

Execution result of a transaction

## Hierarchy

* [EVMResult](_evm_evm_.evmresult.md)

  ↳ **RunTxResult**

## Index

### Properties

* [amountSpent](_runtx_.runtxresult.md#amountspent)
* [bloom](_runtx_.runtxresult.md#bloom)
* [createdAddress](_runtx_.runtxresult.md#optional-createdaddress)
* [execResult](_runtx_.runtxresult.md#execresult)
* [gasRefund](_runtx_.runtxresult.md#optional-gasrefund)
* [gasUsed](_runtx_.runtxresult.md#gasused)

## Properties

###  amountSpent

• **amountSpent**: *BN*

*Defined in [runTx.ts:46](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runTx.ts#L46)*

The amount of ether used by this transaction

___

###  bloom

• **bloom**: *Bloom*

*Defined in [runTx.ts:42](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runTx.ts#L42)*

Bloom filter resulted from transaction

___

### `Optional` createdAddress

• **createdAddress**? : *Buffer*

*Inherited from [RunTxResult](_runtx_.runtxresult.md).[createdAddress](_runtx_.runtxresult.md#optional-createdaddress)*

*Defined in [evm/evm.ts:32](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/evm.ts#L32)*

Address of created account durint transaction, if any

___

###  execResult

• **execResult**: *[ExecResult](_evm_evm_.execresult.md)*

*Inherited from [RunTxResult](_runtx_.runtxresult.md).[execResult](_runtx_.runtxresult.md#execresult)*

*Defined in [evm/evm.ts:36](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/evm.ts#L36)*

Contains the results from running the code, if any, as described in [runCode](../classes/_index_.vm.md#runcode)

___

### `Optional` gasRefund

• **gasRefund**? : *BN*

*Defined in [runTx.ts:50](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runTx.ts#L50)*

The amount of gas as that was refunded during the transaction (i.e. `gasUsed = totalGasConsumed - gasRefund`)

___

###  gasUsed

• **gasUsed**: *BN*

*Inherited from [RunTxResult](_runtx_.runtxresult.md).[gasUsed](_runtx_.runtxresult.md#gasused)*

*Defined in [evm/evm.ts:28](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/evm.ts#L28)*

Amount of gas used by the transaction
