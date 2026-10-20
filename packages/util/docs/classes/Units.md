[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / Units

# Class: Units

Defined in: [packages/util/src/units.ts:32](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/units.ts#L32)

Helpers for converting between ether, gwei, and wei denominations.

## Constructors

### Constructor

> **new Units**(): `Units`

#### Returns

`Units`

## Methods

### ether()

> `static` **ether**(`amount`): `bigint`

Defined in: [packages/util/src/units.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/units.ts#L47)

Convert ether units to wei.

#### Parameters

##### amount

`number` \| `bigint`

#### Returns

`bigint`

#### Throws

If `amount` is negative or a non-integer number

***

### gwei()

> `static` **gwei**(`amount`): `bigint`

Defined in: [packages/util/src/units.ts:57](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/units.ts#L57)

Convert gwei units to wei.

#### Parameters

##### amount

`number` \| `bigint`

#### Returns

`bigint`

#### Throws

If `amount` is negative or a non-integer number

***

### validateInput()

> `static` **validateInput**(`amount`): `void`

Defined in: [packages/util/src/units.ts:33](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/units.ts#L33)

#### Parameters

##### amount

`number` \| `bigint`

#### Returns

`void`
