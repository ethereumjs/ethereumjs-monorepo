[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / createEOACode7702TxFromRLP

# Function: createEOACode7702TxFromRLP()

> **createEOACode7702TxFromRLP**(`serialized`, `opts?`): [`EOACode7702Tx`](../classes/EOACode7702Tx.md)

Defined in: [7702/constructors.ts:98](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/7702/constructors.ts#L98)

Instantiate an EIP-7702 transaction from RLP-serialized bytes.

Format: `0x04 || rlp([chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
accessList, authorityList, signatureYParity, signatureR, signatureS])`

## Parameters

### serialized

`Uint8Array`

### opts?

[`TxOptions`](../interfaces/TxOptions.md) = `{}`

## Returns

[`EOACode7702Tx`](../classes/EOACode7702Tx.md)

## Throws

If the leading type byte is not `0x04`

## Throws

If RLP decode result is not an array

## Throws

If decoded values fail [createEOACode7702TxFromBytesArray](createEOACode7702TxFromBytesArray.md) checks
