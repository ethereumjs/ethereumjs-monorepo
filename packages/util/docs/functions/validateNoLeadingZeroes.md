[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / validateNoLeadingZeroes

# Function: validateNoLeadingZeroes()

> **validateNoLeadingZeroes**(`values`): `void`

Defined in: [packages/util/src/bytes.ts:337](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L337)

Checks provided Uint8Array for leading zeroes and throws if found.

Examples:

Valid values: 0x1, 0x, 0x01, 0x1234
Invalid values: 0x0, 0x00, 0x001, 0x0001

Note: This method is useful for validating that RLP encoded integers comply with the rule that all
integer values encoded to RLP must be in the most compact form and contain no leading zero bytes

## Parameters

### values

An object containing string keys and Uint8Array values

## Returns

`void`

## Throws

if any provided value is found to have leading zero bytes
