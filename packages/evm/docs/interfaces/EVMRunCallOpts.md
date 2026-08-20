[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / EVMRunCallOpts

# Interface: EVMRunCallOpts

Defined in: [types.ts:121](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L121)

Options for running a call (or create) operation with `EVM.runCall()`

## Extends

- `EVMRunOpts`

## Properties

### accessWitness?

> `optional` **accessWitness?**: `BinaryTreeAccessWitnessInterface`

Defined in: [types.ts:163](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L163)

***

### blobVersionedHashes?

> `optional` **blobVersionedHashes?**: `` `0x${string}` ``[]

Defined in: [types.ts:105](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L105)

Versioned hashes for each blob in a blob transaction

#### Inherited from

`EVMRunOpts.blobVersionedHashes`

***

### block?

> `optional` **block?**: `Block`

Defined in: [types.ts:57](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L57)

The `block` the `tx` belongs to. If omitted a default blank block will be used.

#### Inherited from

`EVMRunOpts.block`

***

### caller?

> `optional` **caller?**: `Address`

Defined in: [types.ts:69](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L69)

The address that ran this code (`msg.sender`). Defaults to the zero address.

#### Inherited from

`EVMRunOpts.caller`

***

### code?

> `optional` **code?**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [types.ts:73](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L73)

The EVM code to run.

#### Inherited from

`EVMRunOpts.code`

***

### createdAddresses?

> `optional` **createdAddresses?**: `Set`\<`` `0x${string}` ``\>

Defined in: [types.ts:133](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L133)

Created addresses in current context. Used in EIP 6780

***

### data?

> `optional` **data?**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [types.ts:77](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L77)

The input data.

#### Inherited from

`EVMRunOpts.data`

***

### delegatecall?

> `optional` **delegatecall?**: `boolean`

Defined in: [types.ts:153](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L153)

If the call is a DELEGATECALL. Defaults to false.

***

### depth?

> `optional` **depth?**: `number`

Defined in: [types.ts:89](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L89)

The call depth. Defaults to `0`

#### Inherited from

`EVMRunOpts.depth`

***

### gasLimit?

> `optional` **gasLimit?**: `bigint`

Defined in: [types.ts:81](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L81)

The gas limit for the call. Defaults to `16777215` (`0xffffff`)

#### Inherited from

`EVMRunOpts.gasLimit`

***

### gasPrice?

> `optional` **gasPrice?**: `bigint`

Defined in: [types.ts:61](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L61)

The gas price for the call. Defaults to `0`

#### Inherited from

`EVMRunOpts.gasPrice`

***

### gasRefund?

> `optional` **gasRefund?**: `bigint`

Defined in: [types.ts:157](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L157)

Refund counter. Defaults to `0`

***

### isCompiled?

> `optional` **isCompiled?**: `boolean`

Defined in: [types.ts:125](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L125)

If the code location is a precompile.

***

### isStatic?

> `optional` **isStatic?**: `boolean`

Defined in: [types.ts:93](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L93)

If the call should be executed statically. Defaults to false.

#### Inherited from

`EVMRunOpts.isStatic`

***

### message?

> `optional` **message?**: [`Message`](../classes/Message.md)

Defined in: [types.ts:161](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L161)

Optionally pass in an already-built message.

***

### origin?

> `optional` **origin?**: `Address`

Defined in: [types.ts:65](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L65)

The address where the call originated from. Defaults to the zero address.

#### Inherited from

`EVMRunOpts.origin`

***

### salt?

> `optional` **salt?**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [types.ts:129](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L129)

An optional salt to pass to CREATE2.

***

### selfdestruct?

> `optional` **selfdestruct?**: [`SelfdestructMap`](../type-aliases/SelfdestructMap.md)

Defined in: [types.ts:97](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L97)

Selfdestructed addresses mapped to their beneficiary. Defaults to the empty map.

#### Inherited from

`EVMRunOpts.selfdestruct`

***

### skipBalance?

> `optional` **skipBalance?**: `boolean`

Defined in: [types.ts:138](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L138)

Skip balance checks if true. If caller balance is less than message value,
sets balance to message value to ensure execution doesn't fail.

***

### skipNonceIncrement?

> `optional` **skipNonceIncrement?**: `boolean`

Defined in: [types.ts:149](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L149)

If true, do not increment the caller nonce at depth 0. `runTx` increments
the sender nonce before the nested prep checkpoint so a top-frame access
OOG (EIP-2780 / EIP-8037) does not roll it back. Standalone `runCall`
callers should leave this unset.

Distinct from `RunTxOpts.skipNonce`, which skips the nonce *check*.

#### Remarks

Experimental (Amsterdam): may change on patch releases.

***

### to?

> `optional` **to?**: `Address`

Defined in: [types.ts:101](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L101)

The address of the account that is executing this code (`address(this)`). Defaults to the zero address.

#### Inherited from

`EVMRunOpts.to`

***

### value?

> `optional` **value?**: `bigint`

Defined in: [types.ts:85](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L85)

The value in ether that is being sent to `opts.address`. Defaults to `0`

#### Inherited from

`EVMRunOpts.value`
