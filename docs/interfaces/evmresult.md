[ethereumjs-vm](../README.md) > [EVMResult](../interfaces/evmresult.md)

# Interface: EVMResult

Result of executing a message via the \[\[EVM\]\].

## Hierarchy

**EVMResult**

↳  [RunTxResult](runtxresult.md)

## Index

### Properties

* [createdAddress](evmresult.md#createdaddress)
* [gasUsed](evmresult.md#gasused)
* [vm](evmresult.md#vm)

---

## Properties

<a id="createdaddress"></a>

### `<Optional>` createdAddress

**● createdAddress**: *`Buffer`*

*Defined in [evm/evm.ts:38](https://github.com/ethereumjs/ethereumjs-vm/blob/3e1633c/lib/evm/evm.ts#L38)*

Address of created account durint transaction, if any

___
<a id="gasused"></a>

###  gasUsed

**● gasUsed**: *`BN`*

*Defined in [evm/evm.ts:34](https://github.com/ethereumjs/ethereumjs-vm/blob/3e1633c/lib/evm/evm.ts#L34)*

Amount of gas used by the transaction

___
<a id="vm"></a>

###  vm

**● vm**: *[ExecResult](execresult.md)*

*Defined in [evm/evm.ts:42](https://github.com/ethereumjs/ethereumjs-vm/blob/3e1633c/lib/evm/evm.ts#L42)*

Contains the results from running the code, if any, as described in [runCode](../classes/vm.md#runcode)

___

