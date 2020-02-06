[merkle-patricia-tree](../README.md) › [LeafNode](leafnode.md)

# Class: LeafNode

## Hierarchy

* **LeafNode**

## Index

### Constructors

* [constructor](leafnode.md#constructor)

### Properties

* [_nibbles](leafnode.md#_nibbles)
* [_value](leafnode.md#_value)

### Accessors

* [key](leafnode.md#key)
* [value](leafnode.md#value)

### Methods

* [encodedKey](leafnode.md#encodedkey)
* [hash](leafnode.md#hash)
* [raw](leafnode.md#raw)
* [serialize](leafnode.md#serialize)
* [decodeKey](leafnode.md#static-decodekey)
* [encodeKey](leafnode.md#static-encodekey)

## Constructors

###  constructor

\+ **new LeafNode**(`nibbles`: [Nibbles](../README.md#nibbles), `value`: Buffer): *[LeafNode](leafnode.md)*

*Defined in [trieNode.ts:151](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/trieNode.ts#L151)*

**Parameters:**

Name | Type |
------ | ------ |
`nibbles` | [Nibbles](../README.md#nibbles) |
`value` | Buffer |

**Returns:** *[LeafNode](leafnode.md)*

## Properties

###  _nibbles

• **_nibbles**: *[Nibbles](../README.md#nibbles)*

*Defined in [trieNode.ts:150](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/trieNode.ts#L150)*

___

###  _value

• **_value**: *Buffer*

*Defined in [trieNode.ts:151](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/trieNode.ts#L151)*

## Accessors

###  key

• **get key**(): *[Nibbles](../README.md#nibbles)*

*Defined in [trieNode.ts:166](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/trieNode.ts#L166)*

**Returns:** *[Nibbles](../README.md#nibbles)*

• **set key**(`k`: [Nibbles](../README.md#nibbles)): *void*

*Defined in [trieNode.ts:170](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/trieNode.ts#L170)*

**Parameters:**

Name | Type |
------ | ------ |
`k` | [Nibbles](../README.md#nibbles) |

**Returns:** *void*

___

###  value

• **get value**(): *Buffer*

*Defined in [trieNode.ts:174](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/trieNode.ts#L174)*

**Returns:** *Buffer*

• **set value**(`v`: Buffer): *void*

*Defined in [trieNode.ts:178](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/trieNode.ts#L178)*

**Parameters:**

Name | Type |
------ | ------ |
`v` | Buffer |

**Returns:** *void*

## Methods

###  encodedKey

▸ **encodedKey**(): *[Nibbles](../README.md#nibbles)*

*Defined in [trieNode.ts:182](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/trieNode.ts#L182)*

**Returns:** *[Nibbles](../README.md#nibbles)*

___

###  hash

▸ **hash**(): *Buffer*

*Defined in [trieNode.ts:194](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/trieNode.ts#L194)*

**Returns:** *Buffer*

___

###  raw

▸ **raw**(): *[Buffer, Buffer]*

*Defined in [trieNode.ts:186](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/trieNode.ts#L186)*

**Returns:** *[Buffer, Buffer]*

___

###  serialize

▸ **serialize**(): *Buffer*

*Defined in [trieNode.ts:190](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/trieNode.ts#L190)*

**Returns:** *Buffer*

___

### `Static` decodeKey

▸ **decodeKey**(`encodedKey`: [Nibbles](../README.md#nibbles)): *[Nibbles](../README.md#nibbles)*

*Defined in [trieNode.ts:162](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/trieNode.ts#L162)*

**Parameters:**

Name | Type |
------ | ------ |
`encodedKey` | [Nibbles](../README.md#nibbles) |

**Returns:** *[Nibbles](../README.md#nibbles)*

___

### `Static` encodeKey

▸ **encodeKey**(`key`: [Nibbles](../README.md#nibbles)): *[Nibbles](../README.md#nibbles)*

*Defined in [trieNode.ts:158](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/trieNode.ts#L158)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | [Nibbles](../README.md#nibbles) |

**Returns:** *[Nibbles](../README.md#nibbles)*
