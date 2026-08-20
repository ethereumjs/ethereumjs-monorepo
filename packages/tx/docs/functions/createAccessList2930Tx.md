[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / createAccessList2930Tx

# Function: createAccessList2930Tx()

> **createAccessList2930Tx**(`txData`, `opts?`): [`AccessList2930Tx`](../classes/AccessList2930Tx.md)

Defined in: [2930/constructors.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/constructors.ts#L27)

Instantiate an EIP-2930 access-list transaction from a plain data object.

`chainId` defaults from [TxOptions.common](../interfaces/TxOptions.md#common) when omitted.

## Parameters

### txData

[`AccessList2930TxData`](../interfaces/AccessList2930TxData.md)

### opts?

[`TxOptions`](../interfaces/TxOptions.md) = `{}`

## Returns

[`AccessList2930Tx`](../classes/AccessList2930Tx.md)

## Throws

If fee or value fields overflow or are non-numeric

## Throws

If gas limit or nonce exceed EIP bounds

## Throws

If init code size exceeds EIP-3860 on contract-creation txs
