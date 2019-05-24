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

*Defined in [evm/interpreter.ts:48](https://github.com/ethereumjs/ethereumjs-vm/blob/06d36f3/lib/evm/interpreter.ts#L48)*

`0` if the contract encountered an exception, `1` otherwise

___
<a id="exceptionerror"></a>

### `<Optional>` exceptionError

**● exceptionError**: *[VmError](../classes/vmerror.md) \| [ERROR](../enums/error.md)*

*Defined in [evm/interpreter.ts:52](https://github.com/ethereumjs/ethereumjs-vm/blob/06d36f3/lib/evm/interpreter.ts#L52)*

Description of the exception, if any occured

___
<a id="gas"></a>

### `<Optional>` gas

**● gas**: *`BN`*

*Defined in [evm/interpreter.ts:56](https://github.com/ethereumjs/ethereumjs-vm/blob/06d36f3/lib/evm/interpreter.ts#L56)*

Amount of gas left

___
<a id="gasrefund"></a>

### `<Optional>` gasRefund

**● gasRefund**: *`BN`*

*Defined in [evm/interpreter.ts:76](https://github.com/ethereumjs/ethereumjs-vm/blob/06d36f3/lib/evm/interpreter.ts#L76)*

Amount of gas to refund from deleting storage values

___
<a id="gasused"></a>

###  gasUsed

**● gasUsed**: *`BN`*

*Defined in [evm/interpreter.ts:60](https://github.com/ethereumjs/ethereumjs-vm/blob/06d36f3/lib/evm/interpreter.ts#L60)*

Amount of gas the code used to run

___
<a id="logs"></a>

### `<Optional>` logs

**● logs**: *`any`[]*

*Defined in [evm/interpreter.ts:68](https://github.com/ethereumjs/ethereumjs-vm/blob/06d36f3/lib/evm/interpreter.ts#L68)*

Array of logs that the contract emitted

___
<a id="return"></a>

###  return

**● return**: *`Buffer`*

*Defined in [evm/interpreter.ts:64](https://github.com/ethereumjs/ethereumjs-vm/blob/06d36f3/lib/evm/interpreter.ts#L64)*

Return value from the contract

___
<a id="returnvalue"></a>

### `<Optional>` returnValue

**● returnValue**: *`Buffer`*

*Defined in [evm/interpreter.ts:72](https://github.com/ethereumjs/ethereumjs-vm/blob/06d36f3/lib/evm/interpreter.ts#L72)*

Value returned by the contract

___
<a id="runstate"></a>

### `<Optional>` runState

**● runState**: *`RunState`*

*Defined in [evm/interpreter.ts:44](https://github.com/ethereumjs/ethereumjs-vm/blob/06d36f3/lib/evm/interpreter.ts#L44)*

___
<a id="selfdestruct"></a>

### `<Optional>` selfdestruct

**● selfdestruct**: *`undefined` \| `object`*

*Defined in [evm/interpreter.ts:80](https://github.com/ethereumjs/ethereumjs-vm/blob/06d36f3/lib/evm/interpreter.ts#L80)*

A set of accounts that have self-destructed

___

