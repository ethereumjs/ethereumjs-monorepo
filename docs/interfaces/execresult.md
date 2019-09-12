[ethereumjs-vm](../README.md) > [ExecResult](../interfaces/execresult.md)

# Interface: ExecResult

Result of executing a call via the \[\[EVM\]\].

## Hierarchy

**ExecResult**

## Index

### Properties

* [exceptionError](execresult.md#exceptionerror)
* [gas](execresult.md#gas)
* [gasRefund](execresult.md#gasrefund)
* [gasUsed](execresult.md#gasused)
* [logs](execresult.md#logs)
* [returnValue](execresult.md#returnvalue)
* [runState](execresult.md#runstate)
* [selfdestruct](execresult.md#selfdestruct)

---

## Properties

<a id="exceptionerror"></a>

### `<Optional>` exceptionError

**● exceptionError**: *[VmError](../classes/vmerror.md)*

*Defined in [evm/evm.ts:47](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/evm/evm.ts#L47)*

Description of the exception, if any occured

___
<a id="gas"></a>

### `<Optional>` gas

**● gas**: *`BN`*

*Defined in [evm/evm.ts:51](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/evm/evm.ts#L51)*

Amount of gas left

___
<a id="gasrefund"></a>

### `<Optional>` gasRefund

**● gasRefund**: *`BN`*

*Defined in [evm/evm.ts:67](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/evm/evm.ts#L67)*

Amount of gas to refund from deleting storage values

___
<a id="gasused"></a>

###  gasUsed

**● gasUsed**: *`BN`*

*Defined in [evm/evm.ts:55](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/evm/evm.ts#L55)*

Amount of gas the code used to run

___
<a id="logs"></a>

### `<Optional>` logs

**● logs**: *`any`[]*

*Defined in [evm/evm.ts:63](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/evm/evm.ts#L63)*

Array of logs that the contract emitted

___
<a id="returnvalue"></a>

###  returnValue

**● returnValue**: *`Buffer`*

*Defined in [evm/evm.ts:59](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/evm/evm.ts#L59)*

Return value from the contract

___
<a id="runstate"></a>

### `<Optional>` runState

**● runState**: *`RunState`*

*Defined in [evm/evm.ts:43](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/evm/evm.ts#L43)*

___
<a id="selfdestruct"></a>

### `<Optional>` selfdestruct

**● selfdestruct**: *`undefined` \| `object`*

*Defined in [evm/evm.ts:71](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/evm/evm.ts#L71)*

A map from the accounts that have self-destructed to the addresses to send their funds to

___

