[@ethereumjs/trie](../README.md) / ExtensionNode

# Class: ExtensionNode

## Hierarchy

- `Node`

  ↳ **`ExtensionNode`**

## Table of contents

### Constructors

- [constructor](ExtensionNode.md#constructor)

### Properties

- [\_nibbles](ExtensionNode.md#_nibbles)
- [\_terminator](ExtensionNode.md#_terminator)
- [\_value](ExtensionNode.md#_value)

### Methods

- [encodedKey](ExtensionNode.md#encodedkey)
- [key](ExtensionNode.md#key)
- [keyLength](ExtensionNode.md#keylength)
- [raw](ExtensionNode.md#raw)
- [serialize](ExtensionNode.md#serialize)
- [value](ExtensionNode.md#value)
- [decodeKey](ExtensionNode.md#decodekey)
- [encodeKey](ExtensionNode.md#encodekey)

## Constructors

### constructor

• **new ExtensionNode**(`nibbles`, `value`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `nibbles` | [`Nibbles`](../README.md#nibbles) |
| `value` | `Buffer` |

#### Overrides

Node.constructor

#### Defined in

[packages/trie/src/trie/node/extension.ts:8](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/extension.ts#L8)

## Properties

### \_nibbles

• **\_nibbles**: [`Nibbles`](../README.md#nibbles)

#### Inherited from

Node.\_nibbles

#### Defined in

[packages/trie/src/trie/node/node.ts:10](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/node.ts#L10)

___

### \_terminator

• **\_terminator**: `boolean`

#### Inherited from

Node.\_terminator

#### Defined in

[packages/trie/src/trie/node/node.ts:12](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/node.ts#L12)

___

### \_value

• **\_value**: `Buffer`

#### Inherited from

Node.\_value

#### Defined in

[packages/trie/src/trie/node/node.ts:11](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/node.ts#L11)

## Methods

### encodedKey

▸ **encodedKey**(): [`Nibbles`](../README.md#nibbles)

#### Returns

[`Nibbles`](../README.md#nibbles)

#### Inherited from

Node.encodedKey

#### Defined in

[packages/trie/src/trie/node/node.ts:44](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/node.ts#L44)

___

### key

▸ **key**(`k?`): [`Nibbles`](../README.md#nibbles)

#### Parameters

| Name | Type |
| :------ | :------ |
| `k?` | [`Nibbles`](../README.md#nibbles) |

#### Returns

[`Nibbles`](../README.md#nibbles)

#### Inherited from

Node.key

#### Defined in

[packages/trie/src/trie/node/node.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/node.ts#L24)

___

### keyLength

▸ **keyLength**(): `number`

#### Returns

`number`

#### Inherited from

Node.keyLength

#### Defined in

[packages/trie/src/trie/node/node.ts:32](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/node.ts#L32)

___

### raw

▸ **raw**(): [`Buffer`, `Buffer`]

#### Returns

[`Buffer`, `Buffer`]

#### Inherited from

Node.raw

#### Defined in

[packages/trie/src/trie/node/node.ts:48](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/node.ts#L48)

___

### serialize

▸ **serialize**(): `Buffer`

#### Returns

`Buffer`

#### Inherited from

Node.serialize

#### Defined in

[packages/trie/src/trie/node/node.ts:52](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/node.ts#L52)

___

### value

▸ **value**(`v?`): `Buffer`

#### Parameters

| Name | Type |
| :------ | :------ |
| `v?` | `Buffer` |

#### Returns

`Buffer`

#### Inherited from

Node.value

#### Defined in

[packages/trie/src/trie/node/node.ts:36](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/node.ts#L36)

___

### decodeKey

▸ `Static` **decodeKey**(`key`): [`Nibbles`](../README.md#nibbles)

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | [`Nibbles`](../README.md#nibbles) |

#### Returns

[`Nibbles`](../README.md#nibbles)

#### Inherited from

Node.decodeKey

#### Defined in

[packages/trie/src/trie/node/node.ts:20](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/node.ts#L20)

___

### encodeKey

▸ `Static` **encodeKey**(`key`): [`Nibbles`](../README.md#nibbles)

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | [`Nibbles`](../README.md#nibbles) |

#### Returns

[`Nibbles`](../README.md#nibbles)

#### Defined in

[packages/trie/src/trie/node/extension.ts:12](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/extension.ts#L12)
