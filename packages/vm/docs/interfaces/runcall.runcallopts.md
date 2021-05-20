[@ethereumjs/vm](../README.md) / [runCall](../modules/runcall.md) / RunCallOpts

# Interface: RunCallOpts

[runCall](../modules/runcall.md).RunCallOpts

Options for running a call (or create) operation

## Table of contents

### Properties

- [block](runcall.runcallopts.md#block)
- [caller](runcall.runcallopts.md#caller)
- [code](runcall.runcallopts.md#code)
- [compiled](runcall.runcallopts.md#compiled)
- [data](runcall.runcallopts.md#data)
- [delegatecall](runcall.runcallopts.md#delegatecall)
- [depth](runcall.runcallopts.md#depth)
- [gasLimit](runcall.runcallopts.md#gaslimit)
- [gasPrice](runcall.runcallopts.md#gasprice)
- [origin](runcall.runcallopts.md#origin)
- [salt](runcall.runcallopts.md#salt)
- [selfdestruct](runcall.runcallopts.md#selfdestruct)
- [static](runcall.runcallopts.md#static)
- [to](runcall.runcallopts.md#to)
- [value](runcall.runcallopts.md#value)

## Properties

### block

• `Optional` **block**: *Block*

Defined in: [runCall.ts:12](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runCall.ts#L12)

___

### caller

• `Optional` **caller**: *Address*

Defined in: [runCall.ts:15](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runCall.ts#L15)

___

### code

• `Optional` **code**: *Buffer*

This is for CALLCODE where the code to load is different than the code from the `opts.to` address.

Defined in: [runCall.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runCall.ts#L23)

___

### compiled

• `Optional` **compiled**: *boolean*

Defined in: [runCall.ts:25](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runCall.ts#L25)

___

### data

• `Optional` **data**: *Buffer*

Defined in: [runCall.ts:19](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runCall.ts#L19)

___

### delegatecall

• `Optional` **delegatecall**: *boolean*

Defined in: [runCall.ts:29](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runCall.ts#L29)

___

### depth

• `Optional` **depth**: *number*

Defined in: [runCall.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runCall.ts#L24)

___

### gasLimit

• `Optional` **gasLimit**: *BN*

Defined in: [runCall.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runCall.ts#L16)

___

### gasPrice

• `Optional` **gasPrice**: *BN*

Defined in: [runCall.ts:13](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runCall.ts#L13)

___

### origin

• `Optional` **origin**: *Address*

Defined in: [runCall.ts:14](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runCall.ts#L14)

___

### salt

• `Optional` **salt**: *Buffer*

Defined in: [runCall.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runCall.ts#L27)

___

### selfdestruct

• `Optional` **selfdestruct**: *object*

#### Type declaration

Defined in: [runCall.ts:28](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runCall.ts#L28)

___

### static

• `Optional` **static**: *boolean*

Defined in: [runCall.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runCall.ts#L26)

___

### to

• `Optional` **to**: *Address*

Defined in: [runCall.ts:17](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runCall.ts#L17)

___

### value

• `Optional` **value**: *BN*

Defined in: [runCall.ts:18](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runCall.ts#L18)
