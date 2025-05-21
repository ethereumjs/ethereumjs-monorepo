[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / createLegacyTxFromBytesArray

# Function: createLegacyTxFromBytesArray()

> **createLegacyTxFromBytesArray**(`values`, `opts`): [`LegacyTx`](../classes/LegacyTx.md)

Defined in: [legacy/constructors.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/constructors.ts#L26)

Create a transaction from an array of byte encoded values ordered according to the devp2p network encoding - format noted below.

Format: `[nonce, gasPrice, gasLimit, to, value, data, v, r, s]`

## Parameters

### values

`LegacyTxValuesArray`

### opts

[`TxOptions`](../interfaces/TxOptions.md) = `{}`

## Returns

[`LegacyTx`](../classes/LegacyTx.md)
