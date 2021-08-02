[@ethereumjs/vm](../README.md) / [Exports](../modules.md) / [runCall](../modules/runCall.md) / RunCallOpts

# Interface: RunCallOpts

[runCall](../modules/runCall.md).RunCallOpts

Options for running a call (or create) operation

## Table of contents

### Properties

- [block](runCall.RunCallOpts.md#block)
- [caller](runCall.RunCallOpts.md#caller)
- [code](runCall.RunCallOpts.md#code)
- [compiled](runCall.RunCallOpts.md#compiled)
- [data](runCall.RunCallOpts.md#data)
- [delegatecall](runCall.RunCallOpts.md#delegatecall)
- [depth](runCall.RunCallOpts.md#depth)
- [gasLimit](runCall.RunCallOpts.md#gaslimit)
- [gasPrice](runCall.RunCallOpts.md#gasprice)
- [origin](runCall.RunCallOpts.md#origin)
- [salt](runCall.RunCallOpts.md#salt)
- [selfdestruct](runCall.RunCallOpts.md#selfdestruct)
- [static](runCall.RunCallOpts.md#static)
- [to](runCall.RunCallOpts.md#to)
- [value](runCall.RunCallOpts.md#value)

## Properties

### block

• `Optional` **block**: `Block`

#### Defined in

[runCall.ts:12](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runCall.ts#L12)

___

### caller

• `Optional` **caller**: `Address`

#### Defined in

[runCall.ts:15](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runCall.ts#L15)

___

### code

• `Optional` **code**: `Buffer`

This is for CALLCODE where the code to load is different than the code from the `opts.to` address.

#### Defined in

[runCall.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runCall.ts#L23)

___

### compiled

• `Optional` **compiled**: `boolean`

#### Defined in

[runCall.ts:25](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runCall.ts#L25)

___

### data

• `Optional` **data**: `Buffer`

#### Defined in

[runCall.ts:19](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runCall.ts#L19)

___

### delegatecall

• `Optional` **delegatecall**: `boolean`

#### Defined in

[runCall.ts:29](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runCall.ts#L29)

___

### depth

• `Optional` **depth**: `number`

#### Defined in

[runCall.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runCall.ts#L24)

___

### gasLimit

• `Optional` **gasLimit**: `BN`

#### Defined in

[runCall.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runCall.ts#L16)

___

### gasPrice

• `Optional` **gasPrice**: `BN`

#### Defined in

[runCall.ts:13](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runCall.ts#L13)

___

### origin

• `Optional` **origin**: `Address`

#### Defined in

[runCall.ts:14](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runCall.ts#L14)

___

### salt

• `Optional` **salt**: `Buffer`

#### Defined in

[runCall.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runCall.ts#L27)

___

### selfdestruct

• `Optional` **selfdestruct**: `Object`

#### Index signature

▪ [k: `string`]: `boolean`

#### Defined in

[runCall.ts:28](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runCall.ts#L28)

___

### static

• `Optional` **static**: `boolean`

#### Defined in

[runCall.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runCall.ts#L26)

___

### to

• `Optional` **to**: `Address`

#### Defined in

[runCall.ts:17](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runCall.ts#L17)

___

### value

• `Optional` **value**: `BN`

#### Defined in

[runCall.ts:18](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runCall.ts#L18)
