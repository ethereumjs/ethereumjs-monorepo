[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / EVMRunCallOpts

# Interface: EVMRunCallOpts

Defined in: [types.ts:120](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L120)

Options for running a call (or create) operation with `EVM.runCall()`

## Extends

- `EVMRunOpts`

## Properties

### accessWitness?

> `optional` **accessWitness?**: `BinaryTreeAccessWitnessInterface`

Defined in: [types.ts:162](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L162)

***

### blobVersionedHashes?

> `optional` **blobVersionedHashes?**: `` `0x${string}` ``[]

Defined in: [types.ts:104](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L104)

Versioned hashes for each blob in a blob transaction

#### Inherited from

`EVMRunOpts.blobVersionedHashes`

***

### block?

> `optional` **block?**: `Block`

Defined in: [types.ts:56](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L56)

The `block` the `tx` belongs to. If omitted a default blank block will be used.

#### Inherited from

`EVMRunOpts.block`

***

### caller?

> `optional` **caller?**: [`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

Defined in: [types.ts:68](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L68)

The address that ran this code (`msg.sender`). Defaults to the zero address.

#### Inherited from

`EVMRunOpts.caller`

***

### code?

> `optional` **code?**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [types.ts:72](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L72)

The EVM code to run.

#### Inherited from

`EVMRunOpts.code`

***

### createdAddresses?

> `optional` **createdAddresses?**: `Set`\<`` `0x${string}` ``\>

Defined in: [types.ts:132](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L132)

Created addresses in current context. Used in EIP 6780

***

### data?

> `optional` **data?**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [types.ts:76](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L76)

The input data.

#### Inherited from

`EVMRunOpts.data`

***

### delegatecall?

> `optional` **delegatecall?**: `boolean`

Defined in: [types.ts:152](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L152)

If the call is a DELEGATECALL. Defaults to false.

***

### depth?

> `optional` **depth?**: `number`

Defined in: [types.ts:88](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L88)

The call depth. Defaults to `0`

#### Inherited from

`EVMRunOpts.depth`

***

### gasLimit?

> `optional` **gasLimit?**: `bigint`

Defined in: [types.ts:80](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L80)

The gas limit for the call. Defaults to `16777215` (`0xffffff`)

#### Inherited from

`EVMRunOpts.gasLimit`

***

### gasPrice?

> `optional` **gasPrice?**: `bigint`

Defined in: [types.ts:60](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L60)

The gas price for the call. Defaults to `0`

#### Inherited from

`EVMRunOpts.gasPrice`

***

### gasRefund?

> `optional` **gasRefund?**: `bigint`

Defined in: [types.ts:156](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L156)

Refund counter. Defaults to `0`

***

### isCompiled?

> `optional` **isCompiled?**: `boolean`

Defined in: [types.ts:124](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L124)

If the code location is a precompile.

***

### isStatic?

> `optional` **isStatic?**: `boolean`

Defined in: [types.ts:92](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L92)

If the call should be executed statically. Defaults to false.

#### Inherited from

`EVMRunOpts.isStatic`

***

### message?

> `optional` **message?**: [`Message`](../classes/Message.md)

Defined in: [types.ts:160](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L160)

Optionally pass in an already-built message.

***

### origin?

> `optional` **origin?**: [`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

Defined in: [types.ts:64](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L64)

The address where the call originated from. Defaults to the zero address.

#### Inherited from

`EVMRunOpts.origin`

***

### salt?

> `optional` **salt?**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [types.ts:128](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L128)

An optional salt to pass to CREATE2.

***

### selfdestruct?

> `optional` **selfdestruct?**: [`SelfdestructMap`](../type-aliases/SelfdestructMap.md)

Defined in: [types.ts:96](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L96)

Selfdestructed addresses mapped to their beneficiary. Defaults to the empty map.

#### Inherited from

`EVMRunOpts.selfdestruct`

***

### skipBalance?

> `optional` **skipBalance?**: `boolean`

Defined in: [types.ts:137](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L137)

Skip balance checks if true. If caller balance is less than message value,
sets balance to message value to ensure execution doesn't fail.

***

### skipNonceIncrement?

> `optional` **skipNonceIncrement?**: `boolean`

Defined in: [types.ts:148](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L148)

If true, do not increment the caller nonce at depth 0. `runTx` increments
the sender nonce before the nested prep checkpoint so a top-frame access
OOG (EIP-2780 / EIP-8037) does not roll it back. Standalone `runCall`
callers should leave this unset.

Distinct from `RunTxOpts.skipNonce`, which skips the nonce *check*.

#### Remarks

Experimental (Amsterdam): may change on patch releases.

***

### to?

> `optional` **to?**: [`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

Defined in: [types.ts:100](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L100)

The address of the account that is executing this code (`address(this)`). Defaults to the zero address.

#### Inherited from

`EVMRunOpts.to`

***

### value?

> `optional` **value?**: `bigint`

Defined in: [types.ts:84](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L84)

The value in ether that is being sent to `opts.address`. Defaults to `0`

#### Inherited from

`EVMRunOpts.value`
