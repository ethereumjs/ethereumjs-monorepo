[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / createFeeMarket1559TxFromRLP

# Function: createFeeMarket1559TxFromRLP()

> **createFeeMarket1559TxFromRLP**(`serialized`, `opts`): [`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md)

Defined in: [1559/constructors.ts:88](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/1559/constructors.ts#L88)

Instantiate a transaction from an RLP serialized tx.

Format: `0x02 || rlp([chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
accessList, signatureYParity, signatureR, signatureS])`

## Parameters

### serialized

`Uint8Array`

### opts

[`TxOptions`](../interfaces/TxOptions.md) = `{}`

## Returns

[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md)
