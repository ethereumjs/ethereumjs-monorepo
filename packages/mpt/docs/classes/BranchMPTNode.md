[**@ethereumjs/mpt**](../README.md)

***

[@ethereumjs/mpt](../README.md) / BranchMPTNode

# Class: BranchMPTNode

Defined in: [packages/mpt/src/node/branch.ts:5](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/node/branch.ts#L5)

## Constructors

### Constructor

> **new BranchMPTNode**(): `BranchMPTNode`

Defined in: [packages/mpt/src/node/branch.ts:9](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/node/branch.ts#L9)

#### Returns

`BranchMPTNode`

## Properties

### \_branches

> **\_branches**: [`BranchMPTNodeBranchValue`](../type-aliases/BranchMPTNodeBranchValue.md)[]

Defined in: [packages/mpt/src/node/branch.ts:6](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/node/branch.ts#L6)

***

### \_value

> **\_value**: `Uint8Array`\<`ArrayBufferLike`\> \| `null`

Defined in: [packages/mpt/src/node/branch.ts:7](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/node/branch.ts#L7)

## Methods

### getBranch()

> **getBranch**(`i`): [`BranchMPTNodeBranchValue`](../type-aliases/BranchMPTNodeBranchValue.md)

Defined in: [packages/mpt/src/node/branch.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/node/branch.ts#L41)

#### Parameters

##### i

`number`

#### Returns

[`BranchMPTNodeBranchValue`](../type-aliases/BranchMPTNodeBranchValue.md)

***

### getChildren()

> **getChildren**(): \[`number`, [`NodeReferenceOrRawMPTNode`](../type-aliases/NodeReferenceOrRawMPTNode.md)\][]

Defined in: [packages/mpt/src/node/branch.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/node/branch.ts#L50)

#### Returns

\[`number`, [`NodeReferenceOrRawMPTNode`](../type-aliases/NodeReferenceOrRawMPTNode.md)\][]

***

### raw()

> **raw**(): [`BranchMPTNodeBranchValue`](../type-aliases/BranchMPTNodeBranchValue.md)[]

Defined in: [packages/mpt/src/node/branch.ts:33](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/node/branch.ts#L33)

#### Returns

[`BranchMPTNodeBranchValue`](../type-aliases/BranchMPTNodeBranchValue.md)[]

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: [packages/mpt/src/node/branch.ts:37](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/node/branch.ts#L37)

#### Returns

`Uint8Array`

***

### setBranch()

> **setBranch**(`i`, `v`): `void`

Defined in: [packages/mpt/src/node/branch.ts:29](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/node/branch.ts#L29)

#### Parameters

##### i

`number`

##### v

[`BranchMPTNodeBranchValue`](../type-aliases/BranchMPTNodeBranchValue.md)

#### Returns

`void`

***

### value()

> **value**(`v?`): `Uint8Array`\<`ArrayBufferLike`\> \| `null`

Defined in: [packages/mpt/src/node/branch.ts:21](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/node/branch.ts#L21)

#### Parameters

##### v?

`Uint8Array`\<`ArrayBufferLike`\> | `null`

#### Returns

`Uint8Array`\<`ArrayBufferLike`\> \| `null`

***

### fromArray()

> `static` **fromArray**(`arr`): `BranchMPTNode`

Defined in: [packages/mpt/src/node/branch.ts:14](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/node/branch.ts#L14)

#### Parameters

##### arr

`Uint8Array`\<`ArrayBufferLike`\>[]

#### Returns

`BranchMPTNode`
