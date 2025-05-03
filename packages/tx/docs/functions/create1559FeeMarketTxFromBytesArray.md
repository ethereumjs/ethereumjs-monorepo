[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / create1559FeeMarketTxFromBytesArray

# Function: create1559FeeMarketTxFromBytesArray()

> **create1559FeeMarketTxFromBytesArray**(`values`, `opts`): [`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md)

Defined in: [1559/constructors.ts:38](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/1559/constructors.ts#L38)

Create a transaction from an array of byte encoded values ordered according to the devp2p network encoding - format noted below.

Format: `[chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
accessList, signatureYParity, signatureR, signatureS]`

## Parameters

### values

`FeeMarketEIP1559TxValuesArray`

### opts

[`TxOptions`](../interfaces/TxOptions.md) = `{}`

## Returns

[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md)
