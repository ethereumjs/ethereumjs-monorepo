[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / Units

# Class: Units

Defined in: [packages/util/src/units.ts:24](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/units.ts#L24)

## Constructors

### new Units()

> **new Units**(): [`Units`](Units.md)

#### Returns

[`Units`](Units.md)

## Methods

### ether()

> `static` **ether**(`amount`): `bigint`

Defined in: [packages/util/src/units.ts:40](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/units.ts#L40)

Convert a number or bigint input of ether to wei

#### Parameters

##### amount

amount of units of ether to convert to wei

`number` | `bigint`

#### Returns

`bigint`

amount of units in wei

***

### gwei()

> `static` **gwei**(`amount`): `bigint`

Defined in: [packages/util/src/units.ts:51](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/units.ts#L51)

Convert a number or bigint input of gwei to wei

#### Parameters

##### amount

amount of units of gwei to convert to wei

`number` | `bigint`

#### Returns

`bigint`

amount of units in wei

***

### validateInput()

> `static` **validateInput**(`amount`): `void`

Defined in: [packages/util/src/units.ts:25](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/units.ts#L25)

#### Parameters

##### amount

`number` | `bigint`

#### Returns

`void`
