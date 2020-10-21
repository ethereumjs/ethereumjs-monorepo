[@ethereumjs/vm](../README.md) › ["lib/evm/evm"](../modules/_lib_evm_evm_.md) › [ExecResult](_lib_evm_evm_.execresult.md)

# Interface: ExecResult

Result of executing a call via the [[EVM]].

## Hierarchy

* **ExecResult**

## Index

### Properties

* [exceptionError](_lib_evm_evm_.execresult.md#optional-exceptionerror)
* [gas](_lib_evm_evm_.execresult.md#optional-gas)
* [gasRefund](_lib_evm_evm_.execresult.md#optional-gasrefund)
* [gasUsed](_lib_evm_evm_.execresult.md#gasused)
* [logs](_lib_evm_evm_.execresult.md#optional-logs)
* [returnValue](_lib_evm_evm_.execresult.md#returnvalue)
* [runState](_lib_evm_evm_.execresult.md#optional-runstate)
* [selfdestruct](_lib_evm_evm_.execresult.md#optional-selfdestruct)

## Properties

### `Optional` exceptionError

• **exceptionError**? : *[VmError](../classes/_lib_exceptions_.vmerror.md)*

*Defined in [lib/evm/evm.ts:46](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/evm.ts#L46)*

Description of the exception, if any occured

___

### `Optional` gas

• **gas**? : *BN*

*Defined in [lib/evm/evm.ts:50](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/evm.ts#L50)*

Amount of gas left

___

### `Optional` gasRefund

• **gasRefund**? : *BN*

*Defined in [lib/evm/evm.ts:70](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/evm.ts#L70)*

Total amount of gas to be refunded from all nested calls.

___

###  gasUsed

• **gasUsed**: *BN*

*Defined in [lib/evm/evm.ts:54](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/evm.ts#L54)*

Amount of gas the code used to run

___

### `Optional` logs

• **logs**? : *any[]*

*Defined in [lib/evm/evm.ts:62](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/evm.ts#L62)*

Array of logs that the contract emitted

___

###  returnValue

• **returnValue**: *Buffer*

*Defined in [lib/evm/evm.ts:58](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/evm.ts#L58)*

Return value from the contract

___

### `Optional` runState

• **runState**? : *RunState*

*Defined in [lib/evm/evm.ts:42](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/evm.ts#L42)*

___

### `Optional` selfdestruct

• **selfdestruct**? : *undefined | object*

*Defined in [lib/evm/evm.ts:66](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/evm.ts#L66)*

A map from the accounts that have self-destructed to the addresses to send their funds to
