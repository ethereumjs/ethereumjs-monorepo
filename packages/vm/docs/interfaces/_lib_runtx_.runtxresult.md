[@ethereumjs/vm](../README.md) › ["lib/runTx"](../modules/_lib_runtx_.md) › [RunTxResult](_lib_runtx_.runtxresult.md)

# Interface: RunTxResult

Execution result of a transaction

## Hierarchy

* [EVMResult](_lib_evm_evm_.evmresult.md)

  ↳ **RunTxResult**

## Index

### Properties

* [amountSpent](_lib_runtx_.runtxresult.md#amountspent)
* [bloom](_lib_runtx_.runtxresult.md#bloom)
* [createdAddress](_lib_runtx_.runtxresult.md#optional-createdaddress)
* [execResult](_lib_runtx_.runtxresult.md#execresult)
* [gasRefund](_lib_runtx_.runtxresult.md#optional-gasrefund)
* [gasUsed](_lib_runtx_.runtxresult.md#gasused)

## Properties

###  amountSpent

• **amountSpent**: *BN*

*Defined in [lib/runTx.ts:43](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runTx.ts#L43)*

The amount of ether used by this transaction

___

###  bloom

• **bloom**: *Bloom*

*Defined in [lib/runTx.ts:39](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runTx.ts#L39)*

Bloom filter resulted from transaction

___

### `Optional` createdAddress

• **createdAddress**? : *Address*

*Inherited from [RunTxResult](_lib_runtx_.runtxresult.md).[createdAddress](_lib_runtx_.runtxresult.md#optional-createdaddress)*

*Defined in [lib/evm/evm.ts:31](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/evm.ts#L31)*

Address of created account durint transaction, if any

___

###  execResult

• **execResult**: *[ExecResult](_lib_evm_evm_.execresult.md)*

*Inherited from [RunTxResult](_lib_runtx_.runtxresult.md).[execResult](_lib_runtx_.runtxresult.md#execresult)*

*Defined in [lib/evm/evm.ts:35](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/evm.ts#L35)*

Contains the results from running the code, if any, as described in [runCode](../classes/_lib_index_.vm.md#runcode)

___

### `Optional` gasRefund

• **gasRefund**? : *BN*

*Defined in [lib/runTx.ts:47](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runTx.ts#L47)*

The amount of gas as that was refunded during the transaction (i.e. `gasUsed = totalGasConsumed - gasRefund`)

___

###  gasUsed

• **gasUsed**: *BN*

*Inherited from [RunTxResult](_lib_runtx_.runtxresult.md).[gasUsed](_lib_runtx_.runtxresult.md#gasused)*

*Defined in [lib/evm/evm.ts:27](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/evm.ts#L27)*

Amount of gas used by the transaction
