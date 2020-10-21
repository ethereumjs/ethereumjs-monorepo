[@ethereumjs/vm](../README.md) › ["lib/runCode"](../modules/_lib_runcode_.md) › [RunCodeOpts](_lib_runcode_.runcodeopts.md)

# Interface: RunCodeOpts

Options for the [runCode](../classes/_lib_index_.vm.md#runcode) method.

## Hierarchy

* **RunCodeOpts**

## Index

### Properties

* [address](_lib_runcode_.runcodeopts.md#optional-address)
* [block](_lib_runcode_.runcodeopts.md#optional-block)
* [caller](_lib_runcode_.runcodeopts.md#optional-caller)
* [code](_lib_runcode_.runcodeopts.md#optional-code)
* [data](_lib_runcode_.runcodeopts.md#optional-data)
* [depth](_lib_runcode_.runcodeopts.md#optional-depth)
* [evm](_lib_runcode_.runcodeopts.md#optional-evm)
* [gasLimit](_lib_runcode_.runcodeopts.md#optional-gaslimit)
* [gasPrice](_lib_runcode_.runcodeopts.md#optional-gasprice)
* [isStatic](_lib_runcode_.runcodeopts.md#optional-isstatic)
* [message](_lib_runcode_.runcodeopts.md#optional-message)
* [origin](_lib_runcode_.runcodeopts.md#optional-origin)
* [pc](_lib_runcode_.runcodeopts.md#optional-pc)
* [selfdestruct](_lib_runcode_.runcodeopts.md#optional-selfdestruct)
* [txContext](_lib_runcode_.runcodeopts.md#optional-txcontext)
* [value](_lib_runcode_.runcodeopts.md#optional-value)

## Properties

### `Optional` address

• **address**? : *Address*

*Defined in [lib/runCode.ts:63](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runCode.ts#L63)*

The address of the account that is executing this code. Defaults to the zero address.

___

### `Optional` block

• **block**? : *Block*

*Defined in [lib/runCode.ts:28](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runCode.ts#L28)*

The [`Block`](https://github.com/ethereumjs/ethereumjs-block) the `tx` belongs to. If omitted a blank block will be used

___

### `Optional` caller

• **caller**? : *Address*

*Defined in [lib/runCode.ts:40](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runCode.ts#L40)*

The address that ran this code. Defaults to the zero address.

___

### `Optional` code

• **code**? : *Buffer*

*Defined in [lib/runCode.ts:44](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runCode.ts#L44)*

The EVM code to run

___

### `Optional` data

• **data**? : *Buffer*

*Defined in [lib/runCode.ts:48](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runCode.ts#L48)*

The input data

___

### `Optional` depth

• **depth**? : *undefined | number*

*Defined in [lib/runCode.ts:57](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runCode.ts#L57)*

___

### `Optional` evm

• **evm**? : *EVM*

*Defined in [lib/runCode.ts:29](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runCode.ts#L29)*

___

### `Optional` gasLimit

• **gasLimit**? : *BN*

*Defined in [lib/runCode.ts:52](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runCode.ts#L52)*

Gas limit

___

### `Optional` gasPrice

• **gasPrice**? : *BN*

*Defined in [lib/runCode.ts:31](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runCode.ts#L31)*

___

### `Optional` isStatic

• **isStatic**? : *undefined | false | true*

*Defined in [lib/runCode.ts:58](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runCode.ts#L58)*

___

### `Optional` message

• **message**? : *Message*

*Defined in [lib/runCode.ts:36](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runCode.ts#L36)*

___

### `Optional` origin

• **origin**? : *Address*

*Defined in [lib/runCode.ts:35](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runCode.ts#L35)*

The address where the call originated from. Defaults to the zero address.

___

### `Optional` pc

• **pc**? : *undefined | number*

*Defined in [lib/runCode.ts:67](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runCode.ts#L67)*

The initial program counter. Defaults to `0`

___

### `Optional` selfdestruct

• **selfdestruct**? : *undefined | object*

*Defined in [lib/runCode.ts:59](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runCode.ts#L59)*

___

### `Optional` txContext

• **txContext**? : *TxContext*

*Defined in [lib/runCode.ts:30](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runCode.ts#L30)*

___

### `Optional` value

• **value**? : *BN*

*Defined in [lib/runCode.ts:56](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runCode.ts#L56)*

The value in ether that is being sent to `opt.address`. Defaults to `0`
