[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / createEOACode7702TxFromRLP

# Function: createEOACode7702TxFromRLP()

> **createEOACode7702TxFromRLP**(`serialized`, `opts`): [`EOACode7702Tx`](../classes/EOACode7702Tx.md)

Defined in: [7702/constructors.ts:90](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/7702/constructors.ts#L90)

Instantiate a transaction from a RLP serialized tx.

Format: `0x04 || rlp([chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
accessList, signatureYParity, signatureR, signatureS])`

## Parameters

### serialized

`Uint8Array`

### opts

[`TxOptions`](../interfaces/TxOptions.md) = `{}`

## Returns

[`EOACode7702Tx`](../classes/EOACode7702Tx.md)
