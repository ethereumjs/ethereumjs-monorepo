[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / createFeeMarket1559Tx

# Function: createFeeMarket1559Tx()

> **createFeeMarket1559Tx**(`txData`, `opts?`): [`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md)

Defined in: [1559/constructors.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/1559/constructors.ts#L27)

Instantiate an EIP-1559 fee-market transaction from a plain data object.

`chainId` defaults from [TxOptions.common](../interfaces/TxOptions.md#common) when omitted.

## Parameters

### txData

[`FeeMarketEIP1559TxData`](../interfaces/FeeMarketEIP1559TxData.md)

### opts?

[`TxOptions`](../interfaces/TxOptions.md) = `{}`

## Returns

[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md)

## Throws

If fee or value fields overflow or are non-numeric

## Throws

If gas limit or nonce exceed EIP bounds

## Throws

If init code size exceeds EIP-3860 on contract-creation txs
