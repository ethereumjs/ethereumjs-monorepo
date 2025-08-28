[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / createFeeMarket1559Tx

# Function: createFeeMarket1559Tx()

> **createFeeMarket1559Tx**(`txData`, `opts`): [`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md)

Defined in: [1559/constructors.ts:28](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/1559/constructors.ts#L28)

Instantiate a transaction from a data dictionary.

Format: { chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
accessList, v, r, s }

Notes:
- `chainId` will be set automatically if not provided
- All parameters are optional and have some basic default values

## Parameters

### txData

[`FeeMarketEIP1559TxData`](../interfaces/FeeMarketEIP1559TxData.md)

### opts

[`TxOptions`](../interfaces/TxOptions.md) = `{}`

## Returns

[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md)
