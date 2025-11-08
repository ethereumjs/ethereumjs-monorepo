[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / EVMRunCallOpts

# Interface: EVMRunCallOpts

Defined in: [types.ts:111](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L111)

Options for running a call (or create) operation with `EVM.runCall()`

## Extends

- `EVMRunOpts`

## Properties

### accessWitness?

> `optional` **accessWitness**: `BinaryTreeAccessWitnessInterface`

Defined in: [types.ts:142](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L142)

***

### blobVersionedHashes?

> `optional` **blobVersionedHashes**: `` `0x${string}` ``[]

Defined in: [types.ts:98](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L98)

Versioned hashes for each blob in a blob transaction

#### Inherited from

`EVMRunOpts.blobVersionedHashes`

***

### block?

> `optional` **block**: `Block`

Defined in: [types.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L50)

The `block` the `tx` belongs to. If omitted a default blank block will be used.

#### Inherited from

`EVMRunOpts.block`

***

### caller?

> `optional` **caller**: `Address`

Defined in: [types.ts:62](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L62)

The address that ran this code (`msg.sender`). Defaults to the zero address.

#### Inherited from

`EVMRunOpts.caller`

***

### code?

> `optional` **code**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [types.ts:66](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L66)

The EVM code to run.

#### Inherited from

`EVMRunOpts.code`

***

### createdAddresses?

> `optional` **createdAddresses**: `Set`\<`` `0x${string}` ``\>

Defined in: [types.ts:123](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L123)

Created addresses in current context. Used in EIP 6780

***

### data?

> `optional` **data**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [types.ts:70](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L70)

The input data.

#### Inherited from

`EVMRunOpts.data`

***

### delegatecall?

> `optional` **delegatecall**: `boolean`

Defined in: [types.ts:132](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L132)

If the call is a DELEGATECALL. Defaults to false.

***

### depth?

> `optional` **depth**: `number`

Defined in: [types.ts:82](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L82)

The call depth. Defaults to `0`

#### Inherited from

`EVMRunOpts.depth`

***

### gasLimit?

> `optional` **gasLimit**: `bigint`

Defined in: [types.ts:74](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L74)

The gas limit for the call. Defaults to `16777215` (`0xffffff`)

#### Inherited from

`EVMRunOpts.gasLimit`

***

### gasPrice?

> `optional` **gasPrice**: `bigint`

Defined in: [types.ts:54](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L54)

The gas price for the call. Defaults to `0`

#### Inherited from

`EVMRunOpts.gasPrice`

***

### gasRefund?

> `optional` **gasRefund**: `bigint`

Defined in: [types.ts:136](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L136)

Refund counter. Defaults to `0`

***

### isCompiled?

> `optional` **isCompiled**: `boolean`

Defined in: [types.ts:115](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L115)

If the code location is a precompile.

***

### isStatic?

> `optional` **isStatic**: `boolean`

Defined in: [types.ts:86](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L86)

If the call should be executed statically. Defaults to false.

#### Inherited from

`EVMRunOpts.isStatic`

***

### message?

> `optional` **message**: [`Message`](../classes/Message.md)

Defined in: [types.ts:140](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L140)

Optionally pass in an already-built message.

***

### origin?

> `optional` **origin**: `Address`

Defined in: [types.ts:58](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L58)

The address where the call originated from. Defaults to the zero address.

#### Inherited from

`EVMRunOpts.origin`

***

### salt?

> `optional` **salt**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [types.ts:119](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L119)

An optional salt to pass to CREATE2.

***

### selfdestruct?

> `optional` **selfdestruct**: `Set`\<`` `0x${string}` ``\>

Defined in: [types.ts:90](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L90)

Addresses to selfdestruct. Defaults to the empty set.

#### Inherited from

`EVMRunOpts.selfdestruct`

***

### skipBalance?

> `optional` **skipBalance**: `boolean`

Defined in: [types.ts:128](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L128)

Skip balance checks if true. If caller balance is less than message value,
sets balance to message value to ensure execution doesn't fail.

***

### to?

> `optional` **to**: `Address`

Defined in: [types.ts:94](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L94)

The address of the account that is executing this code (`address(this)`). Defaults to the zero address.

#### Inherited from

`EVMRunOpts.to`

***

### value?

> `optional` **value**: `bigint`

Defined in: [types.ts:78](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L78)

The value in ether that is being sent to `opts.address`. Defaults to `0`

#### Inherited from

`EVMRunOpts.value`
