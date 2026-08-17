[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / isAccountOrderOnlyViolation

# Function: isAccountOrderOnlyViolation()

> **isAccountOrderOnlyViolation**(`json`): `boolean`

Defined in: [packages/util/src/bal/validation.ts:96](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bal/validation.ts#L96)

True when accounts are out of lexicographic order in a way that indicates a full reorder
(e.g. `reverse_accounts()`), as opposed to a single appended account breaking sort at the end.

## Parameters

### json

[`BALJSONBlockAccessList`](../type-aliases/BALJSONBlockAccessList.md)

## Returns

`boolean`

## Remarks

Experimental (Amsterdam): may change on patch releases.
