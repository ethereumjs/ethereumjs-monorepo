[@ethereumjs/vm](../README.md) › ["runTx"](../modules/_runtx_.md) › [AfterTxEvent](_runtx_.aftertxevent.md)

# Interface: AfterTxEvent

## Hierarchy

  ↳ [RunTxResult](_runtx_.runtxresult.md)

  ↳ **AfterTxEvent**

## Index

### Properties

* [amountSpent](_runtx_.aftertxevent.md#amountspent)
* [bloom](_runtx_.aftertxevent.md#bloom)
* [createdAddress](_runtx_.aftertxevent.md#optional-createdaddress)
* [execResult](_runtx_.aftertxevent.md#execresult)
* [gasRefund](_runtx_.aftertxevent.md#optional-gasrefund)
* [gasUsed](_runtx_.aftertxevent.md#gasused)
* [transaction](_runtx_.aftertxevent.md#transaction)

## Properties

###  amountSpent

• **amountSpent**: *BN*

*Inherited from [RunTxResult](_runtx_.runtxresult.md).[amountSpent](_runtx_.runtxresult.md#amountspent)*

*Defined in [runTx.ts:54](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runTx.ts#L54)*

The amount of ether used by this transaction

___

###  bloom

• **bloom**: *Bloom*

*Inherited from [RunTxResult](_runtx_.runtxresult.md).[bloom](_runtx_.runtxresult.md#bloom)*

*Defined in [runTx.ts:50](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runTx.ts#L50)*

Bloom filter resulted from transaction

___

### `Optional` createdAddress

• **createdAddress**? : *Address*

*Inherited from [RunTxResult](_runtx_.runtxresult.md).[createdAddress](_runtx_.runtxresult.md#optional-createdaddress)*

*Defined in [evm/evm.ts:36](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/evm.ts#L36)*

Address of created account durint transaction, if any

___

###  execResult

• **execResult**: *ExecResult*

*Inherited from [RunTxResult](_runtx_.runtxresult.md).[execResult](_runtx_.runtxresult.md#execresult)*

*Defined in [evm/evm.ts:40](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/evm.ts#L40)*

Contains the results from running the code, if any, as described in [runCode](../classes/_index_.vm.md#runcode)

___

### `Optional` gasRefund

• **gasRefund**? : *BN*

*Inherited from [RunTxResult](_runtx_.runtxresult.md).[gasRefund](_runtx_.runtxresult.md#optional-gasrefund)*

*Defined in [runTx.ts:58](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runTx.ts#L58)*

The amount of gas as that was refunded during the transaction (i.e. `gasUsed = totalGasConsumed - gasRefund`)

___

###  gasUsed

• **gasUsed**: *BN*

*Inherited from [RunTxResult](_runtx_.runtxresult.md).[gasUsed](_runtx_.runtxresult.md#gasused)*

*Defined in [evm/evm.ts:32](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/evm.ts#L32)*

Amount of gas used by the transaction

___

###  transaction

• **transaction**: *Transaction*

*Defined in [runTx.ts:65](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runTx.ts#L65)*

The transaction which just got finished
