[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / createLegacyTxFromBytesArray

# Function: createLegacyTxFromBytesArray()

> **createLegacyTxFromBytesArray**(`values`, `opts?`): [`LegacyTx`](../classes/LegacyTx.md)

Defined in: [legacy/constructors.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/constructors.ts#L31)

Instantiate a legacy transaction from devp2p byte-array encoding.

Format: `[nonce, gasPrice, gasLimit, to, value, data, v, r, s]`

## Parameters

### values

`LegacyTxValuesArray`

### opts?

[`TxOptions`](../interfaces/TxOptions.md) = `{}`

## Returns

[`LegacyTx`](../classes/LegacyTx.md)

## Throws

If the values array length is not 6 (unsigned) or 9 (signed)

## Throws

If numeric fields contain leading zeroes

## Throws

If constructor validation fails (see [createLegacyTx](createLegacyTx.md))
