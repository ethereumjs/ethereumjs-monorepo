[@ethereumjs/trie](../README.md) / BranchNode

# Class: BranchNode

## Table of contents

### Constructors

- [constructor](BranchNode.md#constructor)

### Properties

- [\_branches](BranchNode.md#_branches)
- [\_value](BranchNode.md#_value)

### Methods

- [getBranch](BranchNode.md#getbranch)
- [getChildren](BranchNode.md#getchildren)
- [raw](BranchNode.md#raw)
- [serialize](BranchNode.md#serialize)
- [setBranch](BranchNode.md#setbranch)
- [value](BranchNode.md#value)
- [fromArray](BranchNode.md#fromarray)

## Constructors

### constructor

• **new BranchNode**()

#### Defined in

[packages/trie/src/node/branch.ts:9](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/node/branch.ts#L9)

## Properties

### \_branches

• **\_branches**: (``null`` \| [`EmbeddedNode`](../README.md#embeddednode))[]

#### Defined in

[packages/trie/src/node/branch.ts:6](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/node/branch.ts#L6)

___

### \_value

• **\_value**: ``null`` \| `Uint8Array`

#### Defined in

[packages/trie/src/node/branch.ts:7](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/node/branch.ts#L7)

## Methods

### getBranch

▸ **getBranch**(`i`): ``null`` \| [`EmbeddedNode`](../README.md#embeddednode)

#### Parameters

| Name | Type |
| :------ | :------ |
| `i` | `number` |

#### Returns

``null`` \| [`EmbeddedNode`](../README.md#embeddednode)

#### Defined in

[packages/trie/src/node/branch.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/node/branch.ts#L41)

___

### getChildren

▸ **getChildren**(): [`number`, [`EmbeddedNode`](../README.md#embeddednode)][]

#### Returns

[`number`, [`EmbeddedNode`](../README.md#embeddednode)][]

#### Defined in

[packages/trie/src/node/branch.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/node/branch.ts#L50)

___

### raw

▸ **raw**(): (``null`` \| [`EmbeddedNode`](../README.md#embeddednode))[]

#### Returns

(``null`` \| [`EmbeddedNode`](../README.md#embeddednode))[]

#### Defined in

[packages/trie/src/node/branch.ts:33](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/node/branch.ts#L33)

___

### serialize

▸ **serialize**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Defined in

[packages/trie/src/node/branch.ts:37](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/node/branch.ts#L37)

___

### setBranch

▸ **setBranch**(`i`, `v`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `i` | `number` |
| `v` | ``null`` \| [`EmbeddedNode`](../README.md#embeddednode) |

#### Returns

`void`

#### Defined in

[packages/trie/src/node/branch.ts:29](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/node/branch.ts#L29)

___

### value

▸ **value**(`v?`): ``null`` \| `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `v?` | ``null`` \| `Uint8Array` |

#### Returns

``null`` \| `Uint8Array`

#### Defined in

[packages/trie/src/node/branch.ts:21](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/node/branch.ts#L21)

___

### fromArray

▸ `Static` **fromArray**(`arr`): [`BranchNode`](BranchNode.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `arr` | `Uint8Array`[] |

#### Returns

[`BranchNode`](BranchNode.md)

#### Defined in

[packages/trie/src/node/branch.ts:14](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/node/branch.ts#L14)
