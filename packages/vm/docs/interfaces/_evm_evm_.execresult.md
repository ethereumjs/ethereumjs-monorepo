[ethereumjs-vm](../README.md) › ["evm/evm"](../modules/_evm_evm_.md) › [ExecResult](_evm_evm_.execresult.md)

# Interface: ExecResult

Result of executing a call via the [[EVM]].

## Hierarchy

* **ExecResult**

## Index

### Properties

* [exceptionError](_evm_evm_.execresult.md#optional-exceptionerror)
* [gas](_evm_evm_.execresult.md#optional-gas)
* [gasRefund](_evm_evm_.execresult.md#optional-gasrefund)
* [gasUsed](_evm_evm_.execresult.md#gasused)
* [logs](_evm_evm_.execresult.md#optional-logs)
* [returnValue](_evm_evm_.execresult.md#returnvalue)
* [runState](_evm_evm_.execresult.md#optional-runstate)
* [selfdestruct](_evm_evm_.execresult.md#optional-selfdestruct)

## Properties

### `Optional` exceptionError

• **exceptionError**? : *[VmError](../classes/_exceptions_.vmerror.md)*

*Defined in [evm/evm.ts:47](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/evm.ts#L47)*

Description of the exception, if any occured

___

### `Optional` gas

• **gas**? : *BN*

*Defined in [evm/evm.ts:51](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/evm.ts#L51)*

Amount of gas left

___

### `Optional` gasRefund

• **gasRefund**? : *BN*

*Defined in [evm/evm.ts:71](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/evm.ts#L71)*

Total amount of gas to be refunded from all nested calls.

___

###  gasUsed

• **gasUsed**: *BN*

*Defined in [evm/evm.ts:55](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/evm.ts#L55)*

Amount of gas the code used to run

___

### `Optional` logs

• **logs**? : *any[]*

*Defined in [evm/evm.ts:63](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/evm.ts#L63)*

Array of logs that the contract emitted

___

###  returnValue

• **returnValue**: *Buffer*

*Defined in [evm/evm.ts:59](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/evm.ts#L59)*

Return value from the contract

___

### `Optional` runState

• **runState**? : *RunState*

*Defined in [evm/evm.ts:43](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/evm.ts#L43)*

___

### `Optional` selfdestruct

• **selfdestruct**? : *undefined | object*

*Defined in [evm/evm.ts:67](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/evm.ts#L67)*

A map from the accounts that have self-destructed to the addresses to send their funds to
