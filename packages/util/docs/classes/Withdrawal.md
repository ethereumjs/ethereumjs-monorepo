[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / Withdrawal

# Class: Withdrawal

Defined in: [packages/util/src/withdrawal.ts:59](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/withdrawal.ts#L59)

Representation of EIP-4895 withdrawal data

## Constructors

### Constructor

> **new Withdrawal**(`index`, `validatorIndex`, `address`, `amount`): `Withdrawal`

Defined in: [packages/util/src/withdrawal.ts:70](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/withdrawal.ts#L70)

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

#### Returns

`Withdrawal`

## Properties

### address

> `readonly` **address**: [`Address`](Address.md)

Defined in: [packages/util/src/withdrawal.ts:62](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/withdrawal.ts#L62)

***

### amount

> `readonly` **amount**: `bigint`

Defined in: [packages/util/src/withdrawal.ts:63](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/withdrawal.ts#L63)

***

### index

> `readonly` **index**: `bigint`

Defined in: [packages/util/src/withdrawal.ts:60](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/withdrawal.ts#L60)

***

### validatorIndex

> `readonly` **validatorIndex**: `bigint`

Defined in: [packages/util/src/withdrawal.ts:61](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/withdrawal.ts#L61)

## Methods

### raw()

> **raw**(): [`WithdrawalBytes`](../type-aliases/WithdrawalBytes.md)

Defined in: [packages/util/src/withdrawal.ts:77](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/withdrawal.ts#L77)

#### Returns

[`WithdrawalBytes`](../type-aliases/WithdrawalBytes.md)

***

### toJSON()

> **toJSON**(): `object`

Defined in: [packages/util/src/withdrawal.ts:90](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/withdrawal.ts#L90)

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

Defined in: [packages/util/src/withdrawal.ts:81](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/withdrawal.ts#L81)

#### Returns

`object`

##### address

> **address**: `Uint8Array`\<`ArrayBufferLike`\>

##### amount

> **amount**: `bigint`

##### index

> **index**: `bigint`

##### validatorIndex

> **validatorIndex**: `bigint`
