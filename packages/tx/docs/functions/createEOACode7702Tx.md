[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / createEOACode7702Tx

# Function: createEOACode7702Tx()

> **createEOACode7702Tx**(`txData`, `opts`): [`EOACode7702Tx`](../classes/EOACode7702Tx.md)

Defined in: [7702/constructors.ts:22](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/7702/constructors.ts#L22)

Instantiate a transaction from a data dictionary.

Format: { chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
accessList, v, r, s }

Notes:
- `chainId` will be set automatically if not provided
- All parameters are optional and have some basic default values

## Parameters

### txData

[`EOACode7702TxData`](../interfaces/EOACode7702TxData.md)

### opts

[`TxOptions`](../interfaces/TxOptions.md) = `{}`

## Returns

[`EOACode7702Tx`](../classes/EOACode7702Tx.md)
