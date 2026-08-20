[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / formatBigDecimal

# Function: formatBigDecimal()

> **formatBigDecimal**(`numerator`, `denominator`, `maxDecimalFactor`): `string`

Defined in: [packages/util/src/units.ts:14](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/units.ts#L14)

Formats `numerator / denominator` as a fixed-point decimal string.

## Parameters

### numerator

`bigint`

### denominator

`bigint`

### maxDecimalFactor

`bigint`

Power-of-ten scale for fractional digits (e.g. `1000n` → three decimals)

## Returns

`string`
