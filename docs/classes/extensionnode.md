[merkle-patricia-tree](../README.md) › [ExtensionNode](extensionnode.md)

# Class: ExtensionNode

## Hierarchy

* **ExtensionNode**

## Index

### Constructors

* [constructor](extensionnode.md#constructor)

### Properties

* [_nibbles](extensionnode.md#_nibbles)
* [_value](extensionnode.md#_value)

### Accessors

* [key](extensionnode.md#key)
* [value](extensionnode.md#value)

### Methods

* [encodedKey](extensionnode.md#encodedkey)
* [hash](extensionnode.md#hash)
* [raw](extensionnode.md#raw)
* [serialize](extensionnode.md#serialize)
* [decodeKey](extensionnode.md#static-decodekey)
* [encodeKey](extensionnode.md#static-encodekey)

## Constructors

###  constructor

\+ **new ExtensionNode**(`nibbles`: [Nibbles](../README.md#nibbles), `value`: Buffer): *[ExtensionNode](extensionnode.md)*

*Defined in [trieNode.ts:101](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/trieNode.ts#L101)*

**Parameters:**

Name | Type |
------ | ------ |
`nibbles` | [Nibbles](../README.md#nibbles) |
`value` | Buffer |

**Returns:** *[ExtensionNode](extensionnode.md)*

## Properties

###  _nibbles

• **_nibbles**: *[Nibbles](../README.md#nibbles)*

*Defined in [trieNode.ts:100](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/trieNode.ts#L100)*

___

###  _value

• **_value**: *Buffer*

*Defined in [trieNode.ts:101](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/trieNode.ts#L101)*

## Accessors

###  key

• **get key**(): *[Nibbles](../README.md#nibbles)*

*Defined in [trieNode.ts:116](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/trieNode.ts#L116)*

**Returns:** *[Nibbles](../README.md#nibbles)*

• **set key**(`k`: [Nibbles](../README.md#nibbles)): *void*

*Defined in [trieNode.ts:120](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/trieNode.ts#L120)*

**Parameters:**

Name | Type |
------ | ------ |
`k` | [Nibbles](../README.md#nibbles) |

**Returns:** *void*

___

###  value

• **get value**(): *Buffer*

*Defined in [trieNode.ts:124](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/trieNode.ts#L124)*

**Returns:** *Buffer*

• **set value**(`v`: Buffer): *void*

*Defined in [trieNode.ts:128](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/trieNode.ts#L128)*

**Parameters:**

Name | Type |
------ | ------ |
`v` | Buffer |

**Returns:** *void*

## Methods

###  encodedKey

▸ **encodedKey**(): *[Nibbles](../README.md#nibbles)*

*Defined in [trieNode.ts:132](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/trieNode.ts#L132)*

**Returns:** *[Nibbles](../README.md#nibbles)*

___

###  hash

▸ **hash**(): *Buffer*

*Defined in [trieNode.ts:144](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/trieNode.ts#L144)*

**Returns:** *Buffer*

___

###  raw

▸ **raw**(): *[Buffer, Buffer]*

*Defined in [trieNode.ts:136](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/trieNode.ts#L136)*

**Returns:** *[Buffer, Buffer]*

___

###  serialize

▸ **serialize**(): *Buffer*

*Defined in [trieNode.ts:140](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/trieNode.ts#L140)*

**Returns:** *Buffer*

___

### `Static` decodeKey

▸ **decodeKey**(`key`: [Nibbles](../README.md#nibbles)): *[Nibbles](../README.md#nibbles)*

*Defined in [trieNode.ts:112](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/trieNode.ts#L112)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | [Nibbles](../README.md#nibbles) |

**Returns:** *[Nibbles](../README.md#nibbles)*

___

### `Static` encodeKey

▸ **encodeKey**(`key`: [Nibbles](../README.md#nibbles)): *[Nibbles](../README.md#nibbles)*

*Defined in [trieNode.ts:108](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/trieNode.ts#L108)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | [Nibbles](../README.md#nibbles) |

**Returns:** *[Nibbles](../README.md#nibbles)*
