[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / createEOACode7702Tx

# Function: createEOACode7702Tx()

> **createEOACode7702Tx**(`txData`, `opts?`): [`EOACode7702Tx`](../classes/EOACode7702Tx.md)

Defined in: [7702/constructors.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/7702/constructors.ts#L27)

Instantiate an EIP-7702 EOA-code transaction from a plain data object.

`chainId` defaults from [TxOptions.common](../interfaces/TxOptions.md#common) when omitted.

## Parameters

### txData

[`EOACode7702TxData`](../interfaces/EOACode7702TxData.md)

### opts?

[`TxOptions`](../interfaces/TxOptions.md) = `{}`

## Returns

[`EOACode7702Tx`](../classes/EOACode7702Tx.md)

## Throws

If fee or value fields overflow or are non-numeric

## Throws

If gas limit or nonce exceed EIP bounds

## Throws

If init code size exceeds EIP-3860 on contract-creation txs
