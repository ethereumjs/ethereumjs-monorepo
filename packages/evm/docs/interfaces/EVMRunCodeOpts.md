[@ethereumjs/evm](../README.md) / EVMRunCodeOpts

# Interface: EVMRunCodeOpts

## Hierarchy

- `EVMRunOpts`

  ↳ **`EVMRunCodeOpts`**

## Table of contents

### Properties

- [blobVersionedHashes](EVMRunCodeOpts.md#blobversionedhashes)
- [block](EVMRunCodeOpts.md#block)
- [caller](EVMRunCodeOpts.md#caller)
- [code](EVMRunCodeOpts.md#code)
- [data](EVMRunCodeOpts.md#data)
- [depth](EVMRunCodeOpts.md#depth)
- [gasLimit](EVMRunCodeOpts.md#gaslimit)
- [gasPrice](EVMRunCodeOpts.md#gasprice)
- [isStatic](EVMRunCodeOpts.md#isstatic)
- [origin](EVMRunCodeOpts.md#origin)
- [pc](EVMRunCodeOpts.md#pc)
- [selfdestruct](EVMRunCodeOpts.md#selfdestruct)
- [to](EVMRunCodeOpts.md#to)
- [value](EVMRunCodeOpts.md#value)

## Properties

### blobVersionedHashes

• `Optional` **blobVersionedHashes**: `Uint8Array`[]

Versioned hashes for each blob in a blob transaction

#### Inherited from

EVMRunOpts.blobVersionedHashes

#### Defined in

[types.ts:83](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L83)

___

### block

• `Optional` **block**: `Block`

The `block` the `tx` belongs to. If omitted a default blank block will be used.

#### Inherited from

EVMRunOpts.block

#### Defined in

[types.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L35)

___

### caller

• `Optional` **caller**: `Address`

The address that ran this code (`msg.sender`). Defaults to the zero address.

#### Inherited from

EVMRunOpts.caller

#### Defined in

[types.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L47)

___

### code

• `Optional` **code**: `Uint8Array`

The EVM code to run.

#### Inherited from

EVMRunOpts.code

#### Defined in

[types.ts:51](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L51)

___

### data

• `Optional` **data**: `Uint8Array`

The input data.

#### Inherited from

EVMRunOpts.data

#### Defined in

[types.ts:55](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L55)

___

### depth

• `Optional` **depth**: `number`

The call depth. Defaults to `0`

#### Inherited from

EVMRunOpts.depth

#### Defined in

[types.ts:67](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L67)

___

### gasLimit

• `Optional` **gasLimit**: `bigint`

The gas limit for the call. Defaults to `16777215` (`0xffffff`)

#### Inherited from

EVMRunOpts.gasLimit

#### Defined in

[types.ts:59](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L59)

___

### gasPrice

• `Optional` **gasPrice**: `bigint`

The gas price for the call. Defaults to `0`

#### Inherited from

EVMRunOpts.gasPrice

#### Defined in

[types.ts:39](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L39)

___

### isStatic

• `Optional` **isStatic**: `boolean`

If the call should be executed statically. Defaults to false.

#### Inherited from

EVMRunOpts.isStatic

#### Defined in

[types.ts:71](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L71)

___

### origin

• `Optional` **origin**: `Address`

The address where the call originated from. Defaults to the zero address.

#### Inherited from

EVMRunOpts.origin

#### Defined in

[types.ts:43](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L43)

___

### pc

• `Optional` **pc**: `number`

#### Defined in

[types.ts:90](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L90)

___

### selfdestruct

• `Optional` **selfdestruct**: `Set`<`string`\>

Addresses to selfdestruct. Defaults to the empty set.

#### Inherited from

EVMRunOpts.selfdestruct

#### Defined in

[types.ts:75](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L75)

___

### to

• `Optional` **to**: `Address`

The address of the account that is executing this code (`address(this)`). Defaults to the zero address.

#### Inherited from

EVMRunOpts.to

#### Defined in

[types.ts:79](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L79)

___

### value

• `Optional` **value**: `bigint`

The value in ether that is being sent to `opts.address`. Defaults to `0`

#### Inherited from

EVMRunOpts.value

#### Defined in

[types.ts:63](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L63)
