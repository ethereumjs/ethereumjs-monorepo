[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / createLegacyTx

# Function: createLegacyTx()

> **createLegacyTx**(`txData`, `opts?`): [`LegacyTx`](../classes/LegacyTx.md)

Defined in: [legacy/constructors.ts:18](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/constructors.ts#L18)

Instantiate a legacy transaction from a plain data object.

All [LegacyTxData](../type-aliases/LegacyTxData.md) fields are optional; unsigned txs omit `v`/`r`/`s`.

## Parameters

### txData

[`LegacyTxData`](../type-aliases/LegacyTxData.md)

### opts?

[`TxOptions`](../interfaces/TxOptions.md) = `{}`

## Returns

[`LegacyTx`](../classes/LegacyTx.md)

## Throws

If fee or value fields overflow or are non-numeric

## Throws

If gas limit or nonce exceed EIP bounds

## Throws

If init code size exceeds EIP-3860 on contract-creation txs
