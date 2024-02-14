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
| `value` | `Uint8Array` |

#### Overrides

Node.constructor

#### Defined in

[packages/trie/src/node/extension.ts:8](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/node/extension.ts#L8)

## Properties

### \_nibbles

• **\_nibbles**: [`Nibbles`](../README.md#nibbles)

#### Inherited from

Node.\_nibbles

#### Defined in

[packages/trie/src/node/node.ts:9](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/node/node.ts#L9)

___

### \_terminator

• **\_terminator**: `boolean`

#### Inherited from

Node.\_terminator

#### Defined in

[packages/trie/src/node/node.ts:11](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/node/node.ts#L11)

___

### \_value

• **\_value**: `Uint8Array`

#### Inherited from

Node.\_value

#### Defined in

[packages/trie/src/node/node.ts:10](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/node/node.ts#L10)

## Methods

### encodedKey

▸ **encodedKey**(): [`Nibbles`](../README.md#nibbles)

#### Returns

[`Nibbles`](../README.md#nibbles)

#### Inherited from

Node.encodedKey

#### Defined in

[packages/trie/src/node/node.ts:43](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/node/node.ts#L43)

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

[packages/trie/src/node/node.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/node/node.ts#L23)

___

### keyLength

▸ **keyLength**(): `number`

#### Returns

`number`

#### Inherited from

Node.keyLength

#### Defined in

[packages/trie/src/node/node.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/node/node.ts#L31)

___

### raw

▸ **raw**(): [`Uint8Array`, `Uint8Array`]

#### Returns

[`Uint8Array`, `Uint8Array`]

#### Inherited from

Node.raw

#### Defined in

[packages/trie/src/node/node.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/node/node.ts#L47)

___

### serialize

▸ **serialize**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

Node.serialize

#### Defined in

[packages/trie/src/node/node.ts:51](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/node/node.ts#L51)

___

### value

▸ **value**(`v?`): `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `v?` | `Uint8Array` |

#### Returns

`Uint8Array`

#### Inherited from

Node.value

#### Defined in

[packages/trie/src/node/node.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/node/node.ts#L35)

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

[packages/trie/src/node/node.ts:19](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/node/node.ts#L19)

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

[packages/trie/src/node/extension.ts:12](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/node/extension.ts#L12)
