[@ethereumjs/evm](../README.md) / EVMRunCallOpts

# Interface: EVMRunCallOpts

Options for running a call (or create) operation with `EVM.runCall()`

## Hierarchy

- `EVMRunOpts`

  ↳ **`EVMRunCallOpts`**

## Table of contents

### Properties

- [accessWitness](EVMRunCallOpts.md#accesswitness)
- [blobVersionedHashes](EVMRunCallOpts.md#blobversionedhashes)
- [block](EVMRunCallOpts.md#block)
- [caller](EVMRunCallOpts.md#caller)
- [code](EVMRunCallOpts.md#code)
- [createdAddresses](EVMRunCallOpts.md#createdaddresses)
- [data](EVMRunCallOpts.md#data)
- [delegatecall](EVMRunCallOpts.md#delegatecall)
- [depth](EVMRunCallOpts.md#depth)
- [gasLimit](EVMRunCallOpts.md#gaslimit)
- [gasPrice](EVMRunCallOpts.md#gasprice)
- [gasRefund](EVMRunCallOpts.md#gasrefund)
- [isCompiled](EVMRunCallOpts.md#iscompiled)
- [isStatic](EVMRunCallOpts.md#isstatic)
- [message](EVMRunCallOpts.md#message)
- [origin](EVMRunCallOpts.md#origin)
- [salt](EVMRunCallOpts.md#salt)
- [selfdestruct](EVMRunCallOpts.md#selfdestruct)
- [skipBalance](EVMRunCallOpts.md#skipbalance)
- [to](EVMRunCallOpts.md#to)
- [value](EVMRunCallOpts.md#value)

## Properties

### accessWitness

• `Optional` **accessWitness**: `AccessWitness`

#### Defined in

[types.ts:127](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L127)

___

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

### createdAddresses

• `Optional` **createdAddresses**: `Set`<`string`\>

Created addresses in current context. Used in EIP 6780

#### Defined in

[types.ts:108](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L108)

___

### data

• `Optional` **data**: `Uint8Array`

The input data.

#### Inherited from

EVMRunOpts.data

#### Defined in

[types.ts:55](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L55)

___

### delegatecall

• `Optional` **delegatecall**: `boolean`

If the call is a DELEGATECALL. Defaults to false.

#### Defined in

[types.ts:117](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L117)

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

### gasRefund

• `Optional` **gasRefund**: `bigint`

Refund counter. Defaults to `0`

#### Defined in

[types.ts:121](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L121)

___

### isCompiled

• `Optional` **isCompiled**: `boolean`

If the code location is a precompile.

#### Defined in

[types.ts:100](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L100)

___

### isStatic

• `Optional` **isStatic**: `boolean`

If the call should be executed statically. Defaults to false.

#### Inherited from

EVMRunOpts.isStatic

#### Defined in

[types.ts:71](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L71)

___

### message

• `Optional` **message**: [`Message`](../classes/Message.md)

Optionally pass in an already-built message.

#### Defined in

[types.ts:125](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L125)

___

### origin

• `Optional` **origin**: `Address`

The address where the call originated from. Defaults to the zero address.

#### Inherited from

EVMRunOpts.origin

#### Defined in

[types.ts:43](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L43)

___

### salt

• `Optional` **salt**: `Uint8Array`

An optional salt to pass to CREATE2.

#### Defined in

[types.ts:104](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L104)

___

### selfdestruct

• `Optional` **selfdestruct**: `Set`<`string`\>

Addresses to selfdestruct. Defaults to the empty set.

#### Inherited from

EVMRunOpts.selfdestruct

#### Defined in

[types.ts:75](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L75)

___

### skipBalance

• `Optional` **skipBalance**: `boolean`

Skip balance checks if true. If caller balance is less than message value,
sets balance to message value to ensure execution doesn't fail.

#### Defined in

[types.ts:113](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L113)

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
