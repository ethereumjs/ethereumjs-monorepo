[**@ethereumjs/mpt**](../README.md)

***

[@ethereumjs/mpt](../README.md) / LeafMPTNode

# Class: LeafMPTNode

Defined in: [packages/mpt/src/node/leaf.ts:5](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/node/leaf.ts#L5)

## Extends

- `ExtensionOrLeafMPTNodeBase`

## Constructors

### Constructor

> **new LeafMPTNode**(`nibbles`, `value`): `LeafMPTNode`

Defined in: [packages/mpt/src/node/leaf.ts:6](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/node/leaf.ts#L6)

#### Parameters

##### nibbles

[`Nibbles`](../type-aliases/Nibbles.md)

##### value

`Uint8Array`

#### Returns

`LeafMPTNode`

#### Overrides

`ExtensionOrLeafMPTNodeBase.constructor`

## Properties

### \_isLeaf

> **\_isLeaf**: `boolean`

Defined in: [packages/mpt/src/node/extensionOrLeafNodeBase.ts:11](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/node/extensionOrLeafNodeBase.ts#L11)

#### Inherited from

`ExtensionOrLeafMPTNodeBase._isLeaf`

***

### \_nibbles

> **\_nibbles**: [`Nibbles`](../type-aliases/Nibbles.md)

Defined in: [packages/mpt/src/node/extensionOrLeafNodeBase.ts:9](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/node/extensionOrLeafNodeBase.ts#L9)

#### Inherited from

`ExtensionOrLeafMPTNodeBase._nibbles`

***

### \_value

> **\_value**: `Uint8Array`

Defined in: [packages/mpt/src/node/extensionOrLeafNodeBase.ts:10](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/node/extensionOrLeafNodeBase.ts#L10)

#### Inherited from

`ExtensionOrLeafMPTNodeBase._value`

## Methods

### encodedKey()

> **encodedKey**(): [`Nibbles`](../type-aliases/Nibbles.md)

Defined in: [packages/mpt/src/node/extensionOrLeafNodeBase.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/node/extensionOrLeafNodeBase.ts#L23)

#### Returns

[`Nibbles`](../type-aliases/Nibbles.md)

#### Inherited from

`ExtensionOrLeafMPTNodeBase.encodedKey`

***

### key()

> **key**(`k?`): [`Nibbles`](../type-aliases/Nibbles.md)

Defined in: [packages/mpt/src/node/extensionOrLeafNodeBase.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/node/extensionOrLeafNodeBase.ts#L27)

#### Parameters

##### k?

[`Nibbles`](../type-aliases/Nibbles.md)

#### Returns

[`Nibbles`](../type-aliases/Nibbles.md)

#### Inherited from

`ExtensionOrLeafMPTNodeBase.key`

***

### keyLength()

> **keyLength**(): `number`

Defined in: [packages/mpt/src/node/extensionOrLeafNodeBase.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/node/extensionOrLeafNodeBase.ts#L35)

#### Returns

`number`

#### Inherited from

`ExtensionOrLeafMPTNodeBase.keyLength`

***

### raw()

> **raw**(): [`RawLeafMPTNode`](../type-aliases/RawLeafMPTNode.md)

Defined in: [packages/mpt/src/node/leaf.ts:10](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/node/leaf.ts#L10)

#### Returns

[`RawLeafMPTNode`](../type-aliases/RawLeafMPTNode.md)

#### Overrides

`ExtensionOrLeafMPTNodeBase.raw`

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: [packages/mpt/src/node/extensionOrLeafNodeBase.ts:51](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/node/extensionOrLeafNodeBase.ts#L51)

#### Returns

`Uint8Array`

#### Inherited from

`ExtensionOrLeafMPTNodeBase.serialize`

***

### value()

> **value**(`v?`): `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [packages/mpt/src/node/extensionOrLeafNodeBase.ts:39](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/node/extensionOrLeafNodeBase.ts#L39)

#### Parameters

##### v?

`Uint8Array`\<`ArrayBufferLike`\>

#### Returns

`Uint8Array`\<`ArrayBufferLike`\>

#### Inherited from

`ExtensionOrLeafMPTNodeBase.value`

***

### decodeKey()

> `static` **decodeKey**(`key`): [`Nibbles`](../type-aliases/Nibbles.md)

Defined in: [packages/mpt/src/node/extensionOrLeafNodeBase.ts:19](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/node/extensionOrLeafNodeBase.ts#L19)

#### Parameters

##### key

[`Nibbles`](../type-aliases/Nibbles.md)

#### Returns

[`Nibbles`](../type-aliases/Nibbles.md)

#### Inherited from

`ExtensionOrLeafMPTNodeBase.decodeKey`
