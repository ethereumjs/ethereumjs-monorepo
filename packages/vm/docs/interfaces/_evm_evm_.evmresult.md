[@ethereumjs/vm](../README.md) › ["evm/evm"](../modules/_evm_evm_.md) › [EVMResult](_evm_evm_.evmresult.md)

# Interface: EVMResult

Result of executing a message via the [[EVM]].

## Hierarchy

* **EVMResult**

  ↳ [RunTxResult](_runtx_.runtxresult.md)

## Index

### Properties

* [createdAddress](_evm_evm_.evmresult.md#optional-createdaddress)
* [execResult](_evm_evm_.evmresult.md#execresult)
* [gasUsed](_evm_evm_.evmresult.md#gasused)

## Properties

### `Optional` createdAddress

• **createdAddress**? : *Buffer*

*Defined in [evm/evm.ts:31](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/evm.ts#L31)*

Address of created account durint transaction, if any

___

###  execResult

• **execResult**: *[ExecResult](_evm_evm_.execresult.md)*

*Defined in [evm/evm.ts:35](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/evm.ts#L35)*

Contains the results from running the code, if any, as described in [runCode](../classes/_index_.vm.md#runcode)

___

###  gasUsed

• **gasUsed**: *BN*

*Defined in [evm/evm.ts:27](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/evm.ts#L27)*

Amount of gas used by the transaction
