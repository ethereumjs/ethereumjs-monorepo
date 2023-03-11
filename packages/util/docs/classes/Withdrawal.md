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
- [toValue](Withdrawal.md#tovalue)
- [fromValuesArray](Withdrawal.md#fromvaluesarray)
- [fromWithdrawalData](Withdrawal.md#fromwithdrawaldata)
- [toBufferArray](Withdrawal.md#tobufferarray)

## Constructors

### constructor

• **new Withdrawal**(`index`, `validatorIndex`, `address`, `amount`)

This constructor assigns and validates the values.
Use the static factory methods to assist in creating a Withdrawal object from varying data types.
Its amount is in Gwei to match CL representation and for eventual ssz withdrawalsRoot

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `index` | `bigint` | - |
| `validatorIndex` | `bigint` | - |
| `address` | [`Address`](Address.md) | - |
| `amount` | `bigint` | withdrawal amount in Gwei to match the CL repesentation and eventually ssz withdrawalsRoot |

#### Defined in

[packages/util/src/withdrawal.ts:40](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/withdrawal.ts#L40)

## Properties

### address

• `Readonly` **address**: [`Address`](Address.md)

#### Defined in

[packages/util/src/withdrawal.ts:43](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/withdrawal.ts#L43)

___

### amount

• `Readonly` **amount**: `bigint`

withdrawal amount in Gwei to match the CL repesentation and eventually ssz withdrawalsRoot

#### Defined in

[packages/util/src/withdrawal.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/withdrawal.ts#L47)

___

### index

• `Readonly` **index**: `bigint`

#### Defined in

[packages/util/src/withdrawal.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/withdrawal.ts#L41)

___

### validatorIndex

• `Readonly` **validatorIndex**: `bigint`

#### Defined in

[packages/util/src/withdrawal.ts:42](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/withdrawal.ts#L42)

## Methods

### raw

▸ **raw**(): [`WithdrawalBuffer`](../README.md#withdrawalbuffer)

#### Returns

[`WithdrawalBuffer`](../README.md#withdrawalbuffer)

#### Defined in

[packages/util/src/withdrawal.ts:102](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/withdrawal.ts#L102)

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

[packages/util/src/withdrawal.ts:115](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/withdrawal.ts#L115)

___

### toValue

▸ **toValue**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `address` | `Buffer` |
| `amount` | `bigint` |
| `index` | `bigint` |
| `validatorIndex` | `bigint` |

#### Defined in

[packages/util/src/withdrawal.ts:106](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/withdrawal.ts#L106)

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

[packages/util/src/withdrawal.ts:65](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/withdrawal.ts#L65)

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

[packages/util/src/withdrawal.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/withdrawal.ts#L50)

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

[packages/util/src/withdrawal.ts:78](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/withdrawal.ts#L78)
