[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / createAccessList2930TxFromBytesArray

# Function: createAccessList2930TxFromBytesArray()

> **createAccessList2930TxFromBytesArray**(`values`, `opts?`): [`AccessList2930Tx`](../classes/AccessList2930Tx.md)

Defined in: [2930/constructors.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/constructors.ts#L41)

Instantiate an EIP-2930 transaction from devp2p byte-array encoding.

Format: `[chainId, nonce, gasPrice, gasLimit, to, value, data, accessList, v, r, s]`

## Parameters

### values

`AccessList2930TxValuesArray`

### opts?

[`TxOptions`](../interfaces/TxOptions.md) = `{}`

## Returns

[`AccessList2930Tx`](../classes/AccessList2930Tx.md)

## Throws

If the values array length is not 8 (unsigned) or 11 (signed)

## Throws

If `chainId` or signature fields are nested arrays

## Throws

If numeric fields contain leading zeroes

## Throws

If constructor validation fails (see [createAccessList2930Tx](createAccessList2930Tx.md))
