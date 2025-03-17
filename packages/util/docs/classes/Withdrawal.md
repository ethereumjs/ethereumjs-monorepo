[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / Withdrawal

# Class: Withdrawal

Defined in: [packages/util/src/withdrawal.ts:59](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/withdrawal.ts#L59)

Representation of EIP-4895 withdrawal data

## Constructors

### new Withdrawal()

> **new Withdrawal**(`index`, `validatorIndex`, `address`, `amount`): [`Withdrawal`](Withdrawal.md)

Defined in: [packages/util/src/withdrawal.ts:65](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/withdrawal.ts#L65)

This constructor assigns and validates the values.
Use the static factory methods to assist in creating a Withdrawal object from varying data types.
Its amount is in Gwei to match CL representation and for eventual ssz withdrawalsRoot

#### Parameters

##### index

`bigint`

##### validatorIndex

`bigint`

##### address

[`Address`](Address.md)

##### amount

`bigint`

withdrawal amount in Gwei to match the CL representation and eventually ssz withdrawalsRoot

#### Returns

[`Withdrawal`](Withdrawal.md)

## Properties

### address

> `readonly` **address**: [`Address`](Address.md)

Defined in: [packages/util/src/withdrawal.ts:68](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/withdrawal.ts#L68)

***

### amount

> `readonly` **amount**: `bigint`

Defined in: [packages/util/src/withdrawal.ts:72](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/withdrawal.ts#L72)

withdrawal amount in Gwei to match the CL representation and eventually ssz withdrawalsRoot

***

### index

> `readonly` **index**: `bigint`

Defined in: [packages/util/src/withdrawal.ts:66](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/withdrawal.ts#L66)

***

### validatorIndex

> `readonly` **validatorIndex**: `bigint`

Defined in: [packages/util/src/withdrawal.ts:67](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/withdrawal.ts#L67)

## Methods

### raw()

> **raw**(): [`WithdrawalBytes`](../type-aliases/WithdrawalBytes.md)

Defined in: [packages/util/src/withdrawal.ts:75](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/withdrawal.ts#L75)

#### Returns

[`WithdrawalBytes`](../type-aliases/WithdrawalBytes.md)

***

### toJSON()

> **toJSON**(): `object`

Defined in: [packages/util/src/withdrawal.ts:88](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/withdrawal.ts#L88)

#### Returns

`object`

##### address

> **address**: `` `0x${string}` ``

##### amount

> **amount**: `` `0x${string}` ``

##### index

> **index**: `` `0x${string}` ``

##### validatorIndex

> **validatorIndex**: `` `0x${string}` ``

***

### toValue()

> **toValue**(): `object`

Defined in: [packages/util/src/withdrawal.ts:79](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/withdrawal.ts#L79)

#### Returns

`object`

##### address

> **address**: `Uint8Array`

##### amount

> **amount**: `bigint`

##### index

> **index**: `bigint`

##### validatorIndex

> **validatorIndex**: `bigint`
