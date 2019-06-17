[ethereumjs-vm](../README.md) > [ExecResult](../interfaces/execresult.md)

# Interface: ExecResult

Result of executing a call via the \[\[Interpreter\]\].

## Hierarchy

**ExecResult**

## Index

### Properties

* [exception](execresult.md#exception)
* [exceptionError](execresult.md#exceptionerror)
* [gas](execresult.md#gas)
* [gasRefund](execresult.md#gasrefund)
* [gasUsed](execresult.md#gasused)
* [logs](execresult.md#logs)
* [return](execresult.md#return)
* [returnValue](execresult.md#returnvalue)
* [runState](execresult.md#runstate)
* [selfdestruct](execresult.md#selfdestruct)

---

## Properties

<a id="exception"></a>

###  exception

**● exception**: *`IsException`*

*Defined in [evm/interpreter.ts:47](https://github.com/ethereumjs/ethereumjs-vm/blob/2fcfe31/lib/evm/interpreter.ts#L47)*

`0` if the contract encountered an exception, `1` otherwise

___
<a id="exceptionerror"></a>

### `<Optional>` exceptionError

**● exceptionError**: *[VmError](../classes/vmerror.md) \| [ERROR](../enums/error.md)*

*Defined in [evm/interpreter.ts:51](https://github.com/ethereumjs/ethereumjs-vm/blob/2fcfe31/lib/evm/interpreter.ts#L51)*

Description of the exception, if any occured

___
<a id="gas"></a>

### `<Optional>` gas

**● gas**: *`BN`*

*Defined in [evm/interpreter.ts:55](https://github.com/ethereumjs/ethereumjs-vm/blob/2fcfe31/lib/evm/interpreter.ts#L55)*

Amount of gas left

___
<a id="gasrefund"></a>

### `<Optional>` gasRefund

**● gasRefund**: *`BN`*

*Defined in [evm/interpreter.ts:75](https://github.com/ethereumjs/ethereumjs-vm/blob/2fcfe31/lib/evm/interpreter.ts#L75)*

Amount of gas to refund from deleting storage values

___
<a id="gasused"></a>

###  gasUsed

**● gasUsed**: *`BN`*

*Defined in [evm/interpreter.ts:59](https://github.com/ethereumjs/ethereumjs-vm/blob/2fcfe31/lib/evm/interpreter.ts#L59)*

Amount of gas the code used to run

___
<a id="logs"></a>

### `<Optional>` logs

**● logs**: *`any`[]*

*Defined in [evm/interpreter.ts:67](https://github.com/ethereumjs/ethereumjs-vm/blob/2fcfe31/lib/evm/interpreter.ts#L67)*

Array of logs that the contract emitted

___
<a id="return"></a>

###  return

**● return**: *`Buffer`*

*Defined in [evm/interpreter.ts:63](https://github.com/ethereumjs/ethereumjs-vm/blob/2fcfe31/lib/evm/interpreter.ts#L63)*

Return value from the contract

___
<a id="returnvalue"></a>

### `<Optional>` returnValue

**● returnValue**: *`Buffer`*

*Defined in [evm/interpreter.ts:71](https://github.com/ethereumjs/ethereumjs-vm/blob/2fcfe31/lib/evm/interpreter.ts#L71)*

Value returned by the contract

___
<a id="runstate"></a>

### `<Optional>` runState

**● runState**: *`RunState`*

*Defined in [evm/interpreter.ts:43](https://github.com/ethereumjs/ethereumjs-vm/blob/2fcfe31/lib/evm/interpreter.ts#L43)*

___
<a id="selfdestruct"></a>

### `<Optional>` selfdestruct

**● selfdestruct**: *`undefined` \| `object`*

*Defined in [evm/interpreter.ts:79](https://github.com/ethereumjs/ethereumjs-vm/blob/2fcfe31/lib/evm/interpreter.ts#L79)*

A map from the accounts that have self-destructed to the addresses to send their funds to

___

