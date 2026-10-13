[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / create1559FeeMarketTxFromBytesArray

# Function: create1559FeeMarketTxFromBytesArray()

> **create1559FeeMarketTxFromBytesArray**(`values`, `opts?`): [`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md)

Defined in: [1559/constructors.ts:42](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/1559/constructors.ts#L42)

Instantiate an EIP-1559 transaction from devp2p byte-array encoding.

Format: `[chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
accessList, signatureYParity, signatureR, signatureS]`

## Parameters

### values

`FeeMarketEIP1559TxValuesArray`

### opts?

[`TxOptions`](../interfaces/TxOptions.md) = `{}`

## Returns

[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md)

## Throws

If the values array length is not 9 (unsigned) or 12 (signed)

## Throws

If `chainId` or signature fields are nested arrays

## Throws

If numeric fields contain leading zeroes

## Throws

If constructor validation fails (see [createFeeMarket1559Tx](createFeeMarket1559Tx.md))
