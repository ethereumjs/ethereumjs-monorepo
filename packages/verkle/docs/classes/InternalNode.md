[@ethereumjs/verkle](../README.md) / InternalNode

# Class: InternalNode

## Hierarchy

- [`BaseVerkleNode`](BaseVerkleNode.md)<[`Internal`](../enums/VerkleNodeType.md#internal)\>

  ↳ **`InternalNode`**

## Table of contents

### Constructors

- [constructor](InternalNode.md#constructor)

### Properties

- [children](InternalNode.md#children)
- [commitment](InternalNode.md#commitment)
- [copyOnWrite](InternalNode.md#copyonwrite)
- [depth](InternalNode.md#depth)
- [type](InternalNode.md#type)

### Methods

- [commit](InternalNode.md#commit)
- [cowChild](InternalNode.md#cowchild)
- [getChildren](InternalNode.md#getchildren)
- [hash](InternalNode.md#hash)
- [insert](InternalNode.md#insert)
- [insertStem](InternalNode.md#insertstem)
- [raw](InternalNode.md#raw)
- [serialize](InternalNode.md#serialize)
- [setChild](InternalNode.md#setchild)
- [create](InternalNode.md#create)
- [fromRawNode](InternalNode.md#fromrawnode)

## Constructors

### constructor

• **new InternalNode**(`options`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `VerkleInternalNodeOptions` |

#### Overrides

[BaseVerkleNode](BaseVerkleNode.md).[constructor](BaseVerkleNode.md#constructor)

#### Defined in

[node/internalNode.ts:19](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/internalNode.ts#L19)

## Properties

### children

• **children**: (``null`` \| [`VerkleNode`](../README.md#verklenode))[]

#### Defined in

[node/internalNode.ts:14](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/internalNode.ts#L14)

___

### commitment

• **commitment**: [`Point`](../interfaces/Point.md)

#### Inherited from

[BaseVerkleNode](BaseVerkleNode.md).[commitment](BaseVerkleNode.md#commitment)

#### Defined in

[node/baseVerkleNode.ts:8](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/baseVerkleNode.ts#L8)

___

### copyOnWrite

• **copyOnWrite**: `Record`<`string`, [`Point`](../interfaces/Point.md)\>

#### Defined in

[node/internalNode.ts:15](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/internalNode.ts#L15)

___

### depth

• **depth**: `number`

#### Inherited from

[BaseVerkleNode](BaseVerkleNode.md).[depth](BaseVerkleNode.md#depth)

#### Defined in

[node/baseVerkleNode.ts:9](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/baseVerkleNode.ts#L9)

___

### type

• **type**: [`VerkleNodeType`](../enums/VerkleNodeType.md) = `VerkleNodeType.Internal`

#### Defined in

[node/internalNode.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/internalNode.ts#L16)

## Methods

### commit

▸ **commit**(): [`Point`](../interfaces/Point.md)

#### Returns

[`Point`](../interfaces/Point.md)

#### Overrides

[BaseVerkleNode](BaseVerkleNode.md).[commit](BaseVerkleNode.md#commit)

#### Defined in

[node/internalNode.ts:25](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/internalNode.ts#L25)

___

### cowChild

▸ **cowChild**(`_`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `_` | `number` |

#### Returns

`void`

#### Defined in

[node/internalNode.ts:29](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/internalNode.ts#L29)

___

### getChildren

▸ **getChildren**(`index`): ``null`` \| [`VerkleNode`](../README.md#verklenode)

#### Parameters

| Name | Type |
| :------ | :------ |
| `index` | `number` |

#### Returns

``null`` \| [`VerkleNode`](../README.md#verklenode)

#### Defined in

[node/internalNode.ts:63](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/internalNode.ts#L63)

___

### hash

▸ **hash**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

[BaseVerkleNode](BaseVerkleNode.md).[hash](BaseVerkleNode.md#hash)

#### Defined in

[node/baseVerkleNode.ts:19](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/baseVerkleNode.ts#L19)

___

### insert

▸ **insert**(`key`, `value`, `resolver`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `Uint8Array` |
| `value` | `Uint8Array` |
| `resolver` | () => `void` |

#### Returns

`void`

#### Overrides

[BaseVerkleNode](BaseVerkleNode.md).[insert](BaseVerkleNode.md#insert)

#### Defined in

[node/internalNode.ts:67](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/internalNode.ts#L67)

___

### insertStem

▸ **insertStem**(`stem`, `values`, `resolver`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `stem` | `Uint8Array` |
| `values` | `Uint8Array`[] |
| `resolver` | () => `void` |

#### Returns

`void`

#### Defined in

[node/internalNode.ts:73](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/internalNode.ts#L73)

___

### raw

▸ **raw**(): `Uint8Array`[]

#### Returns

`Uint8Array`[]

#### Overrides

[BaseVerkleNode](BaseVerkleNode.md).[raw](BaseVerkleNode.md#raw)

#### Defined in

[node/internalNode.ts:116](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/internalNode.ts#L116)

___

### serialize

▸ **serialize**(): `Uint8Array`

#### Returns

`Uint8Array`

the RLP serialized node

#### Inherited from

[BaseVerkleNode](BaseVerkleNode.md).[serialize](BaseVerkleNode.md#serialize)

#### Defined in

[node/baseVerkleNode.ts:30](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/baseVerkleNode.ts#L30)

___

### setChild

▸ **setChild**(`index`, `child`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `index` | `number` |
| `child` | [`VerkleNode`](../README.md#verklenode) |

#### Returns

`void`

#### Defined in

[node/internalNode.ts:33](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/internalNode.ts#L33)

___

### create

▸ `Static` **create**(`depth`): [`InternalNode`](InternalNode.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `depth` | `number` |

#### Returns

[`InternalNode`](InternalNode.md)

#### Defined in

[node/internalNode.ts:54](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/internalNode.ts#L54)

___

### fromRawNode

▸ `Static` **fromRawNode**(`rawNode`, `depth`): [`InternalNode`](InternalNode.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `rawNode` | `Uint8Array`[] |
| `depth` | `number` |

#### Returns

[`InternalNode`](InternalNode.md)

#### Defined in

[node/internalNode.ts:37](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/internalNode.ts#L37)
