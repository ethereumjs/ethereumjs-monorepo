[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / EVMRunCodeOpts

# Interface: EVMRunCodeOpts

Defined in: [types.ts:101](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L101)

## Extends

- `EVMRunOpts`

## Properties

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

### data?

> `optional` **data**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [types.ts:70](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L70)

The input data.

#### Inherited from

`EVMRunOpts.data`

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

### isStatic?

> `optional` **isStatic**: `boolean`

Defined in: [types.ts:86](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L86)

If the call should be executed statically. Defaults to false.

#### Inherited from

`EVMRunOpts.isStatic`

***

### origin?

> `optional` **origin**: `Address`

Defined in: [types.ts:58](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L58)

The address where the call originated from. Defaults to the zero address.

#### Inherited from

`EVMRunOpts.origin`

***

### pc?

> `optional` **pc**: `number`

Defined in: [types.ts:105](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L105)

***

### selfdestruct?

> `optional` **selfdestruct**: `Set`\<`` `0x${string}` ``\>

Defined in: [types.ts:90](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L90)

Addresses to selfdestruct. Defaults to the empty set.

#### Inherited from

`EVMRunOpts.selfdestruct`

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
