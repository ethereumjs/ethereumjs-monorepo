[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / createEOACode7702TxFromBytesArray

# Function: createEOACode7702TxFromBytesArray()

> **createEOACode7702TxFromBytesArray**(`values`, `opts?`): [`EOACode7702Tx`](../classes/EOACode7702Tx.md)

Defined in: [7702/constructors.ts:42](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/7702/constructors.ts#L42)

Instantiate an EIP-7702 transaction from devp2p byte-array encoding.

Format: `[chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
accessList, authorityList, signatureYParity, signatureR, signatureS]`

## Parameters

### values

`EOACode7702TxValuesArray`

### opts?

[`TxOptions`](../interfaces/TxOptions.md) = `{}`

## Returns

[`EOACode7702Tx`](../classes/EOACode7702Tx.md)

## Throws

If the values array length is not 10 (unsigned) or 13 (signed)

## Throws

If `chainId` or signature fields are nested arrays

## Throws

If numeric fields contain leading zeroes

## Throws

If constructor validation fails (see [createEOACode7702Tx](createEOACode7702Tx.md))
