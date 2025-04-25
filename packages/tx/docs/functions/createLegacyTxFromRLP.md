[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / createLegacyTxFromRLP

# Function: createLegacyTxFromRLP()

> **createLegacyTxFromRLP**(`serialized`, `opts`): [`LegacyTx`](../classes/LegacyTx.md)

Defined in: [legacy/constructors.ts:61](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacy/constructors.ts#L61)

Instantiate a transaction from a RLP serialized tx.

Format: `rlp([nonce, gasPrice, gasLimit, to, value, data,
signatureV, signatureR, signatureS])`

## Parameters

### serialized

`Uint8Array`

### opts

[`TxOptions`](../interfaces/TxOptions.md) = `{}`

## Returns

[`LegacyTx`](../classes/LegacyTx.md)
