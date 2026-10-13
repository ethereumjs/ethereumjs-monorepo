[**@ethereumjs/mpt**](../README.md)

***

[@ethereumjs/mpt](../README.md) / BranchMPTNode

# Class: BranchMPTNode

Defined in: [node/branch.ts:6](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/node/branch.ts#L6)

16-way branch MPT node with optional terminal value.

## Constructors

### Constructor

> **new BranchMPTNode**(): `BranchMPTNode`

Defined in: [node/branch.ts:10](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/node/branch.ts#L10)

#### Returns

`BranchMPTNode`

## Properties

### \_branches

> **\_branches**: [`BranchMPTNodeBranchValue`](../type-aliases/BranchMPTNodeBranchValue.md)[]

Defined in: [node/branch.ts:7](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/node/branch.ts#L7)

***

### \_value

> **\_value**: `Uint8Array`\<`ArrayBufferLike`\> \| `null`

Defined in: [node/branch.ts:8](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/node/branch.ts#L8)

## Methods

### getBranch()

> **getBranch**(`i`): [`BranchMPTNodeBranchValue`](../type-aliases/BranchMPTNodeBranchValue.md)

Defined in: [node/branch.ts:42](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/node/branch.ts#L42)

#### Parameters

##### i

`number`

#### Returns

[`BranchMPTNodeBranchValue`](../type-aliases/BranchMPTNodeBranchValue.md)

***

### getChildren()

> **getChildren**(): \[`number`, [`NodeReferenceOrRawMPTNode`](../type-aliases/NodeReferenceOrRawMPTNode.md)\][]

Defined in: [node/branch.ts:51](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/node/branch.ts#L51)

#### Returns

\[`number`, [`NodeReferenceOrRawMPTNode`](../type-aliases/NodeReferenceOrRawMPTNode.md)\][]

***

### raw()

> **raw**(): [`BranchMPTNodeBranchValue`](../type-aliases/BranchMPTNodeBranchValue.md)[]

Defined in: [node/branch.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/node/branch.ts#L34)

#### Returns

[`BranchMPTNodeBranchValue`](../type-aliases/BranchMPTNodeBranchValue.md)[]

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: [node/branch.ts:38](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/node/branch.ts#L38)

#### Returns

`Uint8Array`

***

### setBranch()

> **setBranch**(`i`, `v`): `void`

Defined in: [node/branch.ts:30](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/node/branch.ts#L30)

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

Defined in: [node/branch.ts:22](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/node/branch.ts#L22)

#### Parameters

##### v?

`Uint8Array`\<`ArrayBufferLike`\> \| `null`

#### Returns

`Uint8Array`\<`ArrayBufferLike`\> \| `null`

***

### fromArray()

> `static` **fromArray**(`arr`): `BranchMPTNode`

Defined in: [node/branch.ts:15](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/node/branch.ts#L15)

#### Parameters

##### arr

`Uint8Array`\<`ArrayBufferLike`\>[]

#### Returns

`BranchMPTNode`
