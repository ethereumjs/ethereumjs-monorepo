[@ethereumjs/util](../README.md) / Withdrawal

# Class: Withdrawal

Representation of EIP-4895 withdrawal data

## Table of contents

### Constructors

- [constructor](Withdrawal.md#constructor)

### Properties

- [address](Withdrawal.md#address)
- [amount](Withdrawal.md#amount)
- [index](Withdrawal.md#index)
- [validatorIndex](Withdrawal.md#validatorindex)

### Methods

- [raw](Withdrawal.md#raw)
- [toJSON](Withdrawal.md#tojson)
- [fromValuesArray](Withdrawal.md#fromvaluesarray)
- [fromWithdrawalData](Withdrawal.md#fromwithdrawaldata)
- [toBufferArray](Withdrawal.md#tobufferarray)

## Constructors

### constructor

• **new Withdrawal**(`index`, `validatorIndex`, `address`, `amount`)

This constructor assigns and validates the values.
Use the static factory methods to assist in creating a Withdrawal object from varying data types.

#### Parameters

| Name | Type |
| :------ | :------ |
| `index` | `bigint` |
| `validatorIndex` | `bigint` |
| `address` | [`Address`](Address.md) |
| `amount` | `bigint` |

#### Defined in

[packages/util/src/withdrawal.ts:37](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/withdrawal.ts#L37)

## Properties

### address

• `Readonly` **address**: [`Address`](Address.md)

#### Defined in

[packages/util/src/withdrawal.ts:40](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/withdrawal.ts#L40)

___

### amount

• `Readonly` **amount**: `bigint`

#### Defined in

[packages/util/src/withdrawal.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/withdrawal.ts#L41)

___

### index

• `Readonly` **index**: `bigint`

#### Defined in

[packages/util/src/withdrawal.ts:38](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/withdrawal.ts#L38)

___

### validatorIndex

• `Readonly` **validatorIndex**: `bigint`

#### Defined in

[packages/util/src/withdrawal.ts:39](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/withdrawal.ts#L39)

## Methods

### raw

▸ **raw**(): [`WithdrawalBuffer`](../README.md#withdrawalbuffer)

#### Returns

[`WithdrawalBuffer`](../README.md#withdrawalbuffer)

#### Defined in

[packages/util/src/withdrawal.ts:96](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/withdrawal.ts#L96)

___

### toJSON

▸ **toJSON**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `amount` | `string` |
| `index` | `string` |
| `validatorIndex` | `string` |

#### Defined in

[packages/util/src/withdrawal.ts:100](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/withdrawal.ts#L100)

___

### fromValuesArray

▸ `Static` **fromValuesArray**(`withdrawalArray`): [`Withdrawal`](Withdrawal.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `withdrawalArray` | [`WithdrawalBuffer`](../README.md#withdrawalbuffer) |

#### Returns

[`Withdrawal`](Withdrawal.md)

#### Defined in

[packages/util/src/withdrawal.ts:59](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/withdrawal.ts#L59)

___

### fromWithdrawalData

▸ `Static` **fromWithdrawalData**(`withdrawalData`): [`Withdrawal`](Withdrawal.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `withdrawalData` | [`WithdrawalData`](../README.md#withdrawaldata) |

#### Returns

[`Withdrawal`](Withdrawal.md)

#### Defined in

[packages/util/src/withdrawal.ts:44](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/withdrawal.ts#L44)

___

### toBufferArray

▸ `Static` **toBufferArray**(`withdrawal`): [`WithdrawalBuffer`](../README.md#withdrawalbuffer)

Convert a withdrawal to a buffer array

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `withdrawal` | [`WithdrawalData`](../README.md#withdrawaldata) \| [`Withdrawal`](Withdrawal.md) | the withdrawal to convert |

#### Returns

[`WithdrawalBuffer`](../README.md#withdrawalbuffer)

buffer array of the withdrawal

#### Defined in

[packages/util/src/withdrawal.ts:72](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/withdrawal.ts#L72)
