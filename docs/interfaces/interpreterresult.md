[ethereumjs-vm](../README.md) > [InterpreterResult](../interfaces/interpreterresult.md)

# Interface: InterpreterResult

Result of executing a message via the \[\[Interpreter\]\].

## Hierarchy

**InterpreterResult**

↳  [RunTxResult](runtxresult.md)

## Index

### Properties

* [createdAddress](interpreterresult.md#createdaddress)
* [gasUsed](interpreterresult.md#gasused)
* [vm](interpreterresult.md#vm)

---

## Properties

<a id="createdaddress"></a>

### `<Optional>` createdAddress

**● createdAddress**: *`Buffer`*

*Defined in [evm/interpreter.ts:33](https://github.com/ethereumjs/ethereumjs-vm/blob/de4d574/lib/evm/interpreter.ts#L33)*

Address of created account durint transaction, if any

___
<a id="gasused"></a>

###  gasUsed

**● gasUsed**: *`BN`*

*Defined in [evm/interpreter.ts:29](https://github.com/ethereumjs/ethereumjs-vm/blob/de4d574/lib/evm/interpreter.ts#L29)*

Amount of gas used by the transaction

___
<a id="vm"></a>

###  vm

**● vm**: *[ExecResult](execresult.md)*

*Defined in [evm/interpreter.ts:37](https://github.com/ethereumjs/ethereumjs-vm/blob/de4d574/lib/evm/interpreter.ts#L37)*

Contains the results from running the code, if any, as described in [runCode](../classes/vm.md#runcode)

___

