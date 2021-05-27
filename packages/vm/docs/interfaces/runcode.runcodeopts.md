[@ethereumjs/vm](../README.md) / [runCode](../modules/runcode.md) / RunCodeOpts

# Interface: RunCodeOpts

[runCode](../modules/runcode.md).RunCodeOpts

Options for the [runCode](../classes/index.default.md#runcode) method.

## Table of contents

### Properties

- [address](runcode.runcodeopts.md#address)
- [block](runcode.runcodeopts.md#block)
- [caller](runcode.runcodeopts.md#caller)
- [code](runcode.runcodeopts.md#code)
- [data](runcode.runcodeopts.md#data)
- [depth](runcode.runcodeopts.md#depth)
- [evm](runcode.runcodeopts.md#evm)
- [gasLimit](runcode.runcodeopts.md#gaslimit)
- [gasPrice](runcode.runcodeopts.md#gasprice)
- [isStatic](runcode.runcodeopts.md#isstatic)
- [message](runcode.runcodeopts.md#message)
- [origin](runcode.runcodeopts.md#origin)
- [pc](runcode.runcodeopts.md#pc)
- [selfdestruct](runcode.runcodeopts.md#selfdestruct)
- [txContext](runcode.runcodeopts.md#txcontext)
- [value](runcode.runcodeopts.md#value)

## Properties

### address

• `Optional` **address**: *Address*

The address of the account that is executing this code (`address(this)`). Defaults to the zero address.

Defined in: [runCode.ts:63](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runCode.ts#L63)

___

### block

• `Optional` **block**: *Block*

The `@ethereumjs/block` the `tx` belongs to. If omitted a default blank block will be used.

Defined in: [runCode.ts:28](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runCode.ts#L28)

___

### caller

• `Optional` **caller**: *Address*

The address that ran this code (`msg.sender`). Defaults to the zero address.

Defined in: [runCode.ts:40](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runCode.ts#L40)

___

### code

• `Optional` **code**: *Buffer*

The EVM code to run

Defined in: [runCode.ts:44](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runCode.ts#L44)

___

### data

• `Optional` **data**: *Buffer*

The input data

Defined in: [runCode.ts:48](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runCode.ts#L48)

___

### depth

• `Optional` **depth**: *number*

Defined in: [runCode.ts:57](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runCode.ts#L57)

___

### evm

• `Optional` **evm**: *default*

Defined in: [runCode.ts:29](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runCode.ts#L29)

___

### gasLimit

• `Optional` **gasLimit**: *BN*

Gas limit

Defined in: [runCode.ts:52](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runCode.ts#L52)

___

### gasPrice

• `Optional` **gasPrice**: *BN*

Defined in: [runCode.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runCode.ts#L31)

___

### isStatic

• `Optional` **isStatic**: *boolean*

Defined in: [runCode.ts:58](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runCode.ts#L58)

___

### message

• `Optional` **message**: *default*

Defined in: [runCode.ts:36](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runCode.ts#L36)

___

### origin

• `Optional` **origin**: *Address*

The address where the call originated from. Defaults to the zero address.

Defined in: [runCode.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runCode.ts#L35)

___

### pc

• `Optional` **pc**: *number*

The initial program counter. Defaults to `0`

Defined in: [runCode.ts:67](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runCode.ts#L67)

___

### selfdestruct

• `Optional` **selfdestruct**: *object*

#### Type declaration

Defined in: [runCode.ts:59](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runCode.ts#L59)

___

### txContext

• `Optional` **txContext**: *default*

Defined in: [runCode.ts:30](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runCode.ts#L30)

___

### value

• `Optional` **value**: *BN*

The value in ether that is being sent to `opt.address`. Defaults to `0`

Defined in: [runCode.ts:56](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runCode.ts#L56)
