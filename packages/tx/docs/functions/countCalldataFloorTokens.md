[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / countCalldataFloorTokens

# Function: countCalldataFloorTokens()

> **countCalldataFloorTokens**(`tx`): `bigint`

Defined in: [util/intrinsic.ts:97](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/util/intrinsic.ts#L97)

EIP-7623 / EIP-7976 / EIP-7981 floor token count.

- Pre-7976: 1 token per zero calldata byte, 4 per non-zero.
- EIP-7976: 4 tokens per calldata byte (zero and non-zero).
- EIP-7981: plus 4 tokens per access-list byte (20 per address + 32 per slot).

## Parameters

### tx

[`LegacyTxInterface`](../interfaces/LegacyTxInterface.md)

## Returns

`bigint`
