[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / createLegacyTxFromRLP

# Function: createLegacyTxFromRLP()

> **createLegacyTxFromRLP**(`serialized`, `opts?`): [`LegacyTx`](../classes/LegacyTx.md)

Defined in: [legacy/constructors.ts:68](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/constructors.ts#L68)

Instantiate a legacy transaction from RLP-serialized bytes.

Format: `rlp([nonce, gasPrice, gasLimit, to, value, data, v, r, s])`

## Parameters

### serialized

`Uint8Array`

### opts?

[`TxOptions`](../interfaces/TxOptions.md) = `{}`

## Returns

[`LegacyTx`](../classes/LegacyTx.md)

## Throws

If RLP decode result is not an array

## Throws

If decoded values fail [createLegacyTxFromBytesArray](createLegacyTxFromBytesArray.md) checks
