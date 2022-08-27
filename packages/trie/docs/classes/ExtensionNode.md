[@ethereumjs/trie](../README.md) / ExtensionNode

# Class: ExtensionNode

## Table of contents

### Constructors

- [constructor](ExtensionNode.md#constructor)

### Properties

- [\_nibbles](ExtensionNode.md#_nibbles)
- [\_value](ExtensionNode.md#_value)

### Accessors

- [key](ExtensionNode.md#key)
- [keyLength](ExtensionNode.md#keylength)
- [value](ExtensionNode.md#value)

### Methods

- [encodedKey](ExtensionNode.md#encodedkey)
- [raw](ExtensionNode.md#raw)
- [serialize](ExtensionNode.md#serialize)
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

#### Defined in

[packages/trie/src/trie/node/extension.ts:13](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/extension.ts#L13)

## Properties

### \_nibbles

• **\_nibbles**: [`Nibbles`](../README.md#nibbles)

#### Defined in

[packages/trie/src/trie/node/extension.ts:10](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/extension.ts#L10)

___

### \_value

• **\_value**: `Buffer`

#### Defined in

[packages/trie/src/trie/node/extension.ts:11](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/extension.ts#L11)

## Accessors

### key

• `get` **key**(): [`Nibbles`](../README.md#nibbles)

#### Returns

[`Nibbles`](../README.md#nibbles)

#### Defined in

[packages/trie/src/trie/node/extension.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/extension.ts#L26)

• `set` **key**(`k`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `k` | [`Nibbles`](../README.md#nibbles) |

#### Returns

`void`

#### Defined in

[packages/trie/src/trie/node/extension.ts:30](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/extension.ts#L30)

___

### keyLength

• `get` **keyLength**(): `number`

#### Returns

`number`

#### Defined in

[packages/trie/src/trie/node/extension.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/extension.ts#L34)

___

### value

• `get` **value**(): `Buffer`

#### Returns

`Buffer`

#### Defined in

[packages/trie/src/trie/node/extension.ts:38](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/extension.ts#L38)

• `set` **value**(`v`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `Buffer` |

#### Returns

`void`

#### Defined in

[packages/trie/src/trie/node/extension.ts:42](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/extension.ts#L42)

## Methods

### encodedKey

▸ **encodedKey**(): [`Nibbles`](../README.md#nibbles)

#### Returns

[`Nibbles`](../README.md#nibbles)

#### Defined in

[packages/trie/src/trie/node/extension.ts:46](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/extension.ts#L46)

___

### raw

▸ **raw**(): [`Buffer`, `Buffer`]

#### Returns

[`Buffer`, `Buffer`]

#### Defined in

[packages/trie/src/trie/node/extension.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/extension.ts#L50)

___

### serialize

▸ **serialize**(): `Buffer`

#### Returns

`Buffer`

#### Defined in

[packages/trie/src/trie/node/extension.ts:54](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/extension.ts#L54)

___

### decodeKey

▸ `Static` **decodeKey**(`key`): [`Nibbles`](../README.md#nibbles)

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | [`Nibbles`](../README.md#nibbles) |

#### Returns

[`Nibbles`](../README.md#nibbles)

#### Defined in

[packages/trie/src/trie/node/extension.ts:22](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/extension.ts#L22)

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

[packages/trie/src/trie/node/extension.ts:18](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/extension.ts#L18)
