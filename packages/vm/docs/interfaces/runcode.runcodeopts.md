[@ethereumjs/vm](../README.md) / [Exports](../modules.md) / [runCode](../modules/runCode.md) / RunCodeOpts

# Interface: RunCodeOpts

[runCode](../modules/runCode.md).RunCodeOpts

Options for the [runCode](../classes/index.default.md#runcode) method.

## Table of contents

### Properties

- [address](runCode.RunCodeOpts.md#address)
- [block](runCode.RunCodeOpts.md#block)
- [caller](runCode.RunCodeOpts.md#caller)
- [code](runCode.RunCodeOpts.md#code)
- [data](runCode.RunCodeOpts.md#data)
- [depth](runCode.RunCodeOpts.md#depth)
- [evm](runCode.RunCodeOpts.md#evm)
- [gasLimit](runCode.RunCodeOpts.md#gaslimit)
- [gasPrice](runCode.RunCodeOpts.md#gasprice)
- [isStatic](runCode.RunCodeOpts.md#isstatic)
- [message](runCode.RunCodeOpts.md#message)
- [origin](runCode.RunCodeOpts.md#origin)
- [pc](runCode.RunCodeOpts.md#pc)
- [selfdestruct](runCode.RunCodeOpts.md#selfdestruct)
- [txContext](runCode.RunCodeOpts.md#txcontext)
- [value](runCode.RunCodeOpts.md#value)

## Properties

### address

• `Optional` **address**: `Address`

The address of the account that is executing this code (`address(this)`). Defaults to the zero address.

#### Defined in

[runCode.ts:63](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runCode.ts#L63)

___

### block

• `Optional` **block**: `Block`

The `@ethereumjs/block` the `tx` belongs to. If omitted a default blank block will be used.

#### Defined in

[runCode.ts:28](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runCode.ts#L28)

___

### caller

• `Optional` **caller**: `Address`

The address that ran this code (`msg.sender`). Defaults to the zero address.

#### Defined in

[runCode.ts:40](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runCode.ts#L40)

___

### code

• `Optional` **code**: `Buffer`

The EVM code to run

#### Defined in

[runCode.ts:44](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runCode.ts#L44)

___

### data

• `Optional` **data**: `Buffer`

The input data

#### Defined in

[runCode.ts:48](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runCode.ts#L48)

___

### depth

• `Optional` **depth**: `number`

#### Defined in

[runCode.ts:57](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runCode.ts#L57)

___

### evm

• `Optional` **evm**: `default`

#### Defined in

[runCode.ts:29](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runCode.ts#L29)

___

### gasLimit

• `Optional` **gasLimit**: `BN`

Gas limit

#### Defined in

[runCode.ts:52](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runCode.ts#L52)

___

### gasPrice

• `Optional` **gasPrice**: `BN`

#### Defined in

[runCode.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runCode.ts#L31)

___

### isStatic

• `Optional` **isStatic**: `boolean`

#### Defined in

[runCode.ts:58](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runCode.ts#L58)

___

### message

• `Optional` **message**: `default`

#### Defined in

[runCode.ts:36](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runCode.ts#L36)

___

### origin

• `Optional` **origin**: `Address`

The address where the call originated from. Defaults to the zero address.

#### Defined in

[runCode.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runCode.ts#L35)

___

### pc

• `Optional` **pc**: `number`

The initial program counter. Defaults to `0`

#### Defined in

[runCode.ts:67](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runCode.ts#L67)

___

### selfdestruct

• `Optional` **selfdestruct**: `Object`

#### Index signature

▪ [k: `string`]: `boolean`

#### Defined in

[runCode.ts:59](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runCode.ts#L59)

___

### txContext

• `Optional` **txContext**: `default`

#### Defined in

[runCode.ts:30](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runCode.ts#L30)

___

### value

• `Optional` **value**: `BN`

The value in ether that is being sent to `opt.address`. Defaults to `0`

#### Defined in

[runCode.ts:56](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runCode.ts#L56)
