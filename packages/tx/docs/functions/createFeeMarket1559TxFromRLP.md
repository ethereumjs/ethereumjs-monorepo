[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / createFeeMarket1559TxFromRLP

# Function: createFeeMarket1559TxFromRLP()

> **createFeeMarket1559TxFromRLP**(`serialized`, `opts?`): [`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md)

Defined in: [1559/constructors.ts:96](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/1559/constructors.ts#L96)

Instantiate an EIP-1559 transaction from RLP-serialized bytes.

Format: `0x02 || rlp([chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
accessList, signatureYParity, signatureR, signatureS])`

## Parameters

### serialized

`Uint8Array`

### opts?

[`TxOptions`](../interfaces/TxOptions.md) = `{}`

## Returns

[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md)

## Throws

If the leading type byte is not `0x02`

## Throws

If RLP decode result is not an array

## Throws

If decoded values fail [create1559FeeMarketTxFromBytesArray](create1559FeeMarketTxFromBytesArray.md) checks
