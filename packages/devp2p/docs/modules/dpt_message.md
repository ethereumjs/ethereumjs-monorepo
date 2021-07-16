[@ethereumjs/devp2p](../README.md) / dpt/message

# Module: dpt/message

## Table of contents

### Functions

- [decode](dpt_message.md#decode)
- [encode](dpt_message.md#encode)

## Functions

### decode

▸ **decode**(`buffer`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `buffer` | `Buffer` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `data` | `any` |
| `publicKey` | `Buffer` |
| `typename` | `string` \| `number` |

#### Defined in

[packages/devp2p/src/dpt/message.ts:181](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/message.ts#L181)

___

### encode

▸ **encode**<T\>(`typename`, `data`, `privateKey`): `Buffer`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `typename` | `string` |
| `data` | `T` |
| `privateKey` | `Buffer` |

#### Returns

`Buffer`

#### Defined in

[packages/devp2p/src/dpt/message.ts:168](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/message.ts#L168)
