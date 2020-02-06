[merkle-patricia-tree](../README.md) › [BranchNode](branchnode.md)

# Class: BranchNode

## Hierarchy

* **BranchNode**

## Index

### Constructors

* [constructor](branchnode.md#constructor)

### Properties

* [_branches](branchnode.md#_branches)
* [_value](branchnode.md#_value)

### Accessors

* [value](branchnode.md#value)

### Methods

* [getBranch](branchnode.md#getbranch)
* [getChildren](branchnode.md#getchildren)
* [hash](branchnode.md#hash)
* [raw](branchnode.md#raw)
* [serialize](branchnode.md#serialize)
* [setBranch](branchnode.md#setbranch)
* [fromArray](branchnode.md#static-fromarray)

## Constructors

###  constructor

\+ **new BranchNode**(): *[BranchNode](branchnode.md)*

*Defined in [trieNode.ts:40](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/trieNode.ts#L40)*

**Returns:** *[BranchNode](branchnode.md)*

## Properties

###  _branches

• **_branches**: *null | Buffer‹› | Buffer‹›[][]*

*Defined in [trieNode.ts:39](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/trieNode.ts#L39)*

___

###  _value

• **_value**: *Buffer | null*

*Defined in [trieNode.ts:40](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/trieNode.ts#L40)*

## Accessors

###  value

• **get value**(): *Buffer | null*

*Defined in [trieNode.ts:54](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/trieNode.ts#L54)*

**Returns:** *Buffer | null*

• **set value**(`v`: Buffer | null): *void*

*Defined in [trieNode.ts:58](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/trieNode.ts#L58)*

**Parameters:**

Name | Type |
------ | ------ |
`v` | Buffer &#124; null |

**Returns:** *void*

## Methods

###  getBranch

▸ **getBranch**(`i`: number): *null | Buffer‹› | Buffer‹›[]*

*Defined in [trieNode.ts:78](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/trieNode.ts#L78)*

**Parameters:**

Name | Type |
------ | ------ |
`i` | number |

**Returns:** *null | Buffer‹› | Buffer‹›[]*

___

###  getChildren

▸ **getChildren**(): *[number, [EmbeddedNode](../README.md#embeddednode)][]*

*Defined in [trieNode.ts:87](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/trieNode.ts#L87)*

**Returns:** *[number, [EmbeddedNode](../README.md#embeddednode)][]*

___

###  hash

▸ **hash**(): *Buffer*

*Defined in [trieNode.ts:74](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/trieNode.ts#L74)*

**Returns:** *Buffer*

___

###  raw

▸ **raw**(): *null | Buffer‹› | Buffer‹›[][]*

*Defined in [trieNode.ts:66](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/trieNode.ts#L66)*

**Returns:** *null | Buffer‹› | Buffer‹›[][]*

___

###  serialize

▸ **serialize**(): *Buffer*

*Defined in [trieNode.ts:70](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/trieNode.ts#L70)*

**Returns:** *Buffer*

___

###  setBranch

▸ **setBranch**(`i`: number, `v`: [EmbeddedNode](../README.md#embeddednode) | null): *void*

*Defined in [trieNode.ts:62](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/trieNode.ts#L62)*

**Parameters:**

Name | Type |
------ | ------ |
`i` | number |
`v` | [EmbeddedNode](../README.md#embeddednode) &#124; null |

**Returns:** *void*

___

### `Static` fromArray

▸ **fromArray**(`arr`: Buffer[]): *[BranchNode](branchnode.md)*

*Defined in [trieNode.ts:47](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/trieNode.ts#L47)*

**Parameters:**

Name | Type |
------ | ------ |
`arr` | Buffer[] |

**Returns:** *[BranchNode](branchnode.md)*
