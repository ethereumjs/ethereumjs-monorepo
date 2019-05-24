[ethereumjs-vm](../README.md) > [RunTxResult](../interfaces/runtxresult.md)

# Interface: RunTxResult

Execution result of a transaction

## Hierarchy

 [InterpreterResult](interpreterresult.md)

**↳ RunTxResult**

## Index

### Properties

* [amountSpent](runtxresult.md#amountspent)
* [bloom](runtxresult.md#bloom)
* [createdAddress](runtxresult.md#createdaddress)
* [gasRefund](runtxresult.md#gasrefund)
* [gasUsed](runtxresult.md#gasused)
* [vm](runtxresult.md#vm)

---

## Properties

<a id="amountspent"></a>

###  amountSpent

**● amountSpent**: *`BN`*

*Defined in [runTx.ts:57](https://github.com/ethereumjs/ethereumjs-vm/blob/06d36f3/lib/runTx.ts#L57)*

The amount of ether used by this transaction

___
<a id="bloom"></a>

###  bloom

**● bloom**: *`Bloom`*

*Defined in [runTx.ts:53](https://github.com/ethereumjs/ethereumjs-vm/blob/06d36f3/lib/runTx.ts#L53)*

Bloom filter resulted from transaction

___
<a id="createdaddress"></a>

### `<Optional>` createdAddress

**● createdAddress**: *`Buffer`*

*Inherited from [InterpreterResult](interpreterresult.md).[createdAddress](interpreterresult.md#createdaddress)*

*Defined in [evm/interpreter.ts:33](https://github.com/ethereumjs/ethereumjs-vm/blob/06d36f3/lib/evm/interpreter.ts#L33)*

Address of created account durint transaction, if any

___
<a id="gasrefund"></a>

### `<Optional>` gasRefund

**● gasRefund**: *`BN`*

*Defined in [runTx.ts:61](https://github.com/ethereumjs/ethereumjs-vm/blob/06d36f3/lib/runTx.ts#L61)*

The amount of gas as that was refunded during the transaction (i.e. `gasUsed = totalGasConsumed - gasRefund`)

___
<a id="gasused"></a>

###  gasUsed

**● gasUsed**: *`BN`*

*Inherited from [InterpreterResult](interpreterresult.md).[gasUsed](interpreterresult.md#gasused)*

*Defined in [evm/interpreter.ts:29](https://github.com/ethereumjs/ethereumjs-vm/blob/06d36f3/lib/evm/interpreter.ts#L29)*

Amount of gas used by the transaction

___
<a id="vm"></a>

###  vm

**● vm**: *[ExecResult](execresult.md)*

*Inherited from [InterpreterResult](interpreterresult.md).[vm](interpreterresult.md#vm)*

*Defined in [evm/interpreter.ts:37](https://github.com/ethereumjs/ethereumjs-vm/blob/06d36f3/lib/evm/interpreter.ts#L37)*

Contains the results from running the code, if any, as described in [runCode](../classes/vm.md#runcode)

___

