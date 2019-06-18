[ethereumjs-vm](../README.md) > [RunTxResult](../interfaces/runtxresult.md)

# Interface: RunTxResult

Execution result of a transaction

## Hierarchy

 [EVMResult](evmresult.md)

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

*Defined in [runTx.ts:45](https://github.com/ethereumjs/ethereumjs-vm/blob/3e1633c/lib/runTx.ts#L45)*

The amount of ether used by this transaction

___
<a id="bloom"></a>

###  bloom

**● bloom**: *`Bloom`*

*Defined in [runTx.ts:41](https://github.com/ethereumjs/ethereumjs-vm/blob/3e1633c/lib/runTx.ts#L41)*

Bloom filter resulted from transaction

___
<a id="createdaddress"></a>

### `<Optional>` createdAddress

**● createdAddress**: *`Buffer`*

*Inherited from [EVMResult](evmresult.md).[createdAddress](evmresult.md#createdaddress)*

*Defined in [evm/evm.ts:38](https://github.com/ethereumjs/ethereumjs-vm/blob/3e1633c/lib/evm/evm.ts#L38)*

Address of created account durint transaction, if any

___
<a id="gasrefund"></a>

### `<Optional>` gasRefund

**● gasRefund**: *`BN`*

*Defined in [runTx.ts:49](https://github.com/ethereumjs/ethereumjs-vm/blob/3e1633c/lib/runTx.ts#L49)*

The amount of gas as that was refunded during the transaction (i.e. `gasUsed = totalGasConsumed - gasRefund`)

___
<a id="gasused"></a>

###  gasUsed

**● gasUsed**: *`BN`*

*Inherited from [EVMResult](evmresult.md).[gasUsed](evmresult.md#gasused)*

*Defined in [evm/evm.ts:34](https://github.com/ethereumjs/ethereumjs-vm/blob/3e1633c/lib/evm/evm.ts#L34)*

Amount of gas used by the transaction

___
<a id="vm"></a>

###  vm

**● vm**: *[ExecResult](execresult.md)*

*Inherited from [EVMResult](evmresult.md).[vm](evmresult.md#vm)*

*Defined in [evm/evm.ts:42](https://github.com/ethereumjs/ethereumjs-vm/blob/3e1633c/lib/evm/evm.ts#L42)*

Contains the results from running the code, if any, as described in [runCode](../classes/vm.md#runcode)

___

