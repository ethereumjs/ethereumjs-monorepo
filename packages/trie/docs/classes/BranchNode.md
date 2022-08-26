[@ethereumjs/trie](../README.md) / BranchNode

# Class: BranchNode

## Table of contents

### Constructors

- [constructor](BranchNode.md#constructor)

### Properties

- [\_branches](BranchNode.md#_branches)
- [\_value](BranchNode.md#_value)

### Accessors

- [value](BranchNode.md#value)

### Methods

- [getBranch](BranchNode.md#getbranch)
- [getChildren](BranchNode.md#getchildren)
- [raw](BranchNode.md#raw)
- [serialize](BranchNode.md#serialize)
- [setBranch](BranchNode.md#setbranch)
- [fromArray](BranchNode.md#fromarray)

## Constructors

### constructor

• **new BranchNode**()

#### Defined in

[packages/trie/src/trie/node/branch.ts:10](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/branch.ts#L10)

## Properties

### \_branches

• **\_branches**: (``null`` \| [`EmbeddedNode`](../README.md#embeddednode))[]

#### Defined in

[packages/trie/src/trie/node/branch.ts:7](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/branch.ts#L7)

___

### \_value

• **\_value**: ``null`` \| `Buffer`

#### Defined in

[packages/trie/src/trie/node/branch.ts:8](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/branch.ts#L8)

## Accessors

### value

• `get` **value**(): ``null`` \| `Buffer`

#### Returns

``null`` \| `Buffer`

#### Defined in

[packages/trie/src/trie/node/branch.ts:22](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/branch.ts#L22)

• `set` **value**(`v`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | ``null`` \| `Buffer` |

#### Returns

`void`

#### Defined in

[packages/trie/src/trie/node/branch.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/branch.ts#L26)

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

[packages/trie/src/trie/node/branch.ts:42](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/branch.ts#L42)

___

### getChildren

▸ **getChildren**(): [`number`, [`EmbeddedNode`](../README.md#embeddednode)][]

#### Returns

[`number`, [`EmbeddedNode`](../README.md#embeddednode)][]

#### Defined in

[packages/trie/src/trie/node/branch.ts:51](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/branch.ts#L51)

___

### raw

▸ **raw**(): (``null`` \| [`EmbeddedNode`](../README.md#embeddednode))[]

#### Returns

(``null`` \| [`EmbeddedNode`](../README.md#embeddednode))[]

#### Defined in

[packages/trie/src/trie/node/branch.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/branch.ts#L34)

___

### serialize

▸ **serialize**(): `Buffer`

#### Returns

`Buffer`

#### Defined in

[packages/trie/src/trie/node/branch.ts:38](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/branch.ts#L38)

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

[packages/trie/src/trie/node/branch.ts:30](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/branch.ts#L30)

___

### fromArray

▸ `Static` **fromArray**(`arr`): [`BranchNode`](BranchNode.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `arr` | `Buffer`[] |

#### Returns

[`BranchNode`](BranchNode.md)

#### Defined in

[packages/trie/src/trie/node/branch.ts:15](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/branch.ts#L15)
