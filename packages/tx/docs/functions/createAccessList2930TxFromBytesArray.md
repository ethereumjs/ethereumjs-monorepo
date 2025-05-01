[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / createAccessList2930TxFromBytesArray

# Function: createAccessList2930TxFromBytesArray()

> **createAccessList2930TxFromBytesArray**(`values`, `opts`): [`AccessList2930Tx`](../classes/AccessList2930Tx.md)

Defined in: [2930/constructors.ts:38](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/constructors.ts#L38)

Create a transaction from an array of byte encoded values ordered according to the devp2p network encoding - format noted below.

Format: `[chainId, nonce, gasPrice, gasLimit, to, value, data, accessList,
signatureYParity (v), signatureR (r), signatureS (s)]`

## Parameters

### values

`AccessList2930TxValuesArray`

### opts

[`TxOptions`](../interfaces/TxOptions.md) = `{}`

## Returns

[`AccessList2930Tx`](../classes/AccessList2930Tx.md)
