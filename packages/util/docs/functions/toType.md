[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / toType

# Function: toType()

## Call Signature

> **toType**\<`T`\>(`input`, `outputType`): `null`

Defined in: [packages/util/src/types.ts:83](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/types.ts#L83)

Convert an input to a specified type.
Input of null/undefined returns null/undefined regardless of the output type.

### Type Parameters

#### T

`T` *extends* [`TypeOutput`](../type-aliases/TypeOutput.md)

### Parameters

#### input

`null`

value to convert

#### outputType

`T`

type to output

### Returns

`null`

## Call Signature

> **toType**\<`T`\>(`input`, `outputType`): `undefined`

Defined in: [packages/util/src/types.ts:84](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/types.ts#L84)

Convert an input to a specified type.
Input of null/undefined returns null/undefined regardless of the output type.

### Type Parameters

#### T

`T` *extends* [`TypeOutput`](../type-aliases/TypeOutput.md)

### Parameters

#### input

`undefined`

value to convert

#### outputType

`T`

type to output

### Returns

`undefined`

## Call Signature

> **toType**\<`T`\>(`input`, `outputType`): [`TypeOutputReturnType`](../type-aliases/TypeOutputReturnType.md)\[`T`\]

Defined in: [packages/util/src/types.ts:85](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/types.ts#L85)

Convert an input to a specified type.
Input of null/undefined returns null/undefined regardless of the output type.

### Type Parameters

#### T

`T` *extends* [`TypeOutput`](../type-aliases/TypeOutput.md)

### Parameters

#### input

[`ToBytesInputTypes`](../type-aliases/ToBytesInputTypes.md)

value to convert

#### outputType

`T`

type to output

### Returns

[`TypeOutputReturnType`](../type-aliases/TypeOutputReturnType.md)\[`T`\]
