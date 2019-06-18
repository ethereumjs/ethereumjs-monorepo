[ethereumjs-vm](../README.md) > [ExecResult](../interfaces/execresult.md)

# Interface: ExecResult

Result of executing a call via the \[\[EVM\]\].

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

*Defined in [evm/evm.ts:53](https://github.com/ethereumjs/ethereumjs-vm/blob/3e1633c/lib/evm/evm.ts#L53)*

`0` if the contract encountered an exception, `1` otherwise

___
<a id="exceptionerror"></a>

### `<Optional>` exceptionError

**● exceptionError**: *[VmError](../classes/vmerror.md) \| [ERROR](../enums/error.md)*

*Defined in [evm/evm.ts:57](https://github.com/ethereumjs/ethereumjs-vm/blob/3e1633c/lib/evm/evm.ts#L57)*

Description of the exception, if any occured

___
<a id="gas"></a>

### `<Optional>` gas

**● gas**: *`BN`*

*Defined in [evm/evm.ts:61](https://github.com/ethereumjs/ethereumjs-vm/blob/3e1633c/lib/evm/evm.ts#L61)*

Amount of gas left

___
<a id="gasrefund"></a>

### `<Optional>` gasRefund

**● gasRefund**: *`BN`*

*Defined in [evm/evm.ts:81](https://github.com/ethereumjs/ethereumjs-vm/blob/3e1633c/lib/evm/evm.ts#L81)*

Amount of gas to refund from deleting storage values

___
<a id="gasused"></a>

###  gasUsed

**● gasUsed**: *`BN`*

*Defined in [evm/evm.ts:65](https://github.com/ethereumjs/ethereumjs-vm/blob/3e1633c/lib/evm/evm.ts#L65)*

Amount of gas the code used to run

___
<a id="logs"></a>

### `<Optional>` logs

**● logs**: *`any`[]*

*Defined in [evm/evm.ts:73](https://github.com/ethereumjs/ethereumjs-vm/blob/3e1633c/lib/evm/evm.ts#L73)*

Array of logs that the contract emitted

___
<a id="return"></a>

###  return

**● return**: *`Buffer`*

*Defined in [evm/evm.ts:69](https://github.com/ethereumjs/ethereumjs-vm/blob/3e1633c/lib/evm/evm.ts#L69)*

Return value from the contract

___
<a id="returnvalue"></a>

### `<Optional>` returnValue

**● returnValue**: *`Buffer`*

*Defined in [evm/evm.ts:77](https://github.com/ethereumjs/ethereumjs-vm/blob/3e1633c/lib/evm/evm.ts#L77)*

Value returned by the contract

___
<a id="runstate"></a>

### `<Optional>` runState

**● runState**: *`RunState`*

*Defined in [evm/evm.ts:49](https://github.com/ethereumjs/ethereumjs-vm/blob/3e1633c/lib/evm/evm.ts#L49)*

___
<a id="selfdestruct"></a>

### `<Optional>` selfdestruct

**● selfdestruct**: *`undefined` \| `object`*

*Defined in [evm/evm.ts:85](https://github.com/ethereumjs/ethereumjs-vm/blob/3e1633c/lib/evm/evm.ts#L85)*

A map from the accounts that have self-destructed to the addresses to send their funds to

___

