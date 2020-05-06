[ethereumjs-vm](../README.md) > [RunTxResult](../interfaces/runtxresult.md)

# Interface: RunTxResult

## Hierarchy

 [EVMResult](evmresult.md)

**↳ RunTxResult**

## Index

### Properties

* [amountSpent](runtxresult.md#amountspent)
* [bloom](runtxresult.md#bloom)
* [createdAddress](runtxresult.md#createdaddress)
* [execResult](runtxresult.md#execresult)
* [gasRefund](runtxresult.md#gasrefund)
* [gasUsed](runtxresult.md#gasused)

---

## Properties

<a id="amountspent"></a>

###  amountSpent

**● amountSpent**: *`BN`*

*Defined in [runTx.ts:46](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/runTx.ts#L46)*

___
<a id="bloom"></a>

###  bloom

**● bloom**: *`Bloom`*

*Defined in [runTx.ts:42](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/runTx.ts#L42)*

___
<a id="createdaddress"></a>

### `<Optional>` createdAddress

**● createdAddress**: *`Buffer`*

*Inherited from [EVMResult](evmresult.md).[createdAddress](evmresult.md#createdaddress)*

*Defined in [evm/evm.ts:32](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/evm/evm.ts#L32)*

___
<a id="execresult"></a>

###  execResult

**● execResult**: *[ExecResult](execresult.md)*

*Inherited from [EVMResult](evmresult.md).[execResult](evmresult.md#execresult)*

*Defined in [evm/evm.ts:36](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/evm/evm.ts#L36)*

___
<a id="gasrefund"></a>

### `<Optional>` gasRefund

**● gasRefund**: *`BN`*

*Defined in [runTx.ts:50](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/runTx.ts#L50)*

___
<a id="gasused"></a>

###  gasUsed

**● gasUsed**: *`BN`*

*Inherited from [EVMResult](evmresult.md).[gasUsed](evmresult.md#gasused)*

*Defined in [evm/evm.ts:28](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/evm/evm.ts#L28)*

___

