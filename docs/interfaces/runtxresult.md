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

*Defined in [runTx.ts:56](https://github.com/ethereumjs/ethereumjs-vm/blob/5938d6a/lib/runTx.ts#L56)*

The amount of ether used by this transaction

___
<a id="bloom"></a>

###  bloom

**● bloom**: *`Bloom`*

*Defined in [runTx.ts:52](https://github.com/ethereumjs/ethereumjs-vm/blob/5938d6a/lib/runTx.ts#L52)*

Bloom filter resulted from transaction

___
<a id="createdaddress"></a>

### `<Optional>` createdAddress

**● createdAddress**: *`Buffer`*

*Inherited from [InterpreterResult](interpreterresult.md).[createdAddress](interpreterresult.md#createdaddress)*

*Defined in [evm/interpreter.ts:32](https://github.com/ethereumjs/ethereumjs-vm/blob/5938d6a/lib/evm/interpreter.ts#L32)*

Address of created account durint transaction, if any

___
<a id="gasrefund"></a>

### `<Optional>` gasRefund

**● gasRefund**: *`BN`*

*Defined in [runTx.ts:60](https://github.com/ethereumjs/ethereumjs-vm/blob/5938d6a/lib/runTx.ts#L60)*

The amount of gas as that was refunded during the transaction (i.e. `gasUsed = totalGasConsumed - gasRefund`)

___
<a id="gasused"></a>

###  gasUsed

**● gasUsed**: *`BN`*

*Inherited from [InterpreterResult](interpreterresult.md).[gasUsed](interpreterresult.md#gasused)*

*Defined in [evm/interpreter.ts:28](https://github.com/ethereumjs/ethereumjs-vm/blob/5938d6a/lib/evm/interpreter.ts#L28)*

Amount of gas used by the transaction

___
<a id="vm"></a>

###  vm

**● vm**: *[ExecResult](execresult.md)*

*Inherited from [InterpreterResult](interpreterresult.md).[vm](interpreterresult.md#vm)*

*Defined in [evm/interpreter.ts:36](https://github.com/ethereumjs/ethereumjs-vm/blob/5938d6a/lib/evm/interpreter.ts#L36)*

Contains the results from running the code, if any, as described in [runCode](../classes/vm.md#runcode)

___

