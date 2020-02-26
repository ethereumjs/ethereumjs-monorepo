[ethereumjs-vm](../README.md) › ["runCode"](../modules/_runcode_.md) › [RunCodeOpts](_runcode_.runcodeopts.md)

# Interface: RunCodeOpts

Options for the [runCode](../classes/_index_.vm.md#runcode) method.

## Hierarchy

* **RunCodeOpts**

## Index

### Properties

* [address](_runcode_.runcodeopts.md#optional-address)
* [block](_runcode_.runcodeopts.md#optional-block)
* [caller](_runcode_.runcodeopts.md#optional-caller)
* [code](_runcode_.runcodeopts.md#optional-code)
* [data](_runcode_.runcodeopts.md#optional-data)
* [depth](_runcode_.runcodeopts.md#optional-depth)
* [evm](_runcode_.runcodeopts.md#optional-evm)
* [gasLimit](_runcode_.runcodeopts.md#optional-gaslimit)
* [gasPrice](_runcode_.runcodeopts.md#optional-gasprice)
* [isStatic](_runcode_.runcodeopts.md#optional-isstatic)
* [message](_runcode_.runcodeopts.md#optional-message)
* [origin](_runcode_.runcodeopts.md#optional-origin)
* [pc](_runcode_.runcodeopts.md#optional-pc)
* [selfdestruct](_runcode_.runcodeopts.md#optional-selfdestruct)
* [txContext](_runcode_.runcodeopts.md#optional-txcontext)
* [value](_runcode_.runcodeopts.md#optional-value)

## Properties

### `Optional` address

• **address**? : *Buffer*

*Defined in [runCode.ts:63](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runCode.ts#L63)*

The address of the account that is executing this code. The address should be a `Buffer` of bytes. Defaults to `0`

___

### `Optional` block

• **block**? : *any*

*Defined in [runCode.ts:28](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runCode.ts#L28)*

The [`Block`](https://github.com/ethereumjs/ethereumjs-block) the `tx` belongs to. If omitted a blank block will be used

___

### `Optional` caller

• **caller**? : *Buffer*

*Defined in [runCode.ts:40](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runCode.ts#L40)*

The address that ran this code. The address should be a `Buffer` of 20 bits. Defaults to `0`

___

### `Optional` code

• **code**? : *Buffer*

*Defined in [runCode.ts:44](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runCode.ts#L44)*

The EVM code to run

___

### `Optional` data

• **data**? : *Buffer*

*Defined in [runCode.ts:48](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runCode.ts#L48)*

The input data

___

### `Optional` depth

• **depth**? : *undefined | number*

*Defined in [runCode.ts:57](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runCode.ts#L57)*

___

### `Optional` evm

• **evm**? : *EVM*

*Defined in [runCode.ts:29](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runCode.ts#L29)*

___

### `Optional` gasLimit

• **gasLimit**? : *Buffer*

*Defined in [runCode.ts:52](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runCode.ts#L52)*

Gas limit

___

### `Optional` gasPrice

• **gasPrice**? : *Buffer*

*Defined in [runCode.ts:31](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runCode.ts#L31)*

___

### `Optional` isStatic

• **isStatic**? : *undefined | false | true*

*Defined in [runCode.ts:58](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runCode.ts#L58)*

___

### `Optional` message

• **message**? : *Message*

*Defined in [runCode.ts:36](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runCode.ts#L36)*

___

### `Optional` origin

• **origin**? : *Buffer*

*Defined in [runCode.ts:35](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runCode.ts#L35)*

The address where the call originated from. The address should be a `Buffer` of 20 bits. Defaults to `0`

___

### `Optional` pc

• **pc**? : *undefined | number*

*Defined in [runCode.ts:67](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runCode.ts#L67)*

The initial program counter. Defaults to `0`

___

### `Optional` selfdestruct

• **selfdestruct**? : *undefined | object*

*Defined in [runCode.ts:59](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runCode.ts#L59)*

___

### `Optional` txContext

• **txContext**? : *TxContext*

*Defined in [runCode.ts:30](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runCode.ts#L30)*

___

### `Optional` value

• **value**? : *Buffer*

*Defined in [runCode.ts:56](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runCode.ts#L56)*

The value in ether that is being sent to `opt.address`. Defaults to `0`
