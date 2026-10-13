[**@ethereumjs/common**](../README.md)

***

[@ethereumjs/common](../README.md) / BinaryTreeStateManagerInterface

# Interface: BinaryTreeStateManagerInterface

Defined in: [interfaces.ts:146](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L146)

Minimal surface of a binary-tree-backed state manager as required for
binary execution witness generation (see `generateBinaryExecutionWitness`
in the `@ethereumjs/evm` package).

`StatefulBinaryTreeStateManager` from `@ethereumjs/statemanager` implements
this interface; custom state managers can implement it to support witness
generation without depending on the concrete class.

The `tree` shape is structural (rather than referencing the `BinaryTree`
class) so that this package does not depend on `@ethereumjs/binarytree`;
`BinaryTree` satisfies it.

## Properties

### tree

> `readonly` **tree**: `object`

Defined in: [interfaces.ts:154](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L154)

The underlying binary tree holding the state.

#### get()

> **get**(`stem`, `suffixes`): `Promise`\<(`Uint8Array`\<`ArrayBufferLike`\> \| `null`)[]\>

Retrieves the values at the given `suffixes` of the node at `stem`.

##### Parameters

###### stem

`Uint8Array`

###### suffixes

`number`[]

##### Returns

`Promise`\<(`Uint8Array`\<`ArrayBufferLike`\> \| `null`)[]\>

#### root()

> **root**(`value?`): `Uint8Array`

Gets (no argument) and/or sets (`Uint8Array` argument) the current root
of the tree.

##### Parameters

###### value?

`Uint8Array`\<`ArrayBufferLike`\> \| `null`

##### Returns

`Uint8Array`

#### withLock()

> **withLock**\<`T`\>(`operation`): `Promise`\<`T`\>

Runs `operation` while holding the tree's internal lock, releasing the
lock when the returned promise settles.

##### Type Parameters

###### T

`T`

##### Parameters

###### operation

() => `Promise`\<`T`\>

##### Returns

`Promise`\<`T`\>

## Methods

### getStateRoot()

> **getStateRoot**(): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [interfaces.ts:150](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L150)

Gets the current state root of the underlying tree.

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>
