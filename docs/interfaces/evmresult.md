[ethereumjs-vm](../README.md) > [EVMResult](../interfaces/evmresult.md)

# Interface: EVMResult

Result of executing a message via the \[\[EVM\]\].

## Hierarchy

**EVMResult**

↳  [RunTxResult](runtxresult.md)

## Index

### Properties

* [createdAddress](evmresult.md#createdaddress)
* [execResult](evmresult.md#execresult)
* [gasUsed](evmresult.md#gasused)

---

## Properties

<a id="createdaddress"></a>

### `<Optional>` createdAddress

**● createdAddress**: *`Buffer`*

*Defined in [evm/evm.ts:32](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/evm/evm.ts#L32)*

Address of created account durint transaction, if any

___
<a id="execresult"></a>

###  execResult

**● execResult**: *[ExecResult](execresult.md)*

*Defined in [evm/evm.ts:36](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/evm/evm.ts#L36)*

Contains the results from running the code, if any, as described in [runCode](../classes/vm.md#runcode)

___
<a id="gasused"></a>

###  gasUsed

**● gasUsed**: *`BN`*

*Defined in [evm/evm.ts:28](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/evm/evm.ts#L28)*

Amount of gas used by the transaction

___

