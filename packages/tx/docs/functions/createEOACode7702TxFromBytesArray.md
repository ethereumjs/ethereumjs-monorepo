[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / createEOACode7702TxFromBytesArray

# Function: createEOACode7702TxFromBytesArray()

> **createEOACode7702TxFromBytesArray**(`values`, `opts`): [`EOACode7702Tx`](../classes/EOACode7702Tx.md)

Defined in: [7702/constructors.ts:38](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/7702/constructors.ts#L38)

Create a transaction from an array of byte encoded values ordered according to the devp2p network encoding - format noted below.

Format: `[chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
accessList, signatureYParity, signatureR, signatureS]`

## Parameters

### values

`EOACode7702TxValuesArray`

### opts

[`TxOptions`](../interfaces/TxOptions.md) = `{}`

## Returns

[`EOACode7702Tx`](../classes/EOACode7702Tx.md)
