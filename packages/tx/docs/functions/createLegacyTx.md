[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / createLegacyTx

# Function: createLegacyTx()

> **createLegacyTx**(`txData`, `opts`): [`LegacyTx`](../classes/LegacyTx.md)

Defined in: [legacy/constructors.ts:17](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/constructors.ts#L17)

Instantiate a transaction from a data dictionary.

Format: { nonce, gasPrice, gasLimit, to, value, data, v, r, s }

Notes:
- All parameters are optional and have some basic default values

## Parameters

### txData

[`LegacyTxData`](../type-aliases/LegacyTxData.md)

### opts

[`TxOptions`](../interfaces/TxOptions.md) = `{}`

## Returns

[`LegacyTx`](../classes/LegacyTx.md)
